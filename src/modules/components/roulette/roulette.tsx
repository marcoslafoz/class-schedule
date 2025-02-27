import { Alert, Button, Input, Tooltip } from '@heroui/react'
import React from 'react'
import { Wheel } from 'react-custom-roulette'
import { rouletteOptions } from '../../../common/constants/roulette-options'
import { GenerateRoulettePrize } from '../../../common/utils/roulette-prize'
import { ROULETTE_PRIZE_OPTIONS_ENUM, RouletteForm, RouletteOption } from '../../../common/types'
import { SubmitHandler, useForm } from 'react-hook-form'
import { DeleteIcon } from '@heroui/shared-icons'
import clsx from 'clsx'
import { TursoClient } from '../../../common/api/turso/config/client'
import confetti from 'canvas-confetti'
import { DisplayMoney } from '../user/display-money'

interface RouletteProps {
  defaultMoney: number | null
}

export const Roulette: React.FC<RouletteProps> = props => {
  const [mustSpin, setMustSpin] = React.useState(false)
  const [, setRouletteResult] = React.useState<RouletteOption | null>(null)
  const [prizeNumber, setPrizeNumber] = React.useState<number>(GenerateRoulettePrize(rouletteOptions.length))
  const [spinEarnings, setSpinEarnings] = React.useState<number | null>(null)
  const [noMoneyAlert, setNoMoneyAlert] = React.useState<boolean>(false)
  const [money, setMoney] = React.useState<number | null>(props.defaultMoney || 0)

  const { handleSubmit, register, reset } = useForm<RouletteForm>()

  const onStopSpinning = async () => {
    setMustSpin(false)
    reset()

    if (spinEarnings != null && spinEarnings > 0) confetti()

    const updatedMoney = await TursoClient.execute({
      sql: 'SELECT money FROM user WHERE token = ?',
      args: [localStorage.getItem('token')],
    })

    setMoney(Number(updatedMoney.rows[0]?.money) || 0)
  }

  const calculateSpinCost = React.useCallback((values: RouletteForm) => {
    return Object.values(values).reduce((acc, bet) => acc + (Number(bet) || 0), 0)
  }, [])

  const calculateSpinBalance = React.useCallback((values: RouletteForm, prize: RouletteOption) => {
    const totalBetCost = Object.values(values).reduce((acc, bet) => acc + (Number(bet) || 0), 0)
    let win = 0

    switch (prize.prize) {
      case ROULETTE_PRIZE_OPTIONS_ENUM.X1:
        win = (values.x1 || 0) * ROULETTE_PRIZE_OPTIONS_ENUM.X1
        break
      case ROULETTE_PRIZE_OPTIONS_ENUM.X3:
        win = (values.x3 || 0) * ROULETTE_PRIZE_OPTIONS_ENUM.X3
        break
      case ROULETTE_PRIZE_OPTIONS_ENUM.X5:
        win = (values.x5 || 0) * ROULETTE_PRIZE_OPTIONS_ENUM.X5
        break
      case ROULETTE_PRIZE_OPTIONS_ENUM.X10:
        win = (values.x10 || 0) * ROULETTE_PRIZE_OPTIONS_ENUM.X10
        break
      case ROULETTE_PRIZE_OPTIONS_ENUM.X20:
        win = (values.x20 || 0) * ROULETTE_PRIZE_OPTIONS_ENUM.X20
        break
      default:
        win = 0
    }

    return win - totalBetCost
  }, [])

  const calculateSpinEarnings = React.useCallback((values: RouletteForm, prize: RouletteOption) => {
    let win = 0

    switch (prize.prize) {
      case ROULETTE_PRIZE_OPTIONS_ENUM.X1:
        win = (values.x1 || 0) * ROULETTE_PRIZE_OPTIONS_ENUM.X1
        break
      case ROULETTE_PRIZE_OPTIONS_ENUM.X3:
        win = (values.x3 || 0) * ROULETTE_PRIZE_OPTIONS_ENUM.X3
        break
      case ROULETTE_PRIZE_OPTIONS_ENUM.X5:
        win = (values.x5 || 0) * ROULETTE_PRIZE_OPTIONS_ENUM.X5
        break
      case ROULETTE_PRIZE_OPTIONS_ENUM.X10:
        win = (values.x10 || 0) * ROULETTE_PRIZE_OPTIONS_ENUM.X10
        break
      case ROULETTE_PRIZE_OPTIONS_ENUM.X20:
        win = (values.x20 || 0) * ROULETTE_PRIZE_OPTIONS_ENUM.X20
        break
      default:
        win = 0
    }

    return win
  }, [])

  // xxxxxxxxxxxxxxxxxxxxxxxxx
  // ESTO SE LANZA CON EL SPIN
  // xxxxxxxxxxxxxxxxxxxxxxxxx
  const onSuccessSpin: SubmitHandler<RouletteForm> = async values => {
    const newPrizeNumber = GenerateRoulettePrize(rouletteOptions.length)
    const newRouletteResult = rouletteOptions[newPrizeNumber]

    const userMoneyResult = await TursoClient.execute({
      sql: 'SELECT money FROM user WHERE token = ?',
      args: [localStorage.getItem('token')],
    })

    const userMoney = userMoneyResult.rows[0]?.money || 0

    setPrizeNumber(newPrizeNumber)
    setRouletteResult(newRouletteResult)
    setSpinEarnings(null)

    const balance = calculateSpinBalance(values, newRouletteResult)
    const newSpinEarnings = calculateSpinEarnings(values, newRouletteResult)
    const newSpinCost = calculateSpinCost(values)

    if (userMoney >= newSpinCost) {
      setNoMoneyAlert(false)
      await TursoClient.execute({
        sql: 'UPDATE user SET money = money + ? WHERE token = ?',
        args: [balance, localStorage.getItem('token')],
      }).then(() => {
        setMustSpin(true)
        setSpinEarnings(newSpinEarnings > 0 ? newSpinEarnings : -newSpinCost)
      })

      await TursoClient.execute({
        sql: 'UPDATE user SET total_bet = total_bet + ? WHERE token = ?',
        args: [newSpinCost, localStorage.getItem('token')],
      })
    } else {
      setNoMoneyAlert(true)
    }
  }

  const handleReset = () => {
    reset()
  }

  return (
    <>
      <Alert
        color={'danger'}
        isVisible={noMoneyAlert}
        title={'No tienes suficiente dinero'}
        className='fixed w-auto z-50 top-16 opacity-80'
      />
      <div className='flex flex-col justify-center items-center gap-6'>
        <div className='flex flex-col gap-2 h-14 w-auto justify-center items-center text-white/70'>
          {spinEarnings != null && !mustSpin && spinEarnings != 0 && (
            <div className='text-4xl font-bold'>
              {spinEarnings > 0 ? <>+{spinEarnings} 💸 🤑</> : <>{spinEarnings} 💸 🥵</>}
            </div>
          )}
        </div>

        <Wheel
          mustStartSpinning={mustSpin}
          prizeNumber={prizeNumber}
          radiusLineColor='transparent'
          radiusLineWidth={1}
          backgroundColors={['#000']}
          textColors={['#fff']}
          outerBorderWidth={0}
          innerBorderWidth={0}
          innerBorderColor='#000'
          data={rouletteOptions}
          onStopSpinning={onStopSpinning}
        />

        <DisplayMoney money={money} />

        <form onSubmit={handleSubmit(onSuccessSpin)}>
          <div className='flex flex-row  items-center px-5 py-3 rounded-3xl gap-4 border border-black/40 bg-black/30 lg:md:max-w-max max-w-96 '>
            <Tooltip content='Eliminar apuestas' color='danger' closeDelay={0} showArrow>
              <button
                className='text-lg text-danger cursor-pointer active:opacity-80 opacity-50 px-1'
                disabled={mustSpin}
                type='button'
                onClick={handleReset}
              >
                <DeleteIcon />
              </button>
            </Tooltip>

            <div className='justify-center items-center flex flex-row flex-wrap gap-4'>
              {(['x3', 'x5', 'x10', 'x20'] as Array<keyof RouletteForm>).map(bet => (
                <Input
                  key={bet}
                  {...register(bet, { valueAsNumber: true })}
                  placeholder={bet}
                  className='w-20'
                  size='lg'
                  type='number'
                  min={0}
                />
              ))}
            </div>

            <div className='h-10'>
              <Button
                className={clsx('opacity-50 bg-transparent', mustSpin && 'opacity-20')}
                type='submit'
                isDisabled={mustSpin}
                isIconOnly
              >
                <img src='/assets/icons/play.svg' alt='Spin' className='object-contain w-6 invert' />
              </Button>
            </div>
          </div>
        </form>
      </div>
    </>
  )
}
