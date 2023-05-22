export function clickAddField(eq = 0) {
  cy.get('.dropdown.add-model-element').eq(eq).click()
  cy.get('a.add-field').eq(eq).click()
}

export function clickAddSubtable() {
  cy.get('.dropdown.add-model-element').click()
  cy.get('a.add-sub-table').click()
}

export function clickAddSubrecord() {
  cy.get('.dropdown.add-model-element').click()
  cy.get('a.add-sub-record').click()
}

export function editCell(cellIndex = '0-0', eq = 0) {
  const selector = cellSelector(cellIndex)
  cy.get(selector).eq(eq).click()
  cy.get(selector).eq(eq).should('have.class', 'focused')
  cy.get(selector).eq(eq).realPress('Enter')
}

export function cellSelector(cellIndex = '0-0') {
  return `[data-cell-index="${cellIndex}"]`
}
