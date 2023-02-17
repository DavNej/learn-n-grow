import React from 'react'
import { Button } from '@chakra-ui/react'

export default function FileInput({
  accept = 'image/png, image/jpeg',
  isDisabled = false,
  onChange,
  withButton = false,
}: {
  accept?: string
  isDisabled?: boolean
  onChange: (i: File) => void
  withButton?: boolean
}) {
  function handleFileChange(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files && event.target.files[0]

    if (file) {
      onChange(file)
    }
  }

  return (
    <>
      <input
        type='file'
        id='file-input'
        hidden
        accept={accept}
        onChange={handleFileChange}
      />
      {withButton && (
        <Button
          isDisabled={isDisabled}
          onClick={() => {
            document.getElementById('file-input')?.click()
          }}>
          Add media
        </Button>
      )}
    </>
  )
}
