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

import {AspectModelLoader, DefaultAspect, DefaultProperty} from '../src';
import {movementAspectModelWithExternalReference} from './models/movement-model';
import {testAspectModel} from './models/test-model';
import {Subscription} from 'rxjs';
import DoneCallback = jest.DoneCallback;
import {destroyRdfModel} from '../src/shared/rdf-model';

describe('Import model tests', (): void => {
    let loader: AspectModelLoader;
    let aspect: DefaultAspect;
    let subscription: Subscription;

    beforeEach((done: DoneCallback): void => {
        loader = new AspectModelLoader();
        subscription = loader
            .load('urn:samm:org.eclipse.esmf.test:1.0.0#MovementWithImports', testAspectModel, movementAspectModelWithExternalReference)
            .subscribe((_aspect: DefaultAspect): void => {
                aspect = _aspect;
                done();
            });
    });

    test('should have shared testProperty', (): void => {
        expect((<DefaultProperty>aspect.properties[0]).name).toEqual('testProperty');
    });

    test('should have shared procedureAndStepIdentification', (): void => {
        expect((<DefaultProperty>aspect.properties[4]).name).toEqual('procedureAndStepIdentification');
    });

    test('should check for properties length', (): void => {
        expect(aspect.properties.length).toBe(5);
    });

    test('should have resolve to 1 path for iProcedureAndStepNo', (): void => {
        const path = loader.determineAccessPath(loader.findByName('iProcedureAndStepNo')[0]);
        expect(path.length).toBe(1);
        expect(path[0]).toEqual(['procedureAndStepIdentification', 'iProcedureAndStepNo']);
    });

    afterEach((): void => {
        destroyRdfModel();
    });
});
