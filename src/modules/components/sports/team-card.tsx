import React from 'react'
import { OddOptionEnum, Team } from '../../../common/types'
import { NewBetModal } from './new-bet-modal'
import { Button } from '@heroui/react'

interface TeamCardProps {
  team?: Team
  odd: number
  logoPosition?: 'start' | 'end'
  match_id: number
  oddOption: OddOptionEnum
}

export const TeamCard: React.FC<TeamCardProps> = props => {
  const { odd, team, logoPosition = 'start', oddOption } = props
  const [showNewBetModal, setShowNewBetModal] = React.useState(false)

  // Team card
  if (team)
    return (
      <>
        <div className='w-1/3 flex flex-row items-center justify-center text-center gap-4'>
          {logoPosition == 'start' && (
            <img src={team.logo} className='w-8 h-8 aspect-square object-contain' alt={team.name} />
          )}
          <Button
            onPress={() => setShowNewBetModal(true)}
            className='max-w-28 bg-[#27272a] text-white/50 py-2 px-6 rounded-xl text-medium hover:bg-[#3e3f47] '
          >
            {'x' + odd.toString()}
          </Button>
          {logoPosition == 'end' && (
            <img src={team.logo} className='w-8 h-8 aspect-square object-contain' alt={team.name} />
          )}
        </div>
        <NewBetModal {...props} isOpen={showNewBetModal} onClose={() => setShowNewBetModal(false)} />
      </>
    )

  // Draw card
  if (oddOption == OddOptionEnum.ODD_X)
    return (
      <>
        <div className='w-1/3 flex flex-row items-center justify-center text-center gap-4'>
          <Button
            className='max-w-28 bg-[#27272a] text-white/50 py-2 px-6 rounded-xl hover:bg-[#3e3f47] text-medium'
            onPress={() => setShowNewBetModal(true)}
          >
            {'⚔️ x' + odd.toString()}
          </Button>
        </div>
        <NewBetModal {...props} isOpen={showNewBetModal} onClose={() => setShowNewBetModal(false)} />
      </>
    )
}
