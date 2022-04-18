module test.expecto

open Expecto


[<EntryPoint>]
let main argv =

    // Invoke Expecto:
    Tests.runTestsInAssemblyWithCLIArgs [] argv
//
//[<EntryPoint>]
//let main argv =
//    Tests.runTestsInAssembly defaultConfig argv
