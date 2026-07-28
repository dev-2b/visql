// js/app.js

// 1. IMPORTS
import { activeQuery, mietvertraege, ferienhaeuser } from './data/mockData.js';
import { executePipelineStep } from './engine/executor.js';
import { renderTable } from './ui/renderTable.js';
import { renderCode } from './ui/renderCode.js';
import { renderGroupBuckets } from './ui/renderGroups.js';

// 2. STATE
const state = {
    currentStep: 0, // 0: FROM, 1: WHERE, 2: GROUP BY, 3: HAVING, 4: SELECT, 5: ORDER BY
    maxSteps: 6,
    rawData: { mietvertraege, ferienhaeuser },
    activeQueryResult: null
};

// 3. DOM-ELEMENTE
const elements = {
    btnPrev: document.getElementById('btnPrev'),
    btnNext: document.getElementById('btnNext'),
    btnReset: document.getElementById('btnReset'),
    pipelineTracker: document.getElementById('pipelineTracker'),
    phaseInfo: document.getElementById('phaseInfo'),
    tableContainer: document.getElementById('tableContainer'),
    sqlDisplay: document.getElementById('sqlDisplay')
};

// 4. PIPELINE-STEUERUNG

/**
 * Haupt-Update-Funktion: Berechnet die Daten für die aktuelle Phase und aktualisiert die UI.
 */
function updateUI() {
    const step = state.currentStep;

    // A. Engine ausführen: Berechne den Datenzustand für den aktuellen Schritt
    state.activeQueryResult = executePipelineStep(step, activeQuery, state.rawData);

    // B. Pipeline Tracker Schritte visuell anpassen
    const steps = elements.pipelineTracker.querySelectorAll('.step');
    steps.forEach((stepEl, index) => {
        if (index === step) {
            stepEl.classList.add('active');
        } else {
            stepEl.classList.remove('active');
        }
    });

    // C. Phase-Info Text aktualisieren
    if (elements.phaseInfo) {
        elements.phaseInfo.innerHTML = `
            <strong>Phase ${step + 1}: ${state.activeQueryResult.phaseName}</strong> –${state.activeQueryResult.description}
        `;
    }

    // D. Button-Zustände & Beschriftungen steuern
    elements.btnPrev.disabled = (step === 0);
    
    if (step === state.maxSteps - 1) {
        elements.btnNext.disabled = true;
        elements.btnNext.textContent = 'Pipeline Beendet 🎉';
    } else {
        elements.btnNext.disabled = false;
        const nextStepNames = ['WHERE', 'GROUP BY', 'HAVING', 'SELECT', 'ORDER BY'];
        elements.btnNext.textContent = `Nächster Schritt (${nextStepNames[step]}) ➔`;
    }

    // E. SQL-Codebereich highlighten
    renderCode(elements.sqlDisplay, activeQuery.codeBlocks, step);

    // F. Tabelle im UI rendern
    renderCurrentPhaseData();
}

/**
 * Rendert die Daten im Tabellen-Container
 */
function renderCurrentPhaseData() {
    const { data, isGrouped } = state.activeQueryResult;

    // Custom-Beschriftungen für den Tabellen-Header
    const customLabels = {
        mietvertrag_id: "MIETVERTRAG ID",
        ferienhaus_id: "HAUS ID",
        kunde_id: "KUNDE ID",
        tage: "TAGE",
        jahr: "JAHR",
        name: "HAUSNAME",
        ort: "ORT"
    };

    // Sonderfall GROUP BY / HAVING (Daten liegen als Objekt von Gruppen-Arrays vor)
    if (isGrouped) {
        renderGroupedDataView(data);
        return;
    }

    // Normalfall (Array von Objekten)
    renderTable(elements.tableContainer, data, { labels: customLabels });
}

/**
 * Hilfs-Rendering für gruppierte Daten (GROUP BY / HAVING)
 */
/**
 * Hilfs-Rendering für gruppierte Daten (GROUP BY / HAVING)
 */
function renderGroupedDataView(groups) {
    const customLabels = {
        mietvertrag_id: "MIETVERTRAG ID",
        ferienhaus_id: "HAUS ID",
        kunde_id: "KUNDE ID",
        tage: "TAGE",
        jahr: "JAHR",
        name: "HAUSNAME",
        ort: "ORT"
    };

    renderGroupBuckets(elements.tableContainer, groups, {
        groupKeyName: "Ferienhaus ID",
        labels: customLabels
    });
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
    console.log('🔍 visQL Engine vollumfänglich gekoppelt.');
    updateUI();
});