// js/ui/renderGroups.js

import { renderTable } from './renderTable.js';

/**
 * Rendert gruppierte Daten (GROUP BY / HAVING) in visuellen Container-Eimern (Buckets).
 * 
 * @param {HTMLElement} container - Das HTML-Element, in das die Gruppen gerendert werden.
 * @param {Object} groups - Das Objekt mit den Gruppen-Arrays { "101": [...], "102": [...] }
 * @param {Object} options - Optionale Label-Konfigurationen
 */
export function renderGroupBuckets(container, groups = {}, options = {}) {
    if (!container) return;

    const groupKeys = Object.keys(groups);

    // 1. Fallback, falls keine Gruppen vorhanden sind
    if (groupKeys.length === 0) {
        container.innerHTML = `
            <div style="padding: 2rem; text-align: center; color: var(--text-muted);">
                Keine Daten/Gruppen für diese Phase vorhanden.
            </div>
        `;
        return;
    }

    // 2. HTML-Gerüst für die Eimer aufbauen
    let html = '<div class="groups-wrapper">';

    groupKeys.forEach(key => {
        const itemCount = groups[key].length;
        html += `
            <div class="group-bucket" data-group-key="${key}">
                <div class="group-header">
                    <span class="group-title">📦 Gruppe: <strong>${options.groupKeyName || 'Key'} = ${key}</strong></span>
                    <span class="group-badge">${itemCount} Datensätz${itemCount === 1 ? 'e' : 'e'}</span>
                </div>
                <div class="group-body" id="group-target-${key}"></div>
            </div>
        `;
    });

    html += '</div>';
    container.innerHTML = html;

    // 3. Jede Unter-Tabelle in ihren jeweiligen Eimer rendern
    groupKeys.forEach(key => {
        const targetEl = document.getElementById(`group-target-${key}`);
        if (targetEl) {
            renderTable(targetEl, groups[key], options);
        }
    });
}