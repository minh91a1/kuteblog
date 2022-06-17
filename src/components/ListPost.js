import { React, useState, useEffect } from "react"
import { auth } from "../firebase-config"
import { Center, Box } from "@chakra-ui/react"
import { useScrollPosition } from "../hooks/useScrollDirection"
import { useSelector, useDispatch } from "react-redux"
import { save } from "../reducer/scrollReducer"
import useFetchCollection from "../hooks/useFetchCollection"
import Post from "./Post"

const ListPost = ({ isAuth }) => {
  const scroll = useSelector((state) => state.scroll.value)
  const search = useSelector((state) => state.search.value)
  const trash = useSelector((state) => state.trash.value)
  const { isLoading, data, error } = useFetchCollection("post")
  const dispatch = useDispatch()

  const [searchKey, setSearchKey] = useState(search.searchKey)

  const [isInTrash, setIsInTrash] = useState(false)
  const [delIds, setDelIds] = useState([])
  const [softDelIds, setSoftDelIds] = useState([])
  const [restoringIds, setRestoringIds] = useState([])

  // const collectionRef = collection(db, "posts")

  var authorId = 0
  if (auth && auth.currentUser && auth.currentUser.uid) {
    authorId = auth.currentUser.uid
  }

  // build query
  // var postsQuery
  // var conditions = [
  //   orderBy("createTime", "desc"),
  //   where("del", "==", trash.active),
  //   limit(10),
  // ]
  // if (searchKey) {
  //   conditions.push(where("title", "==", searchKey))
  // }
  // if (trash.active) {
  //   conditions.push(where("authorId", "==", authorId))
  // }
  // postsQuery = query(collectionRef, ...conditions)

  // const { isLoading, isFetching, error, data, fetchNextPage, refetch } =
  //   useFirestoreInfiniteQuery("posts", postsQuery, (snapshot) => {
  //     const lastDocument = snapshot.docs[snapshot.docs.length - 1]
  //     if (!lastDocument) {
  //       return
  //     }
  //     return query(postsQuery, startAfter(lastDocument))
  //   })

  useScrollPosition((top, end, scrollHeight) => {
    if (end === scrollHeight) {
      // fetchNextPage()
    }
    dispatch(save({ posY: top }))
  })

  useEffect(() => {
    console.log("1st time")
    document
      .getElementById("allPost")
      ?.parentElement?.scrollTo(0, scroll.position.posY)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    if (isLoading) {
      return
    }
    console.log("set search key")
    setSearchKey(search.searchKey)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search.searchKey])

  // on searching...
  useEffect(() => {
    if (isLoading) {
      return
    }
    console.log("do search")
    doSearch()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchKey])

  const doSearch = () => {
    clearAll()
    // refetch()
  }

  // on moving to trash...
  useEffect(() => {
    if (isLoading) {
      return
    }
    console.log("check trash")
    movingToTrashNow(trash.active)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [trash.active])

  const movingToTrashNow = async (isInTrash) => {
    // console.log(isInTrash)
    // clearAll()
    // setIsInTrash(!isInTrash)
    // await refetch()
    // setIsInTrash(isInTrash)
  }

  const clearAll = () => {
    setDelIds([])
    setSoftDelIds([])
    setRestoringIds([])
  }

  console.log(isLoading, data, error)

  return (
    <Box id="allPost" bg="yellowgreen" pt="2" pb="2" mb="5">
      {!isLoading &&
        !error &&
        data &&
        data.map((post) => {
          return (
            <Post
              isAuth={isAuth}
              post={post}
              delIds={delIds}
              softDelIds={softDelIds}
              restoringIds={restoringIds}
              isInTrash={isInTrash}
            />
          )
        })}

      <Box h="5">
        {isLoading ? <Center color="white">loading...</Center> : null}
      </Box>
    </Box>
  )
}

export default ListPost
