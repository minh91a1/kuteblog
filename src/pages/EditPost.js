import { async } from '@firebase/util'
import { React, useState, useEffect, useRef  } from 'react'
import { addDoc, doc, updateDoc, getDoc, collection } from "firebase/firestore";
import { CloseIcon, EditIcon, ArrowUpIcon, DeleteIcon, CheckIcon } from '@chakra-ui/icons'
import { auth, db } from '../firebase-config';
import { useNavigate, useParams  } from "react-router-dom";
import { Box, Button, Center, Container, Flex, Input, Spacer, Text, Textarea } from '@chakra-ui/react';
import ABasePage from './ABasePage'
import { useToast } from '@chakra-ui/react'

import { Editor } from '@tinymce/tinymce-react';

function EditPost({ isAuth }) {
  const editorRef = useRef(null);

  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)
  const [isSaving, setIsSaving] = useState(false)
  const [title, setTitle] = useState("")
  const [post, setPost] = useState("")
  const params = useParams();


  var updateDocRef;
  if (params.postId) {
    updateDocRef = doc(db, 'posts', params.postId);
  }
  
  let navigate = useNavigate()
  const toast = useToast()

  const updateToFirebase = async () => {
        var myContent = editorRef.current.getContent();
        let plainText = editorRef.current.getContent({ format: 'text' });

        if (!title) {
          toast({
            title: 'Title must not empty!',
            description: "Nothing good if title is empty @_@.",
            status: 'error',
            duration: 9000,
            isClosable: true,
          })
          return
        }
        
        var updateTime = new Date().getTime()
        var shortPost = plainText.substring(0, 250)
        if (shortPost.length < plainText.length) {
            shortPost += '...'
        }

        setIsSaving(true)

        if (updateDocRef) {
            // EDIT
            await updateDoc(updateDocRef, { del: false, title, post: myContent, shortPost, updateTime, authorId: auth.currentUser.uid, author: {name: auth.currentUser.displayName, id: auth.currentUser.uid } })
        } else {
            // CREATE
            var createTime = new Date().getTime()
            const postsCollectionRef = collection(db, 'posts')
            await addDoc(postsCollectionRef, { del: false, title, shortPost, post: myContent, createTime, updateTime, authorId: auth.currentUser.uid, author: {name: auth.currentUser.displayName, id: auth.currentUser.uid } })
        }
        
        setIsSaving(false)

        navigate('/kuteblog')
  }

    useEffect(() => {
        if (!isAuth) {
            navigate('/kuteblog/login')
        }

        getPost()
    }, [])

    const getPost = async () => {
      setIsLoading(true)
      if (updateDocRef) {
        try {
          let postDoc = await getDoc(updateDocRef)
          let postDocData = postDoc.data()
          setTitle(postDocData.title)
          setPost(postDocData.post)
        } catch (e) {
          setError(e)
        }
      }
      setIsLoading(false)
    }


  return (
    <ABasePage error={error} isLoading={isLoading} actionButtons={
                <Button onClick={updateToFirebase} bg='yellowgreen' color={'white'}>
                    {isSaving ? 'Saving...' : <CheckIcon />}
                </Button>}

                content={
                    <>
                      <Box>
                        <Input value={title} placeholder='Input title' onChange={(event) => {setTitle(event.target.value)}} ></Input>
                      </Box>


                      <Box background='green.50'>
                        <Editor
                                  apiKey="qquo11hnj7kfwwjjusbrxt69wlxe0l24c3dyehw7a57j0vpm"
                                  onInit={(evt, editor) => editorRef.current = editor}

                                  initialValue={post}

                                  init={{

                                  height: 800,

                                  menubar: true,

                                  plugins: [

                                  'a11ychecker','advlist','advcode','advtable','autolink','checklist','export',

                                  'lists','link','image','charmap','preview','anchor','searchreplace','visualblocks',

                                  'powerpaste','fullscreen','formatpainter','insertdatetime','media','table','help','wordcount'

                                  ],

                                  editor_encoding: "raw",

                                  toolbar: 'undo redo | casechange blocks | bold italic backcolor | ' +

                                  'alignleft aligncenter alignright alignjustify | ' +

                                  'bullist numlist checklist outdent indent | removeformat | a11ycheck code table help',

                                  content_style: 'body { font-family:Helvetica,Arial,sans-serif; font-size:14px }'

                                  }}

                              />
                      </Box>
                    </>
                }>
    </ABasePage>
  )
}

export default EditPost