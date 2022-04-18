/* eslint-disable prettier/prettier */
import { FSharpList_string } from "./Microsoft.FSharp.Collections"
import { defaultFSharpList_string } from "./Microsoft.FSharp.Collections"

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
  filePaths: FSharpList_string
}

export const defaultUploadSystemFiles: UploadSystemFiles = {
  filePaths: {} as any,
}

export interface GetBlobContainers {
}

export const defaultGetBlobContainers: GetBlobContainers = {
}

