/*
 * Copyright (c) 2026 Robert Bosch Manufacturing Solutions GmbH
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

export const coverageAspectModel = `@prefix xsd: <http://www.w3.org/2001/XMLSchema#>.
@prefix samm: <urn:samm:org.eclipse.esmf.samm:meta-model:2.2.0#>.
@prefix unit: <urn:samm:org.eclipse.esmf.samm:unit:2.2.0#>.
@prefix samm-c: <urn:samm:org.eclipse.esmf.samm:characteristic:2.2.0#>.
@prefix samm-e: <urn:samm:org.eclipse.esmf.samm:entity:2.2.0#>.
@prefix : <urn:samm:org.eclipse.esmf.test:1.0.0#>.

:CoverageAspect a samm:Aspect ;
    samm:preferredName "Coverage Aspect"@en ;
    samm:description "Aspect covering rarely used model elements"@en ;
    samm:properties (:sortedNumbers :temperatureSeries :serialNumber :cycleTime :weight :distance :result :position :document) ;
    samm:operations (:toggle) ;
    samm:events () .

:sortedNumbers a samm:Property ;
    samm:characteristic :SortedNumbers .

:SortedNumbers a samm-c:SortedSet ;
    samm:dataType xsd:int ;
    samm:value (1 2 3) .

:temperatureSeries a samm:Property ;
    samm:characteristic :TemperatureSeries .

:TemperatureSeries a samm-c:TimeSeries ;
    samm:dataType :TemperatureEntry .

:TemperatureEntry a samm:Entity ;
    samm:extends samm-e:TimeSeriesEntity ;
    samm:properties ([ samm:extends samm-e:value ; samm:characteristic :Temperature ]) .

:serialNumber a samm:Property ;
    samm:characteristic :SerialNumber .

:SerialNumber a samm-c:StructuredValue ;
    samm:dataType xsd:string ;
    samm-c:deconstructionRule "(\\\\w+)-(\\\\d+)" ;
    samm-c:elements (:prefix "-" :counter) .

:prefix a samm:Property ;
    samm:characteristic samm-c:Text .

:counter a samm:Property ;
    samm:characteristic :Counter .

:Counter a samm:Characteristic ;
    samm:dataType xsd:int .

:cycleTime a samm:Property ;
    samm:characteristic :CycleTime .

:CycleTime a samm-c:Duration ;
    samm:dataType xsd:int ;
    samm-c:unit unit:secondUnitOfTime .

:weight a samm:Property ;
    samm:characteristic :Weight .

:Weight a samm-c:Quantifiable ;
    samm:dataType xsd:float ;
    samm-c:unit :Pound .

:Pound a samm:Unit ;
    samm:preferredName "pound"@en ;
    samm:symbol "lb" ;
    samm:referenceUnit unit:kilogram ;
    samm:conversionFactor "0.45359237" ;
    samm:quantityKind unit:mass .

:distance a samm:Property ;
    samm:characteristic :Distance .

:Distance a samm-c:Measurement ;
    samm:dataType xsd:double ;
    samm-c:unit unit:metre .

:Temperature a samm-c:Measurement ;
    samm:dataType xsd:float ;
    samm-c:unit unit:degreeCelsius .

:result a samm:Property ;
    samm:characteristic :Result .

:Result a samm-c:Either ;
    samm-c:left :ErrorCode ;
    samm-c:right samm-c:Boolean .

:ErrorCode a samm:Characteristic ;
    samm:dataType xsd:int .

:position a samm:Property ;
    samm:characteristic :Position .

:Position a samm-c:SingleEntity ;
    samm:dataType :Position3d .

:Position3d a samm:Entity ;
    samm:extends samm-e:Point3d ;
    samm:properties () .

:document a samm:Property ;
    samm:characteristic :Document .

:Document a samm-c:SingleEntity ;
    samm:dataType :DocumentEntity .

:DocumentEntity a samm:Entity ;
    samm:extends samm-e:FileResource ;
    samm:properties () .

:toggle a samm:Operation ;
    samm:preferredName "Toggle"@en ;
    samm:input (:cycleTime) ;
    samm:output :result .
`;
