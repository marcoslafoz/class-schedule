import { Alert, Button, Input, Tooltip } from '@heroui/react'
import React, { useState } from 'react'
import { GeneratePrize } from '../../../common/utils/roulette-prize'
import { SubmitHandler, useForm } from 'react-hook-form'
import { DeleteIcon } from '@heroui/shared-icons'
import clsx from 'clsx'
import { TursoClient } from '../../../common/api/turso/config/client'
import confetti from 'canvas-confetti'
import { DisplayMoney } from '../user/display-money'
import { Coin } from './coin'
import { COINFLIP_OPTIONS_ENUM, CoinFlipForm } from '../../../common/types/coinflip.vm'

interface CoinFlipProps {
  defaultMoney: number | null
}

export const CoinFlip: React.FC<CoinFlipProps> = ({ defaultMoney }) => {
  const [currentPrize, setCurrentPrize] = useState<number | undefined>()
  const [earnings, setEarnings] = useState<number | null>(null)
  const [money, setMoney] = useState<number>(defaultMoney || 0)
  const [isPlaying, setIsPlaying] = useState(false)
  const [showNoMoneyAlert, setShowNoMoneyAlert] = useState(false)

  const { handleSubmit, register, reset } = useForm<CoinFlipForm>()

  const calculateSpinCost = React.useCallback((values: CoinFlipForm) => {
    return Object.values(values).reduce((acc, bet) => acc + (Number(bet) || 0), 0)
  }, [])
  const calculateSpinEarnings = React.useCallback((values: CoinFlipForm, prize: number) => {
    let win = 0

    switch (prize) {
      case COINFLIP_OPTIONS_ENUM.CARA:
        win = (values.cara || 0) * 2
        break
      case COINFLIP_OPTIONS_ENUM.CRUZ:
        win = (values.cruz || 0) * 2
        break
      default:
        win = 0
    }

    return win
  }, [])

  const calculateSpinBalance = React.useCallback((values: CoinFlipForm, prize: number) => {
    const totalBetCost = Object.values(values).reduce((acc, bet) => acc + (Number(bet) || 0), 0)
    let win = 0

    switch (prize) {
      case COINFLIP_OPTIONS_ENUM.CARA:
        win = (values.cara || 0) * 2
        break
      case COINFLIP_OPTIONS_ENUM.CRUZ:
        win = (values.cruz || 0) * 2
        break
      default:
        win = 0
    }

    return win - totalBetCost
  }, [])

  // xxxxxxxxxxxxxxxxxxxxxxxxx
  // ESTO SE LANZA CON EL PLAY
  // xxxxxxxxxxxxxxxxxxxxxxxxx

  const handleSpin: SubmitHandler<CoinFlipForm> = async values => {
    if (isPlaying) return

    const newPrize = GeneratePrize(2)
    setCurrentPrize(newPrize)

    const userMoneyRes = await TursoClient.execute({
      sql: 'SELECT money FROM user WHERE token = ?',
      args: [localStorage.getItem('token')],
    })
    const userMoney = Number(userMoneyRes.rows[0]?.money) || 0

    const totalBet = calculateSpinCost(values)
    const balance = calculateSpinBalance(values, newPrize)
    const newEarnings = calculateSpinEarnings(values, newPrize)

    if (userMoney >= totalBet) {
      setShowNoMoneyAlert(false)
      await TursoClient.execute({
        sql: 'UPDATE user SET money = money + ? WHERE token = ?',
        args: [balance, localStorage.getItem('token')],
      }).then(() => {
        setIsPlaying(true)
      })
      setEarnings(newEarnings > 0 ? newEarnings : -totalBet)
    } else {
      setShowNoMoneyAlert(true)
    }
  }

  const stopAnimation = async () => {
    setIsPlaying(false)
    reset()

    const updatedMoney = await TursoClient.execute({
      sql: 'SELECT money FROM user WHERE token = ?',
      args: [localStorage.getItem('token')],
    })
    setMoney(Number(updatedMoney.rows[0]?.money) || 0)
    if (earnings && earnings > 0) confetti()
  }

  return (
    <>
      <Alert
        color='danger'
        isVisible={showNoMoneyAlert}
        title='No tienes suficiente dinero'
        className='fixed w-auto z-50 top-16 opacity-80'
      />
      <div className='flex flex-col justify-center items-center gap-6'>
        <div className='text-4xl font-bold'>
          {isPlaying == false && earnings !== null && (earnings > 0 ? `+${earnings} 💸 🤑` : `${earnings} 💸 🥵`)}
        </div>

        <Coin prize={currentPrize} isPlaying={isPlaying} stopAnimation={stopAnimation} />

        <DisplayMoney money={money} />

        <form onSubmit={handleSubmit(handleSpin)}>
          <div className='flex flex-row items-center px-5 py-3 rounded-3xl gap-4 border border-black/40 bg-black/30 max-w-96'>
            <Tooltip content='Eliminar apuestas' color='danger'>
              <button
                className='text-danger cursor-pointer opacity-50 px-1'
                disabled={isPlaying}
                type='button'
                onClick={() => reset()}
              >
                <DeleteIcon />
              </button>
            </Tooltip>
            <div className='flex flex-row gap-4'>
              <Input {...register('cara')} placeholder='0' className='w-20' size='lg' type='number' min={0} />
              <Input {...register('cruz')} placeholder='1' className='w-20' size='lg' type='number' min={0} />
            </div>
            <Button
              className={clsx('opacity-50 bg-transparent', isPlaying && 'opacity-20')}
              type='submit'
              isDisabled={isPlaying}
              isIconOnly
            >
              <img src='/assets/icons/play.svg' alt='Spin' className='object-contain w-6 invert' />
            </Button>
          </div>
        </form>
      </div>
    </>
  )
}
