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

import {NamedNode, Quad, Util} from 'n3';
import {Characteristic, Enumeration} from '../../aspect-meta-model/index.js';
import {DefaultState} from '../../aspect-meta-model/characteristic/default-state.js';
import {EnumerationCharacteristicInstantiator} from './enumeration-characteristic-instantiator.js';

export class StateCharacteristicInstantiator extends EnumerationCharacteristicInstantiator {
    protected processElement(quads: Array<Quad>): Characteristic {
        const sammC = this.metaModelElementInstantiator.sammC;
        const stateCharacteristic = <DefaultState>super.processElement(quads);

        const dataType = quads.find(quad => this.metaModelElementInstantiator.samm.isDataTypeProperty(quad.predicate.value));

        quads.forEach(quad => {
            if (sammC.isDefaultValueProperty(quad.predicate.value)) {
                stateCharacteristic.defaultValue = Util.isLiteral(quad.object)
                    ? `${quad.object.value}`
                    : this.resolveValue(quad, dataType?.object.value as string);
            }
        });

        return stateCharacteristic;
    }

    protected createEnumerationObject(): Enumeration {
        return new DefaultState(null!, null!, null!, null!, null!);
    }

    shouldProcess(nameNode: NamedNode): boolean {
        return this.metaModelElementInstantiator.sammC.StateCharacteristic().equals(nameNode);
    }
}
