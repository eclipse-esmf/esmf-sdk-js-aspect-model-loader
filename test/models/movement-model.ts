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

export const movementAspectModel = `
@prefix : <urn:samm:org.eclipse.esmf.test:1.0.0#> .
@prefix samm: <urn:samm:org.eclipse.esmf.samm:meta-model:2.1.0#> .
@prefix samm-c: <urn:samm:org.eclipse.esmf.samm:characteristic:2.1.0#> .
@prefix unit: <urn:samm:org.eclipse.esmf.samm:unit:2.1.0#> .
@prefix xsd: <http://www.w3.org/2001/XMLSchema#> .

:Movement a samm:Aspect ;
   samm:name "Movement" ;
   samm:preferredName "Movement"@en ;
   samm:description "Aspect for movement information"@en ;
   samm:properties ( :moving :speedLimitWarning :position :positionNew) ;
   samm:operations () .

:moving a samm:Property ;
   samm:name "moving" ;
   samm:preferredName "Moving"@en ;
   samm:description "Flag indicating if the position is changing"@en ;
   samm:characteristic samm-c:Boolean .

:speedLimitWarning a samm:Property ;
   samm:name "speedLimitWarning" ;
   samm:preferredName "Speed Limit Warning"@en ;
   samm:description "Indicates if speed limit is adhered to."@en ;
   samm:characteristic :WarningLevel .

:position a samm:Property ;
   samm:name "position" ;
   samm:preferredName "Position"@en ;
   samm:description "Indicates a position"@en ;
   samm:characteristic :SpatialPositionCharacteristic .

:SpatialPositionCharacteristic a samm-c:SingleEntity ;
   samm:name "SpatialPositionCharacteristic" ;
   samm:preferredName "Spatial Position Characteristic"@en ;
   samm:description "Represents a single location in space."@en ;
   samm:dataType :SpatialPosition .

:WarningLevel a samm-c:Enumeration ;
   samm:name "WarningLevel" ;
   samm:preferredName "Warning Level"@en ;
   samm:description "Represents if speed of position change is within specification (green), within tolerance (yellow), or outside specification (red)."@en ;
   samm:dataType xsd:string ;
   samm-c:values ( "green" "yellow" "red" ) .

:SpatialPosition a samm:Entity ;
   samm:name "SpatialPosition" ;
   samm:preferredName "Spatial Position"@en ;
   samm:description "Position in space, described along three axis, with the third axis optional, if all positions are in a plane."@en ;
   samm:properties ( :x :y :z ) .

:x a samm:Property ;
   samm:name "x" ;
   samm:preferredName "x"@en ;
   samm:description "x coordinate in space"@en ;
   samm:characteristic :Coordinate .

:y a samm:Property ;
   samm:name "y" ;
   samm:preferredName "y"@en ;
   samm:description "y coordinate in space"@en ;
   samm:characteristic :Coordinate .

:z a samm:Property ;
   samm:name "z" ;
   samm:preferredName "z"@en ;
   samm:description "z coordinate in space"@en ;
   samm:characteristic :Coordinate .

:Coordinate a samm-c:Measurement ;
   samm:name "Coordinate" ;
   samm:preferredName "Coordinate"@en ;
   samm:description "Represents a coordinate along an axis in space."@en ;
   samm:dataType xsd:float ;
   samm-c:unit unit:metre .
`;

export const movementAspectModelWithExternalReference = `
@prefix : <urn:samm:org.eclipse.esmf.test:1.0.0#> .
@prefix samm: <urn:samm:org.eclipse.esmf.samm:meta-model:2.1.0#> .
@prefix samm-c: <urn:samm:org.eclipse.esmf.samm:characteristic:2.1.0#> .
@prefix unit: <urn:samm:org.eclipse.esmf.samm:unit:2.1.0#> .
@prefix xsd: <http://www.w3.org/2001/XMLSchema#> .
@prefix test: <urn:samm:org.eclipse.esmf.test:1.0.0#> .

:MovementWithImports a samm:Aspect ;
   samm:name "MovementWithImports" ;
   samm:preferredName "Movement"@en ;
   samm:description "Aspect for movement information"@en ;
   samm:properties ( test:testProperty :moving :speedLimitWarning :position test:procedureAndStepIdentification ) ;
   samm:operations () .

:moving a samm:Property ;
   samm:name "moving" ;
   samm:preferredName "Moving"@en ;
   samm:description "Flag indicating if the position is changing"@en ;
   samm:characteristic samm-c:Boolean .

:speedLimitWarning a samm:Property ;
   samm:name "speedLimitWarning" ;
   samm:preferredName "Speed Limit Warning"@en ;
   samm:description "Indicates if speed limit is adhered to."@en ;
   samm:characteristic :WarningLevel .

:position a samm:Property ;
   samm:name "position" ;
   samm:preferredName "Position"@en ;
   samm:description "Indicates a position"@en ;
   samm:characteristic :SpatialPositionCharacteristic .

:SpatialPositionCharacteristic a samm-c:SingleEntity ;
   samm:name "SpatialPositionCharacteristic" ;
   samm:preferredName "Spatial Position Characteristic"@en ;
   samm:description "Represents a single location in space."@en ;
   samm:dataType :SpatialPosition .

:WarningLevel a samm-c:Enumeration ;
   samm:name "WarningLevel" ;
   samm:preferredName "Warning Level"@en ;
   samm:description "Represents if speed of position change is within specification (green), within tolerance (yellow), or outside specification (red)."@en ;
   samm:dataType xsd:string ;
   samm-c:values ( "green" "yellow" "red" ) .

:SpatialPosition a samm:Entity ;
   samm:name "SpatialPosition" ;
   samm:preferredName "Spatial Position"@en ;
   samm:description "Position in space, described along three axis, with the third axis optional, if all positions are in a plane."@en ;
   samm:properties ( :x :y :z ) .

:x a samm:Property ;
   samm:name "x" ;
   samm:preferredName "x"@en ;
   samm:description "x coordinate in space"@en ;
   samm:characteristic :Coordinate .

:y a samm:Property ;
   samm:name "y" ;
   samm:preferredName "y"@en ;
   samm:description "y coordinate in space"@en ;
   samm:characteristic :Coordinate .

:z a samm:Property ;
   samm:name "z" ;
   samm:preferredName "z"@en ;
   samm:description "z coordinate in space"@en ;
   samm:characteristic :Coordinate .

:Coordinate a samm-c:Measurement ;
   samm:name "Coordinate" ;
   samm:preferredName "Coordinate"@en ;
   samm:description "Represents a coordinate along an axis in space."@en ;
   samm:dataType xsd:float ;
   samm-c:unit unit:metre .
`;

export const movementAspectModelWithCollectionsAndReusedEntity = `
@prefix : <urn:samm:org.eclipse.esmf.test:1.0.0#> .
@prefix samm: <urn:samm:org.eclipse.esmf.samm:meta-model:2.1.0#> .
@prefix samm-c: <urn:samm:org.eclipse.esmf.samm:characteristic:2.1.0#> .
@prefix unit: <urn:samm:org.eclipse.esmf.samm:unit:2.1.0#> .
@prefix xsd: <http://www.w3.org/2001/XMLSchema#> .

:Movements a samm:Aspect ;
   samm:name "Movements" ;
   samm:preferredName "Movements"@en ;
   samm:description "Aspect for movements information"@en ;
   samm:properties ( :items ) ;
   samm:operations () .

:items a samm:Property ;
   samm:name "items" ;
   samm:characteristic [ a samm-c:Set ; samm:name "Movements" ; samm:dataType :Movement ] .
                          
:Movement a samm:Entity;
   samm:name "Movement" ;
   samm:properties ( :moving :speedLimitWarning :position :positionNew ) .

:moving a samm:Property ;
   samm:name "moving" ;
   samm:preferredName "Moving"@en ;
   samm:description "Flag indicating if the position is changing"@en ;
   samm:characteristic samm-c:Boolean .

:speedLimitWarning a samm:Property ;
   samm:name "speedLimitWarning" ;
   samm:preferredName "Speed Limit Warning"@en ;
   samm:description "Indicates if speed limit is adhered to."@en ;
   samm:characteristic :WarningLevel .

:position a samm:Property ;
   samm:name "position" ;
   samm:preferredName "Position"@en ;
   samm:description "Indicates a position"@en ;
   samm:characteristic :SpatialPositionCharacteristic .

:SpatialPositionCharacteristic a samm-c:SingleEntity ;
   samm:name "SpatialPositionCharacteristic" ;
   samm:preferredName "Spatial Position Characteristic"@en ;
   samm:description "Represents a single location in space."@en ;
   samm:dataType :SpatialPosition .

:WarningLevel a samm-c:Enumeration ;
   samm:name "WarningLevel" ;
   samm:preferredName "Warning Level"@en ;
   samm:description "Represents if speed of position change is within specification (green), within tolerance (yellow), or outside specification (red)."@en ;
   samm:dataType xsd:string ;
   samm-c:values ( "green" "yellow" "red" ) .

:SpatialPosition a samm:Entity ;
   samm:name "SpatialPosition" ;
   samm:preferredName "Spatial Position"@en ;
   samm:description "Position in space, described along three axis, with the third axis optional, if all positions are in a plane."@en ;
   samm:properties ( :x :y :z ) .

:x a samm:Property ;
   samm:name "x" ;
   samm:preferredName "x"@en ;
   samm:description "x coordinate in space"@en ;
   samm:characteristic :Coordinate .

:y a samm:Property ;
   samm:name "y" ;
   samm:preferredName "y"@en ;
   samm:description "y coordinate in space"@en ;
   samm:characteristic :Coordinate .

:z a samm:Property ;
   samm:name "z" ;
   samm:preferredName "z"@en ;
   samm:description "z coordinate in space"@en ;
   samm:characteristic :Coordinate .

:Coordinate a samm-c:Measurement ;
   samm:name "Coordinate" ;
   samm:preferredName "Coordinate"@en ;
   samm:description "Represents a coordinate along an axis in space."@en ;
   samm:dataType xsd:float ;
   samm-c:unit unit:metre .

:positionNew a samm:Property ;
   samm:name "positionNew" ;
   samm:preferredName "Position"@en ;
   samm:description "Indicates a position"@en ;
   samm:characteristic :SpatialPositionCharacteristic .
   
`;

export const movementAspectModelWithOperations = `
@prefix : <urn:samm:org.eclipse.esmf.test:1.0.0#> .
@prefix samm: <urn:samm:org.eclipse.esmf.samm:meta-model:2.1.0#> .
@prefix samm-c: <urn:samm:org.eclipse.esmf.samm:characteristic:2.1.0#> .
@prefix unit: <urn:samm:org.eclipse.esmf.samm:unit:2.1.0#> .
@prefix xsd: <http://www.w3.org/2001/XMLSchema#> .

:Movement a samm:Aspect ;
   samm:name "Movement" ;
   samm:preferredName "Movement"@en ;
   samm:description "Aspect for movement information"@en ;
   samm:properties ( :moving :speedLimitWarning :position ) ;
   samm:operations ( :toggle ) .

:moving a samm:Property ;
   samm:name "moving" ;
   samm:preferredName "Moving"@en ;
   samm:description "Flag indicating if the position is changing"@en ;
   samm:characteristic samm-c:Boolean .

:speedLimitWarning a samm:Property ;
   samm:name "speedLimitWarning" ;
   samm:preferredName "Speed Limit Warning"@en ;
   samm:description "Indicates if speed limit is adhered to."@en ;
   samm:characteristic :WarningLevel .

:position a samm:Property ;
   samm:name "position" ;
   samm:preferredName "Position"@en ;
   samm:description "Indicates a position"@en ;
   samm:characteristic :SpatialPositionCharacteristic .

:SpatialPositionCharacteristic a samm-c:SingleEntity ;
   samm:name "SpatialPositionCharacteristic" ;
   samm:preferredName "Spatial Position Characteristic"@en ;
   samm:description "Represents a single location in space."@en ;
   samm:dataType :SpatialPosition .

:WarningLevel a samm-c:Enumeration ;
   samm:name "WarningLevel" ;
   samm:preferredName "Warning Level"@en ;
   samm:description "Represents if speed of position change is within specification (green), within tolerance (yellow), or outside specification (red)."@en ;
   samm:dataType xsd:string ;
   samm-c:values ( "green" "yellow" "red" ) .

:SpatialPosition a samm:Entity ;
   samm:name "SpatialPosition" ;
   samm:preferredName "Spatial Position"@en ;
   samm:description "Position in space, described along three axis, with the third axis optional, if all positions are in a plane."@en ;
   samm:properties ( :x :y :z ) .

:x a samm:Property ;
   samm:name "x" ;
   samm:preferredName "x"@en ;
   samm:description "x coordinate in space"@en ;
   samm:characteristic :Coordinate .

:y a samm:Property ;
   samm:name "y" ;
   samm:preferredName "y"@en ;
   samm:description "y coordinate in space"@en ;
   samm:characteristic :Coordinate .

:z a samm:Property ;
   samm:name "z" ;
   samm:preferredName "z"@en ;
   samm:description "z coordinate in space"@en ;
   samm:characteristic :Coordinate .

:Coordinate a samm-c:Measurement ;
   samm:name "Coordinate" ;
   samm:preferredName "Coordinate"@en ;
   samm:description "Represents a coordinate along an axis in space."@en ;
   samm:dataType xsd:float ;
   samm-c:unit unit:metre .

:toggle a samm:Operation ;
   samm:name "toggle" ;
   samm:preferredName "Toggle"@en ;
   samm:description "Switches the device on or off"@en ;
   samm:input ( :toggleArgument ) ;
   samm:output :toggleResult .

:toggleArgument a samm:Property ;
   samm:name "toggleArgument" ;
   samm:preferredName "Toggle argument"@en ;
   samm:description "The argument for the toggling operation"@en ;
   samm:characteristic :ToggleValues .

:ToggleValues a samm-c:Enumeration ;
   samm:name "ToggleValues" ;
   samm:preferredName "Toggle values"@en ;
   samm:description "The possible input values for the toggle operation"@en ;
   samm:dataType xsd:string ;
   samm-c:values ( "on" "off" ) .

:toggleResult a samm:Property ;
   samm:name "toggleResult" ;
   samm:preferredName "Toggle result"@en ;
   samm:description "The result of the toggle operation"@en ;
   samm:characteristic :ToggleState .

:ToggleState a samm-c:Enumeration ;
   samm:name "ToggleState" ;
   samm:preferredName "Toggle result"@en ;
   samm:description "The possible results of the toggle operation"@en ;
   samm:dataType xsd:string ;
   samm-c:values ( "ok" "denied" "unknown" ) .

`;
