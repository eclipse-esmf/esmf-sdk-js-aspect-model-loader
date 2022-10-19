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

import {CharacteristicInstantiator} from '../characteristic/characteristic-instantiator';
import {MetaModelElementInstantiator} from '../meta-model-element-instantiator';
import {NamedNode, Quad} from 'n3';
import {Characteristic, Collection} from '../../aspect-meta-model';
import {DefaultCollection} from '../../aspect-meta-model/characteristic/default-collection';

export class CollectionCharacteristicInstantiator extends CharacteristicInstantiator {
    constructor(metaModelElementInstantiator: MetaModelElementInstantiator, nextProcessor: CharacteristicInstantiator) {
        super(metaModelElementInstantiator, nextProcessor);
    }

    protected processElement(quads: Array<Quad>): Characteristic {
        return this.initProperties(this.creatCollectionObject(), quads);
    }

    /**
     * Override the method in the corresponding specific collection class to create the correct type of
     * collection e.g. see ListCharacteristicInstantiator.
     */
    protected creatCollectionObject(): Collection {
        return new DefaultCollection(null, null, null, true, false, null);
    }

    private initProperties(collectionCharacteristic: Collection, quads: Array<Quad>): Collection {
        const bamm = this.metaModelElementInstantiator.BAMM();
        const bammc = this.metaModelElementInstantiator.BAMMC();
        quads.forEach(quad => {
            if (bamm.isDataTypeProperty(quad.predicate.value)) {
                collectionCharacteristic.dataType = this.getDataType(quad);
            } else if (bammc.isAllowDuplicatesProperty(quad.predicate.value)) {
                collectionCharacteristic.isAllowDuplicates = Boolean(quad.object.value);
            } else if (bammc.isOrderedProperty(quad.predicate.value)) {
                collectionCharacteristic.isOrdered = Boolean(quad.object.value);
            } else if (bammc.isElementCharacteristicProperty(quad.predicate.value)) {
                collectionCharacteristic.elementCharacteristic = this.create(quad);
            }
        });
        return collectionCharacteristic;
    }

    shouldProcess(nameNode: NamedNode): boolean {
        return this.metaModelElementInstantiator.BAMMC().CollectionCharacteristic().equals(nameNode);
    }
}
