export const GenerateRoulettePrize = (max: number): number => {
  return crypto.getRandomValues(new Uint32Array(1))[0] % max
}
