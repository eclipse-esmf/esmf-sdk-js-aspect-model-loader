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

import {NamedNode, Quad} from 'n3';
import {Characteristic, DefaultLengthConstraint} from '../../aspect-meta-model';
import {MetaModelElementInstantiator} from '../meta-model-element-instantiator';
import {ConstraintInstantiator} from './constraint-instantiator';

export class LengthConstraintInstantiator extends ConstraintInstantiator {
    constructor(metaModelElementInstantiator: MetaModelElementInstantiator, nextProcessor: ConstraintInstantiator) {
        super(metaModelElementInstantiator, nextProcessor);
    }

    protected processElement(quads: Array<Quad>): Characteristic {
        const bammc = this.metaModelElementInstantiator.BAMMC();
        const defaultLanguageConstraint = new DefaultLengthConstraint(null, null, null, null, null);

        quads.forEach(quad => {
            if (bammc.isMinValueProperty(quad.predicate.value)) {
                defaultLanguageConstraint.minValue = Number(quad.object.value);
            } else if (bammc.isMaxValueProperty(quad.predicate.value)) {
                defaultLanguageConstraint.maxValue = Number(quad.object.value);
            }
        });

        return defaultLanguageConstraint;
    }

    shouldProcess(nameNode: NamedNode): boolean {
        return this.metaModelElementInstantiator.BAMMC().LengthConstraint().equals(nameNode);
    }
}
