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

import useFetchMutation from "../hooks/useFetchMutation"
import { METHOD } from "../utils/fetcher.js"

export default function Post({
  isAuth,
  post,
  delIds,
  softDelIds,
  restoringIds,
  isInTrash,
  onDeletePostCallback,
}) {
  const onDeletePostSuccess = () => {
    onDeletePostCallback()
  }
  const onCompleted = () => {}

  const navigate = useNavigate()

  const {
    submit: deletePostSubmit,
    isSubmitting,
    hasError,
  } = useFetchMutation(
    METHOD.DELETE,
    "post" + (post.id ? "/" + post.id : ""),
    onDeletePostSuccess,
    onCompleted
  )

  const deletePost = async (id, del) => {
    //TODO: delete post
    deletePostSubmit()
  }

  const restorePost = async (id) => {
    //TODO: restore post
  }

  const editPost = async (id) => {
    navigate("/kuteblog/editpost/" + id)
  }

  return (
    <Box
      key={post.id}
      borderWidth="1px"
      borderRadius="lg"
      overflow="hidden"
      p="3"
      m="6"
      bg={"white"}
    >
      <Center mb={"2"}>
        <Heading size={"sm"}>{post.title}</Heading>
      </Center>
      <Center mt={2} mb={2}>
        <Center rounded="md" overflow={"hidden"}>
          <img
            style={{ maxHeight: "200px" }}
            src={
              post.imagePath
                ? process.env.REACT_APP_API_URL + post.imagePath
                : ""
            }
            alt=""
          />
        </Center>
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
          auth &&
          auth.currentUser &&
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
          auth &&
          auth.currentUser &&
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
