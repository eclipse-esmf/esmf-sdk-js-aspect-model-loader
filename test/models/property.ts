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

export const property = `
@prefix xsd: <http://www.w3.org/2001/XMLSchema#>.
@prefix samm: <urn:samm:org.eclipse.esmf.samm:meta-model:1.0.0#>.
@prefix unit: <urn:samm:org.eclipse.esmf.samm:unit:1.0.0#>.
@prefix samm-c: <urn:samm:org.eclipse.esmf.samm:characteristic:1.0.0#>.
@prefix samm-e: <urn:samm:org.eclipse.esmf.samm:entity:1.0.0#>.
@prefix rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>.
@prefix : <urn:samm:org.eclipse.esmf.test:1.0.0#>.

:AspectDefault a samm:Aspect;
    samm:name "AspectDefault";
    samm:properties ([
        samm:property :optionalProperty;
        samm:optional "true"^^xsd:boolean
    ] );
    samm:operations ().
:Property1Trait a samm-c:Trait;
    samm:name "Property1Trait";
    samm-c:baseCharacteristic :Characteristic1;
    samm-c:constraint :Constraint1, :Constraint2.
:Characteristic1 a samm:Characteristic;
    samm:name "Characteristic1";
    samm:dataType :Entity1.
:Constraint1 a samm-c:LanguageConstraint;
    samm:name "Constraint1";
    samm-c:languageCode "ro".
:Constraint2 a samm:Constraint;
    samm:name "Constraint2".
:Constraint3 a samm:Constraint;
    samm:name "Constraint3".
:Entity1 a samm:Entity;
    samm:name "Entity1";
    samm:properties ( :notOptionalProperty :numberListProperty ).
:Property2Trait a samm-c:Trait;
    samm:name "Property2Trait";
    samm-c:baseCharacteristic :EnumerationCharacteristic;
    samm-c:constraint :Constraint3.
:optionalProperty a samm:Property;
    samm:name "optionalProperty";
    samm:characteristic :Property1Trait;
    samm:preferredName "optional property"@en;
    samm:description "this property is optional"@en.
:numberListProperty a samm:Property;
    samm:name "numberListProperty";
    samm:characteristic :EnumerationNumbersCharacteristic;
    samm:preferredName "List number property"@en;
    samm:description "List number property"@en.
:notOptionalProperty a samm:Property;
    samm:name "notOptionalProperty";
    samm:characteristic :Property2Trait;
    samm:preferredName "not optional property"@en;
    samm:description "This property is not optional"@en.
:EnumerationCharacteristic a samm-c:Enumeration;
    samm:name "EnumerationCharacteristic";
    samm:dataType xsd:string;
    samm:preferredName "enumeration characteristic"@en;
    samm-c:values ("a" "g" "t").
:EnumerationNumbersCharacteristic a samm-c:Enumeration;
    samm:name "EnumerationNumbersCharacteristic";
    samm:dataType xsd:nonNegativeInteger;
    samm:preferredName "enumeration characteristic"@en;
    samm-c:values ("1" "3" "45").
`;
