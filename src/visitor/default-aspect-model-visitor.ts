/*
 * Copyright (c) 2022 Robert Bosch Manufacturing Solutions GmbH
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

import {AspectModelVisitor} from './aspect-model-visitor';
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
} from '../aspect-meta-model';

export class DefaultAspectModelVisitor<T, U> implements AspectModelVisitor<T, U> {
    skipProperties: Array<string> = ['_wrappedProperty', '_parents'];

    private getObjectKeys(element: BaseMetaModelElement): Array<string> {
        return Object.keys(element instanceof DefaultPropertyInstanceDefinition ? element.wrappedProperty : element);
    }

    private getValue(key: string, element: BaseMetaModelElement): any {
        return element instanceof DefaultPropertyInstanceDefinition ? element.wrappedProperty[key] : element[key];
    }

    private isPropertyInstanceDefinition(attributeValue: any): boolean {
        return attributeValue instanceof Base || attributeValue instanceof DefaultPropertyInstanceDefinition;
    }

    visit(element: BaseMetaModelElement, context: U): T {
        const item: U = element.accept(<any>this, context);
        this.getObjectKeys(element).forEach(attributeKey => {
            const attributeValue: any = this.getValue(attributeKey, element);
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
        return null;
    }

    visitAspect(aspect: Aspect, context: U): T {
        return undefined;
    }

    visitCharacteristic(characteristic: Characteristic, context: U): T {
        return undefined;
    }

    visitConstraint(constraint: Constraint, context: U): T {
        return undefined;
    }

    visitEntity(entity: Entity, context: U): T {
        return undefined;
    }

    visitOperation(operation: Operation, context: U): T {
        return undefined;
    }

    visitEvent(unit: Event, context: U): T {
        return undefined;
    }

    visitProperty(property: Property, context: U): T {
        return undefined;
    }

    visitQuantityKind(quantityKind: QuantityKind, context: U): T {
        return undefined;
    }

    visitUnit(unit: Unit, context: U): T {
        return undefined;
    }
}
