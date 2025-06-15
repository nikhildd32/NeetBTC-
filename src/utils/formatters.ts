/**
 * Format a BTC amount to a readable string with units
 */
export const formatBTC = (amount: number): string => {
  if (amount >= 1) {
    return `${amount.toFixed(8)} BTC`;
  } else if (amount >= 0.001) {
    return `${(amount * 1000).toFixed(5)} mBTC`;
  } else if (amount >= 0.000001) {
    return `${(amount * 1000000).toFixed(2)} μBTC`;
  } else {
    return `${(amount * 100000000).toFixed(0)} sats`;
  }
};

/**
 * Format a satoshi amount to a readable string
 */
export const formatSats = (sats: number): string => {
  if (sats >= 100000000) {
    return `${(sats / 100000000).toFixed(2)} BTC`;
  } else if (sats >= 1000) {
    return `${sats.toLocaleString()} sats`;
  } else {
    return `${sats} sats`;
  }
};

/**
 * Format a fee rate (sats/vB) to a readable string
 */
export const formatFeeRate = (feeRate: number): string => {
  return `${feeRate.toFixed(1)} sat/vB`;
};

/**
 * Format a timestamp to a readable date string
 */
export const formatTime = (timestamp: number): string => {
  const date = new Date(timestamp * 1000);
  return date.toLocaleString();
};

/**
 * Format a transaction ID to a shortened form
 */
export const shortenTxid = (txid: string): string => {
  return `${txid.substring(0, 8)}...${txid.substring(txid.length - 8)}`;
};

/**
 * Format a number to a readable string with commas
 */
export const formatNumber = (num: number): string => {
  return num.toLocaleString();
};