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
import { useCreateComment } from '@/hooks/contracts/useCreateComment'
import useDebounce from '@/hooks/useDebounce'
import { useStore } from '@/hooks/useStore'
import { usePinata } from '@/hooks/usePinata'
import { buildPublication } from '@/utils'

export default function NewComment({
  onClose,
  profileIdPointed,
  pubIdPointed,
}: {
  onClose: () => void
  profileIdPointed: number
  pubIdPointed: number
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
  const [shouldComment, setShouldComment] = React.useState(false)

  const { upload, isLoading: isUploadLoading } = usePinata()
  const { write, isLoading } = useCreateComment({
    contentURI,
    profileId: connectedProfileId,
    profileIdPointed,
    pubIdPointed,
    onSuccess() {},
  })

  React.useEffect(() => {
    if (shouldComment && write) {
      write?.()
      setShouldComment(false)
    }
  }, [shouldComment, write])

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

  async function onComment() {
    const commentContent =
      address &&
      buildPublication({
        content: debouncedContent,
        mediaURI: debouncedMediaURI,
        address,
      })

    if (!!commentContent) {
      upload({
        data: commentContent,
        onSuccess(uri) {
          setContentURI(uri)
          setShouldComment(true)
        },
      })
    }
  }

  const handle = `@${profile.handle}`

  return (
    <Modal isOpen onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>New comment</ModalHeader>
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
                onClick={onComment}
                isDisabled={!debouncedContent || isUploadLoading}>
                Comment
              </Button>
            )}
          </Flex>
        </ModalFooter>
      </ModalContent>
    </Modal>
  )
}
