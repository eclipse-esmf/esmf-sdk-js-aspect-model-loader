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

import {NamedNode} from 'n3';
import {Collection} from '../../aspect-meta-model/index.js';
import {CollectionCharacteristicInstantiator} from './collection-characteristic-instantiator.js';
import {DefaultSet} from '../../aspect-meta-model/characteristic/default-set.js';

export class SetCharacteristicInstantiator extends CollectionCharacteristicInstantiator {
    protected createCollectionObject(): Collection {
        return new DefaultSet(null!, null!, null!, null!);
    }

    shouldProcess(nameNode: NamedNode): boolean {
        return this.metaModelElementInstantiator.sammC.SetCharacteristic().equals(nameNode);
    }
}
