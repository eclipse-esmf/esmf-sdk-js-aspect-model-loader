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

export const extendsAspectModel = `@prefix xsd: <http://www.w3.org/2001/XMLSchema#>.
@prefix samm: <urn:samm:org.eclipse.esmf.samm:meta-model:2.0.0#>.
@prefix unit: <urn:samm:org.eclipse.esmf.samm:unit:2.0.0#>.
@prefix samm-c: <urn:samm:org.eclipse.esmf.samm:characteristic:2.0.0#>.
@prefix samm-e: <urn:samm:org.eclipse.esmf.samm:entity:2.0.0#>.
@prefix rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>.
@prefix : <urn:samm:org.eclipse.esmf.test:2.0.0#>.

:AspectDefault a samm:Aspect ;
    samm:properties (:vehicleWheel :vehicleSeat) ;
    samm:operations () ;
    samm:events () .

:vehicleWheel a samm:Property ;
    samm:preferredName "Vehicle wheel"@en ;
    samm:characteristic :WheelCharacteristic .

:vehicleSeat a samm:Property ;
    samm:preferredName "Vehicle seat"@en ;
    samm:characteristic :SeatCharacteristic .
    
:WheelCharacteristic a samm-c:SingleEntity ;
   samm:preferredName "Vehicle Wheel Characteristic"@en ;
   samm:description "Represents the wheel type"@en ;
   samm:dataType :Steeringwheel .

:SeatCharacteristic a samm-c:SingleEntity ;
   samm:preferredName "Vehicle Seat Characteristic"@en ;
   samm:description "Represents the seat type"@en ;
   samm:dataType :Seat .
      
:VehicleComponent a samm:AbstractEntity ;
    samm:preferredName "Vehicle Component"@en ;
    samm:description "Represents a general component"@en ;
    samm:see "http://reference.general" ;
    samm:properties ( :typeNumber :manufacturer :abstractTestProperty) .

:typeNumber a samm:Property ;
    samm:dataType xsd:string .

:manufacturer a samm:Property ;
    samm:dataType xsd:string .

:Steeringwheel a samm:Entity ;
    samm:extends :VehicleComponent ;
    samm:preferredName "Vehicle Steering Wheel"@en ;
    samm:properties ( :isMultifunction [ samm:extends :abstractTestProperty ; samm:characteristic samm-c:Text ] ) .

:isMultifunction a samm:Property ;
    samm:dataType xsd:boolean .

:Seat a samm:Entity ;
    samm:extends :VehicleComponent ;
    samm:description "Represents a seat component"@en ;
    samm:see "http://reference.seat" ;
    samm:properties ( :material ) .
    
:material a samm:Property ;
    samm:dataType xsd:string .

:abstractTestProperty a samm:AbstractProperty ;
    samm:description "The something part of the vector"@en .
    
`;
