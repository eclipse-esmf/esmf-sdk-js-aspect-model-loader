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

import {NamedElementProps} from '../shared/props';
import {ModelElement} from './model-element';

export type LangString = string;

export abstract class NamedElement extends ModelElement {
    aspectModelUrn: string;
    name: string;
    syntheticName: boolean;
    see: string[] = [];
    preferredNames: Map<LangString, string>;
    descriptions: Map<LangString, string>;
    anonymous: boolean;
    parents: NamedElement[] = [];

    constructor(props: NamedElementProps) {
        super(props);
        this.aspectModelUrn = props.aspectModelUrn;
        this.name = props.name;
        this.syntheticName = Boolean(props.hasSyntheticName);
        this.see = props.see || [];
        this.descriptions = props.descriptions || new Map();
        this.preferredNames = props.preferredNames || new Map();
        this.anonymous = Boolean(props.isAnonymous);
    }

    get namespace(): string {
        return this.aspectModelUrn?.split('#')?.[0];
    }

    getAspectModelUrn(): string {
        return this.aspectModelUrn;
    }

    getName(): string {
        return this.name;
    }

    hasSyntheticName(): boolean {
        return this.syntheticName;
    }

    isAnonymous(): boolean {
        return this.anonymous;
    }

    getSee(): string[] {
        return this.see;
    }

    setSee(value: string) {
        this.see.push(value);
    }

    removeSee(value: string) {
        this.see = this.see.filter(see => see !== value);
    }

    getPreferredNames(): Map<LangString, string> {
        return this.preferredNames;
    }

    getDescriptions(): Map<LangString, string> {
        return this.descriptions;
    }

    getPreferredName(lang: LangString = 'en'): string {
        return this.preferredNames.get(lang) ?? this.name;
    }

    getDescription(lang: LangString = 'en'): string {
        return this.descriptions.get(lang) ?? this.descriptions.get('en') ?? '';
    }

    getParents(): NamedElement[] {
        return this.parents;
    }

    addParent(parent: NamedElement) {
        this.parents.push(parent);
    }

    hasParent(parent: NamedElement): boolean {
        return -1 < this.parents.findIndex(e => e.aspectModelUrn === parent.aspectModelUrn);
    }
}
