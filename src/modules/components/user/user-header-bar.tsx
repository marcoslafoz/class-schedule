import React from 'react'
import { TursoClient } from '../../../common/api/turso/config/client'
import { UserProfile } from '../../../common/types'
import { EditAvatarFormModal } from './edit-avatar-form-modal'
import { useNavigate } from 'react-router'

export const UserHeaderBar: React.FC = () => {
  const navigate = useNavigate()

  return (
    <>
      <div className='flex lg:md:flex-row flex-col lg:md:gap-0 gap-7 flex-wrap w-full h-auto p-6  justify-between items-center '>
        <div className='lg:md:w-1/5 lg:md:justify-start justify-center flex flex-row flex-nowrap gap-10'>
          <button
            className='text-white/60 hover:text-white flex flex-row flex-nowrap justify-center items-center gap-1 '
            type='button'
            onClick={() => navigate('/')}
          >
            <img src='/assets/icons/arrow-left.png' alt='Volver' />
            <span>Horario</span>
          </button>

          <div className='flex flex-row flex-nowrap justify-center items-center gap-4 lg:md:hidden'>
            <UserAvatar />
          </div>
        </div>

        <div className='flex flex-row lg:md:w-3/5 flex-wrap justify-center items-center lg:sm:gap-8 gap-2 lg:sm:text-lg text-nowrap'>
          <button
            onClick={() => navigate('/roulette')}
            className='text-white/60 hover:text-white/80  bg-white/5 hover:bg-white/10 rounded-full py-1 px-3'
          >
            🍀 Roulette
          </button>
          <button
            onClick={() => navigate('/blackjack')}
            className='text-white/60 hover:text-white/80  bg-white/5 hover:bg-white/10 rounded-full py-1 px-3'
          >
            🃏 Blackjack
          </button>
          <button
            onClick={() => navigate('/slot')}
            className='text-white/60 hover:text-white/80  bg-white/5 hover:bg-white/10 rounded-full py-1 px-3'
          >
            🎰 Slot
          </button>
          <button
            onClick={() => navigate('/coinflip')}
            className='text-white/60 hover:text-white/80  bg-white/5 hover:bg-white/10 rounded-full py-1 px-3'
          >
            🪙 Coinflip
          </button>
          <button
            onClick={() => navigate('/roulette-50')}
            className='text-white/60 hover:text-white/80  bg-white/5 hover:bg-white/10 rounded-full py-1 px-3'
          >
            ⚖️ 50/50
          </button>
          {/* <button
            onClick={() => navigate('/sports')}
            className='text-white/60 hover:text-white/80  bg-white/5 hover:bg-white/10 rounded-full py-1 px-3'
          >
            ⚽ Deportes
          </button> */}
        </div>

        <div className='lg:md:flex hidden flex-row lg:md:w-1/5 justify-end items-center gap-4 text-white/60 '>
          <UserAvatar />
        </div>
      </div>
    </>
  )
}

const UserAvatar: React.FC = () => {
  const [user, setUser] = React.useState<UserProfile>()
  const [loading, setLoading] = React.useState<boolean>(true)
  const [showLoginModal, setShowLoginModal] = React.useState(false)

  const handleLogout = async () => {
    localStorage.removeItem('token')
    window.location.reload()
  }

  React.useEffect(() => {
    const fetchUser = async () => {
      try {
        const result = await TursoClient.execute({
          sql: 'SELECT username, avatar_url FROM user WHERE token = ?',
          args: [localStorage.getItem('token')],
        })

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const formattedUser: UserProfile = {
          username: result.rows[0].username?.toString() ?? '',
          avatar_url: result.rows[0].avatar_url?.toString() ?? '',
        }

        setUser(formattedUser)
      } finally {
        setLoading(false)
      }
    }

    fetchUser()
  }, [])

  if (loading || !user) return <></>

  return (
    <>
      <button
        onClick={() => setShowLoginModal(true)}
        className='hover:scale-110 transition-transform duration-300 ease-in-out rounded-full flex flex-row flex-nowrap '
      >
        <img
          src={user.avatar_url || '/assets/avatar/default.png'}
          alt={user.username}
          className='w-12 h-12 rounded-full aspect-square'
        />
      </button>
      <div className='truncate max-w-40'>{user.username}</div>
      <button className='opacity-40' onClick={handleLogout}>
        <svg fill='none' height='24' viewBox='0 0 24 24' width='24' xmlns='http://www.w3.org/2000/svg'>
          <path
            d='M17 16L21 12M21 12L17 8M21 12L7 12M13 16V17C13 18.6569 11.6569 20 10 20H6C4.34315 20 3 18.6569 3 17V7C3 5.34315 4.34315 4 6 4H10C11.6569 4 13 5.34315 13 7V8'
            stroke='#f00'
            strokeLinecap='round'
            strokeLinejoin='round'
            strokeWidth='2'
          />
        </svg>
      </button>
      <EditAvatarFormModal onClose={() => setShowLoginModal(false)} showModal={showLoginModal} />
    </>
  )
}
