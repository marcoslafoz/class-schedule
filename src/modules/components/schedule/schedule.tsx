import React from 'react'
import './schedule.css'
import { FlexShortcut, Shortcut } from './shortcut'
import scheduleData from '../../../assets/json/horario.json'
import clsx from 'clsx'
import { RouletteFlexShortcut, RouletteShortcut } from '../roulette/roulette-shortcut'
import { Tooltip } from '@heroui/react'

interface TimerSubject {
  horaInicio: string
  horaFin: string
  asignatura: string
  order: number
}

interface ScheduleTimerType {
  [key: string]: TimerSubject[]
}

enum SUBJECT_ID {
  IAW = 'IAW',
  MPO = 'MPO',
  SAD = 'SAD',
  ASO = 'ASO',
  ASGB = 'ASGB',
  SASP = 'SASP',
  IPPE = 'IPPE',
  SRI = 'SRI',
  PIAS = 'PIAS',
}

interface Subject {
  id: SUBJECT_ID
  full_name: string
  teacher: string
  classroom_url?: string
}

const SubjectList: Record<SUBJECT_ID, Subject> = {
  [SUBJECT_ID.IAW]: {
    id: SUBJECT_ID.IAW,
    full_name: 'Implantación de aplicaciones web',
    teacher: 'Enrique González Revilla',
    classroom_url: 'https://classroom.google.com/u/1/c/ODA2MzQ3NjYxMTI1',
  },
  [SUBJECT_ID.MPO]: {
    id: SUBJECT_ID.MPO,
    full_name: 'Módulo profesional optativo',
    teacher: 'Enrique Ruiz Meseguer',
    classroom_url: 'https://iespabloserrano.aeducar.es/course/view.php?id=235',
  },
  [SUBJECT_ID.SAD]: {
    id: SUBJECT_ID.SAD,
    full_name: 'Seguridad y alta disponibilidad',
    teacher: 'Enrique Ruiz Meseguer',
    classroom_url: 'https://iespabloserrano.aeducar.es/course/view.php?id=43',
  },
  [SUBJECT_ID.ASO]: {
    id: SUBJECT_ID.ASO,
    full_name: 'Administración de sistemas operativos',
    teacher: 'Gorka Sanz Lopategui',
    classroom_url: 'https://classroom.google.com/u/0/c/Nzc1MzIzMzMwMzE4',
  },
  [SUBJECT_ID.ASGB]: {
    id: SUBJECT_ID.ASGB,
    full_name: 'Administración de sist. gestores de bases de datos',
    teacher: 'José Alberto Núñez Ruiz',
    classroom_url: 'https://iespabloserrano.aeducar.es/course/view.php?id=84',
  },
  [SUBJECT_ID.SASP]: {
    id: SUBJECT_ID.SASP,
    full_name: 'Sostenibilidad aplicada a los sistemas informáticos',
    teacher: 'Juan Ignacio Pulido Trullen',
    classroom_url: 'https://iespabloserrano.aeducar.es/course/view.php?id=173',
  },
  [SUBJECT_ID.IPPE]: {
    id: SUBJECT_ID.IPPE,
    full_name: 'Itinerario personal para la empleabilidad',
    teacher: 'Marta Oliván Bascones',
    classroom_url: 'https://classroom.google.com/u/0/c/ODA2NDUwNzA2NTgy',
  },
  [SUBJECT_ID.SRI]: {
    id: SUBJECT_ID.SRI,
    full_name: 'Servicios de red e Internet',
    teacher: 'Miguel Ángel Calle Pérez',
    classroom_url: 'https://iespabloserrano.aeducar.es/course/view.php?id=128',
  },
  [SUBJECT_ID.PIAS]: {
    id: SUBJECT_ID.PIAS,
    full_name: 'Proyecto intermodular',
    teacher: 'Pedro Martín Echeverría',
    classroom_url: 'https://iespabloserrano.aeducar.es/course/view.php?id=197',
  },
}

export const Schedule: React.FC = () => {
  const [currentOrder, setCurrentOrder] = React.useState<number | null>(null)

  const updateCurrentOrder = () => {
    const now = new Date()
    const dayOfWeek = now.toLocaleString('es-ES', { weekday: 'long' }).toLowerCase()
    const currentTime = now.toTimeString().slice(0, 5)

    const schedule: ScheduleTimerType = scheduleData as ScheduleTimerType

    if (schedule[dayOfWeek]) {
      const todayClasses = schedule[dayOfWeek]
      const ongoingClass = todayClasses.find(
        (cls: TimerSubject) => currentTime >= cls.horaInicio && currentTime <= cls.horaFin
      )

      setCurrentOrder(ongoingClass ? ongoingClass.order : null)
    }
  }

  React.useEffect(() => {
    updateCurrentOrder()
    const interval = setInterval(updateCurrentOrder, 10000)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className='flex flex-col justify-center items-center max-w-[54rem]'>
      <table className='border-separate border-spacing-2.5  '>
        <tbody>
          <tr>
            <HourCell start='08:30' end='09:20' />
            <SubjectCell subject={SubjectList.ASGB} rowSpan={3} active={currentOrder === 1} />
            <SubjectCell subject={SubjectList.IPPE} rowSpan={2} active={currentOrder === 4} />
            <SubjectCell subject={SubjectList.SRI} rowSpan={3} active={currentOrder === 8} />
            <SubjectCell subject={SubjectList.ASO} rowSpan={2} active={currentOrder === 10} />
            <SubjectCell subject={SubjectList.SASP} rowSpan={1} active={currentOrder === 14} />
            <Shortcut link='https://mail.google.com/' imageSrc='/assets/icons/gmail.png' />
          </tr>
          <tr>
            <HourCell start='09:25' end='10:15' />
            <SubjectCell subject={SubjectList.SAD} rowSpan={2} active={currentOrder === 15} />
            <Shortcut link='https://classroom.google.com/' imageSrc='/assets/icons/classroom.png' />
          </tr>
          <tr>
            <HourCell start='10:20' end='11:10' />
            <SubjectCell subject={SubjectList.MPO} rowSpan={1} active={currentOrder === 5} />
            <SubjectCell subject={SubjectList.IAW} rowSpan={1} active={currentOrder === 11} />
            <Shortcut link='https://drive.google.com/' imageSrc='/assets/icons/drive.png' />
          </tr>
          <tr>
            <td className='h-20' colSpan={6}></td>
          </tr>
          <tr>
            <HourCell start='11:40' end='12:30' />
            <SubjectCell subject={SubjectList.IAW} rowSpan={2} active={currentOrder === 2} />
            <SubjectCell subject={SubjectList.MPO} rowSpan={1} active={currentOrder === 6} />
            <SubjectCell subject={SubjectList.SAD} rowSpan={3} active={currentOrder === 9} />
            <SubjectCell subject={SubjectList.IAW} rowSpan={1} active={currentOrder === 12} />
            <SubjectCell subject={SubjectList.SRI} rowSpan={3} active={currentOrder === 16} />
            <Shortcut link='https://www.studentspace.app/' imageSrc='/assets/icons/studentspace.svg' />
          </tr>
          <tr>
            <HourCell start='12:35' end='13:25' />
            <SubjectCell subject={SubjectList.ASO} rowSpan={2} active={currentOrder === 7} />
            <SubjectCell subject={SubjectList.PIAS} rowSpan={2} active={currentOrder === 13} />

            <Shortcut link='https://iespabloserrano.aeducar.es/my/courses.php' imageSrc='/assets/icons/aeducar.ico' />
          </tr>
          <tr>
            <HourCell start='13:30' end='14:20' />
            <SubjectCell subject={SubjectList.MPO} rowSpan={1} active={currentOrder === 3} />
            <RouletteShortcut />
          </tr>
        </tbody>
      </table>

      <table className='border-separate border-spacing-2.5  lg:hidden '>
        <tbody>
          <tr>
            <HourCell start='08:30' end='09:20' hidden={true} />
            <FlexShortcut link='https://classroom.google.com/' imageSrc='/assets/icons/classroom.png' />
            <FlexShortcut link='https://drive.google.com/' imageSrc='/assets/icons/drive.png' />
            <FlexShortcut
              link='https://iespabloserrano.aeducar.es/my/courses.php'
              imageSrc='/assets/icons/aeducar.ico'
            />
            <FlexShortcut link='https://www.studentspace.app/' imageSrc='/assets/icons/studentspace.svg' />
            <RouletteFlexShortcut />
          </tr>
        </tbody>
      </table>
    </div>
  )
}

interface SubjetCellProps {
  active?: boolean
  rowSpan?: number
  subject: Subject
  disabled?: boolean
}

const SubjectCell: React.FC<SubjetCellProps> = props => {
  const { subject, active = false, rowSpan = 1, disabled = false } = props

  return (
    <Tooltip
      content={
        <span className='text-center'>
          {subject.teacher} <br /> {subject.full_name}
        </span>
      }
      color='foreground'
      className='opacity-60'
      size='md'
      delay={800}
      motionProps={{
        variants: {
          exit: {
            opacity: 0,
            transition: {
              duration: 0.1,
              ease: 'easeIn',
            },
          },
          enter: {
            opacity: 1,
            transition: {
              duration: 0.15,
              ease: 'easeOut',
            },
          },
        },
      }}
    >
      <td
        onClick={() => window.open(subject.classroom_url, '_blank')}
        className={clsx(
          'rounded-xl text-right align-bottom text-white/90 h-20 w-32 px-2 py-1 text-xs hover:cursor-pointer',
          disabled && 'opacity-0',
          active && 'current',
          subject.id.toLowerCase()
        )}
        rowSpan={rowSpan}
      >
        {subject.id}
      </td>
    </Tooltip>
  )
}

interface HourCellProps {
  end: string
  start: string
  hidden?: boolean
}

const HourCell: React.FC<HourCellProps> = props => {
  const { start, end, hidden = false } = props
  return (
    <td
      className={clsx(
        hidden && 'opacity-0 text-opacity-0',
        'text-center items-center text-white h-20 w-auto py-1 pr-2 text-xs opacity-20'
      )}
      rowSpan={1}
    >
      <div>{start}</div>
      <div>{end}</div>
    </td>
  )
}
