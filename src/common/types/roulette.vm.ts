import { WheelData } from 'react-custom-roulette/dist/components/Wheel/types'

export interface RouletteOption extends WheelData, RoulettePrizeOption {}

export interface RoulettePrizeOption {
  prize: ROULETTE_PRIZE_OPTIONS_ENUM | number
  title: string
}

export interface RouletteForm {
  x1: number
  x3: number
  x5: number
  x10: number
  x20: number
}

export enum ROULETTE_PRIZE_OPTIONS_ENUM {
  X1 = 1,
  X3 = 3,
  X5 = 5,
  X10 = 10,
  X20 = 20,
}

export enum ROULETTE_PRIZE_COLOR_ENUM {
  X1 = '#383838',
  X3 = '#f1c40f',
  X5 = '#3498db',
  X10 = '#9b59b6',
  X20 = '#e74c3c',
}

export enum ROULETTE_PRIZE_OPTION_TITLE_ENUM {
  X1 = 'x1',
  X3 = 'x3',
  X5 = 'x5',
  X10 = 'x10',
  X20 = 'x20',
}
