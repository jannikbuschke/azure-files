module ListCE0

type ListWorkflowBuilder() =
  member this.Bind(x,f)=
      printfn "collect %A" x
      x |> List.collect f
  member this.Return(x)=
      [x]
  member this.For(x,f)=
      printfn "For %A" x
      this.Bind(x,f)
  member this.Zero()=
      []
  member this.Yield(x)=
      printfn "Yield %A" x
      [x]
  member this.YieldFrom(x)=
      x
  member this.Combine(a,b)=
      a@b
  member this.Delay(f)=
      f()

let list = ListWorkflowBuilder()

list {
    for x in [1;2;3;5] do // list is given to bind, for each element the rest of the CE is executed
        for y in [6;8] do
            yield x+y
} |> printfn "Result from for in with yield: %A"


list {
    yield 1
    yield 2
    } |> printfn "Result for yield then yield: %A"

list {
    yield 1
    yield! [2;3]
    } |> printfn "Result for yield then yield! : %A"

list {
    for i in ["red";"blue"] do
        yield i
        for j in ["hat";"tie"] do
            yield! [i + " " + j;"-"]
    } |> printfn "Result for for..in..do : %A"
