import React from 'react'
import './sticky-note.css'
import { NotesElement } from './notes-elements'
import { AddNoteButton } from './add-note'
import { Tooltip } from '@heroui/react'
import { NotesContext } from '../../../common/context/notes-context'

export const StickyNote: React.FC = () => {
  const { refetch } = React.useContext(NotesContext)

  const handleRefetch = () => {
    refetch()
  }

  return (
    <div className='sticky-note flex flex-col '>
      <div className='justify-self-start flex flex-row pt-2.5 pl-3 gap-2'>
        <AddNoteButton />
        <Tooltip content='Actualizar notas' color='foreground' closeDelay={200} showArrow={true}>
          <button onClick={() => handleRefetch()}>
            <img src='/assets/icons/sync.svg' alt='Sync' className='h-4 opacity-20 object-contain hover:opacity-50' />
          </button>
        </Tooltip>
      </div>
      <ul className='sticky-list'>
        <NotesElement />
      </ul>
    </div>
  )
}
