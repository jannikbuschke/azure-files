/* eslint-disable prettier/prettier */
export type ObjectReplicationStatus = "Complete" | "Failed"
export const defaultObjectReplicationStatus = "Complete"
export const ObjectReplicationStatusValues: { [key in ObjectReplicationStatus]: ObjectReplicationStatus } = {
  Complete: "Complete",
  Failed: "Failed",
}
export const ObjectReplicationStatusValuesArray: ObjectReplicationStatus[] = Object.keys(ObjectReplicationStatusValues) as ObjectReplicationStatus[]

export interface BlobImmutabilityPolicy {
  expiresOn: any
  policyMode: any
}

export const defaultBlobImmutabilityPolicy: BlobImmutabilityPolicy = {
  expiresOn: null,
  policyMode: null,
}

export interface BlobItemProperties {
  lastModified: any
  contentLength: any
  contentType: string | null
  contentEncoding: string | null
  contentLanguage: string | null
  contentHash: string | null
  contentDisposition: string | null
  cacheControl: string | null
  blobSequenceNumber: any
  blobType: any
  leaseStatus: any
  leaseState: any
  leaseDuration: any
  copyId: string | null
  copyStatus: any
  copySource: any
  copyProgress: string | null
  copyStatusDescription: string | null
  serverEncrypted: any
  incrementalCopy: any
  destinationSnapshot: string | null
  remainingRetentionDays: any
  accessTier: any
  accessTierInferred: boolean
  archiveStatus: any
  customerProvidedKeySha256: string | null
  encryptionScope: string | null
  tagCount: any
  expiresOn: any
  isSealed: any
  rehydratePriority: any
  lastAccessedOn: any
  eTag: any
  createdOn: any
  copyCompletedOn: any
  deletedOn: any
  accessTierChangedOn: any
  immutabilityPolicy: BlobImmutabilityPolicy
  hasLegalHold: boolean
}

export const defaultBlobItemProperties: BlobItemProperties = {
  lastModified: null,
  contentLength: null,
  contentType: null,
  contentEncoding: null,
  contentLanguage: null,
  contentHash: null,
  contentDisposition: null,
  cacheControl: null,
  blobSequenceNumber: null,
  blobType: null,
  leaseStatus: null,
  leaseState: null,
  leaseDuration: null,
  copyId: null,
  copyStatus: null,
  copySource: null,
  copyProgress: null,
  copyStatusDescription: null,
  serverEncrypted: null,
  incrementalCopy: null,
  destinationSnapshot: null,
  remainingRetentionDays: null,
  accessTier: null,
  accessTierInferred: false,
  archiveStatus: null,
  customerProvidedKeySha256: null,
  encryptionScope: null,
  tagCount: null,
  expiresOn: null,
  isSealed: null,
  rehydratePriority: null,
  lastAccessedOn: null,
  eTag: null,
  createdOn: null,
  copyCompletedOn: null,
  deletedOn: null,
  accessTierChangedOn: null,
  immutabilityPolicy: {} as any,
  hasLegalHold: false,
}

export interface BlobItem {
  name: string | null
  deleted: boolean
  snapshot: string | null
  versionId: string | null
  isLatestVersion: any
  properties: BlobItemProperties
  metadata: { [key: string]: string | null }
  tags: { [key: string]: string | null }
  objectReplicationSourceProperties: ObjectReplicationPolicy[]
  hasVersionsOnly: any
}

export const defaultBlobItem: BlobItem = {
  name: null,
  deleted: false,
  snapshot: null,
  versionId: null,
  isLatestVersion: null,
  properties: {} as any,
  metadata: {},
  tags: {},
  objectReplicationSourceProperties: [],
  hasVersionsOnly: null,
}

export interface ObjectReplicationPolicy {
  policyId: string | null
  rules: ObjectReplicationRule[]
}

export const defaultObjectReplicationPolicy: ObjectReplicationPolicy = {
  policyId: null,
  rules: [],
}

export interface ObjectReplicationRule {
  ruleId: string | null
  replicationStatus: ObjectReplicationStatus
}

export const defaultObjectReplicationRule: ObjectReplicationRule = {
  ruleId: null,
  replicationStatus: {} as any,
}

export interface BlobContainerProperties {
  lastModified: any
  leaseStatus: any
  leaseState: any
  leaseDuration: any
  publicAccess: any
  hasImmutabilityPolicy: any
  hasLegalHold: any
  defaultEncryptionScope: string | null
  preventEncryptionScopeOverride: any
  deletedOn: any
  remainingRetentionDays: any
  eTag: any
  metadata: { [key: string]: string | null }
  hasImmutableStorageWithVersioning: boolean
}

export const defaultBlobContainerProperties: BlobContainerProperties = {
  lastModified: null,
  leaseStatus: null,
  leaseState: null,
  leaseDuration: null,
  publicAccess: null,
  hasImmutabilityPolicy: null,
  hasLegalHold: null,
  defaultEncryptionScope: null,
  preventEncryptionScopeOverride: null,
  deletedOn: null,
  remainingRetentionDays: null,
  eTag: null,
  metadata: {},
  hasImmutableStorageWithVersioning: false,
}

export interface BlobContainerItem {
  name: string | null
  isDeleted: any
  versionId: string | null
  properties: BlobContainerProperties
}

export const defaultBlobContainerItem: BlobContainerItem = {
  name: null,
  isDeleted: null,
  versionId: null,
  properties: {} as any,
}

