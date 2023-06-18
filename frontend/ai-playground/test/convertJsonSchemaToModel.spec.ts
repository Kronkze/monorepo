import { expect, test } from 'vitest'
import { JsonSchema, Property } from '@cozemble/model-core'
import { helpers } from '../src/lib/generative/components/helpers'
import { registerJsonProperties } from '@cozemble/model-properties-core/dist/esm'

const customerSchema: JsonSchema = {
  $schema: 'http://json-schema.org/draft-07/schema#',
  $id: 'test-customer-schema',
  title: 'Customer',
  pluralTitle: 'Customers',
  type: 'object',
  properties: {
    id: {
      type: 'string',
      unique: true,
    },
    firstName: {
      type: 'string',
    },
    lastName: {
      type: 'string',
    },
    email: {
      type: 'string',
      format: 'email',
    },
    phoneNumber: {
      type: 'string',
      format: 'phone',
    },
    address: {
      type: 'object',
      properties: {
        street: {
          type: 'string',
        },
        city: {
          type: 'string',
        },
        state: {
          type: 'string',
        },
        zipCode: {
          type: 'string',
          format: 'postcode',
        },
      },
      required: ['street', 'city', 'state', 'zipCode'],
    },
  },
  required: ['id', 'firstName', 'lastName', 'email', 'phoneNumber', 'address'],
}

registerJsonProperties()

test('can convert customer response', () => {
  const { model, allModels } = helpers(customerSchema)
  expect(model.slots.map((slot) => slot.name.value)).toEqual([
    'Id',
    'First Name',
    'Last Name',
    'Email',
    'Phone Number',
  ])
  expect((model.slots[0] as Property).unique).toBe(true)
  expect((model.slots[4] as Property).propertyType.value).toBe('json.phoneNumber.property')
})
