import { Box } from "@mantine/core"

export function GalleryPreview() {
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "1fr 1fr 1fr 1fr 1fr",
        gap: 8,
      }}
    >
      <Box bg="gray">1</Box>
      <Box bg="cyan">1</Box>
      <Box bg="blue">1</Box>
      <Box bg="grape">1</Box>
      <Box bg="green">1</Box>
      <Box bg="indigo">1</Box>
      <Box bg="pink">1</Box>
      <Box bg="red">1</Box>
    </div>
  )
}

export function GalleryEditor() {
  return null
}
