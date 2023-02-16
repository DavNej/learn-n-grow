import React, { useState } from 'react'
import { Image } from '@chakra-ui/react'

function ImageInput({
  onChange,
  src,
}: {
  onChange: (i: File) => void
  src?: string
}) {
  // const [previewUrl, setPreviewUrl] = useState<string | null>(null)

  function handleImageChange(event: React.ChangeEvent<HTMLInputElement>) {
    const img = event.target.files && event.target.files[0]

    if (img) {
      // setPreviewUrl(URL.createObjectURL(img))
      onChange(img)
    }
  }

  return (
    <>
      <input
        type='file'
        id='file-input'
        hidden
        accept='image/png, image/jpeg'
        onChange={handleImageChange}
      />

      <Image
        borderRadius='full'
        boxSize='150px'
        onClick={() => {
          document.getElementById('file-input')?.click()
        }}
        style={{ cursor: 'pointer' }}
        src={src ? src : '/avatar-placeholder.png'}
        // src={previewUrl ? previewUrl : '/avatar-placeholder.png'}
        alt='Avatar'
      />
    </>
  )
}

export default ImageInput
