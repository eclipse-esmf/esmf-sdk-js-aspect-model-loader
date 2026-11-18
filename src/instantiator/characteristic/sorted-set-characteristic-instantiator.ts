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

import {CollectionCharacteristicInstantiator} from './collection-characteristic-instantiator.js';
import {DefaultSortedSet} from '../../aspect-meta-model/characteristic/default-sorted-set.js';

import {NamedNode, Quad, Util} from 'n3';
import {Characteristic} from '../../aspect-meta-model/index.js';
import {DefaultEntityInstance} from '../../aspect-meta-model/default-entity-instance.js';
import {CharacteristicInstantiatorUtil} from './characteristic-instantiator-util.js';
import {EntityInstanceResolver} from './entity-instance-resolver.js';

export class SortedSetCharacteristicInstantiator extends CollectionCharacteristicInstantiator {
    protected processElement(quads: Array<Quad>): Characteristic {
        const samm = this.metaModelElementInstantiator.samm;
        const sammC = this.metaModelElementInstantiator.sammC;
        const sortedSet = this.createCollectionObject();

        const dataType = quads.find(quad => this.samm.isDataTypeProperty(quad.predicate.value));

        quads.forEach(quad => {
            if (samm.isValueProperty(quad.predicate.value) || sammC.isValuesProperty(quad.predicate.value)) {
                if (Util.isBlankNode(quad.object)) {
                    sortedSet.values = this.getEnumerationValues(quad, dataType?.object.value as string);
                }
            }
        });
        return sortedSet;
    }

    protected createCollectionObject(): DefaultSortedSet {
        return new DefaultSortedSet(null!, null!, null!, null!);
    }

    shouldProcess(nameNode: NamedNode): boolean {
        return this.metaModelElementInstantiator.sammC.SortedSetCharacteristic().equals(nameNode);
    }

    protected resolveEntityInstance(quad: Quad): DefaultEntityInstance {
        return new EntityInstanceResolver(this.metaModelElementInstantiator).resolve(quad);
    }

    private getEnumerationValues(quad: Quad, dataType: string): Array<string | number | DefaultEntityInstance> {
        const quads = this.metaModelElementInstantiator.rdfModel.resolveBlankNodes(quad.object.value);
        return quads.map(quadValue =>
            Util.isLiteral(quadValue.object)
                ? CharacteristicInstantiatorUtil.resolveValues(quadValue, dataType)
                : this.resolveEntityInstance(quadValue)
        );
    }
}
