import React from 'react'
import { useNavigate } from 'react-router'

export const GoHome: React.FC = () => {
  const navigate = useNavigate()

  return (
    <button
      className='text-white/60 hover:text-white flex flex-row flex-nowrap justify-center items-center gap-1'
      type='button'
      onClick={() => navigate('/')}
    >
      <img src='/assets/icons/arrow-left.png' alt='Volver' />
      <span>Horario</span>
    </button>
  )
}
