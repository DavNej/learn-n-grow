import Head from 'next/head'
import { useRouter } from 'next/router'
import { useAccount } from 'wagmi'

import {
  Alert,
  AlertIcon,
  Box,
  Button,
  Container,
  Flex,
} from '@chakra-ui/react'

import useIsMounted from '@/hooks/useIsMounted'
import { useProfile } from '@/hooks/contracts/useProfile'
import Header from '@/components/Header'
import ProfileList from '@/components/ProfileList'
import Link from 'next/link'
import React from 'react'

const newProfilePagePath = '/profile/new'

export default function Layout({ children }: React.PropsWithChildren) {
  const isMounted = useIsMounted()

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
            <ProfileList />

            <Flex width='100%' flexDirection='column'>
              <Main>{children}</Main>
            </Flex>
          </Flex>
        </Container>
      </main>
    </>
  ) : null
}

function Main({ children }: React.PropsWithChildren) {
  const { address, isConnected } = useAccount()
  const { pathname } = useRouter()
  const profile = useProfile({ address })

  let showCreateProfile = false

  if (!profile?.id) {
    showCreateProfile = pathname !== newProfilePagePath
  }

  return isConnected ? (
    <>
      {showCreateProfile && (
        <Box textAlign='center' my={4}>
          <Link href={newProfilePagePath}>
            <Button colorScheme='blue'>Create my profile</Button>
          </Link>
        </Box>
      )}
      <Box p={4}>{children}</Box>
    </>
  ) : (
    <Box>
      <Alert status='info'>
        <AlertIcon />
        Please connect wallet to use the app
      </Alert>
    </Box>
  )
}
