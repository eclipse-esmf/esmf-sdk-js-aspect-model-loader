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

export const traitAspectModel = `@prefix xsd: <http://www.w3.org/2001/XMLSchema#>.
@prefix samm: <urn:samm:org.eclipse.esmf.samm:meta-model:1.0.0#>.
@prefix unit: <urn:samm:org.eclipse.esmf.samm:unit:1.0.0#>.
@prefix samm-c: <urn:samm:org.eclipse.esmf.samm:characteristic:1.0.0#>.
@prefix samm-e: <urn:samm:org.eclipse.esmf.samm:entity:1.0.0#>.
@prefix rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>.
@prefix : <urn:samm:org.eclipse.esmf.samm:1.0.0#>.

:AspectDefault a samm:Aspect;
    samm:name "AspectDefault";
    samm:properties ( :property1 :hardwareIndex );
    samm:operations ().
:property1 a samm:Property;
    samm:name "property1";
    samm:characteristic :Property1Trait.
:Characteristic1 a samm:Characteristic;
    samm:name "Characteristic1";
    samm:dataType xsd:string.
:Property1Trait a samm-c:Trait;
    samm:name "Property1Trait";
    samm-c:baseCharacteristic :Characteristic1;
    samm-c:constraint :Constraint1, :Constraint2.
:Constraint1 a samm:Constraint;
    samm:name "Constraint1".
:Constraint2 a samm:Constraint;
    samm:name "Constraint2".
:hardwareIndex a samm:Property ;
   samm:name "hardwareIndex" ;
   samm:preferredName "Hardware Index"@de ;
   samm:preferredName "Hardware Index"@en ;
   samm:description "Change index der Hardware"@de ;
   samm:description "Change index of the Hardware"@en ;
   samm:characteristic :EquipmentIndexCharacteristic .
:EquipmentIndexCharacteristic a samm-c:Trait ;
     samm:name "EquipmentIndexCharacteristic" ;
     samm-c:baseCharacteristic samm-c:Text ;
     samm-c:constraint [
       a samm-c:LengthConstraint ;
       samm-c:maxValue "3"^^xsd:nonNegativeInteger ;
     ] .
`;
