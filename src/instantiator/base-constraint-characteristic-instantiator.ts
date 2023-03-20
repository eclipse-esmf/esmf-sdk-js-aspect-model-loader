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

import {NamedNode, Quad, Util} from 'n3';
import {BaseMetaModelElement, DefaultConstraint} from '../aspect-meta-model';
import {MetaModelElementInstantiator} from './meta-model-element-instantiator';
import {Samm, SammC} from '../vocabulary';

export class BaseConstraintCharacteristicInstantiator {
    public samm: Samm;
    public sammC: SammC;

    constructor(
        protected metaModelElementInstantiator: MetaModelElementInstantiator,
        public nextProcessor?: BaseConstraintCharacteristicInstantiator
    ) {
        this.samm = metaModelElementInstantiator.samm;
        this.sammC = metaModelElementInstantiator.sammC;
    }

    create(quad: Quad): BaseMetaModelElement {
        const propertyQuads: Array<Quad> = this.metaModelElementInstantiator.rdfModel.findAnyProperty(quad);

        const elementQuad = Util.isBlankNode(quad.object)
            ? this.metaModelElementInstantiator.rdfModel.resolveBlankNodes(quad.object.value).shift()
            : propertyQuads.shift();

        if (!this.shouldProcess(<NamedNode>elementQuad.object)) {
            return this.nextProcessor !== null ? this.nextProcessor.create(quad) : null;
        }

        // post init all common properties of the meta model element
        const element = this.processElement(propertyQuads);

        (<DefaultConstraint>element).isAnonymousNode = Util.isBlankNode(quad.object);

        this.metaModelElementInstantiator.initBaseProperties(propertyQuads, element, this.metaModelElementInstantiator.rdfModel);

        return element;
    }

    /**
     * This method must be override from the respective constraint or characteristic instantiator implementation
     * in order to initialize the specific properties.
     */
    protected processElement(quads: Array<Quad>): BaseMetaModelElement {
        return null;
    }

    /**
     * This method must be override from the respective constraint or characteristic instantiator implementation
     * in order to get called.
     */
    shouldProcess(namedNode: NamedNode): boolean {
        return true;
    }
}
