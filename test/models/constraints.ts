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
@prefix bamm: <urn:bamm:io.openmanufacturing:meta-model:1.0.0#>.
@prefix unit: <urn:bamm:io.openmanufacturing:unit:1.0.0#>.
@prefix bamm-c: <urn:bamm:io.openmanufacturing:characteristic:1.0.0#>.
@prefix bamm-e: <urn:bamm:io.openmanufacturing:entity:1.0.0#>.
@prefix rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>.
@prefix : <urn:bamm:io.openmanufacturing:1.0.0#>.

:AspectDefault a bamm:Aspect;
    bamm:name "AspectDefault";
    bamm:properties (:property1);
    bamm:operations ().
:property1 a bamm:Property;
    bamm:name "property1";
    bamm:characteristic :Property1Trait.
:Property1Trait a bamm-c:Trait;
    bamm:name "Property1Trait";
    bamm-c:baseCharacteristic :Characteristic1;
    bamm-c:constraint :Constraint.
:Characteristic1 a bamm:Characteristic;
    bamm:name "Characteristic1".
:Constraint a bamm:Constraint;
    bamm:name "Constraint";
    bamm:preferredName "constraint"@en;
    bamm:description "Test constraint"@en.
`;

export const encodingConstraint = `
@prefix xsd: <http://www.w3.org/2001/XMLSchema#>.
@prefix bamm: <urn:bamm:io.openmanufacturing:meta-model:1.0.0#>.
@prefix unit: <urn:bamm:io.openmanufacturing:unit:1.0.0#>.
@prefix bamm-c: <urn:bamm:io.openmanufacturing:characteristic:1.0.0#>.
@prefix bamm-e: <urn:bamm:io.openmanufacturing:entity:1.0.0#>.
@prefix rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>.
@prefix : <urn:bamm:io.openmanufacturing:1.0.0#>.

:AspectDefault a bamm:Aspect;
    bamm:name "AspectDefault";
    bamm:properties (:property1);
    bamm:operations ().
:property1 a bamm:Property;
    bamm:name "property1";
    bamm:characteristic :Property1Trait.
:Property1Trait a bamm-c:Trait;
    bamm:name "Property1Trait";
    bamm-c:baseCharacteristic :Characteristic1;
    bamm-c:constraint :EncodingConstraint.
:Characteristic1 a bamm:Characteristic;
    bamm:name "Characteristic1".
:EncodingConstraint a bamm-c:EncodingConstraint;
    bamm:name "EncodingConstraint";
    bamm:preferredName "Encoding constraint"@en;
    bamm:description "Test encoding"@en;
    bamm:value bamm:US-ASCII.
`;

export const fixedPointConstraint = `
@prefix xsd: <http://www.w3.org/2001/XMLSchema#>.
@prefix bamm: <urn:bamm:io.openmanufacturing:meta-model:1.0.0#>.
@prefix unit: <urn:bamm:io.openmanufacturing:unit:1.0.0#>.
@prefix bamm-c: <urn:bamm:io.openmanufacturing:characteristic:1.0.0#>.
@prefix bamm-e: <urn:bamm:io.openmanufacturing:entity:1.0.0#>.
@prefix rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>.
@prefix : <urn:bamm:io.openmanufacturing:1.0.0#>.

:AspectDefault a bamm:Aspect;
    bamm:name "AspectDefault";
    bamm:properties (:property1);
    bamm:operations ().
:property1 a bamm:Property;
    bamm:name "property1";
    bamm:characteristic :Property1Trait.
:Property1Trait a bamm-c:Trait;
    bamm:name "Property1Trait";
    bamm-c:baseCharacteristic :Characteristic1;
    bamm-c:constraint :FixedPointConstraint.
:Characteristic1 a bamm:Characteristic;
    bamm:name "Characteristic1".
:FixedPointConstraint a bamm-c:FixedPointConstraint;
    bamm:name "FixedPointConstraint";
    bamm:preferredName "Fixed point constraint"@en;
    bamm:description "Test fixed point constraint"@en;
    bamm-c:scale "1"^^xsd:positiveInteger;
    bamm-c:integer "2"^^xsd:positiveInteger.
`;

export const languageConstraint = `
@prefix xsd: <http://www.w3.org/2001/XMLSchema#>.
@prefix bamm: <urn:bamm:io.openmanufacturing:meta-model:1.0.0#>.
@prefix unit: <urn:bamm:io.openmanufacturing:unit:1.0.0#>.
@prefix bamm-c: <urn:bamm:io.openmanufacturing:characteristic:1.0.0#>.
@prefix bamm-e: <urn:bamm:io.openmanufacturing:entity:1.0.0#>.
@prefix rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>.
@prefix : <urn:bamm:io.openmanufacturing:1.0.0#>.

:AspectDefault a bamm:Aspect;
    bamm:name "AspectDefault";
    bamm:properties (:property1);
    bamm:operations ().
:property1 a bamm:Property;
    bamm:name "property1";
    bamm:characteristic :Property1Trait.
:Property1Trait a bamm-c:Trait;
    bamm:name "Property1Trait";
    bamm-c:baseCharacteristic :Characteristic1;
    bamm-c:constraint :LanguageConstraint.
:Characteristic1 a bamm:Characteristic;
    bamm:name "Characteristic1".
:LanguageConstraint a bamm-c:LanguageConstraint;
    bamm:name "LanguageConstraint";
    bamm:preferredName "Language constraint"@en;
    bamm:description "Test language constraint"@en;
    bamm-c:languageCode "it".
`;

export const lengthConstraint = `
@prefix xsd: <http://www.w3.org/2001/XMLSchema#>.
@prefix bamm: <urn:bamm:io.openmanufacturing:meta-model:1.0.0#>.
@prefix unit: <urn:bamm:io.openmanufacturing:unit:1.0.0#>.
@prefix bamm-c: <urn:bamm:io.openmanufacturing:characteristic:1.0.0#>.
@prefix bamm-e: <urn:bamm:io.openmanufacturing:entity:1.0.0#>.
@prefix rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>.
@prefix : <urn:bamm:io.openmanufacturing:1.0.0#>.

:AspectDefault a bamm:Aspect;
    bamm:name "AspectDefault";
    bamm:properties (:property1);
    bamm:operations ().
:property1 a bamm:Property;
    bamm:name "property1";
    bamm:characteristic :Property1Trait.
:Property1Trait a bamm-c:Trait;
    bamm:name "Property1Trait";
    bamm-c:baseCharacteristic :Characteristic1;
    bamm-c:constraint :LengthConstraint.
:Characteristic1 a bamm:Characteristic;
    bamm:name "Characteristic1".
:LengthConstraint a bamm-c:LengthConstraint;
    bamm:name "LengthConstraint";
    bamm:preferredName "Length constraint"@en;
    bamm:description "Test length constraint"@en;
    bamm-c:maxValue "2"^^xsd:nonNegativeInteger;
    bamm-c:minValue "1"^^xsd:nonNegativeInteger.
`;

export const localeConstraint = `
@prefix xsd: <http://www.w3.org/2001/XMLSchema#>.
@prefix bamm: <urn:bamm:io.openmanufacturing:meta-model:1.0.0#>.
@prefix unit: <urn:bamm:io.openmanufacturing:unit:1.0.0#>.
@prefix bamm-c: <urn:bamm:io.openmanufacturing:characteristic:1.0.0#>.
@prefix bamm-e: <urn:bamm:io.openmanufacturing:entity:1.0.0#>.
@prefix rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>.
@prefix : <urn:bamm:io.openmanufacturing:1.0.0#>.

:AspectDefault a bamm:Aspect;
    bamm:name "AspectDefault";
    bamm:properties (:property1);
    bamm:operations ().
:property1 a bamm:Property;
    bamm:name "property1";
    bamm:characteristic :Property1Trait.
:Property1Trait a bamm-c:Trait;
    bamm:name "Property1Trait";
    bamm-c:baseCharacteristic :Characteristic1;
    bamm-c:constraint :LocaleConstraint.
:Characteristic1 a bamm:Characteristic;
    bamm:name "Characteristic1".
:LocaleConstraint a bamm-c:LocaleConstraint;
    bamm:name "LocaleConstraint";
    bamm:preferredName "Locale constraint"@en;
    bamm:description "Test locale constraint"@en;
    bamm-c:localeCode "it-IT".
`;

export const rangeConstraint = `
@prefix xsd: <http://www.w3.org/2001/XMLSchema#>.
@prefix bamm: <urn:bamm:io.openmanufacturing:meta-model:1.0.0#>.
@prefix unit: <urn:bamm:io.openmanufacturing:unit:1.0.0#>.
@prefix bamm-c: <urn:bamm:io.openmanufacturing:characteristic:1.0.0#>.
@prefix bamm-e: <urn:bamm:io.openmanufacturing:entity:1.0.0#>.
@prefix rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>.
@prefix : <urn:bamm:io.openmanufacturing:1.0.0#>.

:AspectDefault a bamm:Aspect;
    bamm:name "AspectDefault";
    bamm:properties (:property1);
    bamm:operations ().
:property1 a bamm:Property;
    bamm:name "property1";
    bamm:characteristic :Property1Trait.
:Property1Trait a bamm-c:Trait;
    bamm:name "Property1Trait";
    bamm-c:baseCharacteristic :Characteristic1;
    bamm-c:constraint :RangeConstraint.
:Characteristic1 a bamm:Characteristic;
    bamm:name "Characteristic1".
:RangeConstraint a bamm-c:RangeConstraint;
    bamm:name "RangeConstraint";
    bamm:preferredName "Rangeconstraint"@en;
    bamm:description "Test range constraint"@en;
    bamm-c:maxValue "6";
    bamm-c:minValue "4";
    bamm-c:lowerBoundDefinition bamm-c:GREATER_THAN;
    bamm-c:upperBoundDefinition bamm-c:AT_MOST.
`;

export const regularExpressionConstraint = `
@prefix xsd: <http://www.w3.org/2001/XMLSchema#>.
@prefix bamm: <urn:bamm:io.openmanufacturing:meta-model:1.0.0#>.
@prefix unit: <urn:bamm:io.openmanufacturing:unit:1.0.0#>.
@prefix bamm-c: <urn:bamm:io.openmanufacturing:characteristic:1.0.0#>.
@prefix bamm-e: <urn:bamm:io.openmanufacturing:entity:1.0.0#>.
@prefix rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>.
@prefix : <urn:bamm:io.openmanufacturing:1.0.0#>.

:AspectDefault a bamm:Aspect;
    bamm:name "AspectDefault";
    bamm:properties (:property1);
    bamm:operations ().
:property1 a bamm:Property;
    bamm:name "property1";
    bamm:characteristic :Property1Trait.
:Property1Trait a bamm-c:Trait;
    bamm:name "Property1Trait";
    bamm-c:baseCharacteristic :Characteristic1;
    bamm-c:constraint :RegularExpressionConstraint.
:Characteristic1 a bamm:Characteristic;
    bamm:name "Characteristic1".
:RegularExpressionConstraint a bamm-c:RegularExpressionConstraint;
    bamm:name "RegularExpressionConstraint";
    bamm:preferredName "Regular expression constraint"@en;
    bamm:description "Test regular expression constraint"@en;
    bamm:value "([A-Z])\\\\w+".
`;
