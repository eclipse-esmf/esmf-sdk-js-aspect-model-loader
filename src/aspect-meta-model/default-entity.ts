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

import {Property} from './default-property';
import {ModelVisitor} from '../visitor/model-visitor';
import {ComplexType} from './complex-type';
import {EntityProps} from '../shared/props';

export interface Entity extends ComplexType {}
export class DefaultEntity extends ComplexType {
    constructor(props: EntityProps) {
        super(props);
    }

    accept<T, U>(visitor: ModelVisitor<T, U>, context: U): T {
        return visitor.visitEntity(this, context);
    }

    getOwnProperties(): Property[] {
        return [...this.properties];
    }

    setOwnProperties(value: Property[]) {
        this.properties = value;
    }

    override isScalar(): boolean {
        return false;
    }
}
