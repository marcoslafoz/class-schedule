import React from 'react'
import { SubmitHandler, useForm } from 'react-hook-form'
import { NewBetForm, OddOptionEnum, Team } from '../../../common/types'
import { Button, Input, Modal, ModalBody, ModalContent, ModalHeader } from '@heroui/react'
import { TursoClient } from '../../../common/api/turso/config/client'

interface NewBetModalProps {
  isOpen: boolean
  onClose: () => void
  team?: Team
  odd: number
  oddOption: OddOptionEnum
  match_id: number
}

export const NewBetModal: React.FC<NewBetModalProps> = props => {
  const { isOpen, onClose, odd, team, oddOption, match_id } = props

  const { handleSubmit, register, reset } = useForm<NewBetForm>()
  const [errorMessage, setErrorMessage] = React.useState<string | undefined>('')

  const onSuccessCreateBet: SubmitHandler<NewBetForm> = async values => {
    try {
      const moneyAndIdResult = await TursoClient.execute({
        sql: 'SELECT id, money FROM user WHERE token = ?',
        args: [localStorage.getItem('token')],
      })

      const money: number = Number(moneyAndIdResult.rows[0]?.money || 0)

      if (money < values.amount) {
        setErrorMessage('No tienes suficiente dinero')
        return
      }

      const user_id = Number(moneyAndIdResult.rows[0]?.id || -1)

      await TursoClient.execute({
        sql: 'INSERT INTO bet (user_id, match_id, bet_option, bet_amount) VALUES (?, ?, ?, ?);',
        args: [user_id, match_id, oddOption.toString(), values.amount],
      }).then()

      await TursoClient.execute({
        sql: 'UPDATE user SET money = money - ? WHERE token = ?',
        args: [values.amount, localStorage.getItem('token')],
      }).finally(() => {
        window.location.reload()
      })
    } catch (error) {
      setErrorMessage('Ha ocurrido un error')
      return
    }
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={() => {
        onClose()
        reset()
      }}
      placement='center'
      backdrop='blur'
    >
      <ModalContent>
        <ModalHeader className='flex flex-row text-white gap-3 flex-wrap justify-center items-center'>
          {team ? (
            <img src={team?.logo} alt={team?.name} className='w-8 h-8 aspect-square object-contain' />
          ) : (
            <span>⚔️</span>
          )}

          <span>Apostar por {team?.name || 'empate'}</span>
          <span className='text-white/50'>x{odd}</span>
        </ModalHeader>

        <form onSubmit={handleSubmit(onSuccessCreateBet)}>
          <ModalBody>
            <div className='flex flex-col justify-center items-center'>
              <div className='flex flex-row justify-between items-center w-full gap-4 pb-4'>
                <Input
                  {...register('amount', { valueAsNumber: true })}
                  placeholder={'Cantidad'}
                  size='lg'
                  type='number'
                  min={1}
                />
                <Button color='primary' size='md' type='submit'>
                  Aceptar
                </Button>
              </div>

              {errorMessage && <div className='text-red-500 text-sm'>{errorMessage}</div>}
            </div>
          </ModalBody>
        </form>
      </ModalContent>
    </Modal>
  )
}
