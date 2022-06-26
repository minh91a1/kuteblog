import { ArrowBackIcon } from "@chakra-ui/icons"
import { Box, Button, Center, Container, Flex, Spacer } from "@chakra-ui/react"
import { useNavigate } from "react-router-dom"

const ABasePage = ({
  isAuth,
  setIsAuth,
  showBack,
  nav,
  actionButtons,
  content,
  isLoading,
  error,
}) => {
  const navigate = useNavigate()

  const goBack = () => {
    navigate(-1)
  }

  return (
    <Container h="100vh">
      {/* Navigator */}
      <Flex h={"50"} p="1">
        {nav ? (
          nav
        ) : (
          <>
            {showBack && (
              <Button onClick={goBack}>
                <ArrowBackIcon w={6} h={6} />
              </Button>
            )}
            <Spacer />
            {actionButtons}
          </>
        )}
      </Flex>

      {/* Body */}
      <Box h="calc(100% - (50px))" overflowY={"auto"} p="2">
        {error ? (
          error
        ) : isLoading ? (
          <Center mt="20">Đợi xíu...</Center>
        ) : (
          content
        )}
      </Box>
    </Container>
  )
}

ABasePage.defaultProps = {
  showBack: true,
}

export default ABasePage
