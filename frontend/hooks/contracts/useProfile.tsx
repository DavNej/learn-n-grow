import * as React from 'react'

import type { Address } from 'wagmi'

import { IProfile } from '@/utils/types'
import { useStore } from '../useStore'

export function useProfile({ address }: { address?: Address | null }) {
  const { store } = useStore()
  const { learnNGrowContract } = store

  const [profile, setprofile] = React.useState<IProfile | null>(null)
  const [isLoading, setIsLoading] = React.useState(true)
  const [hasProfile, setHasProfile] = React.useState(false)

  React.useEffect(() => {
    if (address) {
      getProfile()
    }
  }, [learnNGrowContract, address])

  async function getProfile() {
    if (!learnNGrowContract || !address) return

    setIsLoading(true)

    const profileId = await learnNGrowContract.profile(address)

    if (profileId.toNumber() === 0) return

    setHasProfile(true)

    const profile = await learnNGrowContract.getProfile(profileId)

    setprofile({
      id: profileId.toNumber(),
      imageURI: profile.imageURI,
      handle: profile.handle,
      pubCount: profile.pubCount,
    })

    setIsLoading(false)
  }

  return { profile, isLoading, hasProfile }
}
