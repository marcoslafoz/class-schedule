import { createBrowserRouter } from 'react-router-dom'
import { ScheduleView } from '../../modules/components/schedule-view'

export const router = createBrowserRouter([
  {
    path: '/',
    element: <ScheduleView />,
    errorElement: <></>,
  },
])
