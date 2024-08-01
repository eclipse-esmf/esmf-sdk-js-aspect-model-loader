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
import {ModelVisitor} from '../../visitor/model-visitor';
import {NamedElement} from '../named-element';
import {CharacteristicProps} from '../../shared/props';

export interface Characteristic extends NamedElement {
    dataType?: Type;
    getDatatype(): Type;
}

export class DefaultCharacteristic extends NamedElement implements Characteristic {
    dataType?: Type;

    constructor(props: CharacteristicProps) {
        super(props);
        this.dataType = props.dataType;
    }

    getDatatype(): Type {
        return this.dataType;
    }

    accept<T, U>(visitor: ModelVisitor<T, U>, context: U): T {
        return visitor.visitCharacteristic(this, context);
    }

    /**
     * Get the effective type defined by possible nested characteristic definitions.
     */
    public static getEffectiveDataType(characteristic: Characteristic): Type | undefined {
        const characteristicAny: any = characteristic;
        if (characteristicAny.constructor.name === 'DefaultTrait') {
            return characteristicAny?.baseCharacteristic?.dataType;
        }
        if (characteristicAny.constructor.name === 'DefaultCollection' && characteristicAny.elementCharacteristic) {
            if (characteristicAny.elementCharacteristic.constructor.name === 'DefaultTrait') {
                return characteristicAny.elementCharacteristic.baseCharacteristic?.dataType;
            }
            return characteristicAny.elementCharacteristic.dataType || null;
        }
        return characteristicAny ? characteristicAny.dataType : null;
    }
}
