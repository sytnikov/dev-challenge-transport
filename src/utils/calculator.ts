export function convertToKmH(speed: number): number {
  return parseFloat((speed * 3.6).toFixed(2))
}