import * as React from 'react'
import { Avatar, Box, Flex, Spinner, Text } from '@chakra-ui/react'

import Link from 'next/link'
import { IProfile } from '@/utils/types'
import { useProfile, useProfiles } from '@/hooks/learn-n-grow'

function ProfileItem({ profile }: { profile: IProfile }) {
  return (
    <Box width='100%'>
      <Link href={'/' + profile.handle}>
        <Box px={4} py={2} _hover={{ backgroundColor: 'gray.200' }}>
          <Flex alignItems='center'>
            <Avatar mr={4} name={profile.handle} src={profile.imageURI} />
            <Text>@{profile.handle}</Text>
          </Flex>
        </Box>
      </Link>
    </Box>
  )
}

export default function ProfileList() {
  const { data: profile } = useProfile()
  const { data: profilesById, isLoading } = useProfiles()

  const profiles = Object.values(profilesById || {}).filter(
    p => p.id !== profile?.id
  )
  const hasProfiles = profiles.length > 0

  return (
    <aside>
      <Box
        py={2}
        bg='white'
        overflow='hidden'
        borderRadius='xl'
        minW={200}
        justifyContent='center'>
        {isLoading ? (
          <Flex justifyContent='center'>
            <Spinner />
          </Flex>
        ) : hasProfiles ? (
          profiles.map(profile => (
            <ProfileItem key={profile.handle} profile={profile} />
          ))
        ) : (
          <Text px={4} py={2} textAlign='center' whiteSpace='nowrap'>
            No members 🤷
          </Text>
        )}
      </Box>
    </aside>
  )
}
