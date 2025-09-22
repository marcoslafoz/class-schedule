import React, { useState, useCallback } from 'react'
import { Button, Input } from '@heroui/react'
import { TursoClient } from '../../../common/api/turso/config/client'
import { DisplayMoney } from '../user/display-money'
import confetti from 'canvas-confetti'
import clsx from 'clsx'

interface ScratchAndWinProps {
  defaultMoney: number | null
}

const possibleNumbers = Array.from({ length: 15 }, (_, i) => i + 1)
const multipliers = [1, 1, 1, 1, 1, 1, 1.5, 2, 2, 3, 5, 10]

const jackpotConfetti = () => {
  confetti({ particleCount: 200, spread: 200, origin: { y: 0.6 } })
}

export const ScratchAndWin: React.FC<ScratchAndWinProps> = ({ defaultMoney }) => {
  const [balance, setBalance] = useState(defaultMoney ?? 0)
  const [bet, setBet] = useState(10)
  const [winningNumbers, setWinningNumbers] = useState<number[]>([])
  const [scratchNumbers, setScratchNumbers] = useState<{ num: number; multiplier: number; revealed: boolean }[]>([])
  const [playing, setPlaying] = useState(false)
  const [message, setMessage] = useState('')
  const [winnings, setWinnings] = useState(0)

  const fetchUserMoney = async (): Promise<number> => {
    try {
      const userMoneyRes = await TursoClient.execute({
        sql: 'SELECT money FROM user WHERE token = ?',
        args: [localStorage.getItem('token')],
      })
      return Number(userMoneyRes.rows[0]?.money) || 0
    } catch (error) {
      console.error('Error fetching user money:', error)
      throw error
    }
  }

  const updateUserMoney = async (amount: number) => {
    try {
      await TursoClient.execute({
        sql: 'UPDATE user SET money = money + ? WHERE token = ?',
        args: [amount, localStorage.getItem('token')],
      })
    } catch (error) {
      console.error('Error updating user money:', error)
      throw error
    }
  }

  const updateTotalBet = async (amount: number) => {
    try {
      await TursoClient.execute({
        sql: 'UPDATE user SET total_bet = total_bet + ? WHERE token = ?',
        args: [amount, localStorage.getItem('token')],
      })
    } catch (error) {
      console.error('Error updating total bet:', error)
      throw error
    }
  }

  const getRandomNumber = () => possibleNumbers[Math.floor(Math.random() * possibleNumbers.length)]
  const getRandomMultiplier = () => multipliers[Math.floor(Math.random() * multipliers.length)]

  const startGame = useCallback(async () => {
    if (playing) return
    setPlaying(true)
    setMessage('')
    setWinnings(0)

    try {
      const userMoney = await fetchUserMoney()
      setBalance(userMoney)

      if (bet <= 0) {
        setMessage('⚠️ La apuesta debe ser mayor a 0.')
        setPlaying(false)
        return
      }
      if (userMoney < bet) {
        setMessage('💸 No tienes suficiente saldo.')
        setPlaying(false)
        return
      }

      await updateUserMoney(-bet)
      await updateTotalBet(bet)

      const winners = Array.from({ length: 3 }, () => getRandomNumber())
      setWinningNumbers(winners)

      const scratch = Array.from({ length: 9 }, () => ({
        num: getRandomNumber(),
        multiplier: getRandomMultiplier(),
        revealed: false,
      }))

      let matchCount = 0
      scratch.forEach(s => {
        if (winners.includes(s.num)) matchCount++
      })

      if (matchCount > 2) {
        for (let i = 0; i < scratch.length && matchCount > 2; i++) {
          if (winners.includes(scratch[i].num) && Math.random() < 0.6) {
            scratch[i].num = possibleNumbers.find(n => !winners.includes(n)) || possibleNumbers[0]
            matchCount--
          }
        }
      }

      if (matchCount === 0 && Math.random() < 0.4) {
        const randomIndex = Math.floor(Math.random() * scratch.length)
        scratch[randomIndex].num = winners[Math.floor(Math.random() * winners.length)]
        scratch[randomIndex].multiplier = Math.random() < 0.7 ? 1 : scratch[randomIndex].multiplier
      }
      setScratchNumbers(scratch)

      const newBalance = await fetchUserMoney()
      setBalance(newBalance)
    } catch (error) {
      console.error(error)
      setMessage('❌ Error al iniciar la partida.')
      setPlaying(false)
    }
  }, [bet, playing])

  const revealScratch = useCallback(async (index: number) => {
    if (!playing) return
    if (scratchNumbers[index]?.revealed) return

    const updated = [...scratchNumbers]
    updated[index].revealed = true
    setScratchNumbers(updated)

    if (winningNumbers.includes(updated[index].num)) {
      const win = Math.floor(bet * updated[index].multiplier)
      setWinnings(prev => prev + win)
      setMessage(`🎉 ¡Número ganador ${updated[index].num}! +${win}`)
      if (updated[index].multiplier >= 5) {
        jackpotConfetti()
      }
    }

    if (updated.every(c => c.revealed)) {
      setTimeout(async () => {
        await finishGame()
      }, 500)
    }
  }, [playing, scratchNumbers, winningNumbers, bet])

  const finishGame = useCallback(async () => {
    if (winnings > 0) {
      await updateUserMoney(winnings)
    }

    const newBalance = await fetchUserMoney()
    setBalance(newBalance)

    if (winnings > 0) {
      setMessage(`Ganaste ${winnings} 💸`)
    } else {
      setMessage('😢 No hubo suerte llorón..')
    }

    setTimeout(() => {
      setPlaying(false)
      setWinningNumbers([])
      setScratchNumbers([])
      setWinnings(0)
    }, 2000)
  }, [winnings])

  const handleBetChange = (value: string) => {
    const numValue = Number(value)
    if (isNaN(numValue) || numValue < 0) return
    const clampedValue = Math.min(numValue, balance)
    setBet(clampedValue)
  }

  return (
    <div className='flex flex-col items-center justify-center text-white'>
      <span className='py-4'>
        <DisplayMoney money={balance} />
      </span>

      <div className='flex flex-col items-center gap-4'>
        {winningNumbers.length > 0 && (
          <div className='flex flex-row justify-center items-center gap-3 text-xl bg-black/20 rounded-xl p-4 shadow-lg'>
            <p className='font-bold'>Números ganadores:</p>
            {winningNumbers.map((n, i) => (
              <span key={i} className='px-3 py-1 bg-yellow-600 rounded-lg'>
                {n}
              </span>
            ))}
          </div>
        )}

        {scratchNumbers.length > 0 && (
          <div className='grid grid-cols-3 gap-3'>
            {scratchNumbers.map((c, i) => (
              <div
                key={i}
                role="button"
                tabIndex={0}
                onClick={() => revealScratch(i)}
                onKeyDown={e => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault()
                    revealScratch(i)
                  }
                }}
                className={clsx(
                  'w-20 h-20 flex items-center justify-center rounded-lg cursor-pointer text-xl font-bold transition-all',
                  c.revealed ? 'bg-gray-800 text-white' : 'bg-gray-500 hover:bg-gray-400',
                  !playing && 'pointer-events-none'
                )}
                aria-pressed={c.revealed}
              >
                {c.revealed ? (
                  <div className='flex flex-col items-center'>
                    <span>{c.num}</span>
                    {c.multiplier > 1 && <span className='text-sm text-green-400'>x{c.multiplier}</span>}
                  </div>
                ) : (
                  '⬜'
                )}
              </div>
            ))}
          </div>
        )}

        <div className='flex flex-row items-center gap-2'>
          <Input
            value={bet.toString()}
            onChange={e => handleBetChange(e.target.value)}
            placeholder='Apuesta'
            className='w-24'
            size='lg'
            type='number'
            min={1}
            max={balance}
            isDisabled={playing}
          />

          <Button
            className={clsx('bg-gradient-to-r from-green-500 to-green-700')}
            onPress={startGame}
            isDisabled={playing || bet <= 0 || bet > balance}
          >
            🎟️ Rascar
          </Button>
        </div>

        {message && <div className='text-lg font-semibold mt-2'>{message}</div>}
      </div>
    </div>
  )
}