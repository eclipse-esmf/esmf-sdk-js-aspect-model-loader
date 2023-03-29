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
import {DefaultEither} from '../../aspect-meta-model/characteristic/default-either';

export class EitherCharacteristicInstantiator extends CharacteristicInstantiator {
    constructor(metaModelElementInstantiator: MetaModelElementInstantiator, nextProcessor: CharacteristicInstantiator) {
        super(metaModelElementInstantiator, nextProcessor);
    }

    protected processElement(quads: Array<Quad>): Characteristic {
        const sammC = this.metaModelElementInstantiator.sammC;
        const defaultEither = new DefaultEither(null, null, null, null, null);
        quads.forEach(quad => {
            if (sammC.isEitherLeftProperty(quad.predicate.value)) {
                defaultEither.left = this.metaModelElementInstantiator.getCharacteristic(quad);
            } else if (sammC.isEitherRightProperty(quad.predicate.value)) {
                defaultEither.right = this.metaModelElementInstantiator.getCharacteristic(quad);
            }
        });

        return defaultEither;
    }

    shouldProcess(nameNode: NamedNode): boolean {
        return this.metaModelElementInstantiator.sammC.EitherCharacteristic().equals(nameNode);
    }
}
