export interface PropertyType {
    _type: 'property.type'
    type: string
}

export const propertyTypeFns = {
    newInstance: (type: string): PropertyType => {
        return {
            _type: 'property.type',
            type
        }
    },
    equals: (a: PropertyType, b: PropertyType): boolean => {
        return a.type === b.type
    }
}


export interface PropertyDescriptor<T = Property> {
    _type: "property.descriptor"
    propertyType: PropertyType
    name: DottedName
    newProperty: () => T

    validate(property: T): Map<string, string>
}

export interface Property<T = any> {
    _type: PropertyType
    id: string
    version: number
    name: string
    randomValue: () => T

    setValue(record: DataRecord, value: T | null): DataRecord

    getValue(record: DataRecord): T | null
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

export type DataRecordPathElement = Property

export interface DataRecordPath<T = any> {
    _type: "data.record.path"
    parentElements: DataRecordPathElement[]
    property: Property<T>

    getValue(record: DataRecord): T | null

    setValue(record: DataRecord, t: T | null): DataRecord
}

export interface DottedName {
    _type: "dotted.name"
    name: string
}

export const registeredProperties: PropertyDescriptor[] = []

export const propertyDescriptors = {
    register: (descriptor: PropertyDescriptor) => {
        if (!registeredProperties.find(p => propertyTypeFns.equals(p.propertyType, descriptor.propertyType))) {
            registeredProperties.push(descriptor)
        }
    },
    get: (propertyType: PropertyType): PropertyDescriptor | null => {
        return registeredProperties.find(p => propertyTypeFns.equals(p.propertyType, propertyType)) ?? null
    },
    list: () => {
        return registeredProperties
    }
}