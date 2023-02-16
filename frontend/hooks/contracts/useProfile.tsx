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
  const [profile, setprofile] = React.useState<IProfile | null>(null)

  async function getProfile() {
    if (!signer || !(handle || address)) return null

    const learnNGrow = new ethers.Contract(contractAddress, abi, signer)

    let profileId

    if (address) {
      profileId = await learnNGrow.profile(address)
    } else {
      profileId = await learnNGrow.getProfileIdByHandle(handle)
    }

    if (profileId.toNumber() === 0) return null

    const {
      handle: resHandle,
      imageURI,
      pubCount,
    } = await learnNGrow.getProfile(profileId)

    const tokenURI = await learnNGrow.tokenURI(profileId)

    setprofile({
      handle: resHandle,
      imageURI,
      pubCount,
      id: profileId.toNumber(),
      tokenURI,
    })
  }

  React.useEffect(() => {
    getProfile()
  }, [signer, handle])

  return profile
}
