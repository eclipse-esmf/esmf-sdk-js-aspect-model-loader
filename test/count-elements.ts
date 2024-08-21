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

import {DefaultCharacteristic, DefaultProperty, DefaultOperation, DefaultAspect, DefaultEvent, DefaultEntity, DefaultUnit} from '../src';
import {NamedElement} from '../src/aspect-meta-model/named-element';

export class CountElementVisitor {
    public counts = {
        aspects: {
            _class: DefaultAspect,
            count: 0,
        },
        properties: {
            _class: DefaultProperty,
            count: 0,
        },
        characteristics: {
            _class: DefaultCharacteristic,
            count: 0,
        },
        events: {
            _class: DefaultEvent,
            count: 0,
        },
        operations: {
            _class: DefaultOperation,
            count: 0,
        },
        entities: {
            _class: DefaultEntity,
            count: 0,
        },
        units: {
            _class: DefaultUnit,
            count: 0,
        },
    };

    visit(element: NamedElement) {
        if (!element || !(element instanceof NamedElement)) return null;

        for (const [key, value] of Object.entries(element)) {
            if (value instanceof NamedElement) {
                this.countElementIfPossible(value);
                this.visit(value);
            }

            if (key !== 'parents' && Array.isArray(value)) {
                for (const el of value) {
                    if (el instanceof NamedElement) {
                        this.countElementIfPossible(el);
                        this.visit(el);
                    }
                }
            }
        }
    }

    private countElementIfPossible(element: NamedElement) {
        for (const value of Object.values(this.counts)) {
            if (element instanceof value._class) {
                value.count++;
                return;
            }
        }
    }
}
