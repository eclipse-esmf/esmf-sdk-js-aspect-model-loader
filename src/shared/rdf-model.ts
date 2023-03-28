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

import {DataFactory, NamedNode, Quad, Store, Util} from 'n3';
import {RdfModelUtil} from './rdf-model-util';
import * as locale from 'locale-codes';
import {Samm} from '../vocabulary/samm';
import {SammC} from '../vocabulary/samm-c';
import {SammE} from '../vocabulary/samm-e';
import {SammU} from '../vocabulary/samm-u';
import {XsdDataTypes} from './xsd-datatypes';
import {KnownVersion, SammVersion} from './known-version';

export class RdfModel {
    private prefixes = Array<string>();
    private metaModelVersion: string;

    public readonly samm: Samm;
    public readonly sammC: SammC;
    public readonly sammE: SammE;
    public readonly sammU: SammU;
    public xsdDataTypes: XsdDataTypes;

    constructor(public store: Store, metaModelVersion?: string, aspectModelUrn?: string) {
        if (metaModelVersion) {
            this.metaModelVersion = metaModelVersion;
        } else {
            this.resolveMetaModelVersion();
        }
        this.xsdDataTypes = new XsdDataTypes(this.metaModelVersion);
        this.samm = new Samm(this.metaModelVersion);
        this.sammC = new SammC(this.samm);
        this.sammE = new SammE(this.samm);
        this.sammU = new SammU(this.samm);
        if (aspectModelUrn) {
            this.addPrefix('', `${aspectModelUrn}#`);
        }
        this.addPrefix('xsd', this.samm.getXSDNameSpace());
        this.addPrefix(this.samm.getAlias(), this.samm.getNamespace());
        this.addPrefix(this.sammU.getAlias(), this.sammU.getNamespace());
        this.addPrefix(this.sammC.getAlias(), this.sammC.getNamespace());
        this.addPrefix(this.sammE.getAlias(), this.sammE.getNamespace());
        this.resolveNamespaces();
    }

    public getMetaModelVersion(): SammVersion | undefined {
        return KnownVersion.fromVersionString(this.metaModelVersion) || undefined;
    }

    public getNamespaces(): string[] {
        return Object.keys(this.prefixes).map(key => this.prefixes[key]);
    }

    public getPrefixes(): string[] {
        return this.prefixes;
    }

    public getAspectModelUrn(): string {
        return this.getPrefixes()[RdfModelUtil.defaultAspectModelAlias];
    }

    public addPrefix(alias: string, namespace: string): void {
        this.prefixes[alias] = namespace;
    }

    public getLocale(quad: Quad) {
        if (quad && quad.object['language']) {
            return locale.getByTag(quad.object['language']).tag;
        }
        return null;
    }

    public resolveBlankNodes(uri: string, resolvedNodes: Array<Quad> = []): Array<Quad> {
        this.store.getQuads(DataFactory.blankNode(uri), null, null, null).forEach(value => {
            if (Util.isBlankNode(value.object)) {
                this.resolveBlankNodes(value.object.value, resolvedNodes);
            } else if (!value.object.value.startsWith(Samm.RDF_URI)) {
                resolvedNodes.push(DataFactory.quad(value.subject, value.predicate, value.object));
            }
        });

        return resolvedNodes;
    }

    public resolveParent(quad: Quad): Quad {
        let parentQuad = quad;
        if (Util.isBlankNode(quad.subject)) {
            parentQuad = this.store.getQuads(null, null, quad.subject.id, null)[0];
            if (parentQuad === undefined) {
                return quad;
            } else if (Util.isBlankNode(parentQuad.object)) {
                parentQuad = this.resolveParent(parentQuad);
            }
        }
        return parentQuad;
    }

    public findAnyProperty(quad: Quad | NamedNode): Array<Quad> {
        if (quad instanceof Quad) {
            return this.store.getQuads(quad.object, null, null, null);
        } else {
            return this.store.getQuads(quad, null, null, null);
        }
    }

    private resolveMetaModelVersion(): void {
        const metaModelPrefix = this.store
            .getQuads(null, null, null, null)
            .find(quad => quad.object.value.startsWith('urn:samm:org.eclipse.esmf.samm:meta-model:'));
        if (metaModelPrefix) {
            const prefixPart = metaModelPrefix.object.value.split(':');
            this.metaModelVersion = prefixPart[prefixPart.length - 1].split('#')[0];
        } else {
            this.metaModelVersion = 'unknown';
        }
    }

    private resolveNamespaces(): void {
        this.store.getQuads(null, null, null, null).forEach(quad => {
            if (quad.object.value.startsWith('urn') || quad.object.value.startsWith('http://www.w3.org/2001/XMLSchema')) {
                const namespace = quad.object.value.split('#')[0] + '#';
                this.addPrefix(RdfModelUtil.resolveNamespaceAlias(namespace, this.metaModelVersion || ''), namespace);
            }
        });
    }
}
