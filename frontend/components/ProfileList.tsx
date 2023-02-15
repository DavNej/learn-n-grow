import * as React from 'react'
import { Avatar, Box, Flex, LinkBox, LinkOverlay, Text } from '@chakra-ui/react'

import { useProfileList } from '@/hooks/contracts/profile'
import type { DataTypes } from '@/utils/LearnNGrow'

function ProfileItem({ profile }: { profile: DataTypes.ProfileStruct }) {
  return (
    <LinkBox px={4} py={2} _hover={{ backgroundColor: 'gray.200' }}>
      <LinkOverlay href={`/profile/${profile.handle}`}>
        <Flex alignItems='center'>
          <Avatar mr={4} name={profile.handle} src={profile.imageURI} />
          <Text>@{profile.handle}</Text>
        </Flex>
      </LinkOverlay>
    </LinkBox>
  )
}

export default function ProfileList() {
  const profiles = useProfileList()

  const curratedProfiles = profiles?.filter(({ handle }) => !!handle)

  return (
    <aside>
      <Box p={4}>
        <Box py={2} bg='white' overflow='hidden' borderRadius='xl'>
          {curratedProfiles?.map(profile => (
            <ProfileItem key={profile.handle} profile={profile} />
          ))}
        </Box>
      </Box>
    </aside>
  )
}
