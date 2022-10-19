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

import {CharacteristicInstantiator} from './characteristic-instantiator';
import {MetaModelElementInstantiator} from '../meta-model-element-instantiator';
import {NamedNode, Quad, Util} from 'n3';
import {Characteristic} from '../../aspect-meta-model';
import {DefaultStructuredValue} from '../../aspect-meta-model/characteristic/default-structured-value';
import {PropertyInstantiator} from '../property-instantiator';

export class StructuredValueCharacteristicInstantiator extends CharacteristicInstantiator {
    constructor(metaModelElementInstantiator: MetaModelElementInstantiator, nextProcessor: CharacteristicInstantiator) {
        super(metaModelElementInstantiator, nextProcessor);
    }

    protected processElement(quads: Array<Quad>): Characteristic {
        const bammc = this.metaModelElementInstantiator.BAMMC();
        const structuredValueCharacteristic = new DefaultStructuredValue(null, null, null, null, null, null);
        const property = new PropertyInstantiator(this.metaModelElementInstantiator);
        quads.forEach(quad => {
            if (bammc.isDeconstructionRuleProperty(quad.predicate.value)) {
                structuredValueCharacteristic.deconstructionRule = quad.object.value;
            } else if (bammc.isElementsProperty(quad.predicate.value)) {
                structuredValueCharacteristic.elements = [];
                const structuredValueElementsQuad = this.metaModelElementInstantiator.rdfModel.resolveBlankNodes(quad.object.value);
                structuredValueCharacteristic.elements = structuredValueElementsQuad.map(elementQuad => {
                    if (Util.isNamedNode(elementQuad.object)) {
                        return property.createProperty(elementQuad);
                    }
                    return elementQuad.object.value;
                });
            }
        });

        return structuredValueCharacteristic;
    }

    shouldProcess(nameNode: NamedNode): boolean {
        return this.metaModelElementInstantiator.BAMMC().StructuredValueCharacteristic().equals(nameNode);
    }
}
