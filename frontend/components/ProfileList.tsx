import * as React from 'react'
import { Avatar, Box, Flex, Spinner, Text } from '@chakra-ui/react'

import { useProfileList } from '@/hooks/contracts/useProfileList'
import Link from 'next/link'
import { IProfile } from '@/utils/types'

function ProfileItem({ profile }: { profile: IProfile }) {
  return (
    <Link href={`/profile/${profile.handle}`}>
      <Box px={4} py={2} _hover={{ backgroundColor: 'gray.200' }}>
        <Flex alignItems='center'>
          <Avatar mr={4} name={profile.handle} src={profile.imageURI} />
          <Text>@{profile.handle}</Text>
        </Flex>
      </Box>
    </Link>
  )
}

export default function ProfileList() {
  const { profileList, isLoading } = useProfileList()

  const profiles = Object.values(profileList)
  const hasProfiles = profiles.length > 0

  return (
    <aside>
      <Box py={2} bg='white' overflow='hidden' borderRadius='xl'>
        {isLoading ? (
          <Spinner />
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
