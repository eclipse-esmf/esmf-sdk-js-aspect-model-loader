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

import {Observable, Subject} from 'rxjs';
import {Aspect} from './aspect-meta-model/index.js';
import {CacheStrategy, ModelElementCacheService} from './shared/model-element-cache.service.js';
import {RdfLoader} from './shared/rdf-loader.js';
import {RdfModel} from './shared/rdf-model.js';
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
     * Load and instantiate an Aspect Model based on an RDF/Turtle. Related imports are not resolved.
     *
     * @param rdfContent RDF/Turtle representation to load
     */
    public loadSelfContainedModel(rdfContent: string): Observable<Aspect> {
        return this.load('', rdfContent);
    }

    /**
     * Load and instantiate an Aspect Model based on an RDF/Turtle
     *
     * @param modelAspectUrn URN of the Aspect Model to load and instantiate
     *
     * @param rdfContent List of all RDF/Turtle representation to load, including
     *                   all referenced models imports. The default SAMM related imports
     *                   e.g. with prefixes "samm", "samm-c", "samm-e", "unit" and "xsd"
     *                   are already provided. No needs to provided that(content) is not
     *                   required.
     *
     * @return Observable<Aspect> Aspect including all information from the given RDF
     */
    public load(modelAspectUrn: string, ...rdfContent: string[]): Observable<Aspect> {
        this.cacheService.reset();
        const subject = new Subject<Aspect>();
        new RdfLoader().loadModel(rdfContent).subscribe(
            (rdfModel: RdfModel) => {
                try {
                    RdfModelUtil.throwErrorIfUnsupportedVersion(rdfModel);
                    subject.next(Object.freeze(new AspectInstantiator(rdfModel, this.cacheService).createAspect(modelAspectUrn)));
                } catch (error: unknown) {
                    subject.error(error);
                } finally {
                    subject.complete();
                }
            },
            error => {
                subject.error(error);
            }
        );

        return subject;
    }
}
