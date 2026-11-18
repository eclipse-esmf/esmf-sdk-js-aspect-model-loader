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

import {Store} from 'n3';
import {DefaultCharacteristic, DefaultList, DefaultScalar, DefaultTrait, Samm, SammC, SammU} from '../src/index.js';
import {RdfModel} from '../src/shared/rdf-model.js';
import {RdfModelUtil} from '../src/shared/rdf-model-util.js';

const VERSION = '2.2.0';
const URN = 'urn:samm:org.eclipse.esmf.test:1.0.0';

describe('Effective data type', (): void => {
    const stringType = new DefaultScalar('http://www.w3.org/2001/XMLSchema#string');
    const element = new DefaultCharacteristic(VERSION, `${URN}#Element`, 'Element', stringType);

    test('should resolve the data type of a plain characteristic', (): void => {
        expect(DefaultCharacteristic.getEffectiveDataType(element)).toBe(stringType);
    });

    test('should resolve the base characteristic data type of a trait', (): void => {
        const trait = new DefaultTrait(VERSION, `${URN}#Trait`, 'Trait', element);
        expect(DefaultCharacteristic.getEffectiveDataType(trait)).toBe(stringType);
    });

    test('should resolve the element characteristic data type of a list', (): void => {
        const list = new DefaultList(VERSION, `${URN}#List`, 'List', element);
        expect(DefaultCharacteristic.getEffectiveDataType(list)).toBe(stringType);
    });

    test('should resolve the base characteristic data type of a trait used as element characteristic', (): void => {
        const trait = new DefaultTrait(VERSION, `${URN}#Trait`, 'Trait', element);
        const list = new DefaultList(VERSION, `${URN}#List`, 'List', trait);
        expect(DefaultCharacteristic.getEffectiveDataType(list)).toBe(stringType);
    });
});

describe('RdfModelUtil definition checks', (): void => {
    const samm = new Samm(VERSION);
    const sammC = new SammC(samm);
    const sammU = new SammU(samm);

    test('should return booleans for missing urns', (): void => {
        expect(RdfModelUtil.isSammDefinition(undefined!, samm)).toBe(false);
        expect(RdfModelUtil.isSammCDefinition('', sammC)).toBe(false);
        expect(RdfModelUtil.isSammUDefinition(null!, sammU)).toBe(false);
    });

    test('should detect namespace definitions', (): void => {
        expect(RdfModelUtil.isSammDefinition(`${samm.getNamespace()}Aspect`, samm)).toBe(true);
        expect(RdfModelUtil.isSammCDefinition(`${sammC.getNamespace()}Trait`, sammC)).toBe(true);
        expect(RdfModelUtil.isSammUDefinition(`${samm.getNamespace()}Aspect`, sammU)).toBe(false);
    });
});

describe('RdfModel prefixes', (): void => {
    test('should expose the prefixes as a record', (): void => {
        const rdfModel = new RdfModel(new Store(), VERSION, URN);
        const prefixes = rdfModel.getPrefixes();
        expect(Array.isArray(prefixes)).toBe(false);
        expect(prefixes['']).toBe(`${URN}#`);
        expect(rdfModel.getNamespaces()).toContain(`${URN}#`);
        expect(rdfModel.getAspectModelUrn()).toBe(`${URN}#`);
    });
});
