namespace AzFiles.Features.Fsi


open AzFiles
open FSharp.Compiler.Interactive.Shell
open FSharp.Compiler.Tokenization

open System
open System.IO
open System.Text
open MediatR
open Glow.Core.Actions

type SampleObject() =
  let mutable result: obj = null
  member this.Hello() = "Hello World!"
  member this.SetResult(v) = result <- v
  member this.GetResult() = result

type EvalResult =
  { Out: string option
    Error: string option
    Result: obj }

module Option =
  let fromString s =
    if String.IsNullOrWhiteSpace(s) then
      None
    else
      Some s

module CompilerService =

  // Initialize output and input streams
  let sbOut = new StringBuilder()
  let sbErr = new StringBuilder()
  let inStream = new StringReader("")
  let outStream = new StringWriter(sbOut)
  let errStream = new StringWriter(sbErr)

  // Build command line arguments & start FSI session
  let argv = [| "dotnet fsi" |]

  let allArgs = Array.append argv [| "--noninteractive" |]

  let fsiConfig = FsiEvaluationSession.GetDefaultConfiguration()

  let fsiSession =
    FsiEvaluationSession.Create(fsiConfig, allArgs, inStream, outStream, errStream)

  /// Evaluate expression & return the result
  let evalExpression text =
    let sample = SampleObject()
    // fsiSession.ValueBound.AddHandler
    fsiSession.AddBoundValue("x", sample)

    match fsiSession.EvalExpression(text) with
    | Some value -> printfn "%A" value.ReflectionValue
    | None -> printfn "Got no result!"

    { EvalResult.Out = outStream.ToString() |> Option.fromString
      Error = errStream.ToString() |> Option.fromString
      Result = sample.GetResult() }

// try
//   evalExpression "42+1" // prints '43'
// with
// | e ->
//   printfn "Error: %A" e
//   printfn "Error stream %s" (sbErr.ToString())

/// Evaluate expression & return the result, strongly typed
// let evalExpressionTyped<'T> (text) =
//   match fsiSession.EvalExpression(text) with
//   | Some value -> value.ReflectionValue |> unbox<'T>
//   | None -> failwith "Got no result!"
//
// let result = evalExpressionTyped<int> "42+1" // gives '43'
//
// fsiSession.EvalInteraction "printfn \"bye\""

[<Action(Route = "api/fsi/evaluate", AllowAnonymous = true)>]
type EvaluateFs =
  { Expression: string }
  interface IRequest<Result<EvalResult, ApiError>>

type EvaluateFsHandler() =
  interface IRequestHandler<EvaluateFs, Result<EvalResult, ApiError>> with
    member this.Handle(request, token) =
      task {
        let stopWatch = System.Diagnostics.Stopwatch.StartNew()
        let result = CompilerService.evalExpression request.Expression
        stopWatch.Stop()
        printfn "Result type %A value = %A" (result.Result.GetType()) (result.Result)
        return result |> Result.Ok
      }
