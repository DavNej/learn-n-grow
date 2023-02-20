import { Address } from 'wagmi'

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

export type IProfileList = Record<string, IProfile>

export interface ICommment {
  contentURI: string
  id: number
  authorId: number
  content: string
  creationDate: number
  author: Address
  mediaURI?: string
}

export interface IPost {
  contentURI: string
  id: number
  authorId: number
  comments?: ICommment[]
  content: string
  creationDate: number
  author: Address
  mediaURI?: string
}
