import React from 'react'

import { Button, Input, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader } from '@heroui/react'
import { SubmitHandler, useForm } from 'react-hook-form'
import { UserEditAvatar } from '../../../common/types/user.vm'
import { TursoClient } from '../../../common/api/turso/config/client'

interface EditAvatarFormModalProps {
  showModal: boolean
  onClose: () => void
}

export const EditAvatarFormModal: React.FC<EditAvatarFormModalProps> = props => {
  const { onClose, showModal } = props

  const [errorMessage, setErrorMessage] = React.useState<string | undefined>()

  const { handleSubmit, register, reset } = useForm<UserEditAvatar>()

  const onSuccessLogin: SubmitHandler<UserEditAvatar> = async values => {
    if (values.avatar_url == undefined || values.avatar_url == null) {
      setErrorMessage('Errror al actualizar el avatar')
      return
    }

    try {
      await TursoClient.execute({
        sql: 'UPDATE user SET avatar_url = ? WHERE token = ?',
        args: [values.avatar_url, localStorage.getItem('token')],
      }).then(() => {
        onClose()
        window.location.reload()
      })
    } catch (error) {
      setErrorMessage('Errror al actualizar el avatar')
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
          <ModalHeader className='flex flex-col gap-1 text-white'>Cambiar avatar</ModalHeader>

          <form onSubmit={handleSubmit(onSuccessLogin)}>
            <ModalBody>
              <div className='flex flex-col justify-center items-center py-4'>
                <div className='flex flex-row justify-between items-center w-full gap-4 pb-4'>
                  <Input
                    {...register('avatar_url', { required: true })}
                    isRequired
                    placeholder='Avatar (url)'
                    name='avatar_url'
                    autoComplete='avatar_url'
                    size='lg'
                  />
                  <Button color='primary' size='md' type='submit'>
                    Guardar
                  </Button>
                </div>

                {errorMessage && <div className='text-red-500 text-sm'>{errorMessage}</div>}
              </div>
            </ModalBody>
          </form>
        </ModalContent>
      </Modal>
    </>
  )
}
