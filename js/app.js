// js/app.js

// 1. IMPORTS
import { activeQuery, mietvertraege, ferienhaeuser } from './data/mockData.js';
import { executePipelineStep } from './engine/executor.js';
import { renderTable } from './ui/renderTable.js';
import { renderCode } from './ui/renderCode.js';
import { renderGroupBuckets } from './ui/renderGroups.js';
import { renderSchema } from './ui/renderSchema.js';

// 2. STATE
const state = {
    currentStep: 0, // 0: Schema, 1: FROM, 2: WHERE, 3: GROUP BY, 4: HAVING, 5: SELECT, 6: ORDER BY
    maxSteps: 7,
    rawData: { mietvertraege, ferienhaeuser },
    activeQueryResult: null,
    manuallyOpenedSteps: new Set([0]) // Set der aktuell offenen Karten
};

// 3. DOM-ELEMENTE
const elements = {
    btnPrev: document.getElementById('btnPrev'),
    btnNext: document.getElementById('btnNext'),
    btnReset: document.getElementById('btnReset'),
    sqlDisplay: document.getElementById('sqlDisplay'),
    accordionCards: document.querySelectorAll('.accordion-card')
};

// 4. PIPELINE-STEUERUNG

/**
 * Haupt-Update-Funktion: Berechnet die Daten für die aktuelle Phase und aktualisiert die UI.
 */
function updateUI() {
    const step = state.currentStep;

    // A. Engine ausführen: Berechne den Datenzustand für den aktuellen Schritt
    state.activeQueryResult = executePipelineStep(step, activeQuery, state.rawData);

    // B. Button-Zustände & Beschriftungen steuern
    elements.btnPrev.disabled = (step === 0);
    
    if (step === state.maxSteps - 1) {
        elements.btnNext.disabled = true;
        elements.btnNext.textContent = 'Beendet 🎉';
    } else {
        elements.btnNext.disabled = false;
        const nextStepNames = ['FROM / JOIN', 'WHERE', 'GROUP BY', 'HAVING', 'SELECT', 'ORDER BY'];
        elements.btnNext.textContent = `Nächster Schritt (${nextStepNames[step]}) ➔`;
    }

    // C. SQL-Codebereich highlighten
    // renderCode erwartet Schritt (0 = FROM, 1 = WHERE...) - wir müssen also step - 1 übergeben für das Highlighting
    renderCode(elements.sqlDisplay, activeQuery.codeBlocks, step - 1);

    // D. Akkordeon Ansicht updaten (offene/geschlossene Karten)
    updateAccordionView();

    // E. Tabelle im UI für den aktuellen Schritt rendern
    renderCurrentPhaseData();
}

function updateAccordionView() {
    elements.accordionCards.forEach((card, index) => {
        // Logik zum Ausgrauen: Wenn ein Schritt im Query nicht existiert (z.B. HAVING).
        // Für dieses Beispiel gehen wir davon aus, dass wir alle durchgehen.
        // Die Logik zum Überspringen könnte man über activeQuery.pipeline prüfen.
        
        // Karte als aktiv (offen) markieren, wenn sie in manuallyOpenedSteps ist
        if (state.manuallyOpenedSteps.has(index)) {
            card.classList.add('active');
        } else {
            card.classList.remove('active');
        }
    });
}

/**
 * Rendert die Daten im Tabellen-Container der jeweiligen Akkordeon-Karte
 */
function renderCurrentPhaseData() {
    const step = state.currentStep;
    const { data, isGrouped, isSchema } = state.activeQueryResult;
    const container = document.getElementById(`container-step-${step}`);
    
    if (!container) return;

    if (isSchema) {
        renderSchema(container, data);
        return;
    }

    // Custom-Beschriftungen für den Tabellen-Header
    const customLabels = {
        mietvertrag_id: "MIETVERTRAG ID",
        ferienhaus_id: "HAUS ID",
        kunde_id: "KUNDE ID",
        tage: "TAGE",
        jahr: "JAHR",
        name: "HAUSNAME",
        ort: "ORT",
        "Gesamtauslastung (Tage)": "GESAMTAUSLASTUNG (TAGE)"
    };

    // Sonderfall GROUP BY / HAVING
    if (isGrouped) {
        renderGroupBuckets(container, data, {
            groupKeyName: "Ferienhaus ID",
            labels: customLabels
        });
        return;
    }

    // Normalfall
    renderTable(container, data, { labels: customLabels });
}

// 5. EVENT LISTENERS
elements.btnNext.addEventListener('click', () => {
    if (state.currentStep < state.maxSteps - 1) {
        const nextStep = state.currentStep + 1;
        // Automatische Akkordeon-Logik: Neuer und vorheriger Schritt bleiben offen, Rest zu
        state.manuallyOpenedSteps.clear();
        state.manuallyOpenedSteps.add(state.currentStep);
        state.manuallyOpenedSteps.add(nextStep);
        
        state.currentStep = nextStep;
        updateUI();
    }
});

elements.btnPrev.addEventListener('click', () => {
    if (state.currentStep > 0) {
        const prevStep = state.currentStep - 1;
        state.manuallyOpenedSteps.clear();
        state.manuallyOpenedSteps.add(state.currentStep);
        state.manuallyOpenedSteps.add(prevStep);
        
        state.currentStep = prevStep;
        updateUI();
    }
});

elements.btnReset.addEventListener('click', () => {
    state.currentStep = 0;
    state.manuallyOpenedSteps.clear();
    state.manuallyOpenedSteps.add(0);
    updateUI();
});

// Akkordeon Header Klick (manuelles Öffnen/Schließen)
elements.accordionCards.forEach((card, index) => {
    const header = card.querySelector('.accordion-header');
    header.addEventListener('click', () => {
        if (card.classList.contains('disabled')) return;
        
        if (state.manuallyOpenedSteps.has(index)) {
            // Wenn man auf eine offene klickt, schließen (es sei denn es ist die einzige offene? Ne, lass schließen)
            state.manuallyOpenedSteps.delete(index);
        } else {
            // Optionale Logik: Maximal 2 offen lassen?
            // Wenn schon 2 offen sind, die älteste schließen (oder hier einfach erlauben, beliebig viele zu öffnen)
            if (state.manuallyOpenedSteps.size >= 2) {
                // Finde diejenige, die am weitesten vom angeklickten index entfernt ist und lösche sie
                const arr = Array.from(state.manuallyOpenedSteps);
                state.manuallyOpenedSteps.delete(arr[0]); // Einfach die älteste löschen
            }
            state.manuallyOpenedSteps.add(index);
        }
        updateAccordionView();
    });
});


// 6. INITIALISIERUNG
document.addEventListener('DOMContentLoaded', () => {
    console.log('🔍 visQL Engine vollumfänglich gekoppelt (Akkordeon Layout).');
    updateUI();
});