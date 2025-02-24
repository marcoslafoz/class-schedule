import React from 'react'

import { useNavigate } from 'react-router-dom'

import { Button, Input, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader } from '@heroui/react'
import { SubmitHandler, useForm } from 'react-hook-form'
import { EyeFilledIcon, EyeSlashFilledIcon } from '@heroui/shared-icons'
import { UserContext } from '../../../common/context/user-context'
import { UserLogin } from '../../../common/types/user.vm'

interface LoginFormModalProps {
  showModal: boolean
  onClose: () => void
  onSuccessRoutte: string
}

export const LoginFormModal: React.FC<LoginFormModalProps> = props => {
  const { onClose, showModal, onSuccessRoutte } = props

  const [isPasswordVisible, setIsPasswordVisible] = React.useState(false)
  const [errorMessage, setErrorMessage] = React.useState<string | undefined>()

  const { handleSubmit, register, reset } = useForm<UserLogin>()

  const navigate = useNavigate()
  const { loginUser } = React.useContext(UserContext)

  const onSuccessLogin: SubmitHandler<UserLogin> = async values => {
    try {
      const loginUserResponse: boolean = await loginUser({
        password: values.password,
        username: values.username,
      })

      if (loginUserResponse) {
        navigate(onSuccessRoutte)
      } else {
        setErrorMessage('Contraseña o usuario incorrecto.')
      }
    } catch (error) {
      console.error('Error en el login:', error)
    } finally {
      reset()
    }
  }

  return (
    <>
      <Modal
        isOpen={showModal}
        onClose={() => {
          onClose()
          reset()
        }}
        placement='center'
        backdrop='blur'
      >
        <ModalContent>
          <ModalHeader className='flex flex-col gap-1 text-white'>Iniciar sesion</ModalHeader>

          <form onSubmit={handleSubmit(onSuccessLogin)}>
            <ModalBody>
              <Input
                {...register('username', { required: true })}
                isRequired
                placeholder='Usuario'
                name='username'
                autoComplete='username'
                size='lg'
              />
              <Input
                {...register('password', { required: true })}
                isRequired
                placeholder='Contraseña'
                size='lg'
                type={isPasswordVisible ? 'text' : 'password'}
                errorMessage='Contraseña inválida'
                name='password'
                autoComplete='current-password'
                endContent={
                  <button
                    className='focus:outline-none'
                    type='button'
                    onClick={() => setIsPasswordVisible(!isPasswordVisible)}
                  >
                    {isPasswordVisible ? (
                      <EyeSlashFilledIcon className='text-2xl text-default-400 pointer-events-none' />
                    ) : (
                      <EyeFilledIcon className='text-2xl text-default-400 pointer-events-none' />
                    )}
                  </button>
                }
              />
              {errorMessage && <div className='text-red-500 text-sm'>{errorMessage}</div>}
            </ModalBody>

            <ModalFooter>
              <div className='flex flex-row justify-between items-center w-full pb-2'>
                <Button color='default' size='md' onPress={() => navigate('/register')}>
                  Registrarse
                </Button>

                <Button color='primary' size='md' type='submit'>
                  Iniciar sesión
                </Button>
              </div>
            </ModalFooter>
          </form>
        </ModalContent>
      </Modal>
    </>
  )
}
