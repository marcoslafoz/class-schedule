import React from 'react'
import './sticky-note.css'

export const NotesElement: React.FC = () => {

  // TODO Hacer que se lea desde un json hosteado en lafoz-server

  return (
    <>
      <li>
        <div className='flex flex-row items-center gap-2' >
          <img className='li-icon' src='https://cdn-icons-png.flaticon.com/512/4669/4669118.png' alt='BD icon' />
          <span>30/01 Recuperación PAR</span>
        </div>
      </li>

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
          <img className='li-icon' src='https://cdn-icons-png.flaticon.com/512/15459/15459593.png' alt='BD icon' />
          <a target='_blank' href="https://marcoslafoz.notion.site/Servidor-de-Minecraft-17c52e7bcd7d802e964ada99cea1b7bf" rel="noreferrer">
            <span className='hover:underline' >
              MC Server
            </span>
          </a>
        </div>
      </li>
    </>
  )
}