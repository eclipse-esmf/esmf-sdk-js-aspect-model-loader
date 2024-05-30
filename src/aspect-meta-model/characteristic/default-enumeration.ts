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
import {DefaultCharacteristic} from './default-characteristic';
import {DefaultEntityInstance} from '../default-entity-instance';
import {DefaultEntity} from '../default-entity';
import { ValuesCollection } from './default-values-collection';

export class DefaultEnumeration extends DefaultCharacteristic implements ValuesCollection {
    constructor(
        metaModelVersion: string,
        aspectModelUrn: string,
        name: string,
        private _values: Array<DefaultEntityInstance | string | number>,
        dataType?: Type
    ) {
        super(metaModelVersion, aspectModelUrn, name, dataType);
    }

    public set values(values: Array<DefaultEntityInstance | string | number>) {
        this._values = values;
    }

    public get values(): Array<DefaultEntityInstance | string | number> {
        return this._values;
    }

    /**
     * Find the index of the given value in the values array.
     *
     * @return returns the index of the value or -1
     */
    public indexOf(value: string): number {
        if (!this.values) {
            return -1;
        }

        if (this.dataType && this.dataType.isComplex) {
            const propertyValue = (<DefaultEntity>this.dataType).properties.find(property => property.isNotInPayload === false);

            return this.values.findIndex((valueEntry: DefaultEntityInstance) => {
                return valueEntry[propertyValue.name] === value;
            });
        } else {
            return this.values.findIndex(valueEntry => valueEntry === value);
        }
    }
}
