import { createBrowserRouter, Navigate } from 'react-router-dom'
import {
  ScheduleScene,
  RouletteScene,
  RegisterScene,
  CoinFlipScene,
  Roulette50Scene,
  BlackjackScene,
  SlotScene,
} from '../../modules/views'
import { authLoader } from './loaders'

export const router = createBrowserRouter([
  {
    path: '/',
    element: <ScheduleScene />,
    errorElement: <Navigate to='/' />,
  },
  {
    path: '/register',
    element: <RegisterScene />,
    errorElement: <Navigate to='/' />,
  },
  {
    path: '/roulette',
    element: <RouletteScene />,
    errorElement: <Navigate to='/' />,
    loader: authLoader,
  },
  {
    path: '/coinflip',
    element: <CoinFlipScene />,
    errorElement: <Navigate to='/' />,
    loader: authLoader,
  },
  {
    path: '/roulette-50',
    element: <Roulette50Scene />,
    errorElement: <Navigate to='/' />,
    loader: authLoader,
  },
  {
    path: '/blackjack',
    element: <BlackjackScene />,
    errorElement: <Navigate to='/' />,
    loader: authLoader,
  },
  {
    path: '/slot',
    element: <SlotScene />,
    errorElement: <Navigate to='/' />,
    loader: authLoader,
  },
])
