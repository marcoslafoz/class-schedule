import React from 'react'
import './sticky-note.css'
import { NotesElement } from './notes-elements'

export const StickyNote: React.FC = () => {
  return (
    <div className='sticky-note flex flex-col justify-center'>
      <ul className='sticky-list'>
        <NotesElement />
      </ul>
    </div>
  )
}
