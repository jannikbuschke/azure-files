import React from "react"
import { AppShell, Header, MantineProvider, Navbar } from "@mantine/core"

import { ThemeIcon, UnstyledButton, Group, Text } from "@mantine/core"
import { UploadFile } from "./blob-container/upload-file"
import { AllContentRoutes } from "./navigation"
import { BrowserRouter, useMatch, useNavigate } from "react-router-dom"
import { QueryClient, QueryClientProvider } from "react-query"

interface MainLinkProps {
  icon: React.ReactNode
  color: string
  label: string
  to: string
}

function MainLink({ icon, color, label, to }: MainLinkProps) {
  const matchPattern = to.endsWith("*")
    ? to
    : to.endsWith("/")
    ? `${to}*`
    : `${to}/*`
  const match = useMatch(matchPattern)
  const navigate = useNavigate()
  return (
    <UnstyledButton
      onClick={() => navigate(to)}
      sx={(theme) => ({
        display: "block",
        width: "100%",
        padding: theme.spacing.xs,
        borderRadius: theme.radius.sm,
        color:
          theme.colorScheme === "dark" ? theme.colors.dark[0] : theme.black,
        backgroundColor: match !== null ? theme.colors.blue[1] : undefined,
        "&:hover": {
          backgroundColor:
            theme.colorScheme === "dark"
              ? theme.colors.dark[6]
              : theme.colors.gray[2],
        },
      })}
    >
      <Group>
        <ThemeIcon color={color} variant="light">
          {icon}
        </ThemeIcon>

        <Text size="sm">{label}</Text>
      </Group>
    </UnstyledButton>
  )
}

const data = [
  {
    icon: undefined,
    color: "blue",
    label: "Blob containers",
    to: "/container",
  },
  { icon: undefined, color: "teal", label: "Upload file", to: "/upload-file" },
  // { icon: undefined, color: "violet", label: "Discussions" },
  // { icon: undefined, color: "grape", label: "Databases" },
]

export function MainLinks() {
  const links = data.map((link) => <MainLink {...link} key={link.label} />)
  return <div>{links}</div>
}

const client = new QueryClient()
function App() {
  return (
    <BrowserRouter>
      <QueryClientProvider client={client}>
        <MantineProvider
          theme={{
            // colorScheme: "dark",
            colorScheme: "light",
            // Override any other properties from default theme
            // fontFamily: "Open Sans, sans serif",
            spacing: { xs: 15, sm: 20, md: 25, lg: 30, xl: 40 },
          }}
        >
          <AppShell
            padding="md"
            navbar={
              <Navbar width={{ base: 300 }} p="xs">
                {/* Navbar content */}
                {/* First section with normal height (depends on section content) */}
                {/* <Navbar.Section>First section</Navbar.Section> */}

                {/* Grow section will take all available space that is not taken by first and last sections */}
                <Navbar.Section grow>
                  <MainLinks />
                </Navbar.Section>

                {/* Last section with normal height (depends on section content) */}
                {/* <Navbar.Section>Last section</Navbar.Section> */}
              </Navbar>
            }
            header={
              <Header height={60} p="xs">
                {/* Header content */}
              </Header>
            }
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
        </MantineProvider>
      </QueryClientProvider>
    </BrowserRouter>
  )
}

export default App
