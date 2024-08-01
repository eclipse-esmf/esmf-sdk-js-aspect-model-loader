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

import {ModelVisitor} from '../visitor/model-visitor';
import {NamedElement} from './named-element';
import {UnitProps} from '../shared/props';

export interface Unit extends NamedElement {
    symbol?: string;
    code?: string;
    name: string;
    referenceUnit?: string;
    conversionFactor?: string;
    quantityKinds?: Array<any>;
}

export class DefaultUnit extends NamedElement implements Unit {
    symbol?: string;
    code?: string;
    referenceUnit?: string;
    conversionFactor?: string;
    quantityKinds?: Array<any>;

    constructor(props: UnitProps) {
        super(props);
        this.symbol = props.symbol;
        this.code = props.code;
        this.referenceUnit = props.referenceUnit;
        this.conversionFactor = props.conversionFactor;
        this.quantityKinds = props.quantityKinds || [];
    }

    public accept<T, U>(visitor: ModelVisitor<T, U>, context: U): T {
        return visitor.visitUnit(this, context);
    }
}
