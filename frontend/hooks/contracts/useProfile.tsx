import * as React from 'react'

import { ethers } from 'ethers'
import type { Address } from 'wagmi'
import { useSigner } from 'wagmi'
import { IProfile } from '@/utils/types'
import { learnNGrow } from '@/utils/contracts'

export function useProfile({
  address,
  handle,
}: {
  address?: Address | null
  handle?: string | null
}) {
  const { data: signer } = useSigner()
  const [profile, setprofile] = React.useState<IProfile | {}>({})

  async function getProfile() {
    if (!signer || !(handle || address)) return {}

    const learnNGrowContract = new ethers.Contract(
      learnNGrow.address,
      learnNGrow.abi,
      signer
    )

    let profileId

    if (address) {
      profileId = await learnNGrowContract.profile(address)
    } else {
      profileId = await learnNGrowContract.getProfileIdByHandle(handle)
    }

    if (profileId.toNumber() === 0) return {}

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

  React.useEffect(() => {
    getProfile()
  }, [signer, handle])

  return profile as IProfile
}
