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

import {Parser, Store} from 'n3';
import {from, Observable} from 'rxjs';
import {RdfModel} from './rdf-model.js';
import {RdfParseError} from './errors.js';

export class RdfLoader {
    /**
     * Parses the provided RDF content into a single RDF model.
     *
     * @param rdfContent array of RDF content each from a different ttl file
     */
    public parse(rdfContent: string[]): Promise<RdfModel> {
        return new Promise<RdfModel>((resolve, reject) => {
            const store = new Store();
            let parsedCount = 0;

            if (rdfContent.length === 0) {
                resolve(new RdfModel(store));
                return;
            }

            rdfContent.forEach(rdf => {
                new Parser().parse(rdf, (error, quad, prefixes) => {
                    if (error) {
                        reject(new RdfParseError(error.message, {cause: error}));
                        return;
                    }

                    if (quad) {
                        store.addQuad(quad);
                    } else if (prefixes && ++parsedCount === rdfContent.length) {
                        // all contents are parsed at that point
                        resolve(new RdfModel(store));
                    }
                });
            });
        });
    }

    /**
     * Loads the model based on the provided RDF content
     *
     * @param rdfContent array of RDF content each from a different ttl file
     */
    public loadModel(rdfContent: string[]): Observable<RdfModel> {
        return from(this.parse(rdfContent));
    }
}
