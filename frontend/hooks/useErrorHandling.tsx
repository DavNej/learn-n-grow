import { useEffect } from 'react'
import { useToast } from '@chakra-ui/react'
import { formatError } from '@/utils/format'
import { defaultToastContent } from '@/utils'
import { useStore } from './useStore'

export default async function useErrorHandling({
  error,
  args,
}: {
  error: Error | null
  args: readonly unknown[]
}) {
  const toast = useToast()
  const { store } = useStore()

  const { learnNGrowContract } = store

  useEffect(() => {
    if (!error || !learnNGrowContract) return

    toast({
      ...defaultToastContent,
      title: 'Error',
      description: formatError(learnNGrowContract, error),
      status: 'error',
    })
  }, [args, error])
}
