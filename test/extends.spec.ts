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

import {AspectModelLoader, DefaultAspect, DefaultEntity, Entity} from '../src';
import {extendsAspectModel} from './models/extends-model';
import {Subscription} from 'rxjs';
import DoneCallback = jest.DoneCallback;

describe('Events tests', (): void => {
    let loader: AspectModelLoader;
    let aspect: DefaultAspect;
    let subscription: Subscription;
    let steeringWheelEntity: DefaultEntity;
    let seatEntity: DefaultEntity;

    beforeEach((done: DoneCallback): void => {
        loader = new AspectModelLoader();
        subscription = loader.loadSelfContainedModel(extendsAspectModel).subscribe(_aspect => {
            aspect = <DefaultAspect>_aspect;
            steeringWheelEntity = aspect.properties[0].effectiveDataType as DefaultEntity;
            seatEntity = aspect.properties[1].effectiveDataType as DefaultEntity;
            done();
        });
    });

    test('should have two extended properties typeNumber and manufacturer', (): void => {
        expect(steeringWheelEntity.properties.length).toEqual(4);
        expect(steeringWheelEntity.properties[0].name).toEqual('isMultifunction')
        expect(steeringWheelEntity.properties[3].name).toEqual('manufacturer')
        expect(seatEntity.properties.length).toEqual(4);
        expect(seatEntity.properties[0].name).toEqual('material');
        expect(seatEntity.properties[2].name).toEqual('manufacturer')
    });

    test('Steeringwheel should have the description from the extended AbstractEntity and the own preferredName', (): void => {
        expect(steeringWheelEntity.getDescription('en')).toEqual('Represents a general component')
        expect(steeringWheelEntity.getPreferredName('en')).toEqual('Vehicle Steering Wheel')
    });

    test('Steeringwheel should have 1 see reference', (): void => {
        expect(steeringWheelEntity.seeReferences.length).toEqual(1)
    });

    test('should throw error that entity can be extended', (): void => {
        const entityToExtend: Entity = new DefaultEntity('2.0.0', 'test', 'test');
        expect(() => steeringWheelEntity.extends = entityToExtend).toThrow(Error);
    });

    test('Seat should have the description from the extended AbstractEntity and the own preferredName', (): void => {
        expect(seatEntity.getDescription('en')).toEqual('Represents a seat component')
        expect(seatEntity.getPreferredName('en')).toEqual('Vehicle Component')
    });

    test('Seat should have 2 see reference', (): void => {
        expect(seatEntity.seeReferences.length).toEqual(2)
    });

    test('Steeringwheel should have 1 option defined', (): void => {
        expect(steeringWheelEntity.getOwnProperties().length).toEqual(2)
    });

    test('Steeringwheel should have 1 abstract property defined with a characteristic text defined', (): void => {
        expect(steeringWheelEntity.getOwnProperties().find(prop => prop.extends && prop.extends.isAbstract)).toBeDefined();
        expect(steeringWheelEntity.getOwnProperties().find(prop => prop.extends).effectiveDataType.shortUrn).toEqual('string')
    });

    afterEach((): void => {
        if (subscription) {
            subscription.unsubscribe();
        }
    });
});
