import { FileAdded } from "./AzureFiles"
import { defaultFileAdded } from "./AzureFiles"

export type FSharpOption_Case_None<T> = null

export type FSharpOption_Case_Some<T> = {
  case: "Some",
  fields: [T]
}


export type FSharpOption<T> = FSharpOption_Case_None<T> | FSharpOption_Case_Some<T>


export const defaultFSharpOption = null

