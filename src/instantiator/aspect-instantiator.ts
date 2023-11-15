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

import {
    Aspect,
    BaseMetaModelElement,
    DefaultEvent,
    DefaultOperation,
    DefaultPropertyInstanceDefinition,
    Property,
} from '../aspect-meta-model';
import {DefaultAspect} from '../aspect-meta-model/default-aspect';
import {RdfModel} from '../shared/rdf-model';
import {MetaModelElementInstantiator} from './meta-model-element-instantiator';
import {NamedNode, Quad} from 'n3';
import {CacheStrategy} from '../shared/model-element-cache.service';

export class AspectInstantiator {
    private readonly recursiveModelElements: Map<string, Array<BaseMetaModelElement>>;

    constructor(private rdfModel: RdfModel, private cacheService: CacheStrategy) {
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
        const aspect = new DefaultAspect(null, null, null, properties, operations, events);

        properties.forEach(property => (property as unknown as DefaultPropertyInstanceDefinition).addParent(aspect));
        operations.forEach(operation => (operation as DefaultOperation).addParent(aspect));
        events.forEach(event => (event as DefaultEvent).addParent(aspect));

        metaModelElementInstantiator.initBaseProperties(this.rdfModel.findAnyProperty(aspectNode), aspect, this.rdfModel);

        this.recursiveModelElements.forEach((recursiveProperties: Array<Property>, key: string) => {
            recursiveProperties.forEach((property: Property) => {
                if (property) {
                    property.characteristic = this.cacheService.get(key);
                }
            });
        });

        return <Aspect>metaModelElementInstantiator.cacheService.resolveInstance(aspect);
    }

    private getAspectQuad(rdfModel: RdfModel, aspectModelUrn?: string): Quad {
        const aspectQuad = rdfModel.store
            .getQuads(null, rdfModel.samm.RdfType(), rdfModel.samm.Aspect(), null)
            .find((quad, index, foundQuads) => {
                if (foundQuads.length > 1 && aspectModelUrn == undefined) {
                    throw new Error('More than one aspect found. Please provide the aspectModelUrn to load the desired one.');
                }
                return foundQuads.length == 1 || (aspectModelUrn && quad.subject.value === aspectModelUrn);
            });

        if (!aspectQuad) {
            throw new Error('No aspect found. Please verify if the aspectModelUrn is correct and the ttl includes an aspect definition.');
        }

        return aspectQuad;
    }
}
