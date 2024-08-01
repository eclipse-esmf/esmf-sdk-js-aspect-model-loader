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

import {AspectModelLoader, DefaultAspect, DefaultEntity, Entity} from '../src';
import {extendsAspectModel} from './models/extends-model';
import {Subscription} from 'rxjs';
import DoneCallback = jest.DoneCallback;
import {destroyRdfModel} from '../src/shared/rdf-model';

describe('Extends tests', (): void => {
    let loader: AspectModelLoader;
    let aspect: DefaultAspect;
    let subscription: Subscription;
    let steeringWheelEntity: DefaultEntity;
    let seatEntity: DefaultEntity;

    beforeEach((done: DoneCallback): void => {
        loader = new AspectModelLoader();
        subscription = loader.loadSelfContainedModel(extendsAspectModel).subscribe(_aspect => {
            aspect = <DefaultAspect>_aspect;
            steeringWheelEntity = aspect.properties[0].characteristic.dataType as DefaultEntity;
            seatEntity = aspect.properties[1].characteristic.dataType as DefaultEntity;
            done();
        });
    });

    test('should have two extended properties typeNumber and manufacturer', (): void => {
        const allProperties = steeringWheelEntity.getAllProperties().filter(p => !p.isAbstract);
        expect(allProperties.length).toEqual(4);
        expect(allProperties[0].name).toEqual('isMultifunction');
        expect(allProperties[1].name).toContain('abstractTestProperty_property');
        expect(allProperties[2].name).toEqual('typeNumber');
        expect(allProperties[3].name).toEqual('manufacturer');
        expect(seatEntity.getAllProperties().length).toEqual(4);
        expect(seatEntity.getAllProperties()[0].name).toEqual('material');
        expect(seatEntity.getAllProperties()[2].name).toEqual('manufacturer');
    });

    test('Steeringwheel should NOT have the description from the extended AbstractEntity and the own preferredName', (): void => {
        expect(steeringWheelEntity.getDescription('en')).not.toEqual('Represents a general component');
        expect(steeringWheelEntity.getPreferredName('en')).toEqual('Vehicle Steering Wheel');
    });

    test('Steeringwheel should have 1 see reference', (): void => {
        expect(steeringWheelEntity.see.length).not.toEqual(1);
    });

    test('Seat should have the description from the extended AbstractEntity and the own preferredName', (): void => {
        expect(seatEntity.getDescription('en')).toEqual('Represents a seat component');
        expect(seatEntity.getPreferredName('en')).not.toEqual('Vehicle Component');
    });

    test('Seat should have 1 see reference', (): void => {
        expect(seatEntity.see.length).toEqual(1);
    });

    test('Steeringwheel should have 1 option defined', (): void => {
        expect(steeringWheelEntity.getOwnProperties().length).toEqual(2);
    });

    test('Steeringwheel should have 1 abstract property defined with a characteristic text defined', (): void => {
        expect(steeringWheelEntity.getOwnProperties().find(prop => prop._extends && prop._extends.isAbstract)).toBeDefined();
        expect(
            steeringWheelEntity
                .getOwnProperties()
                .find(prop => prop._extends)
                ?.characteristic?.dataType?.getShortType()
        ).toEqual('string');
    });

    afterEach((): void => {
        destroyRdfModel();
    });
});
