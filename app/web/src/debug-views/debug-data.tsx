import { useLocalStorage } from "@mantine/hooks"
import { Button } from "@mantine/core"
import { Collapse } from "@mantine/core"
import { Prism } from "@mantine/prism"
import { useFormikContext } from "formik"
import * as React from "react"

function Content() {
  const ctx = useFormikContext()
  const [opened, setOpened] = React.useState(false)
  return (
    <>
      <Button
        size="xs"
        color="gray"
        variant="subtle"
        onClick={() => setOpened((o) => !o)}
      >
        formik data
      </Button>
      <Collapse in={opened}>
        <Prism language="json">{JSON.stringify(ctx, null, 2)}</Prism>
      </Collapse>
    </>
  )
}
