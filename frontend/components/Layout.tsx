import Head from 'next/head'
import Link from 'next/link'
import React from 'react'

import { Button, Container, Flex } from '@chakra-ui/react'

import useIsMounted from '@/hooks/useIsMounted'
import Header from './Header'
import Main from './Main'
import ProfileList from './ProfileList'
import { useAccount } from 'wagmi'

export default function Layout({ children }: React.PropsWithChildren) {
  const isMounted = useIsMounted()
  const { isConnected } = useAccount()

  return isMounted ? (
    <>
      <Head>
        <title>Learn N Grow</title>
        <meta name='description' content='Knowledge sharing DApp' />
        <meta name='viewport' content='width=device-width, initial-scale=1' />
        <link rel='icon' href='/favicon.ico' />
      </Head>

      <Header />

      <main>
        <Container maxW='5xl'>
          <Flex>
            <Flex p={4} flexDirection='column'>
              {isConnected && (
                <Link href='/post/new'>
                  <Button
                    mb={4}
                    width='100%'
                    colorScheme='teal'
                    aria-label='Call Segun'
                    size='md'>
                    + Create post
                  </Button>
                </Link>
              )}

              <ProfileList />
            </Flex>

            <Flex width='100%' flexDirection='column'>
              <Main>{children}</Main>
            </Flex>
          </Flex>
        </Container>
      </main>
    </>
  ) : null
}
