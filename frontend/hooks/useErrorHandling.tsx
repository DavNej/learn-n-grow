import { useEffect } from 'react'
import { useToast } from '@chakra-ui/react'
import { formatError } from '@/utils/format'
import { defaultToastContent } from '@/utils'
import { useContract } from 'wagmi'
import { learnNGrow } from '@/utils/contracts'

export default async function useErrorHandling({
  error,
  args,
}: {
  error: Error | null
  args: readonly unknown[]
}) {
  const toast = useToast()

  const contract = useContract(learnNGrow)

  useEffect(() => {
    if (!error || !contract) return

    toast({
      ...defaultToastContent,
      title: 'Error',
      description: formatError(contract, error),
      status: 'error',
    })
  }, [args, error])
}
