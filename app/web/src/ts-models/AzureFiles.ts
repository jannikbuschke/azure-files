/* eslint-disable prettier/prettier */
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

export interface GetBlobContainers {
}

export const defaultGetBlobContainers: GetBlobContainers = {
}

