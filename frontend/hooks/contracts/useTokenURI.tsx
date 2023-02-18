import * as React from 'react'

// import { IProfileToken } from '@/utils/types'
import { useStore } from '../useStore'
import { decodeImageDataURI, decodeJsonDataURI } from '@/utils/decode'

export function useProfileToken({ profileId }: { profileId: number }) {
  const { store } = useStore()
  const { learnNGrowContract } = store

  const [profileToken, setProfileToken] = React.useState<any | null>(null)

  React.useEffect(() => {
    getTokenURI()
  }, [learnNGrowContract, profileId])

  async function getTokenURI() {
    if (!learnNGrowContract || profileId === 0) return

    const tokenURI = await learnNGrowContract.tokenURI(profileId)

    const tokenJson = decodeJsonDataURI(tokenURI)

    const image = tokenJson
      ? decodeImageDataURI(tokenJson.image)
      : 'Broken image URI 😣'

    setProfileToken({ tokenJson, image })
  }

  return profileToken
}
