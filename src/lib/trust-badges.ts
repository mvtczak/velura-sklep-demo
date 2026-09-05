export type TrustIcon = "shield" | "heart" | "sparkle" | "drop" | "leaf" | "gift";

export type TrustBadge = {
  label: string;
  icon: TrustIcon;
};

const CATEGORY_BADGES: Record<string, TrustBadge> = {
  "Pielęgnacja twarzy": { label: "Dermo-testowane", icon: "shield" },
  "Makijaż": { label: "Nietestowane na zwierzętach", icon: "heart" },
  "Perfumy": { label: "100% oryginalne", icon: "sparkle" },
  "Włosy": { label: "Bez SLS", icon: "drop" },
  "Ciało": { label: "Naturalne składniki", icon: "leaf" },
  "Zestawy": { label: "Idealne na prezent", icon: "gift" },
};

const DEFAULT_BADGE: TrustBadge = { label: "Sprawdzona jakość", icon: "shield" };

export function getTrustBadge(category: string): TrustBadge {
  return CATEGORY_BADGES[category] ?? DEFAULT_BADGE;
}

// Simple hand-drawn icon paths (viewBox 0 0 20 20), matching the inline SVG
// style already used across the site instead of pulling in an icon library.
export const TRUST_ICON_PATHS: Record<TrustIcon, string> = {
  shield: "M10 2l7 3v5c0 5-3.5 7.5-7 8-3.5-.5-7-3-7-8V5l7-3Z",
  heart: "M10 17s-6-3.5-6-8a3.5 3.5 0 0 1 6-2.4A3.5 3.5 0 0 1 16 9c0 4.5-6 8-6 8Z",
  sparkle: "M10 2l1.5 5L17 9l-5.5 2L10 16l-1.5-5L3 9l5.5-2L10 2Z",
  drop: "M10 2s6 6.5 6 10.5A6 6 0 1 1 4 12.5C4 8.5 10 2 10 2Z",
  leaf: "M4 16C4 8 12 4 18 4c0 6-4 14-12 14-2 0-3-.5-3-.5",
  gift: "M4 8h12v10H4V8Zm-1-3h14v3H3V5Zm7 0v13",
};
