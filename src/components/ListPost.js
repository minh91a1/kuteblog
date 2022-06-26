import { React, useState, useEffect, useRef } from "react"
import { Center, Box } from "@chakra-ui/react"
import { useScrollPosition } from "../hooks/useScrollDirection"
import { useSelector, useDispatch } from "react-redux"
import { save } from "../reducer/scrollReducer"
import useFetchInfinite from "../hooks/useFetchInfinite"
import Post from "./Post"

const ListPost = ({ isAuth, isInTrash }) => {
  // redux store
  const scroll = useSelector((state) => state.scroll.value)
  const search = useSelector((state) => state.search.value)
  const trash = useSelector((state) => state.trash.value)
  const dispatch = useDispatch()

  // state
  const [searchKey, setSearchKey] = useState(search.searchKey)

  // local variable
  const timer = useRef()

  // query
  const {
    isFetching: isLoading,
    data,
    error,
    refetch,
    fetchNextPage,
    status,
  } = useFetchInfinite("post", searchKey)

  //TODO: need to persist redux data on deleting/restoring state
  const [delIds, setDelIds] = useState([])
  const [softDelIds, setSoftDelIds] = useState([])
  const [restoringIds, setRestoringIds] = useState([])

  useScrollPosition((top, end, scrollHeight) => {
    if (end === scrollHeight) {
      fetchNextPage()
    }
    dispatch(save({ posY: top }))
  })

  useEffect(() => {
    console.log("1st time")
    let target = document.getElementById("allPost")?.parentElement
    target?.scrollTo(0, scroll.position.posY)

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    if (status === "loading") {
      return
    }
    console.log("set search key")
    setSearchKey(search.searchKey)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search.searchKey])

  //? on searching...
  useEffect(() => {
    if (status === "loading") {
      return
    }
    doSearch()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchKey])

  const doSearch = () => {
    clearAll()
    clearTimeout(timer.current)
    timer.current = setTimeout(() => {
      refetch()
    }, 700)
  }

  // on moving to trash...
  useEffect(() => {
    if (status === "loading") {
      return
    }
    //TODO: console.log("check trash")
    movingToTrashNow(trash.active)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [trash.active])

  const movingToTrashNow = async (isInTrash) => {
    //TODO: move to trash page!
  }

  const clearAll = () => {
    setDelIds([])
    setSoftDelIds([])
    setRestoringIds([])
  }

  const onDeletePostCallback = () => {
    refetch()
  }

  return (
    <Box id="allPost" bg="yellowgreen" pt="2" pb="2" mb="5">
      {!(status === "loading") &&
        //! !pending &&
        !error &&
        data &&
        Array.isArray(data.pages) &&
        data.pages.map((page) => {
          return page.map((post) => {
            return (
              <Post
                key={post.id}
                isAuth={isAuth}
                post={post}
                delIds={delIds}
                softDelIds={softDelIds}
                restoringIds={restoringIds}
                isInTrash={isInTrash}
                onDeletePostCallback={onDeletePostCallback}
              />
            )
          })
        })}

      <Box h="5">
        {isLoading ? <Center color="white">loading...</Center> : null}
      </Box>
    </Box>
  )
}

export default ListPost
