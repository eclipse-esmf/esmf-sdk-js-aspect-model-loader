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

import {CollectionType, DefaultCollection} from './default-collection';
import {CollectionProps} from '../../shared/props';

export class DefaultSet extends DefaultCollection {
    constructor(props: CollectionProps) {
        super(props);
        this.allowDuplicates = false;
        this.ordered = false;
    }

    override getCollectionType(): CollectionType {
        return CollectionType.SET;
    }
}
