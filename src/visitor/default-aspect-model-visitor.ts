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
    Base,
    BaseMetaModelElement,
    Characteristic,
    Constraint,
    DefaultPropertyInstanceDefinition,
    Entity,
    Event,
    Operation,
    Property,
    QuantityKind,
    Unit,
    Value,
} from '../aspect-meta-model/index.js';
import {ModelVisitor} from './model-visitor.js';

export class DefaultAspectModelVisitor<T, U> implements ModelVisitor<T, U> {
    skipProperties: Array<string> = ['_wrappedProperty', '_parents'];

    /**
     * Visits each element and performs an operation on it.
     *
     * @param {BaseMetaModelElement} element element to visit.
     * @param {U} context context for visiting the element.
     * @return {T} result of visiting the element.
     */
    visit(element: BaseMetaModelElement, context: U): T {
        const item: U = element.accept(this as unknown as ModelVisitor<U, U>, context);
        this.getObjectKeys(element).forEach(attributeKey => {
            const attributeValue = this.getValue(attributeKey, element);
            if (this.skipProperties.find(prop => attributeKey === prop) == undefined) {
                if (this.isPropertyInstanceDefinition(attributeValue)) {
                    return this.visit(attributeValue, item);
                } else if (Array.isArray(attributeValue)) {
                    attributeValue.forEach(arrayElement => {
                        if (this.isPropertyInstanceDefinition(arrayElement)) {
                            return this.visit(arrayElement, item);
                        }
                    });
                }
            }
        });
        return null!;
    }

    private getObjectKeys(element: BaseMetaModelElement): Array<string> {
        return Object.keys(element instanceof DefaultPropertyInstanceDefinition ? element.wrappedProperty : element);
    }

    private getValue(key: string, element: BaseMetaModelElement): unknown {
        return element instanceof DefaultPropertyInstanceDefinition
            ? (element.wrappedProperty as unknown as Record<string, unknown>)[key]
            : (element as unknown as Record<string, unknown>)[key];
    }

    private isPropertyInstanceDefinition(attributeValue: unknown): attributeValue is BaseMetaModelElement {
        return attributeValue instanceof Base || attributeValue instanceof DefaultPropertyInstanceDefinition;
    }

    visitAspect(_aspect: Aspect, _context: U): T {
        return undefined!;
    }

    visitCharacteristic(_characteristic: Characteristic, _context: U): T {
        return undefined!;
    }

    visitConstraint(_constraint: Constraint, _context: U): T {
        return undefined!;
    }

    visitEntity(_entity: Entity, _context: U): T {
        return undefined!;
    }

    visitOperation(_operation: Operation, _context: U): T {
        return undefined!;
    }

    visitEvent(_unit: Event, _context: U): T {
        return undefined!;
    }

    visitProperty(_property: Property, _context: U): T {
        return undefined!;
    }

    visitQuantityKind(_quantityKind: QuantityKind, _context: U): T {
        return undefined!;
    }

    visitUnit(_unit: Unit, _context: U): T {
        return undefined!;
    }

    visitValue(_value: Value, _context: U): T {
        return undefined!;
    }
}
