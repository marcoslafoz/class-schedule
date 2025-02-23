import { redirect } from 'react-router'
import { TursoClient } from '../api/turso/config/client'

export async function authLoader() {
  try {
    const token = localStorage.getItem('token')

    const result = await TursoClient.execute({
      sql: 'SELECT id FROM user WHERE token = ?',
      args: [token],
    })

    await TursoClient.execute({
      sql: 'UPDATE user SET last_login = ? WHERE token = ?',
      args: [new Date().toISOString(), token],
    })

    if (result.rows.length > 0) {
      return null
    } else {
      return redirect('/')
    }
  } catch (error) {
    return redirect('/')
  }
}
