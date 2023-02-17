import { IProfile } from '@/utils/types'
import * as React from 'react'

interface IStore {
  currentProfile: IProfile | {}
  profileList: IProfile[]
}

const initialStore: IStore = {
  currentProfile: {},
  profileList: [],
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
  const [store, setStore] = React.useState(initialStore)

  const value = React.useMemo(() => ({ store, setStore }), [store, setStore])

  return <StoreContext.Provider value={value} {...props} />
}
