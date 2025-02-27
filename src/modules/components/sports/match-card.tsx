import React from 'react'
import { Match, OddOptionEnum } from '../../../common/types'
import { formatDate } from '../../../common/utils/date'
import './sports.css'
import { TeamCard } from './team-card'
import { UserBetCard } from './user-bet-card'

interface MatchCardProps {
  match: Match
}

export const MatchCard: React.FC<MatchCardProps> = props => {
  const { match } = props

  return (
    <div className='flex flex-col justify-center items-center w-full max-w-[50rem] h-auto p-4 '>
      <div className='flex flex-row justify-center items-center text-center bg-white/5 rounded-t-2xl px-4 py-1 text-sm text-white/30'>
        {formatDate(match.date)}
      </div>

      <div className='flex flex-row justify-between items-center w-full py-3 px-4 lg:md:px-1  rounded-2xl border-2 border-white/10 bg-[#0a0a0a23]'>
        <TeamCard
          odd={match.odds.odd_1}
          team={match.team_1}
          logoPosition='start'
          match_id={match.id}
          oddOption={OddOptionEnum.ODD_1}
        />
        <TeamCard odd={match.odds.odd_x} match_id={match.id} oddOption={OddOptionEnum.ODD_X} />
        <TeamCard
          odd={match.odds.odd_2}
          team={match.team_2}
          logoPosition='end'
          match_id={match.id}
          oddOption={OddOptionEnum.ODD_2}
        />
      </div>

      <div className='flex flex-row justify-between items-start w-full p-3 rounded-2xl  mt-3 lg:md:gap-5 gap-1'>
        <div className='w-1/3 flex flex-col items-center justify-center text-center gap-2'>
          {match.bets
            .filter(x => x.bet_option == OddOptionEnum.ODD_1)
            .map((bet, index) => (
              <UserBetCard key={index + bet.bet_option} amount={bet.amount} user={bet.user} />
            ))}
        </div>

        <div className='w-1/3 flex flex-col items-start justify-center text-center gap-2'>
          {match.bets
            .filter(x => x.bet_option == OddOptionEnum.ODD_X)
            .map((bet, index) => (
              <UserBetCard key={index + bet.bet_option} amount={bet.amount} user={bet.user} />
            ))}
        </div>

        <div className='w-1/3 flex flex-col items-center justify-center text-center gap-2'>
          {match.bets
            .filter(x => x.bet_option == OddOptionEnum.ODD_2)
            .map((bet, index) => (
              <UserBetCard key={index + bet.bet_option} amount={bet.amount} user={bet.user} />
            ))}
        </div>
      </div>
    </div>
  )
}
