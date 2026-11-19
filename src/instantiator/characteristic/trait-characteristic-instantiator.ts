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

import {NamedNode, Quad} from 'n3';
import {CharacteristicInstantiator} from './characteristic-instantiator.js';
import {Characteristic, Constraint, DefaultCharacteristic, DefaultConstraint, DefaultTrait} from '../../aspect-meta-model/index.js';

export class TraitCharacteristicInstantiator extends CharacteristicInstantiator {
    protected processElement(quads: Array<Quad>): Characteristic {
        const sammC = this.metaModelElementInstantiator.sammC;
        const trait = new DefaultTrait(null!, null!, null!, null!, new Array<Constraint>());

        quads.forEach(quad => {
            if (sammC.isBaseCharacteristicProperty(quad.predicate.value)) {
                trait.baseCharacteristic = this.metaModelElementInstantiator.getCharacteristic(quad);
                (trait.baseCharacteristic as DefaultCharacteristic).addParent(trait);
            } else if (sammC.isConstraintProperty(quad.predicate.value)) {
                const constraint = this.metaModelElementInstantiator.getConstraint(quad);
                (constraint as DefaultConstraint).addParent(trait);
                trait.constraints!.push(constraint);
            }
        });

        return trait;
    }

    shouldProcess(nameNode: NamedNode): boolean {
        return this.metaModelElementInstantiator.sammC.TraitCharacteristic().equals(nameNode);
    }
}
