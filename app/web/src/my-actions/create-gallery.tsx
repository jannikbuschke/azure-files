import {
  Autocomplete,
  Box,
  Button,
  SegmentedControl,
  Stack,
} from "@mantine/core"
import { Textarea, TextInput } from "formik-mantine"
import { useNavigate } from "react-router"
import { PathProxy, TypedForm } from "../client/api"
import { QueryWithBoundary } from "../query"
import { FormikProps } from "formik"
import {
  AddImagesOnBasedOn,
  CreateGallery,
} from "../client/AzFiles_Features_Gallery"

export function TagAutoComplete({
  f,
  _,
}: {
  f: FormikProps<CreateGallery> | FormikProps<AddImagesOnBasedOn>
  _:
    | PathProxy<CreateGallery, CreateGallery>
    | PathProxy<AddImagesOnBasedOn, AddImagesOnBasedOn>
}) {
  return (
    <QueryWithBoundary
      name="/api/get-tags"
      input={{ none: { skip: undefined } }}
    >
      {(data) => (
        <Autocomplete
          onChange={(v) =>
            f.setFieldValue(_.basedOn._PATH_, {
              Case: "Tagged",
              Fields: [v],
            })
          }
          value={
            f.values.basedOn.Case === "Tagged" ? f.values.basedOn.Fields[0] : ""
          }
          label="Based on tag"
          placeholder="Tags"
          data={data}
        />
      )}
    </QueryWithBoundary>
  )
}

export function CreateGalleryView() {
  const navigate = useNavigate()
  return (
    <Box>
      <TypedForm
        actionName="/api/features/gallery/create-gallery"
        initialValues={{
          name: "",
          description: "",
          basedOn: { Case: "Tagged", Fields: [] },
        }}
        onSuccess={(result) => {
          if (result.Case === "Ok") {
            navigate(`../${result.Fields}`)
          } else {
            console.error({ result })
          }
        }}
      >
        {(f, _) => (
          <Box>
            <Stack spacing="xs">
              <TextInput label="Name" name={_.name._PATH_} />
              <Textarea label="Description" name={_.description._PATH_} />
              <TagAutoComplete f={f} _={_} />

              <Button loading={f.isSubmitting} onClick={f.submitForm}>
                Create gallery
              </Button>
            </Stack>
          </Box>
        )}
      </TypedForm>
    </Box>
  )
}
