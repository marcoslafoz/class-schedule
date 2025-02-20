import React, { useState, useEffect, useContext } from 'react'
import { Roulette, TopPlayers, UserAvatar } from '../components'
import { Helmet } from 'react-helmet'
import { UserContext } from '../../common/context/user-context'
import { TursoClient } from '../../common/api/turso/config/client'

export const RouletteScene: React.FC = () => {
  const [money, setMoney] = useState<number | null>(null)
  const [loading, setLoading] = useState<boolean>(true)

  const { isUserLogged } = useContext(UserContext)

  isUserLogged()

  useEffect(() => {
    const fetchMoney = async () => {
      try {
        const updatedMoney = await TursoClient.execute({
          sql: 'SELECT money FROM user WHERE token = ?',
          args: [localStorage.getItem('token')],
        })

        setMoney(Number(updatedMoney.rows[0]?.money) || 0)
      } catch (error) {
        console.error('Error fetching money:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchMoney()
  }, [])

  if (loading) return <></>

  return (
    <>
      <Helmet title='Roulette' />
      <div className='w-full min-h-screen flex flex-col  items-center bg-white/10'>
        <div className='flex flex-row w-full h-auto p-6  justify-end items-center '>
          <UserAvatar />
        </div>
        <div className='flex flex-col lg:md:flex-row justify-center w-full '>
          <div className='hidden lg:md:block lg:md:order-1 lg:md:w-1/5 lg:md:gap-0' />

          <div className='order-1 lg:md:order-2 lg:md:w-3/5 flex flex-col justify-center items-center '>
            <Roulette defaultMoney={money} />
          </div>

          <div className='columna order-2 lg:md:order-3 flex flex-col items-center justify-center lg:md:w-1/5'>
            <TopPlayers />
          </div>
        </div>
      </div>
    </>
  )
}
