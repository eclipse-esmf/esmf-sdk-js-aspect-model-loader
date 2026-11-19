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
import {DefaultTimeSeries} from '../../aspect-meta-model/index.js';
import {SortedSetCharacteristicInstantiator} from './sorted-set-characteristic-instantiator.js';

export class TimeSeriesCharacteristicInstantiator extends SortedSetCharacteristicInstantiator {
    protected createCollectionObject(): DefaultTimeSeries {
        return new DefaultTimeSeries(null!, null!, null!, null!, null!);
    }

    shouldProcess(nameNode: NamedNode): boolean {
        return this.metaModelElementInstantiator.sammC.TimeSeriesCharacteristic().equals(nameNode);
    }
}
