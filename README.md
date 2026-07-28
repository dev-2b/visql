# 🔍 visQL

> **Hinweis zur Entwicklung (AI-Assisted Development):**  
> Dieses Projekt wurde im Rahmen einer Umschulung entwickelt. Der Programmcode und die Architektur entstanden in enger Zusammenarbeit mit **Google Gemini Flash** als KI-Pair-Programmer. 
> 
> **Warum dieser Ansatz?**
> * **Effizienz & Lernfokus:** Das Ziel des Projekts lag primär in der tiefen fachlichen Durchdringung der *Logical Query Processing Order* in SQL sowie im Architektur-Design einer modular aufgebauten JavaScript-Engine. 
> * **Code-Generierung & Prompt Engineering:** Durch präzises Framing, strukturierte Prompts und schrittweise Code-Reviews wurden komplexe ES6-Module, Algorithmen und CSS-Animationen gemeinsam erarbeitet, von Hand verfeinert und auf Gültigkeit geprüft.
> * **Praxisnahes Arbeiten:** Die Kombination aus menschlicher Projektsteuerung (Konzeption, Testing, Refactoring) und KI-gestützter Implementierung spiegelt moderne Workflows in der professionellen Softwareentwicklung wider.

---

## 🎯 Über das Projekt

Dieses Projekt entsteht **begleitend im Rahmen einer Umschulung**, um die interne Logik und Verarbeitungsreihenfolge von SQL-Abfragen tiefgehend zu durchdringen und nachhaltig zu festigen.

In der SQL-Entwicklung entsteht oft Verwirrung, weil SQL **deklarativ** aufgebaut ist: Man schreibt `SELECT` an den Anfang, obwohl die Datenbank-Engine diesen Schritt erst fast ganz am Ende ausführt. 

Viele Entwickler und Lernende versuchen daher, komplexe SQL-Abfragen wie normalen Programmcode von oben nach unten aufzulösen. **visQL** schließt diese Lücke. Es macht sichtbar, wie eine relationale Datenbank Abfragen unter der Haube wirklich abarbeitet und wie Daten in jeder Phase mathematisch transformiert werden.

---

## 💡 Was das Projekt zeigt

Das Kernkonzept ist die schrittweise Visualisierung der **6 physischen Phasen der SQL-Ausführung** (*Logical Query Processing Order*):

1. **`FROM` & `JOIN`** – Bilden der Ausgangsrelation (Kreuzprodukt & Tabellenverknüpfung).
2. **`WHERE`** – Zeilenweise Filterung der Einzeldaten (Tupel-Filter).
3. **`GROUP BY`** – Partitionieren der Zeilen in isolierte Gruppen-Eimer (Buckets).
4. **`HAVING`** – Filterung ganzer Gruppen-Eimer anhand von Aggregat-Bedingungen.
5. **`SELECT`** – Projektion, Berechnung mathematischer Terme und Vergabe von Spalten-Aliasen.
6. **`ORDER BY` & `LIMIT`** – Sortieren der finalen Ergebnismenge und Beschneiden der Ausgabe.

In jeder Phase wird visuell dargestellt, welche Daten aus dem Arbeitsspeicher fliegen, wie Partitionen gebildet werden und wie sich die Datentabelle transformiert.

---

## 🛠️ Technische Umsetzung

Das Projekt wird bewusst als **reines Frontend-Dashboard** umgesetzt. Es wird **keine reale Datenbank** (wie PostgreSQL oder MySQL) angebunden, da echte RDBMS nur das Endergebnis liefern, nicht aber die visuellen Zwischenzustände im Arbeitsspeicher.

Stattdessen simuliert eine maßgeschneiderte JavaScript-Engine das Verhalten der SQL-Pipeline direkt im Browser.

### Stack & Konzepte:
* **HTML5 & CSS3**: Modulares Dashboard-Layout (CSS Grid & Flexbox) mit dynamischen Status-Animationen für ausgefilterte Daten.
* **Modernes JavaScript (ES6+)**:
  * **Datenmodell**: Tabellen werden als Arrays von Objekten repräsentiert (`mockData.js`).
  * **Functional Programming**: SQL-Konzepte werden direkt über JS-Array-Methoden nachgebildet (`filter` $\rightarrow$ `WHERE`, `map` $\rightarrow$ `SELECT`, `reduce` $\rightarrow$ `GROUP BY`).
* **Modularer Aufbau**: Strikt getrennte Ordnerstruktur für Daten (`/data`), Ausführungslogik (`/engine`) und Rendering (`/ui`).

---

## 🚀 Getting Started

Da es sich um eine reine Single-Page-Application (SPA) handelt, ist keine Installation notwendig:

1. Repository klonen:
   ```bash
   git clone https://github.com/dev-2b/visQL.git
   ```
2. Die Datei `index.html` direkt im Browser deiner Wahl öffnen.

---

## 📝 Roadmap & Geplante Features

- [x] Statisches Dashboard-Layout & Pipeline-Navigation
- [x] Erstellung der Test-Datensätze (`Mietvertrag`, `Ferienhaus`, `Maengelanzeige`)
- [x] Umsetzung der ersten JS-Pipeline-Schritte (`FROM`, `WHERE`)
- [x] Visuelle Darstellung von `GROUP BY`-Containern
- [ ] Interaktive Eingabe eigener vereinfachter SQL-Befehle

## Projektstruktur
```text
sql-visu-engine/
│
├── index.html              # Das visuelle Dashboard & Pipeline-Layout
├── README.md               # Projektbeschreibung & Doku
│
├── css/
│   ├── main.css            # Grundlayout, CSS-Grid, Typografie
│   └── components.css      # Styles für Tabellen, Pipeline-Karten & Status-Animationen
│
└── js/
    ├── app.js              # Hauptskript: Event-Listener & Orchestrierung
    │
    ├── data/
    │   └── mockData.js     # Rohdaten (deine Test-Tabellen als JS-Arrays)
    │
    ├── engine/
    │   ├── executor.js     # Die Pipeline-Steuerung (führt Schritt 1 bis 6 nacheinander aus)
    │   └── sqlMethods.js   # Die Core-Logik: JS-Analoga zu WHERE (filter), SELECT (map), etc.
    │
    └── ui/
        ├── renderTable.js  # Funktionen zum Generieren von HTML-Tabellen aus Arrays
        └── renderPipe.js   # Funktionen zur optischen Hervorhebung des aktuellen SQL-Schritts 
