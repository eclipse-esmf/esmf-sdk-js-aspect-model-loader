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

import {AspectModelLoader, DefaultAspect, DefaultTrait, Trait} from '../src';
import {traitAspectModel} from './models/trait-model';
import {Subscription} from 'rxjs';
import DoneCallback = jest.DoneCallback;
import {destroyRdfModel} from '../src/shared/rdf-model';

describe('Traits tests', (): void => {
    let loader: AspectModelLoader;
    let aspect: DefaultAspect;
    let subscription: Subscription;

    beforeEach((done: DoneCallback): void => {
        loader = new AspectModelLoader();
        subscription = loader.loadSelfContainedModel(traitAspectModel).subscribe(_aspect => {
            aspect = <DefaultAspect>_aspect;
            done();
        });
    });

    test('should read a trait property', (): void => {
        const trait = aspect.properties[0].characteristic as unknown as Trait;
        expect(trait.name).toEqual('Property1Trait');
    });

    test('should read a constraint property', (): void => {
        const trait = aspect.properties[0].characteristic as unknown as Trait;
        expect(trait.constraints[0].name).toEqual('Constraint1');
    });

    test('should check for the length of the constraints array', (): void => {
        const trait = aspect.properties[0].characteristic as unknown as Trait;
        expect(trait.constraints.length).toBe(2);
    });

    test('should check the effective data type', (): void => {
        expect((aspect.properties[1].characteristic as DefaultTrait)?.baseCharacteristic?.dataType?.getShortType()).toContain('string');
    });

    afterEach((): void => {
        destroyRdfModel();
    });
});
