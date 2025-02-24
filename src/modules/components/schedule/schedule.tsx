import React from 'react'
import './schedule.css'
import { FlexShortcut, Shortcut } from './shortcut'
import scheduleData from '../../../assets/json/horario.json'
import clsx from 'clsx'
import { RouletteFlexShortcut, RouletteShortcut } from '../roulette/roulette-shortcut'

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
  const [currentOrder, setCurrentOrder] = React.useState<number | null>(null)

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
            <SubjectCell subjectName={SUBJECT_NAME.FH} rowSpan={2} active={currentOrder === 1} />
            <SubjectCell subjectName={SUBJECT_NAME.ISO} rowSpan={2} active={currentOrder === 4} />
            <SubjectCell subjectName={SUBJECT_NAME.LM} rowSpan={1} active={currentOrder === 8} />
            <SubjectCell subjectName={SUBJECT_NAME.IPPE} rowSpan={1} active={currentOrder === 12} />
            <SubjectCell subjectName={SUBJECT_NAME.FH} rowSpan={2} active={currentOrder === 15} />
            <Shortcut link='https://mail.google.com/' imageSrc='/assets/icons/gmail.png' />
          </tr>
          <tr>
            <HourCell start='09:25' end='10:15' />
            <SubjectCell subjectName={SUBJECT_NAME.GBD} rowSpan={2} active={currentOrder === 9} />
            <SubjectCell subjectName={SUBJECT_NAME.ISO} rowSpan={2} active={currentOrder === 13} />
            <Shortcut link='https://classroom.google.com/' imageSrc='/assets/icons/classroom.png' />
          </tr>
          <tr>
            <HourCell start='10:20' end='11:10' />
            <SubjectCell subjectName={SUBJECT_NAME.IPPE} rowSpan={1} active={currentOrder === 2} />
            <SubjectCell subjectName={SUBJECT_NAME.INGLES} rowSpan={1} active={currentOrder === 5} />
            <SubjectCell subjectName={SUBJECT_NAME.IPPE} rowSpan={1} active={currentOrder === 16} />
            <Shortcut link='https://drive.google.com/' imageSrc='/assets/icons/drive.png' />
          </tr>
          <tr>
            <td className='h-20' colSpan={6}></td>
          </tr>
          <tr>
            <HourCell start='11:40' end='12:30' />
            <SubjectCell subjectName={SUBJECT_NAME.GBD} rowSpan={3} active={currentOrder === 3} />
            <SubjectCell subjectName={SUBJECT_NAME.DASP} rowSpan={1} active={currentOrder === 6} />
            <SubjectCell subjectName={SUBJECT_NAME.ISO} rowSpan={2} active={currentOrder === 10} />
            <SubjectCell subjectName={SUBJECT_NAME.PAR} rowSpan={3} active={currentOrder === 14} />
            <SubjectCell subjectName={SUBJECT_NAME.PAR} rowSpan={2} active={currentOrder === 17} />
            <Shortcut link='https://www.studentspace.app/' imageSrc='/assets/icons/studentspace.svg' />
          </tr>
          <tr>
            <HourCell start='12:35' end='13:25' />
            <SubjectCell subjectName={SUBJECT_NAME.PAR} rowSpan={2} active={currentOrder === 7} />
            <Shortcut link='https://iespabloserrano.aeducar.es/my/courses.php' imageSrc='/assets/icons/aeducar.ico' />
          </tr>
          <tr>
            <HourCell start='13:30' end='14:20' />
            <SubjectCell subjectName={SUBJECT_NAME.INGLES} rowSpan={1} active={currentOrder === 11} />
            <SubjectCell subjectName={SUBJECT_NAME.LM} rowSpan={1} active={currentOrder === 18} />
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

enum SUBJECT_NAME {
  FH = 'FH',
  INGLES = 'IN',
  DASP = 'DASP',
  GBD = 'GBD',
  ISO = 'ISO',
  PAR = 'PAR',
  LM = 'LM',
  IPPE = 'IPPE',
}
interface SubjetCellProps {
  active?: boolean
  rowSpan?: number
  subjectName: SUBJECT_NAME
}

const SubjectCell: React.FC<SubjetCellProps> = props => {
  const { subjectName, active = false, rowSpan = 1 } = props

  return (
    <td
      className={clsx(
        'rounded-xl text-right align-bottom text-white h-20 w-32 px-2 py-1 text-xs',
        active && 'current',
        subjectName.toLowerCase()
      )}
      rowSpan={rowSpan}
    >
      {subjectName}
    </td>
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
