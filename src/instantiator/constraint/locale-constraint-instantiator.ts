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

import {Quad} from 'n3';
import {DefaultLocaleConstraint} from '../../aspect-meta-model';
import {generateConstraint} from './constraint-instantiator';
import {getRdfModel} from '../../shared/rdf-model';

export function createLocaleConstraint(quad: Quad): DefaultLocaleConstraint {
    return generateConstraint(quad, (baseProperties, propertyQuads) => {
        const {sammC} = getRdfModel();
        const constraint = new DefaultLocaleConstraint({...baseProperties, localeCode: null});
        for (const propertyQuad of propertyQuads) {
            if (sammC.isLocaleCodeProperty(propertyQuad.predicate.value)) {
                constraint.localeCode = propertyQuad.object.value;
            }
        }
        return constraint;
    });
}
