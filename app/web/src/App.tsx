import { AppShell, Card, Navbar } from "@mantine/core"
import { AllContentRoutes } from "./navigation"
import { Route, Routes, useSearchParams } from "react-router-dom"
import { VscAzure, VscCloudUpload } from "react-icons/vsc"
import { FiChevronsRight } from "react-icons/fi"
import { TbInbox, TbPolaroid } from "react-icons/tb"
import { MainLinks, MainLinkProps } from "glow-mantine"
import React from "react"
import { useTypedQuery } from "./client/api"
import { DynamicGalleryPage } from "./gallery/get-dynamic-gallery"
import { ViewGallery } from "./gallery/view-gallery"
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
    icon: <TbPolaroid />,
    color: "blue",
    label: "Galleries",
    to: "/gallery",
  },
  {
    icon: <TbPolaroid />,
    color: "blue",
    label: "Dynamic/Tagmany",
    to: "/dynamic-gallery",
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
