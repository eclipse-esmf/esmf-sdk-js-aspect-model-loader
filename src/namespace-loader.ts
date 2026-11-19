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

import {Observable} from 'rxjs';
import {BaseMetaModelElement} from './aspect-meta-model/index.js';
import {CacheStrategy, ModelElementCacheService} from './shared/model-element-cache.service.js';
import {RdfLoader} from './shared/rdf-loader.js';
import {NamespaceInstantiator} from './instantiator/namespace-instantiator.js';
import {BaseModelLoader} from './base-model-loader.js';
import {RdfModelUtil} from './shared/rdf-model-util.js';

export class NamespaceLoader extends BaseModelLoader {
    /**
     * Creates a NamespaceLoader instance.
     *
     * @param cacheService cache strategy to cache created elements to ensure uniqueness and a fast lookup of it.
     *                     The default cache strategy ignores inline defined elements.
     */
    constructor(protected cacheService: CacheStrategy = new ModelElementCacheService()) {
        super(cacheService);
    }

    /**
     * Loads RDF content and resolves to a map of namespaces as keys and the corresponding model elements as values.
     *
     * @param rdfContent The RDF/Turtle content to load.
     * @return Promise resolving to a frozen map of namespace keys to arrays of BaseMetaModelElement objects.
     * @throws {AspectModelError} e.g. {@link UnsupportedVersionError} or {@link RdfParseError}
     */
    public async loadNamespaces(...rdfContent: string[]): Promise<Map<string, Array<BaseMetaModelElement>>> {
        this.cacheService.reset();
        const rdfModel = await new RdfLoader().parse(rdfContent);
        RdfModelUtil.throwErrorIfUnsupportedVersion(rdfModel);
        return Object.freeze(new NamespaceInstantiator(rdfModel, this.cacheService).createNamespaces());
    }

    /**
     * Observable variant of {@link loadNamespaces}.
     *
     * @param rdfContent The RDF/Turtle content to load.
     * @return An Observable that emits a map of namespace keys to arrays of BaseMetaModelElement objects.
     */
    public load(...rdfContent: string[]): Observable<Map<string, Array<BaseMetaModelElement>>> {
        return this.toObservable(this.loadNamespaces(...rdfContent));
    }
}
