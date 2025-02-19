import { WheelData } from 'react-custom-roulette/dist/components/Wheel/types'

export interface RouletteOption extends WheelData, PrizeOption {}

export interface PrizeOption {
  prize: PRIZE_OPTIONS_ENUM
  title: string
}

export interface RouletteForm {
  x1: number
  x3: number
  x5: number
  x10: number
  x20: number
}

export enum PRIZE_OPTIONS_ENUM {
  X1 = 1,
  X3 = 3,
  X5 = 5,
  X10 = 10,
  X20 = 20,
}

export enum PRIZE_COLOR_ENUM {
  X1 = '#383838',
  X3 = '#f1c40f',
  X5 = '#3498db',
  X10 = '#9b59b6',
  X20 = '#e74c3c',
}

export enum PRIZE_OPTION_TITLE_ENUM {
  X1 = 'PAR x1',
  X3 = 'GBD x3',
  X5 = 'ISO x5',
  X10 = 'INGLÉS x10',
  X20 = 'DASP x20',
}
