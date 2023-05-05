//////////////////////////////////////
//   This file is auto generated   //
//////////////////////////////////////

import * as System_Collections_Generic from "./System_Collections_Generic"


export type Object = any
export var defaultObject: Object = {}


export type Byte = number
export var defaultByte: Byte = 0


export type Int32 = number
export var defaultInt32: Int32 = 0


export type String = string
export var defaultString: String = ''


export type Boolean = boolean
export var defaultBoolean: Boolean = false


export type Guid = `${string}-${string}-${string}-${string}-${string}`
export var defaultGuid: Guid = '00000000-0000-0000-0000-000000000000'


export type DateTimeOffset = `${number}-${number}-${number}T${number}:${number}:${number}${"+"|"-"}${number}:${number}`
export var defaultDateTimeOffset: DateTimeOffset = "0000-00-00T00:00:00+00:00"

export type UriHostNameType = "Unknown" | "Basic" | "Dns" | "IPv4" | "IPv6"
  export var UriHostNameType_AllValues = ["Unknown", "Basic", "Dns", "IPv4", "IPv6"] as const
  export var defaultUriHostNameType: UriHostNameType = "Unknown"
  
export type StringArray<T> = Array<T> // fullname System.String[]
export var defaultStringArray: <T>(t:T) => StringArray<T> = <T>(t:T) => []

export type Uri = {
  absolutePath: String
  absoluteUri: String
  localPath: String
  authority: String
  hostNameType: UriHostNameType
  isDefaultPort: Boolean
  isFile: Boolean
  isLoopback: Boolean
  pathAndQuery: String
  segments: System_Collections_Generic.IEnumerable<String>
  isUnc: Boolean
  host: String
  port: Int32
  query: String
  fragment: String
  scheme: String
  originalString: String
  dnsSafeHost: String
  idnHost: String
  isAbsoluteUri: Boolean
  userEscaped: Boolean
  userInfo: String
}
export var defaultUri: Uri = {
  absolutePath: '',
  absoluteUri: '',
  localPath: '',
  authority: '',
  hostNameType: defaultUriHostNameType,
  isDefaultPort: false,
  isFile: false,
  isLoopback: false,
  pathAndQuery: '',
  segments: [],
  isUnc: false,
  host: '',
  port: 0,
  query: '',
  fragment: '',
  scheme: '',
  originalString: '',
  dnsSafeHost: '',
  idnHost: '',
  isAbsoluteUri: false,
  userEscaped: false,
  userInfo: ''
}


export type Int64 = number
export var defaultInt64: Int64 = 0

export type ByteArray<T> = Array<T> // fullname System.Byte[]
export var defaultByteArray: <T>(t:T) => ByteArray<T> = <T>(t:T) => []


export type Nullable<T> = T | null
export var defaultNullable: <T>(defaultT:T) => Nullable<T> = <T>(defaultT:T) => null

