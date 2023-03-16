import { expect, test } from 'vitest'
import { dataRecordFns, testExports } from '@cozemble/model-api'
import { registerStringProperty } from '@cozemble/model-string-core'
import { modelToJson } from '../src/modelToJson'

const invoiceModels = testExports.invoiceModels
const invoiceModel = testExports.invoiceModel
const addressModel = testExports.addressModel
const customerModel = testExports.customerModel
const lineItemModel = testExports.lineItemModel

registerStringProperty()

test('can to-json an invoice with a customer', () => {
  const address = dataRecordFns.random(invoiceModels, addressModel, {
    'Line 1': '123 Main St',
    'Line 2': 'Town X',
    'Post code': '12345',
  })
  const customer = dataRecordFns.random(invoiceModels, customerModel, {
    'First name': 'John',
    'Last name': 'Smith',
    Phone: '1234567890',
    Email: 'john@email.com',
    Address: address,
  })
  const invoice = dataRecordFns.random(invoiceModels, invoiceModel, {
    'Invoice ID': 'invoice#33',
    Customer: customer,
  })

  const json = modelToJson(invoiceModels, invoice)
  expect(json).toEqual({
    'Invoice ID': 'invoice#33',
    Customer: {
      'First name': 'John',
      'Last name': 'Smith',
      Phone: '1234567890',
      Email: 'john@email.com',
      Address: {
        'Line 1': '123 Main St',
        'Line 2': 'Town X',
        'Post code': '12345',
      },
    },
  })
})

test('can to-json an invoice with  line items', () => {
  const lineItem1 = dataRecordFns.random(invoiceModels, lineItemModel, {
    Quantity: '1',
    Name: 'Item 1',
    Price: '10.00',
  })
  const lineItem2 = dataRecordFns.random(invoiceModels, lineItemModel, {
    Quantity: '2',
    Name: 'Item 2',
    Price: '20.00',
  })
  const invoice = dataRecordFns.random(invoiceModels, invoiceModel, {
    'Invoice ID': 'invoice#33',
    'Line Items': [lineItem1, lineItem2],
  })
  const json = modelToJson(invoiceModels, invoice)
  expect(json).toEqual({
    'Invoice ID': 'invoice#33',
    'Line Items': [
      {
        Quantity: '1',
        Name: 'Item 1',
        Price: '10.00',
      },
      {
        Quantity: '2',
        Name: 'Item 2',
        Price: '20.00',
      },
    ],
  })
})
