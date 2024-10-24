
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

## Aufgabe:Erstellen einer Demo App mittels Angular Material

# Projektübersicht

Dies ist eine Demo-Blog-Anwendung in Angular, erstellt von **Richard Bickard**. Das Projekt veranschaulicht verschiedene Angular-Konzepte wie:

-   Verwendung von Angular Material Components
-   Event-Binding mit `(click)`
-   Strukturelle Direktiven wie `*ngIf`, `*ngSwitch` und `*ngFor`
-   Dynamisches Klassen- und Stil-Binding mit `ngClass` und `ngStyle`
-   Zwei-Wege-Datenbindung mit `NgModel`
-   Ein Button zur Weiterleitung zu einem externen Repository

## Funktionen

### Implementierte Angular-Konzepte:

1.  **Angular Material Components**: Das Projekt verwendet Angular Material-Komponenten wie Toolbar, Card und Buttons.
2.  **Event-Binding**: Das `(click)`-Event-Binding wird verwendet, um verschiedene Aktionen auszulösen, wie das Umschalten der Sichtbarkeit und das Ändern von Farben.
3.  **Strukturelle Direktiven**:
    -   `*ngIf` wird verwendet, um Inhalte bedingt anzuzeigen.
    -   `*ngSwitch` wird verwendet, um Inhalte basierend auf dem aktuellen Status dynamisch zu wechseln.
    -   `*ngFor` wird verwendet, um eine Liste von Elementen durchzugehen und anzuzeigen.
4.  **Dynamisches Klassen- und Stil-Binding**: `ngClass` und `ngStyle` werden verwendet, um das Erscheinungsbild von Elementen basierend auf dem Zustand der Komponente dynamisch zu ändern.
5.  **Zwei-Wege-Datenbindung**: `NgModel` wird für Benutzereingaben implementiert, um eine Echtzeit-Datenbindung zwischen Ansicht und Komponente zu ermöglichen.

## Projekt-Setup

### Voraussetzungen

-   **Node.js**: Stelle sicher, dass Node.js installiert ist. Du kannst es [hier herunterladen](https://nodejs.org/).
-   **Angular CLI**: Installiere Angular CLI global, falls noch nicht geschehen:
    
    bash
    
    Code kopieren
    
    `npm install -g @angular/cli` 
    

### Installation

1.  **Repository klonen**:
    
    bash
    
    Code kopieren
    
    `git clone https://github.com/hftm-in2022/angular-blog-app-richard-bickard.git` 
    
2.  **Wechsle in das Projektverzeichnis**:
    
    bash
    
    Code kopieren
    
    `cd angular-blog-app-richard-bickard` 
    
3.  **Installiere die Abhängigkeiten**:
    
    bash
    
    Code kopieren
    
    `npm install` 
    
4.  **Starte die Anwendung**:
    
    bash
    
    Code kopieren
    
    `ng serve` 
    
    Gehe dann im Browser zu `http://localhost:4200/`, um die Anwendung zu sehen.
    

## Features im Detail

1.  **Toggle Visibility**: Schaltet die Sichtbarkeit von bestimmten Inhalten um und zeigt an, ob der Benutzer online oder offline ist.
2.  **Change Color**: Ändert die Farbe eines visuellen Indikators (z. B. ein Lämpchen) zufällig.
3.  **Liste anzeigen**: Zeigt eine Liste von Aufgaben dynamisch an.
4.  **Dynamische Klasse und Stile**: Verwendet `ngClass`, um Klassen basierend auf Benutzereingaben zu ändern, und `ngStyle`, um die Hintergrundfarbe eines Elements dynamisch anzupassen.
5.  **Zwei-Wege-Datenbindung**: Ein Eingabefeld ermöglicht es, den Namen eines Benutzers einzugeben und ihn in Echtzeit anzuzeigen.