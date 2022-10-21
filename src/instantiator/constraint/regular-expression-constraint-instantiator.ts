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

import {MetaModelElementInstantiator} from '../meta-model-element-instantiator';
import {NamedNode, Quad} from 'n3';
import {Characteristic} from '../../aspect-meta-model/characteristic/default-characteristic';
import {DefaultRegularExpressionConstraint} from '../../aspect-meta-model/constraint/default-regular-expression-constraint';
import {ConstraintInstantiator} from './constraint-instantiator';

export class RegularExpressionConstraintInstantiator extends ConstraintInstantiator {
    constructor(metaModelElementInstantiator: MetaModelElementInstantiator, nextProcessor: ConstraintInstantiator) {
        super(metaModelElementInstantiator, nextProcessor);
    }

    protected processElement(quads: Array<Quad>): Characteristic {
        const bamm = this.metaModelElementInstantiator.BAMM();
        const encodingConstraint = new DefaultRegularExpressionConstraint(null, null, null, null);

        quads.forEach(quad => {
            if (bamm.isValueProperty(quad.predicate.value)) {
                encodingConstraint.value = quad.object.value;
            }
        });

        return encodingConstraint;
    }

    shouldProcess(nameNode: NamedNode): boolean {
        return this.metaModelElementInstantiator.BAMMC().RegularExpressionConstraint().equals(nameNode);
    }
}
