/*
 * Copyright (c) 2026 Robert Bosch Manufacturing Solutions GmbH
 *
 * See the AUTHORS file(s) distributed with this work for
 * additional information regarding authorship.
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/.
 *
 * SPDX-License-Identifier: MPL-2.0
 */

import {SammU} from '../vocabulary/index.js';
import {QUANTITY_KIND_ROWS, UNIT_ROWS} from './units-data.js';

export interface QuantityKindData {
    name: string;
    label: string;
}

export interface UnitData {
    name: string;
    label: string;
    symbol: string | null;
    code: string | null;
    referenceUnit: (() => UnitData) | null;
    conversionFactor: string | null;
    quantityKinds: string[] | null;
}

let quantityKinds: Record<string, QuantityKindData> | undefined;
let units: Record<string, UnitData> | undefined;

function getQuantityKinds(): Record<string, QuantityKindData> {
    quantityKinds ??= Object.fromEntries(QUANTITY_KIND_ROWS.map(([name, label]) => [name, {name, label}]));
    return quantityKinds;
}

function getUnits(): Record<string, UnitData> {
    if (!units) {
        const table: Record<string, UnitData> = {};
        for (const [name, label, symbol, code, referenceUnit, conversionFactor, unitQuantityKinds] of UNIT_ROWS) {
            table[name] = {
                name,
                label,
                symbol,
                code,
                referenceUnit: referenceUnit ? () => table[referenceUnit] : null,
                conversionFactor,
                quantityKinds: unitQuantityKinds ? [...unitQuantityKinds] : null,
            };
        }
        units = table;
    }
    return units;
}

export class Units {
    constructor(private sammU: SammU) {}

    getUnit(name: string): UnitData | undefined {
        return getUnits()[name.replace(this.sammU.getNamespace(), '')];
    }

    getQuantityKind(name: string): QuantityKindData | undefined {
        return getQuantityKinds()[name.replace(this.sammU.getNamespace(), '')];
    }

    getSupportedQuantityKindsNames(): Array<string> {
        return Object.keys(getQuantityKinds());
    }

    getSupportedUnitNames(): Array<string> {
        return Object.keys(getUnits());
    }
}
