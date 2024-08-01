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

import {Event, Operation, Property} from './index';
import {ModelVisitor} from '../visitor/model-visitor';
import {StructureElement} from './structure-element';
import {AspectProps} from '../shared/props';

export interface Aspect extends StructureElement {
    operations: Array<Operation>;
    events: Array<Event>;
    isCollectionAspect: boolean;

    getOperations(): Operation[];
    setOperations(value: Operation[]): void;
    getEvents(): Event[];
    setEvents(value: Event[]): void;
    accept<T, U>(visitor: ModelVisitor<T, U>, context: U): T;
}

export class DefaultAspect extends StructureElement implements Aspect {
    operations: Operation[];
    events: Event[];
    isCollectionAspect: boolean;

    constructor(props: AspectProps) {
        super(props);
        this.properties = props.properties || [];
        this.operations = props.operations || [];
        this.events = props.events || [];
        this.isCollectionAspect = props.isCollectionAspect;
    }

    getOperations(): Operation[] {
        return this.operations;
    }

    setOperations(value: Operation[]) {
        this.operations = value;
    }

    getEvents(): Event[] {
        return this.events;
    }

    setEvents(value: Event[]) {
        this.events = value;
    }

    accept<T, U>(visitor: ModelVisitor<T, U>, context: U): T {
        return visitor.visitAspect(this, context);
    }
}
