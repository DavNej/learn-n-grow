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
import { buildPublication } from '@/utils'
import { encodeFileToDataUri } from '@/utils/dataUri'
import * as pinata from '@/utils/pinata'

export default function NewComment({
  isOpen,
  onClose,
  profileIdPointed,
  pubIdPointed,
}: {
  isOpen: boolean
  onClose: () => void
  profileIdPointed: number
  pubIdPointed: number
}) {
  const { address } = useAccount()
  const { store } = useStore()
  const { connectedProfileId, profilesById } = store

  const [isLoading, setIsLoading] = React.useState(false)
  const [shouldTransact, setShouldTransact] = React.useState(false)

  const [contentURI, setContentURI] = React.useState('')
  const [mediaURI, setMediaURI] = React.useState('')
  const [content, setContent] = React.useState('')
  const debouncedContent = useDebounce(content, 500)

  const { write } = useCreateComment({
    contentURI,
    profileId: connectedProfileId,
    profileIdPointed,
    pubIdPointed,
    onSuccess() {
      setIsLoading(false)
    },
  })

  const profile = profilesById[connectedProfileId] || {}
  const disableUpload = !address || !debouncedContent

  React.useEffect(() => {
    if (shouldTransact && write && contentURI) {
      console.log('write')
      // write()
      setShouldTransact(false)
    }
  }, [write, shouldTransact, contentURI])

  function uploadToPinata() {
    if (disableUpload) return

    setIsLoading(true)

    const json = buildPublication({
      content: debouncedContent,
      mediaURI,
      address,
    })

    pinata.upload(json, cid => {
      setContentURI(cid)
      setShouldTransact(true)
    })
  }

  const handle = `@${profile.handle}`

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
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
          {!!mediaURI && (
            <Box mx='auto' mt={6} width='260px' height='260px'>
              <Image borderRadius='sm' src={mediaURI} alt='Preview' />
            </Box>
          )}
        </ModalBody>

        <ModalFooter>
          <Flex width='100%' justifyContent='space-between'>
            <FileInput
              withButton
              onChange={img => encodeFileToDataUri(img, setMediaURI)}
            />
            {isLoading ? (
              <Spinner mr={4} />
            ) : (
              <Button
                colorScheme='blue'
                onClick={uploadToPinata}
                isDisabled={disableUpload}>
                Comment
              </Button>
            )}
          </Flex>
        </ModalFooter>
      </ModalContent>
    </Modal>
  )
}
