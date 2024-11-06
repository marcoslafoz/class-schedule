import React, { useState } from 'react'
import './sticky-note.css'

export const StickyNote: React.FC = () => {
  const [visible, setVisible] = useState(true)
  const handleClick = () => setVisible(false)

  return (
    visible ? (
      <div className='sticky-note' onClick={handleClick}>
        <ul className='sticky-list'>
          <li>sw</li>
          <li>sw</li>
          <li>sw</li>
          <li>sw</li>
        </ul>
      </div>
    ) : null
  )
}
