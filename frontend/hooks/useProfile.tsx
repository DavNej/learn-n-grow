import * as React from 'react'
import { abi, contractAddress } from '@/utils/contract'

import { ethers } from 'ethers'
import { useSigner } from 'wagmi'

interface IProfile {
  handle: string
  imageURI: string
  pubCount: number
  id: number
  tokenURI: string
}

export function useProfile(handle: string | null) {
  const { data: signer } = useSigner()
  const [profile, setprofile] = React.useState<IProfile | null>(null)

  async function getProfile() {
    if (!signer || !handle) return

    const learnNGrow = new ethers.Contract(contractAddress, abi, signer)

    const profileId = await learnNGrow.getProfileIdByHandle(handle)
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
