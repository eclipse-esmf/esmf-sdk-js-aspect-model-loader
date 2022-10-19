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

import {DefaultQuantityKind, QuantityKind} from '../aspect-meta-model/default-quantity-kind';
import {DefaultUnit, Unit} from '../aspect-meta-model/default-unit';
import {Bamm, Bammu} from '../vocabulary';
import {MetaModelElementInstantiator} from './meta-model-element-instantiator';
import {DataFactory} from 'n3';
import {Units} from '../shared/units';

export class BammUnitInstantiator {
    private readonly bammu: Bammu;
    private readonly bamm: Bamm;
    private readonly units: Units;

    constructor(private metaModelElementInstantiator: MetaModelElementInstantiator) {
        this.bammu = this.metaModelElementInstantiator.BAMMU();
        this.bamm = this.metaModelElementInstantiator.BAMM();
        this.units = new Units(this.bammu);
    }

    getUnit(name: string): Unit {
        const unit = this.createUnit(name);
        return <Unit>this.metaModelElementInstantiator.cacheService.resolveInstance(unit);
    }

    createQuantityKind(name: string): QuantityKind {
        if (name) {
            const quantityKind = this.units.getQuantityKind(name.replace(this.bammu.getNamespace(), ''));
            if (quantityKind) {
                return new DefaultQuantityKind(
                    this.bamm.version,
                    `${this.metaModelElementInstantiator.BAMMU().getDefaultQuantityKindsUri()}${quantityKind.name}`,
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
            const unit = this.units.getUnit(name.replace(this.bammu.getNamespace(), ''));
            const defaultUnit = new DefaultUnit(this.bamm.version, null, null, null, null, null);

            if (unit) {
                defaultUnit.name = unit.name;
                defaultUnit.addPreferredName('en', unit.label);
                defaultUnit.aspectModelUrn = `${this.metaModelElementInstantiator.BAMMU().getDefaultUnitUri()}#${defaultUnit.name}`;
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
                    if (this.bamm.isSymbolProperty(quad.predicate.value)) {
                        defaultUnit.symbol = quad.object.value;
                    } else if (this.bamm.isReferenceUnitProperty(quad.predicate.value)) {
                        defaultUnit.referenceUnit = quad.object.value;
                    } else if (this.bamm.isConversionFactorProperty(quad.predicate.value)) {
                        defaultUnit.conversionFactor = quad.object.value;
                    } else if (this.bammu.isCodeProperty(quad.predicate.value)) {
                        defaultUnit.code = quad.object.value;
                    } else if (this.bamm.isQuantityKindProperty(quad.predicate.value)) {
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
