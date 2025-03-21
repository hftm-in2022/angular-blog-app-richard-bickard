#!/bin/bash

# Skript zum lokalen Ausführen von JMeter-Tests für die Blog-App

# Sicherstellen, dass die Ergebnisverzeichnisse existieren
mkdir -p results/reports

# Umgebung auswählen
if [ -z "$1" ]; then
  ENV="dev"
else
  ENV="$1"
fi

echo "Führe Tests mit $ENV-Konfiguration aus..."

# Aktuelles Datum und Zeit für Berichtsbenennung
TIMESTAMP=$(date +"%Y%m%d_%H%M%S")

# JMeter ausführen (passe den Pfad zu JMeter an)
jmeter -n \
  -t jmeter/blog-app-test-plan.jmx \
  -p jmeter/environments/$ENV.properties \
  -l results/results_$ENV_$TIMESTAMP.jtl \
  -j results/jmeter_$ENV_$TIMESTAMP.log \
  -e -o results/reports/$ENV_$TIMESTAMP

echo "Test abgeschlossen. Die Ergebnisse befinden sich im Verzeichnis results/"
echo "HTML-Bericht: results/reports/$ENV_$TIMESTAMP/index.html"