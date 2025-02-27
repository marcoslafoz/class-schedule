import React from 'react'
import { UserBet } from '../../../common/types'

interface UserBetCardProps {
  amount: number
  user: UserBet
}

export const UserBetCard: React.FC<UserBetCardProps> = props => {
  const { amount, user } = props

  return (
    <div className='flex flex-row  w-full justify-between text-center items-center px-3 py-2 gap-2   border-1 border-white/10  text-white/25  rounded-full'>
      <div className='flex flex-row gap-2'>
        <img src={user.avatar_url} alt={user.username} className='w-6 h-6 rounded-full object-cover aspect-square' />
        <div className='truncate hidden user-card-username'>{user.username}</div>
      </div>
      <div>{amount} §</div>
    </div>
  )
}
