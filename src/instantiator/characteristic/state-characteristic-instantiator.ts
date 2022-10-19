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
import {NamedNode, Quad, Util} from 'n3';
import {Characteristic} from '../../aspect-meta-model';
import {DefaultState} from '../../aspect-meta-model/characteristic/default-state';
import {EnumerationCharacteristicInstantiator} from './enumeration-characteristic-instantiator';
import {Enumeration} from '../../aspect-meta-model/characteristic/default-enumeration';

export class StateCharacteristicInstantiator extends EnumerationCharacteristicInstantiator {
    constructor(metaModelElementInstantiator: MetaModelElementInstantiator, nextProcessor: CharacteristicInstantiator) {
        super(metaModelElementInstantiator, nextProcessor);
    }

    protected processElement(quads: Array<Quad>): Characteristic {
        const bammc = this.metaModelElementInstantiator.BAMMC();
        const stateCharacteristic = <DefaultState>super.processElement(quads);

        quads.forEach(quad => {
            if (bammc.isDefaultValueProperty(quad.predicate.value)) {
                stateCharacteristic.defaultValue = Util.isLiteral(quad.object) ? `${quad.object.value}` : this.resolveEntityInstance(quad);
            }
        });

        return stateCharacteristic;
    }

    protected creatEnumerationObject(): Enumeration {
        return new DefaultState(null, null, null, null, null);
    }

    shouldProcess(nameNode: NamedNode): boolean {
        return this.metaModelElementInstantiator.BAMMC().StateCharacteristic().equals(nameNode);
    }
}
