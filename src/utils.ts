/**
 * Given a raw value and a number of decimals, returns a floating point number with the specified number of decimals.
 * @param rawValue - Always a 9 digit number (https://www.inventcom.net/fanuc-focas-library/ncdata/cnc_rdmacro#:~:text=mcr_val%20always%20returns%20by%20nine%20digits%20and%20adjusts%20the%20amount%20with%20the%20value%20of%20dec_val)
 * @param decimals
 * @param digits
 * @returns
 */
export function applyDecimals(
  rawValue: number,
  decimals: number,
  digits = 9,
): number {
  if (decimals === 0) return rawValue;

  const str = Math.abs(rawValue).toString().padStart(digits, "0");
  const sign = rawValue < 0 ? "-" : "";
  const decimal = str.slice(0, -decimals) + "." + str.slice(-decimals);

  return parseFloat(`${sign}${decimal}`);
}
