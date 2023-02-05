import { useEffect } from 'react'
import { useToast } from '@chakra-ui/react'
import { formatError } from '@/utils/format'
import { defaultToastContent } from '@/utils'

export default function useErrorHandling({
  isError,
  errorMessage,
  args,
}: {
  errorMessage?: string
  isError: boolean
  args: string
}) {
  const toast = useToast()

  useEffect(() => {
    if (isError) {
      toast({
        ...defaultToastContent,
        title: 'Error',
        description: formatError(errorMessage, args),
        status: 'error',
      })
    }
  }, [args, isError, errorMessage])
}
