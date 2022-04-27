module Tests

open System
open Microsoft.AspNetCore.TestHost
open Xunit
open System.Threading.Tasks
open Microsoft.AspNetCore.Mvc.Testing
open Glow.Tests

[<Fact>]
let ``My test`` () =
    let x = GlowSample.Program.main

    let builder = GlowSample.Program.getBuilder( [||])
    let testServer = new TestServer(builder.WebHost)
    let client = testServer.CreateClient()
    client.PostRequest


    Assert.True(true)
//    let client = application.CreateClient()
//    task {
//        Assert.Equals("",client.ToString())
//    }
