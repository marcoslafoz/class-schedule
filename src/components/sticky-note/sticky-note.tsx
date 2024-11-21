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
        {/*TODO: REMOVE ME AFTER 5/12*/}
        <a className=' hover:underline ' target='_blank' href='https://drive.google.com/file/d/1p-BzRWNG67sIAV6i0VBnO0ExgvnilgZs/view?usp=sharing' rel="noreferrer" ><li >🔗 Calendario Examenes </li></a>
        {notes.map((note, index) => (
          <li key={index}>{note.note}</li>
        ))}
      </ul>
    </div>
  )
}
