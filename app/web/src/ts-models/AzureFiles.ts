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

export interface DeleteBlobFile {
  itemId: string | null
  containerId: string | null
}

export const defaultDeleteBlobFile: DeleteBlobFile = {
  itemId: null,
  containerId: null,
}

export interface GetIndexedFiles {
  filterByTag: string | null
}

export const defaultGetIndexedFiles: GetIndexedFiles = {
  filterByTag: null,
}

export interface GetIndexedFile {
  id: string
}

export const defaultGetIndexedFile: GetIndexedFile = {
  id: "00000000-0000-0000-0000-000000000000",
}

export interface SetTags {
  fileId: string
  tags: Tag[]
}

export const defaultSetTags: SetTags = {
  fileId: "00000000-0000-0000-0000-000000000000",
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

export interface File {
  id: string
  filename: string | null
  md5Hash: string | null
  tags: Tag[]
}

export const defaultFile: File = {
  id: "00000000-0000-0000-0000-000000000000",
  filename: null,
  md5Hash: null,
  tags: [],
}

export interface FileAdded {
  filename: string | null
  md5Hash: string | null
  id: string
}

export const defaultFileAdded: FileAdded = {
  filename: null,
  md5Hash: null,
  id: "00000000-0000-0000-0000-000000000000",
}

