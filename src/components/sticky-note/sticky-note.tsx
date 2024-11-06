import React, { useState, useEffect } from 'react'
import './sticky-note.css'
import stickyNotesData from '../../assets/json/sticky-notes.json'  

interface Note {
  note: string
}

export const StickyNote: React.FC = () => {
  const [notes, setNotes] = useState<Note[]>([])

  useEffect(() => {
    setNotes(stickyNotesData) 
  }, [])

  return (
    <div className='sticky-note'>
      <ul className='sticky-list'>
        {notes.map((note, index) => (
          <li key={index}>{note.note}</li>
        ))}
      </ul>
    </div>
  )
}
