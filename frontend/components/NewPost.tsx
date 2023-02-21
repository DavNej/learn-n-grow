import React from 'react'
import { useAccount } from 'wagmi'

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
  Avatar,
} from '@chakra-ui/react'

import FileInput from '@/components/FileInput'
import { useCreatePost } from '@/hooks/contracts/useCreatePost'
import useDebounce from '@/hooks/useDebounce'
import { useStore } from '@/hooks/useStore'
import { usePinata } from '@/hooks/usePinata'
import { buildPublication } from '@/utils'

export default function NewPost({
  isOpen,
  onClose,
}: {
  isOpen: boolean
  onClose: () => void
}) {
  const { address } = useAccount()

  const { store } = useStore()
  const { connectedProfileId, profilesById } = store
  const profile = profilesById[connectedProfileId] || {}

  const [content, setContent] = React.useState('')
  const debouncedContent = useDebounce(content, 500)
  const [mediaURI, setMediaURI] = React.useState('')
  const debouncedMediaURI = useDebounce(mediaURI, 500)
  const [contentURI, setContentURI] = React.useState('')
  const [imageIsLoading, setImageIsLoading] = React.useState(false)
  const [shouldPost, setShouldPost] = React.useState(false)

  const { upload, isLoading: isUploadLoading } = usePinata()
  const { write, isLoading } = useCreatePost({
    contentURI,
    profileId: connectedProfileId,
    onSuccess() {},
  })

  React.useEffect(() => {
    if (shouldPost && write) {
      console.log('write')
      write?.()
      setShouldPost(false)
    }
  }, [shouldPost, write])

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
          setShouldPost(true)
        },
      })
    }
  }

  const handle = `@${profile.handle}`

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>New post</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Flex alignItems='center' justifyContent='space-between'>
            <Avatar mr={4} name={profile.handle} src={profile.imageURI} />
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
