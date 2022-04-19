namespace AzureFiles

module Domain =

  type FileAdded = {
    Filename: string
    Md5Hash: byte array
    Id: System.Guid
  }