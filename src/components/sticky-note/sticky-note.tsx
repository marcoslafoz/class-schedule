import React, { useState, useEffect, useRef } from 'react'
import clsx from 'clsx'
import './sticky-note.css'
import { NotesElement } from './notes-elements'

export const StickyNote: React.FC = () => {

  const [falling, setFalling] = useState(false)
  const stickyNoteRef = useRef<HTMLDivElement | null>(null)

  const handleDivClick = () => {
    setFalling(true)
  }

  useEffect(() => {
    const element = stickyNoteRef.current
    if (!element) return

    const handleTransitionEnd = (event: TransitionEvent) => {
      if (event.propertyName === 'opacity' && falling) {
        element.style.display = 'none'
      }
    }

    element.addEventListener('transitionend', handleTransitionEnd)
    return () => {
      element.removeEventListener('transitionend', handleTransitionEnd)
    }
  }, [falling])

  return (
    <div
      ref={stickyNoteRef}
      className={clsx('sticky-note', { falling })}
      onClick={handleDivClick}
    >
      <ul className="sticky-list">

        <NotesElement />


      </ul>
    </div>
  )
}
