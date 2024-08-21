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

import {use} from 'typescript-mix';
import {HasProperties} from './has-properties';
import {NamedElement} from './named-element';
import {StructuredElementProps} from '../shared/props';

export interface StructureElement extends HasProperties, NamedElement {}
export abstract class StructureElement extends NamedElement {
    @use(HasProperties) _: StructureElement;

    constructor(props: StructuredElementProps) {
        super(props);
        this.properties = props.properties || [];
    }

    isComplexType() {
        return false;
    }
}
