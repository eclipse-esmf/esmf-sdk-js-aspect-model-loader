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

import {DefaultProperty} from '../aspect-meta-model/default-property';
import {Property} from '../aspect-meta-model';
import {NamedNode, Quad, Quad_Subject, Util} from 'n3';
import {getBaseProperties} from './meta-model-element-instantiator';
import {Samm} from '../vocabulary';
import {getRdfModel, getStore} from '../shared/rdf-model';
import {getElementsCache} from '../shared/model-element-cache.service';
import {detectAndCreateCharacteristic} from './characteristic';

export function createProperty(quad: Quad): Property {
    const rdfModel = getRdfModel();
    const samm = rdfModel.samm;
    const modelElementCache = getElementsCache();

    if (modelElementCache.get(quad.object.value)) {
        return modelElementCache.get(quad.object.value);
    }

    const baseProperties = getBaseProperties(quad.object as NamedNode);
    let propertyQuads: Quad[];

    if (samm.property().equals(quad.predicate)) {
        const [_, name] = quad.object.value.split('#');
        name && (baseProperties.name = name);
        name && (baseProperties.aspectModelUrn = quad.object.value);
        propertyQuads = [
            ...rdfModel.store.getQuads(quad.object, null, null, null),
            ...rdfModel.store.getQuads(quad.subject, null, null, null),
        ];
    } else if (samm.Extends().equals(quad.predicate)) {
        const [_, name] = quad.object.value.split('#');
        baseProperties.name = `${name}_property_${Math.floor(Math.random() * 5000)}`;
        baseProperties.aspectModelUrn = `${baseProperties.aspectModelUrn.split('#')?.[0]}#${baseProperties.name}`;
        baseProperties.hasSyntheticName = true;
        propertyQuads = rdfModel.store.getQuads(quad.subject, null, null, null);
    } else {
        propertyQuads = rdfModel.store.getQuads(quad.object, null, null, null);
    }

    const property = new DefaultProperty({
        ...baseProperties,
        isAnonymous: isDefinedInline(quad),
    });
    modelElementCache.resolveInstance(property);

    for (const propertyQuad of propertyQuads) {
        if (samm.isCharacteristicProperty(propertyQuad.predicate.value)) {
            property.characteristic = detectAndCreateCharacteristic(propertyQuad);
            property.characteristic?.addParent(property);
        } else if (samm.isExampleValueProperty(propertyQuad.predicate.value)) {
            property.exampleValue = propertyQuad.object.value;
        } else if (samm.isNotInPayloadProperty(propertyQuad.predicate.value)) {
            property.notInPayload = propertyQuad.object.value === 'true';
        } else if (samm.isOptionalProperty(propertyQuad.predicate.value)) {
            property.optional = propertyQuad.object.value === 'true';
        } else if (samm.isPayloadNameProperty(propertyQuad.predicate.value)) {
            property.payloadName = propertyQuad.object.value;
        }
    }

    property._extends = getExtends(propertyQuads);
    property._extends?.addParent(property);

    return property;
}

export function getProperties(subject: Quad_Subject): Array<Property> {
    const rdfModel = getRdfModel();
    const samm = rdfModel.samm;
    const properties: Array<Property> = [];

    getStore()
        .getQuads(subject, samm.PropertiesProperty(), null, null)
        .forEach(propertyQuad => {
            rdfModel
                .resolveBlankNodes(propertyQuad.object.value)
                .filter(
                    quad =>
                        samm.isRdfFirst(quad.predicate.value) ||
                        samm.isReferenceProperty(quad.predicate.value) ||
                        samm.isExtends(quad.predicate.value)
                )
                .forEach(quad => properties.push(createProperty(quad)));
        });

    return properties;
}

function isDefinedInline(propertyQuad: Quad) {
    const rdfModel = getRdfModel();
    const samm = rdfModel.samm;
    const store = getStore();
    // check if the property is fully defined as separate definition
    if (
        (propertyQuad.object.id === samm.Property().id || propertyQuad.object.id === samm.AbstractProperty().id) &&
        !Util.isBlankNode(propertyQuad.subject)
    ) {
        return false;
    }

    // try to resolve property quads and check if a full defined property quad is there for Property
    return (
        store
            .getQuads(propertyQuad.subject, null, null, null)
            .find(quad => samm.Property().value !== quad.predicate.value && quad.predicate.value.startsWith(Samm.getBaseUri())) !==
        undefined
    );
}

function getExtends(quads: Array<Quad>) {
    const rdfModel = getRdfModel();
    const samm = rdfModel.samm;
    const store = getStore();
    const modelElementCache = getElementsCache();

    for (const value of quads) {
        if (samm.isExtends(value.predicate.value)) {
            const cachedProperty = modelElementCache.get<Property>(value.object.value);
            if (cachedProperty) {
                return cachedProperty;
            }

            const quadsAbstractProperty = store.getQuads(value.object, null, null, null);
            const extendedAbstractProperty = createProperty(store.getQuads(null, null, quadsAbstractProperty[0].subject, null)[0]);
            extendedAbstractProperty.isAbstract = quadsAbstractProperty.some(quad => samm.AbstractProperty().equals(quad.object));
            return modelElementCache.resolveInstance(extendedAbstractProperty);
        }
    }
}
