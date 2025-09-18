import { Alert } from '@heroui/react'
import React from 'react'
import { TursoClient } from '../../../common/api/turso/config/client'

interface DisplayMoneyProps {
  money: number | null
}

export const DisplayMoney: React.FC<DisplayMoneyProps> = props => {
  const { money } = props

  const [cooldownAlert, setCooldownAlert] = React.useState<string | undefined>()
  const [successAlert, setSuccessAlert] = React.useState<string | undefined>()

  const requestBonus = async () => {
    const token = localStorage.getItem('token')
    setSuccessAlert(undefined)
    setCooldownAlert(undefined)

    // Obtener dinero y último bono
    const result = await TursoClient.execute({
      sql: 'SELECT money, last_bonus FROM user WHERE token = ?',
      args: [token],
    })

    if (result.rows.length === 0) {
      setCooldownAlert('Usuario no encontrado')
      return
    }

    const userMoney = Number(result.rows[0].money)
    const lastBonusRaw = result.rows[0].last_bonus

    const now = new Date()

    // Verificar si el dinero está en 0
    if (userMoney == null || userMoney > 0) {
      return
    }

    if (lastBonusRaw) {
      const lastBonusString = String(lastBonusRaw)
      const lastBonusTime = new Date(lastBonusString)

      if (!isNaN(lastBonusTime.getTime())) {
        const timeSinceLastBonus = now.getTime() - lastBonusTime.getTime()

        if (timeSinceLastBonus < 60000) {
          const remainingSeconds = Math.ceil((60000 - timeSinceLastBonus) / 1000)
          setCooldownAlert(`Solicita el bono en ${remainingSeconds} segundos`)
          return
        }
      }
    }

    // Actualizar dinero y last_bonus
    await TursoClient.execute({
      sql: 'UPDATE user SET money = 100, last_bonus = ? WHERE token = ?',
      args: [now.toISOString(), token],
    })

    setSuccessAlert('¡Has recibido 100 monedas!')
    setCooldownAlert(undefined)
    window.location.reload()
  }

  if (money == null) return <></>

  if (money <= 0)
    return (
      <>
        <Alert
          isVisible={successAlert !== undefined || cooldownAlert !== undefined}
          color={successAlert !== undefined ? 'success' : cooldownAlert !== undefined ? 'danger' : 'default'}
          title={successAlert !== undefined ? successAlert : cooldownAlert !== undefined ? cooldownAlert : ''}
          className='fixed w-auto z-50 top-16 opacity-80'
        />
        <div className='text-xl flex flex-row flex-wrap text-center font-bold text-white/50 gap-5 items-center justify-center'>
          <div>{money} 💸 🥵</div>
          <button className='bg-black/40 px-3 py-1 rounded-2xl' onClick={requestBonus}>
            Bono de 🐶 Sanchéz
          </button>
        </div>
      </>
    )

  return (
    <>
      <div className='text-xl flex text-center font-bold text-white/50'>{<>{money} 💸</>}</div>
    </>
  )
}
