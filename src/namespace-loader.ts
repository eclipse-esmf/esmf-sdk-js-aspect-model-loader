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
import {RdfLoader} from './shared/rdf-loader';
import {initiateRdfModel, RdfModel} from './shared/rdf-model';
import {BaseModelLoader} from './base-model-loader';
import {RdfModelUtil} from './shared/rdf-model-util';
import {NamedElement} from './aspect-meta-model/named-element';
import {createNamespaces} from './instantiator/namespace-instantiator';

export class NamespaceLoader extends BaseModelLoader {
    constructor() {
        super();
    }
    /**
     * Loads RDF content and returns an Observable that emits a map of namespaces as keys and an array of corresponding NamedElement objects.
     *
     * @param {string[]} rdfContent The RDF content to load.
     * @return {Observable<Map<string, Array<NamedElement>>>} An Observable that emits a map of namespace keys to arrays of NamedElement objects.
     */
    public load(...rdfContent: string[]): Observable<Map<string, Array<NamedElement>>> {
        const subject = new Subject<Map<string, Array<NamedElement>>>();
        new RdfLoader().loadModel(rdfContent).subscribe({
            next: (rdfModel: RdfModel) => {
                try {
                    RdfModelUtil.throwErrorIfUnsupportedVersion(rdfModel);
                    subject.next(Object.freeze(createNamespaces()));
                } catch (error: any) {
                    subject.error(error);
                } finally {
                    subject.complete();
                }
            },
            error: error => {
                subject.error(error);
            },
        });

        return subject;
    }
}
