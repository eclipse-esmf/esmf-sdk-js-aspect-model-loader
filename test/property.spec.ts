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

import {
    AspectModelLoader,
    DefaultAspect,
    DefaultCharacteristic,
    DefaultEntity,
    DefaultEnumeration,
    DefaultProperty,
    DefaultTrait,
    Enumeration,
    Property,
} from '../src';
import {
    movementAspectModel,
    movementAspectModelWithCollectionsAndReusedEntity,
    movementAspectModelWithOperations,
} from './models/movement-model';
import {Subscription} from 'rxjs';
import {property} from './models/property';
import DoneCallback = jest.DoneCallback;
import {destroyRdfModel} from '../src/shared/rdf-model';

describe('Property tests', (): void => {
    let loader: AspectModelLoader;
    let aspect: DefaultAspect;
    let subscription: Subscription;

    describe('Basic property tests', (): void => {
        beforeAll((done: DoneCallback): void => {
            loader = new AspectModelLoader();
            subscription = loader.loadSelfContainedModel(property).subscribe((_aspect: DefaultAspect): void => {
                aspect = _aspect;
                done();
            });
        });

        it('should have marked as none collection aspect', (): void => {
            expect(aspect.isCollectionAspect).toBe(false);
        });

        test('should have overrides applied', (): void => {
            expect((<DefaultProperty>aspect.properties[0]).isAnonymous()).toBe(true);
        });

        test('should have an enumeration "EnumerationCharacteristic" with entries', (): void => {
            const enumeration = loader.findByUrn('urn:samm:org.eclipse.esmf.test:1.0.0#EnumerationCharacteristic') as Enumeration;
            expect(enumeration.values.length).toBeGreaterThanOrEqual(0);
        });

        test('should have an enumeration "WarningLevel" with 3 values', () => {
            const loader = new AspectModelLoader();
            loader.loadSelfContainedModel(movementAspectModel).subscribe(() => {
                expect((loader.findByUrn('urn:samm:org.eclipse.esmf.test:1.0.0#WarningLevel') as Enumeration).values).toEqual([
                    'green',
                    'yellow',
                    'red',
                ]);
            });
        });

        test('should resolve to 2 paths found for y', () => {
            const loader = new AspectModelLoader();
            loader.loadSelfContainedModel(movementAspectModelWithCollectionsAndReusedEntity).subscribe(a => {
                const paths = loader.determineAccessPath(loader.findByName('y')[0]);
                expect(paths.length).toEqual(2);
                expect(paths[0]).toEqual(['items', 'position', 'y']);
                expect(paths[1]).toEqual(['positionNew', 'y']);
            });
        });

        test('should resolve to 1 path found for moving', () => {
            const loader = new AspectModelLoader();
            loader.loadSelfContainedModel(movementAspectModelWithCollectionsAndReusedEntity).subscribe(() => {
                const paths = loader.determineAccessPath(loader.findByName('moving')[0]);
                expect(paths.length).toEqual(1);
                expect(paths[0]).toEqual(['items', 'moving']);
            });
        });

        test('should resolve to 1 path for Entity1', (): void => {
            const paths = loader.determineAccessPath(loader.findByName('Entity1')[0]);
            expect(paths.length).toEqual(1);
            expect(paths[0]).toEqual(['optionalProperty']);
        });

        test('should resolve to 1 path for Constraint1', (): void => {
            const paths = loader.determineAccessPath(loader.findByName('Constraint1')[0]);
            expect(paths.length).toEqual(1);
            expect(paths[0]).toEqual(['optionalProperty']);
        });

        test('should find property optionalProperty by name', (): void => {
            expect(aspect.getProperty('optionalProperty').name).toBeDefined();
        });

        test('should not find property prodAndStepIdent by name', (): void => {
            expect(aspect.getProperty('prodAndStepIdent')).toBe(undefined);
        });

        test('should find not optional property by name', (): void => {
            expect(loader.findByName('notOptionalProperty').length).toBe(1);
        });

        test('should not find optional property by name', (): void => {
            expect(loader.findByName('optionalProperty').length).toBe(0);
        });

        test('should have a name', (): void => {
            expect(aspect.properties[0].name).toBeDefined();
        });

        test('should have 2 constraints defined', (): void => {
            expect((aspect.properties[0].characteristic as DefaultTrait).constraints).toHaveLength(2);
        });

        test('should get the preferredName', (): void => {
            expect(loader.findByName('notOptionalProperty')[0].getPreferredName('en')).toBeDefined();
        });

        test('should check for not optional properties', (): void => {
            expect((<DefaultProperty>loader.findByName('notOptionalProperty')[0]).isOptional()).toBeFalsy();
        });

        test('should get number values', (): void => {
            expect(Number.isInteger((loader.findByName('EnumerationNumbersCharacteristic')[0] as any).values[0].value)).toBeTruthy();
            expect(Number.isInteger((loader.findByName('EnumerationNumbersCharacteristic')[0] as any).values[1].value)).toBeTruthy();
            expect(Number.isInteger((loader.findByName('EnumerationNumbersCharacteristic')[0] as any).values[2].value)).toBeTruthy();
        });

        test('should get string values', (): void => {
            expect(typeof (loader.findByName('EnumerationCharacteristic')[0] as any).values[0].value).toBe('string');
            expect(typeof (loader.findByName('EnumerationCharacteristic')[0] as any).values[1].value).toBe('string');
            expect(typeof (loader.findByName('EnumerationCharacteristic')[0] as any).values[2].value).toBe('string');
        });

        test('should check for optional properties', (): void => {
            expect((aspect.properties[0] as Property).optional).toBeTruthy();
        });

        test('should check for not optional properties', (): void => {
            expect((<DefaultProperty>loader.findByName('notOptionalProperty')[0]).isOptional()).toBeFalsy();
        });

        test('should filter and find 2 properties', (): void => {
            expect(loader.filterElements(element => element instanceof DefaultProperty).length).toBe(2);
        });

        test('should filter and find 5 characteristics', (): void => {
            expect(loader.filterElements(element => element instanceof DefaultCharacteristic).length).toBe(5);
        });

        test('should filter and find 1 entity', (): void => {
            expect(loader.filterElements(element => element instanceof DefaultEntity).length).toBe(1);
        });

        afterAll((): void => {
            destroyRdfModel();
            subscription?.unsubscribe();
        });
    });

    describe('Collection model test', (): void => {
        beforeAll((done: DoneCallback): void => {
            loader = new AspectModelLoader();
            subscription = loader
                .loadSelfContainedModel(movementAspectModelWithCollectionsAndReusedEntity)
                .subscribe((_aspect: DefaultAspect): void => {
                    aspect = _aspect;
                    done();
                });
        });

        it('should have marked as collection aspect', (): void => {
            expect(aspect.isCollectionAspect).toBe(true);
        });

        it('should have one properties items entries', (): void => {
            const property = aspect.getProperty('items');
            expect(property.characteristic.dataType?.isComplexType()).toBe(true);
            expect((property.characteristic.dataType as DefaultEntity).name).toBe('Movement');
        });

        it('should have one property position', (): void => {
            const property = aspect.getProperty('items');
            expect((property.characteristic.dataType as DefaultEntity).getProperty('position')).toBeDefined();
        });

        afterAll((): void => {
            destroyRdfModel();
            subscription?.unsubscribe();
        });
    });

    describe('Operations test', (): void => {
        beforeAll((done: DoneCallback): void => {
            loader = new AspectModelLoader();
            subscription = loader.loadSelfContainedModel(movementAspectModelWithOperations).subscribe((_aspect: DefaultAspect): void => {
                aspect = _aspect;
                done();
            });
        });

        it('should have one operations defined', (): void => {
            expect(aspect.operations.length).toEqual(1);
        });

        it('should have one operations with an input defined', (): void => {
            expect(aspect.operations[0].input.length).toEqual(1);
            expect(aspect.operations[0].input[0].characteristic.dataType?.urn).toEqual('http://www.w3.org/2001/XMLSchema#string');
            expect(aspect.operations[0].input[0].characteristic.dataType?.getShortType()).toEqual('string');
            expect(aspect.operations[0].input[0].characteristic.name).toEqual('ToggleValues');
            expect((aspect.operations[0].input[0].characteristic as DefaultEnumeration).values.map(v => v.value)).toEqual(['on', 'off']);
        });

        it('should have one operations with a output defined', (): void => {
            expect(aspect.operations[0].output).toBeDefined();
            expect(aspect.operations[0].output?.characteristic.dataType?.urn).toEqual('http://www.w3.org/2001/XMLSchema#string');
            expect(aspect.operations[0].output?.characteristic.dataType?.getShortType()).toEqual('string');
            expect(aspect.operations[0].output?.characteristic.name).toEqual('ToggleState');
            expect((aspect.operations[0].output?.characteristic as DefaultEnumeration).values.map(v => v.value)).toEqual([
                'ok',
                'denied',
                'unknown',
            ]);
        });

        afterAll((): void => {
            destroyRdfModel();
            subscription?.unsubscribe();
        });
    });
});
