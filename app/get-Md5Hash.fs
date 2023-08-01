namespace AzFiles

open System.IO
open AzFiles
open System

module WorkflowUtils =

  let getMd5HashFromStream (stream: Stream) : Checksum =
    use md5 = System.Security.Cryptography.MD5.Create()

    let hash = md5.ComputeHash(stream)
    let re = Convert.ToBase64String(hash)

    Checksum re

  let getMd5Hash (filename: string) : Checksum =
    use stream = System.IO.File.OpenRead(filename)
    getMd5HashFromStream stream
