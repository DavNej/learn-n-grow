import * as React from 'react'

import { ethers } from 'ethers'
import type { Address } from 'wagmi'
import { useSigner } from 'wagmi'
import { IProfile } from '@/utils/types'
import { abi, contractAddress } from '@/utils/contract'

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

    const learnNGrow = new ethers.Contract(contractAddress, abi, signer)

    let profileId

    if (address) {
      profileId = await learnNGrow.profile(address)
    } else {
      profileId = await learnNGrow.getProfileIdByHandle(handle)
    }

    if (profileId.toNumber() === 0) return {}

    const profile = await learnNGrow.getProfile(profileId)

    const tokenURI = await learnNGrow.tokenURI(profileId)

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
