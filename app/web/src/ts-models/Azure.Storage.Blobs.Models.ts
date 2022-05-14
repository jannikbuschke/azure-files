import { ETag } from "./Azure"
import { defaultETag } from "./Azure"

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

export type BlobImmutabilityPolicyMode = "Mutable" | "Unlocked" | "Locked"
export const defaultBlobImmutabilityPolicyMode = "Mutable"
export const BlobImmutabilityPolicyModeValues: { [key in BlobImmutabilityPolicyMode]: BlobImmutabilityPolicyMode } = {
  Mutable: "Mutable",
  Unlocked: "Unlocked",
  Locked: "Locked",
}
export const BlobImmutabilityPolicyModeValuesArray: BlobImmutabilityPolicyMode[] = Object.keys(BlobImmutabilityPolicyModeValues) as BlobImmutabilityPolicyMode[]

export type ArchiveStatus = "RehydratePendingToHot" | "RehydratePendingToCool"
export const defaultArchiveStatus = "RehydratePendingToHot"
export const ArchiveStatusValues: { [key in ArchiveStatus]: ArchiveStatus } = {
  RehydratePendingToHot: "RehydratePendingToHot",
  RehydratePendingToCool: "RehydratePendingToCool",
}
export const ArchiveStatusValuesArray: ArchiveStatus[] = Object.keys(ArchiveStatusValues) as ArchiveStatus[]

export type RehydratePriority = "High" | "Standard"
export const defaultRehydratePriority = "High"
export const RehydratePriorityValues: { [key in RehydratePriority]: RehydratePriority } = {
  High: "High",
  Standard: "Standard",
}
export const RehydratePriorityValuesArray: RehydratePriority[] = Object.keys(RehydratePriorityValues) as RehydratePriority[]

export type PublicAccessType = "None" | "BlobContainer" | "Blob"
export const defaultPublicAccessType = "None"
export const PublicAccessTypeValues: { [key in PublicAccessType]: PublicAccessType } = {
  None: "None",
  BlobContainer: "BlobContainer",
  Blob: "Blob",
}
export const PublicAccessTypeValuesArray: PublicAccessType[] = Object.keys(PublicAccessTypeValues) as PublicAccessType[]

export interface BlobImmutabilityPolicy {
  expiresOn: string | null
  policyMode: BlobImmutabilityPolicyMode | null
}

export const defaultBlobImmutabilityPolicy: BlobImmutabilityPolicy = {
  expiresOn: null,
  policyMode: {} as any,
}

export interface BlobProperties {
  lastModified: string
  createdOn: string
  metadata: { [key: string]: string | null }
  objectReplicationDestinationPolicyId: string | null
  objectReplicationSourceProperties: ObjectReplicationPolicy[]
  blobType: BlobType
  copyCompletedOn: string
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
  eTag: ETag
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
  accessTierChangedOn: string
  versionId: string | null
  isLatestVersion: boolean
  tagCount: number
  expiresOn: string
  isSealed: boolean
  rehydratePriority: string | null
  lastAccessed: string
  immutabilityPolicy: BlobImmutabilityPolicy
  hasLegalHold: boolean
}

export const defaultBlobProperties: BlobProperties = {
  lastModified: "00:00:00",
  createdOn: "00:00:00",
  metadata: {},
  objectReplicationDestinationPolicyId: null,
  objectReplicationSourceProperties: [],
  blobType: {} as any,
  copyCompletedOn: "00:00:00",
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
  eTag: {} as any,
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
  accessTierChangedOn: "00:00:00",
  versionId: null,
  isLatestVersion: false,
  tagCount: 0,
  expiresOn: "00:00:00",
  isSealed: false,
  rehydratePriority: null,
  lastAccessed: "00:00:00",
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
  lastModified: string | null
  contentLength: number | null
  contentType: string | null
  contentEncoding: string | null
  contentLanguage: string | null
  contentHash: string | null
  contentDisposition: string | null
  cacheControl: string | null
  blobSequenceNumber: number | null
  blobType: BlobType | null
  leaseStatus: LeaseStatus | null
  leaseState: LeaseState | null
  leaseDuration: LeaseDurationType | null
  copyId: string | null
  copyStatus: CopyStatus | null
  copySource: any
  copyProgress: string | null
  copyStatusDescription: string | null
  serverEncrypted: boolean | null
  incrementalCopy: boolean | null
  destinationSnapshot: string | null
  remainingRetentionDays: number | null
  accessTier: any
  accessTierInferred: boolean
  archiveStatus: ArchiveStatus | null
  customerProvidedKeySha256: string | null
  encryptionScope: string | null
  tagCount: number | null
  expiresOn: string | null
  isSealed: boolean | null
  rehydratePriority: RehydratePriority | null
  lastAccessedOn: string | null
  eTag: any
  createdOn: string | null
  copyCompletedOn: string | null
  deletedOn: string | null
  accessTierChangedOn: string | null
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
  blobType: {} as any,
  leaseStatus: {} as any,
  leaseState: {} as any,
  leaseDuration: {} as any,
  copyId: null,
  copyStatus: {} as any,
  copySource: null,
  copyProgress: null,
  copyStatusDescription: null,
  serverEncrypted: null,
  incrementalCopy: null,
  destinationSnapshot: null,
  remainingRetentionDays: null,
  accessTier: null,
  accessTierInferred: false,
  archiveStatus: {} as any,
  customerProvidedKeySha256: null,
  encryptionScope: null,
  tagCount: null,
  expiresOn: null,
  isSealed: null,
  rehydratePriority: {} as any,
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
  isLatestVersion: boolean | null
  properties: BlobItemProperties
  metadata: { [key: string]: string | null }
  tags: { [key: string]: string | null }
  objectReplicationSourceProperties: ObjectReplicationPolicy[]
  hasVersionsOnly: boolean | null
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
  lastModified: string
  leaseStatus: LeaseStatus | null
  leaseState: LeaseState | null
  leaseDuration: LeaseDurationType | null
  publicAccess: PublicAccessType | null
  hasImmutabilityPolicy: boolean | null
  hasLegalHold: boolean | null
  defaultEncryptionScope: string | null
  preventEncryptionScopeOverride: boolean | null
  deletedOn: string | null
  remainingRetentionDays: number | null
  eTag: ETag
  metadata: { [key: string]: string | null }
  hasImmutableStorageWithVersioning: boolean
}

export const defaultBlobContainerProperties: BlobContainerProperties = {
  lastModified: "00:00:00",
  leaseStatus: {} as any,
  leaseState: {} as any,
  leaseDuration: {} as any,
  publicAccess: {} as any,
  hasImmutabilityPolicy: null,
  hasLegalHold: null,
  defaultEncryptionScope: null,
  preventEncryptionScopeOverride: null,
  deletedOn: null,
  remainingRetentionDays: null,
  eTag: {} as any,
  metadata: {},
  hasImmutableStorageWithVersioning: false,
}

export interface BlobContainerItem {
  name: string | null
  isDeleted: boolean | null
  versionId: string | null
  properties: BlobContainerProperties
}

export const defaultBlobContainerItem: BlobContainerItem = {
  name: null,
  isDeleted: null,
  versionId: null,
  properties: {} as any,
}

