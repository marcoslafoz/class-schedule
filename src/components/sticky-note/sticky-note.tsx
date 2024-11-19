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
        {/*TODO: REMOVE ME*/}
        <a className=' hover:underline ' target='_blank' href='https://drive.google.com/file/d/10On1P185HCePkhsWK1YLJK-pnA9REDv3/view?usp=sharing' rel="noreferrer" ><li >🔗 Calendario Examenes </li></a>
        {notes.map((note, index) => (
          <li key={index}>{note.note}</li>
        ))}
      </ul>
    </div>
  )
}
