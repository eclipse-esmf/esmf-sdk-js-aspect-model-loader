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

import {CharacteristicInstantiator} from '../characteristic/characteristic-instantiator';
import {MetaModelElementInstantiator} from '../meta-model-element-instantiator';
import {NamedNode, Quad} from 'n3';
import {Characteristic} from '../../aspect-meta-model';
import {DefaultSingleEntity} from '../../aspect-meta-model/characteristic/default-single-entity';

export class SingleEntityInstantiator extends CharacteristicInstantiator {
    constructor(metaModelElementInstantiator: MetaModelElementInstantiator, nextProcessor: CharacteristicInstantiator) {
        super(metaModelElementInstantiator, nextProcessor);
    }

    protected processElement(quads: Array<Quad>): Characteristic {
        const samm = this.metaModelElementInstantiator.samm;
        const defaultSingleEntity = new DefaultSingleEntity(null, null, null, null);

        this.metaModelElementInstantiator.initBaseProperties(quads, defaultSingleEntity, this.metaModelElementInstantiator.rdfModel);

        quads.forEach(quad => {
            if (samm.isDataTypeProperty(quad.predicate.value)) {
                defaultSingleEntity.dataType = this.getDataType(quad);
            }
        });

        return defaultSingleEntity;
    }

    shouldProcess(nameNode: NamedNode): boolean {
        return this.metaModelElementInstantiator.sammC.SingleEntityCharacteristic().equals(nameNode);
    }
}
