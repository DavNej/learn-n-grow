import { useAccount } from 'wagmi'
import { owner } from '@/utils/voting-contract'

function useIsOwner() {
  const { address } = useAccount()

  return address === owner
}

export default useIsOwner
