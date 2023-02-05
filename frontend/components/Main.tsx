import * as React from 'react'
import { Box } from '@chakra-ui/react'

import useIsOwner from '@/hooks/useIsOwner'
import { useGetStage } from '@/hooks/voting/stage'

export default function Main() {
  const stage = useGetStage()
  const isOwner = useIsOwner()

  const shouldRender = typeof stage !== 'undefined'

  return shouldRender ? (
    <main>
      <Box m='2rem' p='2rem' bg='gray.100'>
        ...
      </Box>
    </main>
  ) : null
}
