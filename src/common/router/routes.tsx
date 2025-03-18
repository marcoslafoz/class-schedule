import { createBrowserRouter, Navigate } from 'react-router-dom'
import { ScheduleScene, RouletteScene, RegisterScene, CoinFlipScene, Roulette50Scene } from '../../modules/views'
import { authLoader } from './loaders'

export const router = createBrowserRouter([
  {
    path: '/',
    element: <ScheduleScene />,
    errorElement: <Navigate to={'/'}/>,
  },
  {
    path: '/register',
    element: <RegisterScene />,
    errorElement: <Navigate to={'/'} />,
  },
  {
    path: '/roulette',
    element: <RouletteScene />,
    errorElement: <Navigate to={'/'} />,
    loader: authLoader,
  },
  {
    path: '/coinflip',
    element: <CoinFlipScene />,
    errorElement: <Navigate to={'/'} />,
    loader: authLoader,
  },
  {
    path: '/roulette-50',
    element: <Roulette50Scene />,
    errorElement: <Navigate to={'/'} />,
    loader: authLoader,
  },
  // {
  //   path: '/sports',
  //   element: <SportsScene />,
  //   errorElement: <Navigate to={'/'} />,
  //   loader: authLoader,
  // },
])
