import React from 'react'
import './sticky-note.css'

export const NotesElement: React.FC = () => {

  // TODO Hacer que se lea desde un json hosteado en lafoz-server

  return (
    <>
      <li>
        <div className='flex flex-row items-center gap-2' >
          <img className='li-icon' src='https://cdn-icons-png.flaticon.com/512/9850/9850774.png' alt='BD icon' />
          <span>03/02 Test GBD</span>
        </div>
      </li>

      <li>
        <div className='flex flex-row items-center gap-2' >
          <img className='li-icon' src='https://cdn-icons-png.flaticon.com/512/689/689317.png' alt='BD icon' />
          <span>05/02 Exámen ISO</span>
        </div>
      </li>

      <li>
        <div className='flex flex-row items-center gap-2' >
          <img className='li-icon' src='https://cdn-icons-png.flaticon.com/512/919/919827.png' alt='BD icon' />
          <span>07/02 Recuperación LM</span>
        </div>
      </li>

      <li>
        <div className='flex flex-row items-center gap-2' >
          <img className='li-icon' src='https://cdn-icons-png.flaticon.com/512/330/330425.png' alt='BD icon' />
          <span>25/02 Gram & Voc</span>
        </div>
      </li>

      <li>
        <div className='flex flex-row items-center gap-2' >
          <img className='li-icon' src='https://cdn-icons-png.flaticon.com/512/9074/9074738.png' alt='BD icon' />
          <span>26/02 List & Writ</span>
        </div>
      </li>
    </>
  )
}