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
    DefaultAspectModelVisitor,
    DefaultCharacteristic,
    DefaultOperation,
    DefaultProperty,
} from '../src';
import {traitAspectModel} from './models/trait-model';
import {Subscription} from 'rxjs';
import DoneCallback = jest.DoneCallback;

describe('Visitor tests', (): void => {
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

    test('should visit the aspect successfully', (): void => {
        const visitor = new CountElementVisitor<any, any>();
        visitor.visit(aspect, {});
        expect(visitor.countCharacteristics).toEqual(4);
        expect(visitor.countOperations).toEqual(0);
        expect(visitor.countProperties).toEqual(2);
    });

    afterEach((): void => {
        if (subscription) {
            subscription.unsubscribe();
        }
    });
});

class CountElementVisitor<T, U> extends DefaultAspectModelVisitor<T, U> {
    public countOperations = 0;
    public countProperties = 0;
    public countCharacteristics = 0;

    visitOperation(operation: DefaultOperation, context: U): T {
        this.countOperations++;
        return super.visitOperation(operation, context);
    }

    visitProperty(property: DefaultProperty, context: U): T {
        this.countProperties++;
        return super.visitProperty(property, context);
    }

    visitCharacteristic(characteristic: DefaultCharacteristic, context: U): T {
        this.countCharacteristics++;
        return super.visitCharacteristic(characteristic, context);
    }
}
