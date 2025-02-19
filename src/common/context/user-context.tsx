import React, { createContext, useCallback } from 'react'
import { TursoClient } from '../api/turso/config/client'
import { UserCreate, UserLogin } from '../types/user.vm'
import { generateToken } from '../utils/auth'

// Interface for the context
interface UserContextType {
  createUser: (user: UserCreate) => Promise<boolean>
  isUserLogged: () => Promise<boolean>
  loginUser: (user: UserLogin) => Promise<boolean>
  userId: number | null
}

export const UserContext = createContext<UserContextType>({
  createUser: async () => false,
  isUserLogged: async () => false,
  loginUser: async () => false,
  userId: null,
})

export const UserProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [userId, setUserId] = React.useState<number | null>(null)

  // Method to create a new user
  const createUser = useCallback(async (user: UserCreate) => {
    try {
      const existingUser = await TursoClient.execute({
        sql: 'SELECT id FROM user WHERE username = ?',
        args: [user.username.trim().toLowerCase()],
      })

      if (existingUser.rows.length > 0) return false
      const generatedToken: string = generateToken()

      await TursoClient.execute({
        sql: 'INSERT INTO user (username, password, token) VALUES (?, ?, ?)',
        args: [user.username.trim().toLowerCase(), user.password.trim(), generatedToken],
      })

      localStorage.setItem('token', generatedToken)

      return true
    } catch (error) {
      console.error('Error creating user:', error)
      return false
    }
  }, [])

  // Method to check if a user ID exists in the database
  const isUserLogged = useCallback(async () => {
    try {
      const token = localStorage.getItem('token')

      const result = await TursoClient.execute({
        sql: 'SELECT id FROM user WHERE token = ?',
        args: [token],
      })

      setUserId(Number(result.rows[0].id))
      return result.rows.length > 0
    } catch (error) {
      return false
    }
  }, [])

  const loginUser = useCallback(async (user: UserLogin) => {
    try {
      const result = await TursoClient.execute({
        sql: 'SELECT id, password FROM user WHERE username = ?',
        args: [user.username.trim().toLowerCase()],
      })

      if (result.rows.length === 0) {
        return false
      }

      if (result.rows[0].password !== user.password.trim()) {
        return false
      }

      const newToken = generateToken()

      await TursoClient.execute({
        sql: 'UPDATE user SET token = ? WHERE id = ?',
        args: [newToken, result.rows[0].id],
      })

      localStorage.setItem('token', newToken)

      return true
    } catch (error) {
      return false
    }
  }, [])

  return (
    <UserContext.Provider value={{ createUser, isUserLogged, loginUser, userId: userId }}>
      {children}
    </UserContext.Provider>
  )
}
