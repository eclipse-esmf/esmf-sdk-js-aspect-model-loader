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
import {Aspect} from './aspect-meta-model/index.js';
import {CacheStrategy, ModelElementCacheService} from './shared/model-element-cache.service.js';
import {RdfLoader} from './shared/rdf-loader.js';
import {AspectInstantiator} from './instantiator/aspect-instantiator.js';
import {BaseModelLoader} from './base-model-loader.js';
import {RdfModelUtil} from './shared/rdf-model-util.js';

export class AspectModelLoader extends BaseModelLoader {
    /**
     * Creates a AspectModelLoader instance.
     *
     * @param cacheService cache strategy to cache created elements to ensure uniqueness and a fast lookup of it.
     *                     The default cache strategy ignores inline defined elements.
     */
    constructor(protected cacheService: CacheStrategy = new ModelElementCacheService()) {
        super(cacheService);
    }

    /**
     * Load and instantiate an Aspect Model based on an RDF/Turtle.
     *
     * @param modelAspectUrn URN of the Aspect to load and instantiate. Pass an empty string to load the only Aspect
     *                       contained in the RDF content.
     * @param rdfContent List of all RDF/Turtle representations to load, including all referenced model imports.
     *                   The default SAMM related definitions (prefixes "samm", "samm-c", "samm-e", "unit" and "xsd")
     *                   are already provided.
     * @return Promise resolving to the frozen Aspect including all information from the given RDF
     * @throws {AspectModelError} e.g. {@link UnsupportedVersionError}, {@link AspectNotFoundError} or {@link RdfParseError}
     */
    public async loadAspect(modelAspectUrn: string, ...rdfContent: string[]): Promise<Aspect> {
        this.cacheService.reset();
        const rdfModel = await new RdfLoader().parse(rdfContent);
        RdfModelUtil.throwErrorIfUnsupportedVersion(rdfModel);
        return Object.freeze(new AspectInstantiator(rdfModel, this.cacheService).createAspect(modelAspectUrn));
    }

    /**
     * Load and instantiate an Aspect Model based on a single RDF/Turtle. Related imports are not resolved.
     *
     * @param rdfContent RDF/Turtle representation to load
     */
    public loadSelfContainedAspect(rdfContent: string): Promise<Aspect> {
        return this.loadAspect('', rdfContent);
    }

    /**
     * Observable variant of {@link loadSelfContainedAspect}.
     *
     * @param rdfContent RDF/Turtle representation to load
     */
    public loadSelfContainedModel(rdfContent: string): Observable<Aspect> {
        return this.load('', rdfContent);
    }

    /**
     * Observable variant of {@link loadAspect}.
     *
     * @param modelAspectUrn URN of the Aspect Model to load and instantiate
     * @param rdfContent List of all RDF/Turtle representations to load, including all referenced model imports.
     * @return Observable<Aspect> Aspect including all information from the given RDF
     */
    public load(modelAspectUrn: string, ...rdfContent: string[]): Observable<Aspect> {
        return this.toObservable(this.loadAspect(modelAspectUrn, ...rdfContent));
    }
}
