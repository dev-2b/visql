// js/data/mockData.js

/**
 * Rohdaten für das visQL-Dashboard
 */

// 1. Tabelle: Mietvertrag (m)
export const mietvertraege = [
    { mietvertrag_id: 1, ferienhaus_id: 101, kunde_id: 1, tage: 10, jahr: 2026 },
    { mietvertrag_id: 2, ferienhaus_id: 102, kunde_id: 2, tage: 5,  jahr: 2026 },
    { mietvertrag_id: 3, ferienhaus_id: 101, kunde_id: 3, tage: 14, jahr: 2026 },
    { mietvertrag_id: 4, ferienhaus_id: 103, kunde_id: 4, tage: 20, jahr: 2025 },
    { mietvertrag_id: 5, ferienhaus_id: 102, kunde_id: 1, tage: 7,  jahr: 2026 },
    { mietvertrag_id: 6, ferienhaus_id: 101, kunde_id: 5, tage: 3,  jahr: 2026 }
];

// 2. Tabelle: Ferienhaus (f)
export const ferienhaeuser = [
    { ferienhaus_id: 101, name: "Villa Sonnenschein", ort: "Ostsee" },
    { ferienhaus_id: 102, name: "Alpenhütte Panorama", ort: "Allgäu" },
    { ferienhaus_id: 103, name: "Strandhaus Ocean",     ort: "Nordsee" }
];

/**
 * Beispiel-Query-Konfiguration für die visuelle Pipeline.
 * Definiert die Bedingungen für jede Phase der Logical Query Processing Order.
 */
export const activeQuery = {
    title: "Höchste Gesamtauslastung (Tage) im Jahr 2026",
    
    // Die Phasen-Bedingungen für die JavaScript-Engine
    pipeline: {
        from: {
            primaryTable: "mietvertraege",
            joinTable: "ferienhaeuser",
            on: "ferienhaus_id"
        },
        where: (row) => row.jahr === 2026,
        groupBy: "ferienhaus_id",
        having: null, // Kein HAVING-Filter in dieser Beispielabfrage
        select: [
            { field: "ferienhaus_id", label: "Ferienhaus ID" },
            { field: "name", label: "Hausname" },
            { field: "tage", aggregation: "SUM", label: "Gesamtauslastung (Tage)" }
        ],
        orderBy: { field: "Gesamtauslastung (Tage)", direction: "DESC" }
    },

    // Texte für die farbige Hervorhebung im Code-Display
    codeBlocks: {
        select: "SELECT f.Ferienhaus_ID, f.Name, SUM(m.Tage) AS Gesamtauslastung",
        from: "FROM Mietvertrag m JOIN Ferienhaus f ON m.Ferienhaus_ID = f.Ferienhaus_ID",
        where: "WHERE m.Jahr = 2026",
        groupBy: "GROUP BY f.Ferienhaus_ID, f.Name",
        having: "-- HAVING (Kein Filter)",
        orderBy: "ORDER BY Gesamtauslastung DESC"
    }
};