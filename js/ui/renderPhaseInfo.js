// js/ui/renderPhaseInfo.js

/**
 * Generiert eine detaillierte Erklär-Box für die aktive Phase
 * inklusive konkreter Datensatz-Statistiken.
 * 
 * @param {HTMLElement} container - Das HTML-Element (#phaseInfo)
 * @param {Object} stepResult - Das Rückgabe-Objekt aus executePipelineStep
 * @param {number} step - Index der aktuellen Phase (0 bis 5)
 */
export function renderPhaseInfo(container, stepResult, step) {
    if (!container || !stepResult) return;

    const { phaseName, description, data, isGrouped } = stepResult;
    let statsBadge = '';

    // Dynamische Kennzahlen berechnen
    if (isGrouped) {
        const groupCount = Object.keys(data).length;
        const totalRows = Object.values(data).reduce((acc, g) => acc + g.length, 0);
        statsBadge = `<span class="badge" style="background: rgba(245, 158, 11, 0.2); color: var(--accent); border-color: var(--accent);">
            ${groupCount} Gruppe(n) | ${totalRows} Datensätze
        </span>`;
    } else if (Array.isArray(data)) {
        const total = data.length;
        const filteredOut = data.filter(r => r._isFiltered === true).length;
        const active = total - filteredOut;

        if (filteredOut > 0) {
            statsBadge = `<span class="badge" style="background: rgba(239, 68, 68, 0.2); color: var(--danger); border-color: var(--danger);">
                ${active} aktiv / ${filteredOut} gefiltert
            </span>`;
        } else {
            statsBadge = `<span class="badge">${active} Datensätze</span>`;
        }
    }

    container.innerHTML = `
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.25rem;">
            <strong>Phase ${step + 1}: ${phaseName}</strong>
            ${statsBadge}
        </div>
        <div style="color: var(--text-muted); font-size: 0.88rem;">
            ${description}
        </div>
    `;
}