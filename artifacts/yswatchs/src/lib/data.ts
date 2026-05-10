import { watchGold, watchSilver, watchBlue, montre1, montre2 } from './watch-images';

export type Category = 'homme' | 'femme' | 'ceinture' | 'parfum' | 'collection';
export type Movement = 'automatique' | 'manuel' | 'quartz';
export type CaseMaterial = 'acier' | 'or-jaune' | 'or-rose' | 'platine';
export type StrapType = 'cuir' | 'acier' | 'caoutchouc';
export type DialColor = 'blanc' | 'bleu' | 'noir' | 'nacre' | 'brun';
export type CaseSize = 'grand' | 'moyen' | 'compact';

export interface Product {
  id: string;
  name: string;
  category: Category;
  price: number;
  discount?: number;
  description: string;
  images: string[];
  inStock: boolean;
  isNew: boolean;
  isBestSeller: boolean;
  movement?: Movement;
  caseMaterial?: CaseMaterial;
  strapType?: StrapType;
  dialColor?: DialColor;
  caseSize?: CaseSize;
}

export const products: Product[] = [
  {
    id: "m2",
    name: "Pagani Classic Cuir",
    category: "homme",
    price: 14500,
    discount: 20,
    description: "Un cadran brun fumé aux reflets changeants, enchâssé dans un boîtier or rose subtilement poli. Le bracelet alligator noir cousu main complète une silhouette d'une sophistication rare. L'élégance masculine à l'état pur.",
    images: [montre1, watchGold, watchSilver],
    inStock: true,
    isNew: false,
    isBestSeller: true,
    movement: 'automatique',
    caseMaterial: 'or-rose',
    strapType: 'cuir',
    dialColor: 'brun',
    caseSize: 'moyen',
  },
  {
    id: "m3",
    name: "Benyar Chronographe Acier",
    category: "homme",
    price: 22000,
    description: "Inspiration directe des ateliers de haute horlogerie. Le cadran bleu profond et les sous-compteurs chromés révèlent un savoir-faire exceptionnel. Bracelet acier milanais brillant pour une silhouette affirmée et précise.",
    images: [montre2, watchBlue, watchSilver],
    inStock: true,
    isNew: true,
    isBestSeller: true,
    movement: 'quartz',
    caseMaterial: 'acier',
    strapType: 'acier',
    dialColor: 'bleu',
    caseSize: 'grand',
  },
  {
    id: "m4",
    name: "Prestige Or Guilloché",
    category: "homme",
    price: 26000,
    discount: 25,
    description: "La version prestige de notre collection signature. Mouvement automatique Swiss Made, réserve de marche 42h, cadran guilloché avec finition soleil. Le summum de l'horlogerie masculine chez YsWatchs.",
    images: [watchGold, watchBlue, watchSilver],
    inStock: true,
    isNew: false,
    isBestSeller: false,
    movement: 'automatique',
    caseMaterial: 'or-jaune',
    strapType: 'cuir',
    dialColor: 'blanc',
    caseSize: 'grand',
  },
  {
    id: "m5",
    name: "Acier Elite Classique",
    category: "homme",
    price: 19500,
    description: "Pour l'homme moderne qui apprécie les traditions horlogères. Boîtier acier 316L, cadran blanc mat, aiguilles de précision. Une élégance discrète qui accompagne chaque moment de votre journée.",
    images: [watchSilver, watchBlue, watchGold],
    inStock: false,
    isNew: false,
    isBestSeller: false,
    movement: 'automatique',
    caseMaterial: 'acier',
    strapType: 'cuir',
    dialColor: 'blanc',
    caseSize: 'moyen',
  },
  {
    id: "m6",
    name: "Powermatic Nuit",
    category: "homme",
    price: 28000,
    description: "Le fleuron de la tradition horlogère. Calibre automatique visible par le fond transparent, cadran bleu nuit aux reflets changeants, bracelet acier poli-satiné. L'horlogerie suisse dans toute sa magnificence.",
    images: [watchBlue, watchSilver, watchGold],
    inStock: true,
    isNew: false,
    isBestSeller: false,
    movement: 'automatique',
    caseMaterial: 'acier',
    strapType: 'acier',
    dialColor: 'bleu',
    caseSize: 'grand',
  },
  {
    id: "f1",
    name: "Dorée Féminin Nacré",
    category: "femme",
    price: 16500,
    discount: 15,
    description: "La grâce incarnée. Boîtier aux proportions féminines raffinées, cadran blanc nacré aux reflets irisés, chiffres romains dorés et bracelet cuir caramel cousu main. Un tableau d'une douceur sans égale.",
    images: [watchGold, watchBlue, watchSilver],
    inStock: true,
    isNew: true,
    isBestSeller: true,
    movement: 'quartz',
    caseMaterial: 'or-jaune',
    strapType: 'cuir',
    dialColor: 'nacre',
    caseSize: 'compact',
  },
  {
    id: "f2",
    name: "Élégance Acier Dame",
    category: "femme",
    price: 13800,
    description: "Une silhouette épurée pour les femmes qui n'ont pas besoin de chercher l'attention — elles l'obtiennent naturellement. Cadran blanc, boîtier acier poli, chiffres romains noirs fins. La discrétion comme art de vivre.",
    images: [watchSilver, watchGold, watchBlue],
    inStock: true,
    isNew: false,
    isBestSeller: false,
    movement: 'quartz',
    caseMaterial: 'acier',
    strapType: 'acier',
    dialColor: 'blanc',
    caseSize: 'compact',
  },
  {
    id: "f3",
    name: "Azur Bleu Nuit Dame",
    category: "femme",
    price: 21000,
    discount: 10,
    description: "Un cadran bleu nuit qui évoque les profondeurs de la Méditerranée. Pour la femme de caractère qui porte son univers intérieur au poignet. Bracelet acier à maillons fins, fermoir papillon signature.",
    images: [watchBlue, watchGold, watchSilver],
    inStock: false,
    isNew: false,
    isBestSeller: true,
    movement: 'automatique',
    caseMaterial: 'acier',
    strapType: 'acier',
    dialColor: 'bleu',
    caseSize: 'moyen',
  },
  {
    id: "f4",
    name: "Ivoire Guilloché Dame",
    category: "femme",
    price: 17500,
    description: "La montre qui complète toutes les tenues. Boîtier doré de 30mm, cadran guilloché ivoire, chiffres romains noirs — un accessoire de vie qui se transmet de génération en génération.",
    images: [watchGold, watchSilver, watchBlue],
    inStock: true,
    isNew: false,
    isBestSeller: false,
    movement: 'automatique',
    caseMaterial: 'or-jaune',
    strapType: 'cuir',
    dialColor: 'blanc',
    caseSize: 'compact',
  },
  {
    id: "f5",
    name: "Minimaliste Acier Slim",
    category: "femme",
    price: 12500,
    description: "L'accessoire ultime pour la femme moderne. Design ultra-plat, cadran opalin blanc à l'éclat soyeux, bracelet cuir noir cousu main. Légèreté absolue au poignet, impact maximal dans la pièce.",
    images: [watchSilver, watchBlue, watchGold],
    inStock: true,
    isNew: false,
    isBestSeller: false,
    movement: 'quartz',
    caseMaterial: 'acier',
    strapType: 'cuir',
    dialColor: 'blanc',
    caseSize: 'compact',
  },
  {
    id: "a1",
    name: "Ceinture Royale",
    category: "ceinture",
    price: 3200,
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
    price: 1800,
    description: "L'odeur des ateliers parisiens en flacon. Des notes de tête bergamote et poivre noir, un cœur cuir et iris, un fond ambre et oud. L'essence même du temps suspendu.",
    images: [watchBlue],
    inStock: true,
    isNew: true,
    isBestSeller: false,
  },
];

export const MOROCCAN_CITIES = [
  "Casablanca",
  "Rabat",
  "Marrakech",
  "Fès",
  "Tanger",
  "Agadir",
  "Meknès",
  "Oujda",
  "Kénitra",
  "Tétouan",
  "Safi",
  "Mohammedia",
  "El Jadida",
  "Béni Mellal",
  "Nador",
  "Taza",
  "Settat",
  "Khouribga",
  "Errachidia",
  "Guelmim",
  "Ouarzazate",
  "Laâyoune",
  "Dakhla",
  "Ifrane",
  "Al Hoceima",
];

export const getProductsByCategory = (category: Category | 'all') => {
  if (category === 'all') return products;
  return products.filter(p => p.category === category);
};

export const getProductById = (id: string) => {
  return products.find(p => p.id === id);
};

export const getDiscountedProducts = () => {
  return products.filter(p => p.discount && p.discount > 0);
};

export const getDiscountedPrice = (price: number, discount: number) => {
  return Math.round(price * (1 - discount / 100));
};

export const formatPrice = (price: number) => {
  return new Intl.NumberFormat('fr-MA', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(price) + ' DH';
};
