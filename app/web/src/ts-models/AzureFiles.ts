import { BlobProperties, GetBlobTagResult } from "./Azure.Storage.Blobs.Models"
import { defaultBlobProperties, defaultGetBlobTagResult } from "./Azure.Storage.Blobs.Models"
import { FSharpOption } from "./fsharp-option"
import { defaultFSharpOption } from "./fsharp-option"

export interface GetBlobFile {
  itemId: string | null
  containerId: string | null
}

export const defaultGetBlobFile: GetBlobFile = {
  itemId: null,
  containerId: null,
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
}

export const defaultGetIndexedFiles: GetIndexedFiles = {
}

export interface GetIndexedFile {
  id: any
}

export const defaultGetIndexedFile: GetIndexedFile = {
  id: null,
}

export interface SetTags {
  fileId: any
  tags: Tag[]
}

export const defaultSetTags: SetTags = {
  fileId: null,
  tags: [],
}

export interface Tag {
  name: string | null
}

export const defaultTag: Tag = {
  name: null,
}

export interface GetFiles {
  name: string | null
}

export const defaultGetFiles: GetFiles = {
  name: null,
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
  files: any[]
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

export interface File {
  id: any
  filename: string | null
  md5Hash: string | null
  tags: Tag[]
}

export const defaultFile: File = {
  id: null,
  filename: null,
  md5Hash: null,
  tags: [],
}

export interface FileAdded {
  filename: string | null
  md5Hash: string | null
  id: any
}

export const defaultFileAdded: FileAdded = {
  filename: null,
  md5Hash: null,
  id: null,
}

