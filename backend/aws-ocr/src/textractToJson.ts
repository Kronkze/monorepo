import { arrays, mandatory } from '@cozemble/lang-util'
import { Block, Relationship } from '@aws-sdk/client-textract'
import { Line, Page, Row, Table } from '@cozemble/backend-aws-ocr-types'

export interface ProcessedTextractDocument {
  pages: Page[]
}

export type BlockFinder = (id: string) => Block | undefined

interface ProcessedCell {
  _type: 'cell'
  rowIndex: number
  columnIndex: number
  text: string
}

function lineToJson(line: Block): Line {
  if (line.BlockType !== 'LINE') {
    throw new Error(`Expected line, got ${line.BlockType}`)
  }
  if (!line.Text) {
    throw new Error(`Expected line to have text`)
  }
  return { _type: 'line', text: line.Text }
}

function toProcessedCell(blockFinder: BlockFinder, cell: Block): ProcessedCell {
  if (cell.BlockType !== 'CELL') {
    throw new Error(`Expected cell, got ${cell.BlockType}`)
  }
  if (!cell.RowIndex || !cell.ColumnIndex) {
    throw new Error(`Expected cell to have RowIndex and ColumnIndex`)
  }
  const text = getChildBlocks(blockFinder, cell)
    .map((line) => {
      if (line.BlockType !== 'WORD') {
        throw new Error(`Expected word, got ${line.BlockType}`)
      }
      return line.Text
    })
    .join(' ')

  return { _type: 'cell', rowIndex: cell.RowIndex - 1, columnIndex: cell.ColumnIndex - 1, text }
}

function tableToJson(blockFinder: BlockFinder, item: Block): Table {
  if (item.BlockType !== 'TABLE') {
    throw new Error(`Expected table, got ${item.BlockType}`)
  }
  const cells = getChildBlocks(blockFinder, item).map((cell) => toProcessedCell(blockFinder, cell))
  const rowMap = arrays.groupBy(cells, (cell) => cell.rowIndex)
  const rowKeys = Array.from(rowMap.keys()).sort()
  const rows = rowKeys
    .map((rowKey) => rowMap.get(rowKey) as ProcessedCell[])
    .map((cells) => ({ _type: 'row', cells: cells.map((cell) => cell.text) } as Row))

  return { _type: 'table', rows }
}

function linesInTable(blockFinder: BlockFinder, lines: Block[], table: Block): Block[] {
  if (table.BlockType !== 'TABLE') {
    throw new Error(`Expected table, got ${table.BlockType}`)
  }
  const wordsInTables = getChildBlocks(blockFinder, table).flatMap((cell) =>
    getChildBlocks(blockFinder, cell),
  )
  return lines.filter((line) => {
    const wordsInLine = getChildBlocks(blockFinder, line)
    return wordsInTables.some((word) => wordsInLine.includes(word))
  })
}

function getChildBlocks(blockFinder: BlockFinder, block: Block): Block[] {
  const relationships = block.Relationships ?? ([] as Relationship[])
  const ids = relationships.flatMap((rel) =>
    rel.Type === 'CHILD' ? rel.Ids ?? [] : ([] as string[]),
  )
  return ids.map((id) => blockFinder(id)).filter((block): block is Block => !!block)
}

function pageToJson(blockFinder: BlockFinder, page: Block): Page {
  if (page.BlockType !== 'PAGE') {
    throw new Error(`Expected page, got ${page.BlockType}`)
  }
  let linesAndTables = getChildBlocks(blockFinder, page)
    .filter((block) => block.BlockType === 'LINE' || block.BlockType === 'TABLE')
    .sort((a, b) => {
      const leftA = mandatory(a.Geometry?.BoundingBox?.Left, `Left A`).toFixed(2)
      const topA = mandatory(a.Geometry?.BoundingBox?.Top, `Top A`).toFixed(2)
      const leftB = mandatory(b.Geometry?.BoundingBox?.Left, `Left B`).toFixed(2)
      const topB = mandatory(b.Geometry?.BoundingBox?.Top, `Top B`).toFixed(2)
      if (topA === topB) {
        return leftA < leftB ? -1 : 1
      }
      return topA < topB ? -1 : 1
    })

  const lines = linesAndTables.filter((item) => item.BlockType === 'LINE')
  const tables = linesAndTables.filter((item) => item.BlockType === 'TABLE')
  const linesInTables = tables.flatMap((table) => linesInTable(blockFinder, lines, table))
  linesAndTables = linesAndTables.filter((item) => !linesInTables.includes(item))
  const items = linesAndTables.map((item) => {
    if (item.BlockType === 'LINE') {
      return lineToJson(item)
    } else if (item.BlockType === 'TABLE') {
      return tableToJson(blockFinder, item)
    }
    throw new Error(`Unknown block type ${item.BlockType}`)
  })
  return { items }
}

function makeBlockFinder(allBlocks: Block[]): BlockFinder {
  return (id: string) => allBlocks.find((block) => block.Id === id)
}

export function textractToJson(allBlocks: Block[]): ProcessedTextractDocument {
  const pages = allBlocks
    .filter((block) => block.BlockType === 'PAGE')
    .map((page) => pageToJson(makeBlockFinder(allBlocks), page))
  return { pages }
}