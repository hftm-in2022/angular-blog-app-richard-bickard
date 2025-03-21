#!/bin/bash
set -e

# Einstellungen aus Umgebungsvariablen
TEST_FILE=${TEST_FILE:-$TEST_PLAN}
PROPERTIES_FILE=${PROPERTIES_FILE:-$ENV_PROPERTIES}
USERS=${USERS:-50}
RAMP_UP=${RAMP_UP:-30}
DURATION=${DURATION:-300}
BASE_URL=${BASE_URL:-https://purple-water-0bc4adf03.azurestaticapps.net}
API_URL=${API_URL:-https://d-cap-blog-backend---v2.whitepond-b96fee4b.westeurope.azurecontainerapps.io}

# Zeitstempel für Ergebnisdateien
TIMESTAMP=$(date +%Y%m%d_%H%M%S)
RESULT_FILE="results_${TIMESTAMP}.jtl"
LOG_FILE="jmeter_${TIMESTAMP}.log"

# Ausgabe der Testparameter
echo "=== JMeter Last-Test Konfiguration ==="
echo "Test-Plan: $TEST_FILE"
echo "Properties-Datei: $PROPERTIES_FILE"
echo "Benutzer: $USERS"
echo "Hochlaufzeit: $RAMP_UP Sekunden"
echo "Testdauer: $DURATION Sekunden"
echo "Frontend-URL: $BASE_URL"
echo "API-URL: $API_URL"
echo "==================================="

# JMeter ausführen
jmeter -n \
  -t /jmeter/test-files/$TEST_FILE \
  -p /jmeter/test-files/$PROPERTIES_FILE \
  -l /jmeter/results/$RESULT_FILE \
  -j /jmeter/results/$LOG_FILE \
  -e -o /jmeter/results/report_${TIMESTAMP} \
  -Jusers=$USERS \
  -Jramp_up=$RAMP_UP \
  -Jduration=$DURATION \
  -Jbase_url=$BASE_URL \
  -Japi_url=$API_URL

echo "=== Test abgeschlossen ==="
echo "Ergebnisse wurden in /jmeter/results gespeichert."
echo "JTL-Datei: $RESULT_FILE"
echo "Log-Datei: $LOG_FILE"
echo "HTML-Bericht: report_${TIMESTAMP}/index.html"