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

import {DefaultAspect, DefaultCharacteristic, DefaultProperty, destroyElementCache, NamespaceLoader} from '../src';
import {Subscription} from 'rxjs';
import {characteristicDifferentNamespace} from './models/characteristics';
import {movementAspectModelWithExternalReference} from './models/movement-model';
import {DefaultNamespaceVisitor} from '../src/visitor/default-namespace-visitor';
import DoneCallback = jest.DoneCallback;
import {NamedElement} from '../src/aspect-meta-model/named-element';
import {destroyRdfModel} from '../src/shared/rdf-model';

describe('Namespace visitor tests', (): void => {
    let loader: NamespaceLoader;
    let subscription: Subscription;
    let namespaces: Map<string, Array<NamedElement>>;

    beforeEach((done: DoneCallback): void => {
        loader = new NamespaceLoader();
        subscription = loader.load(characteristicDifferentNamespace, movementAspectModelWithExternalReference).subscribe(_namespaces => {
            namespaces = _namespaces;
            done();
        });
    });

    test('should visit the namespaces successfully', (): void => {
        const visitor = new CountElementVisitor();
        visitor.visit(namespaces);
        expect(visitor.countCharacteristics).toEqual(4);
        expect(visitor.countAspects).toEqual(2);
        expect(visitor.countProperties).toEqual(9);
    });

    afterEach((): void => {
        destroyRdfModel();
    });
});

class CountElementVisitor extends DefaultNamespaceVisitor {
    public countAspects = 0;
    public countProperties = 0;
    public countCharacteristics = 0;

    visitAspect(aspect: DefaultAspect, context: Map<string, Array<NamedElement>>): NamedElement {
        this.countAspects++;
        return super.visitAspect(aspect, context);
    }

    visitProperty(property: DefaultProperty, context: Map<string, Array<NamedElement>>): NamedElement {
        this.countProperties++;
        return super.visitProperty(property, context);
    }

    visitCharacteristic(characteristic: DefaultCharacteristic, context: Map<string, Array<NamedElement>>): NamedElement {
        this.countCharacteristics++;
        return super.visitCharacteristic(characteristic, context);
    }
}
