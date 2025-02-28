import React from 'react'
import { UserTop } from '../../../common/types'
import { TursoClient } from '../../../common/api/turso/config/client'
import { Tooltip, Spinner, Button } from '@heroui/react'
import { RenderMedals } from '../../../common/utils/user'
import { GlobalTopPlayersModal } from './global-top-players-modal'

export const TopPlayers: React.FC = () => {
  const [users, setUsers] = React.useState<UserTop[]>([])
  const [loading, setLoading] = React.useState<boolean>(true)
  const [showGlobalTopModal, setShowGlobalTopModal] = React.useState<boolean>(false)

  const fetchTopPlayers = async () => {
    setLoading(true)
    try {
      const result = await TursoClient.execute(
        'SELECT username, avatar_url, money FROM user ORDER BY money DESC limit 10'
      )

      const formattedUsers: UserTop[] = result.rows.map((row: any) => ({
        username: row.username,
        money: row.money,
        avatar_url: row.avatar_url != null ? row.avatar_url : undefined,
      }))
      setUsers(formattedUsers)
    } catch (error) {
      console.error('Error fetching top players:', error)
    } finally {
      setLoading(false)
    }
  }

  React.useEffect(() => {
    fetchTopPlayers()
  }, [])

  return (
    <>
      <div className='flex flex-col justify-center items-center bg-[#27272A] rounded-xl p-2 my-8 '>
        <div className='flex flex-row justify-center items-center bg-[#1A1A1A] rounded-xl p-3 text-[#bfbfbf] gap-4 w-full'>
          <div>🎰 TOP 10 LUDÓPATAS</div>

          <Tooltip content='Actualizar top' color='foreground' closeDelay={200} showArrow={true}>
            <button onClick={() => fetchTopPlayers()} disabled={loading}>
              <img
                src='/assets/icons/sync.svg'
                alt='Sync'
                className={`h-4 invert opacity-20 object-contain hover:opacity-50 ${loading ? 'animate-spin' : ''}`}
              />
            </button>
          </Tooltip>
        </div>

        <div className='flex flex-col w-full gap-2 py-2 items-center justify-center '>
          {loading ? (
            <Spinner size='lg' color='white' />
          ) : (
            users.map((user, index) => (
              <div key={index} className='flex flex-row justify-between items-center gap-4 p-2 text-white/70 w-full'>
                <div className='flex flex-row items-center gap-3 text-white/70'>
                  <img
                    src={user.avatar_url || '/assets/avatar/default.png'}
                    alt={user.username}
                    className='w-10 h-10 rounded-full aspect-square'
                  />
                  <div className='truncate max-w-36'>{` ${RenderMedals(index)} ${user.username}`}</div>
                </div>
                <div>{user.money} 💸</div>
              </div>
            ))
          )}
        </div>

        <Button
          onPress={() => setShowGlobalTopModal(true)}
          className='flex flex-row justify-center items-center bg-[#1A1A1A] rounded-2xl px-4 py-1 text-[#888888] gap-4'
        >
          🌐 TOP GLOBAL
        </Button>
      </div>
      <GlobalTopPlayersModal isOpen={showGlobalTopModal} onClose={() => setShowGlobalTopModal(false)} />
    </>
  )
}
