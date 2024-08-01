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

import {DefaultQuantityKind, QuantityKind} from '../aspect-meta-model/default-quantity-kind';
import {DefaultUnit} from '../aspect-meta-model/default-unit';
import {getBaseProperties} from './meta-model-element-instantiator';
import {DataFactory} from 'n3';
import {getPredefinedUnit, getQuantityKind} from '../shared/units';
import {getRdfModel, getStore} from '../shared/rdf-model';

export function createUnit(urn: string) {
    if (!urn) {
        return null;
    }

    const store = getStore();
    const {sammU, samm} = getRdfModel();

    const quantityKindNames = new Array<string>();
    const unit = getPredefinedUnit(urn.replace(sammU.getNamespace(), ''));
    const defaultUnit = new DefaultUnit({
        metaModelVersion: samm.version,
        aspectModelUrn: '',
        name: '',
        quantityKinds: [],
    });

    if (unit) {
        defaultUnit.name = unit.name;
        defaultUnit.preferredNames.set('en', unit.label);
        defaultUnit.aspectModelUrn = `${sammU.getDefaultUnitUri()}#${defaultUnit.name}`;
        defaultUnit.symbol = unit.symbol;
        defaultUnit.code = unit.code;
        defaultUnit.referenceUnit = unit.referenceUnit ? unit.referenceUnit().name : null;
        defaultUnit.conversionFactor = unit.conversionFactor;
        defaultUnit.quantityKinds = unit.quantityKinds;
    } else {
        const unitPropertyQuads = store.getQuads(DataFactory.namedNode(urn), null, null, null);
        const baseProperties = getBaseProperties(DataFactory.namedNode(urn));

        defaultUnit.name = baseProperties.name;
        defaultUnit.aspectModelUrn = baseProperties.aspectModelUrn;
        defaultUnit.metaModelVersion = baseProperties.metaModelVersion;
        defaultUnit.syntheticName = baseProperties.hasSyntheticName;

        for (const quad of unitPropertyQuads) {
            if (samm.isSymbolProperty(quad.predicate.value)) {
                defaultUnit.symbol = quad.object.value;
            } else if (samm.isReferenceUnitProperty(quad.predicate.value)) {
                defaultUnit.referenceUnit = quad.object.value;
            } else if (samm.isConversionFactorProperty(quad.predicate.value)) {
                defaultUnit.conversionFactor = quad.object.value;
            } else if (sammU.isCodeProperty(quad.predicate.value)) {
                defaultUnit.code = quad.object.value;
            } else if (samm.isQuantityKindProperty(quad.predicate.value)) {
                quantityKindNames.push(quad.object.value);
            }
        }
    }

    quantityKindNames.forEach(quantityKindName => {
        const quantityKind = this.createQuantityKind(quantityKindName);
        if (quantityKind) {
            defaultUnit.quantityKinds.push(quantityKind);
        }
    });
    return defaultUnit;
}

export function createQuantityKind(name: string): QuantityKind {
    if (!name) {
        return null;
    }

    const {sammU} = getRdfModel();

    const quantityKind = getQuantityKind(name.replace(this.sammU.getNamespace(), ''));
    if (quantityKind) {
        return new DefaultQuantityKind({
            metaModelVersion: this.samm.version,
            aspectModelUrn: `${sammU.getDefaultQuantityKindsUri()}${quantityKind.name}`,
            name: quantityKind.name,
            label: quantityKind.label,
        });
    }
}
