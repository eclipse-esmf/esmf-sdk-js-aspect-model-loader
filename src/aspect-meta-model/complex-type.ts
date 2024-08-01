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
import {Type} from './type';
import {StructureElement} from './structure-element';
import {Property} from './default-property';
import {EntityProps} from '../shared/props';

export interface ComplexType extends Type, StructureElement {}
export abstract class ComplexType extends StructureElement implements ComplexType {
    @use(Type) declare _: ComplexType;

    isAbstractEntity_: boolean = false;
    extends_: ComplexType = null;
    extendingElements: ComplexType[] = [];

    constructor(props: EntityProps) {
        super(props);
        this.urn = props.aspectModelUrn;
        this.extends_ = props.extends_;
        this.extendingElements = props.extendingElements || [];
        this.isAbstractEntity_ = props.isAbstract;
    }

    override isComplexType() {
        return true;
    }

    isAbstractEntity() {
        return this.isAbstractEntity_;
    }

    getUrn(): string {
        return this.getAspectModelUrn();
    }

    getExtendingElements(): ComplexType[] {
        return this.extendingElements;
    }

    getExtends(): ComplexType {
        return this.extends_;
    }

    getAllProperties(): Property[] {
        if (this.getExtends()) {
            return [...this.getProperties(), ...this.getExtends().getAllProperties()];
        }

        return [...this.getProperties()];
    }
}
