import * as React from 'react'

import {
  Box,
  Button,
  Flex,
  FormControl,
  FormLabel,
  Heading,
  Input,
} from '@chakra-ui/react'
import ImageInput from '@/components/ImageInput'
import { useState } from 'react'

export default function Register() {
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [image, setImage] = useState<File | null>(null)

  function mintProfile() {
    const profile = {
      name,
      description,
      image,
    }

    //   try {
    //     // Make a request to your backend to upload the image
    //     const response = await fetch('/api/upload-image', {
    //       method: 'POST',
    //       body: formData,
    //     })

    //     if (!response.ok) {
    //       throw new Error('Failed to upload image')
    //     }

    //     // Do something with the response, e.g. display a success message
    //   } catch (error) {
    //     console.error(error)
    //   }

    console.log(profile)
  }

  return (
    <main>
      <Box p='2rem' bg='blue.50'>
        <Heading>Create your profile</Heading>

        <Flex mt='2rem' p='1rem' bg='white' alignItems='flex-end'>
          <Box p='2rem' mt={2}>
            <ImageInput onChange={img => setImage(img)} />
          </Box>
          <Box p='2rem'>
            <FormControl isRequired>
              <FormLabel>Profile name</FormLabel>
              <Input
                value={name}
                onChange={e => setName(e.target.value)}
                width='md'
              />
            </FormControl>

            <FormControl isRequired>
              <FormLabel>Description</FormLabel>
              <Input
                value={description}
                onChange={e => setDescription(e.target.value)}
                width='md'
              />
            </FormControl>
          </Box>
          <Button
            mb='2rem'
            colorScheme='blue'
            onClick={mintProfile}
            isDisabled={!true}>
            Mint profile
          </Button>
        </Flex>
      </Box>
    </main>
  )
}
