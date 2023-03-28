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

import {MetaModelElementInstantiator} from '../meta-model-element-instantiator';
import {NamedNode, Quad, Util} from 'n3';
import {Characteristic, DefaultCharacteristic, DefaultEntity, DefaultScalar, Entity, Type} from '../../aspect-meta-model';
import {PredefinedCharacteristicInstantiator} from './predefined-characteristic-instantiator';
import {EntityInstantiator} from '../entity-instantiator';
import {BaseConstraintCharacteristicInstantiator} from '../base-constraint-characteristic-instantiator';

export class CharacteristicInstantiator extends BaseConstraintCharacteristicInstantiator {
    private standardCharacteristicInstantiator: PredefinedCharacteristicInstantiator;

    constructor(protected metaModelElementInstantiator: MetaModelElementInstantiator, public nextProcessor?: CharacteristicInstantiator) {
        super(metaModelElementInstantiator, nextProcessor);
        this.standardCharacteristicInstantiator = new PredefinedCharacteristicInstantiator(metaModelElementInstantiator);
    }

    create(quad: Quad): Characteristic {
        let characteristic: Characteristic = this.determineDefaultCharacteristic(quad);
        if (characteristic) {
            return characteristic;
        }

        characteristic = super.create(quad);
        characteristic.dataType = this.getDataType(
            this.metaModelElementInstantiator.rdfModel
                .findAnyProperty(quad)
                .find(propertyQuad => this.samm.isDataTypeProperty(propertyQuad.predicate.value))
        );

        if (characteristic.dataType && characteristic.dataType.isComplex) {
            (characteristic.dataType as DefaultEntity).addParent(characteristic);
        }

        // Anonymous nodes are stored in the array for later processing of the name
        if ((characteristic as DefaultCharacteristic).isAnonymousNode) {
            const initialName: string = characteristic.name;

            // assign a unique random name
            characteristic.name = characteristic.name ? characteristic.name : 'characteristic_' + Math.random().toString(36).substr(2, 9);
            characteristic.aspectModelUrn = `${this.metaModelElementInstantiator.rdfModel.getAspectModelUrn()}${characteristic.name}`;
            this.metaModelElementInstantiator.cacheService.addElement(initialName, characteristic);
        }
        return <Characteristic>this.metaModelElementInstantiator.cacheService.resolveInstance(characteristic);
    }

    private determineDefaultCharacteristic(quad: Quad): Characteristic | undefined {
        // resolve actual element quad in case of a blank node which is most likely the case
        // for characteristics
        const elementQuad = Util.isBlankNode(quad.object)
            ? this.metaModelElementInstantiator.rdfModel.resolveBlankNodes(quad.object.value).shift()
            : quad;

        // check if the found quad target a default SAMM characteristic e.g. Text or Code in this case
        // return the exiting default characteristic
        if (elementQuad.object.value.startsWith(this.metaModelElementInstantiator.sammC.getNamespace())) {
            const standardCharacteristic = this.standardCharacteristicInstantiator.createCharacteristic(<NamedNode>elementQuad.object);
            if (standardCharacteristic) {
                return standardCharacteristic;
            }
        }

        return undefined;
    }

    protected processElement(quads: Array<Quad>): Characteristic {
        return new DefaultCharacteristic(null, null, null);
    }

    /**
     * This method must be override from the respective constraint or characteristic instantiator implementation in order to get called.
     */
    shouldProcess(namedNode: NamedNode): boolean {
        return true;
    }

    isEntity(quad: Quad): boolean {
        if (this.samm.Entity().equals(quad.object) || this.samm.AbstractEntity().equals(quad.object)) {
            return true;
        }

        const propertyFound = this.metaModelElementInstantiator.rdfModel
            .findAnyProperty(quad)
            .find(quadProperty => this.samm.Entity().equals(quadProperty.subject));

        return !!propertyFound;
    }

    protected getDataType(quad: Quad): Type {
        // Not every characteristic has a dataType e.g. the Either characteristic.
        // Thus, null is a valid value and needs to be considered.
        if (!quad) {
            return null;
        }

        if (Util.isBlankNode(quad.object)) {
            quad = this.metaModelElementInstantiator.rdfModel.resolveBlankNodes(quad.object.value).shift();
        }

        const typeQuad = quad ? this.getEffectiveType(quad) : null;

        if (!typeQuad) {
            return null;
        }

        const quadEntity = this.metaModelElementInstantiator.rdfModel.store.getQuads(typeQuad.object, null, null, null);
        if (quadEntity && quadEntity.length > 0 && this.isEntity(quadEntity[0])) {
            const entity = new EntityInstantiator(this.metaModelElementInstantiator).createEntity(
                quadEntity,
                quadEntity.find(
                    quad => this.samm.isRdfTypeProperty(quad.predicate.value) && this.samm.isAbstractEntity(quad.object.value)
                ) !== undefined
            );
            return <Entity>this.metaModelElementInstantiator.cacheService.resolveInstance(entity);
        }

        return new DefaultScalar(typeQuad.object.value);
    }

    private getEffectiveType(quad: Quad): Quad {
        if (Util.isBlankNode(quad.subject)) {
            let resolvedQuad: Array<Quad>;
            if (this.samm.isDataTypeProperty(quad.predicate.value)) {
                resolvedQuad = [quad];
            } else {
                resolvedQuad = this.metaModelElementInstantiator.rdfModel.store.getQuads(quad.subject, null, null, null);
            }

            quad = resolvedQuad.find(propertyQuad => this.samm.isDataTypeProperty(propertyQuad.predicate.value));
        } else if (quad.predicate.value === `${this.samm.getRdfSyntaxNameSpace()}type`) {
            const resolvedQuad = this.metaModelElementInstantiator.rdfModel.store.getQuads(quad.subject, null, null, null);

            quad = resolvedQuad.find(propertyQuad => this.samm.isDataTypeProperty(propertyQuad.predicate.value));
        }

        return quad;
    }
}
