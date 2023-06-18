import type {
  JsonProperty,
  JsonPropertyDescriptor,
  JsonSchema,
  PropertyType,
} from '@cozemble/model-core'
import {
  type DataRecord,
  dottedNameFns,
  jsonDataTypes,
  modelEventFns,
  type ModelId,
  propertyDescriptors,
  type PropertyId,
  propertyIdFns,
  type PropertyName,
  propertyNameFns,
  type SystemConfiguration,
} from '@cozemble/model-core'
import { emptyProperty, NewJsonPropertyModelEvent } from '../events'
import { type Option, options } from '@cozemble/lang-util'

export const stringPropertyConfigurationSchema: JsonSchema = {
  $schema: 'http://json-schema.org/draft-07/schema#',
  $id: 'https://cozemble.com/schemas/property/json/string',
  type: 'object',
  properties: {
    pattern: {
      type: 'string',
    },
    patternExplanation: {
      type: 'string',
    },
    multipleLines: {
      type: 'boolean',
      description: 'Whether the text can have multiple lines',
    },
    prefix: {
      type: 'string',
    },
    suffix: {
      type: 'string',
    },
  },
}

export interface StringPropertyConfiguration {
  _type: 'string.property.configuration'
  pattern?: string
  patternExplanation?: string
  multipleLines?: boolean
  prefix?: string
  suffix?: string
}

export type JsonStringProperty = JsonProperty<
  typeof jsonDataTypes.string,
  string,
  StringPropertyConfiguration
>

export const stringPropertyType: PropertyType = {
  _type: 'property.type',
  value: 'json.string.property',
}

export const jsonStringPropertyDescriptor: JsonPropertyDescriptor<JsonStringProperty, string> = {
  _type: 'property.descriptor',
  isJsonPropertyDescriptor: true,
  configurationSchema: stringPropertyConfigurationSchema,
  propertyType: stringPropertyType,
  name: dottedNameFns.newInstance('String'),
  isRequireable: true,
  isUniqueable: true,
  newProperty: (
    systemConfiguration: SystemConfiguration,
    modelId: ModelId,
    propertyName: PropertyName,
    propertyId?: PropertyId,
  ): NewJsonPropertyModelEvent => {
    return {
      _type: 'new.json.property.model.event',
      ...modelEventFns.coreParts(modelId),
      propertyName,
      propertyType: stringPropertyType,
      jsonType: jsonDataTypes.string,
      propertyId: propertyId ?? propertyIdFns.newInstance(),
    }
  },

  validateProperty: (property: JsonStringProperty): Map<string, string> => {
    const result = new Map<string, string>()
    if (property.configuration.pattern) {
      try {
        new RegExp(property.configuration.pattern)
      } catch (e) {
        result.set('configuration.pattern', 'Invalid regular expression')
      }
    }

    return result
  },

  randomValue: (): string => {
    return (Math.random() + 1).toString(36).substring(2)
  },
  validateValue: (
    systemConfiguration: SystemConfiguration,
    property: JsonStringProperty,
    value: string | null,
  ): string[] => {
    if (property.required) {
      if (value === null || value === undefined || value === '') {
        return ['Required']
      }
    }
    if (property.configuration.pattern) {
      const regex = new RegExp(property.configuration.pattern)
      if (!regex.test(value ?? '')) {
        return [property.configuration.patternExplanation ?? 'Invalid format']
      }
    }
    return []
  },

  setValue: (
    systemConfiguration: SystemConfiguration,
    property: JsonStringProperty,
    record: DataRecord,
    value: string | null,
  ): DataRecord => {
    record.values[property.id.value] = value
    return record
  },

  getValue: (
    systemConfiguration: SystemConfiguration,
    property: JsonStringProperty,
    record: DataRecord,
  ): string | null => {
    return record.values[property.id.value] ?? null
  },
}

export function registerJsonStringProperty() {
  propertyDescriptors.register(jsonStringPropertyDescriptor)
  propertyDescriptors.setDefault(jsonStringPropertyDescriptor)
}

export type JsonStringPropertyOption = Option<JsonStringProperty>

export const jsonStringPropertyFns = {
  newInstance: (nameAsStr: string, ...opts: JsonStringPropertyOption[]): JsonStringProperty => {
    const name = propertyNameFns.newInstance(nameAsStr)
    return options.apply({ ...emptyProperty(nameAsStr), name }, ...opts)
  },
}

const required: JsonStringPropertyOption = (property) => {
  return { ...property, required: true }
}

const unique: JsonStringPropertyOption = (property) => {
  return { ...property, unique: true }
}

function pattern(pattern: string, patternExplanation?: string): JsonStringPropertyOption {
  return (property) => {
    return {
      ...property,
      configuration: {
        ...property.configuration,
        pattern,
        patternExplanation,
      },
    }
  }
}

export const jsonStringPropertyOptions = {
  required,
  unique,
  pattern,
}
