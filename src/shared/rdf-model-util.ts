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

import {DefaultEntity, Entity} from '../aspect-meta-model/default-entity';
import {RdfModel} from './rdf-model';
import {Bamm} from '../vocabulary/bamm';
import {Bammc} from '../vocabulary/bammc';
import {Bamme} from '../vocabulary/bamme';
import {Bammu} from '../vocabulary/bammu';

export class RdfModelUtil {
    static readonly defaultAspectModelAlias = '';

    static resolveNamespaceAlias(namespace: string, metaModelVersion: string): string {
        const bamm = new Bamm(metaModelVersion);
        const bammc = new Bammc(bamm);
        const bamme = new Bamme(bamm);
        const bammu = new Bammu(bamm);

        if (namespace.startsWith(bamm.getNamespace())) {
            return bamm.getAlias();
        }

        if (namespace.startsWith(bammc.getNamespace())) {
            return bammc.getAlias();
        }

        if (namespace.startsWith(bamme.getNamespace())) {
            return bamme.getAlias();
        }

        if (namespace.startsWith(bammu.getNamespace())) {
            return bammu.getAlias();
        }

        if (namespace.startsWith(Bamm.XSD_URI)) {
            return 'xsd';
        }

        if (namespace.startsWith(Bamm.RDF_URI)) {
            return 'rdf';
        }

        if (namespace.startsWith(Bamm.RDFS_URI)) {
            return 'rdfs';
        }

        return this.defaultAspectModelAlias;
    }

    static isBammDefinition(urn: string, bamm: Bamm): boolean {
        return urn && urn.includes(bamm.getNamespace());
    }

    static isBammcDefinition(urn: string, bammc: Bammc): boolean {
        return urn && urn.includes(bammc.getNamespace());
    }

    static isBammuDefinition(urn: string, bammu: Bammu): boolean {
        return urn && urn.includes(bammu.getNamespace());
    }

    static isCharacteristicInstance(urn: string, bammc: Bammc): boolean {
        return urn && urn.includes(bammc.getNamespace());
    }

    static isUnitInstance(urn: string, bammu: Bammu): boolean {
        return urn && urn.includes(bammu.getNamespace());
    }

    static isAspectModelDefinition(urn: string, rdfModel: RdfModel) {
        return urn && urn.includes(rdfModel.getAspectModelUrn());
    }

    static getValueWithoutUrnDefinition(value: any): string {
        if (value && (`${value}`.startsWith('urn:bamm') || `${value}`.startsWith(Bamm.XSD_URI) || `${value}`.startsWith(Bamm.RDF_URI))) {
            return `${value}`.split('#').pop();
        }
        return value === null ? '' : `${value}`;
    }

    static getValuesWithoutUrnDefinition(values: Array<Entity | string | number>): string {
        return values
            .map(value => {
                return value instanceof DefaultEntity ? value.name : RdfModelUtil.getValueWithoutUrnDefinition(value);
            })
            .join(', ');
    }

    static appendLocale(value: string, locale: string): string {
        return `${value} ${locale ? `@${locale}` : ''}`;
    }
}
