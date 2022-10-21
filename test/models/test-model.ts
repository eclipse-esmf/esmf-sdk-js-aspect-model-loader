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

export const testAspectModel = `
@prefix : <urn:bamm:io.openmanufacturing:1.0.0#> .
@prefix bamm: <urn:bamm:io.openmanufacturing:meta-model:1.0.0#> .
@prefix bamm-c: <urn:bamm:io.openmanufacturing:characteristic:1.0.0#> .
@prefix unit: <urn:bamm:io.openmanufacturing:unit:1.0.0#> .
@prefix xsd: <http://www.w3.org/2001/XMLSchema#> .

:TestAspect a bamm:Aspect ;
   bamm:name "TestAspect" ;
   bamm:properties ( :testProperty [ bamm:property :testProperty ; bamm:optional "true"^^xsd:boolean; bamm:exampleValue "5"^^xsd:int ] :procedureAndStepIdentification ) ;
   bamm:operations () .

:testProperty a bamm:Property ;
  bamm:name "testProperty" ;
  bamm:preferredName "Test Property EN"@en ;
  bamm:preferredName "Test Property DE"@de ;
  bamm:description "This is a test property EN."@en ;
  bamm:description "This is a test property DE."@de ;
  bamm:exampleValue "5.7"^^xsd:float.
  
:procedureAndStepIdentification a bamm:Property ;
   bamm:name "procedureAndStepIdentification" ;
   bamm:preferredName "Procedure And Step Identification"@en ;
   bamm:description "The identification code for the procedure and execution step in which the system finds itself."@en ;
   bamm:characteristic [
      a bamm-c:Enumeration ;
      bamm:name "ProcedureAndStepNumbers" ;
      bamm:preferredName "Procedure And Step Number"@en ;
      bamm:description "Defines the codes which represent the state of the system."@en ;
      bamm:dataType :ProcedureAndStepNumber ;
      bamm-c:values ( :Code101 :Code102 )
   ] .

:ProcedureAndStepNumber a bamm:Entity ;
   bamm:name "ProcedureAndStepNumber" ;
   bamm:preferredName "Procedure And Step Number"@en ;
   bamm:description "Represents a code which represents a specific system state."@en ;
   bamm:properties ( :iProcedureAndStepNo
                     [ bamm:property :description ; bamm:notInPayload "true"^^xsd:boolean ] ) .
                     
:Code101 a :ProcedureAndStepNumber ;
   :iProcedureAndStepNo "101"^^xsd:short ;
   :description "Starting" .

:Code102 a :ProcedureAndStepNumber ;
   :iProcedureAndStepNo "102"^^xsd:short ;
   :description "Ready" .

:iProcedureAndStepNo a bamm:Property ;
   bamm:name "iProcedureAndStepNo" ;
   bamm:preferredName "Code"@en ;
   bamm:description "The code which represents a specific system state."@en ;
   bamm:characteristic :NumericCode .

:NumericCode a bamm-c:Code ;
   bamm:name "NumericCode" ;
   bamm:preferredName "Numeric Code"@en ;
   bamm:description "A numeric code"@en ;
   bamm:dataType xsd:short .       
`;
