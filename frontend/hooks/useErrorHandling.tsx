import * as React from 'react'
import { ToastId, useToast, UseToastOptions } from '@chakra-ui/react'
import { formatError } from '@/utils/format'
import { defaultToastContent } from '@/utils'
import { useStore } from './useStore'

export default function useErrorHandling({
  error,
  enabled,
  args,
}: {
  enabled: boolean
  error: Error | null
  args: readonly unknown[]
}) {
  const { store } = useStore()
  const { learnNGrowContract } = store

  const toast = useToast()
  const toastIdRef = React.useRef<ToastId | null>(null)

  const [err, setErr] = React.useState<string | null>(null)

  function toastIt(toastOptions: UseToastOptions) {
    if (!toastIdRef.current) {
      toastIdRef.current = toast(toastOptions)
    }
    toast.update(toastIdRef.current, toastOptions)
  }

  React.useEffect(() => {
    if (!error || !learnNGrowContract) return

    const formattedError = formatError(learnNGrowContract, error)

    if (enabled) {
      toastIt({
        ...defaultToastContent,
        title: 'Error',
        description: formattedError,
        status: 'error',
      })
    }

    setErr(formattedError)
  }, [args, error])

  return err
}
