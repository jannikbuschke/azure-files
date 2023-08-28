import {
  AppShell,
  Burger,
  Card,
  Header,
  MantineProvider,
  MediaQuery,
  Navbar,
} from "@mantine/core"
import { Group, Text } from "@mantine/core"
import { AllContentRoutes } from "./navigation"
import { BrowserRouter, Route, Routes, useSearchParams } from "react-router-dom"
import { QueryClient, QueryClientProvider } from "react-query"
import { NotificationsProvider } from "@mantine/notifications"
import { VscAzure, VscCloudUpload } from "react-icons/vsc"
import { FiChevronsRight } from "react-icons/fi"
import { TbInbox, TbPolaroid } from "react-icons/tb"
import { MainLinks, MainLinkProps } from "glow-mantine"
import {
  GlowProvider,
  NotificationsProvider as GlowNotificationProvider,
  VnextAuthenticationProvider,
} from "glow-core"
import { TypedNotificationsProvider } from "glow-core/lib/notifications/type-notifications"
import React from "react"
import { useTypedQuery } from "./client/api"
import { DynamicGalleryPage } from "./my-actions/get-dynamic-gallery"
import { ViewGallery } from "./my-actions/view-gallery"
import "yet-another-react-lightbox/styles.css"

const navbarLinks: MainLinkProps[] = [
  {
    icon: <TbInbox />,
    color: "teal",
    label: "Inbox",
    to: "/inbox",
  },
  {
    icon: <TbPolaroid />,
    color: "green",
    label: "Images",
    to: "/images",
  },
  {
    icon: <VscAzure />,
    color: "blue",
    label: "Blob containers",
    to: "/container",
  },
  {
    icon: <VscCloudUpload />,
    color: "black",
    label: "Upload file",
    to: "/upload-file",
  },
  {
    icon: <FiChevronsRight />,
    color: "red",
    label: "Actions",
    to: "/actions",
  },
  {
    icon: <FiChevronsRight />,
    color: "red",
    label: "Events",
    to: "/debug/events",
  },
]

// const client = new QueryClient()

// export function Provider({ children }: { children: React.ReactNode }) {
//   return (
//     <BrowserRouter>
//       <QueryClientProvider client={client}>
//         <VnextAuthenticationProvider>
//           <GlowProvider value={{ componentLibrary: "mantine" }}>
//             <GlowNotificationProvider>
//               <TypedNotificationsProvider>
//                 <MantineProvider
//                   theme={{
//                     colorScheme: "light",
//                   }}
//                 >
//                   <NotificationsProvider position="bottom-center">
//                     {children}
//                   </NotificationsProvider>
//                 </MantineProvider>
//               </TypedNotificationsProvider>
//             </GlowNotificationProvider>
//           </GlowProvider>
//         </VnextAuthenticationProvider>
//       </QueryClientProvider>
//     </BrowserRouter>
//   )
// }

export function App() {
  const [opened, setOpened] = React.useState(false)
  const [searchParams, setSearchParams] = useSearchParams()

  const hideNavbar = Boolean(searchParams.get("hide-navbar"))

  const { data } = useTypedQuery("/api/get-navbar", {
    input: {},
    placeholder: null as any,
    queryOptions: {
      useErrorBoundary: true,
      suspense: true,
    },
  })

  return (
    <Routes>
      <Route path="dynamic-gallery" element={<DynamicGalleryPage />} />
      <Route path="/g/:name" element={<ViewGallery />} />

      <Route
        path="*"
        element={
          <AppShell
            navbarOffsetBreakpoint="sm"
            asideOffsetBreakpoint="sm"
            padding="md"
            // header={
            //   <Header height={{ base: 50, md: 70 }} p="md">
            //     <div
            //       style={{
            //         display: "flex",
            //         alignItems: "center",
            //         height: "100%",
            //       }}
            //     >
            //       <MediaQuery largerThan="sm" styles={{ display: "none" }}>
            //         <Burger
            //           opened={opened}
            //           onClick={() => setOpened((o) => !o)}
            //           size="sm"
            //           mr="xl"
            //         />
            //       </MediaQuery>
            //     </div>
            //   </Header>
            // }
            navbar={
              hideNavbar ? undefined : (
                <Navbar
                  hidden={!opened}
                  hiddenBreakpoint="xs"
                  width={{ sm: 200, lg: 300 }}
                >
                  {data.message && (
                    <Navbar.Section>
                      <Card radius={0}>
                        <Card.Section
                          opacity={0.8}
                          bg={data.message.color}
                          p="xs"
                        >
                          {data.message.title}
                        </Card.Section>
                      </Card>
                    </Navbar.Section>
                  )}
                  <Navbar.Section grow>
                    <MainLinks data={navbarLinks} size="xl" />
                  </Navbar.Section>
                </Navbar>
              )
            }
            // header={
            //   <Header height={60} p="xs">
            //     {/* Header content */}
            //   </Header>
            // }
            styles={(theme) => ({
              main: {
                backgroundColor:
                  theme.colorScheme === "dark"
                    ? theme.colors.dark[8]
                    : theme.colors.gray[0],
              },
            })}
          >
            <AllContentRoutes />
            {/* <UploadFile /> */}
            {/* Your application here */}
          </AppShell>
        }
      />
    </Routes>
  )
}
