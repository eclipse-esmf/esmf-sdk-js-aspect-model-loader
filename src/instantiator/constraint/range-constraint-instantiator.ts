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

import {Literal, NamedNode, Quad} from 'n3';
import {Characteristic, DefaultRangeConstraint} from '../../aspect-meta-model/index.js';
import {BoundDefinition} from '../../aspect-meta-model/bound-definition.js';
import {ConstraintInstantiator} from './constraint-instantiator.js';
import {CharacteristicInstantiatorUtil} from '../characteristic/characteristic-instantiator-util.js';

export class RangeConstraintInstantiator extends ConstraintInstantiator {
    protected processElement(quads: Array<Quad>): Characteristic {
        const sammC = this.metaModelElementInstantiator.sammC;
        const defaultRangeConstraint = new DefaultRangeConstraint(null!, null!, null!, null!, null!, null!, null!);

        quads.forEach(quad => {
            if (sammC.isMinValueProperty(quad.predicate.value)) {
                defaultRangeConstraint.minValue = this.resolveBoundValue(quad);
            } else if (sammC.isMaxValueProperty(quad.predicate.value)) {
                defaultRangeConstraint.maxValue = this.resolveBoundValue(quad);
            } else if (sammC.isUpperBoundDefinitionProperty(quad.predicate.value)) {
                defaultRangeConstraint.upperBoundDefinition =
                    BoundDefinition[quad.object.value.replace(sammC.getNamespace(), '') as keyof typeof BoundDefinition];
            } else if (sammC.isLowerBoundDefinitionProperty(quad.predicate.value)) {
                defaultRangeConstraint.lowerBoundDefinition =
                    BoundDefinition[quad.object.value.replace(sammC.getNamespace(), '') as keyof typeof BoundDefinition];
            }
        });
        return defaultRangeConstraint;
    }

    /**
     * Numeric bounds (e.g. xsd:int, xsd:decimal) are converted to numbers, all other
     * bounds (e.g. xsd:date, xsd:dateTime) are kept as strings.
     */
    private resolveBoundValue(quad: Quad): number | string {
        return CharacteristicInstantiatorUtil.resolveValues(quad, (quad.object as Literal).datatypeString);
    }

    shouldProcess(nameNode: NamedNode): boolean {
        return this.metaModelElementInstantiator.sammC.RangeConstraint().equals(nameNode);
    }
}
