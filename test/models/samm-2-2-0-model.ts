/*
 * Copyright (c) 2025 Robert Bosch Manufacturing Solutions GmbH
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

export const samm220AspectModel = `@prefix xsd: <http://www.w3.org/2001/XMLSchema#>.
@prefix samm: <urn:samm:org.eclipse.esmf.samm:meta-model:2.2.0#>.
@prefix unit: <urn:samm:org.eclipse.esmf.samm:unit:2.2.0#>.
@prefix samm-c: <urn:samm:org.eclipse.esmf.samm:characteristic:2.2.0#>.
@prefix samm-e: <urn:samm:org.eclipse.esmf.samm:entity:2.2.0#>.
@prefix : <urn:samm:org.eclipse.esmf.test:1.0.0#>.

<urn:samm:org.eclipse.esmf.test:1.0.0#> a samm:Namespace ;
    samm:preferredName "Test namespace"@en ;
    samm:description "Namespace for SAMM 2.2.0 tests"@en .

:Samm220Aspect a samm:Aspect ;
    samm:properties (:status :machineState :partReference :measurement) ;
    samm:operations () ;
    samm:events () .

:status a samm:Property ;
    samm:characteristic :StatusEnumeration ;
    samm:exampleValue :Running .

:machineState a samm:Property ;
    samm:characteristic :MachineState .

:partReference a samm:Property ;
    samm:characteristic samm-c:Reference .

:measurement a samm:Property ;
    samm:characteristic :MeasurementCharacteristic .

:StatusEnumeration a samm-c:Enumeration ;
    samm:dataType xsd:string ;
    samm-c:values (:Running :Stopped [ a samm:Value ; samm:value "Unknown" ; samm:preferredName "Unknown"@en ]) .

:MachineState a samm-c:State ;
    samm:dataType xsd:string ;
    samm-c:values (:Running :Stopped) ;
    samm-c:defaultValue :Stopped .

:Running a samm:Value ;
    samm:value "Running" ;
    samm:preferredName "Running"@en ;
    samm:description "The machine is running."@en ;
    samm:see <https://example.org/running> .

:Stopped a samm:Value ;
    samm:value "Stopped" ;
    samm:preferredName "Stopped"@en .

:MeasurementCharacteristic a samm-c:SingleEntity ;
    samm:dataType :Measurement .

:Measurement a samm:Entity ;
    samm:extends samm-e:Quantity ;
    samm:properties ([ samm:extends samm-e:value ; samm:characteristic :MeasurementValue ]) .

:MeasurementValue a samm:Characteristic ;
    samm:dataType xsd:float .
`;
