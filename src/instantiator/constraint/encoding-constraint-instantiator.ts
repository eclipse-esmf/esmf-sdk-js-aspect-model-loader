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

import {MetaModelElementInstantiator} from '../meta-model-element-instantiator';
import {NamedNode, Quad} from 'n3';
import {Characteristic, DefaultEncodingConstraint} from '../../aspect-meta-model';
import {ConstraintInstantiator} from './constraint-instantiator';

export class EncodingConstraintInstantiator extends ConstraintInstantiator {
    constructor(metaModelElementInstantiator: MetaModelElementInstantiator, nextProcessor: ConstraintInstantiator) {
        super(metaModelElementInstantiator, nextProcessor);
    }

    protected processElement(quads: Array<Quad>): Characteristic {
        const samm = this.metaModelElementInstantiator.samm;
        const encodingConstraint = new DefaultEncodingConstraint(null, null, null, null);

        quads.forEach(quad => {
            if (samm.isValueProperty(quad.predicate.value)) {
                encodingConstraint.value = quad.object.value;
            }
        });

        return encodingConstraint;
    }

    shouldProcess(nameNode: NamedNode): boolean {
        return this.metaModelElementInstantiator.sammC.EncodingConstraint().equals(nameNode);
    }
}
