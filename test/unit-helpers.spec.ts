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

import {Store} from 'n3';
import {
    BaseMetaModelElement,
    DefaultCharacteristic,
    DefaultEntity,
    DefaultEntityInstance,
    DefaultNamespaceVisitor,
    DefaultOperation,
    DefaultProperty,
    DefaultQuantityKind,
    DefaultScalar,
    DefaultSortedSet,
    DefaultValue,
    Samm,
    SammC,
    SammE,
    SammU,
} from '../src';
import {KnownVersion, SammVersion} from '../src/shared/known-version';
import {RdfModel} from '../src/shared/rdf-model';
import {RdfModelUtil} from '../src/shared/rdf-model-util';
import {XsdDataTypes} from '../src/shared/xsd-datatypes';
import {Units} from '../src/shared/units';
import {PredefinedUnitInstantiator} from '../src/instantiator/predefined-unit-instantiator';
import type {MetaModelElementInstantiator} from '../src/instantiator/meta-model-element-instantiator';

const VERSION = '2.2.0';
const NS = 'urn:samm:org.eclipse.esmf.test:1.0.0#';
const XSD_INT = 'http://www.w3.org/2001/XMLSchema#int';

describe('KnownVersion', (): void => {
    test('lists the supported versions', (): void => {
        expect(KnownVersion.getSupportedVersions()).toEqual(['2.0.0', '2.1.0', '2.2.0']);
        expect(SammVersion.SAMM_2_2_0).toBe('2.2.0');
    });

    test('resolves and validates version strings', (): void => {
        expect(KnownVersion.fromVersionString('2.1.0')).toBe('2.1.0');
        expect(KnownVersion.fromVersionString('1.0.0')).toBeUndefined();
        expect(KnownVersion.isVersionSupported('2.0.0')).toBe(true);
        expect(KnownVersion.isVersionSupported(<SammVersion>'9.9.9')).toBe(false);
    });
});

describe('Vocabulary', (): void => {
    const samm = new Samm(VERSION);
    const sammC = new SammC(samm);
    const sammE = new SammE(samm);
    const sammU = new SammU(samm);

    test('builds namespaces and urns', (): void => {
        expect(Samm.getBaseUri()).toBe('urn:samm:org.eclipse.esmf.samm:');
        expect(samm.getAlias()).toBe('samm');
        expect(samm.getUri()).toBe(`urn:samm:org.eclipse.esmf.samm:meta-model:${VERSION}`);
        expect(samm.getNamespace()).toBe(`urn:samm:org.eclipse.esmf.samm:meta-model:${VERSION}#`);
        expect(samm.getAspectModelUrn('Aspect')).toBe(`${samm.getNamespace()}Aspect`);
        expect(samm.getXSDNameSpace()).toBe('http://www.w3.org/2001/XMLSchema#');
        expect(samm.getRdfSyntaxNameSpace()).toBe('http://www.w3.org/1999/02/22-rdf-syntax-ns#');
        expect(sammU.getAlias()).toBe('unit');
        expect(sammU.getUri()).toBe(`urn:samm:org.eclipse.esmf.samm:unit:${VERSION}`);
        expect(sammU.getNamespace()).toBe(`urn:samm:org.eclipse.esmf.samm:unit:${VERSION}#`);
        expect(sammC.getAlias()).toBe('samm-c');
        expect(sammE.getAlias()).toBe('samm-e');
    });

    test('recognizes default namespaces and rdf terms', (): void => {
        expect(samm.isDefaultNamespaceUri(XSD_INT)).toBe(true);
        expect(samm.isDefaultNamespaceUri('http://www.w3.org/2000/01/rdf-schema#label')).toBe(true);
        expect(samm.isDefaultNamespaceUri(samm.getAspectModelUrn('Aspect'))).toBe(true);
        expect(samm.isDefaultNamespaceUri(`${NS}Foo`)).toBe(false);
        expect(samm.isRdfTypeProperty(samm.RdfType().value)).toBe(true);
        expect(samm.isRdfFirst(samm.RdfFirst().value)).toBe(true);
        expect(samm.isRdfRest(samm.RdfRest().value)).toBe(true);
        expect(samm.isRdfNill(samm.RdfNil().value)).toBe(true);
        expect(samm.isXSDType('xsd:int')).toBe(true);
        expect(samm.isXSDType('int')).toBe(false);
    });

    test('recognizes samm properties', (): void => {
        expect(samm.isPreferredNameProperty(samm.PreferredNameProperty().value)).toBe(true);
        expect(samm.isDescriptionProperty(samm.DescriptionProperty().value)).toBe(true);
        expect(samm.isOptionalProperty(samm.OptionalProperty().value)).toBe(true);
        expect(samm.isNotInPayloadProperty(samm.NotInPayloadProperty().value)).toBe(true);
        expect(samm.isPayloadNameProperty(samm.PayloadNameProperty().value)).toBe(true);
        expect(samm.isSeeProperty(samm.SeeProperty().value)).toBe(true);
        expect(samm.isExampleValueProperty(samm.ExampleValueProperty().value)).toBe(true);
        expect(samm.isInputProperty(samm.InputProperty().value)).toBe(true);
        expect(samm.isOutputProperty(samm.OutputProperty().value)).toBe(true);
        expect(samm.isCharacteristicProperty(samm.CharacteristicProperty().value)).toBe(true);
        expect(samm.isPropertiesProperty(samm.PropertiesProperty().value)).toBe(true);
        expect(samm.isOperationsProperty(samm.OperationsProperty().value)).toBe(true);
        expect(samm.isEventsProperty(samm.EventsProperty().value)).toBe(true);
        expect(samm.isValue(samm.Value().value)).toBe(true);
        expect(samm.isNamespace(samm.Namespace().value)).toBe(true);
        expect(samm.isAbstractEntity(samm.AbstractEntity().value)).toBe(true);
        expect(samm.isExtends(samm.Extends().value)).toBe(true);
        expect(samm.isDescriptionProperty(samm.PreferredNameProperty().value)).toBe(false);
    });
});

describe('RdfModelUtil', (): void => {
    const samm = new Samm(VERSION);
    const sammC = new SammC(samm);
    const sammU = new SammU(samm);

    test('resolves namespace aliases', (): void => {
        expect(RdfModelUtil.resolveNamespaceAlias(samm.getNamespace(), VERSION)).toBe('samm');
        expect(RdfModelUtil.resolveNamespaceAlias(sammC.getNamespace(), VERSION)).toBe('samm-c');
        expect(RdfModelUtil.resolveNamespaceAlias(new SammE(samm).getNamespace(), VERSION)).toBe('samm-e');
        expect(RdfModelUtil.resolveNamespaceAlias(sammU.getNamespace(), VERSION)).toBe('unit');
        expect(RdfModelUtil.resolveNamespaceAlias(XSD_INT, VERSION)).toBe('xsd');
        expect(RdfModelUtil.resolveNamespaceAlias('http://www.w3.org/1999/02/22-rdf-syntax-ns#type', VERSION)).toBe('rdf');
        expect(RdfModelUtil.resolveNamespaceAlias('http://www.w3.org/2000/01/rdf-schema#label', VERSION)).toBe('rdfs');
        expect(RdfModelUtil.resolveNamespaceAlias(NS, VERSION)).toBe('');
    });

    test('checks definitions', (): void => {
        expect(RdfModelUtil.isSammDefinition(samm.getAspectModelUrn('Aspect'), samm)).toBe(true);
        expect(RdfModelUtil.isSammDefinition('', samm)).toBe(false);
        expect(RdfModelUtil.isSammCDefinition(`${sammC.getNamespace()}Text`, sammC)).toBe(true);
        expect(RdfModelUtil.isCharacteristicInstance(`${NS}Text`, sammC)).toBe(false);
        expect(RdfModelUtil.isSammUDefinition(`${sammU.getNamespace()}metre`, sammU)).toBe(true);
        expect(RdfModelUtil.isUnitInstance(`${NS}metre`, sammU)).toBe(false);

        const rdfModel = new RdfModel(new Store(), VERSION, 'urn:samm:org.eclipse.esmf.test:1.0.0');
        expect(RdfModelUtil.isAspectModelDefinition(`${NS}Foo`, rdfModel)).toBe(true);
        expect(RdfModelUtil.isAspectModelDefinition('urn:samm:other:1.0.0#Foo', rdfModel)).toBe(false);
        expect(RdfModelUtil.isAspectModelDefinition('', rdfModel)).toBe(false);
    });

    test('strips urn definitions from values', (): void => {
        expect(RdfModelUtil.getValueWithoutUrnDefinition(XSD_INT)).toBe('int');
        expect(RdfModelUtil.getValueWithoutUrnDefinition(samm.getAspectModelUrn('Aspect'))).toBe('Aspect');
        expect(RdfModelUtil.getValueWithoutUrnDefinition('plain')).toBe('plain');
        expect(RdfModelUtil.getValueWithoutUrnDefinition(42)).toBe('42');
        expect(RdfModelUtil.getValueWithoutUrnDefinition(null)).toBe('');

        const entity = new DefaultEntity(VERSION, `${NS}MyEntity`, 'MyEntity');
        expect(RdfModelUtil.getValuesWithoutUrnDefinition([entity, XSD_INT, 3])).toBe('MyEntity, int, 3');
    });

    test('appends locales', (): void => {
        expect(RdfModelUtil.appendLocale('Hello', 'en')).toBe('Hello @en');
        expect(RdfModelUtil.appendLocale('Hello', '')).toBe('Hello ');
    });

    test('throws on unsupported versions only', (): void => {
        expect(() => RdfModelUtil.throwErrorIfUnsupportedVersion(new RdfModel(new Store(), VERSION))).not.toThrow();
        expect(() => RdfModelUtil.throwErrorIfUnsupportedVersion(new RdfModel(new Store()))).toThrow(
            'SAMM unknown is not supported. Supported versions are: 2.0.0,2.1.0,2.2.0'
        );
    });
});

describe('RdfModel', (): void => {
    test('registers default prefixes', (): void => {
        const rdfModel = new RdfModel(new Store(), VERSION, 'urn:samm:org.eclipse.esmf.test:1.0.0');
        const prefixes = rdfModel.getPrefixes();
        expect(rdfModel.getMetaModelVersion()).toBe(VERSION);
        expect(prefixes['']).toBe(NS);
        expect(prefixes['xsd']).toBe('http://www.w3.org/2001/XMLSchema#');
        expect(prefixes['samm']).toBe(rdfModel.samm.getNamespace());
        expect(prefixes['samm-c']).toBe(rdfModel.sammC.getNamespace());
        expect(prefixes['samm-e']).toBe(rdfModel.sammE.getNamespace());
        expect(prefixes['unit']).toBe(rdfModel.sammU.getNamespace());
    });
});

describe('XsdDataTypes and Units', (): void => {
    test('provides xsd data types', (): void => {
        const xsd = new XsdDataTypes(VERSION);
        expect(xsd.getDataType('boolean').isDefinedBy).toBe('http://www.w3.org/2001/XMLSchema#boolean');
        expect(Object.keys(xsd.getDataTypes())).toContain('int');
        expect(xsd.getDataType('curie').isDefinedBy).not.toContain('MODEL_VERSION');
    });

    test('resolves the curie data type per instance', (): void => {
        expect(new XsdDataTypes('2.1.0').getDataType('curie').isDefinedBy).toContain('2.1.0');
        expect(new XsdDataTypes('2.2.0').getDataType('curie').isDefinedBy).toContain('2.2.0');
    });

    test('provides predefined units and quantity kinds', (): void => {
        const units = new Units(new SammU(new Samm(VERSION)));
        expect(units.getUnit('metre')?.symbol).toBe('m');
        expect(units.getUnit(`${new SammU(new Samm(VERSION)).getNamespace()}metre`)?.name).toBe('metre');
        expect(units.getQuantityKind('length')?.label).toBe('length');
        expect(units.getSupportedUnitNames()).toContain('kilogram');
        expect(units.getSupportedQuantityKindsNames()).toContain('mass');
        expect(units.getSupportedUnitNames()).toHaveLength(1714);
        expect(units.getSupportedQuantityKindsNames()).toHaveLength(627);
        expect(units.getUnit('unknownUnit')).toBeUndefined();
    });

    test('resolves reference units lazily from the compact unit table', (): void => {
        const units = new Units(new SammU(new Samm(VERSION)));
        const kilometre = units.getUnit('kilometre');
        expect(kilometre?.code).toBe('KMT');
        expect(kilometre?.conversionFactor).toBe('10³ m');
        expect(kilometre?.referenceUnit?.()).toBe(units.getUnit('metre'));
        expect(units.getUnit('metre')?.referenceUnit).toBeNull();
        expect(units.getUnit('metre')?.quantityKinds).toContain('length');
    });

    test('PredefinedUnitInstantiator lists supported names instead of array indices', (): void => {
        const samm = new Samm(VERSION);
        const instantiator = new PredefinedUnitInstantiator({samm, sammU: new SammU(samm)} as unknown as MetaModelElementInstantiator);
        expect(instantiator.getSupportedUnitNames()).toContain('kilogram');
        expect(instantiator.getSupportedQuantityKindsNames()).toContain('mass');
    });
});

describe('Meta model elements', (): void => {
    const characteristic = new DefaultCharacteristic(VERSION, `${NS}Count`, 'Count', new DefaultScalar(XSD_INT));

    test('DefaultScalar', (): void => {
        const scalar = new DefaultScalar(XSD_INT);
        expect(scalar.urn).toBe(XSD_INT);
        expect(scalar.shortUrn).toBe('int');
        expect(scalar.isScalar).toBe(true);
        expect(scalar.isComplex).toBe(false);
        expect(scalar.isAbstract).toBe(false);
    });

    test('DefaultValue', (): void => {
        const value = new DefaultValue(VERSION, `${NS}Red`, 'Red', 'red');
        expect(value.value).toBe('red');
        expect(`${value}`).toBe('red');
        value.value = 5;
        expect(value.toString()).toBe('5');
        expect(value.accept(new DefaultNamespaceVisitor(), new Map())).toBeUndefined();
    });

    test('DefaultQuantityKind', (): void => {
        const quantityKind = new DefaultQuantityKind(VERSION, `${NS}speed`, 'speed', 'speed');
        expect(quantityKind.label).toBe('speed');
        quantityKind.label = 'velocity';
        expect(quantityKind.label).toBe('velocity');
    });

    test('DefaultOperation', (): void => {
        const input = new DefaultProperty(VERSION, `${NS}count`, 'count', characteristic);
        const output = new DefaultProperty(VERSION, `${NS}result`, 'result', characteristic);
        const operation = new DefaultOperation(VERSION, `${NS}run`, 'run', [input], output);
        expect(operation.getInputProperty('count')).toBe(input);
        expect(operation.getInputProperty('missing')).toBeUndefined();
        expect(operation.output).toBe(output);
        operation.input = [];
        operation.output = undefined;
        expect(operation.input).toEqual([]);
        expect(operation.output).toBeUndefined();
        expect(new DefaultOperation(VERSION, `${NS}noop`, 'noop').input).toEqual([]);
    });

    test('DefaultSortedSet indexOf with scalar values', (): void => {
        const sortedSet = new DefaultSortedSet(VERSION, `${NS}Set`, 'Set', undefined, new DefaultScalar(XSD_INT));
        expect(sortedSet.indexOf('a')).toBe(-1);
        sortedSet.values = ['a', 'b'];
        expect(sortedSet.values).toEqual(['a', 'b']);
        expect(sortedSet.indexOf('b')).toBe(1);
        expect(sortedSet.indexOf('c')).toBe(-1);
        expect(sortedSet.isOrdered).toBe(true);
        expect(sortedSet.isAllowDuplicates).toBe(false);
    });

    test('DefaultSortedSet indexOf with entity values', (): void => {
        const key = new DefaultProperty(VERSION, `${NS}key`, 'key', characteristic);
        const hidden = new DefaultProperty(VERSION, `${NS}hidden`, 'hidden', characteristic, true);
        const entity = new DefaultEntity(VERSION, `${NS}Item`, 'Item', [hidden, key]);
        const first = new DefaultEntityInstance('first', entity);
        const second = new DefaultEntityInstance('second', entity);
        first['key'] = 'one';
        second['key'] = 'two';
        const sortedSet = new DefaultSortedSet(VERSION, `${NS}Items`, 'Items', undefined, entity, [first, second]);
        expect(sortedSet.indexOf('two')).toBe(1);
        expect(sortedSet.indexOf('three')).toBe(-1);
    });

    test('DefaultNamespaceVisitor visits all elements', (): void => {
        const visitor = new DefaultNamespaceVisitor();
        const elements: Array<BaseMetaModelElement> = [
            characteristic,
            new DefaultEntity(VERSION, `${NS}E`, 'E'),
            new DefaultOperation(VERSION, `${NS}op`, 'op'),
            new DefaultProperty(VERSION, `${NS}p`, 'p', characteristic),
            new DefaultQuantityKind(VERSION, `${NS}q`, 'q', 'q'),
            new DefaultValue(VERSION, `${NS}v`, 'v', 1),
        ];
        const visited: Array<string> = [];
        for (const element of elements) {
            const accept = element.accept.bind(element);
            element.accept = (v, c) => {
                visited.push(element.name);
                return accept(v, c);
            };
        }
        visitor.visit(new Map([[NS, elements]]));
        expect(visited).toEqual(['Count', 'E', 'op', 'p', 'q', 'v']);
    });
});
