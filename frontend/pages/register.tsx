import React from 'react'
import { useAccount } from 'wagmi'
import { useRouter } from 'next/router'

import {
  Box,
  Button,
  Center,
  Flex,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Heading,
  Input,
  Spinner,
} from '@chakra-ui/react'

import ImageInput from '@/components/ImageInput'
import useDebounce from '@/hooks/useDebounce'
import { useCreateProfile } from '@/hooks/contracts/useCreateProfile'
import { useStore } from '@/hooks/useStore'
import * as pinata from '@/utils/pinata'
import { ipfsGateway } from '@/utils'

export default function Register() {
  const [handle, setHandle] = React.useState('')
  const debouncedHandle = useDebounce(handle, 500)
  const [imageURI, setImageURI] = React.useState('')

  const [isImageUploading, setIsImageUploading] = React.useState(false)

  const { isConnected } = useAccount()
  const { push } = useRouter()

  const { write, isPrepareError, error } = useCreateProfile({
    handle: debouncedHandle,
    imageURI,
  })

  const { store } = useStore()
  const { connectedProfileId } = store

  React.useEffect(() => {
    if (!isConnected || connectedProfileId) {
      push('/feed')
    }
  }, [isConnected, connectedProfileId])

  function onImageChange(img: File) {
    setIsImageUploading(true)

    pinata.upload(img, cid => {
      setImageURI(ipfsGateway(cid))
      setIsImageUploading(false)
    })
  }

  return (
    <Box bg='white' p={8} borderRadius='xl'>
      <Heading mb={2} size='md'>
        Create your profile
      </Heading>
      <Flex my={8} alignItems='center'>
        <ImageInput onChange={onImageChange} />
        <Box flexGrow={1} ml={8}>
          <FormControl isRequired isInvalid={isPrepareError}>
            <FormLabel>Profile handle</FormLabel>
            <Input value={handle} onChange={e => setHandle(e.target.value)} />
            {!!error && <FormErrorMessage>{error}</FormErrorMessage>}
          </FormControl>

          <FormControl isRequired mt={2}>
            <FormLabel>ImageURI</FormLabel>
            {isImageUploading ? (
              <Spinner ml={4} />
            ) : (
              <Input value={imageURI} isDisabled />
            )}
          </FormControl>
        </Box>
      </Flex>
      <Center>
        <Button
          colorScheme='blue'
          onClick={() => write?.()}
          isDisabled={!write || isImageUploading}>
          Mint profile
        </Button>
      </Center>
    </Box>
  )
}
