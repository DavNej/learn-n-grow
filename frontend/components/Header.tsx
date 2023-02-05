import * as React from 'react'
import Image from 'next/image'
import { ConnectButton } from '@rainbow-me/rainbowkit'
import { Box, Flex, Text } from '@chakra-ui/react'

export default function Header() {
  return (
    <header>
      <Box bg='gray.100'>
        <Flex p='1rem' justifyContent='space-between' alignItems='center'>
          <Image src='/plant.png' alt='Logo' height={30} width={30} />
          <Text ml={2} as='strong'>
            Learn N Grow
          </Text>
          <ConnectButton />
        </Flex>
      </Box>
    </header>
  )
}
