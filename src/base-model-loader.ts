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

import {Base, BaseMetaModelElement, DefaultPropertyInstanceDefinition} from './aspect-meta-model';
import {CacheStrategy, FilterPredicate} from './shared/model-element-cache.service';

export abstract class BaseModelLoader {
    /**
     * Creates a AspectModelLoader instance.
     *
     * @param cacheService cache strategy to cache created elements to ensure uniqueness and a fast lookup of it.
     *                     The default cache strategy ignores inline defined elements.
     */
    protected constructor(protected cacheService: CacheStrategy) {}

    /**
     * Find a specific model element, and returns it or undefined.
     *
     * @param modelElementUrn urn of the model element
     */
    public findByUrn(modelElementUrn: string): BaseMetaModelElement {
        return this.cacheService.get(modelElementUrn);
    }

    /**
     * Find a specific model element by name, and returns the found elements.
     *
     * @param modelElementName name of the element
     */
    public findByName(modelElementName: string): Array<BaseMetaModelElement> {
        return this.cacheService.getByName(modelElementName);
    }

    /**
     * Filter the cache to find elements matching the predicate filter
     */
    public filterElements(filterPredicate: FilterPredicate): Array<BaseMetaModelElement> {
        return this.cacheService.filter(filterPredicate);
    }

    /**
     * Determine the path to access the respective value in the Aspect JSON object.
     *
     * @param baseElement Element for determine the path
     */
    public determineAccessPath(baseElement: BaseMetaModelElement): Array<Array<string>> {
        const path = [];
        if (baseElement instanceof DefaultPropertyInstanceDefinition) {
            path.push([baseElement.payloadName || baseElement.name]);
        } else {
            path.push([]);
        }
        return this._determineAccessPath(baseElement, path);
    }

    private _determineAccessPath(baseElement: BaseMetaModelElement, path: Array<Array<string>>): Array<Array<string>> {
        if (!baseElement || (baseElement as Base | DefaultPropertyInstanceDefinition).parents.length === 0) {
            return path;
        }

        // in case of multiple parent get the number of additional parents and clone the existing paths
        for (let i = 0; i < (baseElement as Base | DefaultPropertyInstanceDefinition).parents.length - path.length; i++) {
            path.push([...path[0]]);
        }

        baseElement.parents.forEach((parent, i) => {
            if (parent instanceof DefaultPropertyInstanceDefinition) {
                const pathSegment = parent.payloadName || parent.name;
                if ((path[i].length > 0 && path[i][0] !== pathSegment) || path[0].length === 0) {
                    path[i].unshift(pathSegment);
                }
            }
            this._determineAccessPath(parent, path);
        });

        return path;
    }
}
