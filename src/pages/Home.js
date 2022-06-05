import { React, useState, useEffect } from 'react'
import { collection, doc, deleteDoc, query, startAfter, orderBy, limit, where, updateDoc } from "firebase/firestore";
import { auth, db } from '../firebase-config';
import { Button, Center, Box, Text, Flex, Spacer, Heading, Input  } from '@chakra-ui/react'
import { CloseIcon, EditIcon, ArrowUpIcon, DeleteIcon } from '@chakra-ui/icons'
import { useNavigate } from "react-router-dom";
import { signOut } from "firebase/auth";
import { useScrollPosition } from '../hooks/useScrollDirection'
import ABasePage from './ABasePage'
import { useFirestoreInfiniteQuery } from "@react-query-firebase/firestore";
import { useSelector, useDispatch } from 'react-redux'
import { save } from '../reducer/scrollReducer';
import { setKey } from '../reducer/searchReducer';
import { openTrash } from '../reducer/trashReducer';
import { async } from '@firebase/util';


const ListPost = ({isAuth}) => {
    const navigate = useNavigate()
    const scroll = useSelector((state) => state.scroll.value);
    const search = useSelector((state) => state.search.value);
    const trash = useSelector((state) => state.trash.value);
    const dispatch = useDispatch()

    const [searchKey, setSearchKey] = useState(search.searchKey)

    const collectionRef = collection(db, 'posts')

    var authorId = 0;
    if (auth && auth.currentUser && auth.currentUser.uid) {
        authorId = auth.currentUser.uid;
    }

    // build query
    var postsQuery
    var conditions = [orderBy("createTime", "desc"), where("del", "==", trash.active), limit(10)]
    if (searchKey) {
        conditions.push(where("title", "==", searchKey))
    }
    if (trash.active) {
        conditions.push(where("authorId", "==", authorId))
    }
    postsQuery = query(collectionRef, ...conditions);

    const [delIds, setDelIds] = useState([])
    const [softDelIds, setSoftDelIds] = useState([])
    const [restoringIds, setRestoringIds] = useState([])

    const [isInTrash, setIsInTrash] = useState(false)

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
      }, [])

      useEffect(() => {
        setSearchKey(search.searchKey)
      }, [search.searchKey])

      const clearAll = () => {
        setDelIds([])
        setSoftDelIds([])
        setRestoringIds([])
      }

      // on searching...
      useEffect(() => {
        doSearch()
      }, [searchKey])

      const doSearch = () => {
        clearAll()
        refetch()
      }

      // on moving to trash...
      useEffect(() => {
        movingToTrashNow(trash.active)
      }, [trash.active])
      
      const movingToTrashNow = async (isInTrash)  => {
        clearAll()
        setIsInTrash(!isInTrash)
        await refetch()
        setIsInTrash(isInTrash)
      }

    const deletePost = async (id, del) => {
        if (del) {
            // permanent delete !
            const postDoc = doc(db, "posts", id)
            setDelIds([...delIds, id])
            await deleteDoc(postDoc)
        } else {
            // soft del !
            const updateDelDocRef = doc(db, 'posts', id);
            setSoftDelIds([...softDelIds, id])
            await updateDoc(updateDelDocRef, { del: true })
        }
        
        refetch()
    }

    const restorePost = async (id) => {
        const updateDelDocRef = doc(db, 'posts', id);
        setRestoringIds([...restoringIds, id])
        await updateDoc(updateDelDocRef, { del: false })
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
                                {isAuth && post.author.id === auth.currentUser.uid
                                && delIds.indexOf(post.id) === -1
                                && softDelIds.indexOf(post.id) === -1
                                && restoringIds.indexOf(post.id) === -1
                                && isInTrash
                                    &&
                                    (<>
                                        <Button mr='2' as='button' borderRadius='md' bg='skyblue' color='white' px={4} h={8} onClick={() => { restorePost(post.id) }}> <ArrowUpIcon  /> </Button>
                                    </>)
                                }

                                {isAuth && post.author.id === auth.currentUser.uid
                                && delIds.indexOf(post.id) === -1
                                && softDelIds.indexOf(post.id) === -1
                                && restoringIds.indexOf(post.id) === -1
                                    &&
                                    (<>
                                        <Button mr='2' as='button' borderRadius='md' bg='yellowgreen' color='white' px={4} h={8} onClick={() => { editPost(post.id) }}> <EditIcon  /> </Button>
                                        <Button as='button' borderRadius='md' bg='tomato' color='white' px={4} h={8} onClick={() => { deletePost(post.id, post.del) }}> 
                                            {isInTrash ? <CloseIcon/> : <DeleteIcon/> }
                                         </Button>
                                    </>)
                                    }
                                {
                                    (isInTrash && delIds.indexOf(post.id) !== -1) && <Center>Deleting...</Center>
                                }
                                {
                                    (isInTrash && restoringIds.indexOf(post.id) !== -1) && <Center>Restoring...</Center>
                                }
                                {
                                    (!isInTrash && softDelIds.indexOf(post.id) !== -1) && <Center>Moving to trash...</Center>
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
    const dispatch = useDispatch()

    const isInTrash = useSelector((state) => state.trash.value);
    const search = useSelector((state) => state.search.value);
    const [searchKey, setSearchKey] = useState(search.searchKey)

    useEffect(() => {
        dispatch(setKey(searchKey))
    }, [searchKey])
    

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

    const toggleTrash = () => {
        dispatch(openTrash(!isInTrash.active))
    }

  return (
    <ABasePage showBack={false} 
                nav = {<>
                    {!isAuth && <Button onClick={loginButton}>Login</Button>}
                    {isAuth && <Button onClick={logout}>Log out</Button>}
                    <Spacer/>
                    {isAuth && <Input ml='2' mr='2' value={searchKey} placeholder='Search...' onChange={(event) => {setSearchKey(event.target.value)}} ></Input> }
                    {isAuth && <Button onClick={() => { toggleTrash() }} bg={isInTrash.active ? 'skyblue' : 'tomato'} color={'white'} mr='2'>
                        {isInTrash.active ? <ArrowUpIcon/> : <DeleteIcon/> }
                    </Button>}
                    {isAuth && <Button onClick={createPostButton} bg='yellowgreen' color={'white'}> <EditIcon/> </Button>}
                </>}
                content={<ListPost isAuth={isAuth} />}
               >
    </ABasePage>
  )
}

export default Home