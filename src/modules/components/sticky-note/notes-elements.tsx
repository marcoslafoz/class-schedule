import React from 'react'
import './sticky-note.css'

export const NotesElement: React.FC = () => {
  // TODO Hacer que se lea desde un json hosteado en lafoz-server

  return (
    <>
      <li>
        <div className='flex flex-row items-center gap-2'>
          <img className='li-icon' src='https://cdn-icons-png.flaticon.com/512/330/330425.png' alt='BD icon' />
          <span>25/02 Grammar & Vocabulary </span>
        </div>
      </li>

      <li>
        <div className='flex flex-row items-center gap-2'>
          <img className='li-icon' src='https://cdn-icons-png.flaticon.com/512/9074/9074738.png' alt='BD icon' />
          <span>
            26/02 Listening &<br /> Writting
          </span>
        </div>
      </li>

      <li>
        <div className='flex flex-row items-center gap-2'>
          <img className='li-icon' src='https://cdn-icons-png.flaticon.com/512/15459/15459593.png' alt='BD icon' />
          <a
            target='_blank'
            href='https://marcoslafoz.notion.site/Servidor-de-Minecraft-17c52e7bcd7d802e964ada99cea1b7bf'
            rel='noreferrer'
          >
            <span className='hover:underline'>MC Server</span>
          </a>
        </div>
      </li>
    </>
  )
}
