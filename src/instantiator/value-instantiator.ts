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

import {Literal, Quad, Quad_Object, Term, Util} from 'n3';
import {DefaultValue, Value} from '../aspect-meta-model/default-value.js';
import {MetaModelElementInstantiator} from './meta-model-element-instantiator.js';
import {CharacteristicInstantiatorUtil} from './characteristic/characteristic-instantiator-util.js';

/**
 * Instantiates samm:Value nodes (SAMM 2.2.0 and later), either referenced by URN or defined inline as blank node.
 */
export class ValueInstantiator {
    constructor(private metaModelElementInstantiator: MetaModelElementInstantiator) {}

    /**
     * Checks whether the given node is typed as samm:Value.
     */
    isValue(node: Term): boolean {
        if (!node || Util.isLiteral(node)) {
            return false;
        }
        const samm = this.metaModelElementInstantiator.samm;
        return this.metaModelElementInstantiator.rdfModel.store.getQuads(node, samm.RdfType(), samm.Value(), null).length > 0;
    }

    /**
     * Creates the Value for the given node.
     *
     * @param node node typed as samm:Value
     * @param dataType optional data type used to convert the literal value (e.g. to a number)
     */
    createValue(node: Quad_Object, dataType?: string): Value {
        const samm = this.metaModelElementInstantiator.samm;
        const rdfModel = this.metaModelElementInstantiator.rdfModel;
        const quads = rdfModel.store.getQuads(node, null, null, null);
        const isAnonymous = Util.isBlankNode(node);
        const value = new DefaultValue(null!, null!, null!, null!, isAnonymous);

        this.metaModelElementInstantiator.initBaseProperties(quads, value, rdfModel);

        const valueQuad = quads.find(quad => samm.isValueProperty(quad.predicate.value));
        if (valueQuad) {
            value.value = Util.isLiteral(valueQuad.object) ? this.resolveLiteral(valueQuad, dataType) : valueQuad.object.value;
        }

        return isAnonymous ? value : <Value>this.metaModelElementInstantiator.cacheService.resolveInstance(value);
    }

    private resolveLiteral(quad: Quad, dataType?: string): string | number | boolean {
        const effectiveDataType = dataType || (quad.object as Literal).datatypeString;
        if (effectiveDataType && effectiveDataType.endsWith('#boolean')) {
            return quad.object.value === 'true';
        }
        return CharacteristicInstantiatorUtil.resolveValues(quad, effectiveDataType);
    }
}
