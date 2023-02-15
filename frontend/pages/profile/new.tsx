import React, { useState } from 'react'
import { useAccount } from 'wagmi'

import {
  Box,
  Button,
  Center,
  Flex,
  FormControl,
  FormLabel,
  Heading,
  Input,
} from '@chakra-ui/react'

import ImageInput from '@/components/ImageInput'
import { useCreateProfile } from '@/hooks/contracts/profile'

export default function Register() {
  const [handle, setHandle] = useState('')
  const [imageURI, setImageURI] = useState('')
  const [image, setImage] = useState<File | null>(null)

  const enabled = !!handle && !!imageURI
  const vars = { handle, imageURI }
  const { data, write } = useCreateProfile({ vars, enabled })

  async function mintProfile() {
    await write?.()
    console.log({ data })
  }

  return (
    <Box bg='white' p={4} borderRadius='xl'>
        <Heading mb={2} size='md'>
          Create your profile
        </Heading>
      <Flex mt={4} alignItems='center'>
        <ImageInput onChange={img => setImage(img)} />

        <Box flexGrow={1} p='2rem'>
          <FormControl isRequired>
            <FormLabel>ImageURI</FormLabel>
            <Input
              value={imageURI}
              onChange={e => setImageURI(e.target.value)}
            />
          </FormControl>

          <FormControl isRequired>
            <FormLabel>Profile handle</FormLabel>
            <Input value={handle} onChange={e => setHandle(e.target.value)} />
          </FormControl>
        </Box>
      </Flex>
      <Center>
        <Button colorScheme='blue' onClick={mintProfile} isDisabled={!write}>
          Mint profile
        </Button>
      </Center>
    </Box>
  )
  }
