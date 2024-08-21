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

import {AspectModelLoader} from '../src';
import {CountElementVisitor} from './count-elements';
import {traitAspectModel} from './models/trait-model';
import {Subscription} from 'rxjs';

describe('Aspect model visitor tests', (): void => {
    let loader: AspectModelLoader;
    let subscription: Subscription;

    test('should visit the aspect successfully', (done): void => {
        loader = new AspectModelLoader();
        subscription = loader.loadSelfContainedModel(traitAspectModel).subscribe(aspect => {
            const visitor = new CountElementVisitor();
            visitor.visit(aspect);
            expect(visitor.counts.characteristics.count).toBe(4);
            expect(visitor.counts.operations.count).toBe(0);
            expect(visitor.counts.properties.count).toBe(2);
            done();
        });
    });

    afterEach((): void => {
        if (subscription) {
            subscription.unsubscribe();
        }
    });
});
