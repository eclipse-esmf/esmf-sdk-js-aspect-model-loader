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

import {generateCharacteristic, getDataType} from '../characteristic/characteristic-instantiator';
import {Quad, Util} from 'n3';
import {DefaultState} from '../../aspect-meta-model/characteristic/default-state';
import {getEnumerationValues, resolveEntityInstance} from './enumeration-characteristic-instantiator';
import {getRdfModel} from '../../shared/rdf-model';
import {ScalarValue} from '../../aspect-meta-model/scalar-value';

export function createStateCharacteristic(quad: Quad): DefaultState {
    return generateCharacteristic(quad, (baseProperties, propertyQuads) => {
        const {samm, sammC} = getRdfModel();
        const characteristic = new DefaultState({
            ...baseProperties,
            dataType: getDataType(propertyQuads.find(propertyQuad => samm.isDataTypeProperty(propertyQuad.predicate.value))),
            values: [],
            defaultValue: null,
        });

        for (const propertyQuad of propertyQuads) {
            if (samm.isValueProperty(propertyQuad.predicate.value) || sammC.isValuesProperty(propertyQuad.predicate.value)) {
                if (Util.isBlankNode(propertyQuad.object)) {
                    characteristic.values = getEnumerationValues(propertyQuad, characteristic.dataType);
                }
            } else if (sammC.isDefaultValueProperty(quad.predicate.value)) {
                characteristic.defaultValue = Util.isLiteral(quad.object)
                    ? new ScalarValue({value: `${quad.object.value}`, type: characteristic.dataType})
                    : resolveEntityInstance(quad);
            }
        }
        return characteristic;
    });
}
