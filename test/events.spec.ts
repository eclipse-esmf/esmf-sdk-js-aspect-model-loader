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

import {AspectModelLoader, DefaultAspect} from '../src';
import {eventAspectModel} from './models/events-model';
import {Subscription} from 'rxjs';
import DoneCallback = jest.DoneCallback;
import {destroyRdfModel} from '../src/shared/rdf-model';

describe('Events tests', (): void => {
    let loader: AspectModelLoader;
    let aspect: DefaultAspect;
    let subscription: Subscription;

    beforeEach((done: DoneCallback): void => {
        loader = new AspectModelLoader();
        subscription = loader.loadSelfContainedModel(eventAspectModel).subscribe(_aspect => {
            aspect = <DefaultAspect>_aspect;
            done();
        });
    });

    test('should read two events', (): void => {
        expect(aspect.events.length).toEqual(2);
        expect(aspect.events[0].name).toEqual('StartEngineEvent');
        expect(aspect.events[1].name).toEqual('StopEngineEvent');
    });

    test('should one parameter for each of the events', (): void => {
        const firstEvent = 0;
        expect(aspect.events[firstEvent].getProperties().length).toEqual(1);
        expect(aspect.events[firstEvent].properties[0].name).toEqual('engineState');
        expect(aspect.events[firstEvent].properties[0].getPreferredName('en')).toEqual('Current state of the engine');
        expect(aspect.events[firstEvent].properties[0].characteristic.dataType?.getShortType()).toContain('string');

        const secondEvent = 1;
        expect(aspect.events[secondEvent].properties.length).toEqual(1);
        expect(aspect.events[secondEvent].properties[0].name).toEqual('engineState');
        expect(aspect.events[secondEvent].properties[0].getPreferredName('en')).toEqual('Current state of the engine');
        expect(aspect.events[secondEvent].properties[0].characteristic.dataType?.getShortType()).toContain('string');
    });

    afterEach((): void => {
        destroyRdfModel();
    });
});
