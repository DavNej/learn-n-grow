import * as React from 'react'
import { abi, contractAddress } from '@/utils/contract'

import { ethers } from 'ethers'
import { useSigner } from 'wagmi'

interface IProfile {
  handle: string
  imageURI: string
  pubCount: number
  id: number
  tokenURI?: string
}

const MAX_PROFILE_COUNT = 5

export function useProfileList() {
  const { data: signer } = useSigner()
  const [profiles, setprofiles] = React.useState<IProfile[]>([])

  async function getProfileList() {
    if (!signer) return null

    const learnNGrow = new ethers.Contract(contractAddress, abi, signer)

    const allProfiles = []

    for (let i = 1; i <= MAX_PROFILE_COUNT; i++) {
      const profile = await learnNGrow.getProfile(i)
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
