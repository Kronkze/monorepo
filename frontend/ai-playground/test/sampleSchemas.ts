import { JsonSchema } from '@cozemble/model-core'

export const customerSchema: JsonSchema = {
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
        },
      },
      required: ['street', 'city', 'state', 'zipCode'],
    },
  },
  required: ['id', 'firstName', 'lastName', 'email', 'phoneNumber'],
}

export const invoiceSchema: JsonSchema = {
  $schema: 'http://json-schema.org/draft-07/schema#',
  $id: 'test-invoice-schema',
  title: 'Invoice',
  pluralTitle: 'Invoices',
  type: 'object',
  properties: {
    invoiceId: {
      type: 'string',
    },
    billingDate: {
      type: 'string',
      format: 'date',
    },
    dueDate: {
      type: 'string',
      format: 'date',
    },
    billingCompany: {
      type: 'string',
    },
    customerName: {
      type: 'string',
    },
    items: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          description: {
            type: 'string',
          },
          quantity: {
            type: 'number',
          },
          price: {
            type: 'number',
          },
        },
        required: ['description', 'quantity', 'price'],
      },
    },
    totalAmount: {
      type: 'number',
    },
  },
  required: [
    'invoiceId',
    'billingDate',
    'dueDate',
    'billingCompany',
    'customerName',
    'totalAmount',
  ],
}

export const actualInvoiceSchema1: JsonSchema = {
  title: 'Invoice',
  pluralTitle: 'Invoices',
  type: 'object',
  properties: {
    id: {
      type: 'string',
      unique: true,
    },
    customerName: {
      type: 'string',
    },
    customerAddress: {
      type: 'string',
    },
    invoiceDate: {
      type: 'string',
      format: 'date',
    },
    dueDate: {
      type: 'string',
      format: 'date',
    },
    totalAmount: {
      type: 'number',
    },
    taxRate: {
      type: 'number',
    },
    discount: {
      type: 'number',
    },
    lineItems: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          item: {
            type: 'string',
          },
          quantity: {
            type: 'integer',
          },
          price: {
            type: 'number',
          },
        },
        required: ['item', 'quantity', 'price'],
      },
    },
  },
  required: ['id', 'customerName', 'invoiceDate', 'dueDate', 'totalAmount'],
  $schema: 'http://json-schema.org/draft-07/schema#',
  $id: 'generated-schema1687158831737',
}

export const customerAsArray = {
  title: 'Customers',
  pluralTitle: 'Customers',
  type: 'array',
  items: {
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
      phone: {
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
            format: 'state',
          },
          zip: {
            type: 'string',
            format: 'zip-code',
          },
        },
        required: ['street', 'city', 'state', 'zip'],
      },
      birthday: {
        type: 'object',
        properties: {
          date: {
            type: 'string',
            format: 'date',
          },
          time: {
            type: 'string',
            format: 'time',
          },
        },
        required: ['date', 'time'],
      },
    },
    required: ['id', 'firstName', 'lastName', 'email', 'phone', 'address', 'birthday'],
  },
  $schema: 'http://json-schema.org/draft-07/schema#',
  $id: 'generated-schema1687171796354',
}

export const amendedCustomerSchema: JsonSchema = {
  $schema: 'http://json-schema.org/draft-07/schema#',
  title: 'Customer',
  pluralTitle: 'Customers',
  $id: 'd76518dc-eebd-4975-b8c2-f55e11fbc613',
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
    phone: {
      type: 'string',
      format: 'phone',
    },
    dateOfBirth: {
      type: 'string',
      format: 'date',
    },
    gender: {
      type: 'string',
    },
    notes: {
      type: 'string',
    },
    address: {
      type: 'object',
      properties: {
        houseNameNumber: {
          type: 'string',
        },
        street: {
          type: 'string',
        },
        city: {
          type: 'string',
          enum: [
            'Birmingham',
            'Bradford',
            'Brighton and Hove',
            'Bristol',
            'Cambridge',
            'Canterbury',
            'Carlisle',
            'Chester',
            'Chichester',
            'Coventry',
            'Derby',
            'Durham',
            'Ely',
            'Exeter',
            'Gloucester',
            'Hereford',
            'Kingston upon Hull',
            'Lancaster',
            'Leeds',
            'Leicester',
            'Lichfield',
            'Lincoln',
            'Liverpool',
            'City of London',
            'Manchester',
            'Newcastle upon Tyne',
            'Norwich',
            'Nottingham',
            'Oxford',
            'Peterborough',
            'Plymouth',
            'Portsmouth',
            'Preston',
            'Ripon',
            'Salford',
            'Salisbury',
            'Sheffield',
            'Southampton',
            'St Albans',
            'Stoke-on-Trent',
            'Sunderland',
            'Truro',
            'Wakefield',
            'Wells',
            'Westminster',
            'Winchester',
            'Wolverhampton',
            'Worcester',
            'York',
          ],
        },
        county: {
          type: 'string',
        },
        postCode: {
          type: 'string',
          pattern: '^[A-Z]{1,2}[0-9]{1,2}[A-Z]? [0-9][A-Z]{2}$',
        },
        country: {
          type: 'string',
          enum: ['United Kingdom'],
        },
      },
      required: ['houseNameNumber', 'street', 'city', 'postCode', 'country'],
    },
  },
  required: ['id', 'firstName', 'lastName', 'email'],
}