import { UserBet } from './user.vm'

export interface Match {
  id: number
  team_1: Team
  team_2: Team
  odds: Odds
  date: string
  bets: Bet[]
}

export interface Team {
  name: string
  logo: string
}

interface Odds {
  odd_1: number
  odd_x: number
  odd_2: number
}

export enum OddOptionEnum {
  ODD_1 = '1',
  ODD_X = 'x',
  ODD_2 = '2',
}

export interface Bet {
  user: UserBet
  match_id: number
  amount: number
  bet_option: OddOptionEnum
}

export interface NewBetForm {
  amount: number
}
