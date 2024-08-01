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
import {Property} from '../default-property';
import {StructuredValueProps} from '../../shared/props';

export interface StructuredValue extends Characteristic {
    deconstructionRule: string;
    elements: Array<string | Property>;
    getDeconstructionRule(): string;
    getElements(): (string | Property)[];
}

export class DefaultStructuredValue extends DefaultCharacteristic implements StructuredValue {
    deconstructionRule: string;
    elements: (string | Property)[];

    constructor(props: StructuredValueProps) {
        super(props);
        this.deconstructionRule = props.deconstructionRule;
        this.elements = props.elements || [];
    }

    getDeconstructionRule(): string {
        return this.deconstructionRule;
    }

    getElements(): (string | Property)[] {
        return this.elements;
    }
}
