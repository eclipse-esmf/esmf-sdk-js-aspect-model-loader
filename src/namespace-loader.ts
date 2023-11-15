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

import {Observable, Subject} from 'rxjs';
import {BaseMetaModelElement} from './aspect-meta-model';
import {CacheStrategy, ModelElementCacheService} from './shared/model-element-cache.service';
import {RdfLoader} from './shared/rdf-loader';
import {RdfModel} from './shared/rdf-model';
import {NamespaceInstantiator} from './instantiator/namespace-instantiator';
import {BaseModelLoader} from './base-model-loader';
import {RdfModelUtil} from './shared/rdf-model-util';

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
     * Loads RDF content and returns an Observable that emits a map of namespaces as keys and an array of corresponding BaseMetaModelElement objects.
     *
     * @param {string[]} rdfContent The RDF content to load.
     * @return {Observable<Map<string, Array<BaseMetaModelElement>>>} An Observable that emits a map of namespace keys to arrays of BaseMetaModelElement objects.
     */
    public load(...rdfContent: string[]): Observable<Map<string, Array<BaseMetaModelElement>>> {
        this.cacheService.reset();
        const subject = new Subject<Map<string, Array<BaseMetaModelElement>>>();
        new RdfLoader().loadModel(rdfContent).subscribe(
            (rdfModel: RdfModel) => {
                try {
                    RdfModelUtil.throwErrorIfUnsupportedVersion(rdfModel);
                    subject.next(Object.freeze(new NamespaceInstantiator(rdfModel, this.cacheService).createNamespaces()));
                } catch (error: any) {
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
