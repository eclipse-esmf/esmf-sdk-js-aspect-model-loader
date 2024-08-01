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

import {DefaultEnumeration, Enumeration} from './default-enumeration';
import {StateProps} from '../../shared/props';
import {Value} from '../value';

export interface State extends Enumeration {
    defaultValue: Value;
    getDefaultValue(): Value;
}

export class DefaultState extends DefaultEnumeration implements State {
    defaultValue: Value;

    constructor(props: StateProps) {
        super(props);
        this.defaultValue = props.defaultValue;
    }

    getDefaultValue(): Value {
        return this.defaultValue;
    }
}
