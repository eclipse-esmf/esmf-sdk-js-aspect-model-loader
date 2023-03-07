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

import {DefaultOperation, Operation} from '../aspect-meta-model/default-operation';
import {Quad} from 'n3';
import {MetaModelElementInstantiator} from './meta-model-element-instantiator';
import {PropertyInstantiator} from './property-instantiator';
import {DefaultProperty, DefaultPropertyInstanceDefinition} from '../aspect-meta-model';

export class OperationInstantiator {
    constructor(private metaModelElementInstantiator: MetaModelElementInstantiator) {}

    createOperation(quad: Quad): Operation {
        const samm = this.metaModelElementInstantiator.samm;
        const rdfModel = this.metaModelElementInstantiator.rdfModel;
        const operation = new DefaultOperation(null, null, null);
        const quads = rdfModel.findAnyProperty(quad);
        const propertyInstantiator = new PropertyInstantiator(this.metaModelElementInstantiator);

        quads.forEach(quad => {
            if (samm.isInputProperty(quad.predicate.value)) {
                const inputQuads = this.metaModelElementInstantiator.rdfModel.resolveBlankNodes(quad.object.value);
                operation.input = inputQuads.map(input => propertyInstantiator.createProperty(input));
                operation.input.forEach(property => (property as DefaultPropertyInstanceDefinition).addParent(operation));
            } else if (samm.isOutputProperty(quad.predicate.value)) {
                const outputQuads = this.metaModelElementInstantiator.rdfModel.store.getQuads(quad.object, null, samm.Property(), null);
                operation.output = propertyInstantiator.createProperty(outputQuads[0]);
                (operation.output as DefaultPropertyInstanceDefinition)?.addParent(operation);
            }
        });

        this.metaModelElementInstantiator.initBaseProperties(quads, operation, rdfModel);

        return <Operation>this.metaModelElementInstantiator.cacheService.resolveInstance(operation);
    }
}
