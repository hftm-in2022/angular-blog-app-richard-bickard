# Angular Blog App - Last-Tests mit JMeter und Azure Load Testing

Dieses Projekt ist eine Erweiterung der Angular Blog-Anwendung mit Fokus auf Performance-Testing und Last-Tests. Es nutzt Apache JMeter und Azure Load Testing, um die Leistung der Anwendung unter verschiedenen Belastungsszenarien zu testen und zu analysieren.

## Projektstruktur

Die Hauptkomponenten des Projekts sind:

- **Angular Blog App**: Eine reaktive Angular-Anwendung für die Verwaltung von Blog-Einträgen
- **JMeter-Testpläne**: Definierte Szenarien zum Testen der Anwendung unter Last
- **Azure Load Testing**: Konfiguration für Cloud-basierte Last-Tests
- **Performance-Monitoring**: Komponenten zur Überwachung und Analyse der Anwendungsleistung
- **Docker-Konfiguration**: Container für reproduzierbare Last-Tests

## Inhaltsverzeichnis

1. [Einrichtung und Installation](#einrichtung-und-installation)
2. [Last-Test-Funktionen](#last-test-funktionen)
3. [JMeter-Testplan](#jmeter-testplan)
4. [Azure Load Testing](#azure-load-testing)
5. [Performance-Monitoring](#performance-monitoring)
6. [Docker-Unterstützung](#docker-unterstützung)
7. [CI/CD-Integration](#ci/cd-integration)
8. [Beispiel-Ergebnisse](#beispiel-ergebnisse)

## Einrichtung und Installation

### Voraussetzungen

- Node.js 16 oder höher
- Angular CLI 18 oder höher
- Java 8 oder höher (für JMeter)
- Docker und Docker Compose (optional)
- Azure-Konto (für Azure Load Testing)

### Installation

1. Repository klonen:
   ```bash
   git clone https://github.com/username/angular-blog-app-richard-bickard.git
   cd angular-blog-app-richard-bickard
   ```

2. Abhängigkeiten installieren:
   ```bash
   npm install
   ```

3. Last-Test-Abhängigkeiten installieren:
   ```bash
   # JMeter herunterladen und installieren (wenn nicht Docker verwendet wird)
   # Siehe load-testing/docs/setup-guide.md für detaillierte Anweisungen
   ```

4. Anwendung starten:
   ```bash
   npm start
   ```

## Last-Test-Funktionen

Das Projekt umfasst folgende Last-Test-Funktionen:

- **User Simulation**: Simulation von anonymen und authentifizierten Benutzern
- **Skalierbare Tests**: Tests mit unterschiedlicher Anzahl gleichzeitiger Benutzer (10-100)
- **Realistische Szenarien**: Mischung aus Lese- und Schreibvorgängen
- **Performance-Metriken**: Erfassung von Antwortzeiten, Durchsatz und Fehlerraten
- **Visualisierung**: Dashboards für die Anzeige von Testergebnissen
- **CI/CD-Integration**: Automatisierte Last-Tests in der CI/CD-Pipeline

## JMeter-Testplan

Der JMeter-Testplan (`load-testing/jmeter/blog-app-test-plan.jmx`) definiert folgende Testszenarien:

1. **Anonyme Benutzer**:
   - Homepage besuchen
   - Blog-Einträge abrufen
   - Einzelne Blog-Einträge ansehen

2. **Authentifizierte Benutzer**:
   - Anmelden
   - Blog-Einträge erstellen
   - Blogs liken
   - Kommentare hinzufügen

Jeder Testplan kann mit unterschiedlichen Parametern konfiguriert werden:

- Anzahl der virtuellen Benutzer
- Ramp-up-Zeit
- Testdauer
- API- und Frontend-URLs

### Ausführen von JMeter-Tests

#### Lokal:
```bash
cd load-testing
./scripts/run-local-test.sh dev  # für Entwicklungsumgebung
./scripts/run-local-test.sh test # für Testumgebung
./scripts/run-local-test.sh prod # für Produktionsumgebung
```

#### Mit Docker:
```bash
docker-compose up jmeter
```

## Azure Load Testing

Die Azure Load Testing-Konfiguration (`load-testing/azure/load-test-config.yaml`) ermöglicht das Ausführen von Last-Tests in der Azure-Cloud. Dies bietet folgende Vorteile:

- Skalierbarkeit: Tests mit Tausenden von virtuellen Benutzern
- Geografische Verteilung: Tests aus verschiedenen Regionen
- Detaillierte Metriken und Analysen
- Integration mit Azure Monitor

### Einrichtung von Azure Load Testing:

1. Azure-Ressourcen erstellen:
   ```bash
   az login
   az group create --name LoadTestResourceGroup --location westeurope
   az load create --name BlogAppLoadTest --resource-group LoadTestResourceGroup --location westeurope
   ```

2. Test konfigurieren und ausführen (siehe `load-testing/docs/setup-guide.md` für Details)

## Performance-Monitoring

Das Projekt enthält integrierte Performance-Monitoring-Komponenten:

- **App Insights Integration**: Erfassung von Client-seitigen Telemetriedaten
- **Performance Metrics Service**: Sammlung und Analyse von Frontend-Metriken
- **Performance Dashboard**: Visualisierung von Performance-Daten in Echtzeit
- **HTTP Performance Interceptor**: Überwachung der API-Anfragen und -Antwortzeiten

Um das Performance-Dashboard anzuzeigen, navigieren Sie zu `/performance` in der Anwendung (nur für Administratoren).

## Docker-Unterstützung

Das Projekt bietet Docker-Konfigurationen für die Ausführung von Last-Tests in isolierten Containern:

- **JMeter-Container**: Führt Last-Tests aus
- **InfluxDB-Container**: Speichert Testergebnisse
- **Grafana-Container**: Visualisiert Ergebnisse in Echtzeiten
- **Results-Analyzer-Container**: Analysiert Testergebnisse

Um die gesamte Last-Test-Umgebung zu starten:
```bash
docker-compose up
```

## CI/CD-Integration

Last-Tests sind in die CI/CD-Pipeline integriert:

- **GitHub Actions**: Automatische Ausführung von Last-Tests bei Push auf den Main-Branch
- **Performance Regression Detection**: Erkennung von Performance-Verschlechterungen
- **Test Result Reports**: Automatische Generierung von Test-Berichten

Die Konfiguration befindet sich in `.github/workflows/load-testing.yml`.

## Beispiel-Ergebnisse

Die Beispielergebnisse der Last-Tests zeigen:

- Die Anwendung unterstützt bis zu 100 gleichzeitige Benutzer mit einer durchschnittlichen Antwortzeit von unter 500 ms
- Die Fehlerrate bleibt unter 1% bei normaler Last (bis zu 50 Benutzer)
- Der Durchsatz skaliert linear bis zu 50 Benutzern und beginnt dann abzuflachen
- Die Datenbank-Operationen sind der Hauptengpass bei hoher Last

Detaillierte Ergebnisse und Analysen finden Sie im Verzeichnis `load-testing/reports`.

## Optimierungen basierend auf Last-Tests

Basierend auf den Last-Test-Ergebnissen wurden folgende Optimierungen implementiert:

1. **Frontend-Optimierungen**:
   - Verbesserte Caching-Strategien für API-Anfragen
   - Optimierte Change Detection in Angular-Komponenten
   - Implementierung von virtuellen Listen für große Datenmengen

2. **Backend-Optimierungen** (im Backend-Repository):
   - Verbesserte Datenbankindizes
   - Implementierung von Cache-Layern
   - Optimierte API-Abfragen

## Fazit und weitere Schritte

Die implementierten Last-Tests und Performance-Monitoring-Tools ermöglichen eine kontinuierliche Überwachung und Verbesserung der Anwendungsleistung. Weitere geplante Schritte:

- Automatisierte Performance-Budgets und Benachrichtigungen
- Erweiterte Szenarien für Last-Tests
- Integration von Real User Monitoring (RUM)
- Implementierung von adaptiven Schwellenwerten basierend auf historischen Daten