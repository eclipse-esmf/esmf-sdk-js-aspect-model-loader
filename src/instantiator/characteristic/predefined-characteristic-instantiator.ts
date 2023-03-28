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

import {Characteristic} from '../../aspect-meta-model';
import {DefaultCharacteristic} from '../../aspect-meta-model/characteristic/default-characteristic';
import {DefaultScalar} from '../../aspect-meta-model/characteristic/default-scalar';
import {NamedNode} from 'n3';
import {MetaModelElementInstantiator} from '../meta-model-element-instantiator';
import {XsdDataTypes} from '../../shared/xsd-datatypes';

export class PredefinedCharacteristicInstantiator {
    private characteristicInstanceList = [];
    private readonly xsdDataTypes: XsdDataTypes;

    constructor(private metaModelElementInstantiator: MetaModelElementInstantiator) {
        this.xsdDataTypes = metaModelElementInstantiator.rdfModel.xsdDataTypes;
        const sammC = metaModelElementInstantiator.sammC;
        this.characteristicInstanceList[`${sammC.getNamespace()}Timestamp`] = this.createTimestampCharacteristic.bind(this);
        this.characteristicInstanceList[`${sammC.getNamespace()}Text`] = this.createTextCharacteristic.bind(this);
        this.characteristicInstanceList[`${sammC.getNamespace()}MultiLanguageText`] = this.createMultiLanguageTextCharacteristic.bind(this);
        this.characteristicInstanceList[`${sammC.getNamespace()}Boolean`] = this.createBooleanCharacteristic.bind(this);
        this.characteristicInstanceList[`${sammC.getNamespace()}Locale`] = this.createLocaleCharacteristic.bind(this);
        this.characteristicInstanceList[`${sammC.getNamespace()}Language`] = this.createLanguageCharacteristic.bind(this);
        this.characteristicInstanceList[`${sammC.getNamespace()}UnitReference`] = this.createUnitReferenceCharacteristic.bind(this);
        this.characteristicInstanceList[`${sammC.getNamespace()}ResourcePath`] = this.createResourcePathCharacteristic.bind(this);
        this.characteristicInstanceList[`${sammC.getNamespace()}MimeType`] = this.createMimeTypeCharacteristic.bind(this);
    }

    createTextCharacteristic(): Characteristic {
        const characteristic = new DefaultCharacteristic(
            this.metaModelElementInstantiator.samm.version,
            this.metaModelElementInstantiator.sammC.getAspectModelUrn('Text'),
            'Text',
            new DefaultScalar(`${this.xsdDataTypes.getDataType('string').isDefinedBy}`)
        );

        characteristic.addPreferredName('en', 'Text');
        characteristic.addDescription(
            'en',
            'Describes a Property which contains plain text. This is intended exclusively for human readable strings, not for identifiers, measurement values, etc.'
        );

        return characteristic;
    }

    createTimestampCharacteristic(): Characteristic {
        const characteristic = new DefaultCharacteristic(
            this.metaModelElementInstantiator.samm.version,
            this.metaModelElementInstantiator.sammC.getAspectModelUrn('Timestamp'),
            'Timestamp',
            new DefaultScalar(`${this.xsdDataTypes.getDataType('dateTime').isDefinedBy}`)
        );

        characteristic.addPreferredName('en', 'Timestamp');
        characteristic.addDescription('en', 'Describes a Property which contains the date and time with an optional timezone.');

        return characteristic;
    }

    createMultiLanguageTextCharacteristic(): Characteristic {
        const characteristic = new DefaultCharacteristic(
            this.metaModelElementInstantiator.samm.version,
            this.metaModelElementInstantiator.sammC.getAspectModelUrn('MultiLanguageText'),
            'MultiLanguageText',
            new DefaultScalar(`${this.xsdDataTypes.getDataType('langString').isDefinedBy}`)
        );

        characteristic.addPreferredName('en', 'Multi-Language Text');
        characteristic.addDescription(
            'en',
            'Describes a Property which contains plain text in multiple languages. This is intended exclusively for human readable strings, not for identifiers, measurement values, etc.'
        );

        return characteristic;
    }

    createBooleanCharacteristic(): Characteristic {
        const characteristic = new DefaultCharacteristic(
            this.metaModelElementInstantiator.samm.version,
            this.metaModelElementInstantiator.sammC.getAspectModelUrn('Boolean'),
            'Boolean',
            new DefaultScalar(`${this.xsdDataTypes.getDataType('boolean').isDefinedBy}`)
        );

        characteristic.addPreferredName('en', 'Boolean');
        characteristic.addDescription('en', 'Represents a boolean value (i.e. a "flag").');

        return characteristic;
    }

    createLocaleCharacteristic(): Characteristic {
        const characteristic = new DefaultCharacteristic(
            this.metaModelElementInstantiator.samm.version,
            this.metaModelElementInstantiator.sammC.getAspectModelUrn('Locale'),
            'Locale',
            new DefaultScalar(`${this.xsdDataTypes.getDataType('string').isDefinedBy}`)
        );

        characteristic.addPreferredName('en', 'Locale');
        characteristic.addDescription('en', 'Describes a Property containing a locale according to IETF BCP 47, for example "de-DE".');

        return characteristic;
    }

    createLanguageCharacteristic(): Characteristic {
        const characteristic = new DefaultCharacteristic(
            this.metaModelElementInstantiator.samm.version,
            this.metaModelElementInstantiator.sammC.getAspectModelUrn('Language'),
            'Language',
            new DefaultScalar(`${this.xsdDataTypes.getDataType('string').isDefinedBy}`)
        );

        characteristic.addPreferredName('en', 'Language');
        characteristic.addDescription('en', 'Describes a Property containing a language according to ISO 639-1, for example "de".');

        return characteristic;
    }

    createUnitReferenceCharacteristic(): Characteristic {
        const characteristic = new DefaultCharacteristic(
            this.metaModelElementInstantiator.samm.version,
            this.metaModelElementInstantiator.sammC.getAspectModelUrn('UnitReference'),
            'UnitReference',
            new DefaultScalar(`${this.xsdDataTypes.getDataType('curie').isDefinedBy}`)
        );

        characteristic.addPreferredName('en', 'Unit Reference');
        characteristic.addDescription('en', 'Describes a Property containing a reference to one of the units in the Unit Catalog.');

        return characteristic;
    }

    createResourcePathCharacteristic(): Characteristic {
        const characteristic = new DefaultCharacteristic(
            this.metaModelElementInstantiator.samm.version,
            this.metaModelElementInstantiator.sammC.getAspectModelUrn('ResourcePath'),
            'ResourcePath',
            new DefaultScalar(`${this.xsdDataTypes.getDataType('anyURI').isDefinedBy}`)
        );

        characteristic.addPreferredName('en', 'Resource Path');
        characteristic.addDescription('en', 'The path of a resource.');

        return characteristic;
    }

    createMimeTypeCharacteristic(): Characteristic {
        const characteristic = new DefaultCharacteristic(
            this.metaModelElementInstantiator.samm.version,
            this.metaModelElementInstantiator.sammC.getAspectModelUrn('MimeType'),
            'MimeType',
            new DefaultScalar(`${this.xsdDataTypes.getDataType('string').isDefinedBy}`)
        );

        characteristic.addPreferredName('en', 'MIME Type');
        characteristic.addDescription('en', 'A MIME type as defined in RFC 2046, for example "application/pdf.');

        return characteristic;
    }

    createCharacteristic(name: NamedNode): Characteristic {
        const createFunction = this.characteristicInstanceList[name.value];
        if (createFunction) {
            return createFunction();
        } else {
            return null;
        }
    }

    getSupportedCharacteristicNames(): Array<string> {
        return Object.keys(this.characteristicInstanceList);
    }
}
