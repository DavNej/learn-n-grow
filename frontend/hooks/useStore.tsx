import * as React from 'react'
import { IProfileList } from '@/utils/types'
import { Contract, ethers, Signer } from 'ethers'

import type { FetchSignerResult } from '@wagmi/core'
import { useSigner } from 'wagmi'

import { learnNGrow } from '@/utils/contracts'

interface IStore {
  connectedProfile: string
  learnNGrowContract: Contract | undefined
  signer: FetchSignerResult<Signer> | undefined
  profileList: IProfileList
}

const initialStore: IStore = {
  learnNGrowContract: undefined,
  signer: undefined,
  connectedProfile: '',
  profileList: {},
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
  const { data: signer } = useSigner()

  const [store, setStore] = React.useState(initialStore)

  React.useEffect(() => {
    if (signer) {
      const learnNGrowContract = new ethers.Contract(
        learnNGrow.address,
        learnNGrow.abi,
        signer
      )
      setStore(s => ({ ...s, signer, learnNGrowContract }))
    }
  }, [signer])

  const value = React.useMemo(() => ({ store, setStore }), [store, setStore])

  return <StoreContext.Provider value={value} {...props} />
}
