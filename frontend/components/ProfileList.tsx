import * as React from 'react'
import { Avatar, Box, Flex, Text } from '@chakra-ui/react'

import { useProfileList } from '@/hooks/contracts/profile'
import type { DataTypes } from '@/utils/LearnNGrow'

function ProfileItem({ profile }: { profile: DataTypes.ProfileStruct }) {
  return (
    <Box p={2} bg='white' borderBottom='1px solid red'>
      <Flex alignItems='center'>
        <Avatar mr={4} name={profile.handle} src={profile.imageURI} />
        <Text>@{profile.handle}</Text>
      </Flex>
    </Box>
  )
}

export default function ProfileList() {
  const profiles = useProfileList()

  const curratedProfiles = profiles?.filter(({ handle }) => !!handle)

  return (
    <aside>
      <Box p='2rem' bg='gray.100'>
        {curratedProfiles?.map(profile => (
          <ProfileItem profile={profile} />
        ))}
      </Box>
    </aside>
  )
}
