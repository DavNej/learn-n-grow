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
import { formatTimestamp } from '@/utils/format'
import { IFullComment } from '@/utils/types'
import { useProfiles } from '@/hooks/learn-n-grow'

export default function Comments({ comments }: { comments: IFullComment[] }) {
  const { data } = useProfiles()

  const profilesById = data || []

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
                        href={'/' + profilesById[comment.authorId]?.handle}
                        fontWeight='bold'>
                        @{profilesById[comment.authorId]?.handle}
                      </Link>
                      <Text>{formatTimestamp(comment.creationDate)}</Text>
                    </Flex>
                    <Text p={2} textAlign='left'>
                      {comment.content}
                    </Text>
                    {comment.mediaURI && (
                      <Flex mx='auto' mt={2} width='260px' height='260px'>
                        <Image objectFit='cover' src={comment.mediaURI} />
                      </Flex>
                    )}
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
