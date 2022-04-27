export type ObjectReplicationStatus = "Complete" | "Failed"
export const defaultObjectReplicationStatus = "Complete"
export const ObjectReplicationStatusValues: { [key in ObjectReplicationStatus]: ObjectReplicationStatus } = {
  Complete: "Complete",
  Failed: "Failed",
}
export const ObjectReplicationStatusValuesArray: ObjectReplicationStatus[] = Object.keys(ObjectReplicationStatusValues) as ObjectReplicationStatus[]

export type BlobType = "Block" | "Page" | "Append"
export const defaultBlobType = "Block"
export const BlobTypeValues: { [key in BlobType]: BlobType } = {
  Block: "Block",
  Page: "Page",
  Append: "Append",
}
export const BlobTypeValuesArray: BlobType[] = Object.keys(BlobTypeValues) as BlobType[]

export type CopyStatus = "Pending" | "Success" | "Aborted" | "Failed"
export const defaultCopyStatus = "Pending"
export const CopyStatusValues: { [key in CopyStatus]: CopyStatus } = {
  Pending: "Pending",
  Success: "Success",
  Aborted: "Aborted",
  Failed: "Failed",
}
export const CopyStatusValuesArray: CopyStatus[] = Object.keys(CopyStatusValues) as CopyStatus[]

export type LeaseDurationType = "Infinite" | "Fixed"
export const defaultLeaseDurationType = "Infinite"
export const LeaseDurationTypeValues: { [key in LeaseDurationType]: LeaseDurationType } = {
  Infinite: "Infinite",
  Fixed: "Fixed",
}
export const LeaseDurationTypeValuesArray: LeaseDurationType[] = Object.keys(LeaseDurationTypeValues) as LeaseDurationType[]

export type LeaseState = "Available" | "Leased" | "Expired" | "Breaking" | "Broken"
export const defaultLeaseState = "Available"
export const LeaseStateValues: { [key in LeaseState]: LeaseState } = {
  Available: "Available",
  Leased: "Leased",
  Expired: "Expired",
  Breaking: "Breaking",
  Broken: "Broken",
}
export const LeaseStateValuesArray: LeaseState[] = Object.keys(LeaseStateValues) as LeaseState[]

export type LeaseStatus = "Locked" | "Unlocked"
export const defaultLeaseStatus = "Locked"
export const LeaseStatusValues: { [key in LeaseStatus]: LeaseStatus } = {
  Locked: "Locked",
  Unlocked: "Unlocked",
}
export const LeaseStatusValuesArray: LeaseStatus[] = Object.keys(LeaseStatusValues) as LeaseStatus[]

export interface BlobImmutabilityPolicy {
  expiresOn: any
  policyMode: any
}

export const defaultBlobImmutabilityPolicy: BlobImmutabilityPolicy = {
  expiresOn: null,
  policyMode: null,
}

export interface BlobProperties {
  lastModified: any
  createdOn: any
  metadata: { [key: string]: string | null }
  objectReplicationDestinationPolicyId: string | null
  objectReplicationSourceProperties: ObjectReplicationPolicy[]
  blobType: BlobType
  copyCompletedOn: any
  copyStatusDescription: string | null
  copyId: string | null
  copyProgress: string | null
  copySource: any
  copyStatus: CopyStatus
  isIncrementalCopy: boolean
  destinationSnapshot: string | null
  leaseDuration: LeaseDurationType
  leaseState: LeaseState
  leaseStatus: LeaseStatus
  contentLength: number
  contentType: string | null
  eTag: any
  contentHash: string | null
  contentEncoding: string | null
  contentDisposition: string | null
  contentLanguage: string | null
  cacheControl: string | null
  blobSequenceNumber: number
  acceptRanges: string | null
  blobCommittedBlockCount: number
  isServerEncrypted: boolean
  encryptionKeySha256: string | null
  encryptionScope: string | null
  accessTier: string | null
  accessTierInferred: boolean
  archiveStatus: string | null
  accessTierChangedOn: any
  versionId: string | null
  isLatestVersion: boolean
  tagCount: number
  expiresOn: any
  isSealed: boolean
  rehydratePriority: string | null
  lastAccessed: any
  immutabilityPolicy: BlobImmutabilityPolicy
  hasLegalHold: boolean
}

export const defaultBlobProperties: BlobProperties = {
  lastModified: null,
  createdOn: null,
  metadata: {},
  objectReplicationDestinationPolicyId: null,
  objectReplicationSourceProperties: [],
  blobType: {} as any,
  copyCompletedOn: null,
  copyStatusDescription: null,
  copyId: null,
  copyProgress: null,
  copySource: null,
  copyStatus: {} as any,
  isIncrementalCopy: false,
  destinationSnapshot: null,
  leaseDuration: {} as any,
  leaseState: {} as any,
  leaseStatus: {} as any,
  contentLength: 0,
  contentType: null,
  eTag: null,
  contentHash: null,
  contentEncoding: null,
  contentDisposition: null,
  contentLanguage: null,
  cacheControl: null,
  blobSequenceNumber: 0,
  acceptRanges: null,
  blobCommittedBlockCount: 0,
  isServerEncrypted: false,
  encryptionKeySha256: null,
  encryptionScope: null,
  accessTier: null,
  accessTierInferred: false,
  archiveStatus: null,
  accessTierChangedOn: null,
  versionId: null,
  isLatestVersion: false,
  tagCount: 0,
  expiresOn: null,
  isSealed: false,
  rehydratePriority: null,
  lastAccessed: null,
  immutabilityPolicy: {} as any,
  hasLegalHold: false,
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

export interface GetBlobTagResult {
  tags: { [key: string]: string | null }
}

export const defaultGetBlobTagResult: GetBlobTagResult = {
  tags: {},
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

