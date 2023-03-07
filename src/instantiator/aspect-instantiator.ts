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
import {NamedNode} from 'n3';
import {CacheStrategy} from '../shared/model-element-cache.service';

export class AspectInstantiator {
    private readonly recursiveModelElements: Map<string, Array<BaseMetaModelElement>>;

    constructor(private rdfModel: RdfModel, private aspectModelUrn: string, private cacheService: CacheStrategy) {
        this.recursiveModelElements = new Map<string, Array<BaseMetaModelElement>>();
    }

    createAspect(): Aspect {
        const aspectNode = <NamedNode>(
            this.rdfModel.store.getQuads(null, this.rdfModel.samm.RdfType(), this.rdfModel.samm.Aspect(), null)[0].subject
        );
        const metaModelElementInstantiator = new MetaModelElementInstantiator(
            this.rdfModel,
            this.cacheService,
            this.recursiveModelElements
        );
        const properties = metaModelElementInstantiator.getProperties(aspectNode);
        const operations = metaModelElementInstantiator.getOperations(aspectNode);
        const events = metaModelElementInstantiator.getEvents(aspectNode);
        const aspect = new DefaultAspect(null, null, null, properties, operations, events);

        properties.forEach(property => (property as DefaultPropertyInstanceDefinition).addParent(aspect));
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
}
