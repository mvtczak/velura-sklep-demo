export const BUNDLE_SIZE = 3;
export const BUNDLE_DISCOUNT_PERCENT = 15;

export type BundleCartItem = {
  id: string;
  priceCents: number;
  category: string;
  quantity: number;
};

/**
 * Validates and prices bundle groups against authoritative data (DB prices
 * and categories, and the quantities actually present in the cart/order).
 * Never trusts a client-sent discount amount - only product IDs are used to
 * look up real prices/categories, and a group only earns the discount when
 * it genuinely satisfies the rule: exactly BUNDLE_SIZE distinct products
 * from BUNDLE_SIZE distinct categories, each with at least one unit
 * available to consume. Returns the total discount in cents.
 */
export function computeBundleDiscountCents(
  cartItems: BundleCartItem[],
  bundleGroups: string[][] | undefined
): number {
  if (!bundleGroups?.length) return 0;

  const byId = new Map(cartItems.map((item) => [item.id, item]));
  const remaining = new Map(cartItems.map((item) => [item.id, item.quantity]));
  let discountCents = 0;

  for (const group of bundleGroups) {
    const ids = Array.from(new Set(group));
    if (ids.length !== BUNDLE_SIZE) continue;

    const items = ids
      .map((id) => byId.get(id))
      .filter((item): item is BundleCartItem => Boolean(item));
    if (items.length !== BUNDLE_SIZE) continue;

    if (!ids.every((id) => (remaining.get(id) ?? 0) >= 1)) continue;

    const categories = new Set(items.map((item) => item.category));
    if (categories.size !== BUNDLE_SIZE) continue;

    ids.forEach((id) => remaining.set(id, (remaining.get(id) ?? 0) - 1));

    const subtotal = items.reduce((sum, item) => sum + item.priceCents, 0);
    discountCents += Math.round((subtotal * BUNDLE_DISCOUNT_PERCENT) / 100);
  }

  return discountCents;
}
