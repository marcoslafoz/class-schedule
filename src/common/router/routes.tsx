import { createBrowserRouter } from 'react-router-dom'
import { ScheduleView } from '../../modules/views'

export const router = createBrowserRouter([
  {
    path: '/',
    element: <ScheduleView />,
    errorElement: <></>,
  },
])
