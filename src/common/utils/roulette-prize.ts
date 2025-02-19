export const GenerateRoulettePrize = (max: number): number => {
  return Math.floor(Math.random() * max)
}
