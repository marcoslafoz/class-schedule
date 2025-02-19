import React from 'react'
import { LoginFormModal } from '../login/login-form-modal'
import { UserContext } from '../../../common/context/user-context'
import { useNavigate } from 'react-router'

export const RouletteShortcut: React.FC = () => {
  const [showLoginModal, setShowLoginModal] = React.useState(false)

  const { isUserLogged } = React.useContext(UserContext)
  const navigate = useNavigate()

  const openRouletteModal = async () => {
    const isLogged: boolean = await isUserLogged()

    if (isLogged) {
      navigate('/roulette')
      return
    }

    setShowLoginModal(true)
  }

  return (
    <>
      <td
        className='roulette-icon hidden lg:flex rounded-xl text-white bg-[#353535]  w-20 h-20 px-2 py-1 text-xs justify-center items-center hover:cursor-pointer'
        onClick={openRouletteModal}
      >
        <img
          src={'/assets/icons/fortune-wheel.png'}
          alt='Roulette icon'
          className='object-contain w-3/4 h-3/4 animate-spin '
          style={{ animationDuration: '4s' }}
        />
      </td>

      <LoginFormModal onClose={() => setShowLoginModal(false)} showModal={showLoginModal} />
    </>
  )
}
