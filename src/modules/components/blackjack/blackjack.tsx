import React from 'react'


interface BlackjackProps {
  defaultMoney: number | null
}

export const Blackjack: React.FC<BlackjackProps> = props => {

  const { defaultMoney } = props

  return (
    <div className='text-center text-white/50 text-xl ' >
      Próximamente...
    </div>
  )
}

