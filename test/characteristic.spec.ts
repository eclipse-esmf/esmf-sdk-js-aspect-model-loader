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

import {Subscription} from 'rxjs';
import {
    AspectModelLoader,
    Characteristic,
    DefaultAspect,
    DefaultCharacteristic,
    DefaultCollection,
    DefaultEither,
    DefaultEntityInstance,
    DefaultEnumeration,
    DefaultList,
    DefaultScalar,
    Property,
} from '../src';
import {
    characteristicClassString,
    collectionCharacteristicClassString,
    eitherCharacteristicClass,
    enumerationCharacteristicClassEntity,
} from './models/characteristics';
import DoneCallback = jest.DoneCallback;

describe('Characteristics tests', (): void => {
    let loader: AspectModelLoader;
    let aspect: DefaultAspect;
    let testProperty: Property;
    let testCharacteristic: Characteristic;
    let subscription: Subscription;
    const currentLocale = 'en';
    describe('Characteristic class with string datatype', (): void => {
        beforeAll((done: DoneCallback): void => {
            loader = new AspectModelLoader();
            subscription = loader.loadSelfContainedModel(characteristicClassString).subscribe((_aspect: DefaultAspect): void => {
                aspect = _aspect;
                testProperty = aspect.properties[0];
                testCharacteristic = testProperty.characteristic;
                done();
            });
        });

        it('should include Constraint name in the URN code', (): void => {
            expect(testCharacteristic.aspectModelUrn.indexOf('CharacteristicTest')).toBeGreaterThan(-1);
        });

        it('should populate Characteristic with available data from fields', (): void => {
            expect(testCharacteristic.metaModelVersion).toBe('1.0.0');
            expect(testCharacteristic.dataType).toEqual({_urn: 'http://www.w3.org/2001/XMLSchema#string'});
            expect(testCharacteristic.name).toBe('CharacteristicTest');
            expect(testCharacteristic.localesDescriptions).toEqual([currentLocale]);
            expect(testCharacteristic.getDescription(currentLocale)).toBe('This is a test description!');
            expect(testCharacteristic.seeReferences).toEqual(['https%3A%2F%2Ftestcharacteristic.com']);
            expect((testCharacteristic as DefaultCharacteristic).isAnonymousNode).toEqual(false);
        });

        afterAll((): void => {
            if (subscription) {
                subscription.unsubscribe();
            }
        });
    });

    describe('Collection class with string datatype', (): void => {
        beforeAll((done: DoneCallback): void => {
            loader = new AspectModelLoader();
            subscription = loader.loadSelfContainedModel(collectionCharacteristicClassString).subscribe((_aspect: DefaultAspect): void => {
                aspect = _aspect;
                testProperty = aspect.properties[0];
                testCharacteristic = testProperty.characteristic;
                done();
            }, error => console.error(error));
        });

        it('should have set datatype string', (): void => {
            expect((testProperty.effectiveDataType as DefaultScalar).shortUrn).toEqual('string');
        });

        it('should have collection type', (): void => {
            expect(testCharacteristic instanceof DefaultCollection).toBe(true);
        });

        it('should include Constraint name in the URN code', (): void => {
            expect(testCharacteristic.aspectModelUrn.indexOf('CharacteristicTest')).toBeGreaterThan(-1);
        });

        it('should populate collection Characteristic with available data from fields', (): void => {
            const currentLocale = 'en';
            expect(testCharacteristic.metaModelVersion).toBe('1.0.0');
            expect(testCharacteristic.name).toBe('CharacteristicTest');
            expect(testCharacteristic.localesDescriptions).toEqual([currentLocale]);
            expect(testCharacteristic.getDescription(currentLocale)).toBe('This is a test description!');
            expect(testCharacteristic.seeReferences).toEqual(['https%3A%2F%2Ftestcharacteristic.com']);
            expect((testCharacteristic as DefaultCollection).isAnonymousNode).toEqual(false);
            expect((testCharacteristic as DefaultCollection).isOrdered).toEqual(false);
        });

        it('should have element characteristic with correct fields', (): void => {
            const elementCharacteristic = (testCharacteristic as DefaultCollection).elementCharacteristic;
            expect(elementCharacteristic instanceof DefaultCharacteristic).toBe(true);
            expect(elementCharacteristic.aspectModelUrn.indexOf('Characteristic1')).toBeGreaterThan(-1);
            expect(elementCharacteristic.getDescription(currentLocale)).toBe('This is an element Characteristic!');
        });

        afterAll((): void => {
            if (subscription) {
                subscription.unsubscribe();
            }
        });
    });

    describe('Enumeration class with Entity datatype', (): void => {
        beforeAll((done: DoneCallback): void => {
            loader = new AspectModelLoader();
            subscription = loader.loadSelfContainedModel(enumerationCharacteristicClassEntity).subscribe((_aspect: DefaultAspect): void => {
                aspect = _aspect;
                testProperty = aspect.properties[0];
                done();
            });
        });

        it('should have enumeration type', (): void => {
            expect(testProperty.characteristic instanceof DefaultEnumeration).toBe(true);
        });

        it('should have correct model urn', (): void => {
            expect((testProperty.characteristic.dataType as DefaultEntity).properties[1].aspectModelUrn)
                .toEqual('urn:samm:org.eclipse.esmf.samm:1.0.0#resultStateAttributeDescription');
        });

        it('should have no description and loads successfully', (): void => {
            const testNoDescProperty = aspect.properties[1];
            expect((testNoDescProperty.characteristic.dataType as DefaultEntity).properties.length).toEqual(1);
        });

        it('should have two entries', (): void => {
            const enumeration = testProperty.characteristic as DefaultEnumeration;
            expect(enumeration.values.length).toBe(2);
            expect(enumeration.indexOf('ok')).toBe(0);
            expect(enumeration.indexOf('nok')).toBe(1);

            const valueInstance = enumeration.values[enumeration.indexOf('nok')] as DefaultEntityInstance;
            expect(valueInstance.name).toBe('NOKState');
            expect(valueInstance.value).toBe('nok');
            expect(valueInstance.valuePayloadKey).toBe('resultStateAttributeValue');
            expect(valueInstance.getDescription()).toBe('Result state not OK');
            expect(valueInstance.descriptionKey).toBe('resultStateAttributeDescription');
            expect(valueInstance.localesDescriptions.length).toBe(2);
            expect(valueInstance.getDescription('de')).toBe('Result Status nicht OK');
        });

        afterAll((): void => {
            if (subscription) {
                subscription.unsubscribe();
            }
        });
    });

    describe('Either class with list and simple characteristic', (): void => {
        beforeAll((done: DoneCallback): void => {
            loader = new AspectModelLoader();
            subscription = loader.loadSelfContainedModel(eitherCharacteristicClass).subscribe((_aspect: DefaultAspect): void => {
                aspect = _aspect;
                testProperty = aspect.properties[0];
                done();
            });
        });

        it('should property1 has left type float', (): void => {
            expect(testProperty.characteristic instanceof DefaultEither).toBeTruthy();
            expect((testProperty.characteristic as DefaultEither).effectiveLeftDataType.urn).toContain('string');
        });

        it('should property1 has right type float', (): void => {
            expect(testProperty.characteristic instanceof DefaultEither).toBeTruthy();
            expect((testProperty.characteristic as DefaultEither).right).toBeInstanceOf(DefaultList);
            expect((testProperty.characteristic as DefaultEither).effectiveRightDataType.urn).toContain('float');
        });

        it('should property2 has left type SpatialPosition', (): void => {
            expect((aspect.properties[1].characteristic as DefaultEither).effectiveLeftDataType.urn).toContain('SpatialPosition');
            expect((aspect.properties[1].characteristic as DefaultEither).effectiveLeftDataType.constructor.name).toBe('DefaultEntity');
        });

        it('should property2 has right type string', (): void => {
            expect(aspect.properties[1].characteristic instanceof DefaultEither).toBeTruthy();
            expect((aspect.properties[1].characteristic as DefaultEither).right).toBeInstanceOf(DefaultList);
            expect((aspect.properties[1].characteristic as DefaultEither).effectiveRightDataType.urn).toContain('string');
        });

        afterAll((): void => {
            if (subscription) {
                subscription.unsubscribe();
            }
        });
    });
});
