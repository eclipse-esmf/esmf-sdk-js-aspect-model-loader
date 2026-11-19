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

import {AspectModelLoader, DefaultAspect, DefaultEntity, DefaultEnumeration, DefaultState, DefaultValue} from '../src';
import {KnownVersion, SammVersion} from '../src/shared/known-version';
import {samm220AspectModel} from './models/samm-2-2-0-model';
import {Subscription} from 'rxjs';

describe('SAMM 2.2.0 tests', (): void => {
    let aspect: DefaultAspect;
    let subscription: Subscription;

    beforeEach(
        (): Promise<void> =>
            new Promise<void>(done => {
                subscription = new AspectModelLoader().loadSelfContainedModel(samm220AspectModel).subscribe(_aspect => {
                    aspect = <DefaultAspect>_aspect;
                    done();
                });
            })
    );

    afterEach((): void => subscription?.unsubscribe());

    test('should support SAMM 2.2.0', (): void => {
        expect(KnownVersion.isVersionSupported(SammVersion.SAMM_2_2_0)).toBe(true);
        expect(aspect.metaModelVersion).toEqual('2.2.0');
    });

    test('should resolve samm:Value entries of an enumeration', (): void => {
        const enumeration = <DefaultEnumeration>aspect.properties.find(p => p.name === 'status')!.characteristic;
        expect(enumeration.values.length).toEqual(3);
        expect(enumeration.values.every(v => v instanceof DefaultValue)).toBe(true);

        const running = <DefaultValue>enumeration.values[0];
        expect(running.value).toEqual('Running');
        expect(running.name).toEqual('Running');
        expect(running.getPreferredName('en')).toEqual('Running');
        expect(running.getDescription('en')).toEqual('The machine is running.');
        expect(running.getSeeReferences()).toContain('https://example.org/running');

        const unknown = <DefaultValue>enumeration.values[2];
        expect(unknown.value).toEqual('Unknown');
        expect(unknown.isAnonymousNode).toBe(true);

        expect(enumeration.indexOf('Stopped')).toEqual(1);
    });

    test('should resolve samm:Value as exampleValue', (): void => {
        const exampleValue = aspect.properties.find(p => p.name === 'status')!.exampleValue as DefaultValue;
        expect(exampleValue).toBeInstanceOf(DefaultValue);
        expect(exampleValue.value).toEqual('Running');
    });

    test('should resolve samm:Value as default value of a state', (): void => {
        const state = <DefaultState>aspect.properties.find(p => p.name === 'machineState')!.characteristic;
        expect(state.defaultValue).toBeInstanceOf(DefaultValue);
        expect((<DefaultValue>state.defaultValue).value).toEqual('Stopped');
    });

    test('should resolve samm-c:Reference', (): void => {
        const characteristic = aspect.properties.find(p => p.name === 'partReference')!.characteristic;
        expect(characteristic.name).toEqual('Reference');
        expect(characteristic.dataType!.shortUrn).toEqual('anyURI');
    });

    test('should resolve entity extending samm-e:Quantity', (): void => {
        const entity = <DefaultEntity>aspect.properties.find(p => p.name === 'measurement')!.characteristic.dataType;
        expect(entity.extends).toBeDefined();
        expect(entity.extends!.name).toEqual('Quantity');
        expect(entity.extends!.isAbstract).toBe(true);
        expect(entity.extends!.properties.map(p => p.name)).toEqual(['value', 'unit']);
    });
});
