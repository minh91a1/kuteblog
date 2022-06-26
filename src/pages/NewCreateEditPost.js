import { React, useState, useEffect, useRef } from "react"
import { CheckIcon } from "@chakra-ui/icons"
import { useNavigate, useParams } from "react-router-dom"
import { Box, Button, Input } from "@chakra-ui/react"
import ABasePage from "./ABasePage"
import { useToast } from "@chakra-ui/react"

import { Editor } from "@tinymce/tinymce-react"
import useFetchMutation from "../hooks/useFetchMutation"
import useFetchOne from "../hooks/useFetchOne"
import { useAuth } from "../hooks/useAuth.js"
import { METHOD } from "../utils/fetcher.js"
import ImageUploader from "../widgets/ImageUploader"

function EditPost({ isAuth }) {
  const onUpdatePostSuccess = () => {
    navigate("/kuteblog")
  }
  const onCompleted = () => {}

  const imageRef = useRef(null)
  const editorRef = useRef(null)
  const params = useParams()
  const { pending, auth } = useAuth()

  const [title, setTitle] = useState("")
  const [post, setPost] = useState("")
  const [imagePath, setImagePath] = useState("")

  const { isLoading, data, error } = useFetchOne("post", params.postId)

  const { submit, isSubmitting, hasError } = useFetchMutation(
    METHOD.POST,
    "post" + (params.postId ? "/" + params.postId : ""),
    onUpdatePostSuccess,
    onCompleted
  )

  let navigate = useNavigate()
  const toast = useToast()

  const updatePost = async () => {
    //* post
    var myContent = editorRef.current.getContent() //! contain tag <p>, etc.
    let plainText = editorRef.current.getContent({ format: "text" }) //! contain only text

    //* title
    if (!title) {
      toast({
        title: "Title must not empty!",
        description: "Nothing good if title is empty @_@.",
        status: "error",
        duration: 9000,
        isClosable: true,
      })
      return
    }

    //* authorId
    const authorId = auth.currentUser.uid
    let img = imageRef.current.get()
    if (img === null || img === undefined) {
      img = imagePath
    }

    const payload = {
      title,
      imagePath: img, //! payload should have exact name (for upload.single("imagePath"))
      post: myContent,
      shortPost: plainText.substring(0, 250),
      authorId,
    }

    submit(payload)
  }

  useEffect(() => {
    if (data && data.length > 0) {
      let postData = data[0]
      if (postData.title) setTitle(postData.title)
      if (postData.post) setPost(postData.post)
      if (postData.imagePath) setImagePath(postData.imagePath)
    }
  }, [data])

  useEffect(() => {
    if (hasError) {
      toast({
        title: "Server not accept this request!",
        description:
          "Please check your input or contact admin for more information!.",
        status: "error",
        duration: 9000,
        isClosable: true,
      })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hasError])

  useEffect(() => {
    if (!isAuth) {
      navigate("/kuteblog/login")
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <ABasePage
      error={error}
      isLoading={isLoading || pending}
      actionButtons={
        <Button onClick={updatePost} bg="yellowgreen" color={"white"}>
          {isSubmitting ? "Saving..." : <CheckIcon />}
        </Button>
      }
      content={
        <>
          <Box>
            <Input
              value={title}
              placeholder="Input title"
              onChange={(event) => {
                setTitle(event.target.value)
              }}
            ></Input>
          </Box>

          <ImageUploader ref={imageRef} value={imagePath} />

          <Box background="green.50">
            <Editor
              apiKey="qquo11hnj7kfwwjjusbrxt69wlxe0l24c3dyehw7a57j0vpm"
              onInit={(evt, editor) => (editorRef.current = editor)}
              initialValue={post}
              init={{
                height: 350,

                menubar: true,

                plugins: [
                  "advlist",
                  "autolink",

                  "lists",
                  "link",
                  "image",
                  "charmap",
                  "preview",
                  "anchor",
                  "searchreplace",
                  "visualblocks",

                  "fullscreen",
                  "insertdatetime",
                  "media",
                  "table",
                  "help",
                  "wordcount",
                ],

                editor_encoding: "raw",

                toolbar:
                  "undo redo | casechange blocks | bold italic backcolor | " +
                  "alignleft aligncenter alignright alignjustify | " +
                  "bullist numlist checklist outdent indent | removeformat | a11ycheck code table help",

                content_style:
                  "body { font-family:Helvetica,Arial,sans-serif; font-size:14px }",
              }}
            />
          </Box>
        </>
      }
    ></ABasePage>
  )
}

export default EditPost
