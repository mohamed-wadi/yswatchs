export type OrderStatus = "pending" | "confirmed" | "shipped" | "delivered" | "cancelled";
export type StockStatus = "instock" | "lowstock" | "outofstock";

export interface Product {
  id: string;
  name: string;
  category: string;
  price: number;
  discount?: number;
  stock: number;
  stockStatus: StockStatus;
  sold: number;
  isNew: boolean;
  isBestSeller: boolean;
  movement: string;
  caseMaterial: string;
  reference: string;
  image?: string;
}

export interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  city: string;
  country: string;
  orders: number;
  totalSpent: number;
  joinDate: string;
  lastOrder: string;
  vip: boolean;
}

export interface Order {
  id: string;
  reference: string;
  customerId: string;
  customerName: string;
  customerEmail: string;
  products: Array<{ productId: string; name: string; qty: number; price: number }>;
  total: number;
  status: OrderStatus;
  paymentMethod: string;
  date: string;
  city: string;
  country: string;
  notes?: string;
}

export const products: Product[] = [
  {
    id: "m1",
    name: "Pagani Classic Cuir",
    category: "Homme",
    price: 14500,
    discount: 20,
    stock: 12,
    stockStatus: "instock",
    sold: 47,
    isNew: false,
    isBestSeller: true,
    movement: "Automatique",
    caseMaterial: "Or rose",
    reference: "YS-M001",
  },
  {
    id: "m2",
    name: "Benyar Chronographe",
    category: "Homme",
    price: 22000,
    stock: 5,
    stockStatus: "lowstock",
    sold: 31,
    isNew: true,
    isBestSeller: true,
    movement: "Quartz",
    caseMaterial: "Acier",
    reference: "YS-M002",
  },
  {
    id: "m3",
    name: "Benyar Squelette Givré",
    category: "Homme",
    price: 26000,
    discount: 15,
    stock: 8,
    stockStatus: "instock",
    sold: 19,
    isNew: false,
    isBestSeller: false,
    movement: "Automatique",
    caseMaterial: "Acier",
    reference: "YS-M003",
  },
  {
    id: "m4",
    name: "Pagani Design Nacre",
    category: "Femme",
    price: 18500,
    stock: 0,
    stockStatus: "outofstock",
    sold: 28,
    isNew: true,
    isBestSeller: true,
    movement: "Quartz",
    caseMaterial: "Or jaune",
    reference: "YS-F001",
  },
  {
    id: "m5",
    name: "Lady Élégance Diamants",
    category: "Femme",
    price: 35000,
    stock: 3,
    stockStatus: "lowstock",
    sold: 11,
    isNew: false,
    isBestSeller: false,
    movement: "Automatique",
    caseMaterial: "Platine",
    reference: "YS-F002",
  },
  {
    id: "m6",
    name: "Heritage Complications",
    category: "Collection",
    price: 58000,
    stock: 2,
    stockStatus: "lowstock",
    sold: 4,
    isNew: false,
    isBestSeller: false,
    movement: "Manuel",
    caseMaterial: "Or jaune",
    reference: "YS-C001",
  },
];

export const customers: Customer[] = [
  {
    id: "c1",
    name: "Mohammed Al-Rashid",
    email: "m.rashid@email.com",
    phone: "+212 6 12 34 56 78",
    city: "Casablanca",
    country: "Maroc",
    orders: 5,
    totalSpent: 87500,
    joinDate: "2024-03-15",
    lastOrder: "2025-05-02",
    vip: true,
  },
  {
    id: "c2",
    name: "Isabelle Fontaine",
    email: "i.fontaine@mail.fr",
    phone: "+33 6 98 76 54 32",
    city: "Paris",
    country: "France",
    orders: 3,
    totalSpent: 52000,
    joinDate: "2024-06-20",
    lastOrder: "2025-04-18",
    vip: true,
  },
  {
    id: "c3",
    name: "Karim Benali",
    email: "k.benali@gmail.com",
    phone: "+213 5 55 44 33 22",
    city: "Alger",
    country: "Algérie",
    orders: 2,
    totalSpent: 36500,
    joinDate: "2024-09-05",
    lastOrder: "2025-03-30",
    vip: false,
  },
  {
    id: "c4",
    name: "Amira Cherif",
    email: "a.cherif@outlook.com",
    phone: "+216 22 333 444",
    city: "Tunis",
    country: "Tunisie",
    orders: 4,
    totalSpent: 71000,
    joinDate: "2024-01-12",
    lastOrder: "2025-05-08",
    vip: true,
  },
  {
    id: "c5",
    name: "Jean-Luc Moreau",
    email: "jl.moreau@entreprise.fr",
    phone: "+33 7 11 22 33 44",
    city: "Lyon",
    country: "France",
    orders: 1,
    totalSpent: 22000,
    joinDate: "2025-01-03",
    lastOrder: "2025-01-03",
    vip: false,
  },
  {
    id: "c6",
    name: "Fatima Zahra Idrissi",
    email: "fz.idrissi@hotmail.com",
    phone: "+212 6 77 88 99 00",
    city: "Rabat",
    country: "Maroc",
    orders: 6,
    totalSpent: 124000,
    joinDate: "2023-11-22",
    lastOrder: "2025-05-09",
    vip: true,
  },
];

export const orders: Order[] = [
  {
    id: "o1",
    reference: "YS-2025-0089",
    customerId: "c6",
    customerName: "Fatima Zahra Idrissi",
    customerEmail: "fz.idrissi@hotmail.com",
    products: [{ productId: "m5", name: "Lady Élégance Diamants", qty: 1, price: 35000 }],
    total: 35000,
    status: "delivered",
    paymentMethod: "Carte bancaire",
    date: "2025-05-09",
    city: "Rabat",
    country: "Maroc",
  },
  {
    id: "o2",
    reference: "YS-2025-0088",
    customerId: "c4",
    customerName: "Amira Cherif",
    customerEmail: "a.cherif@outlook.com",
    products: [{ productId: "m2", name: "Benyar Chronographe", qty: 1, price: 22000 }],
    total: 22000,
    status: "shipped",
    paymentMethod: "Virement",
    date: "2025-05-08",
    city: "Tunis",
    country: "Tunisie",
  },
  {
    id: "o3",
    reference: "YS-2025-0087",
    customerId: "c1",
    customerName: "Mohammed Al-Rashid",
    customerEmail: "m.rashid@email.com",
    products: [
      { productId: "m1", name: "Pagani Classic Cuir", qty: 1, price: 11600 },
      { productId: "m3", name: "Benyar Squelette Givré", qty: 1, price: 22100 },
    ],
    total: 33700,
    status: "confirmed",
    paymentMethod: "Carte bancaire",
    date: "2025-05-07",
    city: "Casablanca",
    country: "Maroc",
    notes: "Client VIP — livraison prioritaire",
  },
  {
    id: "o4",
    reference: "YS-2025-0086",
    customerId: "c2",
    customerName: "Isabelle Fontaine",
    customerEmail: "i.fontaine@mail.fr",
    products: [{ productId: "m6", name: "Heritage Complications", qty: 1, price: 58000 }],
    total: 58000,
    status: "pending",
    paymentMethod: "Virement",
    date: "2025-05-06",
    city: "Paris",
    country: "France",
    notes: "Attente confirmation virement",
  },
  {
    id: "o5",
    reference: "YS-2025-0085",
    customerId: "c3",
    customerName: "Karim Benali",
    customerEmail: "k.benali@gmail.com",
    products: [{ productId: "m2", name: "Benyar Chronographe", qty: 1, price: 22000 }],
    total: 22000,
    status: "cancelled",
    paymentMethod: "Carte bancaire",
    date: "2025-05-04",
    city: "Alger",
    country: "Algérie",
    notes: "Annulation client",
  },
  {
    id: "o6",
    reference: "YS-2025-0084",
    customerId: "c5",
    customerName: "Jean-Luc Moreau",
    customerEmail: "jl.moreau@entreprise.fr",
    products: [{ productId: "m2", name: "Benyar Chronographe", qty: 1, price: 22000 }],
    total: 22000,
    status: "delivered",
    paymentMethod: "Carte bancaire",
    date: "2025-05-03",
    city: "Lyon",
    country: "France",
  },
  {
    id: "o7",
    reference: "YS-2025-0083",
    customerId: "c4",
    customerName: "Amira Cherif",
    customerEmail: "a.cherif@outlook.com",
    products: [{ productId: "m4", name: "Pagani Design Nacre", qty: 1, price: 18500 }],
    total: 18500,
    status: "delivered",
    paymentMethod: "Virement",
    date: "2025-04-28",
    city: "Tunis",
    country: "Tunisie",
  },
];

export const revenueData = [
  { month: "Nov", revenue: 48000, orders: 12 },
  { month: "Déc", revenue: 72000, orders: 18 },
  { month: "Jan", revenue: 55000, orders: 14 },
  { month: "Fév", revenue: 61000, orders: 15 },
  { month: "Mar", revenue: 83000, orders: 21 },
  { month: "Avr", revenue: 95000, orders: 24 },
  { month: "Mai", revenue: 112000, orders: 28 },
];

export const categoryData = [
  { name: "Homme", value: 58, color: "#C9A84C" },
  { name: "Femme", value: 29, color: "#E2C87A" },
  { name: "Collection", value: 13, color: "#8A6A1C" },
];

export function formatPrice(price: number): string {
  return new Intl.NumberFormat("fr-MA", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(price) + " MAD";
}

export function formatDate(dateStr: string): string {
  return new Intl.DateTimeFormat("fr-FR", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(new Date(dateStr));
}
