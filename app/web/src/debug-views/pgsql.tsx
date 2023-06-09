import { Container, Paper, Table } from "@mantine/core"
import { ErrorBanner, RenderObject } from "glow-core"
import { useTypedQuery } from "../client/api"

export function PgsqlActivities() {
  // const { data, error } = useTypedQuery("/api/pgsql/get-activity", {
  //   input: {},
  //   placeholder: [],
  // })

  return null
  // return (
  //   <Container>
  //     <Paper p="md" shadow="xs">
  //       <ErrorBanner message={error} />
  //       <Table>
  //         <table>
  //           <thead>
  //             <tr>
  //               <th>user</th>
  //               <th>db</th>
  //               <th>state</th>
  //               <th>pid</th>
  //               <th
  //                 style={{
  //                   maxWidth: 600,
  //                   textOverflow: "ellipsis",
  //                   overflow: "hidden",
  //                   whiteSpace: "nowrap",
  //                 }}
  //               >
  //                 query
  //               </th>
  //             </tr>
  //           </thead>
  //           <tbody>
  //             {data.map((v) => (
  //               <tr>
  //                 <td>{typeof v.username == "string" ? v.username : ""}</td>
  //                 <td>{typeof v.db == "string" ? v.db : ""}</td>
  //                 <td>{typeof v.state == "string" ? v.state : ""}</td>
  //                 <td>{v.pid}</td>
  //                 <td
  //                   style={{
  //                     maxWidth: 600,
  //                     textOverflow: "ellipsis",
  //                     overflow: "hidden",
  //                     whiteSpace: "nowrap",
  //                   }}
  //                 >
  //                   {v.query}
  //                 </td>
  //               </tr>
  //             ))}
  //           </tbody>
  //         </table>
  //       </Table>
  //     </Paper>
  //   </Container>
  // )
}
