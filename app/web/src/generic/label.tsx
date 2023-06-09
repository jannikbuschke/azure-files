import { Box } from "@mantine/core"
import React from "react"
import { useTranslation } from "react-i18next"

export function Field({
  label,
  children,
  labelSuffix,
}: {
  labelSuffix?: string | undefined
  label: string
  children: React.ReactNode
}) {
  return (
    <div>
      <Label>{`${label}${labelSuffix ? ` (${labelSuffix})` : ""}`}</Label>
      {children}
    </div>
  )
}

export function Label({ children }: { children: string }) {
  const { t } = useTranslation()
  return (
    <Box
      component="label"
      sx={(theme) => ({
        display: "block",
        // should be same as default mantine label
        color:
          theme.colorScheme === "dark"
            ? theme.colors.gray![2]
            : theme.colors.gray![9] || undefined,
        fontSize: 14,
        fontWeight: 500,
      })}
    >
      {t(children)}
    </Box>
  )
}
