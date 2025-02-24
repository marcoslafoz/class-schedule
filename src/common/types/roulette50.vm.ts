import { WheelData } from 'react-custom-roulette/dist/components/Wheel/types'

export interface Roulette50Option extends WheelData, Roulette50PrizeOption {}

export interface Roulette50PrizeOption {
  prize: ROULETTE50_PRIZE_OPTIONS_ENUM | number
  title: string
}

export interface Roulette50Form {
  aprobado: number
  suspenso: number
}

export enum ROULETTE50_PRIZE_OPTIONS_ENUM {
  APROBADO = 1,
  SUSPENSO = 0,
}

export enum ROULETTE50_PRIZE_COLOR_ENUM {
  APROBADO = '#383838',
  SUSPENSO = '#b53224',
}

export enum ROULETTE50_PRIZE_OPTION_TITLE_ENUM {
  APROBADO = 'A+',
  SUSPENSO = 'F',
}
