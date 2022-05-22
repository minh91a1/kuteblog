import { async } from '@firebase/util'
import { React, useState, useEffect } from 'react'
import { addDoc, doc, updateDoc, getDoc } from "firebase/firestore";
import { auth, db } from '../firebase-config';
import { useNavigate, useParams  } from "react-router-dom";
import { Box, Button, Container, Flex, Input, Spacer, Text, Textarea } from '@chakra-ui/react';
import { ArrowBackIcon } from '@chakra-ui/icons';
import ABasePage from './ABasePage'

function EditPost({ isAuth }) {
  const [title, setTitle] = useState("")
  const [post, setPost] = useState("")
  const params = useParams();
  const postDocRef = doc(db, 'posts', params.postId)

  let navigate = useNavigate()

  const updateToFirebase = async () => {
        var updateTime = new Date().getTime()
        var shortPost = post.substring(0, 250)
        if (shortPost.length < post.length) {
            shortPost += '...'
        }
        await updateDoc(postDocRef, { title, post, shortPost, updateTime, author: {name: auth.currentUser.displayName, id: auth.currentUser.uid } })
        navigate('/kuteblog')
  }

    useEffect(() => {
        if (!isAuth) {
            navigate('/kuteblog/login')
        }

        getPost()
    }, [])

    const getPost = async () => {
        if (params.postId) {
            let postDoc = await getDoc(postDocRef)
            let postDocData = postDoc.data()
            setTitle(postDocData.title)
            setPost(postDocData.post)
        }
    }

  return (
    <ABasePage actionButtons={<Button onClick={updateToFirebase} bg='yellowgreen' color={'white'}>Update</Button>}
                content={
                    <>
                        <Box>
                            <Input value={title} placeholder='Input title' onChange={(event) => {setTitle(event.target.value)}} ></Input>
                        </Box>
                        <Box pt='2'>
                            <Textarea value={post} onChange={(event) => {setPost(event.target.value)}} 
                                        rows='20'
                                        placeholder='How is your day ^_^ ?'>
                            </Textarea>
                        </Box>
                    </>
                }>
    </ABasePage>
  )
}

export default EditPost