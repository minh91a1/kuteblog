import { React, useState, useEffect } from 'react'
import { getDocs, collection, doc, deleteDoc } from "firebase/firestore";
import { auth, db } from '../firebase-config';
import { async } from '@firebase/util';
import { Button, ButtonGroup, Container, Center, Box, Text, Flex, Spacer, Heading, SimpleGrid, GridItem, FormControl, FormLabel, Input, Divider, Image, AspectRatio  } from '@chakra-ui/react'
import { CloseIcon  } from '@chakra-ui/icons'

const BackUP = () => {
return <Flex h='100vh'>
<Box w='full' h='10' bg='blue'>
</Box>

<Box w={'full'} h='full' bg={'gray.50'} p={'10'}>
  <SimpleGrid columns={2} columnGap={3} rowGap={6} w={'full'}>
    <GridItem colSpan={1}>
      <FormControl>
        <FormLabel>Your Name</FormLabel>
        <Input placeholder='Your name'></Input>
      </FormControl>
    </GridItem>
    <GridItem colSpan={1}>
      <FormControl>
        <FormLabel>Your Name</FormLabel>
        <Input placeholder='Your name'></Input>
      </FormControl>
    </GridItem>
    <GridItem colSpan={2}>
      <FormControl>
        <FormLabel>Your Name</FormLabel>
        <Input placeholder='Your name'></Input>
      </FormControl>
    </GridItem>
    <GridItem colSpan={2}>
      <Button w={'full'} bg='yellowgreen'>Submit</Button>
    </GridItem>
  </SimpleGrid>

  <Divider mt={'5'} mb='5' />

  <Box>
    <AspectRatio w={'full'} ratio={'1'}>
      <Image src='https://i.ibb.co/ySKjRRX/pokeball.png' alt='Dan Abramov' borderRadius={'2xl'}/>
    </AspectRatio>
  </Box>
</Box>
</Flex>
}