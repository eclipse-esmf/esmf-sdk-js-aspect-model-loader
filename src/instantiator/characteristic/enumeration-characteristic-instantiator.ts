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
import {CharacteristicInstantiator} from './characteristic-instantiator.js';
import {DataFactory, NamedNode, Quad, Util} from 'n3';
import {Characteristic} from '../../aspect-meta-model/index.js';
import {DefaultEnumeration, Enumeration} from '../../aspect-meta-model/characteristic/default-enumeration.js';
import {Samm} from '../../vocabulary/index.js';
import {DefaultEntityInstance} from '../../aspect-meta-model/default-entity-instance.js';
import {CharacteristicInstantiatorUtil} from './characteristic-instantiator-util.js';
import {EntityInstanceResolver} from './entity-instance-resolver.js';
import {Value} from '../../aspect-meta-model/default-value.js';
import {ValueInstantiator} from '../value-instantiator.js';

export class EnumerationCharacteristicInstantiator extends CharacteristicInstantiator {
    protected processElement(quads: Array<Quad>): Characteristic {
        const samm = this.metaModelElementInstantiator.samm;
        const sammC = this.metaModelElementInstantiator.sammC;
        const enumeration = this.createEnumerationObject();
        const dataType = quads.find(quad => this.samm.isDataTypeProperty(quad.predicate.value));

        quads.forEach(quad => {
            if (samm.isValueProperty(quad.predicate.value) || sammC.isValuesProperty(quad.predicate.value)) {
                if (Util.isBlankNode(quad.object)) {
                    enumeration.values = this.getEnumerationValues(quad, dataType?.object.value as string);
                }
            }
        });
        return enumeration;
    }

    /**
     * Override the method in the corresponding specific enumeration class to create the correct type of
     * collection e.g. see state-characteristic-instantiator.
     */
    protected createEnumerationObject(): Enumeration {
        return new DefaultEnumeration(null!, null!, null!, null!, null!);
    }

    private getEnumerationValues(quad: Quad, dataType: string): Array<string | number | DefaultEntityInstance | Value> {
        const quads = this.resolveListItems(quad.object.value);
        return quads.map(quadValue => this.resolveValue(quadValue, dataType));
    }

    /**
     * Resolves a single value of an Enumeration or State, which can be a literal,
     * a samm:Value (SAMM 2.2.0 and later) or an entity instance.
     */
    protected resolveValue(quad: Quad, dataType: string): string | number | DefaultEntityInstance | Value {
        if (Util.isLiteral(quad.object)) {
            return CharacteristicInstantiatorUtil.resolveValues(quad, dataType);
        }
        const valueInstantiator = new ValueInstantiator(this.metaModelElementInstantiator);
        if (valueInstantiator.isValue(quad.object)) {
            return valueInstantiator.createValue(quad.object, dataType);
        }
        return this.resolveEntityInstance(quad);
    }

    /**
     * Resolves the items of an RDF list. In contrast to RdfModel.resolveBlankNodes(), anonymous
     * samm:Value nodes are kept as list items instead of being flattened.
     */
    private resolveListItems(uri: string, resolvedNodes: Array<Quad> = []): Array<Quad> {
        const valueInstantiator = new ValueInstantiator(this.metaModelElementInstantiator);
        this.metaModelElementInstantiator.rdfModel.store.getQuads(DataFactory.blankNode(uri), null, null, null).forEach(value => {
            if (Util.isBlankNode(value.object) && !valueInstantiator.isValue(value.object)) {
                this.resolveListItems(value.object.value, resolvedNodes);
            } else if (!value.object.value.startsWith(Samm.RDF_URI)) {
                resolvedNodes.push(DataFactory.quad(value.subject, value.predicate, value.object));
            }
        });
        return resolvedNodes;
    }

    protected resolveEntityInstance(quad: Quad): DefaultEntityInstance {
        return new EntityInstanceResolver(this.metaModelElementInstantiator).resolve(quad);
    }

    shouldProcess(nameNode: NamedNode): boolean {
        return this.metaModelElementInstantiator.sammC.EnumerationCharacteristic().equals(nameNode);
    }
}
