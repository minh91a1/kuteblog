import { React, useState, useEffect } from 'react'
import { collection, doc, deleteDoc, query, startAfter, orderBy, limit } from "firebase/firestore";
import { auth, db } from '../firebase-config';
import { Button, Center, Box, Text, Flex, Spacer, Heading  } from '@chakra-ui/react'
import { CloseIcon, EditIcon  } from '@chakra-ui/icons'
import { useNavigate } from "react-router-dom";
import { signOut } from "firebase/auth";
import { useScrollPosition } from '../hooks/useScrollDirection'
import ABasePage from './ABasePage'
import { useFirestoreInfiniteQuery } from "@react-query-firebase/firestore";
import { useSelector, useDispatch } from 'react-redux'
import { save } from '../reducer/scrollReducer';


const ListPost = ({isAuth}) => {
    const navigate = useNavigate()
    const scroll = useSelector((state) => state.scroll.value);
    const dispatch = useDispatch()

    const collectionRef = collection(db, 'posts')
    const postsQuery = query(collectionRef, orderBy("createTime", "desc"), limit(10))

    const [delIds, setDelIds] = useState([])

    const {isLoading, isFetching, error, data, fetchNextPage, refetch,  } = useFirestoreInfiniteQuery("posts", postsQuery, (snapshot) => {
        const lastDocument = snapshot.docs[snapshot.docs.length - 1];
        if (!lastDocument) {
            return;
        }
        return query(postsQuery, startAfter(lastDocument));
      });

    useScrollPosition((top, end, scrollHeight) => {
        if (end === scrollHeight) {
            fetchNextPage()
        }
        dispatch(save({posY: top}))
      })

      useEffect(() => {
        document.getElementById('allPost')?.parentElement?.scrollTo(0,scroll.position.posY);
      },)
      

    const deletePost = async (id) => {
        const postDoc = doc(db, "posts", id)
        setDelIds([...delIds, id])
        await deleteDoc(postDoc)
        refetch()
    }

    const editPost = async (id) => {
        navigate('/kuteblog/editpost/' + id)
    }

    return (
        <Box id='allPost' bg='yellowgreen' pt='2' pb='2' mb='5'>
            {
                !isLoading && !error && data.pages.map((group, i) => {
                    return group.docs.map(doc => ({...doc.data(), id: doc.id})).map(post => {
                        return <Box borderWidth='1px' borderRadius='lg' overflow='hidden' p='3' m='6' bg={'white'} key={post.id}>
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
                                {isAuth && post.author.id === auth.currentUser.uid && delIds.indexOf(post.id) === -1
                                    &&
                                    (<>
                                        <Button mr='2' as='button' borderRadius='md' bg='yellowgreen' color='white' px={4} h={8} onClick={() => { editPost(post.id) }}> <EditIcon  /> </Button>
                                        <Button as='button' borderRadius='md' bg='tomato' color='white' px={4} h={8} onClick={() => { deletePost(post.id) }}> <CloseIcon  /> </Button>
                                    </>)
                                    }
                                {
                                    (delIds.indexOf(post.id) !== -1) && <Center>Deleting...</Center>
                                }
                            </Flex>
                        </Box>
                        })
                })
            }

            <Box h='5'>
                {
                    isFetching
                    ? <Center color='white'>loading...</Center> 
                    : null
                }
            </Box>
            
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