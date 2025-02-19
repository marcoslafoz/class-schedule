import React from 'react'

import { SubmitHandler, useForm } from 'react-hook-form'
import { Button, Input } from '@heroui/react'
import { EyeFilledIcon, EyeSlashFilledIcon } from '@heroui/shared-icons'
import { useNavigate } from 'react-router'
import { validatePasswordRegex, validateUsernameRegex } from '../../../common/utils/regex'
import { UserContext } from '../../../common/context/user-context'
import { UserCreate } from '../../../common/types/user.vm'

export const RegisterForm: React.FC = () => {
  const [isPasswordVisible, setIsPasswordVisible] = React.useState(false)
  const [errorMessage, setErrorMessage] = React.useState<string | undefined>()
  const [username, setUsername] = React.useState<string | undefined>()
  const [password, setPassword] = React.useState<string | undefined>()
  const [passwordErrors, setPasswordErrors] = React.useState<string[]>([])
  const [usernameErrors, setUsernameErrors] = React.useState<string[]>([])

  const { handleSubmit, register, reset } = useForm<UserCreate>()

  const { createUser } = React.useContext(UserContext)

  const navigate = useNavigate()

  const validatePassword = (password: string) => {
    const newErrors: string[] = []

    if (password.length < 8) newErrors.push('Incluye al menos 8 caracteres.')
    if ((password.match(/[A-Z]/g) || []).length < 1) newErrors.push('Incluye al menos 1 letra mayúscula.')
    if ((password.match(/[a-z]/g) || []).length < 1) newErrors.push('Incluye al menos 1 letra minúscula.')
    if ((password.match(/\d/g) || []).length < 1) newErrors.push('Incluye al menos 1 número.')
    if ((password.match(/[^A-Za-z0-9]/g) || []).length < 1) newErrors.push('Incluye al menos 1 carácter especial.')
    if (/\s/.test(password)) newErrors.push('No se permiten espacios.')

    setPasswordErrors(newErrors)
  }

  const validateUsername = (username: string) => {
    const newErrors: string[] = []

    if (username.length < 3 || username.length > 30) newErrors.push('Debe tener entre 3 y 30 caracteres.')
    if (!/^[a-zA-Z0-9._]+$/.test(username))
      newErrors.push('Solo puede contener letras, números, puntos y guiones bajos.')
    if (/^\./.test(username) || /\.$/.test(username)) newErrors.push('No puede empezar ni terminar con un punto.')
    if (/\.\./.test(username)) newErrors.push('No puede contener dos puntos seguidos.')
    if (/\s/.test(username)) newErrors.push('No se permiten espacios.')

    setUsernameErrors(newErrors)
  }

  const handleUsernameChange = (value: string) => {
    setUsername(value)
    validateUsername(value)
  }

  const handlePasswordChange = (value: string) => {
    setPassword(value)
    validatePassword(value)
  }

  const onSuccessRegister: SubmitHandler<UserCreate> = async values => {
    if (values.password && !validatePasswordRegex(values.password)) {
      setErrorMessage('La contraseña no cumple los requisitos')
      return
    }

    if (values.username && !validateUsernameRegex(values.username)) {
      setErrorMessage('El nombre de usuario no cumple los requisitos')
      return
    }

    const createUserResponse: boolean = await createUser({
      password: values.password,
      username: values.username,
    })

    if (createUserResponse == false) setErrorMessage('El usuario ya existe.')

    if (createUserResponse == true) navigate('/roulette')
  }

  return (
    <>
      <form onSubmit={handleSubmit(onSuccessRegister)}>
        <div className='flex flex-col bg-[#18181B] gap-4 justify-center items-center rounded-xl p-6 '>
          <div className='flex flex-col gap-4 justify-center items-center '>
            <Input
              {...register('username', { required: true })}
              onValueChange={handleUsernameChange}
              className='w-72'
              errorMessage={() => (
                <ul>
                  {' '}
                  {usernameErrors.map((error, i) => (
                    <li key={i}>{error}</li>
                  ))}
                </ul>
              )}
              labelPlacement='outside'
              value={username}
              isInvalid={usernameErrors.length > 0}
              isRequired
              placeholder='Nombre de usuario'
              size='md'
            />

            <Input
              {...register('password', { required: true })}
              onValueChange={handlePasswordChange}
              errorMessage={() => (
                <ul>
                  {' '}
                  {passwordErrors.map((error, i) => (
                    <li key={i}>{error}</li>
                  ))}
                </ul>
              )}
              labelPlacement='outside'
              placeholder='Contraseña'
              className={'w-72'}
              isRequired
              value={password}
              isInvalid={passwordErrors.length > 0}
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
              type={isPasswordVisible ? 'text' : 'password'}
            />
            <div className='text-red-500 text-sm'>{errorMessage}</div>
          </div>

          <div className='flex flex-row gap-4'>
            <Button
              color='danger'
              className='bg-transparent border border-red-500 text-red-500'
              size='md'
              onPress={() => {
                navigate('/')
                reset()
              }}
            >
              Cancelar
            </Button>
            <Button
              color='primary'
              size='md'
              type='submit'
              isDisabled={
                username?.trim() == undefined ||
                !validateUsernameRegex(username) ||
                usernameErrors.length != 0 ||
                password?.trim() == undefined ||
                !validatePasswordRegex(password) ||
                passwordErrors.length != 0
              }
            >
              Registrarse
            </Button>
          </div>
        </div>
      </form>
    </>
  )
}
