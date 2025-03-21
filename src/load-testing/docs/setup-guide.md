# Einrichtungsleitfaden für Last-Tests

Diese Anleitung beschreibt, wie Sie die Last-Test-Umgebung für die Angular-Blog-Anwendung einrichten und verwenden. Die Last-Tests wurden mit Apache JMeter und Azure Load Testing implementiert.

## Inhaltsverzeichnis

1. [Voraussetzungen](#voraussetzungen)
2. [JMeter-Installation](#jmeter-installation)
3. [Lokale Last-Tests](#lokale-last-tests)
4. [Azure Load Testing einrichten](#azure-load-testing-einrichten)
5. [CI/CD-Integration](#ci/cd-integration)
6. [Testdaten konfigurieren](#testdaten-konfigurieren)
7. [Ergebnisse analysieren](#ergebnisse-analysieren)

## Voraussetzungen

Bevor Sie beginnen, stellen Sie sicher, dass folgende Komponenten installiert sind:

- Java 8 oder höher
- Node.js 14 oder höher
- npm 6 oder höher
- Azure CLI (für Azure Load Testing)
- Git

## JMeter-Installation

1. Laden Sie Apache JMeter von der [offiziellen Website](https://jmeter.apache.org/download_jmeter.cgi) herunter.
2. Extrahieren Sie die ZIP-Datei in ein beliebiges Verzeichnis.
3. Installieren Sie erforderliche Plugins:
   - Öffnen Sie JMeter (ausführbare Datei im Verzeichnis `bin`).
   - Navigieren Sie zu Options > Plugins Manager.
   - Installieren Sie die folgenden Plugins:
     - jpgc-graphs-basic
     - jpgc-graphs-additional
     - jpgc-synthesis

## Lokale Last-Tests

Um Last-Tests lokal auszuführen:

1. Navigieren Sie in das Hauptverzeichnis des Projekts.
2. Führen Sie das Skript `run-local-test.sh` aus:

```bash
cd load-testing
chmod +x scripts/run-local-test.sh
./scripts/run-local-test.sh dev  # Für Entwicklungsumgebung
```

Verfügbare Umgebungsoptionen:
- `dev`: Entwicklungsumgebung mit geringer Last (10 Benutzer)
- `test`: Testumgebung mit mittlerer Last (25 Benutzer)
- `prod`: Produktionsumgebung mit hoher Last (100 Benutzer)

Die Testergebnisse werden im Verzeichnis `load-testing/results` gespeichert. Ein HTML-Bericht wird automatisch generiert.

## Azure Load Testing einrichten

Um Azure Load Testing zu verwenden:

1. Erstellen Sie eine Azure Load Testing Ressource:

```bash
az login
az group create --name LoadTestResourceGroup --location westeurope
az load create --name BlogAppLoadTest --resource-group LoadTestResourceGroup --location westeurope
```

2. Laden Sie den Testplan und die Konfigurationsdateien hoch:

```bash
az load test upload-files --resource-group LoadTestResourceGroup --name BlogAppLoadTest --test-file load-testing/jmeter/blog-app-test-plan.jmx
az load test upload-files --resource-group LoadTestResourceGroup --name BlogAppLoadTest --test-file load-testing/azure/load-test-config.yaml
```

3. Konfigurieren Sie Tests in der Azure-Portal-UI:
   - Öffnen Sie die Load Testing Ressource im Azure-Portal.
   - Gehen Sie zu "Tests" und erstellen Sie einen neuen Test.
   - Wählen Sie den hochgeladenen Testplan und die Konfigurationsdatei aus.
   - Konfigurieren Sie weitere Parameter wie Benutzerzahl, Hochlaufzeit und Testdauer.

## CI/CD-Integration

Die GitHub Action-Workflow-Datei (`load-testing.yml`) ist bereits konfiguriert, um Last-Tests als Teil der CI/CD-Pipeline auszuführen. Um diese zu verwenden:

1. Navigieren Sie zu den Repository-Einstellungen auf GitHub.
2. Gehen Sie zu "Secrets and variables" > "Actions".
3. Fügen Sie folgende Geheimnisse hinzu:
   - `AZURE_CREDENTIALS`: Anmeldeinformationen für Azure
   - `AZURE_RESOURCE_GROUP`: Name der Ressourcengruppe
   - `AZURE_LOAD_TEST_RESOURCE`: Name der Azure Load Testing Ressource
   - `API_URL`: Backend-API-URL
   - `BASE_URL`: Frontend-URL
   - `TEST_USERNAME`: Benutzername für Tests
   - `TEST_PASSWORD`: Passwort für Tests

Der Workflow wird bei jedem Push auf den `main`-Branch ausgeführt oder kann manuell über die GitHub-Actions-Benutzeroberfläche gestartet werden.

## Testdaten konfigurieren

Sie können die Testdaten anpassen, indem Sie die folgenden Dateien bearbeiten:

- `load-testing/jmeter/test-data/users.csv`: Testbenutzer für authentifizierte Anfragen
- `load-testing/jmeter/test-data/blog-posts.csv`: Test-Blog-Einträge für Erstellungsanfragen

Stellen Sie sicher, dass die Benutzer in der `users.csv`-Datei in Ihrer Anwendung registriert sind oder verwenden Sie gültige Anmeldeinformationen für Ihre Umgebung.

## Ergebnisse analysieren

Nach Abschluss eines Tests können Sie die Ergebnisse wie folgt analysieren:

1. **Lokale Tests:**
   - Öffnen Sie den generierten HTML-Bericht unter `load-testing/results/reports/[timestamp]/index.html`.
   - Führen Sie das Analyse-Skript aus:

   ```bash
   cd load-testing
   node scripts/analyze-results.js results/results_dev_YYYYMMDD_HHMMSS.jtl
   ```

2. **Azure Load Testing:**
   - Öffnen Sie die Load Testing Ressource im Azure-Portal.
   - Gehen Sie zu "Test runs" und wählen Sie Ihren Testlauf aus.
   - Sehen Sie sich die Grafiken und Berichte auf der Registerkarte "Metrics" an.
   - Exportieren Sie die Ergebnisse als CSV oder JSON für weitere Analysen.

Die wichtigsten zu überwachenden Metriken sind:

- **Durchschnittliche Antwortzeit:** Sollte unter 1000ms bleiben
- **Fehlerrate:** Sollte unter 5% bleiben
- **Durchsatz (Anfragen pro Sekunde):** Sollte stabil bleiben und mit zunehmender Last nicht stark abfallen
- **Perzentile der Antwortzeit (P95, P99):** Gibt Aufschluss über die langsamsten Anfragen

Wenn Probleme festgestellt werden, überprüfen Sie:
- Server-Logs auf Fehler oder Warnungen
- Datenbank-Performance und Abfragen
- Netzwerk-Latenz
- Frontend-Ladezeiten und Rendering-Performance