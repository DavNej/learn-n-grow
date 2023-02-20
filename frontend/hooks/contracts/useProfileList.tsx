import * as React from 'react'

import { BigNumber } from 'ethers'
import { IProfileList } from '@/utils/types'
import { useStore } from '../useStore'

const MAX_PROFILE_COUNT = 20

export function useProfileList({ enabled }: { enabled: boolean }) {
  const [isLoading, setIsLoading] = React.useState(true)

  const { store, setStore } = useStore()
  const { learnNGrowContract, profilesById } = store

  React.useEffect(() => {
    if (!!learnNGrowContract && enabled) {
      getProfileList()
    }
  }, [learnNGrowContract])

  async function getProfileList() {
    if (!learnNGrowContract) return null

    const profiles: IProfileList = {}

    setIsLoading(true)

    for (let i = 1; i <= MAX_PROFILE_COUNT; i++) {
      const profile = await learnNGrowContract.getProfile(i)
      const BNpubCount = profile.pubCount as BigNumber
      const pubCount: number = BNpubCount.toNumber()
      const handle: string = profile.handle
      const imageURI: string = profile.imageURI

      if (!handle) break

      profiles[i] = { id: i, handle, imageURI, pubCount }
    }

    setStore(store => ({ ...store, profilesById: profiles }))

    setIsLoading(false)
  }

  return { profilesById, isLoading }
}
