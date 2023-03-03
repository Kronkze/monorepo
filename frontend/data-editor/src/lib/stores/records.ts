import type { Writable } from 'svelte/store'

import { writable, get } from 'svelte/store'
import Ajv from 'ajv'
import _ from 'lodash'

import { removeEmptyValues, initValues, getDifference } from '$lib/utils'
import { selectedModel } from './models'
import { addErrors } from '$lib/stores/errors'

export const currentRecord: Writable<ObjectValue> = writable({})

//

// * Version logging

const LOG_TIMEOUT = 1000
export const recordLogs: Writable<ObjectValue[]> = writable([])

/** To debounce the logging of the record and be able to cancel the timeout */
let currentTimeout: NodeJS.Timeout

function createLog(record: ObjectValue) {
  recordLogs.update((logs) => {
    const lastLog = _.last([...logs])

    // no need to log if the record is the same as the last log
    if (lastLog && _.isEqual(record, lastLog)) return logs

    return [...logs, { ...record }]
  })
}

selectedModel.subscribe((model) => {
  currentRecord.set(initValues(model?.properties || {}))
  createLog({ ...get(currentRecord) })
})

// listen to changes in the record and log them
currentRecord.subscribe((record) => {
  console.warn('record changed', record.invoiceNumber)

  // Clear the timeout action if it exists to keep debouncing
  if (currentTimeout) clearTimeout(currentTimeout)

  currentTimeout = setTimeout(() => createLog(record), LOG_TIMEOUT)
})

/** Go back to the previous record and remove the last record from the log */
export const takeBack = async () => {
  const logs = [...get(recordLogs)]

  if (logs.length < 2) return // can't take back if there is only one record

  recordLogs.set(logs.slice(0, -1))
  currentRecord.set({ ...logs[logs.length - 2] })
  clearTimeout(currentTimeout)
}

//

// * Last saved record

export const lastSavedRecord: Writable<ObjectValue> = writable({})

selectedModel.subscribe((model) => {
  lastSavedRecord.set(initValues(model?.properties || {}))
})

export const getDifferenceFromLastSavedRecord = (record: ObjectValue) => ({
  from: getDifference(record, get(lastSavedRecord)),
  to: getDifference(get(lastSavedRecord), record),
})

//

// * Validation

export async function validateRecord(record: ObjectValue) {
  // create ajv instance
  const ajv = new Ajv({
    allErrors: true,
  })

  ajv.addVocabulary(['coz', 'formula', 'customComponent']) // cozemble specific keywords

  const validate = ajv.compile(get(selectedModel))
  const valid = validate(removeEmptyValues(record))

  console.log('valid: ', valid)

  addErrors(validate.errors)

  return valid
}

recordLogs.subscribe((logs) => {
  console.table(logs.map((l) => l.invoiceNumber))
})
