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

import {
    AspectModelLoader,
    DefaultAspect,
    DefaultEncodingConstraint,
    DefaultFixedPointConstraint,
    DefaultLanguageConstraint,
    DefaultLengthConstraint,
    DefaultLocaleConstraint,
    DefaultRangeConstraint,
    DefaultRegularExpressionConstraint,
    DefaultTrait,
} from '../src';
import {
    constraint,
    encodingConstraint,
    fixedPointConstraint,
    languageConstraint,
    lengthConstraint,
    localeConstraint,
    rangeConstraint,
    regularExpressionConstraint,
} from './models/constraints';
import {Subscription} from 'rxjs';
import DoneCallback = jest.DoneCallback;

describe('Constraints tests', (): void => {
    let loader: AspectModelLoader;
    let aspect: DefaultAspect;
    let subscription: Subscription;

    describe('Constraint tests', (): void => {
        beforeAll((done: DoneCallback): void => {
            loader = new AspectModelLoader();
            subscription = loader.loadSelfContainedModel(constraint).subscribe((_aspect: DefaultAspect): void => {
                aspect = _aspect;
                done();
            });
        });

        test('should include Constraint in the URN code', (): void => {
            const trait = aspect.properties[0].characteristic as unknown as DefaultTrait;
            expect(trait.constraints[0].aspectModelUrn.indexOf('Constraint')).toBeGreaterThan(-1);
        });

        test('should have a name defined', (): void => {
            expect(aspect.properties[0].characteristic.name).toBeDefined();
        });

        afterAll((): void => {
            if (subscription) {
                subscription.unsubscribe();
            }
        });
    });

    describe('Encoding constraint tests', (): void => {
        beforeAll((done: DoneCallback): void => {
            loader = new AspectModelLoader();
            subscription = loader.loadSelfContainedModel(encodingConstraint).subscribe((_aspect: DefaultAspect): void => {
                aspect = _aspect;
                done();
            });
        });

        test('should include EncodingConstraint in the URN code', (): void => {
            const trait = aspect.properties[0].characteristic as unknown as DefaultTrait;
            expect(trait.constraints[0].aspectModelUrn.indexOf('EncodingConstraint')).toBeGreaterThan(-1);
        });

        test('should has an EncodingConstraint defined', (): void => {
            expect(aspect.properties[0].constraints).toHaveLength(1);
        });

        test('should have a value defined from a list of available encodings', (): void => {
            const trait = aspect.properties[0].characteristic as unknown as DefaultTrait;
            const urn = 'urn:samm:org.eclipse.esmf.samm:meta-model:1.0.0#';
            const encodingConstraint = trait.constraints[0] as DefaultEncodingConstraint;
            const definedEncodings = [
                `${urn}US-ASCII`,
                `${urn}ISO-8859-1`,
                `${urn}UTF-8`,
                `${urn}UTF-16`,
                `${urn}UTF-16BE`,
                `${urn}UTF-16LE`,
            ];
            expect(definedEncodings.includes(encodingConstraint.value)).toBeTruthy();
        });

        afterAll((): void => {
            if (subscription) {
                subscription.unsubscribe();
            }
        });
    });

    describe('Fixed point constraint tests', (): void => {
        beforeAll((done: DoneCallback): void => {
            loader = new AspectModelLoader();
            subscription = loader.loadSelfContainedModel(fixedPointConstraint).subscribe((_aspect: DefaultAspect): void => {
                aspect = _aspect;
                done();
            });
        });

        test('should include FixedPointConstraint in the URN code', (): void => {
            const trait = aspect.properties[0].characteristic as unknown as DefaultTrait;
            expect(trait.constraints[0].aspectModelUrn.indexOf('FixedPointConstraint')).toBeGreaterThan(-1);
        });

        test('should have a scale', (): void => {
            const trait = aspect.properties[0].characteristic as unknown as DefaultTrait;
            const fixedPointConstraint = trait.constraints[0] as DefaultFixedPointConstraint;
            expect(fixedPointConstraint.scale).toBeDefined();
        });

        test('should have an integer', (): void => {
            const trait = aspect.properties[0].characteristic as unknown as DefaultTrait;
            const fixedPointConstraint = trait.constraints[0] as DefaultFixedPointConstraint;
            expect(fixedPointConstraint.integer).toBeDefined();
        });

        afterAll((): void => {
            if (subscription) {
                subscription.unsubscribe();
            }
        });
    });

    describe('Language constraint tests', (): void => {
        beforeAll((done: DoneCallback): void => {
            loader = new AspectModelLoader();
            subscription = loader.loadSelfContainedModel(languageConstraint).subscribe((_aspect: DefaultAspect): void => {
                aspect = _aspect;
                done();
            });
        });

        test('should include LanguageConstraint in the URN code', (): void => {
            const trait = aspect.properties[0].characteristic as unknown as DefaultTrait;
            expect(trait.constraints[0].aspectModelUrn.indexOf('LanguageConstraint')).toBeGreaterThan(-1);
        });

        test('should have a mandatory languageCode', (): void => {
            const trait = aspect.properties[0].characteristic as unknown as DefaultTrait;
            const languageConstraint = trait.constraints[0] as unknown as DefaultLanguageConstraint;
            expect(languageConstraint.languageCode).toBeDefined();
        });

        afterAll((): void => {
            if (subscription) {
                subscription.unsubscribe();
            }
        });
    });

    describe('Length constraint tests', (): void => {
        beforeAll((done: DoneCallback): void => {
            loader = new AspectModelLoader();
            subscription = loader.loadSelfContainedModel(lengthConstraint).subscribe((_aspect: DefaultAspect): void => {
                aspect = _aspect;
                done();
            });
        });

        test('should include LengthConstraint in the URN code', (): void => {
            const trait = aspect.properties[0].characteristic as unknown as DefaultTrait;
            expect(trait.constraints[0].aspectModelUrn.indexOf('LengthConstraint')).toBeGreaterThan(-1);
        });

        test('should have a positive minValue', (): void => {
            const trait = aspect.properties[0].characteristic as unknown as DefaultTrait;
            const lengthConstraint = trait.constraints[0] as unknown as DefaultLengthConstraint;
            expect(lengthConstraint.minValue).toBeGreaterThanOrEqual(0);
        });

        test('should have a positive maxValue', (): void => {
            const trait = aspect.properties[0].characteristic as unknown as DefaultTrait;
            const lengthConstraint = trait.constraints[0] as unknown as DefaultLengthConstraint;
            expect(lengthConstraint.maxValue).toBeGreaterThanOrEqual(0);
        });

        test('should have a maxValue greater than minValue', (): void => {
            const trait = aspect.properties[0].characteristic as unknown as DefaultTrait;
            const lengthConstraint = trait.constraints[0] as unknown as DefaultLengthConstraint;
            expect(lengthConstraint.maxValue).toBeGreaterThanOrEqual(lengthConstraint.minValue);
        });

        afterAll((): void => {
            if (subscription) {
                subscription.unsubscribe();
            }
        });
    });

    describe('Locale constraint tests', (): void => {
        beforeAll((done: DoneCallback): void => {
            loader = new AspectModelLoader();
            subscription = loader.loadSelfContainedModel(localeConstraint).subscribe((_aspect: DefaultAspect): void => {
                aspect = _aspect;
                done();
            });
        });

        test('should include LocaleConstraint in the URN code', (): void => {
            const trait = aspect.properties[0].characteristic as unknown as DefaultTrait;
            expect(trait.constraints[0].aspectModelUrn.indexOf('LocaleConstraint')).toBeGreaterThan(-1);
        });

        test('should have a defined localeCode', (): void => {
            const trait = aspect.properties[0].characteristic as unknown as DefaultTrait;
            const lengthConstraint = trait.constraints[0] as unknown as DefaultLocaleConstraint;
            expect(lengthConstraint.localeCode).toBeDefined();
        });

        afterAll((): void => {
            if (subscription) {
                subscription.unsubscribe();
            }
        });
    });

    describe('Range constraint tests', (): void => {
        beforeAll((done: DoneCallback): void => {
            loader = new AspectModelLoader();
            subscription = loader.loadSelfContainedModel(rangeConstraint).subscribe((_aspect: DefaultAspect): void => {
                aspect = _aspect;
                done();
            });
        });

        test('should include RangeConstraint in the URN code', (): void => {
            const trait = aspect.properties[0].characteristic as unknown as DefaultTrait;
            expect(trait.constraints[0].aspectModelUrn.indexOf('RangeConstraint')).toBeGreaterThan(-1);
        });

        test('should have a defined minValue and maxValue', (): void => {
            const trait = aspect.properties[0].characteristic as unknown as DefaultTrait;
            const lengthConstraint = trait.constraints[0] as unknown as DefaultRangeConstraint;
            expect(lengthConstraint.minValue).toBeDefined();
            expect(lengthConstraint.maxValue).toBeDefined();
        });

        test('should have a lower and upper bound defined', (): void => {
            const trait = aspect.properties[0].characteristic as unknown as DefaultTrait;
            const lengthConstraint = trait.constraints[0] as unknown as DefaultRangeConstraint;
            expect(lengthConstraint.lowerBoundDefinition).toBeDefined();
            expect(lengthConstraint.upperBoundDefinition).toBeDefined();
        });

        test('should have a lowerBoundDefinition and upperBoundDefinition from a defined list', (): void => {
            const listForLowerBoundDefinition = ['GREATER_THAN', 'AT_LEAST'];
            const listForUpperBoundDefinition = ['LESS_THAN', 'AT_MOST'];
            const trait = aspect.properties[0].characteristic as unknown as DefaultTrait;
            const lengthConstraint = trait.constraints[0] as unknown as DefaultRangeConstraint;
            expect(listForLowerBoundDefinition.includes(lengthConstraint.lowerBoundDefinition)).toBeTruthy();
            expect(listForUpperBoundDefinition.includes(lengthConstraint.upperBoundDefinition)).toBeTruthy();
        });

        afterAll((): void => {
            if (subscription) {
                subscription.unsubscribe();
            }
        });
    });

    describe('Regular expression constraint tests', (): void => {
        beforeAll((done: DoneCallback): void => {
            loader = new AspectModelLoader();
            subscription = loader.loadSelfContainedModel(regularExpressionConstraint).subscribe((_aspect: DefaultAspect): void => {
                aspect = _aspect;
                done();
            });
        });

        test('should include RegularExpressionConstraint in the URN code', (): void => {
            const trait = aspect.properties[0].characteristic as unknown as DefaultTrait;
            expect(trait.constraints[0].aspectModelUrn.indexOf('RegularExpressionConstraint')).toBeGreaterThan(-1);
        });

        test('should have a defined value', (): void => {
            const trait = aspect.properties[0].characteristic as unknown as DefaultTrait;
            const lengthConstraint = trait.constraints[0] as unknown as DefaultRegularExpressionConstraint;
            expect(lengthConstraint.value).toBeDefined();
        });

        afterAll((): void => {
            if (subscription) {
                subscription.unsubscribe();
            }
        });
    });
});
