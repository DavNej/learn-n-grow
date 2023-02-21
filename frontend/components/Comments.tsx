import React from 'react'
import {
  Accordion,
  AccordionButton,
  AccordionItem,
  AccordionPanel,
  Box,
  Flex,
  Image,
  Link,
  Text,
} from '@chakra-ui/react'
import { IComment, IPost, IProfile } from '@/utils/types'
import { formatTimestamp } from '@/utils/format'
import { useStore } from '@/hooks/useStore'

export default function Comments({ comments }: { comments: IComment[] }) {
  const { store } = useStore()
  const { profilesById } = store

  if (comments.length === 0) return null

  return (
    <Accordion allowToggle>
      <AccordionItem border='none'>
        {({ isExpanded }) => (
          <>
            <AccordionButton
              p={0}
              _hover={{ backgroundColor: 'none' }}
              width='150px'
              m='auto'
              mt={2}>
              <Link as='span' flex='1' textAlign='center'>
                {isExpanded ? 'Hide' : 'Show'} comments
              </Link>
            </AccordionButton>
            <AccordionPanel pb={4}>
              <Box
                bgColor='gray.50'
                borderRadius='md'
                p={4}
                border='1px'
                borderColor='gray.400'>
                {comments.map((comment, idx) => (
                  <Box
                    key={comment.id}
                    mt={!idx ? '' : 2}
                    pt={!idx ? '' : 2}
                    borderTop={!idx ? '' : '1px'}>
                    <Flex alignItems='center' justifyContent='space-between'>
                      <Link
                        as={'strong'}
                        href={'/' + profilesById[comment.authorId]?.handle}>
                        @{profilesById[comment.authorId]?.handle}
                      </Link>
                      <Text>{formatTimestamp(comment.creationDate)}</Text>
                    </Flex>
                    <Text p={2} textAlign='left'>
                      {comment.content}
                    </Text>
                    {comment.mediaURI && <Image p={4} src={comment.mediaURI} />}
                  </Box>
                ))}
              </Box>
            </AccordionPanel>
          </>
        )}
      </AccordionItem>
    </Accordion>
  )
}
