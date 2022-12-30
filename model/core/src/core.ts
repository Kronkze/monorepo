import {uuids} from "@cozemble/lang-util"

export interface PropertyDescriptor<T = Property> {
    _type: "property.descriptor"
    id: string
    name: DottedName
    newProperty: () => T

    validate(property: T): Map<string, string>
}

export interface Property<T = any> {
    _type: string
    id: string
    name: string
    randomValue: () => T
}

export interface ModelId {
    _type: "model.id"
    id: string
}

export interface Model {
    _type: "model"
    id: ModelId
    name: string
    properties: Property[]
}

export let models = {
    newInstance: (name: string, ...properties: Property[]): Model => {
        return {
            _type: "model",
            id: {
                _type: "model.id",
                id: uuids.v4()
            },
            name,
            properties
        }
    },
    setPropertyValue<T = any>(model: Model, property: Property<T>, value: T | null, record: DataRecord): DataRecord {
        return {
            ...record,
            updatedMillis: {_type: "timestamp.epoch.millis", value: Date.now()},
            values: {
                ...record.values,
                [property.id]: value
            }
        }
    }
}

export interface DataRecordId {
    _type: "data.record.id"
    id: string
}

export interface TimestampEpochMillis {
    _type: "timestamp.epoch.millis"
    value: number
}

export interface UserId {
    _type: "user.id"
    id: string
}

export interface DataRecord {
    _type: "data.record"
    modelId: ModelId
    id: DataRecordId
    createdMillis: TimestampEpochMillis
    updatedMillis: TimestampEpochMillis
    createdBy: UserId
    values: { [key: string]: any }
}

export interface DottedName {
    _type: "dotted.name"
    name: string
}

export const registeredProperties: PropertyDescriptor[] = []

export const propertyRegistry = {
    register: (descriptor: PropertyDescriptor) => {
        if (!registeredProperties.find(p => p.id === descriptor.id)) {
            registeredProperties.push(descriptor)
        }
    },
    get: (id: string): PropertyDescriptor | null => {
        return registeredProperties.find(p => p.id === id) ?? null
    },
    list: () => {
        return registeredProperties
    }
}