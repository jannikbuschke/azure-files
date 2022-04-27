namespace ExpectoTests


open System.Threading.Tasks
open Expecto
open Expecto.Logging
open Microsoft.AspNetCore.Mvc.Testing
open Microsoft.AspNetCore.TestHost

module Tests=

    let builder = GlowSample.Program.getBuilder( [||])
    let testServer = new TestServer(builder.WebHost)
    let client = testServer.CreateClient()


    let x () =
        async {
            Task.Delay(1000)
            return 5
        }

    let y () =
        async {
            Task.Delay(2000)
            return 1
        }

    let z () =
        async {
            Task.Delay(500)
            return 2
        }

    let runAll () =
        task {
            let first = x ()
            let second = y ()
            let third = z ()
            return "all"
        }

    [<Tests>]
    let testChannels =
        testList
            "channel tests"
            [

              test "one test" { Expect.equal (2 + 2) 4 "2+2" }


              testTask "this is a task test" {



                  let! n = Task.FromResult 2
                  Expect.equal n 2 "n=2"
              }

              ]


    //[<Tests>]
    let tests =
        testList
            "samples"
            [ testCase "universe exists (╭ರᴥ•́)"
              <| fun _ ->
                  let subject = true
                  Expect.isTrue subject "I compute, therefore I am."

              testCase "when true is not"
              <| fun _ ->
                  let subject = false
                  Expect.isFalse subject "I should not fail because the subject is false"

              testCase "I'm skipped (should skip)"
              <| fun _ -> Tests.skiptest "Yup, waiting for a sunny day..."

              //    testCase "I'm always fail (should fail)" <| fun _ ->
    //      Tests.suc "This was expected..."

              testCase "contains things"
              <| fun _ -> Expect.containsAll [| 2; 3; 4 |] [| 2; 4 |] "This is the case; {2,3,4} contains {2,4}"

              testCase "contains things #2)"
              <| fun _ -> Expect.containsAll [| 2; 3; 4 |] [| 2; 4 |] "Expecting we have one (1) in there"

              testCase "Sometimes I want to ༼ノಠل͟ಠ༽ノ ︵ ┻━┻"
              <| fun _ -> Expect.equal "abcdef" "abcdef" "These should equal"

              //    test "I am (should fail)" {
    //      "╰〳 ಠ 益 ಠೃ 〵╯" |> Expect.equal true false
    //    }
              ]
