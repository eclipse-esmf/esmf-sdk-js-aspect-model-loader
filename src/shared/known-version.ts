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

/**
 * List of all known versions
 */
export enum BammVersion {
    BAMM_1_0_0 = '1.0.0',
    BAMM_2_0_0 = '2.0.0',
}

export class KnownVersion {
    /**
     * Get the version based on the given string
     *
     * @param version Version string
     * @return Version or undefined if version string can be mapped
     */
    public static fromVersionString(version: string): BammVersion | undefined {
        if (BammVersion.BAMM_1_0_0 === version) {
            return BammVersion.BAMM_1_0_0;
        } else if (BammVersion.BAMM_2_0_0 === version) {
            return BammVersion.BAMM_2_0_0;
        } else {
            return undefined;
        }
    }

    /**
     * Check if the version is supported by the loader
     *
     * @param version Version to check
     * @return true if the version is supported or false if not
     */
    public static isVersionSupported(version: BammVersion): boolean {
        return this.getSupportedVersions().find(supportedVersion => supportedVersion === version) !== undefined;
    }

    /**
     * Get supported versions
     *
     * @return Array of supported versions
     */
    public static getSupportedVersions(): Array<BammVersion> {
        return [BammVersion.BAMM_1_0_0, BammVersion.BAMM_2_0_0];
    }
}
