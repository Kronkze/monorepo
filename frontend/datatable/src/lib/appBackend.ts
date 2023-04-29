import { type Backend, notImplementedBackend } from './backend/Backend'
import type { EventSourcedModel } from '@cozemble/model-event-sourced'
import type { JustErrorMessage } from '@cozemble/lang-util'
import { RootRecordsContext } from './records/RecordsContext'
import type { DataRecord, DataRecordId, ModelId } from '@cozemble/model-core'
import type { Writable } from 'svelte/store'
import type { AttachmentsManager, RecordSearcher } from '@cozemble/data-paginated-editor'
import type { AttachmentIdAndFileName, UploadedAttachment } from '@cozemble/data-editor-sdk'

let backend = notImplementedBackend

export const backendFns = {
  setBackend: (newBackend: Backend) => {
    backend = newBackend
  },
}

export async function saveModel(model: EventSourcedModel): Promise<JustErrorMessage | null> {
  return backend.saveModel(model)
}

export async function saveModels(models: EventSourcedModel[]): Promise<JustErrorMessage | null> {
  return backend.saveModels(models)
}

export function rootRecordsContext(
  onError: (error: JustErrorMessage) => void,
  models: Writable<EventSourcedModel[]>,
  modelId: ModelId,
): RootRecordsContext {
  return new RootRecordsContext(backend, onError, modelId, models)
}

export const recordSearcher: RecordSearcher = {
  async recordById(modelId: ModelId, recordId: DataRecordId): Promise<DataRecord | null> {
    throw new Error('Not implemented')
  },
  async searchRecords(modelId: ModelId, searchTerm: string): Promise<DataRecord[]> {
    throw new Error('Not implemented')
  },
}

export const attachmentsManager: AttachmentsManager = {
  async uploadAttachments(
    files: File[],
    progressUpdater: (percent: number) => void,
  ): Promise<UploadedAttachment[]> {
    throw new Error('Not implemented')
  },

  async deleteAttachments(attachmentIds: string[]): Promise<void> {
    throw new Error('Not implemented')
  },

  async getAttachmentViewUrls(attachmentIds: AttachmentIdAndFileName[]): Promise<string[]> {
    throw new Error('Not implemented')
  },
}

export const defaultOnError = (error: JustErrorMessage) => {
  console.error(error)
}
