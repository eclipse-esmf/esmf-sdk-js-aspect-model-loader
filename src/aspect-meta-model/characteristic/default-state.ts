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

import {Type} from '../type';
import {DefaultEnumeration, Enumeration} from './default-enumeration';
import {DefaultEntityInstance} from '../default-entity-instance';
import {Value} from '../default-value';

export interface State extends Enumeration {
    defaultValue: DefaultEntityInstance | Value | string | number;
}

export class DefaultState extends DefaultEnumeration implements State {
    constructor(
        metaModelVersion: string,
        aspectModelUrn: string,
        name: string,
        values: Array<DefaultEntityInstance | Value | string | number>,
        private _defaultValue: DefaultEntityInstance | Value | string | number,
        dataType?: Type
    ) {
        super(metaModelVersion, aspectModelUrn, name, values, dataType);
    }

    public set defaultValue(value: DefaultEntityInstance | Value | string | number) {
        this._defaultValue = value;
    }

    public get defaultValue(): DefaultEntityInstance | Value | string | number {
        return this._defaultValue;
    }
}
