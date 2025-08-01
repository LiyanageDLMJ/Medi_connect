export const parseTuitionFee = (fee: string): number => {
  const numericFee = parseFloat(fee.replace(/[^0-9.]/g, ''));
  return isNaN(numericFee) ? 0 : numericFee;
};