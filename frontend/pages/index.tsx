import Head from 'next/head'

import Header from '@/components/Header'
import Main from '@/components/Main'
import { useAccount } from 'wagmi'
import { Alert, AlertIcon, Box } from '@chakra-ui/react'
import useIsMounted from '@/hooks/useIsMounted'

export default function Home() {
  const { isConnected } = useAccount()
  const isMounted = useIsMounted()

  return (
    isMounted && (
      <>
        <Head>
          <title>Learn N Grow</title>
          <meta name='description' content='Knowledge sharing DApp' />
          <meta name='viewport' content='width=device-width, initial-scale=1' />
          <link rel='icon' href='/favicon.ico' />
        </Head>

        <Header />
        {isConnected ? (
          <Main />
        ) : (
          <Box m='2rem'>
            <Alert status='info'>
              <AlertIcon />
              Wallet must be connected to use the app
            </Alert>
          </Box>
        )}
      </>
    )
  )
}
