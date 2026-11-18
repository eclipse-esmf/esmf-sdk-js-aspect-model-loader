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

import {AspectNotFoundError, MultipleAspectsFoundError} from '../shared/errors.js';
import {
    Aspect,
    BaseMetaModelElement,
    Characteristic,
    DefaultEvent,
    DefaultOperation,
    DefaultPropertyInstanceDefinition,
    Property,
} from '../aspect-meta-model/index.js';
import {DefaultAspect} from '../aspect-meta-model/default-aspect.js';
import {RdfModel} from '../shared/rdf-model.js';
import {MetaModelElementInstantiator} from './meta-model-element-instantiator.js';
import {NamedNode, Quad} from 'n3';
import {CacheStrategy} from '../shared/model-element-cache.service.js';

export class AspectInstantiator {
    private readonly recursiveModelElements: Map<string, Array<BaseMetaModelElement>>;

    constructor(
        private rdfModel: RdfModel,
        private cacheService: CacheStrategy
    ) {
        this.recursiveModelElements = new Map<string, Array<BaseMetaModelElement>>();
    }

    createAspect(aspectModelUrn?: string): Aspect {
        const aspectQuad = this.getAspectQuad(this.rdfModel, aspectModelUrn);
        const aspectNode = aspectQuad.subject as NamedNode;
        const metaModelElementInstantiator = new MetaModelElementInstantiator(
            this.rdfModel,
            this.cacheService,
            this.recursiveModelElements
        );
        const properties = metaModelElementInstantiator.getProperties(aspectNode);
        const operations = metaModelElementInstantiator.getOperations(aspectNode);
        const events = metaModelElementInstantiator.getEvents(aspectNode);
        const aspect = new DefaultAspect(null!, null!, null!, properties, operations, events);

        properties.forEach(property => (property as DefaultPropertyInstanceDefinition).addParent(aspect));
        operations.forEach(operation => (operation as DefaultOperation).addParent(aspect));
        events.forEach(event => (event as DefaultEvent).addParent(aspect));

        metaModelElementInstantiator.initBaseProperties(this.rdfModel.findAnyProperty(aspectNode), aspect, this.rdfModel);

        this.recursiveModelElements.forEach((recursiveProperties: Array<BaseMetaModelElement>, key: string) => {
            recursiveProperties.forEach(property => {
                if (property) {
                    (property as Property).characteristic = this.cacheService.get(key) as Characteristic;
                }
            });
        });

        return <Aspect>metaModelElementInstantiator.cacheService.resolveInstance(aspect);
    }

    private getAspectQuad(rdfModel: RdfModel, aspectModelUrn?: string): Quad {
        const aspectQuad = rdfModel.store
            .getQuads(null, rdfModel.samm.RdfType(), rdfModel.samm.Aspect(), null)
            .find((quad, index, foundQuads) => {
                if (foundQuads.length > 1 && !aspectModelUrn) {
                    throw new MultipleAspectsFoundError();
                }
                return foundQuads.length == 1 || (aspectModelUrn && quad.subject.value === aspectModelUrn);
            });

        if (!aspectQuad) {
            throw new AspectNotFoundError();
        }

        return aspectQuad;
    }
}
