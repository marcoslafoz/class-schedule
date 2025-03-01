import { createBrowserRouter } from 'react-router-dom'
import {
  ScheduleScene,
  RouletteScene,
  RegisterScene,
  CoinFlipScene,
  Roulette50Scene,
} from '../../modules/views'
import { authLoader } from './loaders'

export const router = createBrowserRouter([
  {
    path: '/',
    element: <ScheduleScene />,
    errorElement: <ScheduleScene />,
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
  {
    path: '/coinflip',
    element: <CoinFlipScene />,
    errorElement: <></>,
    loader: authLoader,
  },
  {
    path: '/roulette-50',
    element: <Roulette50Scene />,
    errorElement: <></>,
    loader: authLoader,
  },
  // {
  //   path: '/sports',
  //   element: <SportsScene />,
  //   errorElement: <></>,
  //   loader: authLoader,
  // },
])
