import Head from 'next/head'
import { useRouter } from 'next/router'
import { useAccount } from 'wagmi'

import {
  Alert,
  AlertIcon,
  Box,
  Button,
  Center,
  Flex,
  LinkBox,
  LinkOverlay,
} from '@chakra-ui/react'

import useIsMounted from '@/hooks/useIsMounted'
import { useProfile } from '@/hooks/contracts/profile'
import Header from '@/components/Header'
import ProfileList from '@/components/ProfileList'

const newProfilePagePath = '/profile/new'

export default function Layout({ children }: React.PropsWithChildren) {
  const { address, isConnected } = useAccount()
  const isMounted = useIsMounted()

  const profileId = useProfile({ address, enabled: Boolean(address) })

  const hasProfile = profileId?.toNumber() !== 0
  const { pathname } = useRouter()
  const onNewProfilePage = pathname === newProfilePagePath

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
        <Flex>
          <ProfileList />

          <Flex flexDirection='column'>
            {isConnected ? (
              <>
                {!hasProfile && !onNewProfilePage && (
                  <Center>
                    <LinkBox p={4}>
                      <LinkOverlay href={newProfilePagePath}>
                        <Button colorScheme='blue'>Create my profile</Button>
                      </LinkOverlay>
                    </LinkBox>
                  </Center>
                )}
                {children}
              </>
            ) : (
              <Box m='2rem'>
                <Alert status='info'>
                  <AlertIcon />
                  Please connect wallet to use the app
                </Alert>
              </Box>
            )}
          </Flex>
        </Flex>
      </main>
    </>
  ) : null
}
