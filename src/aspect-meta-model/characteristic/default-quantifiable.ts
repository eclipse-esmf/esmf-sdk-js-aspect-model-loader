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

import {Unit} from '../default-unit';
import {Characteristic, DefaultCharacteristic} from './default-characteristic';
import {QuantifiableProps} from '../../shared/props';

export interface Quantifiable extends Characteristic {
    unit?: Unit;
}

export class DefaultQuantifiable extends DefaultCharacteristic implements Quantifiable {
    unit?: Unit;

    constructor(props: QuantifiableProps) {
        super(props);
        this.unit = props.unit;
    }

    getUnit(): Unit {
        return this.unit;
    }
}
