export type ILearnNGrowReadFunctionName =
  | 'getContentURI'
  | 'getHandle'
  | 'getProfile'
  | 'getProfileIdByHandle'
  | 'getPub'
  | 'getPubCount'
  | 'getPubPointer'
  | 'getPubType'
  | 'profile'
  | 'tokenURI'

export type ILearnNGrowWriteFunctionName =
  | 'comment'
  | 'createProfile'
  | 'post'
  | 'setProfileImageURI'

export interface IProfile {
  handle: string
  imageURI: string
  pubCount: number
  id: number
  tokenURI?: string
}
