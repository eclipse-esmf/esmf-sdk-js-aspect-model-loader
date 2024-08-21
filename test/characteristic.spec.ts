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

import {lastValueFrom} from 'rxjs';
import {
    Aspect,
    AspectModelLoader,
    Characteristic,
    DefaultAspect,
    DefaultCharacteristic,
    DefaultCollection,
    DefaultEither,
    DefaultEntity,
    DefaultEntityInstance,
    DefaultEnumeration,
    DefaultList,
    Property,
} from '../src';
import {
    characteristicClassString,
    collectionCharacteristicClassString,
    eitherCharacteristicClass,
    enumerationCharacteristicClassEntity,
    enumerationCharacteristicWithEntityInstanceClass,
} from './models/characteristics';
import DoneCallback = jest.DoneCallback;
import {destroyRdfModel} from '../src/shared/rdf-model';

describe('Characteristics tests', (): void => {
    const currentLocale = 'en';

    describe('Characteristic class with string datatype', (): void => {
        let testCharacteristic: Characteristic;
        let loader: AspectModelLoader;
        let aspect: DefaultAspect;
        let testProperty: Property;

        beforeAll(() => {
            loader = new AspectModelLoader();
            lastValueFrom(loader.loadSelfContainedModel(characteristicClassString)).then(_aspect => {
                aspect = _aspect;
                testProperty = aspect.properties[0];
                testCharacteristic = testProperty.characteristic;
            });
        });

        it('should include Constraint name in the URN code', (): void => {
            expect(testCharacteristic.aspectModelUrn.indexOf('CharacteristicTest')).toBeGreaterThan(-1);
        });

        it('should populate Characteristic with available data from fields', (): void => {
            expect(testCharacteristic.metaModelVersion).toBe('2.1.0');
            expect(testCharacteristic.dataType?.urn).toEqual('http://www.w3.org/2001/XMLSchema#string');
            expect(testCharacteristic.name).toBe('CharacteristicTest');
            expect(Array.from(testCharacteristic.descriptions.keys())).toEqual([currentLocale]);
            expect(testCharacteristic.getDescription(currentLocale)).toBe('This is a test description!');
            expect(testCharacteristic.see).toEqual(['https%3A%2F%2Ftestcharacteristic.com']);
            expect(testCharacteristic.isAnonymous()).toEqual(false);
        });

        afterAll(() => {
            destroyRdfModel();
        });
    });

    describe('Collection class with string datatype', (): void => {
        let testCharacteristic: Characteristic;
        let loader: AspectModelLoader;
        let aspect: DefaultAspect;
        let testProperty: Property;

        beforeAll(() => {
            loader = new AspectModelLoader();
            lastValueFrom(loader.loadSelfContainedModel(collectionCharacteristicClassString)).then(_aspect => {
                aspect = _aspect;
                testProperty = aspect.properties[0];
                testCharacteristic = testProperty.characteristic;
            });
        });

        it('should have set datatype string', (): void => {
            expect((testProperty.characteristic as DefaultCollection)?.elementCharacteristic?.dataType?.urn).toEqual(
                'http://www.w3.org/2001/XMLSchema#string'
            );
        });

        it('should have collection type', (): void => {
            expect(testCharacteristic instanceof DefaultCollection).toBe(true);
        });

        it('should include Constraint name in the URN code', (): void => {
            expect(testCharacteristic.aspectModelUrn.indexOf('CharacteristicTest')).toBeGreaterThan(-1);
        });

        it('should populate collection Characteristic with available data from fields', (): void => {
            const currentLocale = 'en';
            expect(testCharacteristic.metaModelVersion).toBe('2.1.0');
            expect(testCharacteristic.name).toBe('CharacteristicTest');
            expect(Array.from(testCharacteristic.descriptions.keys())).toEqual([currentLocale]);
            expect(testCharacteristic.getDescription(currentLocale)).toBe('This is a test description!');
            expect(testCharacteristic.see).toEqual(['https%3A%2F%2Ftestcharacteristic.com']);
            expect((testCharacteristic as DefaultCollection).isAnonymous()).toEqual(false);
            expect((testCharacteristic as DefaultCollection).isOrdered()).toEqual(false);
        });

        it('should have element characteristic with correct fields', (): void => {
            const elementCharacteristic = (testCharacteristic as DefaultCollection).elementCharacteristic;
            expect(elementCharacteristic instanceof DefaultCharacteristic).toBe(true);
            expect(elementCharacteristic?.aspectModelUrn.indexOf('Characteristic1')).toBeGreaterThan(-1);
            expect(elementCharacteristic?.getDescription(currentLocale)).toBe('This is an element Characteristic!');
        });

        afterAll(() => {
            destroyRdfModel();
        });
    });

    describe('Enumeration class with Entity datatype', (): void => {
        let loader: AspectModelLoader;
        let aspect: DefaultAspect;
        let testProperty: Property;

        beforeAll((done: DoneCallback): void => {
            loader = new AspectModelLoader();
            lastValueFrom(loader.loadSelfContainedModel(enumerationCharacteristicClassEntity)).then((_aspect: DefaultAspect): void => {
                aspect = _aspect;
                testProperty = aspect.properties[0];
                done();
            });
        });

        it('should have enumeration type', (): void => {
            expect(testProperty.characteristic instanceof DefaultEnumeration).toBe(true);
        });

        it('should have correct model urn', (): void => {
            expect((testProperty.characteristic.dataType as DefaultEntity).properties[1].aspectModelUrn).toEqual(
                'urn:samm:org.eclipse.esmf.test:1.0.0#resultStateAttributeDescription'
            );
        });

        it('should have no description and loads successfully', (): void => {
            const testNoDescProperty = aspect.properties[1];
            expect((testNoDescProperty.characteristic.dataType as DefaultEntity).properties.length).toEqual(1);
        });

        it('should have two entries', (): void => {
            const enumeration = testProperty.characteristic as DefaultEnumeration;
            expect(enumeration.values.length).toBe(2);

            const valueInstance = enumeration.getValue('urn:samm:org.eclipse.esmf.test:1.0.0#NOKState') as DefaultEntityInstance;
            expect(valueInstance.name).toBe('NOKState');
            expect(valueInstance.assertions.has('resultStateAttributeValue')).toBe(true);
            expect(valueInstance.assertions.get('resultStateAttributeValue')?.value).toEqual('nok');

            expect(valueInstance.assertions.has('resultStateAttributeDescription')).toBe(true);
            expect(valueInstance.assertions.get('resultStateAttributeDescription')?.value).toEqual([
                {language: 'en', value: 'Result state not OK'},
                {language: 'de', value: 'Result Status nicht OK'},
            ]);
        });

        afterAll((): void => {
            destroyRdfModel();
        });
    });

    describe('Enumeration class with Entity Instance', (): void => {
        let loader: AspectModelLoader;
        let aspect: DefaultAspect;
        let testProperty: Property;

        beforeAll((): void => {
            loader = new AspectModelLoader();
            lastValueFrom(loader.loadSelfContainedModel(enumerationCharacteristicWithEntityInstanceClass)).then((_aspect: Aspect): void => {
                aspect = _aspect;
                testProperty = aspect.properties[0];
            });
        });

        it('should have enumeration type', (): void => {
            expect(testProperty.characteristic instanceof DefaultEnumeration).toBe(true);
        });

        it('should have correct model urn', (): void => {
            expect((testProperty.characteristic.dataType as DefaultEntity).properties[1].aspectModelUrn).toEqual(
                'urn:samm:org.eclipse.esmf.test:1.0.0#resultTypeDescription'
            );
        });

        it('should have two entries', (): void => {
            const enumeration = testProperty.characteristic as DefaultEnumeration;
            expect(enumeration.values.length).toBe(2);
        });

        it('Result type values should be instanceof DefaultEntityInstance class', (): void => {
            const enumeration = testProperty.characteristic as DefaultEnumeration;
            expect(enumeration.values[0] instanceof DefaultEntityInstance).toBe(true);
        });

        afterAll((): void => {
            destroyRdfModel();
        });
    });

    describe('Either class with list and simple characteristic', (): void => {
        let loader: AspectModelLoader;
        let aspect: DefaultAspect;
        let testProperty: Property;

        beforeAll((): void => {
            loader = new AspectModelLoader();
            lastValueFrom(loader.loadSelfContainedModel(eitherCharacteristicClass)).then((_aspect: DefaultAspect): void => {
                aspect = _aspect;
                testProperty = aspect.properties[0];
            });
        });

        it('should not have a datatype', (): void => {
            expect(testProperty.characteristic instanceof DefaultEither).toBeTruthy();
            expect(testProperty.characteristic.dataType?.urn).toBeUndefined();
        });

        it('should property1 has right type float', (): void => {
            expect(testProperty.characteristic instanceof DefaultEither).toBeTruthy();
            expect((testProperty.characteristic as DefaultEither).right).toBeInstanceOf(DefaultList);
            expect((testProperty.characteristic as DefaultEither).right.dataType?.getShortType()).toBe('float');
        });

        it('should property2 has left type SpatialPosition', (): void => {
            expect((aspect.properties[1].characteristic as DefaultEither).left.dataType?.urn).toContain('SpatialPosition');
            expect((aspect.properties[1].characteristic as DefaultEither).left.constructor.name).toBe('DefaultSingleEntity');
        });

        it('should property2 has right type string', (): void => {
            expect(aspect.properties[1].characteristic instanceof DefaultEither).toBeTruthy();
            expect((aspect.properties[1].characteristic as DefaultEither).right).toBeInstanceOf(DefaultList);
            expect((aspect.properties[1].characteristic as DefaultEither).right.dataType?.getShortType()).toContain('string');
        });

        afterAll((): void => {
            destroyRdfModel();
        });
    });
});
