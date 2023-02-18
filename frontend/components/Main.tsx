import { useRouter } from 'next/router'
import { useAccount } from 'wagmi'

import { Alert, AlertIcon, Box, Button } from '@chakra-ui/react'

import { useProfile } from '@/hooks/contracts/useProfile'
import Link from 'next/link'
import React from 'react'
import { useStore } from '@/hooks/useStore'

const newProfilePagePath = '/profile/new'

export default function Main({ children }: React.PropsWithChildren) {
  const { address, isConnected } = useAccount()
  const { pathname } = useRouter()

  const connectedProfile = useProfile({ address })
  const { setStore } = useStore()

  React.useEffect(() => {
    if (connectedProfile) {
      setStore(s => ({ ...s, connectedProfileId: connectedProfile.id }))
    }
  }, [connectedProfile])

  const showCreateProfileButton =
    !connectedProfile && pathname !== newProfilePagePath

  return (
    <>
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
    </>
  )
}
