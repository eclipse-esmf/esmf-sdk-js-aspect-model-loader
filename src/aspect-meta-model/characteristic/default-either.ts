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
import {Type} from '../type';
import {EitherProps} from '../../shared/props';

export interface Either extends Characteristic {
    left: Characteristic;
    right: Characteristic;

    // @TODO check if it is necessary to have these methods
    /**
     * Get the effective type for the left characteristic.
     */
    effectiveLeftDataType: Type | undefined;
    /**
     * Get the effective type for the right characteristic.
     */
    effectiveRightDataType: Type | undefined;
}

export class DefaultEither extends DefaultCharacteristic implements Either {
    left: Characteristic;
    right: Characteristic;

    constructor(props: EitherProps) {
        super(props);
        this.left = props.left;
        this.right = props.right;
    }

    getLeft(): Characteristic {
        return this.left;
    }

    getRight(): Characteristic {
        return this.right;
    }

    // @TODO check if it is necessary to have these methods
    public get effectiveLeftDataType(): Type | undefined {
        return DefaultCharacteristic.getEffectiveDataType(this.left);
    }

    public get effectiveRightDataType(): Type | undefined {
        return DefaultCharacteristic.getEffectiveDataType(this.right);
    }
}
