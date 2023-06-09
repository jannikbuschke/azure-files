//////////////////////////////////////
//   This file is auto generated   //
//////////////////////////////////////

import * as System from "./System"


export type IEnumerable<T> = Array<T>
export var defaultIEnumerable: <T>(defaultT:T) => IEnumerable<T> = <T>(defaultT:T) => []


export type ICollection<T> = {
  count: System.Int32
  isReadOnly: System.Boolean
}
export var defaultICollection: <T>(defaultT:T) => ICollection<T> = <T>(defaultT:T) => ({
  count: 0,
  isReadOnly: false
})


export type IDictionary<TKey,TValue> = {
  item: TValue
  keys: ICollection<TKey>
  values: ICollection<TValue>
}
export var defaultIDictionary: <TKey,TValue>(defaultTKey:TKey,defaultTValue:TValue) => IDictionary<TKey,TValue> = <TKey,TValue>(defaultTKey:TKey,defaultTValue:TValue) => ({
  item: defaultTValue,
  keys: defaultICollection(defaultTKey),
  values: defaultICollection(defaultTValue)
})


export type IList<T> = Array<T>
export var defaultIList: <T>(defaultT:T) => IList<T> = <T>(defaultT:T) => []


export type List<T> = Array<T>
export var defaultList: <T>(defaultT:T) => List<T> = <T>(defaultT:T) => []


export type KeyValuePair<TKey,TValue> = ({Key:TKey,Value:TValue})
export var defaultKeyValuePair: <TKey,TValue>(defaultTKey:TKey,defaultTValue:TValue) => KeyValuePair<TKey,TValue> = <TKey,TValue>(defaultTKey:TKey,defaultTValue:TValue) => ({Key:defaultTKey,Value:defaultTValue})


export type Dictionary<TKey,TValue> = { [key: string]: TValue }
export var defaultDictionary: <TKey,TValue>(defaultTKey:TKey,defaultTValue:TValue) => Dictionary<TKey,TValue> = <TKey,TValue>(defaultTKey:TKey,defaultTValue:TValue) => ({})

