import * as React from 'react'
import { Avatar, Box, Flex, Text } from '@chakra-ui/react'

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
  const profiles = useProfileList()

  return (
    <aside>
      <Box py={2} bg='white' overflow='hidden' borderRadius='xl'>
        {profiles
          ? profiles.map(profile => (
              <ProfileItem key={profile.handle} profile={profile} />
            ))
          : 'No members yet 🤷'}
      </Box>
    </aside>
  )
}
