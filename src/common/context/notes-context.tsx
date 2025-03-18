import React, { createContext, useEffect, useCallback } from 'react'
import { Note } from '../types/note.vm'
import { TursoClient } from '../api/turso/config/client'

interface NotesContextType {
  notes: Note[]
  refetch: () => Promise<void>
  addNote: (newNote: Note) => Promise<void>
  deleteNote: (id: number) => Promise<void>
  loading?: boolean
}

export const NotesContext = createContext<NotesContextType>({
  notes: [],
  refetch: async () => {},
  addNote: async () => {},
  deleteNote: async () => {},
  loading: true,
})

export const NotesProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [notes, setNotes] = React.useState<Note[]>([])
  const [loading, setLoading] = React.useState<boolean>(true)

  const fetchNotes = useCallback(async () => {
    try {
      const result = await TursoClient.execute('SELECT * FROM notes ORDER BY date ASC')
      const formattedNotes: Note[] = result.rows.map((row: any) => ({
        id: row.id,
        icon_url: row.icon_url,
        title: row.title,
        url: row.url,
        autor: row.autor,
        date: row.date != null ? row.date : undefined,
      }))
      setNotes(formattedNotes)
      setLoading(false)
    } catch (error) {
      console.error('Error fetching notes:', error)
    }
  }, [])

  const addNote = useCallback(async (newNote: Note) => {
    try {
      await TursoClient.execute({
        sql: 'INSERT INTO notes (icon_url, title, url, autor, date) VALUES (?, ?, ?, ?, ?)',
        args: [
          newNote.icon_url || null,
          newNote.title,
          newNote.url || null,
          newNote.autor,
          newNote.date != null || newNote.date != undefined ? new Date(newNote.date).toISOString() : null,
        ],
      })
      setLoading(false)
      setNotes(prevNotes => [...prevNotes, newNote])
    } catch (error) {
      console.error('Error adding note:', error)
    }
  }, [])

  const deleteNote = useCallback(async (id: number) => {
    try {
      await TursoClient.execute({
        sql: 'DELETE FROM notes WHERE id = ?',
        args: [id],
      })

      setNotes(prevNotes => prevNotes.filter(note => note.id !== id))
      setLoading(false)
    } catch (error) {
      console.error('Error deleting note:', error)
    }
  }, [])

  useEffect(() => {
    fetchNotes()
  }, [fetchNotes])

  return (
    <NotesContext.Provider value={{ notes, refetch: fetchNotes, addNote, deleteNote, loading }}>
      {children}
    </NotesContext.Provider>
  )
}
