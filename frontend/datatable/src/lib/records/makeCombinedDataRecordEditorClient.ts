import type {
  AttachmentIdAndFileName,
  DataRecordEditorClient,
  DataRecordViewerClient,
  RecordGraphModifier,
  UploadedAttachment,
} from '@cozemble/data-editor-sdk'
import type {
  DataRecord,
  DataRecordId,
  Model,
  ModelId,
  ModelView,
  SystemConfiguration,
} from '@cozemble/model-core'
import type { EventSourcedRecordGraphStore } from './EventSourcedRecordGraphStore'
import type { DataTableFocusControls2 } from '../focus/DataTableFocus'
import type { JustErrorMessage } from '@cozemble/lang-util'
import type { Backend } from '../backend/Backend'
import { createNewRootRecord as createNewRootRecordFn } from './creator/recordCreatorStore'
import type {
  DataRecordControlEvent,
  DataRecordEditEvent,
  EventSourcedRecordGraph,
} from '@cozemble/model-event-sourced'

export type CombinedDataRecordEditorClient = DataRecordEditorClient & DataRecordViewerClient

export function makeCombinedDataRecordEditorClient(
  backend: Backend,
  systemConfigProvider: () => SystemConfiguration,
  modelsProvider: () => Model[],
  modelViewsProvider: () => ModelView[],
  records: EventSourcedRecordGraphStore,
  focusControls: DataTableFocusControls2,
  recordId: DataRecordId,
): CombinedDataRecordEditorClient {
  return {
    dispatchControlEvent(event: DataRecordControlEvent): void {
      if (event._type === 'data.record.edit.move.focus') {
        if (event.direction === 'right') {
          focusControls.moveForward()
        }
      }
      if (event._type === 'data.record.edit.aborted') {
        focusControls.clearFocus()
      }
    },

    dispatchEditEvent(event: DataRecordEditEvent): void {
      if (event._type === 'data.record.value.changed') {
        records.updateRecord(recordId, event)
        if (event.confirmMethod === 'Tab') {
          focusControls.moveForward()
        }
      } else if (event._type === 'data.record.has.many.item.added') {
        records.updateRecord(recordId, event)
      } else {
        throw new Error('Not implemented: ' + event._type)
      }
    },

    async createNewRootRecord(
      modelId: ModelId,
      ...modifiers: RecordGraphModifier[]
    ): Promise<EventSourcedRecordGraph | null> {
      const newGraph = await createNewRootRecordFn(modelId, ...modifiers)
      console.log('newGraph', newGraph)
      if (!newGraph) {
        return null
      }
      const outcome = await backend.saveNewGraph(newGraph)
      console.log('outcome', outcome)
      if (outcome._type === 'successful.outcome') {
        return outcome.value
      } else {
        throw new Error('Failed to save new record: ' + outcome.error.message)
      }
    },

    searchRecords(modelId: ModelId, search: string): Promise<DataRecord[]> {
      return backend.searchRecords(modelId, search)
    },

    getModels(): Model[] {
      return modelsProvider()
    },

    getModelViews(modelId: ModelId): ModelView[] {
      return modelViewsProvider()
    },

    saveModelView(modelView: ModelView): Promise<JustErrorMessage | null> {
      return backend.saveModelView(modelView)
    },

    uploadAttachments(
      files: File[],
      progressUpdater: (percent: number) => void,
    ): Promise<UploadedAttachment[]> {
      return backend.uploadAttachments(files, progressUpdater)
    },

    deleteAttachments(attachmentIds: string[]): Promise<void> {
      return backend.deleteAttachments(attachmentIds)
    },

    getAttachmentViewUrls(attachments: AttachmentIdAndFileName[]): Promise<string[]> {
      return backend.getAttachmentViewUrls(attachments)
    },

    instructUser(): void {
      throw new Error('Method not implemented.')
    },

    recordById(modelId: ModelId, recordId: DataRecordId): Promise<DataRecord | null> {
      return backend.recordById(modelId, recordId)
    },
  }
}
