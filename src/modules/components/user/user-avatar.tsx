import React from 'react'
import { TursoClient } from '../../../common/api/turso/config/client'
import { UserProfile } from '../../../common/types'
import { EditAvatarFormModal } from './edit-avatar-form-modal'

export const UserAvatar: React.FC = () => {
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
      <div className='flex flex-row justify-between items-center gap-3 text-white/60'>
        <button
          onClick={() => setShowLoginModal(true)}
          className='hover:scale-110 transition-transform duration-300 ease-in-out rounded-full'
        >
          <img
            src={user.avatar_url || '/assets/avatar/default.png'}
            alt={user.username}
            className='object-contain w-12 h-12 rounded-full'
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
      </div>
      <EditAvatarFormModal onClose={() => setShowLoginModal(false)} showModal={showLoginModal} />
    </>
  )
}
