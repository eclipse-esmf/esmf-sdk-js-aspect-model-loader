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

import {DefaultProperty, DefaultPropertyInstanceDefinition} from '../aspect-meta-model/default-property';
import {DefaultCharacteristic, Property} from '../aspect-meta-model';
import {Quad, Util} from 'n3';
import {MetaModelElementInstantiator} from './meta-model-element-instantiator';
import {Bamm} from '../vocabulary';

export class PropertyInstantiator {
    constructor(private metaModelElementInstantiator: MetaModelElementInstantiator) {}

    createProperty(quad: Quad): Property {
        const bamm = this.metaModelElementInstantiator.BAMM();
        const rdfModel = this.metaModelElementInstantiator.rdfModel;
        const property = new DefaultProperty(null, null, null, null);
        const propertyInstanceDefinition = new DefaultPropertyInstanceDefinition(property, null, null, null, null);
        property.isAnonymousNode = this.isDefinedInline(quad);

        const quads = this.resolvePropertyQuads(property, quad);

        this.metaModelElementInstantiator.initBaseProperties(quads, property, rdfModel);

        this.initExtends(quads, propertyInstanceDefinition);

        quads.forEach(value => {
            if (bamm.isCharacteristicProperty(value.predicate.value)) {
                propertyInstanceDefinition.characteristic = this.metaModelElementInstantiator.getCharacteristic(value);
            } else if (bamm.isExampleValueProperty(value.predicate.value)) {
                propertyInstanceDefinition.exampleValue = value.object.value;
            } else if (bamm.isNotInPayloadProperty(value.predicate.value)) {
                propertyInstanceDefinition.isNotInPayload = value.object.value === 'true';
            } else if (bamm.isOptionalProperty(value.predicate.value)) {
                propertyInstanceDefinition.isOptional = value.object.value === 'true';
            } else if (bamm.isPayloadNameProperty(value.predicate.value)) {
                propertyInstanceDefinition.payloadName = value.object.value;
            }
        });

        (property.characteristic as DefaultCharacteristic)?.addParent(propertyInstanceDefinition);

        return <Property>this.metaModelElementInstantiator.cacheService.resolveInstance(propertyInstanceDefinition);
    }

    private resolvePropertyQuads(property: DefaultProperty, quad: Quad): Array<Quad> {
        const bamm = this.metaModelElementInstantiator.BAMM();
        const rdfModel = this.metaModelElementInstantiator.rdfModel;
        let quads;

        if (Util.isBlankNode(quad.subject)) {
            quads = rdfModel.findAnyProperty(quad);
        } else {
            quads = rdfModel.store.getQuads(quad.subject, null, null, null);
        }

        if (property.isAnonymousNode) {
            quads.push(
                ...rdfModel.store.getQuads(quad.subject, null, null, null).filter(quad => bamm.Property().value !== quad.object.value)
            );
        }

        return quads;
    }

    private initExtends(quads: Array<Quad>, property: DefaultPropertyInstanceDefinition) {
        quads.forEach(value => {
            if (this.metaModelElementInstantiator.BAMM().isExtends(value.predicate.value)) {
                const quadsAbstractProperty
                    = this.metaModelElementInstantiator.rdfModel.store.getQuads(value.object, null, null, null);
                const extendedAbstractProperty = this.createProperty(quadsAbstractProperty[0]);
                extendedAbstractProperty.isAbstract = true;
                property.extends = extendedAbstractProperty;
            }
        });
    }

    private isDefinedInline(propertyQuad: Quad) {
        const bamm = this.metaModelElementInstantiator.BAMM();
        const rdfModel = this.metaModelElementInstantiator.rdfModel;

        // check if the property is fully defined as separate definition
        if (
            (propertyQuad.object.id === bamm.Property().id || propertyQuad.object.id === bamm.AbstractProperty().id) &&
            !Util.isBlankNode(propertyQuad.subject)
        ) {
            return false;
        }

        // try to resolve property quads and check if a full defined property quad is there for Property
        return (
            rdfModel.store
                .getQuads(propertyQuad.subject, null, null, null)
                .find(quad => bamm.Property().value !== quad.predicate.value && quad.predicate.value.startsWith(Bamm.getBaseUri())) !==
            undefined
        );
    }
}