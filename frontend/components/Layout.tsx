import Head from 'next/head'

import { Alert, AlertIcon, Box, Button, LinkOverlay } from '@chakra-ui/react'

import { useAccount } from 'wagmi'
import useIsMounted from '@/hooks/useIsMounted'
import Header from '@/components/Header'
import { useProfile } from '@/hooks/contracts/profile'
import { useRouter } from 'next/router'

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

      {!hasProfile && !onNewProfilePage && (
        <Box p={4}>
          <LinkOverlay href={newProfilePagePath}>
            <Button colorScheme='blue'>Create my profile</Button>
          </LinkOverlay>
        </Box>
      )}

      {isConnected ? (
        <main>{children}</main>
      ) : (
        <Box m='2rem'>
          <Alert status='info'>
            <AlertIcon />
            Please connect wallet to use the app
          </Alert>
        </Box>
      )}
    </>
  ) : null
}
