import * as React from 'react'
import { learnNGrow } from '@/utils/contracts'

import { BigNumber, ethers } from 'ethers'
import { useSigner } from 'wagmi'
import { IProfileList } from '@/utils/types'
import { useStore } from '../useStore'

const MAX_PROFILE_COUNT = 20

export function useProfileList() {
  const { data: signer } = useSigner()
  const [profileList, setProfileList] = React.useState<IProfileList>({})

  const { setStore } = useStore()

  async function getProfileList() {
    if (!signer) return null

    const learnNGrowContract = new ethers.Contract(
      learnNGrow.address,
      learnNGrow.abi,
      signer
    )

    const profiles: IProfileList = {}

    for (let i = 1; i <= MAX_PROFILE_COUNT; i++) {
      const profile = await learnNGrowContract.getProfile(i)
      const BNpubCount = profile.pubCount as BigNumber
      const pubCount: number = BNpubCount.toNumber()
      const handle: string = profile.handle
      const imageURI: string = profile.imageURI

      if (!handle) break

      profiles[handle] = { id: i, handle, imageURI, pubCount }
    }

    setProfileList(profiles)
    setStore(store => ({ ...store, profileList }))
  }

  React.useEffect(() => {
    getProfileList()
  }, [signer])

  return profileList
}
