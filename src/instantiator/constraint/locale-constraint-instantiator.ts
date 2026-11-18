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
import {Characteristic, DefaultLocaleConstraint} from '../../aspect-meta-model/index.js';
import {ConstraintInstantiator} from './constraint-instantiator.js';

export class LocaleConstraintInstantiator extends ConstraintInstantiator {
    protected processElement(quads: Array<Quad>): Characteristic {
        const sammC = this.metaModelElementInstantiator.sammC;
        const defaultLocaleConstraint = new DefaultLocaleConstraint(null!, null!, null!, null!);

        quads.forEach(quad => {
            if (sammC.isLocaleCodeProperty(quad.predicate.value)) {
                defaultLocaleConstraint.localeCode = quad.object.value;
            }
        });

        return defaultLocaleConstraint;
    }

    shouldProcess(nameNode: NamedNode): boolean {
        return this.metaModelElementInstantiator.sammC.LocaleConstraint().equals(nameNode);
    }
}
