import { useRouter } from 'next/router'
import Head from 'next/head'
import Link from 'next/link'
import { useAccount } from 'wagmi'
import * as React from 'react'

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
import { useStore } from '@/hooks/useStore'

import Header from './Header'
import ProfileList from './ProfileList'
import NewPost from './NewPost'

const newProfilePagePath = '/register'

export default function Layout({ children }: React.PropsWithChildren) {
  const isMounted = useIsMounted()
  const { pathname } = useRouter()
  const { address, isConnected } = useAccount()
  const {
    profile: connectedProfile,
    hasProfile,
    isLoading,
  } = useProfile({ address })
  const { setStore } = useStore()

  const [showNewPostForm, setShowNewPostForm] = React.useState(false)

  React.useEffect(() => {
    if (connectedProfile) {
      setStore(s => ({ ...s, connectedProfileId: connectedProfile.id }))
    }
  }, [connectedProfile])

  const showCreateProfileButton =
    !isLoading && !hasProfile && pathname !== newProfilePagePath

  if (!isMounted) return null

  return (
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
              {hasProfile && (
                <Button
                  mb={4}
                  width='100%'
                  colorScheme='teal'
                  aria-label='Call Segun'
                  onClick={() => setShowNewPostForm(true)}
                  size='md'>
                  + Create post
                </Button>
              )}

              <ProfileList />
            </Flex>

            <Flex width='100%' flexDirection='column'>
              {!isConnected ? (
                <Box mt={4} px={4}>
                  <Alert status='warning'>
                    <AlertIcon />
                    Please connect wallet to use the app
                  </Alert>
                </Box>
              ) : (
                showCreateProfileButton && (
                  <Box textAlign='center' my={4}>
                    <Link href={newProfilePagePath}>
                      <Button colorScheme='blue'>Create my profile</Button>
                    </Link>
                  </Box>
                )
              )}
              <Box p={4}>{children}</Box>
            </Flex>
          </Flex>
        </Container>

        {showNewPostForm && (
          <NewPost onClose={() => setShowNewPostForm(false)} />
        )}
      </main>
    </>
  )
}
