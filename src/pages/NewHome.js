import { React } from "react"

import ABasePage from "./ABasePage"
import ListPost from "../components/ListPost"
import NewHomeNav from "../components/NewHomeNav.js"

import { useAuth } from "../hooks/useAuth.js"
import { Center } from "@chakra-ui/react"

const NewHome = ({ isAuth, setIsAuth }) => {
  const { pending, auth } = useAuth()
  if (pending) {
    return <Center m={20}>Authorizing...</Center>
  }

  return (
    <ABasePage
      showBack={false}
      nav={<NewHomeNav isAuth={isAuth} setIsAuth={setIsAuth} auth={auth} />}
      content={<ListPost isAuth={isAuth} />}
    ></ABasePage>
  )
}

export default NewHome
