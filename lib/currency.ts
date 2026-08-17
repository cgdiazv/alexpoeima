/**
 * Utility for formatting numeric amounts according to the merchant's configured store currency.
 * Uses Intl.NumberFormat to support ISO 4217 currency codes (e.g. HNL, USD, EUR, MXN, CAD, GBP).
 */
export function formatCurrency(amount: number, currency: string = "USD"): string {
  if (isNaN(amount)) amount = 0;
  const currencyCode = (currency || "USD").toUpperCase();
  try {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: currencyCode,
    }).format(amount);
  } catch (e) {
    return `${currencyCode} ${amount.toFixed(2)}`;
  }
}
