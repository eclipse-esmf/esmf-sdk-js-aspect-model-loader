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

import {Characteristic} from './default-characteristic.js';
import {Type} from '../type.js';
import {DefaultSortedSet} from './default-sorted-set.js';

export class DefaultTimeSeries extends DefaultSortedSet {
    constructor(metaModelVersion: string, aspectModelUrn: string, name: string, elementCharacteristic?: Characteristic, dataType?: Type) {
        super(metaModelVersion, aspectModelUrn, name, elementCharacteristic, dataType);
    }
}
