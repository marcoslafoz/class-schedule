import React from 'react'
import { StickyNote, Counter, Schedule, GitHubButton } from '../../components'

export const ScheduleView: React.FC = () => {
  return (
    <>
      <div className='custom-bg-color-primary flex flex-col lg:flex-row justify-center min-h-screen'>
        <div className='order-2 lg:order-1 lg:w-1/3 p-4 flex flex-col lg:mt-0 mt-10 justify-center items-center lg:items-end '>
          <GitHubButton />
          <StickyNote />
        </div>

        <div className='columna order-1 lg:order-2 lg:w-full flex flex-col items-center p-4'>
          <Counter />
          <Schedule />
        </div>

        <div className='hidden lg:block lg:order-3 lg:w-1/3 p-4' />
      </div>
    </>
  )
}
