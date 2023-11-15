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

export const characteristicClassString = `
@prefix xsd: <http://www.w3.org/2001/XMLSchema#>.
@prefix samm: <urn:samm:org.eclipse.esmf.samm:meta-model:2.1.0#>.
@prefix unit: <urn:samm:org.eclipse.esmf.samm:unit:2.1.0#>.
@prefix samm-c: <urn:samm:org.eclipse.esmf.samm:characteristic:2.1.0#>.
@prefix samm-e: <urn:samm:org.eclipse.esmf.samm:entity:2.1.0#>.
@prefix rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>.
@prefix : <urn:samm:org.eclipse.esmf.test:1.0.0#>.

:AspectDefault a samm:Aspect;
    samm:name "AspectDefault";
    samm:properties (:property1);
    samm:operations ().
:property1 a samm:Property;
    samm:name "property1";
    samm:characteristic :CharacteristicTest.
:CharacteristicTest a samm:Characteristic;
    samm:name "CharacteristicTest";
    samm:dataType xsd:string;
    samm:preferredName "PreferredName"@en;
    samm:description "This is a test description!"@en;
    samm:see <https%3A%2F%2Ftestcharacteristic.com>.
`;

export const collectionCharacteristicClassString = `
@prefix xsd: <http://www.w3.org/2001/XMLSchema#>.
@prefix samm: <urn:samm:org.eclipse.esmf.samm:meta-model:2.1.0#>.
@prefix unit: <urn:samm:org.eclipse.esmf.samm:unit:2.1.0#>.
@prefix samm-c: <urn:samm:org.eclipse.esmf.samm:characteristic:2.1.0#>.
@prefix samm-e: <urn:samm:org.eclipse.esmf.samm:entity:2.1.0#>.
@prefix rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>.
@prefix : <urn:samm:org.eclipse.esmf.test:1.0.0#>.

:AspectDefault a samm:Aspect;
    samm:name "AspectDefault";
    samm:properties (:property1);
    samm:operations ().
:property1 a samm:Property;
    samm:name "property1";
    samm:characteristic :CharacteristicTest.
:Characteristic1 a samm:Characteristic;
    samm:name "Characteristic1";
    samm:dataType xsd:string;
    samm:description "This is an element Characteristic!"@en.
:CharacteristicTest a samm-c:Collection;
    samm:name "CharacteristicTest";
    samm:preferredName "PreferredName"@en;
    samm:description "This is a test description!"@en;
    samm:see <https%3A%2F%2Ftestcharacteristic.com>;
    samm-c:elementCharacteristic :Characteristic1.
`;

export const enumerationCharacteristicClassEntity = `
@prefix xsd: <http://www.w3.org/2001/XMLSchema#>.
@prefix samm: <urn:samm:org.eclipse.esmf.samm:meta-model:2.1.0#>.
@prefix unit: <urn:samm:org.eclipse.esmf.samm:unit:2.1.0#>.
@prefix samm-c: <urn:samm:org.eclipse.esmf.samm:characteristic:2.1.0#>.
@prefix samm-e: <urn:samm:org.eclipse.esmf.samm:entity:2.1.0#>.
@prefix rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>.
@prefix : <urn:samm:org.eclipse.esmf.test:1.0.0#>.

:AspectDefault a samm:Aspect;
    samm:name "AspectDefault";
    samm:properties (:resultState :resultStateNoDesc);
    samm:operations ().
:resultState a samm:Property ;
    samm:name           "resultState" ;
    samm:preferredName  "Last Recent Result State"@en ;
    samm:description    "Result state of a part defines if the manufacturing is ok or nok in the current process"@en ;
    samm:characteristic :ResultState .
:ResultState a samm-c:Enumeration ;
    samm:name          "ResultState" ;
    samm:preferredName "Result State"@en ;
    samm:description   "Result state of a processed part from production"@en ;
    samm:dataType      :ResultEntity ;
    samm-c:values      ( :OKState
                         :NOKState ) .
:ResultEntity a samm:Entity ;
    samm:name          "ResultEntity" ;
    samm:preferredName "Result Entity"@en ;
    samm:description   "Entity that describes a result state from production of a processed part."@en ;
    samm:properties    ( :resultStateAttributeValue
                         [ samm:property     :resultStateAttributeDescription ;
                           samm:notInPayload "true"^^xsd:boolean ] ) .
:resultStateAttributeValue a samm:Property ;
    samm:name           "resultStateAttributeValue" ;
    samm:preferredName  "Result State Attribute Value"@en ;
    samm:description    "The value representing a specific result state."@en ;
    samm:characteristic [ a             samm-c:Code ;
                          samm:name     "ResultStateCode" ;
                          samm:dataType xsd:string ] .
    
:OKState a :ResultEntity ;
    :resultStateAttributeValue       "ok"^^xsd:string ;
    :resultStateAttributeDescription "Result state OK"@en, "Result Status OK"@de .
:NOKState a :ResultEntity ;
    :resultStateAttributeValue       "nok"^^xsd:string ;
    :resultStateAttributeDescription "Result state not OK"@en, "Result Status nicht OK"@de .

:resultStateNoDesc a samm:Property ;
    samm:name           "resultStateNoDesc" ;
    samm:preferredName  "Last Recent Result State"@en ;
    samm:description    "Result state of a part defines if the manufacturing is ok or nok in the current process"@en ;
    samm:characteristic :ResultStateNoDesc .
:ResultStateNoDesc a samm-c:Enumeration ;
    samm:name          "ResultStateNoDesc" ;
    samm:preferredName "Result State"@en ;
    samm:description   "Result state of a processed part from production"@en ;
    samm:dataType      :ResultEntityNoDesc ;
    samm-c:values      ( :OKStateNoDesc ) .
:ResultEntityNoDesc a samm:Entity ;
    samm:name          "ResultEntityNoDesc" ;
    samm:preferredName "Result Entity"@en ;
    samm:description   "Entity that describes a result state from production of a processed part."@en ;
    samm:properties    ( :resultStateAttributeValue ) .
:OKStateNoDesc a :ResultEntity ;
    :resultStateAttributeValue       "ok"^^xsd:string .
`;

export const eitherCharacteristicClass = `
@prefix xsd: <http://www.w3.org/2001/XMLSchema#>.
@prefix samm: <urn:samm:org.eclipse.esmf.samm:meta-model:2.1.0#>.
@prefix unit: <urn:samm:org.eclipse.esmf.samm:unit:2.1.0#>.
@prefix samm-c: <urn:samm:org.eclipse.esmf.samm:characteristic:2.1.0#>.
@prefix samm-e: <urn:samm:org.eclipse.esmf.samm:entity:2.1.0#>.
@prefix rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>.
@prefix : <urn:samm:org.eclipse.esmf.test:1.0.0#>.

:AspectDefault a samm:Aspect;
    samm:name "AspectDefault";
    samm:properties ( :property1 :property2 );
    samm:operations ().

:property1
   a samm:Property ;
   samm:name "property1" ;
   samm:characteristic [ a samm-c:Either ;
                         samm:name "EitherCharacteristic1" ;
                         samm-c:left [ a samm-c:Language ;
                                       samm:name "TextCharacteristicLeft1"];
                         samm-c:right [ a samm-c:List ;
                                      samm:name "ListCharacteristicRight1" ;
                                      samm:dataType xsd:float]
                       ] .

:property2
   a samm:Property ;
   samm:name "property2" ;
   samm:characteristic [ a samm-c:Either ;
                         samm:name "EitherCharacteristic2" ;
                         samm-c:left [ a samm-c:SingleEntity ;
                                     samm:name "EntityCharacteristicLeft2" ;
                                     samm:dataType :SpatialPosition] ;
                         samm-c:right [ a samm-c:List ;
                                      samm:name "ListCharacteristicRight2" ;
                                      samm:dataType xsd:string]
                       ] .


:SpatialPosition a samm:Entity ;
   samm:name "SpatialPosition" ;
   samm:properties ( :x :y ) .
   
:x a samm:Property ;
   samm:name "x" ;
   samm:characteristic :Coordinate .
   
:y a samm:Property ;
   samm:name "y" ;
   samm:characteristic :Coordinate .
   
:Coordinate a samm-c:Measurement ;
   samm:name "Coordinate" ;
   samm:preferredName "Coordinate"@en ;
   samm:description "Represents a coordinate along an axis in space."@en ;
   samm:dataType xsd:float ;
   samm-c:unit unit:metre .
      
`;

export const characteristicDifferentNamespace = `
@prefix xsd: <http://www.w3.org/2001/XMLSchema#>.
@prefix samm: <urn:samm:org.eclipse.esmf.samm:meta-model:2.1.0#>.
@prefix unit: <urn:samm:org.eclipse.esmf.samm:unit:2.1.0#>.
@prefix samm-c: <urn:samm:org.eclipse.esmf.samm:characteristic:1.0.0#>.
@prefix samm-e: <urn:samm:org.eclipse.esmf.samm:entity:1.0.0#>.
@prefix rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>.
@prefix : <urn:samm:org.eclipse.esmf.test-with-different-ns:1.0.0#>.

:AspectDefault a samm:Aspect;
    samm:name "AspectDefault";
    samm:properties (:property1);
    samm:operations ().
:property1 a samm:Property;
    samm:name "property1";
    samm:characteristic :CharacteristicTest.
:CharacteristicTest a samm:Characteristic;
    samm:name "CharacteristicTest";
    samm:dataType xsd:string;
    samm:preferredName "PreferredName"@en;
    samm:description "This is a test description!"@en;
    samm:see <https%3A%2F%2Ftestcharacteristic.com>.
`;
