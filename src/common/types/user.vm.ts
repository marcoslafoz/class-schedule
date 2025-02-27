export interface UserCreate {
  username: string
  password: string
}

export interface UserLogin {
  username: string
  password: string
}

export interface UserTop {
  avatar_url?: string
  username: string
  money: number
}

export interface UserProfile {
  avatar_url?: string
  username: string
}

export interface UserEditAvatar {
  avatar_url?: string
  token: string
}

export interface UserBet {
  username: string
  avatar_url?: string
}
