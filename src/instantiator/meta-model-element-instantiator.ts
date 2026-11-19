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

import {NamedNode, Quad, Util} from 'n3';
import {Base, Characteristic, Event, Operation, Property} from '../aspect-meta-model/index.js';
import {PropertyInstantiator} from './property-instantiator.js';
import {CharacteristicInstantiator} from './characteristic/characteristic-instantiator.js';
import {Samm, SammC, SammE, SammU} from '../vocabulary/index.js';
import {EncodingConstraintInstantiator} from './constraint/encoding-constraint-instantiator.js';
import {DurationCharacteristicInstantiator} from './characteristic/duration-characteristic-instantiator.js';
import {RegularExpressionConstraintInstantiator} from './constraint/regular-expression-constraint-instantiator.js';
import {LanguageConstraintInstantiator} from './constraint/language-constraint-instantiator.js';
import {BaseMetaModelElement} from '../aspect-meta-model/base.js';
import {RangeConstraintInstantiator} from './constraint/range-constraint-instantiator.js';
import {SingleEntityInstantiator} from './characteristic/single-entity-instantiator.js';
import {EnumerationCharacteristicInstantiator} from './characteristic/enumeration-characteristic-instantiator.js';
import {MeasurementCharacteristicInstantiator} from './characteristic/measurement-characteristic-instantiator.js';
import {CollectionCharacteristicInstantiator} from './characteristic/collection-characteristic-instantiator.js';
import {LengthConstraintInstantiator} from './constraint/length-constraint-instantiator.js';
import {FixedPointConstraintInstantiator} from './constraint/fixed-point-constraint-instantiator.js';
import {LocaleConstraintInstantiator} from './constraint/locale-constraint-instantiator.js';
import {EitherCharacteristicInstantiator} from './characteristic/either-characteristic-instantiator.js';
import {StructuredValueCharacteristicInstantiator} from './characteristic/structured-value-instantiator.js';
import {ListCharacteristicInstantiator} from './characteristic/list-characteristic-instantiator.js';
import {StateCharacteristicInstantiator} from './characteristic/state-characteristic-instantiator.js';
import {SortedSetCharacteristicInstantiator} from './characteristic/sorted-set-characteristic-instantiator.js';
import {SetCharacteristicInstantiator} from './characteristic/set-characteristic-instantiator.js';
import {CodeCharacteristicInstantiator} from './characteristic/code-characteristic-instantiator.js';
import {OperationInstantiator} from './operation-instantiator.js';
import {TimeSeriesCharacteristicInstantiator} from './characteristic/timeseries-characteristic-instantiator.js';
import {CacheStrategy} from '../shared/model-element-cache.service.js';
import {ConstraintInstantiator} from './constraint/constraint-instantiator.js';
import {QuantifiableCharacteristicInstantiator} from './characteristic/quantifiable-characteristic-instantiator.js';
import {RdfModel} from '../shared/rdf-model.js';
import {TraitCharacteristicInstantiator} from './characteristic/trait-characteristic-instantiator.js';
import {EventInstantiator} from './event-instantiator.js';

export class MetaModelElementInstantiator {
    private characteristicInstantiator: CharacteristicInstantiator;
    private constraintInstantiator: ConstraintInstantiator;

    constructor(
        public rdfModel: RdfModel,
        public cacheService: CacheStrategy,
        public recursiveModelElements?: Map<string, Array<BaseMetaModelElement>>
    ) {
        this.characteristicInstantiator = this.setupCharacteristicInstantiatorProcessChain();
        this.constraintInstantiator = this.setupConstraintInstantiatorProcessChain();
    }

    private setupCharacteristicInstantiatorProcessChain(): CharacteristicInstantiator {
        const characteristicInstantiator = new CharacteristicInstantiator(this);
        const durationCharacteristicInstantiator = new DurationCharacteristicInstantiator(this, characteristicInstantiator);
        const enumerationCharacteristicInstantiator = new EnumerationCharacteristicInstantiator(this, durationCharacteristicInstantiator);
        const measurementCharacteristicInstantiator = new MeasurementCharacteristicInstantiator(
            this,
            enumerationCharacteristicInstantiator
        );
        const quantifiableCharacteristicInstantiator = new QuantifiableCharacteristicInstantiator(
            this,
            measurementCharacteristicInstantiator
        );
        const eitherCharacteristicInstantiator = new EitherCharacteristicInstantiator(this, quantifiableCharacteristicInstantiator);
        const collectionCharacteristicInstantiator = new CollectionCharacteristicInstantiator(this, eitherCharacteristicInstantiator);
        const structuredValueCharacteristicInstantiator = new StructuredValueCharacteristicInstantiator(
            this,
            collectionCharacteristicInstantiator
        );
        const listCharacteristicInstantiator = new ListCharacteristicInstantiator(this, structuredValueCharacteristicInstantiator);
        const singleEntityInstantiator = new SingleEntityInstantiator(this, listCharacteristicInstantiator);
        const stateCharacteristicInstantiator = new StateCharacteristicInstantiator(this, singleEntityInstantiator);
        const codeCharacteristicInstantiator = new CodeCharacteristicInstantiator(this, stateCharacteristicInstantiator);
        const sortedSetCharacteristicInstantiator = new SortedSetCharacteristicInstantiator(this, codeCharacteristicInstantiator);
        const setCharacteristicInstantiator = new SetCharacteristicInstantiator(this, sortedSetCharacteristicInstantiator);
        const traitCharacteristicInstantiator = new TraitCharacteristicInstantiator(this, setCharacteristicInstantiator);
        return new TimeSeriesCharacteristicInstantiator(this, traitCharacteristicInstantiator);
    }

    private setupConstraintInstantiatorProcessChain(): ConstraintInstantiator {
        const constraintInstantiator = new ConstraintInstantiator(this, null!);
        const rangeConstraintInstantiator = new RangeConstraintInstantiator(this, constraintInstantiator);
        const regularExpressionConstraintInstantiator = new RegularExpressionConstraintInstantiator(this, rangeConstraintInstantiator);
        const languageConstraintInstantiator = new LanguageConstraintInstantiator(this, regularExpressionConstraintInstantiator);
        const lengthConstraintInstantiator = new LengthConstraintInstantiator(this, languageConstraintInstantiator);
        const localeConstraintInstantiator = new LocaleConstraintInstantiator(this, lengthConstraintInstantiator);
        const fixedPointConstraintInstantiator = new FixedPointConstraintInstantiator(this, localeConstraintInstantiator);
        return new EncodingConstraintInstantiator(this, fixedPointConstraintInstantiator);
    }

    getProperties(subject: NamedNode): Array<Property> {
        const properties: Array<Property> = [];
        const propertyInstantiator = new PropertyInstantiator(this);

        this.rdfModel.store.getQuads(subject, this.samm.PropertiesProperty(), null, null).forEach(propertyQuad => {
            this.rdfModel
                .resolveBlankNodes(propertyQuad.object.value)
                .filter(
                    quad =>
                        this.samm.isRdfFirst(quad.predicate.value) ||
                        this.samm.isReferenceProperty(quad.predicate.value) ||
                        this.samm.isExtends(quad.predicate.value)
                )
                .forEach(quad => {
                    properties.push(propertyInstantiator.createProperty(quad));
                });
        });

        return properties;
    }

    getOperations(subject: NamedNode): Array<Operation> {
        const operations: Array<Operation> = [];
        const operationInstantiator = new OperationInstantiator(this);

        this.rdfModel.store.getQuads(subject, this.samm.OperationsProperty(), null, null).forEach(operationQuad => {
            this.rdfModel
                .resolveBlankNodes(operationQuad.object.value)
                .forEach(resolvedOperationQuad => operations.push(operationInstantiator.createOperation(resolvedOperationQuad)));
        });

        return operations;
    }

    getEvents(subject: NamedNode): Array<Event> {
        const events: Array<Event> = [];
        const eventInstantiator = new EventInstantiator(this);

        this.rdfModel.store.getQuads(subject, this.samm.EventsProperty(), null, null).forEach(eventQuad => {
            this.rdfModel
                .resolveBlankNodes(eventQuad.object.value)
                .forEach(resolvedEventQuad => events.push(eventInstantiator.createEvent(resolvedEventQuad)));
        });

        return events;
    }

    getCharacteristic(quad: Quad): Characteristic {
        return this.characteristicInstantiator.create(quad);
    }

    getConstraint(quad: Quad): Characteristic {
        return this.constraintInstantiator.create(quad);
    }

    initBaseProperties(quads: Array<Quad>, metaModelElement: BaseMetaModelElement, rdfModel: RdfModel) {
        let typeQuad: Quad | undefined;

        quads.forEach(quad => {
            if (this.samm.isDescriptionProperty(quad.predicate.value)) {
                this.addDescription(quad, metaModelElement);
            } else if (this.samm.isPreferredNameProperty(quad.predicate.value)) {
                this.addPreferredName(quad, metaModelElement);
            } else if (this.samm.isSeeProperty(quad.predicate.value)) {
                metaModelElement.addSeeReference(quad.object.value);
            } else if (quad.predicate.value === this.samm.RdfType().value) {
                typeQuad = quad;
            }
        });

        this.initAspectModelUrn(typeQuad, quads, metaModelElement as Base);

        if (!(<Base>metaModelElement).metaModelVersion) {
            (<Base>metaModelElement).metaModelVersion = rdfModel.samm.version;
        }
    }

    private initAspectModelUrn(typeQuad: Quad | undefined, quads: Array<Quad>, metaModelElement: Base) {
        if (typeQuad && !Util.isBlankNode(typeQuad.subject)) {
            metaModelElement.aspectModelUrn = `${typeQuad.subject.value}`;
        } else if (quads && quads.length > 0) {
            const propertyQuads = quads.find(quads => quads.predicate.value === this.samm.property().id);
            if (propertyQuads && Util.isBlankNode(quads[0].subject)) {
                metaModelElement.aspectModelUrn = propertyQuads.object.value;
            } else {
                metaModelElement.aspectModelUrn = quads[0].subject.id;
            }
        } else {
            metaModelElement.aspectModelUrn = `${this.rdfModel.getAspectModelUrn()}${Math.floor(Math.random() * 5000) + 1}`;
        }
    }

    private addDescription(quad: Quad, metaModelElement: BaseMetaModelElement) {
        if (this.rdfModel.getLocale(quad)) {
            metaModelElement.addDescription(this.rdfModel.getLocale(quad)!, quad.object.value);
        } else {
            metaModelElement.addDescription('en', quad.object.value);
        }
    }

    private addPreferredName(quad: Quad, metaModelElement: BaseMetaModelElement) {
        if (this.rdfModel.getLocale(quad)) {
            metaModelElement.addPreferredName(this.rdfModel.getLocale(quad)!, quad.object.value);
        } else {
            metaModelElement.addPreferredName('en', quad.object.value);
        }
    }

    get samm(): Samm {
        return this.rdfModel.samm;
    }

    get sammC(): SammC {
        return this.rdfModel.sammC;
    }

    get sammE(): SammE {
        return this.rdfModel.sammE;
    }

    get sammU(): SammU {
        return this.rdfModel.sammU;
    }
}
