import { React, useState, useEffect, useCallback } from "react"
import { useNavigate } from "react-router-dom"
import { signOut } from "firebase/auth"
import { auth } from "../firebase-config"
import { useSelector, useDispatch } from "react-redux"
import { setKey } from "../reducer/searchReducer"
import { openTrash } from "../reducer/trashReducer"

import { EditIcon, ArrowUpIcon, DeleteIcon } from "@chakra-ui/icons"
import { Button, Spacer, Input } from "@chakra-ui/react"
import ABasePage from "./ABasePage"
import ListPost from "../components/ListPost"

import { useAuth } from "../hooks/useAuth.js"

const NewHome = ({ isAuth, setIsAuth }) => {
  const { pending, isSignedIn, user, auth } = useAuth()
  console.log("isAuth:", isAuth)
  const navigate = useNavigate()
  const dispatch = useDispatch()

  const isInTrash = useSelector((state) => state.trash.value)
  const search = useSelector((state) => state.search.value)
  const [searchKey, setSearchKey] = useState(search.searchKey)

  const fetchData = useCallback(() => {
    dispatch(setKey(searchKey))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchKey])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  const loginButton = () => {
    navigate("/kuteblog/login")
  }

  const createPostButton = () => {
    navigate("/kuteblog/createpost")
  }

  const logout = () => {
    signOut(auth).then(() => {
      localStorage.clear()
      setIsAuth(false)
      navigate("/kuteblog/login")
    })
  }

  const toggleTrash = () => {
    dispatch(openTrash(!isInTrash.active))
  }

  if (pending) {
    return <>Authorizing...</>
  }

  return (
    <ABasePage
      showBack={false}
      nav={
        <>
          {!isAuth && <Button onClick={loginButton}>Login</Button>}
          {isAuth && <Button onClick={logout}>Log out</Button>}
          <Spacer />
          {isAuth && (
            <Input
              ml="2"
              mr="2"
              value={searchKey}
              placeholder="Search..."
              onChange={(event) => {
                setSearchKey(event.target.value)
              }}
            ></Input>
          )}
          {isAuth && (
            <Button
              onClick={() => {
                toggleTrash()
              }}
              bg={isInTrash.active ? "skyblue" : "tomato"}
              color={"white"}
              mr="2"
            >
              {isInTrash.active ? <ArrowUpIcon /> : <DeleteIcon />}
            </Button>
          )}
          {isAuth && (
            <Button onClick={createPostButton} bg="yellowgreen" color={"white"}>
              {" "}
              <EditIcon />{" "}
            </Button>
          )}
        </>
      }
      content={<ListPost isAuth={isAuth} />}
    ></ABasePage>
  )
}

export default NewHome