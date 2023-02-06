import React from "react"
import { AppShell, MantineProvider, Navbar } from "@mantine/core"
import { ThemeIcon, UnstyledButton, Group, Text } from "@mantine/core"
import { AllContentRoutes } from "./navigation"
import { BrowserRouter, useMatch, useNavigate } from "react-router-dom"
import { QueryClient, QueryClientProvider } from "react-query"
import { NotificationsProvider } from "@mantine/notifications"
import { VscAzure, VscCloudUpload } from "react-icons/vsc"
import { FiChevronsRight } from "react-icons/fi"
import { BsFileEarmarkRichtextFill } from "react-icons/bs"
import { MainLinks, MainLinkProps } from "glow-mantine"
import {
  AuthenticationProvider,
  GlowProvider,
  NotificationsProvider as GlowNotificationProvider,
  VnextAuthenticationProvider,
} from "glow-core"
import { TypedNotificationsProvider } from "glow-core/lib/notifications/type-notifications"

const data: MainLinkProps[] = [
  {
    icon: <BsFileEarmarkRichtextFill />,
    color: "teal",
    label: "Indexed files",
    to: "/indexed-files",
  },
  {
    label: "Untagged files #1",
    to: "/untagged-files",
  },

  {
    color: "black",
    label: "Untagged files",
    to: "/indexed-files/next-untagged",
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
  // { icon: undefined, color: "violet", label: "Discussions" },
  // { icon: undefined, color: "grape", label: "Databases" },
]

// export function MainLinks() {
//   const links = data.map((link) => <MainLink {...link} key={link.label} />)
//   return <div>{links}</div>
// }

const client = new QueryClient()
function App() {
  return (
    <BrowserRouter>
      <QueryClientProvider client={client}>
        <VnextAuthenticationProvider>
          <GlowProvider value={{ componentLibrary: "mantine" }}>
            <GlowNotificationProvider>
              <TypedNotificationsProvider>
                <MantineProvider
                  theme={{
                    colorScheme: "dark",
                  }}
                >
                  <NotificationsProvider position="bottom-center">
                    <AppShell
                      padding="md"
                      navbar={
                        <Navbar width={{ base: 250 }}>
                          {/* Navbar content */}
                          {/* First section with normal height (depends on section content) */}
                          {/* <Navbar.Section>First section</Navbar.Section> */}

                          {/* Grow section will take all available space that is not taken by first and last sections */}
                          <Navbar.Section grow>
                            <MainLinks data={data} size="xl" />
                          </Navbar.Section>

                          {/* Last section with normal height (depends on section content) */}
                          {/* <Navbar.Section>Last section</Navbar.Section> */}
                        </Navbar>
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
                  </NotificationsProvider>
                </MantineProvider>
              </TypedNotificationsProvider>
            </GlowNotificationProvider>
          </GlowProvider>
        </VnextAuthenticationProvider>
      </QueryClientProvider>
    </BrowserRouter>
  )
}

export default App
