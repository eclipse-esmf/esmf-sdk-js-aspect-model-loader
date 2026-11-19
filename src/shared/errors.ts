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

/**
 * Base class of all errors thrown by the ESMF JavaScript SDK.
 */
export class AspectModelError extends Error {
    constructor(message: string, options?: ErrorOptions) {
        super(message, options);
        this.name = new.target.name;
    }
}

/**
 * Thrown when the loaded model uses a SAMM version which is not supported.
 */
export class UnsupportedVersionError extends AspectModelError {
    constructor(
        public readonly version: string,
        public readonly supportedVersions: readonly string[]
    ) {
        super(`SAMM ${version} is not supported. Supported versions are: ${supportedVersions.join()}`);
    }
}

/**
 * Thrown when no Aspect could be found in the loaded model.
 */
export class AspectNotFoundError extends AspectModelError {
    constructor() {
        super('No aspect found. Please verify if the aspectModelUrn is correct and the ttl includes an aspect definition.');
    }
}

/**
 * Thrown when the loaded model contains more than one Aspect and no Aspect URN was provided.
 */
export class MultipleAspectsFoundError extends AspectModelError {
    constructor() {
        super('More than one aspect found. Please provide the aspectModelUrn to load the desired one.');
    }
}

/**
 * Thrown when an Entity instance referenced in the model cannot be resolved.
 */
export class EntityInstanceResolutionError extends AspectModelError {
    constructor(public readonly urn: string) {
        super(`Could not resolve Entity instance ${urn}`);
    }
}

/**
 * Thrown when an Entity extends another Entity which is not abstract.
 */
export class NotAbstractEntityError extends AspectModelError {
    constructor(public readonly urn: string) {
        super(`Entity ${urn} is not abstract.`);
    }
}

/**
 * Thrown when the provided RDF/Turtle content cannot be parsed.
 */
export class RdfParseError extends AspectModelError {}
