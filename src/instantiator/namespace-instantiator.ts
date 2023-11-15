import {RdfModel} from '../shared/rdf-model';
import {CacheStrategy} from '../shared/model-element-cache.service';
import {BaseMetaModelElement} from '../aspect-meta-model';
import {NamedNode, Quad} from 'n3';
import {MetaModelElementInstantiator} from './meta-model-element-instantiator';
import {EntityInstantiator} from './entity-instantiator';
import {AspectInstantiator} from './aspect-instantiator';

export class NamespaceInstantiator {
    private readonly recursiveModelElements: Map<string, Array<BaseMetaModelElement>>;

    constructor(private rdfModel: RdfModel, private cacheService: CacheStrategy) {
        this.recursiveModelElements = new Map<string, Array<BaseMetaModelElement>>();
    }
    /**
     * Iterates over all triples in the store and instantiate it. Related to that
     * all object will be pushed to the cache which can be used later to group all
     * object by namespace.
     */
    createNamespaces(): Map<string, Array<BaseMetaModelElement>> {
        const metaModelElementInstantiator = new MetaModelElementInstantiator(
            this.rdfModel,
            this.cacheService,
            this.recursiveModelElements
        );

        const aspectInstantiator = new AspectInstantiator(this.rdfModel, this.cacheService);
        const entityInstantiator = new EntityInstantiator(metaModelElementInstantiator);

        this.loadModelElements(this.rdfModel.samm.Aspect(), (quad: Quad) => aspectInstantiator.createAspect(quad.subject.value));

        this.loadModelElements(this.rdfModel.samm.Entity(), (quad: Quad) =>
            entityInstantiator.createEntity(metaModelElementInstantiator.rdfModel.store.getQuads(quad.object, null, null, null))
        );

        this.loadModelElements(this.rdfModel.samm.Event(), (quad: Quad) =>
            metaModelElementInstantiator.getEvents(quad.subject as NamedNode)
        );

        this.loadModelElements(this.rdfModel.samm.Operation(), (quad: Quad) =>
            metaModelElementInstantiator.getOperations(quad.subject as NamedNode)
        );

        this.loadModelElements(this.rdfModel.samm.Property(), (quad: Quad) =>
            metaModelElementInstantiator.getProperties(quad.subject as NamedNode)
        );

        const allElementsByNamespace = new Map<string, Array<BaseMetaModelElement>>();
        this.cacheService.filter(baseMetaModelElement => {
            if (!baseMetaModelElement.namespace || baseMetaModelElement.namespace.length == 0) {
                return true;
            }
            if (!allElementsByNamespace.has(baseMetaModelElement.namespace)) {
                allElementsByNamespace.set(baseMetaModelElement.namespace, []);
            }
            allElementsByNamespace.get(baseMetaModelElement.namespace).push(baseMetaModelElement);
            return false;
        });

        return allElementsByNamespace;
    }

    private loadModelElements(type: NamedNode, instantiatorFunction) {
        this.rdfModel.store.getQuads(null, this.rdfModel.samm.RdfType(), type, null).forEach(instantiatorFunction);
    }
}
