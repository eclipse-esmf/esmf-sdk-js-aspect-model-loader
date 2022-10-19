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

export const movementAspectModel = `
@prefix : <urn:bamm:io.openmanufacturing:1.0.0#> .
@prefix bamm: <urn:bamm:io.openmanufacturing:meta-model:1.0.0#> .
@prefix bamm-c: <urn:bamm:io.openmanufacturing:characteristic:1.0.0#> .
@prefix unit: <urn:bamm:io.openmanufacturing:unit:1.0.0#> .
@prefix xsd: <http://www.w3.org/2001/XMLSchema#> .

:Movement a bamm:Aspect ;
   bamm:name "Movement" ;
   bamm:preferredName "Movement"@en ;
   bamm:description "Aspect for movement information"@en ;
   bamm:properties ( :moving :speedLimitWarning :position :positionNew) ;
   bamm:operations () .

:moving a bamm:Property ;
   bamm:name "moving" ;
   bamm:preferredName "Moving"@en ;
   bamm:description "Flag indicating if the position is changing"@en ;
   bamm:characteristic bamm-c:Boolean .

:speedLimitWarning a bamm:Property ;
   bamm:name "speedLimitWarning" ;
   bamm:preferredName "Speed Limit Warning"@en ;
   bamm:description "Indicates if speed limit is adhered to."@en ;
   bamm:characteristic :WarningLevel .

:position a bamm:Property ;
   bamm:name "position" ;
   bamm:preferredName "Position"@en ;
   bamm:description "Indicates a position"@en ;
   bamm:characteristic :SpatialPositionCharacteristic .

:SpatialPositionCharacteristic a bamm-c:SingleEntity ;
   bamm:name "SpatialPositionCharacteristic" ;
   bamm:preferredName "Spatial Position Characteristic"@en ;
   bamm:description "Represents a single location in space."@en ;
   bamm:dataType :SpatialPosition .

:WarningLevel a bamm-c:Enumeration ;
   bamm:name "WarningLevel" ;
   bamm:preferredName "Warning Level"@en ;
   bamm:description "Represents if speed of position change is within specification (green), within tolerance (yellow), or outside specification (red)."@en ;
   bamm:dataType xsd:string ;
   bamm-c:values ( "green" "yellow" "red" ) .

:SpatialPosition a bamm:Entity ;
   bamm:name "SpatialPosition" ;
   bamm:preferredName "Spatial Position"@en ;
   bamm:description "Position in space, described along three axis, with the third axis optional, if all positions are in a plane."@en ;
   bamm:properties ( :x :y :z ) .

:x a bamm:Property ;
   bamm:name "x" ;
   bamm:preferredName "x"@en ;
   bamm:description "x coordinate in space"@en ;
   bamm:characteristic :Coordinate .

:y a bamm:Property ;
   bamm:name "y" ;
   bamm:preferredName "y"@en ;
   bamm:description "y coordinate in space"@en ;
   bamm:characteristic :Coordinate .

:z a bamm:Property ;
   bamm:name "z" ;
   bamm:preferredName "z"@en ;
   bamm:description "z coordinate in space"@en ;
   bamm:characteristic :Coordinate .

:Coordinate a bamm-c:Measurement ;
   bamm:name "Coordinate" ;
   bamm:preferredName "Coordinate"@en ;
   bamm:description "Represents a coordinate along an axis in space."@en ;
   bamm:dataType xsd:float ;
   bamm-c:unit unit:metre .
`;

export const movementAspectModelWithExternalReference = `
@prefix : <urn:bamm:io.openmanufacturing:1.0.0#> .
@prefix bamm: <urn:bamm:io.openmanufacturing:meta-model:1.0.0#> .
@prefix bamm-c: <urn:bamm:io.openmanufacturing:characteristic:1.0.0#> .
@prefix unit: <urn:bamm:io.openmanufacturing:unit:1.0.0#> .
@prefix xsd: <http://www.w3.org/2001/XMLSchema#> .
@prefix test: <urn:bamm:io.openmanufacturing:1.0.0#> .

:MovementWithImports a bamm:Aspect ;
   bamm:name "MovementWithImports" ;
   bamm:preferredName "Movement"@en ;
   bamm:description "Aspect for movement information"@en ;
   bamm:properties ( test:testProperty :moving :speedLimitWarning :position test:procedureAndStepIdentification ) ;
   bamm:operations () .

:moving a bamm:Property ;
   bamm:name "moving" ;
   bamm:preferredName "Moving"@en ;
   bamm:description "Flag indicating if the position is changing"@en ;
   bamm:characteristic bamm-c:Boolean .

:speedLimitWarning a bamm:Property ;
   bamm:name "speedLimitWarning" ;
   bamm:preferredName "Speed Limit Warning"@en ;
   bamm:description "Indicates if speed limit is adhered to."@en ;
   bamm:characteristic :WarningLevel .

:position a bamm:Property ;
   bamm:name "position" ;
   bamm:preferredName "Position"@en ;
   bamm:description "Indicates a position"@en ;
   bamm:characteristic :SpatialPositionCharacteristic .

:SpatialPositionCharacteristic a bamm-c:SingleEntity ;
   bamm:name "SpatialPositionCharacteristic" ;
   bamm:preferredName "Spatial Position Characteristic"@en ;
   bamm:description "Represents a single location in space."@en ;
   bamm:dataType :SpatialPosition .

:WarningLevel a bamm-c:Enumeration ;
   bamm:name "WarningLevel" ;
   bamm:preferredName "Warning Level"@en ;
   bamm:description "Represents if speed of position change is within specification (green), within tolerance (yellow), or outside specification (red)."@en ;
   bamm:dataType xsd:string ;
   bamm-c:values ( "green" "yellow" "red" ) .

:SpatialPosition a bamm:Entity ;
   bamm:name "SpatialPosition" ;
   bamm:preferredName "Spatial Position"@en ;
   bamm:description "Position in space, described along three axis, with the third axis optional, if all positions are in a plane."@en ;
   bamm:properties ( :x :y :z ) .

:x a bamm:Property ;
   bamm:name "x" ;
   bamm:preferredName "x"@en ;
   bamm:description "x coordinate in space"@en ;
   bamm:characteristic :Coordinate .

:y a bamm:Property ;
   bamm:name "y" ;
   bamm:preferredName "y"@en ;
   bamm:description "y coordinate in space"@en ;
   bamm:characteristic :Coordinate .

:z a bamm:Property ;
   bamm:name "z" ;
   bamm:preferredName "z"@en ;
   bamm:description "z coordinate in space"@en ;
   bamm:characteristic :Coordinate .

:Coordinate a bamm-c:Measurement ;
   bamm:name "Coordinate" ;
   bamm:preferredName "Coordinate"@en ;
   bamm:description "Represents a coordinate along an axis in space."@en ;
   bamm:dataType xsd:float ;
   bamm-c:unit unit:metre .
`;

export const movementAspectModelWithCollectionsAndReusedEntity = `
@prefix : <urn:bamm:io.openmanufacturing:1.0.0#> .
@prefix bamm: <urn:bamm:io.openmanufacturing:meta-model:1.0.0#> .
@prefix bamm-c: <urn:bamm:io.openmanufacturing:characteristic:1.0.0#> .
@prefix unit: <urn:bamm:io.openmanufacturing:unit:1.0.0#> .
@prefix xsd: <http://www.w3.org/2001/XMLSchema#> .

:Movements a bamm:Aspect ;
   bamm:name "Movements" ;
   bamm:preferredName "Movements"@en ;
   bamm:description "Aspect for movements information"@en ;
   bamm:properties ( :items ) ;
   bamm:operations () .

:items a bamm:Property ;
   bamm:name "items" ;
   bamm:characteristic [ a bamm-c:Set ; bamm:name "Movements" ; bamm:dataType :Movement ] .
                          
:Movement a bamm:Entity;
   bamm:name "Movement" ;
   bamm:properties ( :moving :speedLimitWarning :position :positionNew ) .

:moving a bamm:Property ;
   bamm:name "moving" ;
   bamm:preferredName "Moving"@en ;
   bamm:description "Flag indicating if the position is changing"@en ;
   bamm:characteristic bamm-c:Boolean .

:speedLimitWarning a bamm:Property ;
   bamm:name "speedLimitWarning" ;
   bamm:preferredName "Speed Limit Warning"@en ;
   bamm:description "Indicates if speed limit is adhered to."@en ;
   bamm:characteristic :WarningLevel .

:position a bamm:Property ;
   bamm:name "position" ;
   bamm:preferredName "Position"@en ;
   bamm:description "Indicates a position"@en ;
   bamm:characteristic :SpatialPositionCharacteristic .

:SpatialPositionCharacteristic a bamm-c:SingleEntity ;
   bamm:name "SpatialPositionCharacteristic" ;
   bamm:preferredName "Spatial Position Characteristic"@en ;
   bamm:description "Represents a single location in space."@en ;
   bamm:dataType :SpatialPosition .

:WarningLevel a bamm-c:Enumeration ;
   bamm:name "WarningLevel" ;
   bamm:preferredName "Warning Level"@en ;
   bamm:description "Represents if speed of position change is within specification (green), within tolerance (yellow), or outside specification (red)."@en ;
   bamm:dataType xsd:string ;
   bamm-c:values ( "green" "yellow" "red" ) .

:SpatialPosition a bamm:Entity ;
   bamm:name "SpatialPosition" ;
   bamm:preferredName "Spatial Position"@en ;
   bamm:description "Position in space, described along three axis, with the third axis optional, if all positions are in a plane."@en ;
   bamm:properties ( :x :y :z ) .

:x a bamm:Property ;
   bamm:name "x" ;
   bamm:preferredName "x"@en ;
   bamm:description "x coordinate in space"@en ;
   bamm:characteristic :Coordinate .

:y a bamm:Property ;
   bamm:name "y" ;
   bamm:preferredName "y"@en ;
   bamm:description "y coordinate in space"@en ;
   bamm:characteristic :Coordinate .

:z a bamm:Property ;
   bamm:name "z" ;
   bamm:preferredName "z"@en ;
   bamm:description "z coordinate in space"@en ;
   bamm:characteristic :Coordinate .

:Coordinate a bamm-c:Measurement ;
   bamm:name "Coordinate" ;
   bamm:preferredName "Coordinate"@en ;
   bamm:description "Represents a coordinate along an axis in space."@en ;
   bamm:dataType xsd:float ;
   bamm-c:unit unit:metre .

:positionNew a bamm:Property ;
   bamm:name "positionNew" ;
   bamm:preferredName "Position"@en ;
   bamm:description "Indicates a position"@en ;
   bamm:characteristic :SpatialPositionCharacteristic .
   
`;

export const movementAspectModelWithOperations = `
@prefix : <urn:bamm:io.openmanufacturing:1.0.0#> .
@prefix bamm: <urn:bamm:io.openmanufacturing:meta-model:1.0.0#> .
@prefix bamm-c: <urn:bamm:io.openmanufacturing:characteristic:1.0.0#> .
@prefix unit: <urn:bamm:io.openmanufacturing:unit:1.0.0#> .
@prefix xsd: <http://www.w3.org/2001/XMLSchema#> .

:Movement a bamm:Aspect ;
   bamm:name "Movement" ;
   bamm:preferredName "Movement"@en ;
   bamm:description "Aspect for movement information"@en ;
   bamm:properties ( :moving :speedLimitWarning :position ) ;
   bamm:operations ( :toggle ) .

:moving a bamm:Property ;
   bamm:name "moving" ;
   bamm:preferredName "Moving"@en ;
   bamm:description "Flag indicating if the position is changing"@en ;
   bamm:characteristic bamm-c:Boolean .

:speedLimitWarning a bamm:Property ;
   bamm:name "speedLimitWarning" ;
   bamm:preferredName "Speed Limit Warning"@en ;
   bamm:description "Indicates if speed limit is adhered to."@en ;
   bamm:characteristic :WarningLevel .

:position a bamm:Property ;
   bamm:name "position" ;
   bamm:preferredName "Position"@en ;
   bamm:description "Indicates a position"@en ;
   bamm:characteristic :SpatialPositionCharacteristic .

:SpatialPositionCharacteristic a bamm-c:SingleEntity ;
   bamm:name "SpatialPositionCharacteristic" ;
   bamm:preferredName "Spatial Position Characteristic"@en ;
   bamm:description "Represents a single location in space."@en ;
   bamm:dataType :SpatialPosition .

:WarningLevel a bamm-c:Enumeration ;
   bamm:name "WarningLevel" ;
   bamm:preferredName "Warning Level"@en ;
   bamm:description "Represents if speed of position change is within specification (green), within tolerance (yellow), or outside specification (red)."@en ;
   bamm:dataType xsd:string ;
   bamm-c:values ( "green" "yellow" "red" ) .

:SpatialPosition a bamm:Entity ;
   bamm:name "SpatialPosition" ;
   bamm:preferredName "Spatial Position"@en ;
   bamm:description "Position in space, described along three axis, with the third axis optional, if all positions are in a plane."@en ;
   bamm:properties ( :x :y :z ) .

:x a bamm:Property ;
   bamm:name "x" ;
   bamm:preferredName "x"@en ;
   bamm:description "x coordinate in space"@en ;
   bamm:characteristic :Coordinate .

:y a bamm:Property ;
   bamm:name "y" ;
   bamm:preferredName "y"@en ;
   bamm:description "y coordinate in space"@en ;
   bamm:characteristic :Coordinate .

:z a bamm:Property ;
   bamm:name "z" ;
   bamm:preferredName "z"@en ;
   bamm:description "z coordinate in space"@en ;
   bamm:characteristic :Coordinate .

:Coordinate a bamm-c:Measurement ;
   bamm:name "Coordinate" ;
   bamm:preferredName "Coordinate"@en ;
   bamm:description "Represents a coordinate along an axis in space."@en ;
   bamm:dataType xsd:float ;
   bamm-c:unit unit:metre .

:toggle a bamm:Operation ;
   bamm:name "toggle" ;
   bamm:preferredName "Toggle"@en ;
   bamm:description "Switches the device on or off"@en ;
   bamm:input ( :toggleArgument ) ;
   bamm:output :toggleResult .

:toggleArgument a bamm:Property ;
   bamm:name "toggleArgument" ;
   bamm:preferredName "Toggle argument"@en ;
   bamm:description "The argument for the toggling operation"@en ;
   bamm:characteristic :ToggleValues .

:ToggleValues a bamm-c:Enumeration ;
   bamm:name "ToggleValues" ;
   bamm:preferredName "Toggle values"@en ;
   bamm:description "The possible input values for the toggle operation"@en ;
   bamm:dataType xsd:string ;
   bamm-c:values ( "on" "off" ) .

:toggleResult a bamm:Property ;
   bamm:name "toggleResult" ;
   bamm:preferredName "Toggle result"@en ;
   bamm:description "The result of the toggle operation"@en ;
   bamm:characteristic :ToggleState .

:ToggleState a bamm-c:Enumeration ;
   bamm:name "ToggleState" ;
   bamm:preferredName "Toggle result"@en ;
   bamm:description "The possible results of the toggle operation"@en ;
   bamm:dataType xsd:string ;
   bamm-c:values ( "ok" "denied" "unknown" ) .

`;
