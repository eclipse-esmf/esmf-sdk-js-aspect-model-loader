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

import {Characteristic, DefaultScalar} from '../../aspect-meta-model';
import {DefaultCharacteristic} from '../../aspect-meta-model/characteristic/default-characteristic';
import {getRdfModel} from '../../shared/rdf-model';

const predefinedCharacteristicCreators = {};
let initialized = false;
function initPredefinedCharacteristicCreatorsList() {
    const {sammC} = getRdfModel();
    predefinedCharacteristicCreators[`${sammC.getNamespace()}Timestamp`] = createTimestampCharacteristic;
    predefinedCharacteristicCreators[`${sammC.getNamespace()}Text`] = createTextCharacteristic;
    predefinedCharacteristicCreators[`${sammC.getNamespace()}MultiLanguageText`] = createMultiLanguageTextCharacteristic;
    predefinedCharacteristicCreators[`${sammC.getNamespace()}Boolean`] = createBooleanCharacteristic;
    predefinedCharacteristicCreators[`${sammC.getNamespace()}Locale`] = createLocaleCharacteristic;
    predefinedCharacteristicCreators[`${sammC.getNamespace()}Language`] = createLanguageCharacteristic;
    predefinedCharacteristicCreators[`${sammC.getNamespace()}UnitReference`] = createUnitReferenceCharacteristic;
    predefinedCharacteristicCreators[`${sammC.getNamespace()}ResourcePath`] = createResourcePathCharacteristic;
    predefinedCharacteristicCreators[`${sammC.getNamespace()}MimeType`] = createMimeTypeCharacteristic;
    initialized = true;
}

export function createTextCharacteristic(): Characteristic {
    const rdfModel = getRdfModel();
    const {samm, sammC} = rdfModel;
    const type = rdfModel.xsdDataTypes.getDataType('string');

    const characteristic = new DefaultCharacteristic({
        metaModelVersion: samm.version,
        aspectModelUrn: sammC.getAspectModelUrn('Text'),
        name: 'Text',
        dataType: new DefaultScalar({
            urn: type.isDefinedBy,
            metaModelVersion: samm.version,
        }),
    });

    characteristic.preferredNames.set('en', 'Text');
    characteristic.descriptions.set(
        'en',
        'Describes a Property which contains plain text. This is intended exclusively for human readable strings, not for identifiers, measurement values, etc.'
    );

    return characteristic;
}

export function createTimestampCharacteristic(): Characteristic {
    const rdfModel = getRdfModel();
    const {samm, sammC} = rdfModel;
    const type = rdfModel.xsdDataTypes.getDataType('dateTime');

    const characteristic = new DefaultCharacteristic({
        metaModelVersion: samm.version,
        aspectModelUrn: sammC.getAspectModelUrn('Timestamp'),
        name: 'Timestamp',
        dataType: new DefaultScalar({
            urn: type.isDefinedBy,
            metaModelVersion: samm.version,
        }),
    });

    characteristic.preferredNames.set('en', 'Timestamp');
    characteristic.descriptions.set('en', 'Describes a Property which contains the date and time with an optional timezone.');

    return characteristic;
}

export function createMultiLanguageTextCharacteristic(): Characteristic {
    const rdfModel = getRdfModel();
    const {samm, sammC} = rdfModel;
    const type = rdfModel.xsdDataTypes.getDataType('langString');

    const characteristic = new DefaultCharacteristic({
        metaModelVersion: samm.version,
        aspectModelUrn: sammC.getAspectModelUrn('MultiLanguageText'),
        name: 'MultiLanguageText',
        dataType: new DefaultScalar({
            urn: type.isDefinedBy,
            metaModelVersion: samm.version,
        }),
    });

    characteristic.preferredNames.set('en', 'Multi-Language Text');
    characteristic.descriptions.set(
        'en',
        'Describes a Property which contains plain text in multiple languages. This is intended exclusively for human readable strings, not for identifiers, measurement values, etc.'
    );

    return characteristic;
}

export function createBooleanCharacteristic(): Characteristic {
    const rdfModel = getRdfModel();
    const {samm, sammC} = rdfModel;
    const type = rdfModel.xsdDataTypes.getDataType('boolean');

    const characteristic = new DefaultCharacteristic({
        metaModelVersion: samm.version,
        aspectModelUrn: sammC.getAspectModelUrn('Boolean'),
        name: 'Boolean',
        dataType: new DefaultScalar({
            urn: type.isDefinedBy,
            metaModelVersion: samm.version,
        }),
    });

    characteristic.preferredNames.set('en', 'Boolean');
    characteristic.descriptions.set('en', 'Represents a boolean value (i.e. a "flag").');

    return characteristic;
}

export function createLocaleCharacteristic(): Characteristic {
    const rdfModel = getRdfModel();
    const {samm, sammC} = rdfModel;
    const type = rdfModel.xsdDataTypes.getDataType('string');

    const characteristic = new DefaultCharacteristic({
        metaModelVersion: samm.version,
        aspectModelUrn: sammC.getAspectModelUrn('Locale'),
        name: 'Locale',
        dataType: new DefaultScalar({
            urn: type.isDefinedBy,
            metaModelVersion: samm.version,
        }),
    });

    characteristic.preferredNames.set('en', 'Locale');
    characteristic.descriptions.set('en', 'Describes a Property containing a locale according to IETF BCP 47, for example "de-DE".');

    return characteristic;
}

export function createLanguageCharacteristic(): Characteristic {
    const rdfModel = getRdfModel();
    const {samm, sammC} = rdfModel;
    const type = rdfModel.xsdDataTypes.getDataType('string');

    const characteristic = new DefaultCharacteristic({
        metaModelVersion: samm.version,
        aspectModelUrn: sammC.getAspectModelUrn('Language'),
        name: 'Language',
        dataType: new DefaultScalar({
            urn: type.isDefinedBy,
            metaModelVersion: samm.version,
        }),
    });

    characteristic.preferredNames.set('en', 'Language');
    characteristic.descriptions.set('en', 'Describes a Property containing a language according to ISO 639-1, for example "de".');

    return characteristic;
}

export function createUnitReferenceCharacteristic(): Characteristic {
    const rdfModel = getRdfModel();
    const {samm, sammC} = rdfModel;
    const type = rdfModel.xsdDataTypes.getDataType('curie');

    const characteristic = new DefaultCharacteristic({
        metaModelVersion: samm.version,
        aspectModelUrn: sammC.getAspectModelUrn('UnitReference'),
        name: 'UnitReference',
        dataType: new DefaultScalar({
            urn: type.isDefinedBy,
            metaModelVersion: samm.version,
        }),
    });

    characteristic.preferredNames.set('en', 'Unit Reference');
    characteristic.descriptions.set('en', 'Describes a Property containing a reference to one of the units in the Unit Catalog.');

    return characteristic;
}

export function createResourcePathCharacteristic(): Characteristic {
    const rdfModel = getRdfModel();
    const {samm, sammC} = rdfModel;
    const type = rdfModel.xsdDataTypes.getDataType('anyURI');

    const characteristic = new DefaultCharacteristic({
        metaModelVersion: samm.version,
        aspectModelUrn: sammC.getAspectModelUrn('ResourcePath'),
        name: 'ResourcePath',
        dataType: new DefaultScalar({
            urn: type.isDefinedBy,
            metaModelVersion: samm.version,
        }),
    });

    characteristic.preferredNames.set('en', 'Resource Path');
    characteristic.descriptions.set('en', 'The path of a resource.');

    return characteristic;
}

export function createMimeTypeCharacteristic(): Characteristic {
    const rdfModel = getRdfModel();
    const {samm, sammC} = rdfModel;
    const type = rdfModel.xsdDataTypes.getDataType('string');

    const characteristic = new DefaultCharacteristic({
        metaModelVersion: samm.version,
        aspectModelUrn: sammC.getAspectModelUrn('MimeType'),
        name: 'MimeType',
        dataType: new DefaultScalar({
            urn: type.isDefinedBy,
            metaModelVersion: samm.version,
        }),
    });

    characteristic.preferredNames.set('en', 'MIME Type');
    characteristic.descriptions.set('en', 'A MIME type as defined in RFC 2046, for example "application/pdf.');

    return characteristic;
}

export function createPredefinedCharacteristic(aspectModelUrn: string) {
    if (!initialized) {
        initPredefinedCharacteristicCreatorsList();
    }

    return predefinedCharacteristicCreators[aspectModelUrn]?.();
}

export function getSupportedCharacteristicNames(): Array<string> {
    return Object.keys(predefinedCharacteristicCreators);
}
