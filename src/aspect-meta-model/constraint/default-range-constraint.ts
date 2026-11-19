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

import {Constraint, DefaultConstraint} from './default-constraint.js';
import {BoundDefinition} from '../bound-definition.js';

export interface RangeConstraint extends Constraint {
    minValue?: number | string;
    maxValue?: number | string;
    upperBoundDefinition?: BoundDefinition;
    lowerBoundDefinition?: BoundDefinition;
}

export class DefaultRangeConstraint extends DefaultConstraint implements RangeConstraint {
    constructor(
        metaModelVersion: string,
        aspectModelUrn: string,
        name: string,
        private _upperBoundDefinition: BoundDefinition,
        private _lowerBoundDefinition: BoundDefinition,
        private _minValue?: number | string,
        private _maxValue?: number | string
    ) {
        super(metaModelVersion, aspectModelUrn, name);
    }

    public set upperBoundDefinition(value: BoundDefinition) {
        this._upperBoundDefinition = value;
    }

    public get upperBoundDefinition(): BoundDefinition {
        return this._upperBoundDefinition;
    }

    public set lowerBoundDefinition(value: BoundDefinition) {
        this._lowerBoundDefinition = value;
    }

    public get lowerBoundDefinition(): BoundDefinition {
        return this._lowerBoundDefinition;
    }

    public set minValue(value: number | string | undefined) {
        this._minValue = value;
    }

    public get minValue(): number | string | undefined {
        return this._minValue;
    }

    public set maxValue(value: number | string | undefined) {
        this._maxValue = value;
    }

    public get maxValue(): number | string | undefined {
        return this._maxValue;
    }
}
