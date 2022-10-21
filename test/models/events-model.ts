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

export const eventAspectModel = `@prefix xsd: <http://www.w3.org/2001/XMLSchema#>.
@prefix bamm: <urn:bamm:io.openmanufacturing:meta-model:1.0.0#>.
@prefix unit: <urn:bamm:io.openmanufacturing:unit:1.0.0#>.
@prefix bamm-c: <urn:bamm:io.openmanufacturing:characteristic:1.0.0#>.
@prefix bamm-e: <urn:bamm:io.openmanufacturing:entity:1.0.0#>.
@prefix rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>.
@prefix : <urn:bamm:io.openmanufacturing:1.0.0#>.

:AspectDefault a bamm:Aspect;
    bamm:name "AspectDefault";
    bamm:properties ();
    bamm:operations ();
    bamm:events (:StartEngineEvent :StopEngineEvent).

:engineState a bamm:Property;
    bamm:name "engineState";
    bamm:preferredName "Current state of the engine"@en;
    bamm:characteristic :EngineStateCharacteristic.
   
:EngineStateCharacteristic a bamm:Characteristic;
    bamm:name "Characteristic";
    bamm:dataType xsd:string.
   
:StopEngineEvent a bamm:Event;
    bamm:name "StopEngineEvent";
    bamm:parameters (:engineState).
   
:StartEngineEvent a bamm:Event;
    bamm:name "StartEngineEvent";
    bamm:parameters (:engineState).
   
`;
