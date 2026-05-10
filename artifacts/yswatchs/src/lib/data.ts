import { watchGold, watchSilver, watchBlue } from './watch-images';

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
    name: "Herbelin Classic Or",
    category: "homme",
    price: 1850,
    description: "Une montre d'une élégance intemporelle. Le cadran blanc guilloché habillé de chiffres romains, enchâssé dans un boîtier doré finement poli. Bracelet alligator brun à grain serré — la définition du classicisme horloger.",
    images: [watchGold, watchSilver, watchBlue],
    inStock: true,
    isNew: true,
    isBestSeller: true,
  },
  {
    id: "m2",
    name: "Herbelin Acier",
    category: "homme",
    price: 1450,
    description: "La sobriété portée à son sommet. Boîtier acier brossé, cadran opalin blanc, index romains noirs — cette montre parle à ceux qui croient que le style n'a pas besoin de crier. Bracelet cuir noir véritablement vieilli à la main.",
    images: [watchSilver, watchGold, watchBlue],
    inStock: true,
    isNew: false,
    isBestSeller: true,
  },
  {
    id: "m3",
    name: "Tissot Le Locle Bleu",
    category: "homme",
    price: 2200,
    description: "Inspiration directe des ateliers suisses de 1853. Le cadran bleu profond Powermatic 80 révèle un guillochage subtil sous la lumière. Bracelet acier milanais brillant pour une silhouette affirmée et précise.",
    images: [watchBlue, watchGold, watchSilver],
    inStock: true,
    isNew: true,
    isBestSeller: true,
  },
  {
    id: "m4",
    name: "Herbelin Prestige Or",
    category: "homme",
    price: 2600,
    description: "La version prestige de notre bestseller. Mouvement automatique Swiss Made, réserve de marche 42h, cadran guilloché avec finition soleil. Le summum de la collection Herbelin chez YsWatchs.",
    images: [watchGold, watchBlue, watchSilver],
    inStock: true,
    isNew: false,
    isBestSeller: false,
  },
  {
    id: "m5",
    name: "Collection Acier Elite",
    category: "homme",
    price: 1950,
    description: "Pour l'homme moderne qui apprécie les traditions horlogères. Boîtier acier 316L, cadran blanc mat, aiguilles de précision. Une élégance discrète qui accompagne chaque moment de votre journée.",
    images: [watchSilver, watchBlue, watchGold],
    inStock: false,
    isNew: false,
    isBestSeller: false,
  },
  {
    id: "m6",
    name: "Tissot Powermatic",
    category: "homme",
    price: 2800,
    description: "Le fleuron de la tradition Le Locle. Calibre automatique visible par le fond transparent, cadran bleu nuit aux reflets changeants, bracelet acier poli-satiné. L'horlogerie suisse dans toute sa magnificence.",
    images: [watchBlue, watchSilver, watchGold],
    inStock: true,
    isNew: false,
    isBestSeller: false,
  },
  {
    id: "f1",
    name: "Herbelin Féminin Or",
    category: "femme",
    price: 1650,
    description: "La grâce incarnée. Ce modèle reprend les codes du classicisme horloger dans un boîtier aux proportions féminines. Le cadran blanc nacré, les chiffres romains dorés et le bracelet cuir caramel composent un tableau d'une douceur sans égale.",
    images: [watchGold, watchBlue, watchSilver],
    inStock: true,
    isNew: true,
    isBestSeller: true,
  },
  {
    id: "f2",
    name: "Élégance Acier",
    category: "femme",
    price: 1380,
    description: "Une silhouette épurée pour les femmes qui n'ont pas besoin de chercher l'attention — elles l'obtiennent naturellement. Cadran blanc, boîtier acier poli, chiffres romains noirs fins. La discrétion comme art de vivre.",
    images: [watchSilver, watchGold, watchBlue],
    inStock: true,
    isNew: false,
    isBestSeller: false,
  },
  {
    id: "f3",
    name: "Azur Tissot Dame",
    category: "femme",
    price: 2100,
    description: "Un cadran bleu nuit qui évoque les profondeurs de la Méditerranée. Pour la femme de caractère qui porte son univers intérieur au poignet. Bracelet acier à maillons fins, fermoir papillon signature Tissot.",
    images: [watchBlue, watchGold, watchSilver],
    inStock: false,
    isNew: false,
    isBestSeller: true,
  },
  {
    id: "f4",
    name: "Herbelin Raffiné",
    category: "femme",
    price: 1750,
    description: "La montre qui complète toutes les tenues. Boîtier doré de 30mm, cadran guilloché ivoire, chiffres romains noirs — un accessoire de vie qui se transmet de génération en génération. Fabriqué en France.",
    images: [watchGold, watchSilver, watchBlue],
    inStock: true,
    isNew: false,
    isBestSeller: false,
  },
  {
    id: "f5",
    name: "Minimaliste Acier",
    category: "femme",
    price: 1250,
    description: "L'accessoire ultime pour la femme moderne. Design ultra-plat, cadran opalin blanc à l'éclat soyeux, bracelet cuir noir cousu main. Légèreté absolue au poignet, impact maximal dans la pièce.",
    images: [watchSilver, watchBlue, watchGold],
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
    images: [watchGold],
    inStock: true,
    isNew: false,
    isBestSeller: true,
  },
  {
    id: "a2",
    name: "Eau de Chronos",
    category: "parfum",
    price: 180,
    description: "L'odeur des ateliers parisiens en flacon. Des notes de tête bergamote et poivre noir, un cœur cuir et iris, un fond ambre et oud. L'essence même du temps suspendu.",
    images: [watchBlue],
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
