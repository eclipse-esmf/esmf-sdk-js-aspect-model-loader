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

import {Literal, Quad, Util} from 'n3';
import {Samm} from '../../vocabulary/index.js';
import {DefaultEntityInstance} from '../../aspect-meta-model/default-entity-instance.js';
import {EntityInstantiator} from '../entity-instantiator.js';
import {MetaModelElementInstantiator} from '../meta-model-element-instantiator.js';
import {CharacteristicInstantiatorUtil, MultiLanguageText} from './characteristic-instantiator-util.js';

/**
 * Resolves entity instances which are used as values of e.g. Enumerations, States or SortedSets.
 */
export class EntityInstanceResolver {
    constructor(private readonly metaModelElementInstantiator: MetaModelElementInstantiator) {}

    public resolve(quad: Quad): DefaultEntityInstance {
        const rdfModel = this.metaModelElementInstantiator.rdfModel;
        const entityInstanceQuads = rdfModel.store.getQuads(quad.object, null, null, null);
        const entityTypeQuad = entityInstanceQuads.find(
            entityInstanceQuad => entityInstanceQuad.predicate.value === `${Samm.RDF_URI}#type`
        );

        if (!entityTypeQuad) {
            throw new Error(`Could not resolve Entity instance ${quad.object.value}`);
        }

        const entity = new EntityInstantiator(this.metaModelElementInstantiator).createEntity(
            rdfModel.store.getQuads(entityTypeQuad.object, null, null, null)
        );

        // determine the description of the value/instance if defined
        const descriptionQuad = entityInstanceQuads.find(
            entityInstanceQuad =>
                entityInstanceQuad.predicate.id.toLowerCase().includes('description') &&
                entity.properties.find(property => property.isNotInPayload === false && entityInstanceQuad.predicate.id)
        );
        const descriptions = new Map<string, string>();
        if (descriptionQuad) {
            entityInstanceQuads
                .filter(entityInstanceQuad => entityInstanceQuad.predicate.id === descriptionQuad.predicate.id)
                .forEach(entityInstanceQuad =>
                    descriptions.set(rdfModel.getLocale(entityInstanceQuad) || 'en', entityInstanceQuad.object.value)
                );
        }

        // create the related instance and attach the metamodel element to it
        const entityInstance = new DefaultEntityInstance(quad.object.value.split('#')[1], entity, descriptions);
        entityInstanceQuads.forEach(entityInstanceQuad => {
            const predicateKey = CharacteristicInstantiatorUtil.getPredicateKey(entityInstanceQuad);
            entityInstance[predicateKey] = this.resolveQuadObject(entityInstanceQuad);
        });

        return entityInstance;
    }

    private resolveQuadObject(quad: Quad): MultiLanguageText | Array<MultiLanguageText> | string {
        if (Util.isBlankNode(quad.object)) {
            const resolvedBlankNodes = this.metaModelElementInstantiator.rdfModel.resolveBlankNodes(quad.object.value);
            return CharacteristicInstantiatorUtil.solveBlankNodeValues([...resolvedBlankNodes]);
        }

        const datatype = (quad.object as Literal).datatypeString;
        if (datatype === Samm.RDF_LANG_STRING || datatype === Samm.XML_LANG_STRING) {
            return CharacteristicInstantiatorUtil.createLanguageObject(quad);
        }

        return quad.object.value;
    }
}
