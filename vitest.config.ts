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

import {defineConfig} from 'vitest/config';

export default defineConfig({
    test: {
        globals: true,
        include: ['test/**/*.spec.ts'],
        bail: 1,
        clearMocks: true,
        coverage: {
            provider: 'v8',
            include: ['src/**/*.ts'],
            // generated unit catalogue, pure data
            exclude: ['src/shared/units-data.ts'],
            reportsDirectory: 'coverage',
            thresholds: {
                statements: 91,
                branches: 87,
                functions: 90,
                lines: 91,
            },
        },
    },
});
