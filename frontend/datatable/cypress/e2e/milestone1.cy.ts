import { clickAddField, clickAddSubrecord, clickTable, editCell } from './helpers'

describe('data table', () => {
  it('supports building a simple customer and bookings database', () => {
    cy.visit('http://localhost:5173/empty')
    cy.get('.add-table-link').click()
    cy.get('.table-name').type('{selectall}Customers{enter}')
    cy.get('.edit-field-1').click()
    cy.get('input.property-name').type('{selectall}First name')
    cy.get('input.required-toggle').click()
    cy.get('button.save-property').click()
    clickAddField()
    cy.get('input.property-name').type('{selectall}Last name{enter}')
    clickAddField()
    cy.get('input.property-name').type('{selectall}Email')
    cy.get('input.required-toggle').click()
    cy.get('input.unique-toggle').click()
    cy.get('button.save-property').click()
    clickAddField()
    cy.get('input.property-name').type('{selectall}Phone')
    cy.get('input.required-toggle').click()
    cy.get('input.unique-toggle').click()
    cy.get('button.save-property').click()

    editCell('0-0')
    cy.focused().type('John').realPress('Tab')
    cy.focused().type('Smith').realPress('Tab')
    cy.focused().type('john@email.com').realPress('Tab')
    cy.focused().type('+44 7777 333444')
    cy.get('button.save-root-record').click()

    editCell('1-0')
    cy.focused().type('Jane').realPress('Tab')
    cy.focused().type('Smith').realPress('Tab')
    cy.focused().type('jane@email.com').realPress('Tab')
    cy.focused().type('+44 8888 444555')
    cy.get('button.save-root-record').click()

    cy.get('.add-table-link').click()
    cy.get('.table-name').type('{selectall}Bookings{enter}')
    cy.get('.edit-field-1').click()
    cy.get('input.property-name').type('{selectall}Customer')
    cy.get('select.property-type').select('Link to another record')
    cy.get('select.referenced-model').select('Customers')
    cy.get('input[name="cardinality"][value="one"]').click()
    cy.get('button.save-property').click()

    clickAddField()
    cy.get('input.property-name').type('{selectall}Date')
    cy.get('select.property-type').select('Date')
    cy.get('input.required-toggle').click()
    cy.get('button.save-property').click()

    clickAddField()
    cy.get('input.property-name').type('{selectall}Notes')
    cy.get('input.multipleLines').type('true')
    cy.get('button.save-property').click()

    clickAddSubrecord()
    cy.focused().type('{selectall}Bike{enter}')

    cy.get('.edit-field-1').eq(1).click()
    cy.get('input.property-name').type('{selectall}Make')
    cy.get('input.required-toggle').click()
    cy.get('button.save-property').click()

    clickAddField(1)
    cy.get('input.property-name').type('{selectall}Model')
    cy.get('input.required-toggle').click()
    cy.get('button.save-property').click()

    clickAddField(1)
    cy.get('input.property-name').type('{selectall}Pictures')
    cy.get('select.property-type').select('Attachment')
    cy.get('button.save-property').click()

    editCell('0-0')
    cy.focused().realPress('Enter')
    cy.contains('First name').click()
    cy.contains('Last name').click()
    cy.get('button.save-view').click()
    editCell('0-0')
    cy.get('select.reference-selector').select('Jane Smith')
    cy.get('input.date-input').invoke('val', '2023-11-23').trigger('change')
    cy.get('button.save-root-record').click()

    cy.get(`[data-cell-index="0-0"]`).eq(1).should('contain', 'Required')
    editCell('0-0', 1)
    cy.focused().type('Rayleigh').realPress('Tab')
    cy.focused().type('Banana')
    cy.get('button.save-root-record').click()

    clickTable(1)
    cy.contains('Configure view').eq(0).click()
    cy.contains('Date').click()
    cy.get('button.save-view').click()
  })
})
