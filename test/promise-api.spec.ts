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

import {firstValueFrom} from 'rxjs';
import {
    AspectModelError,
    AspectModelLoader,
    AspectNotFoundError,
    MultipleAspectsFoundError,
    NamespaceLoader,
    RdfParseError,
    UnsupportedVersionError,
} from '../src';
import {coverageAspectModel} from './models/coverage-model';

const SAMM_2_2_0 = `@prefix samm: <urn:samm:org.eclipse.esmf.samm:meta-model:2.2.0#> .
@prefix : <urn:samm:org.eclipse.examples:1.0.0#> .
`;

const unsupportedModel = `@prefix samm: <urn:samm:org.eclipse.esmf.samm:meta-model:9.9.9#> .
@prefix : <urn:samm:org.eclipse.examples:1.0.0#> .
:Foo a samm:Aspect ; samm:properties () ; samm:operations () .
`;

describe('Promise API', (): void => {
    test('loadSelfContainedAspect resolves the same aspect as the Observable API', async (): Promise<void> => {
        const loader = new AspectModelLoader();
        const aspect = await loader.loadSelfContainedAspect(coverageAspectModel);
        const observed = await firstValueFrom(new AspectModelLoader().loadSelfContainedModel(coverageAspectModel));

        expect(aspect.name).toEqual('CoverageAspect');
        expect(Object.isFrozen(aspect)).toBe(true);
        expect(aspect.aspectModelUrn).toEqual(observed.aspectModelUrn);
        expect(aspect.properties.map(property => property.name)).toEqual(observed.properties.map(property => property.name));
        expect(loader.findByUrn(aspect.aspectModelUrn)).toBe(aspect);
    });

    test('loadAspect resolves an aspect by urn', async (): Promise<void> => {
        const aspect = await new AspectModelLoader().loadAspect('urn:samm:org.eclipse.examples:1.0.0#CoverageAspect', coverageAspectModel);
        expect(aspect.name).toEqual('CoverageAspect');
    });

    test('loadNamespaces resolves a frozen namespace map', async (): Promise<void> => {
        const namespaces = await new NamespaceLoader().loadNamespaces(coverageAspectModel);
        expect(Object.isFrozen(namespaces)).toBe(true);
        expect(namespaces.size).toBeGreaterThan(0);
        expect([...namespaces.values()].flat().some(element => element.name === 'CoverageAspect')).toBe(true);
    });

    test('Observable API replays the result to late subscribers', async (): Promise<void> => {
        const aspect$ = new AspectModelLoader().loadSelfContainedModel(coverageAspectModel);
        const first = await firstValueFrom(aspect$);
        const second = await firstValueFrom(aspect$);
        expect(second).toBe(first);
    });
});

describe('Typed errors', (): void => {
    test('rejects with RdfParseError for invalid turtle', async (): Promise<void> => {
        const error = await new AspectModelLoader().loadSelfContainedAspect('this is not turtle').catch((e: unknown) => e);
        expect(error).toBeInstanceOf(RdfParseError);
        expect(error).toBeInstanceOf(AspectModelError);
        expect((<RdfParseError>error).name).toEqual('RdfParseError');
        expect((<RdfParseError>error).cause).toBeInstanceOf(Error);
    });

    test('rejects with UnsupportedVersionError', async (): Promise<void> => {
        await expect(new AspectModelLoader().loadSelfContainedAspect(unsupportedModel)).rejects.toThrow(UnsupportedVersionError);
        await expect(new NamespaceLoader().loadNamespaces(unsupportedModel)).rejects.toThrow('SAMM 9.9.9 is not supported');
    });

    test('rejects with AspectNotFoundError when no aspect is defined', async (): Promise<void> => {
        await expect(
            new AspectModelLoader().loadSelfContainedAspect(`${SAMM_2_2_0}:Foo a samm:Entity ; samm:properties () .\n`)
        ).rejects.toBeInstanceOf(AspectNotFoundError);
    });

    test('rejects with MultipleAspectsFoundError for ambiguous models', async (): Promise<void> => {
        const twoAspects = `${SAMM_2_2_0}:A a samm:Aspect ; samm:properties () ; samm:operations () .
:B a samm:Aspect ; samm:properties () ; samm:operations () .
`;
        await expect(new AspectModelLoader().loadSelfContainedAspect(twoAspects)).rejects.toBeInstanceOf(MultipleAspectsFoundError);
    });

    test('Observable API forwards errors', async (): Promise<void> => {
        await expect(firstValueFrom(new AspectModelLoader().loadSelfContainedModel('not turtle'))).rejects.toBeInstanceOf(RdfParseError);
    });

    test('UnsupportedVersionError exposes version information', (): void => {
        const error = new UnsupportedVersionError('1.0.0', ['2.0.0', '2.1.0']);
        expect(error.message).toEqual('SAMM 1.0.0 is not supported. Supported versions are: 2.0.0,2.1.0');
        expect(error.name).toEqual('UnsupportedVersionError');
    });
});
