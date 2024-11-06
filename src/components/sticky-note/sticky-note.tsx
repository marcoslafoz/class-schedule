import React, { useState, useEffect } from 'react'
import './sticky-note.css'

interface Note {
  note: string
}

export const StickyNote: React.FC = () => {
  const [notes, setNotes] = useState<Note[]>([])

  useEffect(() => {
    fetch('https://raw.githubusercontent.com/marcoslafoz/Horario-ASIR/refs/heads/master/src/assets/json/sticky-notes.json')
      .then(response => response.json())
      .then(data => setNotes(data))
      .catch(error => console.error('Error al cargar los datos:', error))
  }, [])

  return (
    <div className='sticky-note' >
      <ul className='sticky-list'>
        {notes.map((note, index) => (
          <li key={index}>{note.note}</li>
        ))}
      </ul>
    </div>
  )
}
