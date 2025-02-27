import React from 'react'
import { TursoClient } from '../../../common/api/turso/config/client'
import { Bet, Match } from '../../../common/types'
import { MatchCard } from './match-card'
import './sports.css'

interface SportsProps {
  defaultMoney: number | null
}

export const Sports: React.FC<SportsProps> = props => {
  const { defaultMoney } = props

  const [matchs, setMatchs] = React.useState<Match[]>([])
  const [loading, setLoading] = React.useState<boolean>(true)

  const fetchTopPlayers = async () => {
    setLoading(true)
    try {
      const BetsResult = await TursoClient.execute(
        'SELECT bet.id, bet.match_id, bet.bet_amount, bet.bet_option, user.username, user.avatar_url FROM bet JOIN user ON bet.user_id = user.id'
      )

      const betsByMatch: Record<string, Bet[]> = BetsResult.rows.reduce((acc: any, row: any) => {
        const bet = {
          amount: row.bet_amount,
          bet_option: row.bet_option,
          user: {
            username: row.username,
            avatar_url: row.avatar_url,
          },
        }

        if (!acc[row.match_id]) {
          acc[row.match_id] = []
        }
        acc[row.match_id].push(bet)

        return acc
      }, {})

      const MatchsResult = await TursoClient.execute(
        'SELECT id, team_1_name, team_2_name, team_1_logo_url, team_2_logo_url, odd_1, odd_2, odd_x, date FROM match ORDER BY date ASC'
      )

      // Formatear los partidos con sus apuestas
      const formattedMatchs: Match[] = MatchsResult.rows.map((row: any) => ({
        id: row.id,
        date: row.date,
        team_1: {
          name: row.team_1_name,
          logo: row.team_1_logo_url,
        },
        team_2: {
          name: row.team_2_name,
          logo: row.team_2_logo_url,
        },
        odds: {
          odd_1: row.odd_1,
          odd_x: row.odd_x,
          odd_2: row.odd_2,
        },
        bets: betsByMatch[row.id] || [], // Agregar las apuestas del partido o un array vacío
      }))

      setMatchs(formattedMatchs)
    } catch (error) {
      console.error('Error fetching matchs:', error)
    } finally {
      setLoading(false)
    }
  }

  React.useEffect(() => {
    fetchTopPlayers()
  }, [])

  if (loading) return <></>

  return (
    <div className='flex flex-col items-center justify-center w-full '>
      <div className='flex flex-row flex-nowrap items-center justify-center text-center text-white/50 text-2xl studentspace-medium py-5 '>
        {defaultMoney} 💸
      </div>

      <div className='flex flex-col items-center  w-full  overflow-y-scroll overflow-x-hidden max-h-[40rem] matchs-scroll '>
        {matchs.map((match, index) => (
          <MatchCard key={index} match={match} />
        ))}
      </div>
    </div>
  )
}
