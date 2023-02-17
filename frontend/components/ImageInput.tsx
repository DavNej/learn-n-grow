import React, { useState } from 'react'
import { Image } from '@chakra-ui/react'
import FileInput from './FileInput'

function ImageInput({
  onChange,
  src,
}: {
  onChange: (i: File) => void
  src?: string
}) {
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)

  function handleImageChange(img: File) {
    if (img) {
      setPreviewUrl(URL.createObjectURL(img))
      onChange(img)
    }
  }

  return (
    <>
      <FileInput onChange={handleImageChange} />

      <Image
        borderRadius='full'
        boxSize='150px'
        onClick={() => {
          document.getElementById('file-input')?.click()
        }}
        style={{ cursor: 'pointer' }}
        src={previewUrl || src || '/avatar-placeholder.png'}
        alt='Avatar'
      />
    </>
  )
}

export default ImageInput
