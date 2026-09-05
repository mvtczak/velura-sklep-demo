export type Undertone = "cool" | "neutral" | "warm";

export type Shade = {
  id: string;
  name: string;
  hex: string;
  undertone: Undertone;
  depth: number; // 1 (lightest) - 4 (darkest)
};

// 12 shades = 4 depth levels x 3 undertones, matching the "12 odcieniach"
// mentioned in the Silk Veil product description.
export const SHADES: Shade[] = [
  { id: "10c", name: "Voile 10 — Porcelaine", hex: "#F6E1D3", undertone: "cool", depth: 1 },
  { id: "20c", name: "Voile 20 — Ivoire", hex: "#EFD0BA", undertone: "cool", depth: 2 },
  { id: "30c", name: "Voile 30 — Beige Rosé", hex: "#E0B592", undertone: "cool", depth: 3 },
  { id: "40c", name: "Voile 40 — Café au Lait", hex: "#B98764", undertone: "cool", depth: 4 },
  { id: "10n", name: "Voile 10 — Vanille", hex: "#F3DFC9", undertone: "neutral", depth: 1 },
  { id: "20n", name: "Voile 20 — Sable", hex: "#E7C6A2", undertone: "neutral", depth: 2 },
  { id: "30n", name: "Voile 30 — Miel", hex: "#CC9C6E", undertone: "neutral", depth: 3 },
  { id: "40n", name: "Voile 40 — Noisette", hex: "#9C6C45", undertone: "neutral", depth: 4 },
  { id: "10w", name: "Voile 10 — Champagne", hex: "#F1DEC0", undertone: "warm", depth: 1 },
  { id: "20w", name: "Voile 20 — Miel Doré", hex: "#E3C08D", undertone: "warm", depth: 2 },
  { id: "30w", name: "Voile 30 — Ambre", hex: "#C6935C", undertone: "warm", depth: 3 },
  { id: "40w", name: "Voile 40 — Caramel Doré", hex: "#9E6836", undertone: "warm", depth: 4 },
];

export const UNDERTONE_QUESTIONS: {
  value: Undertone;
  label: string;
  desc: string;
}[] = [
  {
    value: "cool",
    label: "Chłodny",
    desc: "Skóra łatwo się czerwieni, żyły na nadgarstku wyglądają niebiesko-fioletowo.",
  },
  {
    value: "neutral",
    label: "Neutralny",
    desc: "Coś pomiędzy — czasem się opala, czasem tylko piecze na słońcu.",
  },
  {
    value: "warm",
    label: "Ciepły",
    desc: "Skóra łatwo się opala, żyły na nadgarstku wyglądają raczej zielonkawo.",
  },
];

// Reference swatches for the depth question, shown independent of undertone.
export const DEPTH_QUESTIONS: { depth: number; label: string; hex: string }[] = [
  { depth: 1, label: "Bardzo jasna", hex: "#F3DFC9" },
  { depth: 2, label: "Jasna", hex: "#E7C6A2" },
  { depth: 3, label: "Średnia", hex: "#CC9C6E" },
  { depth: 4, label: "Ciemna", hex: "#9C6C45" },
];

export function findShade(undertone: Undertone, depth: number): Shade | null {
  return SHADES.find((s) => s.undertone === undertone && s.depth === depth) ?? null;
}
