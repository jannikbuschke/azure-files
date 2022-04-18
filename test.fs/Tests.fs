module Tests

open System
open Xunit
open System.Threading.Tasks

[<Fact>]
let ``My test`` () =
    task {
        let! result = Task.Run(fun v -> Serilog.Log.Logger.Information("running first task"))
        Assert.True(true)
    }
