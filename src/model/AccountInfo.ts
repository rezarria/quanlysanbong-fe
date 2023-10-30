export default interface UserInfo {
  id: string
  fullName: string
  avatar: string
  background: string
  friends: string[]
  friendStatus: keyof typeof FriendStatus
}

export enum FriendStatus { BLOCK, NON_FRIEND, FRIEND, INVITING, NONE }
