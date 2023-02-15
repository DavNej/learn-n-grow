import * as React from 'react'

const StoreContext = React.createContext<{
  store: {}
  setStore: React.Dispatch<React.SetStateAction<{}>>
} | null>(null)

export function useStore() {
  const context = React.useContext(StoreContext)
  if (!context) {
    throw new Error('useStore must be used within the StoreProvider')
  }
  return context
}

export function StoreProvider(props: React.PropsWithChildren) {
  const [store, setStore] = React.useState({})

  const value = React.useMemo(() => ({ store, setStore }), [store, setStore])

  return <StoreContext.Provider value={value} {...props} />
}
