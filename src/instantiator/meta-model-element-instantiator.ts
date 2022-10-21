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

import {NamedNode, Quad, Util} from 'n3';
import {Base, Characteristic, Event, Operation, Property} from '../aspect-meta-model';
import {PropertyInstantiator} from './property-instantiator';
import {CharacteristicInstantiator} from './characteristic/characteristic-instantiator';
import {Bamm, Bammc, Bamme, Bammu} from '../vocabulary';
import {EncodingConstraintInstantiator} from './constraint/encoding-constraint-instantiator';
import {DurationCharacteristicInstantiator} from './characteristic/duration-characteristic-instantiator';
import {RegularExpressionConstraintInstantiator} from './constraint/regular-expression-constraint-instantiator';
import {LanguageConstraintInstantiator} from './constraint/language-constraint-instantiator';
import {BaseMetaModelElement} from '../aspect-meta-model/base';
import {RangeConstraintInstantiator} from './constraint/range-constraint-instantiator';
import {SingleEntityInstantiator} from './characteristic/single-entity-instantiator';
import {EnumerationCharacteristicInstantiator} from './characteristic/enumeration-characteristic-instantiator';
import {MeasurementCharacteristicInstantiator} from './characteristic/measurement-characteristic-instantiator';
import {CollectionCharacteristicInstantiator} from './characteristic/collection-characteristic-instantiator';
import {LengthConstraintInstantiator} from './constraint/length-constraint-instantiator';
import {FixedPointConstraintInstantiator} from './constraint/fixed-point-constraint-instantiator';
import {LocaleConstraintInstantiator} from './constraint/locale-constraint-instantiator';
import {EitherCharacteristicInstantiator} from './characteristic/either-characteristic-instantiator';
import {StructuredValueCharacteristicInstantiator} from './characteristic/structured-value-instantiator';
import {ListCharacteristicInstantiator} from './characteristic/list-characteristic-instantiator';
import {StateCharacteristicInstantiator} from './characteristic/state-characteristic-instantiator';
import {SortedSetCharacteristicInstantiator} from './characteristic/sorted-set-characteristic-instantiator';
import {SetCharacteristicInstantiator} from './characteristic/set-characteristic-instantiator';
import {CodeCharacteristicInstantiator} from './characteristic/code-characteristic-instantiator';
import {OperationInstantiator} from './operation-instantiator';
import {TimeSeriesCharacteristicInstantiator} from './characteristic/timeseries-characteristic-instantiator';
import {CacheStrategy} from '../shared/model-element-cache.service';
import {ConstraintInstantiator} from './constraint/constraint-instantiator';
import {QuantifiableCharacteristicInstantiator} from './characteristic/quantifiable-characteristic-instantiator';
import {RdfModel} from '../shared/rdf-model';
import {TraitCharacteristicInstantiator} from './characteristic/trait-characteristic-instantiator';
import {EventInstantiator} from './event-instantiator';

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
        const constraintInstantiator = new ConstraintInstantiator(this, null);
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

        this.rdfModel.store.getQuads(subject, this.BAMM().PropertiesProperty(), null, null).forEach(propertyQuad => {
            this.rdfModel
                .resolveBlankNodes(propertyQuad.object.value)
                .filter(
                    quad =>
                        this.BAMM().isRdfFirst(quad.predicate.value) ||
                        this.BAMM().isReferenceProperty(quad.predicate.value) ||
                        this.BAMM().isExtends(quad.predicate.value)
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

        this.rdfModel.store.getQuads(subject, this.BAMM().OperationsProperty(), null, null).forEach(operationQuad => {
            this.rdfModel
                .resolveBlankNodes(operationQuad.object.value)
                .forEach(resolvedOperationQuad => operations.push(operationInstantiator.createOperation(resolvedOperationQuad)));
        });

        return operations;
    }

    getEvents(subject: NamedNode): Array<Event> {
        const events: Array<Event> = [];
        const eventInstantiator = new EventInstantiator(this);

        this.rdfModel.store.getQuads(subject, this.BAMM().EventsProperty(), null, null).forEach(eventQuad => {
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
        let typeQuad: Quad;

        quads.forEach(quad => {
            if (this.BAMM().isDescriptionProperty(quad.predicate.value)) {
                this.addDescription(quad, metaModelElement);
            } else if (this.BAMM().isPreferredNameProperty(quad.predicate.value)) {
                this.addPreferredName(quad, metaModelElement);
            } else if (this.BAMM().isSeeProperty(quad.predicate.value)) {
                metaModelElement.addSeeReference(quad.object.value);
            } else if (quad.predicate.value === this.BAMM().RdfType().value) {
                typeQuad = quad;
            }
        });

        this.initAspectModelUrn(typeQuad, quads, metaModelElement as Base);

        if (!(<Base>metaModelElement).metaModelVersion) {
            (<Base>metaModelElement).metaModelVersion = rdfModel.BAMM().version;
        }
    }

    private initAspectModelUrn(typeQuad: Quad, quads: Array<Quad>, metaModelElement: Base) {
        if (typeQuad && !Util.isBlankNode(typeQuad.subject)) {
            metaModelElement.aspectModelUrn = `${typeQuad.subject.value}`;
        } else if (quads && quads.length > 0) {
            const propertyQuads = quads.find(quads => quads.predicate.value === this.BAMM().property().id);
            if(propertyQuads && Util.isBlankNode(quads[0].subject)) {
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
            metaModelElement.addDescription(this.rdfModel.getLocale(quad), quad.object.value);
        } else {
            metaModelElement.addDescription('en', quad.object.value);
        }
    }

    private addPreferredName(quad: Quad, metaModelElement: BaseMetaModelElement) {
        if (this.rdfModel.getLocale(quad)) {
            metaModelElement.addPreferredName(this.rdfModel.getLocale(quad), quad.object.value);
        } else {
            metaModelElement.addPreferredName('en', quad.object.value);
        }
    }

    BAMM(): Bamm {
        return this.rdfModel.BAMM();
    }

    BAMMC(): Bammc {
        return this.rdfModel.BAMMC();
    }

    BAMME(): Bamme {
        return this.rdfModel.BAMME();
    }

    BAMMU(): Bammu {
        return this.rdfModel.BAMMU();
    }
}
