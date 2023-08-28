#r "nuget: SixLabors.ImageSharp,3.0.1"

open System
open System.IO
open SixLabors
open SixLabors.ImageSharp
open SixLabors.ImageSharp.Processing

let scaleDown path =
    let fileInfo = FileInfo(path)
    use stream0 = System.IO.File.Open(path, FileMode.Open)
    use img = Image.Load stream0
    img.Mutate(fun v ->
//        let options = ResizeOptions()
//        v.Resize(options)
        v.Resize(img.Width / 2, img.Height / 2) |> ignore
    )
    printf "File = %s\n" fileInfo.Name
    let name2 = fileInfo.Name.Substring(0, (fileInfo.Name.Length-fileInfo.Extension.Length))
    printf "File = %s\n" name2

    img.Save(sprintf "%s-scaled-down%s" name2 fileInfo.Extension)
    printf "Scaled down File = %s\n" fileInfo.Name
    ()

let rotate path =
    let fileInfo = FileInfo(path)
    use stream0 = System.IO.File.Open(path,FileMode.Open)
    use img = Image.Load stream0

    img.Mutate(fun v ->
        v.Rotate(90f) |> ignore
//        let options = ResizeOptions()
//        v.Resize(options)
//        v.Resize(img.Width/2,img.Height/2)|>ignore
    )
    printf "File = %s\n" fileInfo.Name
    let name2 = fileInfo.Name.Substring(0,(fileInfo.Name.Length-fileInfo.Extension.Length))
    printf "File = %s\n" name2

    img.Save(sprintf "%s-rotate-90%s" name2 fileInfo.Extension)
scaleDown("./input0.jpg")
rotate("./input1.jpg")
