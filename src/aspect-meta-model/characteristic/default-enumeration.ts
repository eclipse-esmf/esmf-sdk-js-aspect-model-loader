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
import {Characteristic, DefaultCharacteristic} from './default-characteristic';
import {DefaultEntityInstance, EntityInstance} from '../default-entity-instance';
import {DefaultEntity} from '../default-entity';
import {EnumerationProps} from '../../shared/props';
import {Value} from '../value';
import {ComplexType} from '../complex-type';

export interface Enumeration extends Characteristic {
    values: Value[];
}

export class DefaultEnumeration extends DefaultCharacteristic implements Enumeration {
    values: Value[];

    constructor(props: EnumerationProps) {
        super(props);
        this.values = props.values || [];
    }

    getValues(): Value[] {
        return this.values;
    }

    getValue(valueOrUrn: string): Value | EntityInstance {
        return this.values.find(v => {
            if (v instanceof DefaultEntityInstance && v.aspectModelUrn === valueOrUrn) {
                return true;
            }

            return v.value === valueOrUrn;
        });
    }
}
