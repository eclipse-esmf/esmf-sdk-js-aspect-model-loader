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

import {Quad} from 'n3';
import {Constraint, DefaultConstraint} from '../../aspect-meta-model';
import {MetaModelElementInstantiator} from '../meta-model-element-instantiator';
import {BaseConstraintCharacteristicInstantiator} from '../base-constraint-characteristic-instantiator';

export class ConstraintInstantiator extends BaseConstraintCharacteristicInstantiator {
    constructor(metaModelElementInstantiator: MetaModelElementInstantiator, nextProcessor: ConstraintInstantiator) {
        super(metaModelElementInstantiator, nextProcessor);
    }

    create(quad: Quad): Constraint {
        const constraint = super.create(quad);

        // Anonymous nodes are stored in the array for later processing of the name

        if ((constraint as DefaultConstraint).isAnonymousNode) {
            const initialName: string = constraint.name;

            // assign a unique random name
            constraint.name = constraint.name ? constraint.name : 'constraint_' + Math.random().toString(36).substr(2, 9);
            constraint.aspectModelUrn = `${this.metaModelElementInstantiator.rdfModel.getAspectModelUrn()}${constraint.name}`;
            this.metaModelElementInstantiator.cacheService.addElement(initialName, constraint);
        }

        return <DefaultConstraint>this.metaModelElementInstantiator.cacheService.resolveInstance(constraint);
    }

    protected processElement(quads: Array<Quad>): Constraint {
        return new DefaultConstraint(null, null, 'Constraint');
    }
}
