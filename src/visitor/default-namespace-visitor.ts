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

import {
    Aspect,
    BaseMetaModelElement,
    Characteristic,
    Constraint,
    Entity,
    Event,
    Operation,
    Property,
    QuantityKind,
    Unit,
    Value,
} from '../aspect-meta-model/index.js';
import {ModelVisitor} from './model-visitor.js';

/**
 * Default visitor to traverse alle concepts defined within the different namespaces.
 */
export class DefaultNamespaceVisitor implements ModelVisitor<BaseMetaModelElement, Map<string, Array<BaseMetaModelElement>>> {
    /**
     * Visits each element in the provided map and performs an operation on it.
     *
     * @param {Map<string, Array<BaseMetaModelElement>>} map map of elements to visit. The key represents the namespace of the elements of the array.
     */
    public visit(map: Map<string, Array<BaseMetaModelElement>>): void {
        for (const mapKey of map.keys()) {
            const modelElements: Array<BaseMetaModelElement> = map.get(mapKey)!;
            for (const element of modelElements) {
                element.accept(this, map);
            }
        }
    }

    visitAspect(_aspect: Aspect, _context: Map<string, Array<BaseMetaModelElement>>): BaseMetaModelElement {
        return undefined!;
    }

    visitCharacteristic(_characteristic: Characteristic, _context: Map<string, Array<BaseMetaModelElement>>): BaseMetaModelElement {
        return undefined!;
    }

    visitConstraint(_constraint: Constraint, _context: Map<string, Array<BaseMetaModelElement>>): BaseMetaModelElement {
        return undefined!;
    }

    visitEntity(_entity: Entity, _context: Map<string, Array<BaseMetaModelElement>>): BaseMetaModelElement {
        return undefined!;
    }

    visitOperation(_operation: Operation, _context: Map<string, Array<BaseMetaModelElement>>): BaseMetaModelElement {
        return undefined!;
    }

    visitEvent(_unit: Event, _context: Map<string, Array<BaseMetaModelElement>>): BaseMetaModelElement {
        return undefined!;
    }

    visitProperty(_property: Property, _context: Map<string, Array<BaseMetaModelElement>>): BaseMetaModelElement {
        return undefined!;
    }

    visitQuantityKind(_quantityKind: QuantityKind, _context: Map<string, Array<BaseMetaModelElement>>): BaseMetaModelElement {
        return undefined!;
    }

    visitUnit(_unit: Unit, _context: Map<string, Array<BaseMetaModelElement>>): BaseMetaModelElement {
        return undefined!;
    }

    visitValue(_value: Value, _context: Map<string, Array<BaseMetaModelElement>>): BaseMetaModelElement {
        return undefined!;
    }
}
