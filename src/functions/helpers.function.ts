export function getRandomNumber(number: number) {
  const maxValue = Math.max(0, Math.floor(number));
  return Math.floor(Math.random() * maxValue);
}
