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

export const eventAspectModel = `@prefix xsd: <http://www.w3.org/2001/XMLSchema#>.
@prefix samm: <urn:samm:org.eclipse.esmf.samm:meta-model:1.0.0#>.
@prefix unit: <urn:samm:org.eclipse.esmf.samm:unit:1.0.0#>.
@prefix samm-c: <urn:samm:org.eclipse.esmf.samm:characteristic:1.0.0#>.
@prefix samm-e: <urn:samm:org.eclipse.esmf.samm:entity:1.0.0#>.
@prefix rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>.
@prefix : <urn:samm:org.eclipse.esmf.test:1.0.0#>.

:AspectDefault a samm:Aspect;
    samm:name "AspectDefault";
    samm:properties ();
    samm:operations ();
    samm:events (:StartEngineEvent :StopEngineEvent).

:engineState a samm:Property;
    samm:name "engineState";
    samm:preferredName "Current state of the engine"@en;
    samm:characteristic :EngineStateCharacteristic.
   
:EngineStateCharacteristic a samm:Characteristic;
    samm:name "Characteristic";
    samm:dataType xsd:string.
   
:StopEngineEvent a samm:Event;
    samm:name "StopEngineEvent";
    samm:parameters (:engineState).
   
:StartEngineEvent a samm:Event;
    samm:name "StartEngineEvent";
    samm:parameters (:engineState).
   
`;
