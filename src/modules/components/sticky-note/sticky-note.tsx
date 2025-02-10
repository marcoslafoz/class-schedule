import React from 'react'
import './sticky-note.css'
import { NotesElement } from './notes-elements'
import { AddNoteButton } from './add-note'

export const StickyNote: React.FC = () => {
  return (
    <div className='sticky-note flex flex-col '>
      <div className='justify-self-start pt-2.5 pl-3'>
        <AddNoteButton />
      </div>
      <ul className='sticky-list'>
        <NotesElement />
      </ul>
    </div>
  )
}
