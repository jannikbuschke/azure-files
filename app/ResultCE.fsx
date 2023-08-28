
type ResultBuilder() =
    member this.Bind(m, f) =
        match m with
        | Result.Ok ok->
            printfn "Binding with Ok(%A). Continuing." ok
            ok
        | Result.Error e ->
            printfn "Binding with Error(%A). Continuing" e
            e

//        Result.bind f m
//        Option.bind f m

    member this.Return(x) =
        printfn "Returning a unwrapped %A as an Result.Ok" x
        Result.Ok x


    // make an instance of the workflow
let result = new ResultBuilder()

result {
  let! x = Result.Ok "Hello"
  let! e = Result.Error 5
  return x
} |> (fun v -> printfn "Result %A" v)
