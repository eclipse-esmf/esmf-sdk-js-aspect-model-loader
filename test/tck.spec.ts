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

import {readFileSync, readdirSync} from 'node:fs';
import {fileURLToPath} from 'node:url';
import {AspectModelLoader, DefaultCollection, DefaultEntity, DefaultSingleEntity} from '../src';

/**
 * Runs the loader against the valid test aspect models of the ESMF SDK (see test/tck/README.md).
 * Models that are not self-contained are loaded together with the shared model files they reference.
 */
const modelsDir = fileURLToPath(new URL('./tck/models/', import.meta.url));
const files = readdirSync(modelsDir).filter(file => file.endsWith('.ttl'));
const contents = new Map(files.map(file => [file, readFileSync(`${modelsDir}${file}`, 'utf8')]));

const definedElements = (ttl: string) => new Set([...ttl.matchAll(/^:(\w+)\s+a\s/gm)].map(match => match[1]));
const referencedElements = (ttl: string) => new Set([...ttl.matchAll(/(?<![\w#]):(\w+)/g)].map(match => match[1]));
const aspectName = (ttl: string) => /^:(\w+)\s+a samm:Aspect\b/m.exec(ttl)?.[1];

const sharedFiles = files.filter(file => !aspectName(contents.get(file)!));
const aspectFiles = files.filter(file => aspectName(contents.get(file)!));

function dependenciesOf(ttl: string): string[] {
    const own = definedElements(ttl);
    const missing = [...referencedElements(ttl)].filter(name => !own.has(name));
    return sharedFiles
        .map(file => contents.get(file)!)
        .filter(shared => {
            const defined = definedElements(shared);
            return missing.some(name => defined.has(name));
        });
}

function load(file: string) {
    const ttl = contents.get(file)!;
    const urn = `urn:samm:org.eclipse.esmf.test:1.0.0#${aspectName(ttl)}`;
    return new AspectModelLoader().loadAspect(urn, ttl, ...dependenciesOf(ttl));
}

describe('ESMF SDK test aspect models', () => {
    test('finds the vendored models', () => {
        expect(aspectFiles.length).toBeGreaterThan(150);
    });

    test.each(aspectFiles)('loads %s', async file => {
        const aspect = await load(file);
        expect(aspect.name).toBe(aspectName(contents.get(file)!));
        expect(aspect.aspectModelUrn).toBe(`urn:samm:org.eclipse.esmf.test:1.0.0#${aspect.name}`);
    });

    test('resolves the element characteristic of a collection via the full characteristic chain', async () => {
        const aspect = await load('AspectWithCollectionAndElementCharacteristic.ttl');
        const collection = aspect.properties[0].characteristic as DefaultCollection;
        expect(collection).toBeInstanceOf(DefaultCollection);
        expect(collection.elementCharacteristic).toBeInstanceOf(DefaultSingleEntity);
        expect(collection.elementCharacteristic?.name).toBe('TestEntityCharacteristic');
    });

    test('supports recursive entity structures', async () => {
        const aspect = await load('AspectWithRecursivePropertyWithOptional.ttl');
        const entity = aspect.properties[0].characteristic?.dataType as DefaultEntity;
        expect(entity).toBeInstanceOf(DefaultEntity);
        const nested = entity.properties[0];
        expect(nested.name).toBe('testProperty');
        expect(nested.isOptional).toBe(true);
        expect(nested.characteristic?.dataType).toBe(entity);
    });
});
