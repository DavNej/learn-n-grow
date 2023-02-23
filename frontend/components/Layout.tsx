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
import { useProfile } from '@/hooks/learn-n-grow'

import Header from './Header'
import ProfileList from './ProfileList'
import NewPost from './NewPost'

const newProfilePagePath = '/register'

export default function Layout({ children }: React.PropsWithChildren) {
  const isMounted = useIsMounted()
  const { pathname } = useRouter()
  const { isConnected } = useAccount()
  const { data: profile } = useProfile()

  const [showNewPostForm, setShowNewPostForm] = React.useState(false)

  if (!isMounted) return null

  const showCreateProfileButton =
    profile === null && pathname !== newProfilePagePath

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
              {profile && (
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

        <NewPost
          isOpen={showNewPostForm}
          onClose={() => setShowNewPostForm(false)}
        />
      </main>
    </>
  )
}
