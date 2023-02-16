import React, { ChangeEvent, useState } from 'react'

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
import { useCreateProfile } from '@/hooks/contracts/useCreateProfile'
import useDebounce from '@/hooks/useDebounce'

export default function Register() {
  const [handle, setHandle] = useState('')
  const debouncedHandle = useDebounce(handle, 500)
  function handleHandleChange(e: ChangeEvent<HTMLInputElement>) {
    setHandle(e.target.value)
  }

  const [imageURI, setImageURI] = useState('')
  const debouncedImageURI = useDebounce(imageURI, 500)
  function handleImageURIChange(e: ChangeEvent<HTMLInputElement>) {
    setImageURI(e.target.value)
  }

  const [image, setImage] = useState<File | null>(null)

  const res = useCreateProfile({
    handle: debouncedHandle,
    imageURI: debouncedImageURI,
  })

  const { data, write, isPrepareError, error, isLoading, isSuccess } = res || {}

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
