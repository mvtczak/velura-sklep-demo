export function formatPrice(cents: number) {
  return new Intl.NumberFormat("pl-PL", {
    style: "currency",
    currency: "PLN",
    minimumFractionDigits: 2,
  }).format(cents / 100);
}

// Deterministic, presentable review count derived from the star rating -
// used everywhere a review count is shown so the number stays consistent.
export function reviewCount(rating: number) {
  return Math.max(8, Math.round(rating * 12));
}
