import { Tooltip } from '@heroui/react'
import { NotesContext } from '../../../common/context/notes-context'
import './sticky-note.css'
import React from 'react'
import { DeleteIcon } from '@heroui/shared-icons'

export const formatDate = (stringDate?: string): string => {
  if (!stringDate) return ''

  const date = new Date(stringDate)
  if (isNaN(date.getTime())) return ''

  return `${date.getDate()}/${date.getMonth() + 1}`
}

export const NotesElement: React.FC = () => {
  const { notes, deleteNote } = React.useContext(NotesContext)

  const handleDelete = (id: number) => {
    deleteNote(id)
  }

  return (
    <ul className='space-y-2'>
      {notes.map((note, index) => (
        <li key={index}>
          <div className='flex flex-row items-center gap-2 group'>
            {note.icon_url && <img className='w-7 h-7 object-contain' src={note.icon_url} alt={note.title} />}

            <Tooltip
              content={`@${note.autor}`}
              color='foreground'
              closeDelay={0}
              placement='left'
              className='opacity-50'
              offset={25}
              size='sm'
            >
              {note.url != null ? (
                <a target='_blank' href={note.url} rel='noreferrer' className='hover:underline'>
                  <span>{`${formatDate(note.date)} ${note.title}`}</span>
                </a>
              ) : (
                <span>{`${formatDate(note.date)} ${note.title}`}</span>
              )}
            </Tooltip>

            <div className='flex flex-row flex-wrap gap-3'>
              <button className='hidden group-hover:block' onClick={() => handleDelete(note.id)}>
                <Tooltip content='Eliminar nota' color='danger' closeDelay={0} showArrow={true}>
                  <span className='text-lg text-danger cursor-pointer active:opacity-80 opacity-50'>
                    <DeleteIcon />
                  </span>
                </Tooltip>
              </button>
            </div>
          </div>
        </li>
      ))}
    </ul>
  )
}
