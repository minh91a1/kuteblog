import { React, useState, useEffect } from 'react'
import { getDocs, collection, doc, deleteDoc } from "firebase/firestore";
import { auth, db } from '../firebase-config';
import { Button, Center, Box, Text, Flex, Spacer, Heading  } from '@chakra-ui/react'
import { CloseIcon, EditIcon  } from '@chakra-ui/icons'
import { useNavigate } from "react-router-dom";
import { signOut } from "firebase/auth";
import { useScrollDirection, useScrollPosition } from '../hooks/useScrollDirection'
import ABasePage from './ABasePage'
import useFetchFbCollection from "../hooks/useFetchFbCollection";

const ListPost = ({isAuth}) => {
    const [isLoading, setIsLoading] = useState(false)
    const [isError, setIsError] = useState(false)
    const [allPosts, setAllPosts] = useState([])

    const [loadMoreText, setLoadMoreText] = useState('loading...')
    const navigate = useNavigate()
    const { status, data, fetchData } = useFetchFbCollection('posts', () => {
        setLoadMoreText('no data left ^_^')
    })

    useEffect(() => {
        let newData = [...allPosts, ...data]
        setAllPosts(newData)
    }, [data])

    useScrollPosition((position, scrollHeight) => {
        if (position === scrollHeight && loadMoreText.indexOf('no data') === -1) {
            loadMore();
        }
      })

    const deletePost = async (id) => {
        const postDoc = doc(db, "posts", id)
        await deleteDoc(postDoc)
        fetchData()
    }

    const editPost = async (id) => {
        navigate('/kuteblog/editpost/' + id)
    }

    const loadMore = () => {
        fetchData(true);
    }

    return (
        <Box bg='yellowgreen' pt='2' pb='2'>
            {
                !isLoading && allPosts.map(post => {
                    return <Box borderWidth='1px' borderRadius='lg' overflow='hidden' p='3' m='6' bg={'white'} >
                        <Center mb={'2'}>
                            <Heading size={'sm'}>
                                {post.title}
                            </Heading>
                        </Center>
                        <Box borderWidth={'1px'} borderRadius='lg' p='2' bg={'gray.50'}>
                            <Text as='i'>{post.shortPost}</Text>
                        </Box>
                        <Text as='sub' mb='4'>
                            By: { post.author.name }
                                { post.createTime ? 
                                (' at ' + (new Date(post.createTime)).toLocaleDateString() + ' ' + new Date(post.createTime).toLocaleTimeString()) : ''} 
                                { post.createTime && post.updateTime && post.createTime !== post.updateTime && 
                                (' modified at ' + ((new Date(post.updateTime)).toLocaleDateString() + ' ' + (new Date(post.updateTime)).toLocaleTimeString()))
                                }
                        </Text>
                        <Flex mt='4'>
                            <Spacer />
                            {isAuth && post.author.id === auth.currentUser.uid 
                                &&
                                (<>
                                    <Button mr='2' as='button' borderRadius='md' bg='yellowgreen' color='white' px={4} h={8} onClick={() => { editPost(post.id) }}> <EditIcon  /> </Button>
                                    <Button as='button' borderRadius='md' bg='tomato' color='white' px={4} h={8} onClick={() => { deletePost(post.id) }}> <CloseIcon  /> </Button>
                                </>)
                                }
                        </Flex>
                    </Box>
                    })
            }
            {
                isLoading
                    ? <Center onClick={loadMore} color='white'>{loadMoreText}</Center> 
                    : <div></div>
            }
            
        </Box>
    )
}

function Home({isAuth, setIsAuth}) {
    const navigate = useNavigate()

    const loginButton = () => {
    navigate('/kuteblog/login')
    }

    const createPostButton = () => {
    navigate('/kuteblog/createpost')
    }

    const logout = () => {
        signOut(auth).then(()=>{
            localStorage.clear()
            setIsAuth(false)
            navigate('/kuteblog/login')
        })
    }

  return (
    <ABasePage showBack={false} 
                nav = {<>
                    {!isAuth && <Button onClick={loginButton}>Login</Button>}
                    {isAuth && <Button onClick={logout}>Log out</Button>}
                    <Spacer/>
                    {isAuth && <Button onClick={() => {navigate('/kuteblog/trash')}} bg='tomato' color={'white'} mr='2'>Trash</Button>}
                    {isAuth && <Button onClick={createPostButton} bg='yellowgreen' color={'white'}>Create Post</Button>}
                </>}
                content={<ListPost isAuth={isAuth} />}
               >
    </ABasePage>
  )
}

export default Home