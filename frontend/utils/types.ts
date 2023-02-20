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

export interface IBasePublication {
  id: number
  authorId: number
  contentURI: string
}

export interface IPostPublication extends IBasePublication {
  type: 'post'
}

export interface ICommentPublication extends IBasePublication {
  type: 'comment'
  profileIdPointed: number
  pubIdPointed: number
}

export type IPublication = IPostPublication | ICommentPublication
export type PublicationMap = Map<number, IPublication>

export interface IPost extends IBasePublication {
  content: string
  creationDate: number
  author: Address
  comments?: ICommment[]
  mediaURI?: string
}

export interface ICommment extends IBasePublication {
  content: string
  creationDate: number
  author: Address
  mediaURI?: string
}
