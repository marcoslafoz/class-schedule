import React, { useState } from 'react'
import { Input } from '@heroui/react'
import { TursoClient } from '../../../common/api/turso/config/client'
import { DisplayMoney } from '../user/display-money'
import confetti from 'canvas-confetti'

interface BlackjackProps {
  defaultMoney: number | null
}

type Card = {
  value: number
  display: string
}

const suits = ['♠', '♥', '♦', '♣']
const values = [
  { display: 'A', value: 11 },
  { display: '2', value: 2 },
  { display: '3', value: 3 },
  { display: '4', value: 4 },
  { display: '5', value: 5 },
  { display: '6', value: 6 },
  { display: '7', value: 7 },
  { display: '8', value: 8 },
  { display: '9', value: 9 },
  { display: '10', value: 10 },
  { display: 'J', value: 10 },
  { display: 'Q', value: 10 },
  { display: 'K', value: 10 }
]

const createDeck = (): Card[] => {
  const deck: Card[] = []
  for (const s of suits) {
    for (const v of values) {
      deck.push({ value: v.value, display: `${v.display}${s}` })
    }
  }
  return deck.sort(() => Math.random() - 0.5)
}

const calculateTotal = (hand: Card[]) => {
  let total = hand.reduce((acc, card) => acc + card.value, 0)
  let aces = hand.filter(c => c.display.startsWith('A')).length
  while (total > 21 && aces > 0) {
    total -= 10
    aces -= 1
  }
  return total
}

const isBlackjack = (hand: Card[]) => {
  return hand.length === 2 && calculateTotal(hand) === 21
}

// 🎉 Confetti launcher
const launchConfetti = () => {
  confetti({
    particleCount: 120,
    spread: 70,
    origin: { y: 0.6 },
  })
}

const CardUI: React.FC<{ card: Card }> = ({ card }) => {
  const suit = card.display.slice(-1)
  const value = card.display.slice(0, -1)
  const isRed = suit === '♥' || suit === '♦'

  return (
    <div className="w-14 h-20 flex flex-col justify-between p-2 rounded-lg border shadow-md bg-white">
      <span className={`text-sm font-bold ${isRed ? 'text-red-600' : 'text-black'}`}>
        {value}{suit}
      </span>
      <span className={`text-sm font-bold self-end ${isRed ? 'text-red-600' : 'text-black'}`}>
        {value}{suit}
      </span>
    </div>
  )
}

export const Blackjack: React.FC<BlackjackProps> = ({ defaultMoney }) => {
  const [balance, setBalance] = useState(defaultMoney ?? 0)
  const [deck, setDeck] = useState<Card[]>([])
  const [playerHand, setPlayerHand] = useState<Card[]>([])
  const [dealerHand, setDealerHand] = useState<Card[]>([])
  const [gameOver, setGameOver] = useState(false)
  const [message, setMessage] = useState('')
  const [bet, setBet] = useState(50)
  const [gameStarted, setGameStarted] = useState(false)

  const fetchUserMoney = async (): Promise<number> => {
    const userMoneyRes = await TursoClient.execute({
      sql: 'SELECT money FROM user WHERE token = ?',
      args: [localStorage.getItem('token')],
    })
    return Number(userMoneyRes.rows[0]?.money) || 0
  }

  const updateUserMoney = async (amount: number) => {
    await TursoClient.execute({
      sql: 'UPDATE user SET money = money + ? WHERE token = ?',
      args: [amount, localStorage.getItem('token')],
    })
  }

  const updateTotalBet = async (amount: number) => {
    await TursoClient.execute({
      sql: 'UPDATE user SET total_bet = total_bet + ? WHERE token = ?',
      args: [amount, localStorage.getItem('token')],
    })
  }

  const startGame = async () => {
    const userMoney = await fetchUserMoney()
    if (bet <= 0) {
      setMessage('La apuesta debe ser mayor a 0.')
      return
    }
    if (userMoney < bet) {
      setMessage('No tienes suficiente saldo para apostar.')
      return
    }

    const newDeck = createDeck()
    const player = [newDeck.pop()!, newDeck.pop()!]
    const dealer = [newDeck.pop()!, newDeck.pop()!]

    setDeck(newDeck)
    setPlayerHand(player)
    setDealerHand(dealer)
    setGameOver(false)
    setMessage('')
    setGameStarted(true)

    await updateUserMoney(-bet)
    await updateTotalBet(bet)
    setBalance(userMoney - bet)
  }

  const hit = () => {
    if (gameOver) return
    const newDeck = [...deck]
    const card = newDeck.pop()!
    const newHand = [...playerHand, card]
    setPlayerHand(newHand)
    setDeck(newDeck)

    if (calculateTotal(newHand) > 21) {
      setMessage('Te pasaste! Pierdes.')
      setGameOver(true)
    }
  }

  const stand = async () => {
    if (gameOver) return
    const newDeck = [...deck]
    const newDealerHand = [...dealerHand]

    while (calculateTotal(newDealerHand) < 17) {
      newDealerHand.push(newDeck.pop()!)
    }

    setDealerHand(newDealerHand)
    setDeck(newDeck)

    const playerTotal = calculateTotal(playerHand)
    const dealerTotal = calculateTotal(newDealerHand)

    let earnings = 0

    if (playerTotal > 21) {
      setMessage('Te pasaste! Pierdes.')
    } else if (dealerTotal > 21) {
      setMessage('El dealer se pasó. ¡Ganaste!')
      earnings = bet * 2
      launchConfetti()
    } else if (isBlackjack(playerHand) && !isBlackjack(newDealerHand)) {
      earnings = Math.floor(bet * 2.5)
      setMessage('¡Blackjack! Ganaste 1.5x')
      launchConfetti()
    } else if (!isBlackjack(playerHand) && isBlackjack(newDealerHand)) {
      setMessage('El dealer tiene Blackjack. Pierdes.')
    } else if (playerTotal > dealerTotal) {
      earnings = bet * 2
      setMessage('¡Ganaste!')
      launchConfetti()
    } else if (dealerTotal > playerTotal) {
      setMessage('Perdiste.')
    } else {
      earnings = bet
      setMessage('Empate.')
    }

    if (earnings > 0) {
      await updateUserMoney(earnings)
    }

    const newBalance = await fetchUserMoney()
    setBalance(newBalance)

    setGameOver(true)
  }

  const resetGame = () => {
    setPlayerHand([])
    setDealerHand([])
    setMessage('')
    setGameOver(false)
    setGameStarted(false)
  }

  return (
    <div className="flex flex-col items-center justify-center p-6 text-white gap-10">

      <DisplayMoney money={balance} />

      {!gameStarted ? (
        <div className="flex flex-col items-center gap-6">
          <Input
            value={bet.toString()}
            onChange={e => setBet(Number(e.target.value))}
            placeholder="Apuesta"
            className="w-24"
            size="lg"
            type="number"
            min={1}
            max={balance}
          />

          <button
            onClick={startGame}
            className="px-8 py-3 rounded-xl bg-gradient-to-r from-green-500 to-green-700 
                       shadow-lg hover:scale-105 hover:from-green-400 hover:to-green-600 
                       transition-all duration-200 font-semibold"
          >
            🎰 Empezar Juego (Apuesta: ${bet})
          </button>

          {message && <div className="text-red-400">{message}</div>}
        </div>
      ) : (
        <>
          <div className="flex gap-12 mb-6">
            <div>
              <h2 className="font-semibold mb-2">
                Tus cartas ({calculateTotal(playerHand)})
              </h2>
              <div className="flex gap-2">
                {playerHand.map((card, i) => (
                  <CardUI key={i} card={card} />
                ))}
              </div>
            </div>

            <div>
              <h2 className="font-semibold mb-2">
                Dealer ({gameOver ? calculateTotal(dealerHand) : '?'})
              </h2>
              <div className="flex gap-2">
                {dealerHand.map((card, i) => (
                  <div key={i}>
                    {i === 0 || gameOver ? (
                      <CardUI card={card} />
                    ) : (
                      <div className="w-14 h-20 bg-gray-600 rounded-lg shadow-md"></div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {!gameOver ? (
            <div className="flex gap-6 justify-center mt-4">
              <button
                onClick={hit}
                className="px-6 py-3 rounded-xl bg-gradient-to-r from-blue-500 to-blue-700 
                           shadow-lg hover:scale-105 hover:from-blue-400 hover:to-blue-600 
                           transition-all duration-200 font-semibold"
              >
                🃏 Pedir
              </button>

              <button
                onClick={stand}
                className="px-6 py-3 rounded-xl bg-gradient-to-r from-yellow-500 to-orange-600 
                           shadow-lg hover:scale-105 hover:from-yellow-400 hover:to-orange-500 
                           transition-all duration-200 font-semibold"
              >
                ✋ Plantarse
              </button>
            </div>
          ) : (
            <div className="flex justify-center mt-6">
              <button
                onClick={resetGame}
                className="px-8 py-3 rounded-xl bg-gradient-to-r from-purple-600 to-purple-800 
                           shadow-lg hover:scale-105 hover:from-purple-500 hover:to-purple-700 
                           transition-all duration-200 font-semibold"
              >
                🔄 Jugar otra vez
              </button>
            </div>
          )}

          <div className="mt-4 text-xl font-semibold">{message}</div>
        </>
      )}
    </div>
  )
}
