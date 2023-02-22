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

// export type ITokenJson = any

// export interface IProfileToken {
//   json: ITokenJson
//   imageURI: `http${string}`
// }

export interface IProfile {
  handle: string
  imageURI: string
  pubCount: number
  id: number
  tokenURI?: string
}

export type ProfileRecord = Record<number, IProfile>

export interface IBasePublication {
  id: number
  authorId: number
  contentURI: string
}

export interface IPostPublication extends IBasePublication {
  type?: 'post'
}

export interface ICommentPublication extends IBasePublication {
  profileIdPointed: number
  pubIdPointed: number
  type?: 'comment'
}

export type IPublication = IPostPublication | ICommentPublication

export type PublicationMap = Map<number, IPublication>

export interface IPost extends IBasePublication {
  content: string
  creationDate: number
  author: Address
  comments?: IComment[]
  mediaURI?: string
}

export interface IComment extends ICommentPublication {
  content: string
  creationDate: number
  author: Address
  mediaURI?: string
}

export type PostMap = Map<number, IPost>
