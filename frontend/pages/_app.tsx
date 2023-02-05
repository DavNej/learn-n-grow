import '@/styles/globals.css'

import type { AppProps } from 'next/app'

import { ChakraProvider } from '@chakra-ui/react'
import RainbowKitProvider from '@/utils/rainbowkit'

export default function App({ Component, pageProps }: AppProps) {
  return (
    <RainbowKitProvider>
      <ChakraProvider>
        <Component {...pageProps} />
      </ChakraProvider>
    </RainbowKitProvider>
  )
}
