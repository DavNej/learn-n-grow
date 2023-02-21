import '@rainbow-me/rainbowkit/styles.css'

import type { PropsWithChildren } from 'react'
import { getDefaultWallets, RainbowKitProvider } from '@rainbow-me/rainbowkit'
import { configureChains, createClient, WagmiConfig } from 'wagmi'

// Supported chains 👉 https://wagmi.sh/react/chains#supported-chains
import { hardhat, goerli } from 'wagmi/chains'

import { publicProvider } from 'wagmi/providers/public'
// import { alchemyProvider } from 'wagmi/providers/alchemy'

const { chains, provider } = configureChains(
  process.env.NODE_ENV === 'production' ? [goerli] : [hardhat],
  [
    // alchemyProvider({ apiKey: process.env.ALCHEMY_ID }),
    publicProvider(),
  ]
)
const { connectors } = getDefaultWallets({
  appName: 'Learn N Grow',
  chains,
})

const client = createClient({
  autoConnect: !(process.env.NODE_ENV === 'production'),
  connectors,
  provider,
})

export default function Provider({ children }: PropsWithChildren) {
  return (
    <WagmiConfig client={client}>
      <RainbowKitProvider chains={chains}>{children}</RainbowKitProvider>
    </WagmiConfig>
  )
}
