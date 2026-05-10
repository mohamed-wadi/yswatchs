import { m1, m2, m3, m4, m5 } from './watch-images';

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
    id: "m1",
    name: "Pagani Classic Cuir",
    category: "homme",
    price: 14500,
    discount: 20,
    description: "Un cadran brun fumé aux reflets changeants, enchâssé dans un boîtier or rose subtilement poli. Le bracelet alligator noir cousu main complète une silhouette d'une sophistication rare. L'élégance masculine à l'état pur.",
    images: [m1],
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
    id: "m2",
    name: "Benyar Chronographe",
    category: "homme",
    price: 22000,
    description: "Inspiration directe des ateliers de haute horlogerie. Le cadran bleu profond et les sous-compteurs chromés révèlent un savoir-faire exceptionnel. Bracelet acier milanais brillant pour une silhouette affirmée et précise.",
    images: [m2],
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
    id: "m3",
    name: "Benyar Squelette Givré",
    category: "homme",
    price: 26000,
    discount: 15,
    description: "L'horlogerie mise à nu dans sa plus pure expression. Le cadran squelette dévoile les rouages dorés en perpétuel mouvement, enchâssés dans un boîtier au fini givré artisanal. Une mécanique visible, un chef-d'œuvre vivant.",
    images: [m3],
    inStock: true,
    isNew: false,
    isBestSeller: false,
    movement: 'automatique',
    caseMaterial: 'acier',
    strapType: 'acier',
    dialColor: 'noir',
    caseSize: 'grand',
  },
  {
    id: "m4",
    name: "Mini Focus Royal",
    category: "homme",
    price: 19500,
    description: "L'architecture royale d'un boîtier octogonal brossé évoque les grandes maisons de haute horlogerie. Le cadran sombre à motif guilloché et les aiguilles de précision sur fond nuit distillent une autorité naturelle.",
    images: [m4],
    inStock: true,
    isNew: false,
    isBestSeller: false,
    movement: 'quartz',
    caseMaterial: 'acier',
    strapType: 'acier',
    dialColor: 'bleu',
    caseSize: 'grand',
  },
  {
    id: "m5",
    name: "YsWar Tachymètre",
    category: "homme",
    price: 24500,
    description: "La montre signature de la Maison YsWatchs. Chronographe tachymétrique or rose, cadran brun profond, bracelet cuir naturel patine chocolat. Chaque détail témoigne d'un engagement indéfectible envers l'excellence horlogère.",
    images: [m5],
    inStock: true,
    isNew: true,
    isBestSeller: true,
    movement: 'quartz',
    caseMaterial: 'or-rose',
    strapType: 'cuir',
    dialColor: 'brun',
    caseSize: 'grand',
  },
];

export const MOROCCAN_CITIES = [
  "Casablanca", "Rabat", "Marrakech", "Fès", "Tanger", "Agadir",
  "Meknès", "Oujda", "Kénitra", "Tétouan", "Safi", "Mohammedia",
  "El Jadida", "Béni Mellal", "Nador", "Taza", "Settat", "Khouribga",
  "Errachidia", "Guelmim", "Ouarzazate", "Laâyoune", "Dakhla",
  "Ifrane", "Al Hoceima",
];

export const getProductsByCategory = (category: Category | 'all') => {
  if (category === 'all') return products;
  return products.filter(p => p.category === category);
};

export const getProductById = (id: string) => products.find(p => p.id === id);

export const getDiscountedProducts = () => products.filter(p => p.discount && p.discount > 0);

export const getDiscountedPrice = (price: number, discount: number) =>
  Math.round(price * (1 - discount / 100));

export const formatPrice = (price: number) =>
  new Intl.NumberFormat('fr-MA', { minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(price) + ' DH';
