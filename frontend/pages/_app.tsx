import '@/styles/globals.css'

import type { AppProps } from 'next/app'

import { ChakraProvider } from '@chakra-ui/react'
import RainbowKitProvider from '@/utils/rainbowkit'

import Layout from '@/components/Layout'

export default function App({ Component, pageProps }: AppProps) {
  return (
    <RainbowKitProvider>
      <ChakraProvider>
        <Layout>
          <Component {...pageProps} />
        </Layout>
      </ChakraProvider>
    </RainbowKitProvider>
  )
}
