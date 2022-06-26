import { AddIcon } from "@chakra-ui/icons"
import { Box, Center } from "@chakra-ui/react"
import React, {
  useState,
  useEffect,
  useCallback,
  useRef,
  useImperativeHandle,
  forwardRef,
} from "react"

function ImageUploader(props, ref) {
  const inputRef = useRef()
  const [selectedFile, setSelectedFile] = useState(null)
  const [preview, setPreview] = useState()

  useEffect(() => {
    if (props.value) setPreview(process.env.REACT_APP_API_URL + props.value)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.value])

  useEffect(() => {
    if (!selectedFile) {
      return
    }

    const objectUrl = URL.createObjectURL(selectedFile)
    setPreview(objectUrl)

    // free memory when ever this component is unmounted
    return () => URL.revokeObjectURL(objectUrl)
  }, [selectedFile])

  useImperativeHandle(ref, () => ({
    focus: () => {
      inputRef.current.focus()
    },
    get: () => {
      return selectedFile
    },
  }))

  const onFileChange = useCallback((event) => {
    setSelectedFile(event.target.files[0])
  }, [])

  return (
    <div>
      <label htmlFor="file-upload">
        {selectedFile === null && (preview === null || preview === undefined) && (
          <Center>
            <Box
              rounded="md"
              color="gray"
              border="2px"
              borderColor="gray.200"
              borderStyle="dashed"
              m={2}
              p={2}
              width="70%"
              cursor="pointer"
            >
              <Center>Add an image +</Center>
            </Box>
          </Center>
        )}
        {(selectedFile || preview) && (
          <Center mt={2} mb={2} cursor="pointer">
            <Center
              m="3"
              boxShadow="0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19)"
              rounded="md"
              bg="white"
              overflow={"hidden"}
            >
              <img
                style={{ maxHeight: "400px" }}
                src={preview}
                alt="Preview should be here!"
              />
            </Center>
          </Center>
        )}
      </label>
      <input
        style={{ display: "none" }}
        id="file-upload"
        type="file"
        onChange={onFileChange}
      />
    </div>
  )
}

export default forwardRef(ImageUploader)
