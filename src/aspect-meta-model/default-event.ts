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
import {StructureElement} from './structure-element';
import {EventProps} from '../shared/props';

export interface Event extends StructureElement {}

export class DefaultEvent extends StructureElement implements Event {
    constructor(props: EventProps) {
        super(props);
    }

    public accept<T, U>(visitor: ModelVisitor<T, U>, context: U): T {
        return visitor.visitEvent(this, context);
    }
}
