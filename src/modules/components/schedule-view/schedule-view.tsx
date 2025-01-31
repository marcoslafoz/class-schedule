import React from 'react'
import { Schedule } from '../schedule'
import { Counter } from '../counter'
import { StickyNote } from '../sticky-note'

export const ScheduleView: React.FC = () => {
  return (
    <div className="schedule-view-container flex flex-col lg:flex-row justify-center min-h-screen">
     
      <div className="order-2 lg:order-1 lg:w-1/3 p-4 flex flex-col lg:mt-0 mt-10 justify-center items-center lg:items-end ">
        <StickyNote/>
      </div>

      <div className="columna order-1 lg:order-2 lg:w-full flex flex-col items-center p-4">
        <div className="py-6"><Counter /></div>
        <Schedule />
      </div>

      <div className="hidden lg:block lg:order-3 lg:w-1/3 p-4"/>
    </div>
  )
}
