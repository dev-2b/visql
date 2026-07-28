/**
 * Hebt den SQL-Codeblock hervor, der zur aktuellen Phase gehört
 * @param {number} currentStep - Index der aktuellen Phase (0 bis 5)
 */
export function highlightSqlCode(currentStep) {
    // Mapping von Phase Index zu HTML IDs
    const phaseToElementId = {
        0: 'codeFrom',
        1: 'codeWhere',
        2: 'codeGroupBy',
        3: 'codeHaving',
        4: 'codeSelect',
        5: 'codeOrderBy'
    };

    // 1. Entferne vorherige Hervorhebungen
    const allBlocks = document.querySelectorAll('.code-block');
    allBlocks.forEach(block => block.classList.remove('highlighted'));

    // 2. Setze Highlighting auf den aktiven Block
    const activeId = phaseToElementId[currentStep];
    const activeBlock = document.getElementById(activeId);

    if (activeBlock) {
        activeBlock.classList.add('highlighted');
    }
}

// js/ui/renderCode.js

/**
 * Rendert den SQL-Codebereich dynamisch aus den Code-Blocks des Query-Objekts
 * und hebt die Zeile der aktuellen Phase hervor.
 * 
 * @param {HTMLElement} container - Das HTML-Element (<code id="sqlDisplay">)
 * @param {Object} codeBlocks - Das Objekt aus activeQuery.codeBlocks (mockData.js)
 * @param {number} currentStep - Index der aktuellen Phase (0 bis 5)
 */
export function renderCode(container, codeBlocks, currentStep) {
    if (!container || !codeBlocks) return;

    // Zuordnung von Phase-Index zu den Keys im codeBlocks-Objekt
    const stepKeys = ['from', 'where', 'groupBy', 'having', 'select', 'orderBy'];
    const activeKey = stepKeys[currentStep];

    let html = '';

    // Reihenfolge für die Anzeige (SELECT steht oben, auch wenn FROM zuerst verarbeitet wird)
    const displayOrder = ['select', 'from', 'where', 'groupBy', 'having', 'orderBy'];

    displayOrder.forEach(key => {
        if (codeBlocks[key]) {
            const isHighlighted = (key === activeKey) ? 'highlighted' : '';
            html += `<span class="code-block ${isHighlighted}" id="code-${key}">${escapeHtml(codeBlocks[key])}</span>\n`;
        }
    });

    container.innerHTML = html;
}

/**
 * Schutz vor XSS/HTML-Injection im Code-Display
 */
function escapeHtml(str) {
    return str
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;");
}