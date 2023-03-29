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
import {DefaultUnit, Unit} from '../aspect-meta-model/default-unit';
import {Samm, SammU} from '../vocabulary';
import {MetaModelElementInstantiator} from './meta-model-element-instantiator';
import {DataFactory} from 'n3';
import {Units} from '../shared/units';

export class PredefinedUnitInstantiator {
    private readonly sammU: SammU;
    private readonly samm: Samm;
    private readonly units: Units;

    constructor(private metaModelElementInstantiator: MetaModelElementInstantiator) {
        this.sammU = this.metaModelElementInstantiator.sammU;
        this.samm = this.metaModelElementInstantiator.samm;
        this.units = new Units(this.sammU);
    }

    getUnit(name: string): Unit {
        const unit = this.createUnit(name);
        return <Unit>this.metaModelElementInstantiator.cacheService.resolveInstance(unit);
    }

    createQuantityKind(name: string): QuantityKind {
        if (name) {
            const quantityKind = this.units.getQuantityKind(name.replace(this.sammU.getNamespace(), ''));
            if (quantityKind) {
                return new DefaultQuantityKind(
                    this.samm.version,
                    `${this.metaModelElementInstantiator.sammU.getDefaultQuantityKindsUri()}${quantityKind.name}`,
                    quantityKind.name,
                    quantityKind.label
                );
            }
        }
        return null;
    }

    createUnit(name: string): Unit {
        if (name) {
            const quantityKindNames = new Array<string>();
            const unit = this.units.getUnit(name.replace(this.sammU.getNamespace(), ''));
            const defaultUnit = new DefaultUnit(this.samm.version, null, null, null, null, null);

            if (unit) {
                defaultUnit.name = unit.name;
                defaultUnit.addPreferredName('en', unit.label);
                defaultUnit.aspectModelUrn = `${this.metaModelElementInstantiator.sammU.getDefaultUnitUri()}#${defaultUnit.name}`;
                defaultUnit.symbol = unit.symbol;
                defaultUnit.code = unit.code;
                defaultUnit.referenceUnit = unit.referenceUnit ? unit.referenceUnit().name : null;
                defaultUnit.conversionFactor = unit.conversionFactor;
                defaultUnit.quantityKinds = unit.quantityKinds;
            } else {
                const unitPropertyQuads = this.metaModelElementInstantiator.rdfModel.store.getQuads(
                    DataFactory.namedNode(name),
                    null,
                    null,
                    null
                );

                unitPropertyQuads.forEach(quad => {
                    if (this.samm.isSymbolProperty(quad.predicate.value)) {
                        defaultUnit.symbol = quad.object.value;
                    } else if (this.samm.isReferenceUnitProperty(quad.predicate.value)) {
                        defaultUnit.referenceUnit = quad.object.value;
                    } else if (this.samm.isConversionFactorProperty(quad.predicate.value)) {
                        defaultUnit.conversionFactor = quad.object.value;
                    } else if (this.sammU.isCodeProperty(quad.predicate.value)) {
                        defaultUnit.code = quad.object.value;
                    } else if (this.samm.isQuantityKindProperty(quad.predicate.value)) {
                        quantityKindNames.push(quad.object.value);
                    }
                });

                this.metaModelElementInstantiator.initBaseProperties(
                    unitPropertyQuads,
                    defaultUnit,
                    this.metaModelElementInstantiator.rdfModel
                );
            }

            quantityKindNames.forEach(quantityKindName => {
                const quantityKind = this.createQuantityKind(quantityKindName);
                if (quantityKind) {
                    defaultUnit.quantityKinds.push(quantityKind);
                }
            });
            return defaultUnit;
        }

        return null;
    }

    getSupportedQuantityKindsNames(): Array<string> {
        return Object.keys(this.units.getSupportedQuantityKindsNames());
    }

    getSupportedUnitNames(): Array<string> {
        return Object.keys(this.units.getSupportedUnitNames());
    }
}
