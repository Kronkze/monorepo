export interface Line {
  _type: 'line'
  text: string
}

export interface Row {
  _type: 'row'
  cells: string[]
}

export interface Table {
  _type: 'table'
  rows: Row[]
  label?: string
  hasHeader?: boolean
}

export type BlockItem = Line | Table

export interface Page {
  items: BlockItem[]
}
