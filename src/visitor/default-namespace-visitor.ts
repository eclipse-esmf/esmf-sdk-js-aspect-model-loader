/*
 * Copyright (c) 2023 Robert Bosch Manufacturing Solutions GmbH
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
} from '../aspect-meta-model';
import {ModelVisitor} from './model-visitor';

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
            const modelElements: Array<BaseMetaModelElement> = map.get(mapKey);
            for (const element of modelElements) {
                element.accept(this, map);
            }
        }
    }

    visitAspect(aspect: Aspect, context: Map<string, Array<BaseMetaModelElement>>): BaseMetaModelElement {
        return undefined;
    }

    visitCharacteristic(characteristic: Characteristic, context: Map<string, Array<BaseMetaModelElement>>): BaseMetaModelElement {
        return undefined;
    }

    visitConstraint(constraint: Constraint, context: Map<string, Array<BaseMetaModelElement>>): BaseMetaModelElement {
        return undefined;
    }

    visitEntity(entity: Entity, context: Map<string, Array<BaseMetaModelElement>>): BaseMetaModelElement {
        return undefined;
    }

    visitOperation(operation: Operation, context: Map<string, Array<BaseMetaModelElement>>): BaseMetaModelElement {
        return undefined;
    }

    visitEvent(unit: Event, context: Map<string, Array<BaseMetaModelElement>>): BaseMetaModelElement {
        return undefined;
    }

    visitProperty(property: Property, context: Map<string, Array<BaseMetaModelElement>>): BaseMetaModelElement {
        return undefined;
    }

    visitQuantityKind(quantityKind: QuantityKind, context: Map<string, Array<BaseMetaModelElement>>): BaseMetaModelElement {
        return undefined;
    }

    visitUnit(unit: Unit, context: Map<string, Array<BaseMetaModelElement>>): BaseMetaModelElement {
        return undefined;
    }
}
