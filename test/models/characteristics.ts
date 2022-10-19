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

export const characteristicClassString = `
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
    bamm:characteristic :CharacteristicTest.
:CharacteristicTest a bamm:Characteristic;
    bamm:name "CharacteristicTest";
    bamm:dataType xsd:string;
    bamm:preferredName "PreferredName"@en;
    bamm:description "This is a test description!"@en;
    bamm:see <https%3A%2F%2Ftestcharacteristic.com>.

`;

export const collectionCharacteristicClassString = `
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
    bamm:characteristic :CharacteristicTest.
:Characteristic1 a bamm:Characteristic;
    bamm:name "Characteristic1";
    bamm:dataType xsd:string;
    bamm:description "This is an element Characteristic!"@en.
:CharacteristicTest a bamm-c:Collection;
    bamm:name "CharacteristicTest";
    bamm:preferredName "PreferredName"@en;
    bamm:description "This is a test description!"@en;
    bamm:see <https%3A%2F%2Ftestcharacteristic.com>;
    bamm-c:elementCharacteristic :Characteristic1.
`;

export const enumerationCharacteristicClassEntity = `
@prefix xsd: <http://www.w3.org/2001/XMLSchema#>.
@prefix bamm: <urn:bamm:io.openmanufacturing:meta-model:1.0.0#>.
@prefix unit: <urn:bamm:io.openmanufacturing:unit:1.0.0#>.
@prefix bamm-c: <urn:bamm:io.openmanufacturing:characteristic:1.0.0#>.
@prefix bamm-e: <urn:bamm:io.openmanufacturing:entity:1.0.0#>.
@prefix rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>.
@prefix : <urn:bamm:io.openmanufacturing:1.0.0#>.

:AspectDefault a bamm:Aspect;
    bamm:name "AspectDefault";
    bamm:properties (:resultState :resultStateNoDesc);
    bamm:operations ().
:resultState a bamm:Property ;
    bamm:name           "resultState" ;
    bamm:preferredName  "Last Recent Result State"@en ;
    bamm:description    "Result state of a part defines if the manufacturing is ok or nok in the current process"@en ;
    bamm:characteristic :ResultState .
:ResultState a bamm-c:Enumeration ;
    bamm:name          "ResultState" ;
    bamm:preferredName "Result State"@en ;
    bamm:description   "Result state of a processed part from production"@en ;
    bamm:dataType      :ResultEntity ;
    bamm-c:values      ( :OKState
                         :NOKState ) .
:ResultEntity a bamm:Entity ;
    bamm:name          "ResultEntity" ;
    bamm:preferredName "Result Entity"@en ;
    bamm:description   "Entity that describes a result state from production of a processed part."@en ;
    bamm:properties    ( :resultStateAttributeValue
                         [ bamm:property     :resultStateAttributeDescription ;
                           bamm:notInPayload "true"^^xsd:boolean ] ) .
:resultStateAttributeValue a bamm:Property ;
    bamm:name           "resultStateAttributeValue" ;
    bamm:preferredName  "Result State Attribute Value"@en ;
    bamm:description    "The value representing a specific result state."@en ;
    bamm:characteristic [ a             bamm-c:Code ;
                          bamm:name     "ResultStateCode" ;
                          bamm:dataType xsd:string ] .
    
:OKState a :ResultEntity ;
    :resultStateAttributeValue       "ok"^^xsd:string ;
    :resultStateAttributeDescription "Result state OK"@en, "Result Status OK"@de .
:NOKState a :ResultEntity ;
    :resultStateAttributeValue       "nok"^^xsd:string ;
    :resultStateAttributeDescription "Result state not OK"@en, "Result Status nicht OK"@de .

:resultStateNoDesc a bamm:Property ;
    bamm:name           "resultStateNoDesc" ;
    bamm:preferredName  "Last Recent Result State"@en ;
    bamm:description    "Result state of a part defines if the manufacturing is ok or nok in the current process"@en ;
    bamm:characteristic :ResultStateNoDesc .
:ResultStateNoDesc a bamm-c:Enumeration ;
    bamm:name          "ResultStateNoDesc" ;
    bamm:preferredName "Result State"@en ;
    bamm:description   "Result state of a processed part from production"@en ;
    bamm:dataType      :ResultEntityNoDesc ;
    bamm-c:values      ( :OKStateNoDesc ) .
:ResultEntityNoDesc a bamm:Entity ;
    bamm:name          "ResultEntityNoDesc" ;
    bamm:preferredName "Result Entity"@en ;
    bamm:description   "Entity that describes a result state from production of a processed part."@en ;
    bamm:properties    ( :resultStateAttributeValue ) .
:OKStateNoDesc a :ResultEntity ;
    :resultStateAttributeValue       "ok"^^xsd:string .
`;

export const eitherCharacteristicClass = `
@prefix xsd: <http://www.w3.org/2001/XMLSchema#>.
@prefix bamm: <urn:bamm:io.openmanufacturing:meta-model:1.0.0#>.
@prefix unit: <urn:bamm:io.openmanufacturing:unit:1.0.0#>.
@prefix bamm-c: <urn:bamm:io.openmanufacturing:characteristic:1.0.0#>.
@prefix bamm-e: <urn:bamm:io.openmanufacturing:entity:1.0.0#>.
@prefix rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>.
@prefix : <urn:bamm:io.openmanufacturing:1.0.0#>.

:AspectDefault a bamm:Aspect;
    bamm:name "AspectDefault";
    bamm:properties ( :property1 :property2 );
    bamm:operations ().

:property1
   a bamm:Property ;
   bamm:name "property1" ;
   bamm:characteristic [ a bamm-c:Either ;
                         bamm:name "EitherCharacteristic1" ;
                         bamm-c:left [ a bamm-c:Language ;
                                       bamm:name "TextCharacteristicLeft1"];
                         bamm-c:right [ a bamm-c:List ;
                                      bamm:name "ListCharacteristicRight1" ;
                                      bamm:dataType xsd:float]
                       ] .

:property2
   a bamm:Property ;
   bamm:name "property2" ;
   bamm:characteristic [ a bamm-c:Either ;
                         bamm:name "EitherCharacteristic2" ;
                         bamm-c:left [ a bamm-c:SingleEntity ;
                                     bamm:name "EntityCharacteristicLeft2" ;
                                     bamm:dataType :SpatialPosition] ;
                         bamm-c:right [ a bamm-c:List ;
                                      bamm:name "ListCharacteristicRight2" ;
                                      bamm:dataType xsd:string]
                       ] .


:SpatialPosition a bamm:Entity ;
   bamm:name "SpatialPosition" ;
   bamm:properties ( :x :y ) .
   
:x a bamm:Property ;
   bamm:name "x" ;
   bamm:characteristic :Coordinate .
   
:y a bamm:Property ;
   bamm:name "y" ;
   bamm:characteristic :Coordinate .
   
:Coordinate a bamm-c:Measurement ;
   bamm:name "Coordinate" ;
   bamm:preferredName "Coordinate"@en ;
   bamm:description "Represents a coordinate along an axis in space."@en ;
   bamm:dataType xsd:float ;
   bamm-c:unit unit:metre .
      
`;
