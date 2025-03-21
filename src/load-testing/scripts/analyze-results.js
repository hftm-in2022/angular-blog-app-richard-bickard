/**
 * Skript zur Analyse von JMeter-Testergebnissen
 * Führe aus mit: node analyze-results.js [Ergebnisdatei.jtl]
 */

const fs = require('fs');
const csv = require('csv-parser');
const path = require('path');

// Stelle sicher, dass ein Dateiname übergeben wurde
if (process.argv.length < 3) {
  console.error('Bitte gib den Pfad zur JTL-Ergebnisdatei an.');
  console.error('Beispiel: node analyze-results.js results/results_dev_20230101_120000.jtl');
  process.exit(1);
}

const resultsFile = process.argv[2];

if (!fs.existsSync(resultsFile)) {
  console.error(`Die Datei ${resultsFile} existiert nicht.`);
  process.exit(1);
}

// Metriken initialisieren
const metrics = {
  totalRequests: 0,
  successfulRequests: 0,
  failedRequests: 0,
  minResponseTime: Number.MAX_SAFE_INTEGER,
  maxResponseTime: 0,
  totalResponseTime: 0,
  responseTimeP50: 0,
  responseTimeP90: 0,
  responseTimeP95: 0,
  responseTimeP99: 0,
  startTime: Number.MAX_SAFE_INTEGER,
  endTime: 0,
  samplerMap: new Map(), // Zum Speichern von Metriken pro Sampler-Label
};

// Alle Antwortzeiten für die Perzentilberechnung
const responseTimes = [];

// Datei einlesen und Metriken berechnen
fs.createReadStream(resultsFile)
  .pipe(csv())
  .on('data', (row) => {
    // Konvertieren der String-Werte in Zahlen
    const timestamp = parseInt(row.timeStamp, 10);
    const elapsed = parseInt(row.elapsed, 10);
    const success = row.success === 'true';
    const label = row.label;

    // Sammle grundlegende Metriken
    metrics.totalRequests++;
    if (success) {
      metrics.successfulRequests++;
    } else {
      metrics.failedRequests++;
    }

    // Aktualisiere Antwortzeit-Metriken
    metrics.minResponseTime = Math.min(metrics.minResponseTime, elapsed);
    metrics.maxResponseTime = Math.max(metrics.maxResponseTime, elapsed);
    metrics.totalResponseTime += elapsed;
    responseTimes.push(elapsed);

    // Aktualisiere Start- und Endzeit
    metrics.startTime = Math.min(metrics.startTime, timestamp);
    metrics.endTime = Math.max(metrics.endTime, timestamp);

    // Metriken pro Sampler-Label sammeln
    if (!metrics.samplerMap.has(label)) {
      metrics.samplerMap.set(label, {
        count: 0,
        successCount: 0,
        failureCount: 0,
        minResponseTime: Number.MAX_SAFE_INTEGER,
        maxResponseTime: 0,
        totalResponseTime: 0,
        responseTimes: [],
      });
    }

    const samplerMetrics = metrics.samplerMap.get(label);
    samplerMetrics.count++;
    if (success) {
      samplerMetrics.successCount++;
    } else {
      samplerMetrics.failureCount++;
    }
    samplerMetrics.minResponseTime = Math.min(samplerMetrics.minResponseTime, elapsed);
    samplerMetrics.maxResponseTime = Math.max(samplerMetrics.maxResponseTime, elapsed);
    samplerMetrics.totalResponseTime += elapsed;
    samplerMetrics.responseTimes.push(elapsed);
  })
  .on('end', () => {
    // Berechne abgeleitete Metriken
    const testDurationMs = metrics.endTime - metrics.startTime;
    const avgResponseTime = metrics.totalResponseTime / metrics.totalRequests;
    const successRate = (metrics.successfulRequests / metrics.totalRequests) * 100;
    const throughput = (metrics.totalRequests / (testDurationMs / 1000)).toFixed(2);

    // Sortiere die Antwortzeiten für Perzentilberechnungen
    responseTimes.sort((a, b) => a - b);
    metrics.responseTimeP50 = calculatePercentile(responseTimes, 50);
    metrics.responseTimeP90 = calculatePercentile(responseTimes, 90);
    metrics.responseTimeP95 = calculatePercentile(responseTimes, 95);
    metrics.responseTimeP99 = calculatePercentile(responseTimes, 99);

    // Berechne Metriken pro Sampler
    for (const [label, samplerMetric] of metrics.samplerMap.entries()) {
      const avgTime = samplerMetric.totalResponseTime / samplerMetric.count;
      samplerMetric.avgResponseTime = avgTime.toFixed(2);
      samplerMetric.successRate = ((samplerMetric.successCount / samplerMetric.count) * 100).toFixed(2);
      
      // Perzentile pro Sampler berechnen
      samplerMetric.responseTimes.sort((a, b) => a - b);
      samplerMetric.p50 = calculatePercentile(samplerMetric.responseTimes, 50);
      samplerMetric.p90 = calculatePercentile(samplerMetric.responseTimes, 90);
      samplerMetric.p95 = calculatePercentile(samplerMetric.responseTimes, 95);
      samplerMetric.p99 = calculatePercentile(samplerMetric.responseTimes, 99);
      
      // Entferne die vollständige Liste der Antwortzeiten, um den Speicherbedarf zu reduzieren
      delete samplerMetric.responseTimes;
    }

    // Ergebnisse ausgeben
    printSummary(metrics, testDurationMs, avgResponseTime, successRate, throughput);
    printSamplerMetrics(metrics.samplerMap);

    // Ergebnisse in JSON-Datei speichern
    const outputFile = path.join(
      path.dirname(resultsFile),
      `analysis_${path.basename(resultsFile, '.jtl')}.json`
    );
    
    const outputData = {
      summary: {
        totalRequests: metrics.totalRequests,
        successfulRequests: metrics.successfulRequests,
        failedRequests: metrics.failedRequests,
        errorRate: (100 - successRate).toFixed(2) + '%',
        testDuration: formatDuration(testDurationMs),
        avgResponseTime: avgResponseTime.toFixed(2) + ' ms',
        minResponseTime: metrics.minResponseTime + ' ms',
        maxResponseTime: metrics.maxResponseTime + ' ms',
        responseTimeP50: metrics.responseTimeP50 + ' ms',
        responseTimeP90: metrics.responseTimeP90 + ' ms',
        responseTimeP95: metrics.responseTimeP95 + ' ms',
        responseTimeP99: metrics.responseTimeP99 + ' ms',
        throughput: throughput + ' req/sec',
      },
      samplers: Array.from(metrics.samplerMap.entries()).map(([label, metric]) => ({
        label,
        count: metric.count,
        successRate: metric.successRate + '%',
        avgResponseTime: metric.avgResponseTime + ' ms',
        minResponseTime: metric.minResponseTime + ' ms',
        maxResponseTime: metric.maxResponseTime + ' ms',
        p50: metric.p50 + ' ms',
        p90: metric.p90 + ' ms',
        p95: metric.p95 + ' ms',
        p99: metric.p99 + ' ms',
      })),
    };

    fs.writeFileSync(outputFile, JSON.stringify(outputData, null, 2));
    console.log(`\nDetaillierte Analyse wurde in ${outputFile} gespeichert.`);
  });

/**
 * Berechnet das Perzentil aus einer sortierten Antwortzeiten-Liste
 */
function calculatePercentile(sortedValues, p) {
  if (sortedValues.length === 0) return 0;
  
  const index = Math.ceil((p / 100) * sortedValues.length) - 1;
  return sortedValues[index];
}

/**
 * Formatiert die Testdauer in eine lesbare Form
 */
function formatDuration(durationMs) {
  const seconds = Math.floor(durationMs / 1000);
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return `${minutes}m ${remainingSeconds}s`;
}

/**
 * Gibt eine Zusammenfassung der Testergebnisse aus
 */
function printSummary(metrics, testDurationMs, avgResponseTime, successRate, throughput) {
  console.log('\n========== TEST ZUSAMMENFASSUNG ==========');
  console.log(`Testdauer: ${formatDuration(testDurationMs)}`);
  console.log(`Gesamtanfragen: ${metrics.totalRequests}`);
  console.log(`Erfolgreiche Anfragen: ${metrics.successfulRequests}`);
  console.log(`Fehlgeschlagene Anfragen: ${metrics.failedRequests}`);
  console.log(`Erfolgsrate: ${successRate.toFixed(2)}%`);
  console.log(`Durchsatz: ${throughput} Anfragen/Sekunde`);
  console.log('\n---------- ANTWORTZEITEN ----------');
  console.log(`Durchschnitt: ${avgResponseTime.toFixed(2)} ms`);
  console.log(`Minimum: ${metrics.minResponseTime} ms`);
  console.log(`Maximum: ${metrics.maxResponseTime} ms`);
  console.log(`50. Perzentil: ${metrics.responseTimeP50} ms`);
  console.log(`90. Perzentil: ${metrics.responseTimeP90} ms`);
  console.log(`95. Perzentil: ${metrics.responseTimeP95} ms`);
  console.log(`99. Perzentil: ${metrics.responseTimeP99} ms`);
}

/**
 * Gibt detaillierte Metriken pro Sampler aus
 */
function printSamplerMetrics(samplerMap) {
  console.log('\n========== DETAILS PRO ENDPUNKT ==========');
  
  const samplers = Array.from(samplerMap.entries()).sort((a, b) => {
    // Sortiere nach Anzahl der Anfragen absteigend
    return b[1].count - a[1].count;
  });

  for (const [label, metric] of samplers) {
    console.log(`\n>> ${label}`);
    console.log(`   Anfragen: ${metric.count}`);
    console.log(`   Erfolgsrate: ${metric.successRate}%`);
    console.log(`   Durchschn. Antwortzeit: ${metric.avgResponseTime} ms`);
    console.log(`   Min/Max Antwortzeit: ${metric.minResponseTime}/${metric.maxResponseTime} ms`);
    console.log(`   Perzentile (50/90/95/99): ${metric.p50}/${metric.p90}/${metric.p95}/${metric.p99} ms`);
  }
}