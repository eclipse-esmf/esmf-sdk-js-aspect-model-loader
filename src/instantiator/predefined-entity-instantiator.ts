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

import {DefaultEntity, Entity} from '../aspect-meta-model/default-entity';
import {DefaultProperty} from '../aspect-meta-model/default-property';
import {getElementsCache} from '../shared/model-element-cache.service';
import {getRdfModel} from '../shared/rdf-model';
import {createTimestampCharacteristic} from './characteristic/predefined-characteristic-instantiator';

const {samm, sammE} = getRdfModel();
const modelElementCache = getElementsCache();

type PredefinedEntities = 'FileResource' | 'Point3d' | 'TimeSeriesEntity';
const predefinedEntitiesCreators: {[key in PredefinedEntities]: () => Entity} = {
    FileResource: createFileResourceEntity,
    Point3d: create3dPointEntity,
    TimeSeriesEntity: createTimeSeriesEntity,
} as const;

export function createTimeSeriesEntity(): Entity {
    const entity = new DefaultEntity({
        aspectModelUrn: sammE.getAspectModelUrn('TimeSeriesEntity'),
        metaModelVersion: samm.version,
        name: 'TimeSeriesEntity',
        hasSyntheticName: false,
    });
    entity.preferredNames.set('en', 'Time Series Entity');
    entity.descriptions.set(
        'en',
        'An Entity which represents a key/value pair. The key is the timestamp when the value was recorded and the value is the value which was recorded.'
    );

    const timestamp = new DefaultProperty({
        metaModelVersion: samm.version,
        aspectModelUrn: sammE.getAspectModelUrn('timestamp'),
        name: 'timestamp',
        characteristic: createTimestampCharacteristic(),
    });
    timestamp.preferredNames.set('en', 'Timestamp');
    timestamp.descriptions.set('en', 'The specific point in time when the corresponding value was recorded.');

    const value = new DefaultProperty({
        metaModelVersion: samm.version,
        aspectModelUrn: sammE.getAspectModelUrn('value'),
        name: 'value',
        characteristic: null,
        isAbstract: true,
        hasSyntheticName: false,
    });
    value.preferredNames.set('en', 'Value');
    value.descriptions.set('en', 'Any value.');

    entity.properties.push(timestamp, value);

    return entity;
}

export function create3dPointEntity(): Entity {
    const entity = new DefaultEntity({
        metaModelVersion: samm.version,
        aspectModelUrn: sammE.getAspectModelUrn('Point3d'),
        name: 'ThreeDimensionalPosition',
        properties: [],
    });
    entity.preferredNames.set('en', 'Three Dimensional Position');
    entity.descriptions.set('en', 'Defines a position in a three dimensional space.');

    const x = new DefaultProperty({
        metaModelVersion: samm.version,
        aspectModelUrn: sammE.getAspectModelUrn('x'),
        name: 'x',
        characteristic: null,
        isAbstract: true,
    });
    x.preferredNames.set('en', 'X');
    x.descriptions.set('en', 'The position along the X axis.');

    const y = new DefaultProperty({
        metaModelVersion: samm.version,
        aspectModelUrn: sammE.getAspectModelUrn('y'),
        name: 'y',
        characteristic: null,
        isAbstract: true,
    });
    y.preferredNames.set('en', 'Y');
    y.descriptions.set('en', 'The position along the Y axis.');

    const z = new DefaultProperty({
        metaModelVersion: samm.version,
        aspectModelUrn: sammE.getAspectModelUrn('z'),
        name: 'z',
        characteristic: null,
        isAbstract: true,
    });
    z.preferredNames.set('en', 'Z');
    z.descriptions.set('en', 'The position along the Z axis.');

    entity.properties.push(x, y, z);

    return entity;
}

export function createFileResourceEntity(): Entity {
    const entity = new DefaultEntity({
        metaModelVersion: samm.version,
        aspectModelUrn: sammE.getAspectModelUrn('FileResource'),
        name: 'FileResource',
        properties: [],
    });
    entity.preferredNames.set('en', 'File Resource');
    entity.descriptions.set('en', 'A file in a specific format');

    const resource = new DefaultProperty({
        metaModelVersion: samm.version,
        aspectModelUrn: sammE.getAspectModelUrn('resource'),
        name: 'resource',
        characteristic: createTimestampCharacteristic(),
    });
    resource.preferredNames.set('en', 'Resource');
    resource.descriptions.set('en', 'Location of a resource.');

    const mimeType = new DefaultProperty({
        metaModelVersion: samm.version,
        aspectModelUrn: sammE.getAspectModelUrn('mimeType'),
        name: 'mimeType',
        characteristic: createTimestampCharacteristic(),
    });
    mimeType.preferredNames.set('en', 'MIME Type');
    mimeType.descriptions.set('en', 'A MIME type as defined in RFC 2046.');

    entity.properties.push(resource, mimeType);

    return entity;
}

export function createPredefinedEntity(name: PredefinedEntities): Entity {
    const createFunction = predefinedEntitiesCreators[name];
    if (createFunction) {
        const entity = createFunction();
        return modelElementCache.resolveInstance(entity);
    }
    return null;
}

export function getSupportedEntityNames(): PredefinedEntities[] {
    return Object.keys(predefinedEntitiesCreators) as PredefinedEntities[];
}
