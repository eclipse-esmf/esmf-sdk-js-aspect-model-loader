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
import {DefaultList} from '../../aspect-meta-model/characteristic/default-list.js';
import {CollectionCharacteristicInstantiator} from './collection-characteristic-instantiator.js';

export class ListCharacteristicInstantiator extends CollectionCharacteristicInstantiator {
    protected createCollectionObject(): Collection {
        return new DefaultList(null!, null!, null!, null!);
    }

    shouldProcess(nameNode: NamedNode): boolean {
        return this.metaModelElementInstantiator.sammC.ListCharacteristic().equals(nameNode);
    }
}
