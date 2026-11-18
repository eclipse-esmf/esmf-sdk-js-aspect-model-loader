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

import {DataFactory, Quad} from 'n3';
import {MetaModelElementInstantiator} from './meta-model-element-instantiator.js';
import {DefaultEntity, Entity} from '../aspect-meta-model/default-entity.js';
import {DefaultPropertyInstanceDefinition, Property} from '../aspect-meta-model/index.js';
import {PredefinedEntityInstantiator} from './predefined-entity-instantiator.js';
import {PredefinedCharacteristicInstantiator} from './characteristic/predefined-characteristic-instantiator.js';

export class EntityInstantiator {
    constructor(private metaModelElementInstantiator: MetaModelElementInstantiator) {}

    createEntity(quads: Array<Quad>, isAbstract = false): Entity {
        const samm = this.metaModelElementInstantiator.samm;
        const entity = new DefaultEntity(null!, null!, null!, new Array<Property>(), isAbstract);

        this.metaModelElementInstantiator.initBaseProperties(quads, entity, this.metaModelElementInstantiator.rdfModel);

        quads.forEach(quad => {
            if (samm.isPropertiesProperty(quad.predicate.value)) {
                entity.properties = this.metaModelElementInstantiator.getProperties(DataFactory.namedNode(quad.subject.value));
            }
            if (samm.isExtends(quad.predicate.value)) {
                const abstractQuadEntity = this.metaModelElementInstantiator.rdfModel.store.getQuads(quad.object, null, null, null);
                if (abstractQuadEntity && abstractQuadEntity.length > 0) {
                    entity.extends = new EntityInstantiator(this.metaModelElementInstantiator).createEntity(
                        abstractQuadEntity,
                        true
                    ) as DefaultEntity;
                } else if (quad.object.value.startsWith(this.metaModelElementInstantiator.sammE.getNamespace())) {
                    const predefinedEntity = this.createPredefinedEntity(quad.object.value);
                    if (predefinedEntity?.isAbstract) {
                        entity.extends = predefinedEntity;
                    }
                }
            }
        });

        entity.properties.forEach(property => (property as DefaultPropertyInstanceDefinition).addParent(entity));

        return <Entity>this.metaModelElementInstantiator.cacheService.resolveInstance(entity);
    }

    private createPredefinedEntity(urn: string): Entity {
        const name = urn.substring(this.metaModelElementInstantiator.sammE.getNamespace().length);
        return new PredefinedEntityInstantiator(
            this.metaModelElementInstantiator,
            new PredefinedCharacteristicInstantiator(this.metaModelElementInstantiator)
        ).createEntity(name);
    }
}
