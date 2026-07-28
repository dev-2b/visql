# 🚀 visQL – MVP-Definition & Entwicklungs-Roadmap

Dieses Dokument definiert das **Minimum Viable Product (MVP)** für **visQL** sowie den konkreten Fahrplan für die initiale Entwicklungsphase während der Umschulung.

---

## 🎯 MVP-Definition

Das MVP (Minimum Viable Product) von **visQL** ist ein lauffähiges, reines Browser-Dashboard, das den Kernmechanismus der **Logical Query Processing Order** an einem **festen Beispieldatensatz** interaktiv demonstriert. 

Ziel des MVPs ist es nicht, eine vollständige SQL-Engine mit freier Texteingabe zu bauen, sondern die **Daten-Transformationen der 6 Ausführungsphasen visuell erfahrbar zu machen**.

### Kernmerkmale des MVPs:
* **Fester Kontext**: Ein vordefinierter Datensatz (z. B. `Mietvertrag` und `Ferienhaus`).
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
- [ ] **Repository & Ordnerstruktur anlegen**: Ordner `/css`, `/js/data`, `/js/engine` und `/js/ui` aufsetzen.
- [ ] **HTML-Dashboard (`index.html`)**:
  - [ ] Header mit Projekt-Titel und Umschulungs-Kontext.
  - [ ] Phasen-Steuerungsleiste (Visualisierung der 6 Pipeline-Schritte).
  - [ ] Hauptbereich mit 2 Spalten: Links der aktuelle SQL-Code, rechts die aktive Daten-Tabelle.
  - [ ] Control-Buttons (`[Zurück]`, `[Weiter]`, `[Reset]`).
- [ ] **CSS-Styling (`css/main.css` & `css/components.css`)**:
  - [ ] Layout per CSS Grid / Flexbox umsetzen.
  - [ ] Farbschema für aktive/inaktive Pipeline-Phasen festlegen.
  - [ ] Styling für Daten-Tabellen (`<table>`) und Filter-Animationen.

### Phase 2: Datenmodell & JS-Pipeline Engine 
- [ ] **Mock-Daten anlegen (`js/data/mockData.js`)**:
  - [ ] Daten-Array für `ferienhäuser` und `mietverträge` definieren.
  - [ ] Beispiel-Query als Daten-Objekt formulieren (Bedingungen, Gruppier-Spalten, Aggregationen).
- [ ] **SQL-Operationen in JS umsetzen (`js/engine/sqlMethods.js`)**:
  - [ ] `executeFrom()`: Verknüpfen/Zusammenführen von Objekten (Simulierter `JOIN`).
  - [ ] `executeWhere()`: Zeilenweises Filtern mittels `Array.prototype.filter()`.
  - [ ] `executeGroupBy()`: Erzeugen einer verschachtelten Gruppen-Struktur.
  - [ ] `executeHaving()`: Filtern von Gruppen-Eimern basierend auf aggregierten Werten.
  - [ ] `executeSelect()`: Umformen und Projizieren der Daten mittels `Array.prototype.map()`.
  - [ ] `executeOrderBy()`: Sortieren der finalen Tabelle mittels `Array.prototype.sort()`.
- [ ] **Pipeline-Steuerung (`js/engine/executor.js`)**:
  - [ ] Zustandsspeicher (State Machine) für den aktuellen Schritt (0 bis 5) aufbauen.
  - [ ] Funktion schreiben, die bei Klick auf „Weiter“ den nächsten Zustand berechnet.

### Phase 3: Dynamisches Rendering & Visualisierung
- [ ] **Tabellen-Renderer (`js/ui/renderTable.js`)**:
  - [ ] Funktion zur dynamischen Generierung von HTML-Tabellen aus den JS-Objekten.
  - [ ] Logik zum visuellen Ausgrauen/Rot-Markieren gefilterter Zeilen.
- [ ] **Group-Renderer (`js/ui/renderGroups.js`)**:
  - [ ] Optische Darstellung von `GROUP BY`-Eimern als farbige Container im UI.
- [ ] **Pipeline-Tracker (`js/ui/renderPipe.js`)**:
  - [ ] Aktive Phase in der Fortschrittsleiste oben optisch hervorheben.
  - [ ] Kurze Erklärung einblenden, was in der aktuellen Phase mit den Daten passiert.

### Phase 4: Testen, Dokumentation & Release
- [ ] **Integration & App-Orchestrierung (`js/app.js`)**:
  - [ ] Event-Listener auf Buttons legen und UI mit Engine koppeln.
- [ ] **Testing & Debugging**:
  - [ ] Edge Cases prüfen (z. B. leere Filter-Ergebnisse).
  - [ ] Responsive Layout und Browser-Kompatibilität testen.
- [ ] **GitHub Release**:
  - [ ] `README.md` aktualisieren und Screenshots/GIFs vom fertigen MVP einbinden.
  - [ ] GitHub Pages aktivieren für die Live-Demo im Browser.

---

## 🔮 Ausblick (Post-MVP Features)

Nach erfolgreichem Abschluss des MVPs können folgende Erweiterungen geplant werden:
* **Freie SQL-Eingabe**: Ein einfacher SQL-Parser, der benutzerdefinierte `SELECT`-Statements verarbeiten kann.
* **Umschaltbare Datensätze**: Auswahl zwischen verschiedenen Übungsaufgaben aus IHK-Klausuren.
* **Export-Funktion**: Exportieren der Zwischenzustände als Lerngrafik oder PDF.