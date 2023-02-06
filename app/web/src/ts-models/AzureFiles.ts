import { BlobProperties, GetBlobTagResult } from "./Azure.Storage.Blobs.Models"
import { defaultBlobProperties, defaultGetBlobTagResult } from "./Azure.Storage.Blobs.Models"

export interface GetBlobFile {
  itemId: string | null
  containerId: string | null
}

export const defaultGetBlobFile: GetBlobFile = {
  itemId: null,
  containerId: null,
}

export interface DeleteAllBlobs {
  containerName: string | null
}

export const defaultDeleteAllBlobs: DeleteAllBlobs = {
  containerName: null,
}

export interface DeleteBlobFile {
  itemId: string | null
  containerId: string | null
}

export const defaultDeleteBlobFile: DeleteBlobFile = {
  itemId: null,
  containerId: null,
}

export interface GetIndexedFiles {
  tagFilter: string | null
  showUntagged: boolean
}

export const defaultGetIndexedFiles: GetIndexedFiles = {
  tagFilter: null,
  showUntagged: false,
}

export interface GetIndexedFile {
  id: string
}

export const defaultGetIndexedFile: GetIndexedFile = {
  id: "00000000-0000-0000-0000-000000000000",
}

export interface SetTags {
  fileId: string
  tags: TagAdded[]
}

export const defaultSetTags: SetTags = {
  fileId: "00000000-0000-0000-0000-000000000000",
  tags: [],
}

export interface TagAdded {
  name: string | null
}

export const defaultTagAdded: TagAdded = {
  name: null,
}

export interface SetTagsBatched {
  tags: TagAdded[]
  files: { [key: string]: boolean }
}

export const defaultSetTagsBatched: SetTagsBatched = {
  tags: [],
  files: {},
}

export interface GetFiles {
  name: string | null
}

export const defaultGetFiles: GetFiles = {
  name: null,
}

export interface GetNextUntaggedBlob {
}

export const defaultGetNextUntaggedBlob: GetNextUntaggedBlob = {
}

export interface GetAllUntagged {
}

export const defaultGetAllUntagged: GetAllUntagged = {
}

export interface UploadFormFiles {
}

export const defaultUploadFormFiles: UploadFormFiles = {
}

export interface UploadSystemFiles {
  filePaths: (string | null)[]
}

export const defaultUploadSystemFiles: UploadSystemFiles = {
  filePaths: [],
}

export interface RenameSystemFiles {
  files: (string | null)[]
  folderName: string | null
}

export const defaultRenameSystemFiles: RenameSystemFiles = {
  files: [],
  folderName: null,
}

export interface GetBlobContainers {
}

export const defaultGetBlobContainers: GetBlobContainers = {
}

export interface AzureFilesBlobProperties {
  properties: BlobProperties
  tags: GetBlobTagResult
}

export const defaultAzureFilesBlobProperties: AzureFilesBlobProperties = {
  properties: {} as any,
  tags: {} as any,
}

export interface FileAggregate {
  id: string
  url: string | null
  filename: string | null
  md5Hash: string | null
  localMd5Hash: string | null
  tags: (string | null)[]
  thumbnailUrl: string | null
  lowresUrl: string | null
  fullHdUrl: string | null
  variants: ImageVariant[]
}

export const defaultFileAggregate: FileAggregate = {
  id: "00000000-0000-0000-0000-000000000000",
  url: null,
  filename: null,
  md5Hash: null,
  localMd5Hash: null,
  tags: [],
  thumbnailUrl: null,
  lowresUrl: null,
  fullHdUrl: null,
  variants: [],
}

export interface Dimension {
  width: number
  height: number
}

export const defaultDimension: Dimension = {
  width: 0,
  height: 0,
}

export interface ImageVariant {
  url: string | null
  dimension: Dimension
}

export const defaultImageVariant: ImageVariant = {
  url: null,
  dimension: {} as any,
}

export interface FileSavedToStorage {
  filename: string | null
  md5Hash: string | null
  localMd5Hash: string | null
  url: string | null
}

export const defaultFileSavedToStorage: FileSavedToStorage = {
  filename: null,
  md5Hash: null,
  localMd5Hash: null,
  url: null,
}

