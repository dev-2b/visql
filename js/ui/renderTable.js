// js/ui/renderTable.js

/**
 * Rendert ein Array von Objekten als HTML-Tabelle im Ziel-Container.
 * 
 * @param {HTMLElement} container - Das HTML-Element, in das die Tabelle eingefügt wird.
 * @param {Array<Object>} data - Die anzuzeigenden Datenzeilen.
 * @param {Object} options - Optionale Konfiguration (z. B. Spaltenbeschriftungen, Filter-Status)
 */
export function renderTable(container, data = [], options = {}) {
    // 1. Fallback bei leeren Daten
    if (!data || data.length === 0) {
        container.innerHTML = `
            <div style="padding: 2rem; text-align: center; color: var(--text-muted);">
                Keine Datensätze in dieser Phase vorhanden.
            </div>
        `;
        updateRowCount(0);
        return;
    }

    // 2. Spaltenüberschriften dynamisch ermitteln (aus dem ersten Objekt)
    const headers = Object.keys(data[0]);

    // 3. HTML-Tabelle aufbauen
    let html = '<table>';

    // A. Table Header (TH)
    html += '<thead><tr>';
    headers.forEach(header => {
        // Schönschreiben von Feldnamen (z. B. "ferienhaus_id" -> "FERIENHAUS_ID")
        const label = options.labels && options.labels[header] 
            ? options.labels[header] 
            : header.toUpperCase();
        html += `<th>${escapeHtml(label)}</th>`;
    });
    html += '</tr></thead>';

    // B. Table Body (TR / TD)
    html += '<tbody>';
    data.forEach((row) => {
        // Prüfung, ob die Zeile herausgefiltert wurde (z. B. row._isFiltered = true)
        const isFiltered = row._isFiltered === true;
        const rowClass = isFiltered ? 'class="row-filtered"' : '';

        html += `<tr ${rowClass}>`;
        
        headers.forEach(header => {
            // Interne Hilfsfelder (beginnend mit '_') in der Anzeige überspringen
            if (header.startsWith('_')) return;

            const cellValue = row[header] !== undefined && row[header] !== null 
                ? row[header] 
                : 'NULL';
                
            html += `<td>${escapeHtml(String(cellValue))}</td>`;
        });

        html += '</tr>';
    });
    html += 'tbody>';

    html += '</table>';

    // 4. In DOM injizieren
    container.innerHTML = html;

    // 5. Zeilenzahl-Badge aktualisieren
    const activeRows = data.filter(r => !r._isFiltered).length;
    updateRowCount(activeRows, data.length);
}

/**
 * Aktualisiert die Zeilenanzeige im UI Header
 */
function updateRowCount(activeCount, totalCount) {
    const rowCountEl = document.getElementById('rowCount');
    if (!rowCountEl) return;

    if (totalCount !== undefined && totalCount !== activeCount) {
        rowCountEl.textContent = `Zeilen: ${activeCount} von ${totalCount}`;
    } else {
        rowCountEl.textContent = `Zeilen: ${activeCount}`;
    }
}

/**
 * Hilfsfunktion zum Schutz vor XSS / Code-Injection
 */
function escapeHtml(str) {
    return str
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}