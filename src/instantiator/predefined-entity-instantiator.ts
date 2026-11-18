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

import {DefaultEntity, Entity} from '../aspect-meta-model/default-entity.js';
import {DefaultProperty} from '../aspect-meta-model/default-property.js';
import {PredefinedCharacteristicInstantiator} from './characteristic/predefined-characteristic-instantiator.js';
import {MetaModelElementInstantiator} from './meta-model-element-instantiator.js';

export class PredefinedEntityInstantiator {
    private entityInstanceList: Record<string, () => Entity> = {};

    constructor(
        private metaModelElementInstantiator: MetaModelElementInstantiator,
        private sammCInstantiator: PredefinedCharacteristicInstantiator
    ) {
        this.entityInstanceList['FileResource'] = this.createFileResourceEntity.bind(this);
        this.entityInstanceList['Point3d'] = this.create3dPointEntity.bind(this);
        this.entityInstanceList['TimeSeriesEntity'] = this.createTimeSeriesEntity.bind(this);
        this.entityInstanceList['Quantity'] = this.createQuantityEntity.bind(this);
    }

    private createQuantityEntity(): Entity {
        const entity = new DefaultEntity(
            this.metaModelElementInstantiator.samm.version,
            this.metaModelElementInstantiator.sammE.getAspectModelUrn('Quantity'),
            'Quantity',
            [],
            true
        );
        entity.addPreferredName('en', 'Quantity');
        entity.addDescription('en', 'A numeric value and the physical unit of the value.');

        const value = new DefaultProperty(
            this.metaModelElementInstantiator.samm.version,
            this.metaModelElementInstantiator.sammE.getAspectModelUrn('value'),
            'value',
            null!
        );
        value.isAbstract = true;
        value.addPreferredName('en', 'Value');
        value.addDescription('en', 'Any value.');

        const unit = new DefaultProperty(
            this.metaModelElementInstantiator.samm.version,
            this.metaModelElementInstantiator.sammE.getAspectModelUrn('unit'),
            'unit',
            this.sammCInstantiator.createUnitReferenceCharacteristic()
        );
        unit.addPreferredName('en', 'Unit');
        unit.addDescription('en', 'The unit of a quantity.');

        entity.properties = [value, unit];

        return entity;
    }

    private createTimeSeriesEntity(): Entity {
        const entity = new DefaultEntity(
            this.metaModelElementInstantiator.samm.version,
            this.metaModelElementInstantiator.sammE.getAspectModelUrn('TimeSeriesEntity'),
            'TimeSeriesEntity',
            [],
            true
        );
        entity.addPreferredName('en', 'Time Series Entity');
        entity.addDescription(
            'en',
            'An Entity which represents a key/value pair. The key is the timestamp when the value was recorded and the value is the value which was recorded.'
        );

        const timestamp = new DefaultProperty(
            this.metaModelElementInstantiator.samm.version,
            this.metaModelElementInstantiator.sammE.getAspectModelUrn('timestamp'),
            'timestamp',
            this.sammCInstantiator.createTimestampCharacteristic()
        );
        timestamp.addPreferredName('en', 'Timestamp');
        timestamp.addDescription('en', 'The specific point in time when the corresponding value was recorded.');

        const value = new DefaultProperty(
            this.metaModelElementInstantiator.samm.version,
            this.metaModelElementInstantiator.sammE.getAspectModelUrn('value'),
            'value',
            null!
        );
        value.isAbstract = true;
        value.addPreferredName('en', 'Value');
        value.addDescription('en', 'Any value.');

        entity.properties = [timestamp, value];

        return entity;
    }

    private create3dPointEntity(): Entity {
        const entity = new DefaultEntity(
            this.metaModelElementInstantiator.samm.version,
            this.metaModelElementInstantiator.sammE.getAspectModelUrn('Point3d'),
            'ThreeDimensionalPosition',
            []
        );
        entity.addPreferredName('en', 'Three Dimensional Position');
        entity.addDescription('en', 'Defines a position in a three dimensional space.');

        const x = new DefaultProperty(
            this.metaModelElementInstantiator.samm.version,
            this.metaModelElementInstantiator.sammE.getAspectModelUrn('x'),
            'x',
            null!
        );
        x.isAbstract = true;
        x.addPreferredName('en', 'X');
        x.addDescription('en', 'The position along the X axis.');

        const y = new DefaultProperty(
            this.metaModelElementInstantiator.samm.version,
            this.metaModelElementInstantiator.sammE.getAspectModelUrn('y'),
            'y',
            null!
        );
        y.isAbstract = true;
        y.addPreferredName('en', 'Y');
        y.addDescription('en', 'The position along the Y axis.');

        const z = new DefaultProperty(
            this.metaModelElementInstantiator.samm.version,
            this.metaModelElementInstantiator.sammE.getAspectModelUrn('z'),
            'z',
            null!
        );
        z.isAbstract = true;
        z.addPreferredName('en', 'Z');
        z.addDescription('en', 'The position along the Z axis.');

        entity.properties = [x, y, z];

        return entity;
    }

    private createFileResourceEntity(): Entity {
        const entity = new DefaultEntity(
            this.metaModelElementInstantiator.samm.version,
            this.metaModelElementInstantiator.sammE.getAspectModelUrn('FileResource'),
            'FileResource',
            []
        );
        entity.addPreferredName('en', 'File Resource');
        entity.addDescription('en', 'A file in a specific format');

        const resource = new DefaultProperty(
            this.metaModelElementInstantiator.samm.version,
            this.metaModelElementInstantiator.sammE.getAspectModelUrn('resource'),
            'resource',
            this.sammCInstantiator.createTimestampCharacteristic()
        );
        resource.addPreferredName('en', 'Resource');
        resource.addDescription('en', 'Location of a resource.');

        const mimeType = new DefaultProperty(
            this.metaModelElementInstantiator.samm.version,
            this.metaModelElementInstantiator.sammE.getAspectModelUrn('mimeType'),
            'mimeType',
            this.sammCInstantiator.createTimestampCharacteristic()
        );
        mimeType.addPreferredName('en', 'MIME Type');
        mimeType.addDescription('en', 'A MIME type as defined in RFC 2046.');

        entity.properties = [resource, mimeType];

        return entity;
    }

    createEntity(name: string): Entity {
        const createFunction = this.entityInstanceList[name];
        if (createFunction) {
            const entity = createFunction();
            return <Entity>this.metaModelElementInstantiator.cacheService.resolveInstance(entity);
        }
        return null!;
    }

    getSupportedEntityNames(): Array<string> {
        return Object.keys(this.entityInstanceList);
    }
}
