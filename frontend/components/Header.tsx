import * as React from 'react'
import Image from 'next/image'
import { ConnectButton } from '@rainbow-me/rainbowkit'
import { Avatar, Container, Flex, Text } from '@chakra-ui/react'
import Link from 'next/link'

import { useProfile } from '@/hooks/learn-n-grow'

export default function Header() {
  const { data: profile } = useProfile()

  return (
    <header>
      <Container maxW='5xl'>
        <Flex p='1rem' justifyContent='space-between' alignItems='center'>
          {profile && (
            <Link href={'/' + profile.handle}>
              <Avatar mr={4} name={profile.handle} src={profile.imageURI} />
            </Link>
          )}
          <Link href='/feed'>
            <Flex p='1rem' justifyContent='space-between' alignItems='center'>
              <Image src='/plant.png' alt='Logo' height={30} width={30} />
              <Text ml={2} as='strong'>
                Learn N Grow
              </Text>
            </Flex>
          </Link>
          <ConnectButton />
        </Flex>
      </Container>
    </header>
  )
}
