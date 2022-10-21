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
@prefix bamm: <urn:bamm:io.openmanufacturing:meta-model:1.0.0#>.
@prefix unit: <urn:bamm:io.openmanufacturing:unit:1.0.0#>.
@prefix bamm-c: <urn:bamm:io.openmanufacturing:characteristic:1.0.0#>.
@prefix bamm-e: <urn:bamm:io.openmanufacturing:entity:1.0.0#>.
@prefix rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>.
@prefix : <urn:bamm:io.openmanufacturing:1.0.0#>.

:AspectDefault a bamm:Aspect;
    bamm:name "AspectDefault";
    bamm:properties ( :property1 :hardwareIndex );
    bamm:operations ().
:property1 a bamm:Property;
    bamm:name "property1";
    bamm:characteristic :Property1Trait.
:Characteristic1 a bamm:Characteristic;
    bamm:name "Characteristic1";
    bamm:dataType xsd:string.
:Property1Trait a bamm-c:Trait;
    bamm:name "Property1Trait";
    bamm-c:baseCharacteristic :Characteristic1;
    bamm-c:constraint :Constraint1, :Constraint2.
:Constraint1 a bamm:Constraint;
    bamm:name "Constraint1".
:Constraint2 a bamm:Constraint;
    bamm:name "Constraint2".
:hardwareIndex a bamm:Property ;
   bamm:name "hardwareIndex" ;
   bamm:preferredName "Hardware Index"@de ;
   bamm:preferredName "Hardware Index"@en ;
   bamm:description "Change index der Hardware"@de ;
   bamm:description "Change index of the Hardware"@en ;
   bamm:characteristic :EquipmentIndexCharacteristic .
:EquipmentIndexCharacteristic a bamm-c:Trait ;
     bamm:name "EquipmentIndexCharacteristic" ;
     bamm-c:baseCharacteristic bamm-c:Text ;
     bamm-c:constraint [
       a bamm-c:LengthConstraint ;
       bamm-c:maxValue "3"^^xsd:nonNegativeInteger ;
     ] .
`;
