module CE

type TraceBuilder() =
    member this.Bind(m, f) =
        match m with
        | None ->
            printfn "Binding with None. Exiting."
        | Some a ->
            printfn "Binding with Some(%A). Continuing" a
        Option.bind f m

    member this.Return(x) =
        printfn "Returning a unwrapped %A as an option" x
        Some x

    member this.ReturnFrom(m) =
        printfn "Returning an option (%A) directly" m
        m

    member this.Zero() =
        printfn "Zero"
        None

    member this.Yield(x) =
        printfn "Yield an unwrapped %A as an option" x
        Some x

    member this.YieldFrom(m) =
        printfn "Yield an option (%A) directly" m
        m
    member this.Delay(f)=
        printfn("Delay()")
        f()

    member this.Combine(a,b)=
        match a,b with
        | Some a, Some b -> Some (a+b)
        | None, Some b-> Some b
        | Some a, None -> Some a
        | None,None -> None

    // make an instance of the workflow
let trace = new TraceBuilder()

trace {
  yield 1
  yield 5
}
