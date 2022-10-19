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

export const property = `
@prefix xsd: <http://www.w3.org/2001/XMLSchema#>.
@prefix bamm: <urn:bamm:io.openmanufacturing:meta-model:1.0.0#>.
@prefix unit: <urn:bamm:io.openmanufacturing:unit:1.0.0#>.
@prefix bamm-c: <urn:bamm:io.openmanufacturing:characteristic:1.0.0#>.
@prefix bamm-e: <urn:bamm:io.openmanufacturing:entity:1.0.0#>.
@prefix rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>.
@prefix : <urn:bamm:io.openmanufacturing:1.0.0#>.

:AspectDefault a bamm:Aspect;
    bamm:name "AspectDefault";
    bamm:properties ([
        bamm:property :optionalProperty;
        bamm:optional "true"^^xsd:boolean
    ] );
    bamm:operations ().
:Property1Trait a bamm-c:Trait;
    bamm:name "Property1Trait";
    bamm-c:baseCharacteristic :Characteristic1;
    bamm-c:constraint :Constraint1, :Constraint2.
:Characteristic1 a bamm:Characteristic;
    bamm:name "Characteristic1";
    bamm:dataType :Entity1.
:Constraint1 a bamm-c:LanguageConstraint;
    bamm:name "Constraint1";
    bamm-c:languageCode "ro".
:Constraint2 a bamm:Constraint;
    bamm:name "Constraint2".
:Constraint3 a bamm:Constraint;
    bamm:name "Constraint3".
:Entity1 a bamm:Entity;
    bamm:name "Entity1";
    bamm:properties ( :notOptionalProperty :numberListProperty ).
:Property2Trait a bamm-c:Trait;
    bamm:name "Property2Trait";
    bamm-c:baseCharacteristic :EnumerationCharacteristic;
    bamm-c:constraint :Constraint3.
:optionalProperty a bamm:Property;
    bamm:name "optionalProperty";
    bamm:characteristic :Property1Trait;
    bamm:preferredName "optional property"@en;
    bamm:description "this property is optional"@en.
:numberListProperty a bamm:Property;
    bamm:name "numberListProperty";
    bamm:characteristic :EnumerationNumbersCharacteristic;
    bamm:preferredName "List number property"@en;
    bamm:description "List number property"@en.
:notOptionalProperty a bamm:Property;
    bamm:name "notOptionalProperty";
    bamm:characteristic :Property2Trait;
    bamm:preferredName "not optional property"@en;
    bamm:description "This property is not optional"@en.
:EnumerationCharacteristic a bamm-c:Enumeration;
    bamm:name "EnumerationCharacteristic";
    bamm:dataType xsd:string;
    bamm:preferredName "enumeration characteristic"@en;
    bamm-c:values ("a" "g" "t").
:EnumerationNumbersCharacteristic a bamm-c:Enumeration;
    bamm:name "EnumerationNumbersCharacteristic";
    bamm:dataType xsd:nonNegativeInteger;
    bamm:preferredName "enumeration characteristic"@en;
    bamm-c:values ("1" "3" "45").
`;
