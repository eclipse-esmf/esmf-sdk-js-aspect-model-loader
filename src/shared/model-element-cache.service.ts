/*
 * Copyright (c) 2022 Robert Bosch Manufacturing Solutions GmbH
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

import {Base, BaseMetaModelElement} from '../aspect-meta-model';

export interface CacheStrategy {
    /**
     * Reset all cached elements.
     */
    reset(): void;

    /**
     * Gets a BaseMetaModelElement, and returns the element or undefined.
     * @param key key of the element
     * @return Element or undefined if it does not exists
     */
    get(key: string): BaseMetaModelElement | undefined;

    /**
     * Get element by name.
     *
     * @param name name of the element
     * @return Array<BaseMetaModelElement> with the found elements or an empty Array
     */
    getByName(name: string): Array<BaseMetaModelElement>;

    /**
     * Filter the cache to find elements matching the predicate filter
     */
    filter(filterPredicate: FilterPredicate): Array<BaseMetaModelElement>;

    /**
     * Resolve cached element instance or add the given element to teh cache
     *
     * @param modelElement element instance to resolve
     * @return cached element instance
     */
    resolveInstance(modelElement: BaseMetaModelElement): BaseMetaModelElement;

    /**
     * Add element explicitly to the cache
     *
     * @param name name of the element
     * @param modelElement element instance to resolve
     * @param overwrite force to overwrite it if an element with the name already exists
     */
    addElement(name: string, modelElement: BaseMetaModelElement, overwrite?: boolean);
}

/**
 * Function is a predicate, to test each element of the array. Return a value that coerces to true
 * to keep the element, or to false otherwise.
 */
export interface FilterPredicate {
    (baseMetaModelElement: BaseMetaModelElement): boolean;
}

export class ModelElementCacheService implements CacheStrategy {
    private instanceCache: Map<string, BaseMetaModelElement>;

    constructor() {
        this.instanceCache = new Map<string, BaseMetaModelElement>();
    }

    public reset(): void {
        this.instanceCache.clear();
    }

    public get(key: string): BaseMetaModelElement | undefined {
        return this.instanceCache.get(key);
    }

    public filter(filterPredicate: FilterPredicate): Array<BaseMetaModelElement> {
        return [...this.instanceCache.values()].filter(filterPredicate);
    }

    public getByName(name: string): Array<BaseMetaModelElement> {
        return [...this.instanceCache.values()].filter(element => element.name === name);
    }

    public resolveInstance(instance: BaseMetaModelElement): BaseMetaModelElement {
        if ((<Base>instance).isAnonymousNode) {
            return instance;
        }

        const aspectModelUrn = instance.aspectModelUrn;
        const resolvedInstance = this.get(aspectModelUrn);
        if (resolvedInstance) {
            return resolvedInstance;
        }

        this.instanceCache.set(aspectModelUrn, instance);
        return instance;
    }

    public addElement(name: string, modelElement: BaseMetaModelElement, overwrite = false) {
        const cachedElement = this.instanceCache.get(name);
        if (!overwrite && cachedElement) {
            return;
        }
        if (cachedElement) {
            console.info(`Element with the name ${name} already exist. Overwrite existing element.`);
        }
        this.instanceCache.set(name, modelElement);
    }
}
