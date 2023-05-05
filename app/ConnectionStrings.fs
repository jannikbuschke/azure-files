module AzFiles.Config

[<CLIMutable>]
type ConnectionStrings = { Db: string; AzureBlob: string }
