
**Setup eines Angular-Projekts mit ESLint, Prettier, Environments, Commitlint, lint-staged und Husky**

Diese Anleitung beschreibt, wie du ein Angular-Projekt einrichtest und verschiedene Tools wie ESLint, Prettier, Environments, Commitlint, lint-staged und Husky hinzufügst, um eine hohe Codequalität und einen effizienten Entwicklungsprozess zu gewährleisten.

**Inhaltsübersicht**

1.  Einrichten eines Angular-Projekts
2.  ESLint in Angular integrieren
3.  Prettier hinzufügen und konfigurieren
4.  Umgebungen (Environments) in Angular verwalten
5.  Commitlint für standardisierte Commit-Nachrichten
6.  lint-staged für Teil-Commits nutzen
7.  Husky zur Verwaltung von Git-Hooks einrichten

**1. Einrichten eines Angular-Projekts**

Um ein neues Angular-Projekt zu starten, nutze folgenden Befehl:

`ng new mein-angular-projekt`

Folge den Eingabeaufforderungen und passe das Projekt nach deinen Anforderungen an. Gehe danach in das neu erstellte Verzeichnis:

`cd mein-angular-projekt`

Jetzt kannst du mit der Installation und Konfiguration der Tools fortfahren.

**2. ESLint in Angular integrieren**

ESLint ist ein wichtiges Werkzeug, um statische Codeanalysen durchzuführen und Inkonsistenzen im Code zu vermeiden. Führe diesen Befehl aus, um ESLint zu installieren und in Angular zu integrieren:

`ng add @angular-eslint/schematics`

Weitere Informationen zur Verwendung von ESLint in Angular findest du in der offiziellen Angular-Linting-Dokumentation.

**3. Prettier hinzufügen und konfigurieren**

Prettier formatiert deinen Code automatisch und sorgt dafür, dass er immer den definierten Formatierungsregeln entspricht. Installiere Prettier als Entwicklungsabhängigkeit:

`npm install prettier --save-dev`

Ergänze folgendes Skript in deiner package.json, um den Code im src/app-Verzeichnis automatisch zu formatieren:

`"scripts": { "format": "npx prettier --write ./src/app/*" }`

**4. Umgebungen (Environments) in Angular verwalten**

Environments erlauben es, verschiedene Einstellungen für unterschiedliche Umgebungen (z.B. Produktion und Entwicklung) zu definieren. Erstelle die Environment-Dateien mit folgendem Befehl:

`ng generate environments`

Detaillierte Informationen findest du in der offiziellen Angular-Build-Dokumentation.

**5. Commitlint für standardisierte Commit-Nachrichten**

Commitlint stellt sicher, dass alle Commit-Nachrichten einem festgelegten Format entsprechen. Installiere Commitlint und die Konfiguration für konventionelle Commit-Nachrichten:

`npm install @commitlint/cli @commitlint/config-conventional --save-dev`

Ergänze die Commitlint-Konfiguration in der package.json:

`"commitlint": { "extends": [ "@commitlint/config-conventional" ] }`

Weitere Informationen findest du auf der Commitlint-Website.

**6. lint-staged für Teil-Commits nutzen**

Mit lint-staged kannst du sicherstellen, dass nur die geänderten Dateien formatiert und überprüft werden, was den Commit-Prozess beschleunigt. Installiere lint-staged:

`npm install --save-dev lint-staged`

Füge folgende Konfiguration zur package.json hinzu, um Prettier und ESLint nur auf die geänderten Dateien anzuwenden:

`"lint-staged": { "*.{ts,js,html}": "eslint --cache --fix", "*.{ts,js,html,css,scss,less,md}": "prettier --write" }`

Mehr über die Möglichkeiten von lint-staged erfährst du auf der offiziellen lint-staged GitHub-Seite.

**7. Husky zur Verwaltung von Git-Hooks einrichten**

Mit Husky kannst du Git-Hooks erstellen, um sicherzustellen, dass vor jedem Commit automatisch Code analysiert oder formatiert wird. Installiere Husky mit folgendem Befehl:

`npm install --save-dev husky`

Initialisiere Husky:

`npx husky`

Ergänze folgendes Skript zur package.json, um Husky bei der Installation des Projekts zu aktivieren:

`"scripts": { "prepare": "husky" }`

Führe dann das Skript aus:

`npm run prepare`

**Erstellen eines Commit-Hooks für Commitlint:**

`npx husky .husky/commit-msg 'npx --no-install commitlint --edit "$1"'`

**Erstellen eines Pre-Commit-Hooks für lint-staged:**

`npx husky .husky/pre-commit "npx lint-staged"`

Detaillierte Informationen zur Husky-Integration findest du in der Husky-Dokumentation.