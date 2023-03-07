/*
 * Copyright (c) 2022 Robert Bosch Manufacturing Solutions GmbH
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

export const constraint = `
@prefix xsd: <http://www.w3.org/2001/XMLSchema#>.
@prefix samm: <urn:samm:org.eclipse.esmf.samm:meta-model:1.0.0#>.
@prefix unit: <urn:samm:org.eclipse.esmf.samm:unit:1.0.0#>.
@prefix samm-c: <urn:samm:org.eclipse.esmf.samm:characteristic:1.0.0#>.
@prefix samm-e: <urn:samm:org.eclipse.esmf.samm:entity:1.0.0#>.
@prefix rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>.
@prefix : <urn:samm:org.eclipse.esmf.samm:1.0.0#>.

:AspectDefault a samm:Aspect;
    samm:name "AspectDefault";
    samm:properties (:property1);
    samm:operations ().
:property1 a samm:Property;
    samm:name "property1";
    samm:characteristic :Property1Trait.
:Property1Trait a samm-c:Trait;
    samm:name "Property1Trait";
    samm-c:baseCharacteristic :Characteristic1;
    samm-c:constraint :Constraint.
:Characteristic1 a samm:Characteristic;
    samm:name "Characteristic1".
:Constraint a samm:Constraint;
    samm:name "Constraint";
    samm:preferredName "constraint"@en;
    samm:description "Test constraint"@en.
`;

export const encodingConstraint = `
@prefix xsd: <http://www.w3.org/2001/XMLSchema#>.
@prefix samm: <urn:samm:org.eclipse.esmf.samm:meta-model:1.0.0#>.
@prefix unit: <urn:samm:org.eclipse.esmf.samm:unit:1.0.0#>.
@prefix samm-c: <urn:samm:org.eclipse.esmf.samm:characteristic:1.0.0#>.
@prefix samm-e: <urn:samm:org.eclipse.esmf.samm:entity:1.0.0#>.
@prefix rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>.
@prefix : <urn:samm:org.eclipse.esmf.samm:1.0.0#>.

:AspectDefault a samm:Aspect;
    samm:name "AspectDefault";
    samm:properties (:property1);
    samm:operations ().
:property1 a samm:Property;
    samm:name "property1";
    samm:characteristic :Property1Trait.
:Property1Trait a samm-c:Trait;
    samm:name "Property1Trait";
    samm-c:baseCharacteristic :Characteristic1;
    samm-c:constraint :EncodingConstraint.
:Characteristic1 a samm:Characteristic;
    samm:name "Characteristic1".
:EncodingConstraint a samm-c:EncodingConstraint;
    samm:name "EncodingConstraint";
    samm:preferredName "Encoding constraint"@en;
    samm:description "Test encoding"@en;
    samm:value samm:US-ASCII.
`;

export const fixedPointConstraint = `
@prefix xsd: <http://www.w3.org/2001/XMLSchema#>.
@prefix samm: <urn:samm:org.eclipse.esmf.samm:meta-model:1.0.0#>.
@prefix unit: <urn:samm:org.eclipse.esmf.samm:unit:1.0.0#>.
@prefix samm-c: <urn:samm:org.eclipse.esmf.samm:characteristic:1.0.0#>.
@prefix samm-e: <urn:samm:org.eclipse.esmf.samm:entity:1.0.0#>.
@prefix rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>.
@prefix : <urn:samm:org.eclipse.esmf.samm:1.0.0#>.

:AspectDefault a samm:Aspect;
    samm:name "AspectDefault";
    samm:properties (:property1);
    samm:operations ().
:property1 a samm:Property;
    samm:name "property1";
    samm:characteristic :Property1Trait.
:Property1Trait a samm-c:Trait;
    samm:name "Property1Trait";
    samm-c:baseCharacteristic :Characteristic1;
    samm-c:constraint :FixedPointConstraint.
:Characteristic1 a samm:Characteristic;
    samm:name "Characteristic1".
:FixedPointConstraint a samm-c:FixedPointConstraint;
    samm:name "FixedPointConstraint";
    samm:preferredName "Fixed point constraint"@en;
    samm:description "Test fixed point constraint"@en;
    samm-c:scale "1"^^xsd:positiveInteger;
    samm-c:integer "2"^^xsd:positiveInteger.
`;

export const languageConstraint = `
@prefix xsd: <http://www.w3.org/2001/XMLSchema#>.
@prefix samm: <urn:samm:org.eclipse.esmf.samm:meta-model:1.0.0#>.
@prefix unit: <urn:samm:org.eclipse.esmf.samm:unit:1.0.0#>.
@prefix samm-c: <urn:samm:org.eclipse.esmf.samm:characteristic:1.0.0#>.
@prefix samm-e: <urn:samm:org.eclipse.esmf.samm:entity:1.0.0#>.
@prefix rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>.
@prefix : <urn:samm:org.eclipse.esmf.samm:1.0.0#>.

:AspectDefault a samm:Aspect;
    samm:name "AspectDefault";
    samm:properties (:property1);
    samm:operations ().
:property1 a samm:Property;
    samm:name "property1";
    samm:characteristic :Property1Trait.
:Property1Trait a samm-c:Trait;
    samm:name "Property1Trait";
    samm-c:baseCharacteristic :Characteristic1;
    samm-c:constraint :LanguageConstraint.
:Characteristic1 a samm:Characteristic;
    samm:name "Characteristic1".
:LanguageConstraint a samm-c:LanguageConstraint;
    samm:name "LanguageConstraint";
    samm:preferredName "Language constraint"@en;
    samm:description "Test language constraint"@en;
    samm-c:languageCode "it".
`;

export const lengthConstraint = `
@prefix xsd: <http://www.w3.org/2001/XMLSchema#>.
@prefix samm: <urn:samm:org.eclipse.esmf.samm:meta-model:1.0.0#>.
@prefix unit: <urn:samm:org.eclipse.esmf.samm:unit:1.0.0#>.
@prefix samm-c: <urn:samm:org.eclipse.esmf.samm:characteristic:1.0.0#>.
@prefix samm-e: <urn:samm:org.eclipse.esmf.samm:entity:1.0.0#>.
@prefix rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>.
@prefix : <urn:samm:org.eclipse.esmf.samm:1.0.0#>.

:AspectDefault a samm:Aspect;
    samm:name "AspectDefault";
    samm:properties (:property1);
    samm:operations ().
:property1 a samm:Property;
    samm:name "property1";
    samm:characteristic :Property1Trait.
:Property1Trait a samm-c:Trait;
    samm:name "Property1Trait";
    samm-c:baseCharacteristic :Characteristic1;
    samm-c:constraint :LengthConstraint.
:Characteristic1 a samm:Characteristic;
    samm:name "Characteristic1".
:LengthConstraint a samm-c:LengthConstraint;
    samm:name "LengthConstraint";
    samm:preferredName "Length constraint"@en;
    samm:description "Test length constraint"@en;
    samm-c:maxValue "2"^^xsd:nonNegativeInteger;
    samm-c:minValue "1"^^xsd:nonNegativeInteger.
`;

export const localeConstraint = `
@prefix xsd: <http://www.w3.org/2001/XMLSchema#>.
@prefix samm: <urn:samm:org.eclipse.esmf.samm:meta-model:1.0.0#>.
@prefix unit: <urn:samm:org.eclipse.esmf.samm:unit:1.0.0#>.
@prefix samm-c: <urn:samm:org.eclipse.esmf.samm:characteristic:1.0.0#>.
@prefix samm-e: <urn:samm:org.eclipse.esmf.samm:entity:1.0.0#>.
@prefix rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>.
@prefix : <urn:samm:org.eclipse.esmf.samm:1.0.0#>.

:AspectDefault a samm:Aspect;
    samm:name "AspectDefault";
    samm:properties (:property1);
    samm:operations ().
:property1 a samm:Property;
    samm:name "property1";
    samm:characteristic :Property1Trait.
:Property1Trait a samm-c:Trait;
    samm:name "Property1Trait";
    samm-c:baseCharacteristic :Characteristic1;
    samm-c:constraint :LocaleConstraint.
:Characteristic1 a samm:Characteristic;
    samm:name "Characteristic1".
:LocaleConstraint a samm-c:LocaleConstraint;
    samm:name "LocaleConstraint";
    samm:preferredName "Locale constraint"@en;
    samm:description "Test locale constraint"@en;
    samm-c:localeCode "it-IT".
`;

export const rangeConstraint = `
@prefix xsd: <http://www.w3.org/2001/XMLSchema#>.
@prefix samm: <urn:samm:org.eclipse.esmf.samm:meta-model:1.0.0#>.
@prefix unit: <urn:samm:org.eclipse.esmf.samm:unit:1.0.0#>.
@prefix samm-c: <urn:samm:org.eclipse.esmf.samm:characteristic:1.0.0#>.
@prefix samm-e: <urn:samm:org.eclipse.esmf.samm:entity:1.0.0#>.
@prefix rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>.
@prefix : <urn:samm:org.eclipse.esmf.samm:1.0.0#>.

:AspectDefault a samm:Aspect;
    samm:name "AspectDefault";
    samm:properties (:property1);
    samm:operations ().
:property1 a samm:Property;
    samm:name "property1";
    samm:characteristic :Property1Trait.
:Property1Trait a samm-c:Trait;
    samm:name "Property1Trait";
    samm-c:baseCharacteristic :Characteristic1;
    samm-c:constraint :RangeConstraint.
:Characteristic1 a samm:Characteristic;
    samm:name "Characteristic1".
:RangeConstraint a samm-c:RangeConstraint;
    samm:name "RangeConstraint";
    samm:preferredName "Rangeconstraint"@en;
    samm:description "Test range constraint"@en;
    samm-c:maxValue "6";
    samm-c:minValue "4";
    samm-c:lowerBoundDefinition samm-c:GREATER_THAN;
    samm-c:upperBoundDefinition samm-c:AT_MOST.
`;

export const regularExpressionConstraint = `
@prefix xsd: <http://www.w3.org/2001/XMLSchema#>.
@prefix samm: <urn:samm:org.eclipse.esmf.samm:meta-model:1.0.0#>.
@prefix unit: <urn:samm:org.eclipse.esmf.samm:unit:1.0.0#>.
@prefix samm-c: <urn:samm:org.eclipse.esmf.samm:characteristic:1.0.0#>.
@prefix samm-e: <urn:samm:org.eclipse.esmf.samm:entity:1.0.0#>.
@prefix rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>.
@prefix : <urn:samm:org.eclipse.esmf.samm:1.0.0#>.

:AspectDefault a samm:Aspect;
    samm:name "AspectDefault";
    samm:properties (:property1);
    samm:operations ().
:property1 a samm:Property;
    samm:name "property1";
    samm:characteristic :Property1Trait.
:Property1Trait a samm-c:Trait;
    samm:name "Property1Trait";
    samm-c:baseCharacteristic :Characteristic1;
    samm-c:constraint :RegularExpressionConstraint.
:Characteristic1 a samm:Characteristic;
    samm:name "Characteristic1".
:RegularExpressionConstraint a samm-c:RegularExpressionConstraint;
    samm:name "RegularExpressionConstraint";
    samm:preferredName "Regular expression constraint"@en;
    samm:description "Test regular expression constraint"@en;
    samm:value "([A-Z])\\\\w+".
`;
