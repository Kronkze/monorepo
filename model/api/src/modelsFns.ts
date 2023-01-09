import type {
  Cardinality,
  DataRecord,
  Model,
  ModelId,
  ModelOption,
  Property,
  PropertyId,
  PropertyOption,
} from '@cozemble/model-core'
import {
  DataRecordPath,
  emptyModel,
  modelNameFns,
  ModelPath,
  ModelPathElement,
  propertyDescriptors,
  propertyIdFns,
  Relationship,
} from '@cozemble/model-core'
import { clock, mandatory, options } from '@cozemble/lang-util'
import { propertyFns } from './propertyFns'
import { relationshipFns } from './relationshipFns'
import { modelPathFns } from './modelPathFns'

export const modelOptions = {
  withProperty(p: Property): ModelOption {
    return this.withProperties(p)
  },
  withProperties(...ps: Property[]): ModelOption {
    return (model) => ({ ...model, properties: [...model.properties, ...ps] })
  },
  withRelationships(...rs: Relationship[]): ModelOption {
    return (model) => ({ ...model, relationships: [...model.relationships, ...rs] })
  },
  withParentModelId(parentModelId: ModelId): ModelOption {
    return (model) => ({ ...model, parentModelId })
  },
}
export const modelFns = {
  newInstance: (name: string, ...opts: ModelOption[]): Model => {
    return options.apply(emptyModel(modelNameFns.newInstance(name)), ...opts)
  },
  findById(models: Model[], modelId: ModelId): Model {
    return mandatory(
      models.find((m) => m.id.value === modelId.value),
      `Model not found: ${modelId.value}`,
    )
  },
  propertyWithId(model: Model, propertyId: PropertyId): Property {
    return mandatory(
      model.properties.find((p) => propertyIdFns.equals(p.id, propertyId)),
      `Property not found: ${propertyId.value}`,
    )
  },
  setPropertyValue(
    model: Model,
    property: Property,
    value: any | null,
    record: DataRecord,
  ): DataRecord {
    return {
      ...propertyDescriptors.mandatory(property).setValue(property, record, value),
      updatedMillis: { _type: 'timestamp.epoch.millis', value: clock.now().getTime() },
    }
  },
  addRelationship(
    cardinality: Cardinality,
    modelName: string,
    relationshipName: string,
    model: Model,
  ): { model: Model; relatedModel: Model } {
    const relatedModel = modelFns.newInstance(modelName, modelOptions.withParentModelId(model.id))
    model = {
      ...model,
      relationships: [
        ...model.relationships,
        relationshipFns.newInstance(relationshipName, relatedModel.id, cardinality),
      ],
    }
    return { model, relatedModel }
  },
  addProperty(model: Model, ...propertyOpts: PropertyOption[]): Model {
    const property = propertyFns.newInstance('Untitled Property', ...propertyOpts)
    return {
      ...model,
      properties: [...model.properties, property],
    }
  },
  allPaths(models: Model[], model: Model): ModelPath<ModelPathElement>[] {
    const propertyPaths = model.properties.map((p) => modelPathFns.newInstance(p))
    const relationshipPaths = model.relationships.flatMap((r) => {
      return modelFns
        .allPaths(models, modelFns.findById(models, r.modelId))
        .map((p) => modelPathFns.prefix(r, p))
    })
    return [...propertyPaths, ...relationshipPaths]
  },
  validate(models: Model[], record: DataRecord): Map<DataRecordPath, string[]> {
    const model = modelFns.findById(models, record.modelId)
    const pathsToProperties: ModelPath<Property>[] = modelFns
      .allPaths(models, model)
      .filter((p) => modelPathFns.isPathToProperty(p)) as ModelPath<Property>[]
    return pathsToProperties.reduce((errors, path) => {
      const value = modelPathFns.getValues(models, path, record)
      const propertyErrors = propertyDescriptors
        .mandatory(path.lastElement)
        .validateValue(path.lastElement, value.value)
      if (propertyErrors.length > 0) {
        errors.set(value.path, propertyErrors)
      }
      return errors
    }, new Map<DataRecordPath, string[]>())
    // const propertyErrors = model.properties.reduce((errors, property) => {
    //   const value = propertyDescriptors.mandatory(property).getValue(property, record)
    //   const propertyErrors = propertyDescriptors.mandatory(property).validateValue(property, value)
    //   if (propertyErrors.length > 0) {
    //     errors.set(dataRecordPathFns.newInstance(property), propertyErrors)
    //   }
    //   return errors
    // }, new Map<DataRecordPath, string[]>())
    // return model.relationships.reduce((errors, relationship) => {
    //   if (relationship._type === 'has.one.relationship') {
    //     const value = record.values[relationship.id.value]
    //     if (value === null) {
    //       return errors
    //     }
    //   } else {
    //     throw new Error('Not implemented - has many relationships')
    //   }
    //   return errors
    // }, propertyErrors)
  },
}
