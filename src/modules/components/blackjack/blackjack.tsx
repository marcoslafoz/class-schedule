import React, { useState } from 'react'
import { Input } from '@heroui/react'
import { TursoClient } from '../../../common/api/turso/config/client'
import { DisplayMoney } from '../user/display-money'

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

export const Blackjack: React.FC<BlackjackProps> = ({ defaultMoney }) => {
  const [balance, setBalance] = useState(defaultMoney ?? 0)
  const [deck, setDeck] = useState<Card[]>([])
  const [playerHand, setPlayerHand] = useState<Card[]>([])
  const [dealerHand, setDealerHand] = useState<Card[]>([])
  const [gameOver, setGameOver] = useState(false)
  const [message, setMessage] = useState('')
  const [bet, setBet] = useState(10)
  const [gameStarted, setGameStarted] = useState(false)

  // 🔹 Obtener saldo real desde la DB
  const fetchUserMoney = async (): Promise<number> => {
    const userMoneyRes = await TursoClient.execute({
      sql: 'SELECT money FROM user WHERE token = ?',
      args: [localStorage.getItem('token')],
    })
    return Number(userMoneyRes.rows[0]?.money) || 0
  }

  // 🔹 Actualizar saldo en DB
  const updateUserMoney = async (amount: number) => {
    await TursoClient.execute({
      sql: 'UPDATE user SET money = money + ? WHERE token = ?',
      args: [amount, localStorage.getItem('token')],
    })
  }

  // 🔹 Guardar total apostado
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

    // 🔹 Restar apuesta al saldo en DB
    await updateUserMoney(-bet)
    await updateTotalBet(bet)
    setBalance(userMoney - bet)

    console.log('Saldo al iniciar:', userMoney - bet)
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

    // Dealer pide hasta 17
    while (calculateTotal(newDealerHand) < 17) {
      newDealerHand.push(newDeck.pop()!)
    }

    setDealerHand(newDealerHand)
    setDeck(newDeck)

    const playerTotal = calculateTotal(playerHand)
    const dealerTotal = calculateTotal(newDealerHand)

    let outcome: 'player' | 'dealer' | 'draw'
    let earnings = 0

    if (playerTotal > 21) {
      outcome = 'dealer'
    } else if (dealerTotal > 21) {
      outcome = 'player'
    } else if (playerTotal > dealerTotal) {
      outcome = 'player'
    } else if (dealerTotal > playerTotal) {
      outcome = 'dealer'
    } else {
      outcome = 'draw'
    }

    if (outcome === 'player') {
      setMessage('¡Ganaste!')
      earnings = bet * 2
    } else if (outcome === 'draw') {
      setMessage('Empate.')
      earnings = bet
    } else {
      setMessage('Perdiste.')
    }

    if (earnings > 0) {
      await updateUserMoney(earnings)
    }

    const newBalance = await fetchUserMoney()
    setBalance(newBalance)

    setGameOver(true)
    console.log('Saldo al terminar:', newBalance)
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
          {/* Input de HeroUI para personalizar apuesta */}
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
            className="px-4 py-2 rounded-2xl bg-green-600 hover:bg-green-700 transition"
          >
            Empezar Juego (Apuesta: ${bet})
          </button>

          {message && <div className="text-red-400">{message}</div>}
        </div>
      ) : (
        <>
          <div className="flex gap-6 mb-6">
            <div>
              <h2 className="font-semibold mb-2">
                Tus cartas ({calculateTotal(playerHand)})
              </h2>
              <div className="flex gap-2">
                {playerHand.map((card, i) => (
                  <div key={i} className="px-2 py-1 bg-gray-700 rounded-lg shadow">
                    {card.display}
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h2 className="font-semibold mb-2">
                Dealer ({gameOver ? calculateTotal(dealerHand) : '?'})
              </h2>
              <div className="flex gap-2">
                {dealerHand.map((card, i) => (
                  <div
                    key={i}
                    className={`px-2 py-1 bg-gray-700 rounded-lg shadow ${i === 0 || gameOver ? '' : 'blur-sm'}`}
                  >
                    {card.display}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {!gameOver ? (
            <div className="flex gap-4">
              <button
                onClick={hit}
                className="px-4 py-2 rounded-2xl bg-blue-600 hover:bg-blue-700 transition"
              >
                Pedir
              </button>
              <button
                onClick={stand}
                className="px-4 py-2 rounded-2xl bg-yellow-600 hover:bg-yellow-700 transition"
              >
                Plantarse
              </button>
            </div>
          ) : (
            <button
              onClick={resetGame}
              className="px-4 py-2 rounded-2xl bg-purple-600 hover:bg-purple-700 transition"
            >
              Jugar otra vez
            </button>
          )}

          <div className="mt-4 text-xl font-semibold">{message}</div>
        </>
      )}
    </div>
  )
}
