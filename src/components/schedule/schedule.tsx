import React, { useState, useEffect } from 'react'
import './schedule.css'
import { Shortcut } from './shortcut'
import scheduleData from '../../assets/json/horario.json'
import clsx from 'clsx'

interface Subject {
  horaInicio: string
  horaFin: string
  asignatura: string
  order: number
}

interface ScheduleType {
  [key: string]: Subject[]
}

export const Schedule: React.FC = () => {
  const [currentOrder, setCurrentOrder] = useState<number | null>(null)

  const updateCurrentOrder = () => {
    const now = new Date()
    const dayOfWeek = now.toLocaleString('es-ES', { weekday: 'long' }).toLowerCase()
    const currentTime = now.toTimeString().slice(0, 5)

    const schedule: ScheduleType = scheduleData as ScheduleType

    if (schedule[dayOfWeek]) {
      const todayClasses = schedule[dayOfWeek]
      const ongoingClass = todayClasses.find(
        (cls: Subject) => currentTime >= cls.horaInicio && currentTime <= cls.horaFin
      )

      setCurrentOrder(ongoingClass ? ongoingClass.order : null)
    }
  }

  useEffect(() => {
    updateCurrentOrder()
    const interval = setInterval(updateCurrentOrder, 10000)
    return () => clearInterval(interval)
  }, [])

  return (
    <table>
      <tbody>
        <tr>
          <td className="table-cell-base w-[100px] hour-cell ">08:30 <br /> 09:20</td>
          <td className={clsx("table-cell-base mat1", currentOrder === 1 && 'current')} rowSpan={2}>Fh</td>
          <td className={clsx("table-cell-base mat2", currentOrder === 4 && 'current')} rowSpan={2}>Iso</td>
          <td className={clsx("table-cell-base mat3", currentOrder === 8 && 'current')}>Lm</td>
          <td className={clsx("table-cell-base mat8", currentOrder === 12 && 'current')}>Ippe</td>
          <td className={clsx("table-cell-base mat1", currentOrder === 15 && 'current')} rowSpan={2}>Fh</td>
          <Shortcut link='https://mail.google.com/' imageSrc="/gmail.png" />
        </tr>
        <tr>
          <td className="table-cell-base w-[100px] hour-cell ">09:25 <br /> 10:15</td>
          <td className={clsx("table-cell-base mat4", currentOrder === 9 && 'current')} rowSpan={2}>Bd</td>
          <td className={clsx("table-cell-base mat2", currentOrder === 13 && 'current')} rowSpan={2}>Iso</td>
          <Shortcut link='https://classroom.google.com/' imageSrc="/classroom.png" />
        </tr>
        <tr>
          <td className="table-cell-base w-[100px] hour-cell ">10:20 <br /> 11:10</td>
          <td className={clsx("table-cell-base mat8", currentOrder === 2 && 'current')}>Ippe</td>
          <td className={clsx("table-cell-base mat7", currentOrder === 5 && 'current')}>Inglés</td>
          <td className={clsx("table-cell-base mat8", currentOrder === 16 && 'current')}>Ippe</td>
          <Shortcut link='https://drive.google.com/' imageSrc="/drive.png" />
        </tr>
        <tr className='h-36'>
          <td className="table-cell-base w-[100px] hour-cell "> </td>
          <td className="table-cell-base bg-gray-300" colSpan={5}></td>
        </tr>
        <tr>
          <td className="table-cell-base w-[100px] hour-cell ">11:40 <br /> 12:30</td>
          <td className={clsx("table-cell-base mat4", currentOrder === 3 && 'current')} rowSpan={3}>Bd</td>
          <td className={clsx("table-cell-base mat5", currentOrder === 6 && 'current')}>Dasp</td>
          <td className={clsx("table-cell-base mat2", currentOrder === 10 && 'current')} rowSpan={2}>Iso</td>
          <td className={clsx("table-cell-base mat6", currentOrder === 14 && 'current')} rowSpan={3}>Par</td>
          <td className={clsx("table-cell-base mat6", currentOrder === 17 && 'current')} rowSpan={2}>Par</td>
          <Shortcut link='https://studentspace.lafoz.dev/login' imageSrc="/studentspace.svg" />
        </tr>
        <tr>
          <td className="table-cell-base w-[100px] hour-cell ">12:35 <br /> 13:25</td>
          <td className={clsx("table-cell-base mat6", currentOrder === 7 && 'current')} rowSpan={2}>Par</td>
          <Shortcut link='https://iespabloserrano.aeducar.es/my/courses.php' imageSrc="/aeducar.ico" />
        </tr>
        <tr>
          <td className="table-cell-base w-[100px] hour-cell ">13:30 <br /> 14:20</td>
          <td className={clsx("table-cell-base mat7", currentOrder === 11 && 'current')}>Inglés</td>
          <td className={clsx("table-cell-base mat3", currentOrder === 18 && 'current')}>Lm</td>
          <Shortcut link='https://aplicaciones.aragon.es/sigaddweb/login' imageSrc="/sigad.png" />
        </tr>
      </tbody>
    </table>
  )
}
