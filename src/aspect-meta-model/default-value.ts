/*
 * Copyright (c) 2026 Robert Bosch Manufacturing Solutions GmbH
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

import {Base, BaseMetaModelElement} from './base.js';
import {ModelVisitor} from '../visitor/model-visitor.js';

export type ValueType = string | number | boolean;

/**
 * A value enriched with semantic metadata (samm:Value, introduced with SAMM 2.2.0).
 * The actual data is accessible via {@link Value#value}, the metadata via the
 * preferred names, descriptions and see references.
 */
export interface Value extends BaseMetaModelElement {
    value: ValueType;
}

export class DefaultValue extends Base implements Value {
    constructor(
        metaModelVersion: string,
        aspectModelUrn: string,
        name: string,
        private _value: ValueType,
        isAnonymousNode = false
    ) {
        super(metaModelVersion, aspectModelUrn, name, isAnonymousNode);
    }

    public set value(value: ValueType) {
        this._value = value;
    }

    public get value(): ValueType {
        return this._value;
    }

    public toString(): string {
        return `${this._value}`;
    }

    public accept<T, U>(visitor: ModelVisitor<T, U>, context: U): T {
        return visitor.visitValue ? visitor.visitValue(this, context) : undefined!;
    }
}
