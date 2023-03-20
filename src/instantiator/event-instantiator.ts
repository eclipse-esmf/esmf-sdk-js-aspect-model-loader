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

import {Quad} from 'n3';
import {MetaModelElementInstantiator} from './meta-model-element-instantiator';
import {PropertyInstantiator} from './property-instantiator';
import {DefaultEvent, DefaultPropertyInstanceDefinition, Event} from '../aspect-meta-model';

export class EventInstantiator {
    constructor(private metaModelElementInstantiator: MetaModelElementInstantiator) {}

    createEvent(quad: Quad): Event {
        const samm = this.metaModelElementInstantiator.samm;
        const rdfModel = this.metaModelElementInstantiator.rdfModel;
        const event = new DefaultEvent(null, null, null);
        const quads = rdfModel.findAnyProperty(quad);
        const propertyInstantiator = new PropertyInstantiator(this.metaModelElementInstantiator);

        quads.forEach(quad => {
            if (samm.isParametersProperty(quad.predicate.value)) {
                const parametersQuads = this.metaModelElementInstantiator.rdfModel.resolveBlankNodes(quad.object.value);
                event.parameters = parametersQuads.map(input => propertyInstantiator.createProperty(input));
                event.parameters.forEach(property => (property as DefaultPropertyInstanceDefinition).addParent(event));
            }
        });

        this.metaModelElementInstantiator.initBaseProperties(quads, event, rdfModel);

        return <Event>this.metaModelElementInstantiator.cacheService.resolveInstance(event);
    }
}
