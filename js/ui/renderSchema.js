// js/ui/renderSchema.js

/**
 * Rendert das initiale Datenbankschema (alle Tabellen) für Schritt 0.
 * 
 * @param {HTMLElement} container - Das DOM-Element, in das die Tabellen gerendert werden (z.B. id="container-step-0")
 * @param {Object} rawData - Die rohen Datenbanks-Tabellen { mietvertraege: [], ferienhaeuser: [] }
 */
export function renderSchema(container, rawData) {
    container.innerHTML = ''; // Container leeren
    
    // Wir iterieren über alle Keys in rawData und rendern jede als Tabelle
    for (const [tableName, rows] of Object.entries(rawData)) {
        if (!rows || rows.length === 0) continue;

        const tableWrapper = document.createElement('div');
        tableWrapper.classList.add('schema-table-wrapper');
        tableWrapper.style.marginBottom = '1.5rem';

        const title = document.createElement('h4');
        title.textContent = `Tabelle: ${tableName.toUpperCase()}`;
        title.style.color = 'var(--accent)';
        title.style.marginBottom = '0.5rem';
        tableWrapper.appendChild(title);

        const tableEl = document.createElement('table');
        
        // Header
        const thead = document.createElement('thead');
        const trHead = document.createElement('tr');
        const keys = Object.keys(rows[0]);
        keys.forEach(key => {
            const th = document.createElement('th');
            th.textContent = key.toUpperCase();
            trHead.appendChild(th);
        });
        thead.appendChild(trHead);
        tableEl.appendChild(thead);

        // Body
        const tbody = document.createElement('tbody');
        rows.forEach(row => {
            const tr = document.createElement('tr');
            keys.forEach(key => {
                const td = document.createElement('td');
                td.textContent = row[key];
                tr.appendChild(td);
            });
            tbody.appendChild(tr);
        });
        tableEl.appendChild(tbody);

        tableWrapper.appendChild(tableEl);
        container.appendChild(tableWrapper);
    }
}
