import { React, useState, useEffect } from "react"
import { auth, db } from "../firebase-config"
import {
  Button,
  Center,
  Box,
  Text,
  Flex,
  Spacer,
  Heading,
} from "@chakra-ui/react"
import { CloseIcon, EditIcon, ArrowUpIcon, DeleteIcon } from "@chakra-ui/icons"
import { useNavigate } from "react-router-dom"
import { useScrollPosition } from "../hooks/useScrollDirection"
import { useSelector, useDispatch } from "react-redux"
import { save } from "../reducer/scrollReducer"
import useFetchCollection from "../hooks/useFetchCollection"

export default function Post({
  isAuth,
  post,
  delIds,
  softDelIds,
  restoringIds,
  isInTrash,
}) {
  const navigate = useNavigate()

  const deletePost = async (id, del) => {
    // if (del) {
    //   // permanent delete !
    //   const postDoc = doc(db, "posts", id)
    //   setDelIds([...delIds, id])
    //   await deleteDoc(postDoc)
    // } else {
    //   // soft del !
    //   const updateDelDocRef = doc(db, "posts", id)
    //   setSoftDelIds([...softDelIds, id])
    //   await updateDoc(updateDelDocRef, { del: true })
    // }
    // refetch()
  }

  const restorePost = async (id) => {
    // const updateDelDocRef = doc(db, "posts", id)
    // setRestoringIds([...restoringIds, id])
    // await updateDoc(updateDelDocRef, { del: false })
    // refetch()
  }

  const editPost = async (id) => {
    navigate("/kuteblog/editpost/" + id)
  }

  return (
    <Box
      borderWidth="1px"
      borderRadius="lg"
      overflow="hidden"
      p="3"
      m="6"
      bg={"white"}
      key={post.id}
    >
      <Center mb={"2"}>
        <Heading size={"sm"}>{post.title}</Heading>
      </Center>
      <Box borderWidth={"1px"} borderRadius="lg" p="2" bg={"gray.50"}>
        <Text as="i">{post.shortPost}</Text>
      </Box>
      <Text as="sub" mb="4">
        By: {post.authorName}
        {post.createTime
          ? " at " +
            new Date(post.createTime).toLocaleDateString() +
            " " +
            new Date(post.createTime).toLocaleTimeString()
          : ""}
        {post.createTime &&
          post.updateTime &&
          post.createTime !== post.updateTime &&
          " modified at " +
            (new Date(post.updateTime).toLocaleDateString() +
              " " +
              new Date(post.updateTime).toLocaleTimeString())}
      </Text>
      <Flex mt="4">
        <Spacer />
        {isAuth &&
          post.authorId === auth.currentUser.uid &&
          delIds.indexOf(post.id) === -1 &&
          softDelIds.indexOf(post.id) === -1 &&
          restoringIds.indexOf(post.id) === -1 &&
          isInTrash && (
            <>
              <Button
                mr="2"
                as="button"
                borderRadius="md"
                bg="skyblue"
                color="white"
                px={4}
                h={8}
                onClick={() => {
                  restorePost(post.id)
                }}
              >
                {" "}
                <ArrowUpIcon />{" "}
              </Button>
            </>
          )}

        {isAuth &&
          post.authorId === auth.currentUser.uid &&
          delIds.indexOf(post.id) === -1 &&
          softDelIds.indexOf(post.id) === -1 &&
          restoringIds.indexOf(post.id) === -1 && (
            <>
              <Button
                mr="2"
                as="button"
                borderRadius="md"
                bg="yellowgreen"
                color="white"
                px={4}
                h={8}
                onClick={() => {
                  editPost(post.id)
                }}
              >
                {" "}
                <EditIcon />{" "}
              </Button>
              <Button
                as="button"
                borderRadius="md"
                bg="tomato"
                color="white"
                px={4}
                h={8}
                onClick={() => {
                  deletePost(post.id, post.del)
                }}
              >
                {isInTrash ? <CloseIcon /> : <DeleteIcon />}
              </Button>
            </>
          )}
        {isInTrash && delIds.indexOf(post.id) !== -1 && (
          <Center>Deleting...</Center>
        )}
        {isInTrash && restoringIds.indexOf(post.id) !== -1 && (
          <Center>Restoring...</Center>
        )}
        {!isInTrash && softDelIds.indexOf(post.id) !== -1 && (
          <Center>Moving to trash...</Center>
        )}
      </Flex>
    </Box>
  )
}
