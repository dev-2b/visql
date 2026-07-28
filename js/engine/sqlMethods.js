// js/engine/sqlMethods.js

/**
 * PHASE 1: FROM & JOIN
 * Führt zwei Tabellen (Arrays) basierend auf einem Join-Schlüssel zusammen.
 * (Entspricht dem relationalen INNER JOIN / Kreuzprodukt-Filter)
 */
export function executeFrom(primaryTable = [], joinTable = [], joinKey = '') {
    if (!joinTable || joinTable.length === 0 || !joinKey) {
        return primaryTable.map(row => ({ ...row }));
    }

    const result = [];
    primaryTable.forEach(pRow => {
        // Gematchte Zeilen aus der zweiten Tabelle suchen
        const matches = joinTable.filter(jRow => jRow[joinKey] === pRow[joinKey]);
        
        matches.forEach(mRow => {
            result.push({
                ...pRow,
                ...mRow // Spalten beider Tabellen zusammenführen
            });
        });
    });

    return result;
}

/**
 * PHASE 2: WHERE
 * Markiert Zeilen als gefiltert (`_isFiltered = true`), wenn sie das Prädikat nicht erfüllen.
 * Wichtig: Zeilen werden für die Visualisierung nicht gelöscht, sondern nur markiert!
 */
export function executeWhere(data = [], predicateFn) {
    if (typeof predicateFn !== 'function') {
        return data.map(row => ({ ...row }));
    }

    return data.map(row => {
        const isMatch = predicateFn(row);
        return {
            ...row,
            _isFiltered: !isMatch // Visuelles Flag für das Ausgrauen in der UI
        };
    });
}

/**
 * PHASE 3: GROUP BY
 * Partitioniert die aktiven (nicht gefilterten) Zeilen nach einem Schlüssel.
 */
export function executeGroupBy(data = [], groupKey = '') {
    if (!groupKey) return data;

    // Nur Zeilen verarbeiten, die Phase 2 überlebt haben
    const activeRows = data.filter(row => !row._isFiltered);

    const groups = activeRows.reduce((acc, row) => {
        const keyValue = row[groupKey];
        if (!acc[keyValue]) {
            acc[keyValue] = [];
        }
        acc[keyValue].push(row);
        return acc;
    }, {});

    return groups; // Gibt ein Objekt mit Gruppen-Arrays zurück: { "101": [...], "102": [...] }
}

/**
 * PHASE 4: HAVING
 * Filtert ganze Gruppen-Eimer basierend auf Aggregat-Bedingungen.
 */
export function executeHaving(groups = {}, havingFn) {
    if (typeof havingFn !== 'function') return groups;

    const filteredGroups = {};
    for (const [key, groupRows] of Object.entries(groups)) {
        if (havingFn(groupRows)) {
            filteredGroups[key] = groupRows;
        }
    }
    return filteredGroups;
}

/**
 * PHASE 5: SELECT (Projektion & Aggregation)
 * Transformiert die Gruppen (oder Einzelzeilen) in das finale Spalten-Format.
 */
export function executeSelect(dataOrGroups, selectConfigs = []) {
    // Fall A: Daten wurden in Phase 3 gruppiert (Objekt von Arrays)
    if (!Array.isArray(dataOrGroups)) {
        const result = [];

        for (const [groupKey, groupRows] of Object.entries(dataOrGroups)) {
            const projectedRow = {};

            selectConfigs.forEach(config => {
                const fieldName = config.label || config.field;

                if (config.aggregation === 'SUM') {
                    const sum = groupRows.reduce((acc, r) => acc + (Number(r[config.field]) || 0), 0);
                    projectedRow[fieldName] = sum;
                } else if (config.aggregation === 'COUNT') {
                    projectedRow[fieldName] = groupRows.length;
                } else {
                    // Normale Spalte: Wert aus der ersten Zeile der Gruppe übernehmen
                    projectedRow[fieldName] = groupRows[0] ? groupRows[0][config.field] : null;
                }
            });

            result.push(projectedRow);
        }
        return result;
    }

    // Fall B: Keine Gruppierung vorhanden (normales Array)
    const activeRows = dataOrGroups.filter(row => !row._isFiltered);
    return activeRows.map(row => {
        const projectedRow = {};
        selectConfigs.forEach(config => {
            const fieldName = config.label || config.field;
            projectedRow[fieldName] = row[config.field];
        });
        return projectedRow;
    });
}

/**
 * PHASE 6: ORDER BY
 * Sortiert die projizierte Ergebnistabelle auf- oder absteigend.
 */
export function executeOrderBy(data = [], sortConfig = { field: '', direction: 'ASC' }) {
    if (!sortConfig.field) return data;

    const sorted = [...data];
    const { field, direction } = sortConfig;

    sorted.sort((a, b) => {
        const valA = a[field];
        const valB = b[field];

        if (valA < valB) return direction === 'ASC' ? -1 : 1;
        if (valA > valB) return direction === 'ASC' ? 1 : -1;
        return 0;
    });

    return sorted;
}