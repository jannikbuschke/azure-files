import { MantineProvider } from "@mantine/core"
import { BrowserRouter } from "react-router-dom"
import { QueryClient, QueryClientProvider } from "react-query"
import { NotificationsProvider } from "@mantine/notifications"
import {
  GlowProvider,
  NotificationsProvider as GlowNotificationProvider,
  VnextAuthenticationProvider,
} from "glow-core"
import { TypedNotificationsProvider } from "glow-core/lib/notifications/type-notifications"
import React from "react"

const client = new QueryClient()

export function RootProvider({ children }: { children: React.ReactNode }) {
  return (
    <BrowserRouter>
      <QueryClientProvider client={client}>
        <GlowProvider value={{ componentLibrary: "mantine" }}>
          <VnextAuthenticationProvider>
            <GlowNotificationProvider>
              <TypedNotificationsProvider>
                <MantineProvider
                  theme={{
                    colorScheme: "light",
                  }}
                >
                  <NotificationsProvider position="bottom-center">
                    {children}
                  </NotificationsProvider>
                </MantineProvider>
              </TypedNotificationsProvider>
            </GlowNotificationProvider>
          </VnextAuthenticationProvider>
        </GlowProvider>
      </QueryClientProvider>
    </BrowserRouter>
  )
}
