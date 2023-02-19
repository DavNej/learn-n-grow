import React, { useState } from 'react'

import {
  Box,
  Button,
  Center,
  Flex,
  FormControl,
  FormLabel,
  Heading,
  Input,
  Spinner,
} from '@chakra-ui/react'

import ImageInput from '@/components/ImageInput'
import useDebounce from '@/hooks/useDebounce'
import { useCreateProfile } from '@/hooks/contracts/useCreateProfile'
import { usePinata } from '@/hooks/usePinata'
import { useAccount } from 'wagmi'
import { useRouter } from 'next/router'

export default function Register() {
  const [handle, setHandle] = useState('')
  const debouncedHandle = useDebounce(handle, 500)

  const [imageURI, setImageURI] = useState('')
  const debouncedImageURI = useDebounce(imageURI, 500)

  const { data, write, isPrepareError, error, isLoading, isSuccess } =
    useCreateProfile({
      handle: debouncedHandle,
      imageURI: debouncedImageURI,
    })

  const { isLoading: isUploadLoading, upload } = usePinata()

  const { isConnected } = useAccount()
  const { push } = useRouter()

  React.useEffect(() => {
    if (!isConnected) {
      push('/feed')
    }
  }, [isConnected])

  function handleImageChange(img: File) {
    if (!!img) {
      upload({
        data: img,
        onSuccess(uri) {
          setImageURI(uri)
        },
      })
    }
  }

  async function mintProfile() {
    await write?.()
  }

  return (
    <Box bg='white' p={8} borderRadius='xl'>
      <Heading mb={2} size='md'>
        Create your profile
      </Heading>
      <Flex my={8} alignItems='center'>
        {isUploadLoading ? (
          <Center boxSize='150px'>
            <Spinner />
          </Center>
        ) : (
          <ImageInput
            src={imageURI || undefined}
            onChange={handleImageChange}
          />
        )}

        <Box flexGrow={1} ml={8}>
          <FormControl isRequired>
            <FormLabel>Profile handle</FormLabel>
            <Input value={handle} onChange={e => setHandle(e.target.value)} />
          </FormControl>

          <FormControl isRequired mt={2}>
            <FormLabel>ImageURI</FormLabel>
            <Input
              value={imageURI}
              onChange={e => setImageURI(e.target.value)}
            />
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
