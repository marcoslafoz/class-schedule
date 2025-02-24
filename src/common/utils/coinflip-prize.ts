export const GenerateCoinFlipPrize = () => {
  return crypto.getRandomValues(new Uint8Array(1))[0] % 2
}
