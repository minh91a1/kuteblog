import React, { useState, useEffect, useCallback } from "react"

import { useNavigate } from "react-router-dom"
import { useSelector, useDispatch } from "react-redux"
import { openTrash } from "../reducer/trashReducer"
import { setKey } from "../reducer/searchReducer"

import { signOut } from "firebase/auth"
import { EditIcon, ArrowUpIcon, DeleteIcon } from "@chakra-ui/icons"
import { Button, Spacer, Input } from "@chakra-ui/react"

export default function NewHomeNav({ isAuth, setIsAuth, auth }) {
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

  return (
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
  )
}
