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

import {AspectModelLoader, DefaultAspect, DefaultProperty, getElementsCache} from '../src';
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

    test('should get cached element by key', (): void => {
        const element = getElementsCache().get<DefaultProperty>(aspect.properties[0].aspectModelUrn);
        expect(element.aspectModelUrn).toEqual(aspect.properties[0].aspectModelUrn);
    });

    test('should resolve cached element', (): void => {
        const element = loader['cacheService'].resolveInstance(aspect.properties[0]);
        expect(element.aspectModelUrn).toEqual(aspect.properties[0].aspectModelUrn);
    });

    test('should overwrite cached element', (): void => {
        const cacheService = loader['cacheService'];
        const elementOld = cacheService.resolveInstance(aspect.properties[0]);

        // update not forced
        cacheService.addElement(aspect.properties[0].name, aspect.properties[0]);
        const elementNew = loader.findByUrn(aspect.properties[0].aspectModelUrn);
        expect(elementOld.aspectModelUrn).toEqual(elementNew.aspectModelUrn);

        // update forced
        const elementCopy = Object.assign({}, elementOld);
        elementCopy.name = 'update';
        cacheService.addElement(aspect.properties[0].name, elementCopy, true);

        expect(elementOld.aspectModelUrn).not.toEqual(aspect.properties[0].name);
        expect(elementCopy.name).toEqual('update');
    });

    afterEach((): void => {
        destroyRdfModel();
    });
});
