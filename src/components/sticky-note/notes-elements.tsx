import React from 'react'
import './sticky-note.css'

export const NotesElement: React.FC = () => {

  // TODO Hacer que se lea desde un json hosteado en lafoz-server

  return (
    <>
      <li>
        <div className='flex flex-row items-center gap-2' >
          <img className='li-icon' src='https://cdn-icons-png.flaticon.com/512/689/689317.png' alt='BD icon' />
          <span>28 / 01 Exámen ISO</span>
        </div>
      </li>

      <li>
        <div className='flex flex-row items-center gap-2' >
          <img className='li-icon' src='https://cdn-icons-png.flaticon.com/512/4669/4669118.png' alt='BD icon' />
          <span>30/01 Recuperación PAR</span>
        </div>
      </li>

      <li>
        <div className='flex flex-row items-center gap-2' >
          <img className='li-icon' src='https://cdn-icons-png.flaticon.com/512/919/919827.png' alt='BD icon' />
          <span>07/02 Recuperación LM</span>
        </div>
      </li>
    </>
  )
}