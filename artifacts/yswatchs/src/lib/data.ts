export type Category = 'homme' | 'femme' | 'ceinture' | 'parfum' | 'collection';

export interface Product {
  id: string;
  name: string;
  category: Category;
  price: number;
  description: string;
  images: string[];
  inStock: boolean;
  isNew: boolean;
  isBestSeller: boolean;
}

export const products: Product[] = [
  {
    id: "m1",
    name: "Obsidian I",
    category: "homme",
    price: 1850,
    description: "Une masterclass de discrétion. Le cadran noir mat absorbe la lumière, tandis que les aiguilles en or rose guident le temps dans l'obscurité. Un chronographe pour ceux qui préfèrent rester dans l'ombre tout en dominant la pièce.",
    images: [
      "https://images.unsplash.com/photo-1587836374828-4dbafa94cf0e?w=800&q=90",
      "https://images.unsplash.com/photo-1523170335258-f5ed11844a49?w=800&q=90",
      "https://images.unsplash.com/photo-1548171915-e79a6e4abf91?w=800&q=90",
    ],
    inStock: true,
    isNew: true,
    isBestSeller: true,
  },
  {
    id: "m2",
    name: "Atlas Noir",
    category: "homme",
    price: 2200,
    description: "Inspirée des premiers explorateurs, l'Atlas Noir allie l'élégance d'une montre habillée à la robustesse d'un instrument de navigation. Bracelet en cuir vieilli, âme d'aventurier.",
    images: [
      "https://images.unsplash.com/photo-1542496658-e33a6d0d56f6?w=800&q=90",
      "https://images.unsplash.com/photo-1594576722512-582bcd6571ac?w=800&q=90",
      "https://images.unsplash.com/photo-1523170335258-f5ed11844a49?w=800&q=90",
    ],
    inStock: true,
    isNew: false,
    isBestSeller: false,
  },
  {
    id: "m3",
    name: "Chronos VII",
    category: "homme",
    price: 2800,
    description: "L'art mécanique à l'état pur. Le cadran squelette révèle les battements de son cœur, protégé par un boîtier en acier brossé. Pour ceux qui chérissent la précision absolue.",
    images: [
      "https://images.unsplash.com/photo-1594576722512-582bcd6571ac?w=800&q=90",
      "https://images.unsplash.com/photo-1587836374828-4dbafa94cf0e?w=800&q=90",
      "https://images.unsplash.com/photo-1548171915-e79a6e4abf91?w=800&q=90",
    ],
    inStock: false,
    isNew: false,
    isBestSeller: true,
  },
  {
    id: "m4",
    name: "Meridian",
    category: "homme",
    price: 1650,
    description: "Un hommage aux navigateurs célestes. Le cadran bleu profond contraste avec les index lumineux. Une lisibilité parfaite, de jour comme de nuit, sur terre comme en mer.",
    images: [
      "https://images.unsplash.com/photo-1548171915-e79a6e4abf91?w=800&q=90",
      "https://images.unsplash.com/photo-1542496658-e33a6d0d56f6?w=800&q=90",
      "https://images.unsplash.com/photo-1587836374828-4dbafa94cf0e?w=800&q=90",
    ],
    inStock: true,
    isNew: false,
    isBestSeller: false,
  },
  {
    id: "m5",
    name: "Solstice",
    category: "homme",
    price: 1950,
    description: "L'équilibre parfait entre lumière et matière. Un design intemporel qui capture l'essence du mouvement solaire, avec un boîtier d'une finesse incomparable et un cadran guilloché à la main.",
    images: [
      "https://images.unsplash.com/photo-1523170335258-f5ed11844a49?w=800&q=90",
      "https://images.unsplash.com/photo-1594576722512-582bcd6571ac?w=800&q=90",
      "https://images.unsplash.com/photo-1542496658-e33a6d0d56f6?w=800&q=90",
    ],
    inStock: true,
    isNew: false,
    isBestSeller: false,
  },
  {
    id: "m6",
    name: "Eclipse Pro",
    category: "homme",
    price: 2450,
    description: "Quand la lune rencontre le soleil. Une complication phase de lune exceptionnelle, nichée dans un boîtier aux reflets profonds et mystérieux. Le temps absolu, capturé.",
    images: [
      "https://images.unsplash.com/photo-1607703703520-bb638e84caf2?w=800&q=90",
      "https://images.unsplash.com/photo-1548171915-e79a6e4abf91?w=800&q=90",
      "https://images.unsplash.com/photo-1523170335258-f5ed11844a49?w=800&q=90",
    ],
    inStock: true,
    isNew: true,
    isBestSeller: false,
  },
  {
    id: "f1",
    name: "Lumière",
    category: "femme",
    price: 1550,
    description: "Délicate, éthérée, intemporelle. Le cadran en nacre capture chaque nuance de lumière, habillé d'un délicat bracelet en maille milanaise dorée. Pour celles qui portent la lumière.",
    images: [
      "https://images.unsplash.com/photo-1611689102192-1f6e0e52df0a?w=800&q=90",
      "https://images.unsplash.com/photo-1616251025-75ba3b32a15e?w=800&q=90",
      "https://images.unsplash.com/photo-1508057198894-247b23fe5ade?w=800&q=90",
    ],
    inStock: true,
    isNew: true,
    isBestSeller: true,
  },
  {
    id: "f2",
    name: "Aurore",
    category: "femme",
    price: 1400,
    description: "La pureté du matin capturée dans l'or. Son cadran champagne soleil s'harmonise parfaitement avec la chaleur de son bracelet en cuir bordeaux. Un éveil élégant.",
    images: [
      "https://images.unsplash.com/photo-1508057198894-247b23fe5ade?w=800&q=90",
      "https://images.unsplash.com/photo-1611689102192-1f6e0e52df0a?w=800&q=90",
      "https://images.unsplash.com/photo-1616251025-75ba3b32a15e?w=800&q=90",
    ],
    inStock: true,
    isNew: false,
    isBestSeller: false,
  },
  {
    id: "f3",
    name: "Céleste",
    category: "femme",
    price: 2100,
    description: "Un fragment du ciel à votre poignet. Le cadran étoilé bleu nuit évoque la poésie nocturne, surmonté d'un boîtier aux lignes douces et fluides qui épousent le geste.",
    images: [
      "https://images.unsplash.com/photo-1616251025-75ba3b32a15e?w=800&q=90",
      "https://images.unsplash.com/photo-1508057198894-247b23fe5ade?w=800&q=90",
      "https://images.unsplash.com/photo-1611689102192-1f6e0e52df0a?w=800&q=90",
    ],
    inStock: false,
    isNew: false,
    isBestSeller: true,
  },
  {
    id: "f4",
    name: "Venus",
    category: "femme",
    price: 1850,
    description: "Une déclaration d'amour à l'époque Art Déco. Le boîtier rectangulaire, les chiffres romains classiques, et le cuir alligator verni signent un chef-d'œuvre de l'élégance féminine.",
    images: [
      "https://images.unsplash.com/photo-1548171915-e79a6e4abf91?w=800&q=90",
      "https://images.unsplash.com/photo-1611689102192-1f6e0e52df0a?w=800&q=90",
      "https://images.unsplash.com/photo-1616251025-75ba3b32a15e?w=800&q=90",
    ],
    inStock: true,
    isNew: false,
    isBestSeller: false,
  },
  {
    id: "f5",
    name: "Ivoire",
    category: "femme",
    price: 1450,
    description: "La grâce de la simplicité absolue. Un cadran minimaliste, un profil ultra-plat. L'accessoire définitif pour parfaire une silhouette élégante sans jamais en faire trop.",
    images: [
      "https://images.unsplash.com/photo-1508057198894-247b23fe5ade?w=800&q=90",
      "https://images.unsplash.com/photo-1616251025-75ba3b32a15e?w=800&q=90",
      "https://images.unsplash.com/photo-1611689102192-1f6e0e52df0a?w=800&q=90",
    ],
    inStock: true,
    isNew: false,
    isBestSeller: false,
  },
  {
    id: "f6",
    name: "Saphir",
    category: "femme",
    price: 2600,
    description: "La noblesse des matériaux rares. Un boîtier serti de détails précieux et un verre saphir de haute qualité, reflétant l'exigence et le savoir-faire de nos ateliers centenaires.",
    images: [
      "https://images.unsplash.com/photo-1616251025-75ba3b32a15e?w=800&q=90",
      "https://images.unsplash.com/photo-1508057198894-247b23fe5ade?w=800&q=90",
      "https://images.unsplash.com/photo-1548171915-e79a6e4abf91?w=800&q=90",
    ],
    inStock: true,
    isNew: false,
    isBestSeller: false,
  },
  {
    id: "a1",
    name: "Ceinture Royale",
    category: "ceinture",
    price: 320,
    description: "Un cuir pleine fleur patiné à la main qui traversera les décennies. La boucle dorée aux gravures complexes témoigne d'une attention aux détails obsessionnelle, digne d'un atelier de haute couture.",
    images: [
      "https://images.unsplash.com/photo-1553803834-a67e54b9b6ce?w=800&q=90",
    ],
    inStock: true,
    isNew: false,
    isBestSeller: true,
  },
  {
    id: "a2",
    name: "Eau de Chronos",
    category: "parfum",
    price: 180,
    description: "L'odeur des ateliers parisiens en flacon. Des notes de tête de bergamote et poivre noir, un cœur cuir et iris, et un fond d'ambre et bois de oud. L'essence même du temps suspendu.",
    images: [
      "https://images.unsplash.com/photo-1541643600914-78b084683702?w=800&q=90",
    ],
    inStock: true,
    isNew: true,
    isBestSeller: false,
  },
];

export const getProductsByCategory = (category: Category | 'all') => {
  if (category === 'all') return products;
  return products.filter(p => p.category === category);
};

export const getProductById = (id: string) => {
  return products.find(p => p.id === id);
};

export const formatPrice = (price: number) => {
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: 'EUR',
    minimumFractionDigits: 0,
  }).format(price);
};
