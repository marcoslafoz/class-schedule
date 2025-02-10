import React from 'react'
import { NotesAddModal } from './add-note-modal'

export const AddNoteButton: React.FC = () => {
  const [showNotesAddModal, setShowNotesAddModal] = React.useState<boolean>(false)

  return (
    <>
      <button
        onClick={() => setShowNotesAddModal(true)}
        className='text-sm text-black opacity-20 cursor-pointer px-2 pt-1 flex flex-row text-center  justify-center items-center border border-black rounded-md hover:opacity-50'
      >
        Añadir nota
      </button>
      <NotesAddModal isOpen={showNotesAddModal} onClose={() => setShowNotesAddModal(false)} />
    </>
  )
}
