export function calculateRate(amount, exchangeRate) {
  const markup = 0.005;
  let paytonRate = exchangeRate - exchangeRate * markup;
  let result = paytonRate * amount;
  return (Math.round(result * 100) / 100).toFixed(2);
}
