// js/app.js

// 1. IMPORTS (Daten, Engine und UI-Renderer)
import { activeQuery, mietvertraege, ferienhaeuser } from './data/mockData.js';

// 2. STATE (Der aktuelle Zustand der Anwendung)
const state = {
    currentStep: 0, // 0: FROM, 1: WHERE, 2: GROUP BY, 3: HAVING, 4: SELECT, 5: ORDER BY
    maxSteps: 6,
    rawData: { mietvertraege, ferienhaeuser },
    processedData: [] // Speichert den Datentransform-Zustand je Phase
};

// 3. DOM-ELEMENTE (Referenzen zu HTML-Knoten)
const elements = {
    btnPrev: document.getElementById('btnPrev'),
    btnNext: document.getElementById('btnNext'),
    btnReset: document.getElementById('btnReset'),
    pipelineTracker: document.getElementById('pipelineTracker'),
    phaseInfo: document.getElementById('phaseInfo'),
    tableContainer: document.getElementById('tableContainer'),
    rowCount: document.getElementById('rowCount')
};

// 4. PIPELINE-STEUERUNG (State Transitions)

/**
 * Aktualisiert die Benutzeroberfläche basierend auf state.currentStep
 */
function updateUI() {
    const step = state.currentStep;

    // A. Pipeline Tracker Schritte visuell anpassen
    const steps = elements.pipelineTracker.querySelectorAll('.step');
    steps.forEach((stepEl, index) => {
        if (index === step) {
            stepEl.classList.add('active');
        } else {
            stepEl.classList.remove('active');
        }
    });

    // B. Button-Zustände & Beschriftungen steuern
    elements.btnPrev.disabled = (step === 0);
    
    if (step === state.maxSteps - 1) {
        elements.btnNext.disabled = true;
        elements.btnNext.textContent = 'Pipeline Beendet 🎉';
    } else {
        elements.btnNext.disabled = false;
        const nextStepNames = ['WHERE', 'GROUP BY', 'HAVING', 'SELECT', 'ORDER BY'];
        elements.btnNext.textContent = `Nächster Schritt (${nextStepNames[step]}) ➔`;
    }

    // C. Platzhalter-Verarbeitung der Daten (Wird in Phase 3 mit echtem Rendering ersetzt)
    renderPlaceholderTable();
}

/**
 * Temporäre Funktion zur Anzeige des aktuellen Schritts in der Tabelle
 */
function renderPlaceholderTable() {
    const phaseNames = ['FROM / JOIN', 'WHERE', 'GROUP BY', 'HAVING', 'SELECT', 'ORDER BY'];
    
    elements.tableContainer.innerHTML = `
        <div style="padding: 2rem; text-align: center; color: var(--text-muted);">
            <h3>Phase ${state.currentStep + 1}:${phaseNames[state.currentStep]}</h3>
            <p style="margin-top: 0.5rem;">Aktivierte Query: <em>"${activeQuery.title}"</em></p>
            <p style="margin-top: 1rem; font-size: 0.85rem; background: rgba(255,255,255,0.05); padding: 0.5rem; border-radius: 4px;">
                Engine-Status: bereit für Modul-Anbindung (sqlMethods.js)
            </p>
        </div>
    `;
    elements.rowCount.textContent = `Phase ${state.currentStep + 1} von 6`;
}

// 5. EVENT LISTENERS

elements.btnNext.addEventListener('click', () => {
    if (state.currentStep < state.maxSteps - 1) {
        state.currentStep++;
        updateUI();
    }
});

elements.btnPrev.addEventListener('click', () => {
    if (state.currentStep > 0) {
        state.currentStep--;
        updateUI();
    }
});

elements.btnReset.addEventListener('click', () => {
    state.currentStep = 0;
    updateUI();
});

// 6. INITIALISIERUNG
document.addEventListener('DOMContentLoaded', () => {
    console.log('🔍 visQL Engine erfolgreich gestartet.');
    updateUI();
});