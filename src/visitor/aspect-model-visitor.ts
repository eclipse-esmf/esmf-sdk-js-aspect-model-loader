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

import {BaseMetaModelElement} from '../aspect-meta-model/base';
import {Entity} from '../aspect-meta-model/default-entity';
import {Property} from '../aspect-meta-model/default-property';
import {Aspect} from '../aspect-meta-model/default-aspect';
import {Constraint} from '../aspect-meta-model/constraint/default-constraint';
import {Characteristic} from '../aspect-meta-model/characteristic/default-characteristic';
import {Unit} from '../aspect-meta-model/default-unit';
import {Operation} from '../aspect-meta-model/default-operation';
import {QuantityKind} from '../aspect-meta-model/default-quantity-kind';
import {Event} from '../aspect-meta-model';

export interface AspectModelVisitor<T, U> {
    visit(metalModelElement: BaseMetaModelElement, context: U): T;

    visitProperty(property: Property, context: U): T;

    visitAspect(aspect: Aspect, context: U): T;

    visitOperation(operation: Operation, context: U): T;

    visitConstraint(constraint: Constraint, context: U): T;

    visitCharacteristic(characteristic: Characteristic, context: U): T;

    visitUnit(unit: Unit, context: U): T;

    visitQuantityKind(quantityKind: QuantityKind, context: U): T;

    visitEntity(entity: Entity, context: U): T;

    visitEvent(entity: Event, context: U): T;
}
