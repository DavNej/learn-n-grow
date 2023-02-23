import * as React from 'react'
import type { Contract } from 'ethers'
import { ethers } from 'ethers'
import { useProvider } from 'wagmi'

import { learnNGrow } from '@/utils/contracts'

interface IStore {
  learnNGrowContract: Contract | undefined
}

const initialStore: IStore = {
  learnNGrowContract: undefined,
}

const StoreContext = React.createContext<{
  store: IStore
  setStore: React.Dispatch<React.SetStateAction<IStore>>
}>({
  store: initialStore,
  setStore: () => {},
})

export function useStore() {
  const context = React.useContext(StoreContext)
  if (!context) {
    throw new Error('useStore must be used within the StoreProvider')
  }
  return context
}

export function StoreProvider(props: React.PropsWithChildren) {
  const provider = useProvider()

  const [store, setStore] = React.useState(initialStore)

  const learnNGrowContract = new ethers.Contract(
    learnNGrow.address,
    learnNGrow.abi,
    provider
  )

  React.useEffect(() => {
    setStore(s => ({ ...s, provider, learnNGrowContract }))
  }, [])

  const value = React.useMemo(() => ({ store, setStore }), [store, setStore])

  return <StoreContext.Provider value={value} {...props} />
}
