import { async } from '@firebase/util'
import { React, useState, useEffect } from 'react'
import { addDoc, collection } from "firebase/firestore";
import { auth, db } from '../firebase-config';
import { useNavigate } from "react-router-dom";
import { Box, Button, Container, Flex, Input, Spacer, Text, Textarea } from '@chakra-ui/react';
import { ArrowBackIcon } from '@chakra-ui/icons';
import ABasePage from './ABasePage'

import { createEditor } from 'slate'
// Import the Slate components and React plugin.
import { Slate, Editable, withReact } from 'slate-react'

import ReactQuill from 'react-quill'; // ES6
import 'react-quill/dist/quill.snow.css'; 

function CreatePost({ isAuth }) {
  const [title, setTitle] = useState("")
  const [post, setPost] = useState("")

  const [editor] = useState(() => withReact(createEditor()))
  const initialValue = [{
    type: 'paragraph',
    children: [{ text: 'A line of text in a paragraph.' }],
  },]

  const postsCollectionRef = collection(db, 'posts')

  let navigate = useNavigate()

  const postToFirebase = async () => {
      var createTime = new Date().getTime()
      var updateTime = createTime
      var shortPost = post.substring(0, 250)
      if (shortPost.length < post.length) {
          shortPost += '...'
      }
      await addDoc(postsCollectionRef, { title, shortPost, post, createTime, updateTime, author: {name: auth.currentUser.displayName, id: auth.currentUser.uid } })
      navigate('/kuteblog')
  }

  useEffect(() => {
    if (!isAuth) {
      navigate('/kuteblog/login')
    }
  })

  return (
    <ABasePage actionButtons={<Button onClick={postToFirebase} bg='yellowgreen'>Post</Button>}
                content={
                    <>
                        <Box>
                            <Input placeholder='Input title' onChange={(event) => {setTitle(event.target.value)}} ></Input>
                        </Box>
                        {/* <Box pt='2'>
                            <Textarea onChange={(event) => {setPost(event.target.value)}} 
                                        rows='20'
                                        placeholder='How is your day ^_^ ?'>
                            </Textarea>
                        </Box> */}

                        <Box background='green.50'>
                          <ReactQuill value={post} 
                                      onChange={(value) => {setPost(value)}} 
                                      theme="bubble"
                                      />
                        </Box>
                    </>
                }>
    </ABasePage>
  )
}

export default CreatePost