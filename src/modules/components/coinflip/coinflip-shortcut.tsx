import React from 'react'
import { LoginFormModal } from '../login/login-form-modal'
import { UserContext } from '../../../common/context/user-context'
import { useNavigate } from 'react-router'

export const CoinFlipShortcut: React.FC = () => {
  const [showLoginModal, setShowLoginModal] = React.useState(false)

  const { isUserLogged } = React.useContext(UserContext)
  const navigate = useNavigate()

  const openCoinFlipModal = async () => {
    const isLogged: boolean = await isUserLogged()

    if (isLogged) {
      navigate('/coinflip')
      return
    }

    setShowLoginModal(true)
  }

  return (
    <>
      <td
        className='hidden lg:flex rounded-xl text-white bg-[#353535]  w-20 h-20 px-2 py-1 text-xs justify-center items-center hover:cursor-pointer'
        onClick={openCoinFlipModal}
      >
        <img
          src={'/assets/icons/coinflip.webp'}
          alt='CoinFlip icon'
          className='object-contain w-3/4 h-3/4 grayscale '
        />
      </td>

      <LoginFormModal onClose={() => setShowLoginModal(false)} showModal={showLoginModal} onSuccessRoutte='/coinflip' />
    </>
  )
}

export const CoinFlipFlexShortcut: React.FC = () => {
  const [showLoginModal, setShowLoginModal] = React.useState(false)

  const { isUserLogged } = React.useContext(UserContext)
  const navigate = useNavigate()

  const openCoinFlipModal = async () => {
    const isLogged: boolean = await isUserLogged()

    if (isLogged) {
      navigate('/coinflip')
      return
    }

    setShowLoginModal(true)
  }

  return (
    <>
      <td
        className={'rounded-xl  text-white h-16 w-32 px-2 py-1 text-xs bg-[#353535] hover:cursor-pointer '}
        rowSpan={1}
        onClick={openCoinFlipModal}
      >
        <div className='w-full h-full flex items-center justify-center'>
          <img
            src={'/assets/icons/coinflip.webp'}
            alt='CoinFlip icon'
            className='object-contain w-3/4 h-3/4 grayscale '
          />
        </div>
      </td>
      <LoginFormModal onClose={() => setShowLoginModal(false)} showModal={showLoginModal} onSuccessRoutte='/coinflip' />
    </>
  )
}
