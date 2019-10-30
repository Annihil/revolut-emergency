export const sign = (amount: number) => {
  if (Math.sign(amount) === 0)
    return '';
  if (Math.sign(amount) === 1)
    return '+';
  if (Math.sign(amount) === -1)
    return '-';
};

export const amountFmt = (amount: number) => (Math.abs(amount) / 100).toFixed(2).replace('.00', '');
