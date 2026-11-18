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

import {
    AspectModelLoader,
    DefaultAspect,
    DefaultDuration,
    DefaultEither,
    DefaultEntity,
    DefaultMeasurement,
    DefaultPropertyInstanceDefinition,
    DefaultQuantifiable,
    DefaultQuantityKind,
    DefaultSingleEntity,
    DefaultSortedSet,
    DefaultStructuredValue,
    DefaultTimeSeries,
    DefaultUnit,
    Property,
} from '../src';
import {coverageAspectModel} from './models/coverage-model';
import {Subscription} from 'rxjs';

describe('Coverage model tests', (): void => {
    let aspect: DefaultAspect;
    let subscription: Subscription;

    const characteristicOf = <T>(propertyName: string): T =>
        <T>(<unknown>aspect.properties.find(property => property.name === propertyName)!.characteristic);

    beforeEach(
        (): Promise<void> =>
            new Promise<void>(done => {
                subscription = new AspectModelLoader().loadSelfContainedModel(coverageAspectModel).subscribe(_aspect => {
                    aspect = <DefaultAspect>_aspect;
                    done();
                });
            })
    );

    afterEach((): void => subscription?.unsubscribe());

    test('should load all properties in order', (): void => {
        expect(aspect.name).toEqual('CoverageAspect');
        expect(aspect.getPreferredName('en')).toEqual('Coverage Aspect');
        expect(aspect.properties.map(property => property.name)).toEqual([
            'sortedNumbers',
            'temperatureSeries',
            'serialNumber',
            'cycleTime',
            'weight',
            'distance',
            'result',
            'position',
            'document',
        ]);
    });

    test('should load a SortedSet with values', (): void => {
        const sortedSet = characteristicOf<DefaultSortedSet>('sortedNumbers');
        expect(sortedSet).toBeInstanceOf(DefaultSortedSet);
        expect(sortedSet.dataType?.urn).toEqual('http://www.w3.org/2001/XMLSchema#int');
        expect(sortedSet.values).toEqual([1, 2, 3]);
    });

    test('should load a TimeSeries extending the predefined TimeSeriesEntity', (): void => {
        const timeSeries = characteristicOf<DefaultTimeSeries>('temperatureSeries');
        expect(timeSeries).toBeInstanceOf(DefaultTimeSeries);

        const entity = <DefaultEntity>timeSeries.dataType;
        expect(entity.urn).toEqual('urn:samm:org.eclipse.esmf.test:1.0.0#TemperatureEntry');
        expect(entity.extends?.name).toEqual('TimeSeriesEntity');
        expect(entity.properties.map(property => property.name)).toEqual([undefined, 'timestamp', 'value']);
    });

    test('should load a StructuredValue with deconstruction rule and elements', (): void => {
        const structuredValue = characteristicOf<DefaultStructuredValue>('serialNumber');
        expect(structuredValue).toBeInstanceOf(DefaultStructuredValue);
        expect(structuredValue.dataType?.urn).toEqual('http://www.w3.org/2001/XMLSchema#string');
        expect(structuredValue.deconstructionRule).toEqual('(\\w+)-(\\d+)');

        const elements = structuredValue.elements;
        expect(elements).toHaveLength(3);
        expect(elements[0]).toBeInstanceOf(DefaultPropertyInstanceDefinition);
        expect((<Property>elements[0]).name).toEqual('prefix');
        expect(elements[1]).toEqual('-');
        expect((<Property>elements[2]).name).toEqual('counter');
    });

    test('should load a Duration with a predefined unit', (): void => {
        const duration = characteristicOf<DefaultDuration>('cycleTime');
        expect(duration).toBeInstanceOf(DefaultDuration);
        expect(duration.dataType?.urn).toEqual('http://www.w3.org/2001/XMLSchema#int');

        const unit = duration.unit!;
        expect(unit).toBeInstanceOf(DefaultUnit);
        expect(unit.name).toEqual('secondUnitOfTime');
        expect(unit.symbol).toEqual('s');
        expect(unit.code).toEqual('SEC');
        expect(unit.aspectModelUrn).toEqual('urn:samm:org.eclipse.esmf.samm:unit:2.2.0#secondUnitOfTime');
        expect(unit.quantityKinds).toContain('time');
    });

    test('should load a Quantifiable with a custom unit', (): void => {
        const quantifiable = characteristicOf<DefaultQuantifiable>('weight');
        expect(quantifiable).toBeInstanceOf(DefaultQuantifiable);
        expect(quantifiable.dataType?.urn).toEqual('http://www.w3.org/2001/XMLSchema#float');

        const unit = quantifiable.unit!;
        expect(unit.name).toEqual('Pound');
        expect(unit.symbol).toEqual('lb');
        expect(unit.referenceUnit).toEqual('urn:samm:org.eclipse.esmf.samm:unit:2.2.0#kilogram');
        expect(unit.conversionFactor).toEqual('0.45359237');
        expect(unit.getPreferredName('en')).toEqual('pound');
        expect(unit.quantityKinds).toHaveLength(1);

        const quantityKind = <DefaultQuantityKind>(<unknown>unit.quantityKinds![0]);
        expect(quantityKind).toBeInstanceOf(DefaultQuantityKind);
        expect(quantityKind.name).toEqual('mass');
        expect(quantityKind.label).toEqual('mass');
    });

    test('should load a Measurement with a predefined unit', (): void => {
        const measurement = characteristicOf<DefaultMeasurement>('distance');
        expect(measurement).toBeInstanceOf(DefaultMeasurement);
        expect(measurement.dataType?.urn).toEqual('http://www.w3.org/2001/XMLSchema#double');

        const unit = measurement.unit!;
        expect(unit.name).toEqual('metre');
        expect(unit.symbol).toEqual('m');
        expect(unit.code).toEqual('MTR');
        expect(unit.aspectModelUrn).toEqual('urn:samm:org.eclipse.esmf.samm:unit:2.2.0#metre');
        expect(unit.getPreferredName('en')).toEqual('metre');
        expect(unit.quantityKinds).toEqual(expect.arrayContaining(['length', 'distance']));
    });

    test('should load an Either with left and right characteristic', (): void => {
        const either = characteristicOf<DefaultEither>('result');
        expect(either).toBeInstanceOf(DefaultEither);
        expect(either.left.name).toEqual('ErrorCode');
        expect(either.right.name).toEqual('Boolean');
        expect(either.dataType).toBeNull();
    });

    test('should load SingleEntities based on predefined entities', (): void => {
        const position = characteristicOf<DefaultSingleEntity>('position');
        expect(position).toBeInstanceOf(DefaultSingleEntity);
        expect(position.dataType?.urn).toEqual('urn:samm:org.eclipse.esmf.test:1.0.0#Position3d');

        const document = characteristicOf<DefaultSingleEntity>('document');
        expect(document).toBeInstanceOf(DefaultSingleEntity);
        expect(document.dataType?.urn).toEqual('urn:samm:org.eclipse.esmf.test:1.0.0#DocumentEntity');
    });

    test('should load an operation with input and output', (): void => {
        expect(aspect.operations).toHaveLength(1);
        const operation = aspect.operations[0];
        expect(operation.name).toEqual('toggle');
        expect(operation.getPreferredName('en')).toEqual('Toggle');
        expect(operation.input.map(property => property.name)).toEqual(['cycleTime']);
        expect(operation.output?.name).toEqual('result');
    });
});
