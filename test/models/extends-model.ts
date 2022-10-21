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

export const extendsAspectModel = `@prefix xsd: <http://www.w3.org/2001/XMLSchema#>.
@prefix bamm: <urn:bamm:io.openmanufacturing:meta-model:2.0.0#>.
@prefix unit: <urn:bamm:io.openmanufacturing:unit:2.0.0#>.
@prefix bamm-c: <urn:bamm:io.openmanufacturing:characteristic:2.0.0#>.
@prefix bamm-e: <urn:bamm:io.openmanufacturing:entity:2.0.0#>.
@prefix rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>.
@prefix : <urn:bamm:io.openmanufacturing:2.0.0#>.

:AspectDefault a bamm:Aspect ;
    bamm:properties (:vehicleWheel :vehicleSeat) ;
    bamm:operations () ;
    bamm:events () .

:vehicleWheel a bamm:Property ;
    bamm:preferredName "Vehicle wheel"@en ;
    bamm:characteristic :WheelCharacteristic .

:vehicleSeat a bamm:Property ;
    bamm:preferredName "Vehicle seat"@en ;
    bamm:characteristic :SeatCharacteristic .
    
:WheelCharacteristic a bamm-c:SingleEntity ;
   bamm:preferredName "Vehicle Wheel Characteristic"@en ;
   bamm:description "Represents the wheel type"@en ;
   bamm:dataType :Steeringwheel .

:SeatCharacteristic a bamm-c:SingleEntity ;
   bamm:preferredName "Vehicle Seat Characteristic"@en ;
   bamm:description "Represents the seat type"@en ;
   bamm:dataType :Seat .
      
:VehicleComponent a bamm:AbstractEntity ;
    bamm:preferredName "Vehicle Component"@en ;
    bamm:description "Represents a general component"@en ;
    bamm:see "http://reference.general" ;
    bamm:properties ( :typeNumber :manufacturer :abstractTestProperty) .

:typeNumber a bamm:Property ;
    bamm:dataType xsd:string .

:manufacturer a bamm:Property ;
    bamm:dataType xsd:string .

:Steeringwheel a bamm:Entity ;
    bamm:extends :VehicleComponent ;
    bamm:preferredName "Vehicle Steering Wheel"@en ;
    bamm:properties ( :isMultifunction [ bamm:extends :abstractTestProperty ; bamm:characteristic bamm-c:Text ] ) .

:isMultifunction a bamm:Property ;
    bamm:dataType xsd:boolean .

:Seat a bamm:Entity ;
    bamm:extends :VehicleComponent ;
    bamm:description "Represents a seat component"@en ;
    bamm:see "http://reference.seat" ;
    bamm:properties ( :material ) .
    
:material a bamm:Property ;
    bamm:dataType xsd:string .

:abstractTestProperty a bamm:AbstractProperty ;
    bamm:description "The something part of the vector"@en .
    
`;
