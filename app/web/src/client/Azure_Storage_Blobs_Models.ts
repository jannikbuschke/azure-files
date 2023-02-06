//////////////////////////////////////
//   This file is auto generated   //
//////////////////////////////////////

import * as System from "./System"
import * as System_Collections_Generic from "./System_Collections_Generic"
import * as Azure from "./Azure"

export type ObjectReplicationStatus = "Complete" | "Failed"
  export var ObjectReplicationStatus_AllValues = ["Complete", "Failed"] as const
  export var defaultObjectReplicationStatus: ObjectReplicationStatus = "Complete"
  
export type ObjectReplicationRule = {
  ruleId: System.String
  replicationStatus: ObjectReplicationStatus
}
export var defaultObjectReplicationRule: ObjectReplicationRule = {
  ruleId: '',
  replicationStatus: defaultObjectReplicationStatus
}

export type ObjectReplicationPolicy = {
  policyId: System.String
  rules: System_Collections_Generic.IList<ObjectReplicationRule>
}
export var defaultObjectReplicationPolicy: ObjectReplicationPolicy = {
  policyId: '',
  rules: []
}

export type BlobType = "Block" | "Page" | "Append"
  export var BlobType_AllValues = ["Block", "Page", "Append"] as const
  export var defaultBlobType: BlobType = "Block"
  
export type CopyStatus = "Pending" | "Success" | "Aborted" | "Failed"
  export var CopyStatus_AllValues = ["Pending", "Success", "Aborted", "Failed"] as const
  export var defaultCopyStatus: CopyStatus = "Pending"
  
export type LeaseDurationType = "Infinite" | "Fixed"
  export var LeaseDurationType_AllValues = ["Infinite", "Fixed"] as const
  export var defaultLeaseDurationType: LeaseDurationType = "Infinite"
  
export type LeaseState = "Available" | "Leased" | "Expired" | "Breaking" | "Broken"
  export var LeaseState_AllValues = ["Available", "Leased", "Expired", "Breaking", "Broken"] as const
  export var defaultLeaseState: LeaseState = "Available"
  
export type LeaseStatus = "Locked" | "Unlocked"
  export var LeaseStatus_AllValues = ["Locked", "Unlocked"] as const
  export var defaultLeaseStatus: LeaseStatus = "Locked"
  
export type BlobImmutabilityPolicyMode = "Mutable" | "Unlocked" | "Locked"
  export var BlobImmutabilityPolicyMode_AllValues = ["Mutable", "Unlocked", "Locked"] as const
  export var defaultBlobImmutabilityPolicyMode: BlobImmutabilityPolicyMode = "Mutable"
  
export type BlobImmutabilityPolicy = {
  expiresOn: System.Nullable<System.DateTimeOffset>
  policyMode: System.Nullable<BlobImmutabilityPolicyMode>
}
export var defaultBlobImmutabilityPolicy: BlobImmutabilityPolicy = {
  expiresOn: null,
  policyMode: null
}

export type BlobProperties = {
  lastModified: System.DateTimeOffset
  createdOn: System.DateTimeOffset
  metadata: System_Collections_Generic.IDictionary<System.String,System.String>
  objectReplicationDestinationPolicyId: System.String
  objectReplicationSourceProperties: System_Collections_Generic.IList<ObjectReplicationPolicy>
  blobType: BlobType
  copyCompletedOn: System.DateTimeOffset
  copyStatusDescription: System.String
  copyId: System.String
  copyProgress: System.String
  copySource: System.Uri
  copyStatus: CopyStatus
  isIncrementalCopy: System.Boolean
  destinationSnapshot: System.String
  leaseDuration: LeaseDurationType
  leaseState: LeaseState
  leaseStatus: LeaseStatus
  contentLength: System.Int64
  contentType: System.String
  eTag: Azure.ETag
  contentHash: System_Collections_Generic.IEnumerable<System.Byte>
  contentEncoding: System.String
  contentDisposition: System.String
  contentLanguage: System.String
  cacheControl: System.String
  blobSequenceNumber: System.Int64
  acceptRanges: System.String
  blobCommittedBlockCount: System.Int32
  isServerEncrypted: System.Boolean
  encryptionKeySha256: System.String
  encryptionScope: System.String
  accessTier: System.String
  accessTierInferred: System.Boolean
  archiveStatus: System.String
  accessTierChangedOn: System.DateTimeOffset
  versionId: System.String
  isLatestVersion: System.Boolean
  tagCount: System.Int64
  expiresOn: System.DateTimeOffset
  isSealed: System.Boolean
  rehydratePriority: System.String
  lastAccessed: System.DateTimeOffset
  immutabilityPolicy: BlobImmutabilityPolicy
  hasLegalHold: System.Boolean
}
export var defaultBlobProperties: BlobProperties = {
  lastModified: "0000-00-00T00:00:00+00:00",
  createdOn: "0000-00-00T00:00:00+00:00",
  metadata: System_Collections_Generic.defaultIDictionary(System.defaultString,System.defaultString),
  objectReplicationDestinationPolicyId: '',
  objectReplicationSourceProperties: [],
  blobType: defaultBlobType,
  copyCompletedOn: "0000-00-00T00:00:00+00:00",
  copyStatusDescription: '',
  copyId: '',
  copyProgress: '',
  copySource: System.defaultUri,
  copyStatus: defaultCopyStatus,
  isIncrementalCopy: false,
  destinationSnapshot: '',
  leaseDuration: defaultLeaseDurationType,
  leaseState: defaultLeaseState,
  leaseStatus: defaultLeaseStatus,
  contentLength: 0,
  contentType: '',
  eTag: Azure.defaultETag,
  contentHash: [],
  contentEncoding: '',
  contentDisposition: '',
  contentLanguage: '',
  cacheControl: '',
  blobSequenceNumber: 0,
  acceptRanges: '',
  blobCommittedBlockCount: 0,
  isServerEncrypted: false,
  encryptionKeySha256: '',
  encryptionScope: '',
  accessTier: '',
  accessTierInferred: false,
  archiveStatus: '',
  accessTierChangedOn: "0000-00-00T00:00:00+00:00",
  versionId: '',
  isLatestVersion: false,
  tagCount: 0,
  expiresOn: "0000-00-00T00:00:00+00:00",
  isSealed: false,
  rehydratePriority: '',
  lastAccessed: "0000-00-00T00:00:00+00:00",
  immutabilityPolicy: defaultBlobImmutabilityPolicy,
  hasLegalHold: false
}

export type GetBlobTagResult = {
  tags: System_Collections_Generic.IDictionary<System.String,System.String>
}
export var defaultGetBlobTagResult: GetBlobTagResult = {
  tags: System_Collections_Generic.defaultIDictionary(System.defaultString,System.defaultString)
}

export type AccessTier = {
}
export var defaultAccessTier: AccessTier = {
}

export type ArchiveStatus = "RehydratePendingToHot" | "RehydratePendingToCool"
  export var ArchiveStatus_AllValues = ["RehydratePendingToHot", "RehydratePendingToCool"] as const
  export var defaultArchiveStatus: ArchiveStatus = "RehydratePendingToHot"
  
export type RehydratePriority = "High" | "Standard"
  export var RehydratePriority_AllValues = ["High", "Standard"] as const
  export var defaultRehydratePriority: RehydratePriority = "High"
  
export type BlobItemProperties = {
  lastModified: System.Nullable<System.DateTimeOffset>
  contentLength: System.Nullable<System.Int64>
  contentType: System.String
  contentEncoding: System.String
  contentLanguage: System.String
  contentHash: System_Collections_Generic.IEnumerable<System.Byte>
  contentDisposition: System.String
  cacheControl: System.String
  blobSequenceNumber: System.Nullable<System.Int64>
  blobType: System.Nullable<BlobType>
  leaseStatus: System.Nullable<LeaseStatus>
  leaseState: System.Nullable<LeaseState>
  leaseDuration: System.Nullable<LeaseDurationType>
  copyId: System.String
  copyStatus: System.Nullable<CopyStatus>
  copySource: System.Uri
  copyProgress: System.String
  copyStatusDescription: System.String
  serverEncrypted: System.Nullable<System.Boolean>
  incrementalCopy: System.Nullable<System.Boolean>
  destinationSnapshot: System.String
  remainingRetentionDays: System.Nullable<System.Int32>
  accessTier: System.Nullable<AccessTier>
  accessTierInferred: System.Boolean
  archiveStatus: System.Nullable<ArchiveStatus>
  customerProvidedKeySha256: System.String
  encryptionScope: System.String
  tagCount: System.Nullable<System.Int64>
  expiresOn: System.Nullable<System.DateTimeOffset>
  isSealed: System.Nullable<System.Boolean>
  rehydratePriority: System.Nullable<RehydratePriority>
  lastAccessedOn: System.Nullable<System.DateTimeOffset>
  eTag: System.Nullable<Azure.ETag>
  createdOn: System.Nullable<System.DateTimeOffset>
  copyCompletedOn: System.Nullable<System.DateTimeOffset>
  deletedOn: System.Nullable<System.DateTimeOffset>
  accessTierChangedOn: System.Nullable<System.DateTimeOffset>
  immutabilityPolicy: BlobImmutabilityPolicy
  hasLegalHold: System.Boolean
}
export var defaultBlobItemProperties: BlobItemProperties = {
  lastModified: null,
  contentLength: null,
  contentType: '',
  contentEncoding: '',
  contentLanguage: '',
  contentHash: [],
  contentDisposition: '',
  cacheControl: '',
  blobSequenceNumber: null,
  blobType: null,
  leaseStatus: null,
  leaseState: null,
  leaseDuration: null,
  copyId: '',
  copyStatus: null,
  copySource: System.defaultUri,
  copyProgress: '',
  copyStatusDescription: '',
  serverEncrypted: null,
  incrementalCopy: null,
  destinationSnapshot: '',
  remainingRetentionDays: null,
  accessTier: null,
  accessTierInferred: false,
  archiveStatus: null,
  customerProvidedKeySha256: '',
  encryptionScope: '',
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
  immutabilityPolicy: defaultBlobImmutabilityPolicy,
  hasLegalHold: false
}

export type BlobItem = {
  name: System.String
  deleted: System.Boolean
  snapshot: System.String
  versionId: System.String
  isLatestVersion: System.Nullable<System.Boolean>
  properties: BlobItemProperties
  metadata: System_Collections_Generic.IDictionary<System.String,System.String>
  tags: System_Collections_Generic.IDictionary<System.String,System.String>
  objectReplicationSourceProperties: System_Collections_Generic.IList<ObjectReplicationPolicy>
  hasVersionsOnly: System.Nullable<System.Boolean>
}
export var defaultBlobItem: BlobItem = {
  name: '',
  deleted: false,
  snapshot: '',
  versionId: '',
  isLatestVersion: null,
  properties: defaultBlobItemProperties,
  metadata: System_Collections_Generic.defaultIDictionary(System.defaultString,System.defaultString),
  tags: System_Collections_Generic.defaultIDictionary(System.defaultString,System.defaultString),
  objectReplicationSourceProperties: [],
  hasVersionsOnly: null
}

export type PublicAccessType = "None" | "BlobContainer" | "Blob"
  export var PublicAccessType_AllValues = ["None", "BlobContainer", "Blob"] as const
  export var defaultPublicAccessType: PublicAccessType = "None"
  
export type BlobContainerProperties = {
  lastModified: System.DateTimeOffset
  leaseStatus: System.Nullable<LeaseStatus>
  leaseState: System.Nullable<LeaseState>
  leaseDuration: System.Nullable<LeaseDurationType>
  publicAccess: System.Nullable<PublicAccessType>
  hasImmutabilityPolicy: System.Nullable<System.Boolean>
  hasLegalHold: System.Nullable<System.Boolean>
  defaultEncryptionScope: System.String
  preventEncryptionScopeOverride: System.Nullable<System.Boolean>
  deletedOn: System.Nullable<System.DateTimeOffset>
  remainingRetentionDays: System.Nullable<System.Int32>
  eTag: Azure.ETag
  metadata: System_Collections_Generic.IDictionary<System.String,System.String>
  hasImmutableStorageWithVersioning: System.Boolean
}
export var defaultBlobContainerProperties: BlobContainerProperties = {
  lastModified: "0000-00-00T00:00:00+00:00",
  leaseStatus: null,
  leaseState: null,
  leaseDuration: null,
  publicAccess: null,
  hasImmutabilityPolicy: null,
  hasLegalHold: null,
  defaultEncryptionScope: '',
  preventEncryptionScopeOverride: null,
  deletedOn: null,
  remainingRetentionDays: null,
  eTag: Azure.defaultETag,
  metadata: System_Collections_Generic.defaultIDictionary(System.defaultString,System.defaultString),
  hasImmutableStorageWithVersioning: false
}

export type BlobContainerItem = {
  name: System.String
  isDeleted: System.Nullable<System.Boolean>
  versionId: System.String
  properties: BlobContainerProperties
}
export var defaultBlobContainerItem: BlobContainerItem = {
  name: '',
  isDeleted: null,
  versionId: '',
  properties: defaultBlobContainerProperties
}

