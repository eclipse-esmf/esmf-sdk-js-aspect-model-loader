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

import {NamedNode, Quad} from 'n3';
import {Characteristic, DefaultLanguageConstraint} from '../../aspect-meta-model';
import {MetaModelElementInstantiator} from '../meta-model-element-instantiator';
import {ConstraintInstantiator} from './constraint-instantiator';

export class LanguageConstraintInstantiator extends ConstraintInstantiator {
    constructor(metaModelElementInstantiator: MetaModelElementInstantiator, nextProcessor: ConstraintInstantiator) {
        super(metaModelElementInstantiator, nextProcessor);
    }

    protected processElement(quads: Array<Quad>): Characteristic {
        const sammC = this.metaModelElementInstantiator.sammC;
        const defaultLanguageConstraint = new DefaultLanguageConstraint(null, null, null, null);

        quads.forEach(quad => {
            if (sammC.isLanguageCodeProperty(quad.predicate.value)) {
                defaultLanguageConstraint.languageCode = quad.object.value;
            }
        });

        return defaultLanguageConstraint;
    }

    shouldProcess(nameNode: NamedNode): boolean {
        return this.metaModelElementInstantiator.sammC.LanguageConstraint().equals(nameNode);
    }
}
