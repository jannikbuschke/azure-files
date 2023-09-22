module AzFiles.DbMigrate

open System.Data
open System.Threading.Tasks
open Dapper
open FsToolkit.ErrorHandling
open Microsoft.Extensions.Logging
open Npgsql
open Npgsql.FSharp

let ensureMigrateTableExists (connection: IDbConnection) =
  connection.ExecuteAsync(
    """
  CREATE TABLE IF NOT EXISTS public.migrations (
  id varchar(450) PRIMARY KEY
)"""
  )

type Migration =
  { Id: string
    AppliedAt: NodaTime.Instant }

let getAppliedMigrations (connection: NpgsqlConnection) =
  connection
  |> Sql.existingConnection
  |> Sql.query "SELECT id FROM public.migrations WHERE Filename"
  |> Sql.executeAsync (fun read ->
    { Id = read.string "id"
      AppliedAt = 0 |> NodaTime.Instant.FromUnixTimeMilliseconds })

// (string * (string * SqlValue) list list) list
type Transaction = string * (string * SqlValue) list list
type Transactions = Transaction list

let conditionallyApplyMigration
  (connectionstring: string)
  (migrationId: string)
  (createTransactions: unit -> Task<Transaction list>)
  =
  task {
    use connection = new NpgsqlConnection(connectionstring)
    do! connection.OpenAsync()
    // let connection = session.Connection

    let loggerFactory =
      LoggerFactory.Create(fun builder -> builder.AddConsole() |> ignore)

    NpgsqlLoggingConfiguration.InitializeLogging(loggerFactory)

    let! result = ensureMigrateTableExists connection
    let! appliedMigrations = getAppliedMigrations connection

    if appliedMigrations |> List.exists (fun m -> m.Id = migrationId) then
      return []
    else

      // let! result =
      //   connection
      //   |> Sql.existingConnection
      //   |> Sql.query "INSERT INTO public.migrations (id,applied_at) VALUES ('hello1', 0)"
      //   |> Sql.executeNonQueryAsync

      // let! result =
      //   connection
      //   |> Sql.existingConnection
      //   |> Sql.query "INSERT INTO public.migrations (id, applied_at) VALUES (@id, @applied_at)"
      //   |> Sql.parameters [ "@id", migrationId |> Sql.string
      //                       "@applied_at", 0 |> Sql.int64 ]
      //   |> Sql.executeNonQueryAsync

      // (string * (string * SqlValue) list list) list
      // let applyMigration: Transaction =
      //   "INSERT INTO public.migrations (id) VALUES (@id)", [ [ "@id", "hello3453454" |> Sql.string ] ]
      // let transactions:(string * ((string * SqlValue) list) list) list = []


      // use transaction = connection.BeginTransaction()
      //
      // for cmd in transactions do
      //   let (sql, parameters) = cmd
      //
      //   let! result =
      //     connection
      //     |> Sql.existingConnection
      //     |> Sql.query sql
      //     |> Sql.parameters parameters[0]
      //     |> Sql.executeNonQueryAsync
      //
      //   printfn "%A" result
      //
      // transaction.Commit()

      let! transactions = createTransactions ()

      let allTransactions: Transactions =
        ("INSERT INTO public.migrations (id) VALUES (@id)", [ [ "@id", migrationId |> Sql.string ] ])
        :: transactions

      let! result =
        connection
        |> Sql.existingConnection
        |> Sql.executeTransactionAsync (allTransactions)


      return []
  }
// |> Sql.executeTransactionAsync
//   [
//       // This query is executed 3 times
//       // using three different set of parameters
//       "INSERT INTO ... VALUES (@number)", [
//           [ "@number", Sql.int 1 ]
//           [ "@number", Sql.int 2 ]
//           [ "@number", Sql.int 3 ]
//       ]
//
//       // This query is executed once
//       "UPDATE ... SET meta = @meta",  [
//          [ "@meta", Sql.text value ]
//       ]
//  ]