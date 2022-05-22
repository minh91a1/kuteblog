import React from 'react'
import { auth, provider } from "../firebase-config";
import { signInWithPopup } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { Button, Center, Container, Text,Image } from '@chakra-ui/react';
import { ArrowBackIcon } from '@chakra-ui/icons';
import ABasePage from './ABasePage'

function Login({ setIsAuth }) {
  let navigate = useNavigate()

  const signInWithGoogle = () => {
    signInWithPopup(auth, provider).then((result) => {
      localStorage.setItem('isAuth', true)
      setIsAuth(true)
      navigate('/kuteblog')
    })
  }

  return (
    <ABasePage content={
        <Center>
        <Button onClick={signInWithGoogle}>
        <Image w='7' src='https://logowik.com/content/uploads/images/985_google_g_icon.jpg'></Image>
          Sign in with Google
        </Button>
      </Center>
    }>
    </ABasePage>
  )
}

export default Login