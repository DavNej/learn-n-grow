import React from 'react'

import {
  Button,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Textarea,
  Image,
  Center,
  Spinner,
  Flex,
  Heading,
  Box,
} from '@chakra-ui/react'
import { useRouter } from 'next/router'
import { Address, useAccount } from 'wagmi'

import FileInput from '@/components/FileInput'

import { useCreatePost } from '@/hooks/contracts/useCreatePost'
import useDebounce from '@/hooks/useDebounce'
import { useStore } from '@/hooks/useStore'
import { usePinata } from '@/hooks/usePinata'

interface IPublication {
  content: string
  mediaURI: string
  address: Address
}

function buildPublication({ content, mediaURI, address }: IPublication) {
  return {
    content,
    mediaURI,
    creationDate: Date.now(),
    author: address,
  }
}

export default function NewPost() {
  const { back } = useRouter()
  const { store } = useStore()
  const { address } = useAccount()

  const [content, setContent] = React.useState('')
  const debouncedContent = useDebounce(content, 500)
  const [mediaURI, setMediaURI] = React.useState('')
  const debouncedMediaURI = useDebounce(mediaURI, 500)
  const [contentURI, setContentURI] = React.useState('')
  const [imageIsLoading, setImageIsLoading] = React.useState(false)

  const { write, isLoading } = useCreatePost({
    contentURI,
    profileId: store.currentProfile.id,
  })

  const { upload, isLoading: isUploadLoading } = usePinata()

  function handleImageChange(img: File) {
    setImageIsLoading(true)
    if (!!img) {
      upload({
        data: img,
        onSuccess(uri) {
          setMediaURI(uri)
          setImageIsLoading(false)
        },
      })
    }
  }

  async function onPost() {
    const postContent =
      address &&
      buildPublication({
        content: debouncedContent,
        mediaURI: debouncedMediaURI,
        address,
      })

    if (!!postContent) {
      upload({
        data: postContent,
        onSuccess(uri) {
          setContentURI(uri)
        },
      })

      await write?.()
    }
  }

  const handle = `@${store.currentProfile.handle}`

  return (
    <Modal isOpen onClose={() => back()}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>New post</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Flex alignItems='center' justifyContent='space-between'>
            <Image
              borderRadius='full'
              boxSize='52px'
              src={store.currentProfile.imageURI}
              alt={handle}
            />
            <Heading size='sm'>{handle}</Heading>
          </Flex>
          <Textarea
            mt={6}
            placeholder="What's on your mind ?"
            onChange={e => setContent(e.target.value)}
          />
          {imageIsLoading ? (
            <Box
              mx='auto'
              mt={6}
              width='260px'
              height='260px'
              bgColor='gray.300'>
              <Center height={'100%'}>
                <Spinner />
              </Center>
            </Box>
          ) : (
            !!mediaURI && (
              <Box mx='auto' mt={6} width='260px' height='260px'>
                <Image borderRadius='sm' src={mediaURI} alt='Preview' />
              </Box>
            )
          )}
        </ModalBody>

        <ModalFooter>
          <Flex width='100%' justifyContent='space-between'>
            <FileInput
              withButton
              onChange={handleImageChange}
              isDisabled={isUploadLoading}
            />
            {debouncedContent &&
            (isLoading || (isUploadLoading && !imageIsLoading)) ? (
              <Spinner mr={4} />
            ) : (
              <Button
                colorScheme='blue'
                onClick={onPost}
                isDisabled={!debouncedContent || isUploadLoading}>
                Post
              </Button>
            )}
          </Flex>
        </ModalFooter>
      </ModalContent>
    </Modal>
  )
}
