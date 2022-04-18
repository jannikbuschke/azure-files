namespace AzureFiles

open Azure.Identity
open Azure.Storage.Blobs
open Glow.Glue.AspNetCore
open Microsoft.AspNetCore.Http
open Microsoft.Extensions.Configuration

module Domain =

  type FileAdded = {
    Filename: string
    Md5Hash: byte array
    Id: System.Guid
  }