import * as React from 'react'
import { learnNGrow } from '@/utils/contracts'

import { ethers } from 'ethers'
import { useSigner } from 'wagmi'
import { IProfile } from '@/utils/types'

const MAX_PROFILE_COUNT = 20

export function useProfileList() {
  const { data: signer } = useSigner()
  const [profiles, setprofiles] = React.useState<IProfile[]>([])

  async function getProfileList() {
    if (!signer) return null

    const learnNGrowContract = new ethers.Contract(
      learnNGrow.address,
      learnNGrow.abi,
      signer
    )

    const allProfiles = []

    for (let i = 1; i <= MAX_PROFILE_COUNT; i++) {
      const profile = await learnNGrowContract.getProfile(i)
      const { handle, imageURI, pubCount } = profile

      if (!handle) break

      allProfiles.push({ id: i, handle, imageURI, pubCount })
    }

    setprofiles(allProfiles)
  }

  React.useEffect(() => {
    getProfileList()
  }, [signer])

  return profiles
}
