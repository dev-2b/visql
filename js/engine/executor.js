// js/engine/executor.js

import { 
    executeFrom, 
    executeWhere, 
    executeGroupBy, 
    executeHaving, 
    executeSelect, 
    executeOrderBy 
} from './sqlMethods.js';

/**
 * Führt die SQL-Pipeline bis zur angegebenen Phase (step) aus
 * und gibt das jeweilige Zwischenergebnis zurück.
 * 
 * @param {number} step - Index der aktuellen Phase (0: FROM, 1: WHERE, 2: GROUP BY, 3: HAVING, 4: SELECT, 5: ORDER BY)
 * @param {Object} query - Das activeQuery-Objekt aus mockData.js
 * @param {Object} rawData - Die Tabellen-Rohdaten { mietvertraege, ferienhaeuser }
 * @returns {Object} { data: Array|Object, phaseName: string, isGrouped: boolean }
 */
export function executePipelineStep(step, query, rawData) {
    const { pipeline } = query;

    // 1. PHASE 0: FROM & JOIN
    const fromData = executeFrom(
        rawData[pipeline.from.primaryTable],
        rawData[pipeline.from.joinTable],
        pipeline.from.on
    );

    if (step === 0) {
        return {
            data: fromData,
            phaseName: "1. FROM / JOIN",
            isGrouped: false,
            description: "Rohdaten wurden geladen und über die Schlüsselspalte zusammengefügt."
        };
    }

    // 2. PHASE 1: WHERE
    const whereData = executeWhere(fromData, pipeline.where);

    if (step === 1) {
        return {
            data: whereData,
            phaseName: "2. WHERE",
            isGrouped: false,
            description: "Tupel-Filter angewendet: Zeilen, die der Bedingung nicht entsprechen, werden ausgegraut."
        };
    }

    // 3. PHASE 2: GROUP BY
    const groupData = executeGroupBy(whereData, pipeline.groupBy);

    if (step === 2) {
        return {
            data: groupData,
            phaseName: "3. GROUP BY",
            isGrouped: true,
            description: "Die verbliebenen Zeilen wurden in isolierte Gruppen-Eimer partitioniert."
        };
    }

    // 4. PHASE 3: HAVING
    const havingData = executeHaving(groupData, pipeline.having);

    if (step === 3) {
        return {
            data: havingData,
            phaseName: "4. HAVING",
            isGrouped: true,
            description: "Gruppen-Filter angewendet: Komplette Gruppen-Eimer wurden auf Aggregat-Kriterien geprüft."
        };
    }

    // 5. PHASE 4: SELECT (Projektion & Aggregation)
    const selectData = executeSelect(havingData, pipeline.select);

    if (step === 4) {
        return {
            data: selectData,
            phaseName: "5. SELECT",
            isGrouped: false,
            description: "Projektion durchgeführt: Aggregationen wurden berechnet und Spalten reduziert."
        };
    }

    // 6. PHASE 5: ORDER BY
    const orderData = executeOrderBy(selectData, pipeline.orderBy);

    return {
        data: orderData,
        phaseName: "6. ORDER BY",
        isGrouped: false,
        description: "Das finale Resultat wurde gemäß der Vorgabe sortiert."
    };
}