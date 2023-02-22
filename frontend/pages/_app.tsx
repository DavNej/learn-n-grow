import '@/styles/globals.css'

import type { AppProps } from 'next/app'

import { ChakraProvider } from '@chakra-ui/react'
import RainbowKitProvider from '@/utils/rainbowkit'

import { QueryClient, QueryClientProvider } from 'react-query'
import { ReactQueryDevtools } from 'react-query/devtools'

import Layout from '@/components/Layout'
import { StoreProvider } from '@/hooks/useStore'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 0,
    },
  },
})

export default function App({ Component, pageProps }: AppProps) {
  return (
    <RainbowKitProvider>
      <ChakraProvider>
        <StoreProvider>
          <QueryClientProvider client={queryClient}>
            <Layout>
              <Component {...pageProps} />
            </Layout>
            <ReactQueryDevtools initialIsOpen={false} />
          </QueryClientProvider>
        </StoreProvider>
      </ChakraProvider>
    </RainbowKitProvider>
  )
}
