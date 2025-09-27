import React, { useState, useEffect, useRef, useCallback } from 'react'
import { Button, Input, Modal, ModalBody, ModalContent, ModalHeader, ModalFooter } from '@heroui/react'
import { TursoClient } from '../../../common/api/turso/config/client'
import { DisplayMoney } from '../user/display-money'
import confetti from 'canvas-confetti'
import clsx from 'clsx'
import './slot.css'

interface SlotProps {
  defaultMoney: number | null
}

const weightedSymbols = [
  '🍒', '🍒', '🍒', '🍒', '🍒', '🍒', '🍒', '🍒',
  '🍋', '🍋', '🍋', '🍋', '🍋', '🍋',
  '🍇', '🍇', '🍇', '🍇',
  '🔔', '🔔', '🔔',
  '⭐', '⭐',
  '💎'
]

const jackpotMultipliers: Record<string, number> = {
  '🍒': 5,
  '🍋': 8,
  '🍇': 12,
  '🔔': 20,
  '⭐': 40,
  '💎': 80
}

const jackpotConfetti = () => {
  confetti({ particleCount: 200, spread: 200, origin: { y: 0.6 } })
}

export const Slot: React.FC<SlotProps> = ({ defaultMoney }) => {
  const [balance, setBalance] = useState(defaultMoney ?? 0)
  const [bet, setBet] = useState(10)
  const [reels, setReels] = useState<string[]>(['❔', '❔', '❔'])
  const [message, setMessage] = useState('')
  const [spinning, setSpinning] = useState(false)
  const [autoplay, setAutoplay] = useState(false)
  const [showModal, setShowModal] = useState(false)
  const autoplayRef = useRef<NodeJS.Timeout | null>(null)

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

  const spin = useCallback(async () => {
    if (spinning) return
    setSpinning(true)
    setMessage('🎰 Girando...')
    try {
      const userMoney = await fetchUserMoney()
      if (bet <= 0) {
        setMessage('⚠️ La apuesta debe ser mayor a 0.')
        setSpinning(false)
        return
      }
      if (userMoney < bet) {
        setMessage('💸 No tienes suficiente saldo.')
        setAutoplay(false)
        setSpinning(false)
        return
      }
      await updateUserMoney(-bet)
      await updateTotalBet(bet)
      const spinDelays = [500, 800, 1100]
      const result: string[] = []
      await new Promise<void>((resolve) => {
        let completedReels = 0
        spinDelays.forEach((delay, i) => {
          setTimeout(() => {
            const symbol = weightedSymbols[Math.floor(Math.random() * weightedSymbols.length)]
            result[i] = symbol
            setReels(prev => {
              const copy = [...prev]
              copy[i] = symbol
              return copy
            })
            completedReels++
            if (completedReels === 3) resolve()
          }, delay)
        })
      })
      await checkResult(result)
    } catch (error) {
      console.error('Error in spin:', error)
      setMessage('❌ Error en la tirada. Intenta de nuevo.')
    } finally {
      setSpinning(false)
    }
  }, [bet, spinning])

  const checkResult = async (result: string[]) => {
    let winnings = 0
    if (result[0] === result[1] && result[1] === result[2]) {
      const symbol = result[0]
      winnings = bet * (jackpotMultipliers[symbol] || 5)
      setMessage(`🎉 JACKPOT! ${result.join(' ')} Ganaste x${jackpotMultipliers[symbol]}`)
      jackpotConfetti()
    } else if (result[0] === result[1] || result[1] === result[2] || result[0] === result[2]) {
      winnings = bet
      setMessage('✨ Dos iguales! Recuperaste tu apuesta.')
    } else {
      setMessage('😢 Perdiste. Intenta de nuevo.')
    }
    if (winnings > 0) {
      await updateUserMoney(winnings)
    }
    const newBalance = await fetchUserMoney()
    setBalance(newBalance)
  }

  const handleBetChange = (value: string) => {
    const numValue = Number(value)
    if (isNaN(numValue) || numValue < 0) {
      return
    }
    const clampedValue = Math.min(numValue, balance)
    setBet(clampedValue)
  }

  useEffect(() => {
    if (autoplay && !spinning) {
      autoplayRef.current = setInterval(() => {
        spin()
      }, 2000)
    } else if (autoplayRef.current) {
      clearInterval(autoplayRef.current)
      autoplayRef.current = null
    }
    return () => {
      if (autoplayRef.current) {
        clearInterval(autoplayRef.current)
        autoplayRef.current = null
      }
    }
  }, [autoplay, spinning, spin])

  useEffect(() => {
    return () => {
      if (autoplayRef.current) {
        clearInterval(autoplayRef.current)
      }
    }
  }, [])

  return (
    <div className='flex flex-col items-center justify-center text-white'>
      <span className='py-4'>
        <DisplayMoney money={balance} />
      </span>
      <div className='flex flex-col items-center gap-4'>
        <div className='flex gap-3 text-5xl bg-black/40 rounded-xl p-4 shadow-lg'>
          {reels.map((symbol, i) => (
            <span
              key={i}
              className={clsx(
                'w-16 h-16 flex items-center justify-center rounded-lg transition-all duration-300',
                spinning && 'animate-[spin-reel_0.4s_linear_infinite]'
              )}
              style={{ animationDelay: `${i * 0.15}s` }}
            >
              {symbol}
            </span>
          ))}
        </div>
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
            isDisabled={spinning || autoplay}
          />
          <Button
            className={clsx('opacity-90 bg-gradient-to-r from-green-500 to-green-700')}
            onPress={spin}
            isDisabled={spinning || bet <= 0 || bet > balance}
          >
            🎰 Girar
          </Button>
          <Button
            className={clsx(
              autoplay ? 'bg-gradient-to-r from-red-500 to-red-700' : 'bg-gradient-to-r from-blue-500 to-blue-700'
            )}
            onPress={() => setAutoplay(!autoplay)}
            isDisabled={spinning}
          >
            {autoplay ? '⏹️ Parar' : '▶️ Auto'}
          </Button>
          <Button
            className='bg-gradient-to-r from-purple-500 to-purple-700 '
            onPress={() => setShowModal(true)}
            isIconOnly
            isDisabled={spinning}
          >
            🏆
          </Button>
        </div>
        {message && <div className='text-lg font-semibold mt-2'>{message}</div>}
      </div>
      <Modal isOpen={showModal} onOpenChange={setShowModal} className='text-white/80'>
        <ModalContent>
          <ModalHeader className="text-xl font-bold">Tabla de premios</ModalHeader>
          <ModalBody>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span>Dos iguales</span>
                <span>x1</span>
              </div>
              {Object.entries(jackpotMultipliers).map(([symbol, mult]) => (
                <div key={symbol} className="flex justify-between">
                  <span>{symbol} {symbol} {symbol}</span>
                  <span>x{mult}</span>
                </div>
              ))}
            </div>
          </ModalBody>
          <ModalFooter />
        </ModalContent>
      </Modal>
    </div>
  )
}
