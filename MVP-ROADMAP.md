# 🚀 visQL – MVP-Definition & Entwicklungs-Roadmap

Dieses Dokument definiert das **Minimum Viable Product (MVP)** für **visQL** sowie den konkreten Fahrplan für die initiale Entwicklungsphase während der Umschulung.

---

## 🎯 MVP-Definition

Das MVP (Minimum Viable Product) von **visQL** ist ein lauffähiges, reines Browser-Dashboard, das den Kernmechanismus der **Logical Query Processing Order** an einem **festen Beispieldatensatz** interaktiv demonstriert. 

Ziel des MVPs ist es nicht, eine vollständige SQL-Engine mit freier Texteingabe zu bauen, sondern die **Daten-Transformationen der 6 Ausführungsphasen visuell erfahrbar zu machen**.

### Kernmerkmale des MVPs:
* **Fester Kontext**: Ein vordefinierter Datensatz
* **Vorgegebene Beispiel-Abfrage**: Eine festgelegte SQL-Abfrage, die alle 6 Phasen durchläuft (inklusive `JOIN`, `WHERE`, `GROUP BY`, `HAVING`, `SELECT` und `ORDER BY`).
* **Schritt-für-Schritt-Steuerung**: Ein „Nächster Schritt“-Button, der den Zustand der Daten von Phase 1 bis Phase 6 durchschaltet.
* **Visuelles Feedback**: 
  * Hervorheben von Zeilen, die in `WHERE` oder `HAVING` herausgefiltert werden.
  * Farbige Container/Eimer für die Gruppenbildung in `GROUP BY`.
  * Ausblenden verworfener Spalten im `SELECT`.

---

## 🗺️ Detaillierte Roadmap

```
Phase 1: Setup & UI   ──►   Phase 2: Data & Core Engine   ──►   Phase 3: Visualizer   ──►   Phase 4: Refinement
```

### Phase 1: Grundgerüst & UI-Layout
- [x] **Repository & Ordnerstruktur anlegen**: Ordner `/css`, `/js/data`, `/js/engine` und `/js/ui` aufsetzen.
- [x] **HTML-Dashboard (`index.html`)**:
  - [x] Header mit Projekt-Titel und Umschulungs-Kontext.
  - [x] Phasen-Steuerungsleiste (Visualisierung der 6 Pipeline-Schritte).
  - [x] Hauptbereich mit 2 Spalten: Links der aktuelle SQL-Code, rechts die aktive Daten-Tabelle.
  - [x] Control-Buttons (`[Zurück]`, `[Weiter]`, `[Reset]`).
- [x] **CSS-Styling (`css/main.css` & `css/components.css`)**:
  - [x] Layout per CSS Grid / Flexbox umsetzen.
  - [x] Farbschema für aktive/inaktive Pipeline-Phasen festlegen.
  - [x] Styling für Daten-Tabellen (`<table>`) und Filter-Animationen.

### Phase 2: Datenmodell & JS-Pipeline Engine 
- [x] **Mock-Daten anlegen (`js/data/mockData.js`)**:
  - [x] Daten-Array für `ferienhäuser` und `mietverträge` definieren.
  - [x] Beispiel-Query als Daten-Objekt formulieren (Bedingungen, Gruppier-Spalten, Aggregationen).
- [x] **SQL-Operationen in JS umsetzen (`js/engine/sqlMethods.js`)**:
  - [x] `executeFrom()`: Verknüpfen/Zusammenführen von Objekten (Simulierter `JOIN`).
  - [x] `executeWhere()`: Zeilenweises Filtern mittels `Array.prototype.filter()`.
  - [x] `executeGroupBy()`: Erzeugen einer verschachtelten Gruppen-Struktur.
  - [x] `executeHaving()`: Filtern von Gruppen-Eimern basierend auf aggregierten Werten.
  - [x] `executeSelect()`: Umformen und Projizieren der Daten mittels `Array.prototype.map()`.
  - [x] `executeOrderBy()`: Sortieren der finalen Tabelle mittels `Array.prototype.sort()`.
- [x] **Pipeline-Steuerung (`js/engine/executor.js`)**:
  - [x] Zustandsspeicher (State Machine) für den aktuellen Schritt (0 bis 5) aufbauen.
  - [x] Funktion schreiben, die bei Klick auf „Weiter“ den nächsten Zustand berechnet.

### Phase 3: Dynamisches Rendering & Visualisierung
- [x] **Tabellen-Renderer (`js/ui/renderTable.js`)**:
  - [x] Funktion zur dynamischen Generierung von HTML-Tabellen aus den JS-Objekten.
  - [x] Logik zum visuellen Ausgrauen/Rot-Markieren gefilterter Zeilen.
- [x] **Group-Renderer (`js/ui/renderGroups.js`)**:
  - [x] Optische Darstellung von `GROUP BY`-Eimern als farbige Container im UI.

### Phase 4: Testen, Dokumentation & Release
- [x] **Integration & App-Orchestrierung (`js/app.js`)**:
  - [x] Event-Listener auf Buttons legen und UI mit Engine koppeln.

- [x] **GitHub Release**:
  - [x] `README.md` aktualisieren 
  - [ ] GitHub Pages aktivieren für die Live-Demo im Browser. (optional)

---

## 🔮 Ausblick (Post-MVP Features)

Nach erfolgreichem Abschluss des MVPs können folgende Erweiterungen geplant werden:
* **Freie SQL-Eingabe**: Ein einfacher SQL-Parser, der benutzerdefinierte `SELECT`-Statements verarbeiten kann.
* **Umschaltbare Datensätze**: Auswahl zwischen verschiedenen Übungsaufgaben aus IHK-Klausuren.
* **DDL-Unterstützung**: Erstellung und Manipulation von Tabellenstrukturen (CREATE, ALTER, DROP).