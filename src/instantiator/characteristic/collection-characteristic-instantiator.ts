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

import {CharacteristicInstantiator} from '../characteristic/characteristic-instantiator.js';
import {NamedNode, Quad} from 'n3';
import {Characteristic, Collection} from '../../aspect-meta-model/index.js';
import {DefaultCollection} from '../../aspect-meta-model/characteristic/default-collection.js';

export class CollectionCharacteristicInstantiator extends CharacteristicInstantiator {
    protected processElement(quads: Array<Quad>): Characteristic {
        return this.initProperties(this.createCollectionObject(), quads);
    }

    /**
     * Override the method in the corresponding specific collection class to create the correct type of
     * collection e.g. see ListCharacteristicInstantiator.
     */
    protected createCollectionObject(): Collection {
        return new DefaultCollection(null!, null!, null!, true, false, null!);
    }

    private initProperties(collectionCharacteristic: Collection, quads: Array<Quad>): Collection {
        const samm = this.metaModelElementInstantiator.samm;
        const sammC = this.metaModelElementInstantiator.sammC;
        quads.forEach(quad => {
            if (samm.isDataTypeProperty(quad.predicate.value)) {
                collectionCharacteristic.dataType = this.getDataType(quad);
            } else if (sammC.isAllowDuplicatesProperty(quad.predicate.value)) {
                collectionCharacteristic.isAllowDuplicates = Boolean(quad.object.value);
            } else if (sammC.isOrderedProperty(quad.predicate.value)) {
                collectionCharacteristic.isOrdered = Boolean(quad.object.value);
            } else if (sammC.isElementCharacteristicProperty(quad.predicate.value)) {
                collectionCharacteristic.elementCharacteristic = this.metaModelElementInstantiator.getCharacteristic(quad);
            }
        });
        return collectionCharacteristic;
    }

    shouldProcess(nameNode: NamedNode): boolean {
        return this.metaModelElementInstantiator.sammC.CollectionCharacteristic().equals(nameNode);
    }
}
