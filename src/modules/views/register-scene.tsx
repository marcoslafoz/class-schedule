import React from 'react'
import { RegisterForm } from '../components'
import { UserProvider } from '../../common/context/user-context'

export const RegisterScene: React.FC = () => {
  return (
    <UserProvider>
      <>
        <div className=' flex flex-col justify-center items-center w-full h-screen bg-black'>
          <RegisterForm />
        </div>
      </>
    </UserProvider>
  )
}
