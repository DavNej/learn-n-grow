import * as React from 'react'

import type { Address } from 'wagmi'

import { IProfile } from '@/utils/types'
import { useStore } from '../useStore'

export function useProfile({ address }: { address?: Address | null }) {
  const { store } = useStore()
  const { learnNGrowContract } = store

  const [profile, setprofile] = React.useState<IProfile | null>(null)

  React.useEffect(() => {
    getProfile()
  }, [learnNGrowContract, address])

  async function getProfile() {
    if (!learnNGrowContract || !address) return

    const profileId = await learnNGrowContract.profile(address)

    if (profileId.toNumber() === 0) return

    const profile = await learnNGrowContract.getProfile(profileId)
    const tokenURI = await learnNGrowContract.tokenURI(profileId)

    setprofile({
      id: profileId.toNumber(),
      imageURI: profile.imageURI,
      handle: profile.handle,
      pubCount: profile.pubCount,
      tokenURI,
    })
  }

  return profile
}
