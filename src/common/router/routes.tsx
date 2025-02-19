import { createBrowserRouter } from 'react-router-dom'
import { ScheduleScene, RouletteScene, RegisterScene } from '../../modules/views'
import { authLoader } from './loaders'

export const router = createBrowserRouter([
  {
    path: '/',
    element: <ScheduleScene />,
    errorElement: <></>,
  },
  {
    path: '/register',
    element: <RegisterScene />,
    errorElement: <></>,
  },
  {
    path: '/roulette',
    element: <RouletteScene />,
    errorElement: <></>,
    loader: authLoader,
  },
])
