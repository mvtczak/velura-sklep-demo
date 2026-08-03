import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const img = (id: string) =>
  `https://images.unsplash.com/photo-${id}?q=80&w=800&auto=format&fit=crop`;

const products = [
  {
    slug: "serum-witamina-c-20",
    name: "Serum z witaminą C 20%",
    category: "Pielęgnacja twarzy",
    description:
      "Skoncentrowane serum rozjaśniające przebarwienia i wygładzające teksturę skóry. 30ml, do stosowania na noc.",
    priceCents: 12900,
    image: img("1580870069867-74c57ee1bb07"),
    badge: "Bestseller",
    rating: 4.9,
  },
  {
    slug: "krem-aqua-bloom",
    name: "Krem nawilżający Aqua Bloom",
    category: "Pielęgnacja twarzy",
    description:
      "Lekki krem żelowy z kwasem hialuronowym na bazie ekstraktu z aloesu. 50ml, do każdego typu skóry.",
    priceCents: 8900,
    image: img("1596462502278-27bfdc403348"),
    badge: null,
    rating: 4.7,
  },
  {
    slug: "rytual-night-ritual-set",
    name: "Rytuał pielęgnacyjny Night Ritual Set",
    category: "Pielęgnacja twarzy",
    description:
      "Zestaw trzech produktów na wieczorną pielęgnację: olejek micelarny, serum i krem regenerujący.",
    priceCents: 21900,
    image: img("1571875257727-256c39da42af"),
    badge: "Zestaw",
    rating: 4.9,
  },
  {
    slug: "podklad-silk-veil",
    name: "Rozświetlający podkład Silk Veil",
    category: "Makijaż",
    description:
      "Podkład o lekkim, jedwabistym wykończeniu z filtrem SPF 15. Dostępny w 12 odcieniach.",
    priceCents: 14900,
    image: img("1620916566398-39f1143ab7be"),
    badge: "Nowość",
    rating: 4.6,
  },
  {
    slug: "pomadka-velvet-rouge",
    name: "Matowa pomadka Velvet Rouge",
    category: "Makijaż",
    description:
      "Matowa pomadka o intensywnym kolorze i aksamitnym wykończeniu, nie wysusza ust.",
    priceCents: 6900,
    image: img("1571781926291-c477ebfd024b"),
    badge: null,
    rating: 4.8,
  },
  {
    slug: "zestaw-pedzli-pro",
    name: "Zestaw pędzli Makeup Pro Set",
    category: "Makijaż",
    description:
      "Komplet 8 pędzli do makijażu z włosia syntetycznego, w eleganckim etui podróżnym.",
    priceCents: 17900,
    image: img("1608248543803-ba4f8c70ae0b"),
    badge: null,
    rating: 4.7,
  },
  {
    slug: "perfumy-amber-nights",
    name: "Perfumy Amber Nights EDP 50ml",
    category: "Perfumy",
    description:
      "Rozgrzewający zapach z nutami bursztynu, wanilii i drzewa sandałowego. Trwałość do 8h.",
    priceCents: 25900,
    image: img("1601049541289-9b1b7bbbfe19"),
    badge: "Bestseller",
    rating: 4.9,
  },
  {
    slug: "perfumy-blossom-rain",
    name: "Perfumy Blossom Rain EDP 50ml",
    category: "Perfumy",
    description:
      "Świeży, kwiatowy zapach z akcentem piwonii i białej herbaty. Idealny na co dzień.",
    priceCents: 24900,
    image: img("1585652757173-57de5e9fab42"),
    badge: null,
    rating: 4.6,
  },
  {
    slug: "szampon-silk-repair",
    name: "Szampon regenerujący Silk Repair",
    category: "Włosy",
    description:
      "Szampon bez SLS z keratyną, odbudowuje włosy zniszczone zabiegami i stylizacją. 250ml.",
    priceCents: 7900,
    image: img("1560066984-138dadb4c035"),
    badge: null,
    rating: 4.5,
  },
  {
    slug: "maska-glow-hair",
    name: "Odżywka-maska Glow Hair Mask",
    category: "Włosy",
    description:
      "Intensywnie odżywcza maska z olejkiem arganowym, nadaje włosom blask i miękkość. 200ml.",
    priceCents: 8500,
    image: img("1522337360788-8b13dee7a37e"),
    badge: null,
    rating: 4.7,
  },
  {
    slug: "olejek-golden-drop",
    name: "Olejek do ciała Golden Drop",
    category: "Ciało",
    description:
      "Suchy olejek z drobinkami rozświetlającymi, szybko się wchłania i nie zostawia tłustej warstwy.",
    priceCents: 9500,
    image: img("1487412947147-5cebf100ffc2"),
    badge: "Nowość",
    rating: 4.8,
  },
  {
    slug: "peeling-sweet-glow",
    name: "Peeling cukrowy Sweet Glow",
    category: "Ciało",
    description:
      "Peeling na bazie cukru trzcinowego i masła shea, złuszcza i intensywnie nawilża skórę. 250ml.",
    priceCents: 6500,
    image: img("1598452963314-b09f397a5c48"),
    badge: null,
    rating: 4.6,
  },
  {
    slug: "beauty-box-powitalny",
    name: "Zestaw powitalny Beauty Box",
    category: "Zestawy",
    description:
      "Pięć produktów w miniaturkach do przetestowania naszej pielęgnacji, w eleganckim pudełku.",
    priceCents: 19900,
    image: img("1522335789203-aabd1fc54bc9"),
    badge: "Limitowana edycja",
    rating: 5.0,
  },
];


const firstNames = [
  "Anna", "Katarzyna", "Magdalena", "Agnieszka", "Aleksandra", "Natalia",
  "Karolina", "Paulina", "Monika", "Weronika", "Julia", "Zofia",
  "Jakub", "Piotr", "Michał", "Tomasz", "Krzysztof", "Adam",
  "Marcin", "Bartosz", "Dawid", "Kamil", "Łukasz", "Patryk",
];

const lastNames = [
  "Kowalska", "Nowak", "Wiśniewska", "Wójcik", "Kowalczyk", "Kamińska",
  "Lewandowska", "Zielińska", "Szymańska", "Woźniak", "Dąbrowska", "Kozłowska",
  "Kowalski", "Nowicki", "Wójcicki", "Kamiński", "Lewandowski", "Zieliński",
  "Szymański", "Wojciechowski", "Dąbrowski", "Kozłowski", "Jankowski", "Mazur",
];

const cities: { city: string; postalCode: string }[] = [
  { city: "Warszawa", postalCode: "00-001" },
  { city: "Kraków", postalCode: "30-002" },
  { city: "Wrocław", postalCode: "50-003" },
  { city: "Poznań", postalCode: "60-004" },
  { city: "Gdańsk", postalCode: "80-005" },
  { city: "Łódź", postalCode: "90-006" },
  { city: "Szczecin", postalCode: "70-007" },
  { city: "Katowice", postalCode: "40-008" },
  { city: "Lublin", postalCode: "20-009" },
  { city: "Białystok", postalCode: "15-010" },
  { city: "Rzeszów", postalCode: "35-011" },
  { city: "Gdynia", postalCode: "81-012" },
];

const streets = [
  "Kwiatowa", "Słoneczna", "Leśna", "Ogrodowa", "Polna", "Krótka",
  "Długa", "Szkolna", "Parkowa", "Spokojna", "Zielona", "Wiśniowa",
  "Lipowa", "Brzozowa", "Klonowa", "Akacjowa", "Sportowa", "Graniczna",
];

function pick<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function randomPastDate(maxDaysAgo: number): Date {
  // Skew towards more recent days for a realistic growth curve.
  const t = Math.pow(Math.random(), 1.6);
  const daysAgo = t * maxDaysAgo;
  const ms = daysAgo * 24 * 60 * 60 * 1000;
  const jitter = Math.random() * 24 * 60 * 60 * 1000;
  return new Date(Date.now() - ms - jitter);
}

const SHIPPING_CENTS = 1500;
const FREE_SHIPPING_THRESHOLD = 20000;

async function seedFakeOrders() {
  const existingOrders = await prisma.order.count();
  if (existingOrders > 0) {
    console.log(`Orders already present (${existingOrders}), skipping fake order seed.`);
    return;
  }

  const allProducts = await prisma.product.findMany();
  const ORDER_COUNT = 64;

  for (let i = 0; i < ORDER_COUNT; i++) {
    const firstName = pick(firstNames);
    const lastName = pick(lastNames);
    const { city, postalCode } = pick(cities);
    const street = pick(streets);
    const houseNumber = 1 + Math.floor(Math.random() * 98);
    const email = `${firstName.toLowerCase()}.${lastName.toLowerCase()}@example.com`;

    const itemCount = 1 + Math.floor(Math.random() * 3);
    const chosen = new Set<string>();
    while (chosen.size < itemCount) {
      chosen.add(pick(allProducts).id);
    }

    const items = Array.from(chosen).map((productId) => {
      const product = allProducts.find((p) => p.id === productId)!;
      const quantity = 1 + Math.floor(Math.random() * 2);
      return { productId, quantity, priceCents: product.priceCents };
    });

    const subtotal = items.reduce((sum, it) => sum + it.priceCents * it.quantity, 0);
    const shipping = subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : SHIPPING_CENTS;
    const totalCents = subtotal + shipping;
    const createdAt = randomPastDate(35);
    const status = Math.random() < 0.9 ? "paid" : "pending";

    await prisma.order.create({
      data: {
        email,
        name: `${firstName} ${lastName}`,
        address: `ul. ${street} ${houseNumber}`,
        city,
        postalCode,
        totalCents,
        status,
        createdAt,
        items: { create: items },
      },
    });
  }

  console.log(`Seeded ${ORDER_COUNT} fake demo orders.`);
}

async function main() {
  console.log("Seeding database...");
  for (const p of products) {
    await prisma.product.upsert({
      where: { slug: p.slug },
      update: p,
      create: p,
    });
  }
  console.log(`Seeded ${products.length} products.`);

  await seedFakeOrders();
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
