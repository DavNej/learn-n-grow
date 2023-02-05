import * as React from 'react'
import { Box } from '@chakra-ui/react'

import useIsOwner from '@/hooks/useIsOwner'

export default function Main() {
  const isOwner = useIsOwner()

  return (
    <main>
      <Box m='2rem' p='2rem' bg='gray.100'>
        ...
      </Box>
    </main>
  )
}
