import { createContext, useContext, useReducer, useEffect, ReactNode, useCallback } from "react";

export type OrderStatus = "pending" | "confirmed" | "shipped" | "delivered" | "cancelled" | "refused";
export type StockStatus = "instock" | "lowstock" | "outofstock";

export interface OrderItem { productId: string; name: string; qty: number; price: number; }
export interface StatusEvent { status: OrderStatus; at: string; note?: string; }

export interface Order {
  id: string; reference: string;
  customerName: string; phone: string; city: string; address: string;
  items: OrderItem[]; total: number; status: OrderStatus;
  date: string; statusHistory: StatusEvent[]; adminNote: string;
}

export interface Customer {
  id: string; name: string; phone: string; city: string;
  totalOrders: number; totalSpent: number; note: string;
  joinDate: string; lastOrder: string;
}

export interface BlacklistEntry {
  id: string; phone: string; name: string;
  reason: string; addedAt: string; ordersCount: number;
}

export interface Product {
  id: string; reference: string; name: string;
  shortDesc: string; longDesc: string;
  price: number; oldPrice?: number;
  category: "Homme" | "Femme" | "Collection";
  movement: string; caseMaterial: string;
  stock: number; images: string[]; tags: string[];
  visible: boolean; sold: number;
}

export interface CityShipping { city: string; fee: number; }

export interface Settings {
  storeName: string; whatsapp: string;
  maintenanceMode: boolean; cities: CityShipping[];
}

export interface StoreState {
  orders: Order[];
  customers: Customer[];
  products: Product[];
  blacklist: BlacklistEntry[];
  settings: Settings;
  theme: "light" | "dark";
}

// ─── Initial data ─────────────────────────────────────────────────────────────

const INITIAL_PRODUCTS: Product[] = [
  { id:"p1", reference:"YS-M001", name:"Pagani Classic Cuir", shortDesc:"Montre automatique classique en cuir véritable", longDesc:"Un garde-temps d'exception alliant tradition horlogère et élégance contemporaine. Boîtier en acier poli, bracelet cuir véritable cousu main.", price:14500, oldPrice:18000, category:"Homme", movement:"Automatique", caseMaterial:"Acier", stock:12, images:[], tags:["Bestseller"], visible:true, sold:47 },
  { id:"p2", reference:"YS-M002", name:"Benyar Chronographe", shortDesc:"Chronographe sport acier avec cadran soleillé", longDesc:"Précision et performance dans un boîtier sportif. Mouvement quartz japonais, résistance à l'eau 50m.", price:22000, category:"Homme", movement:"Quartz", caseMaterial:"Acier", stock:5, images:[], tags:["Nouveauté","Bestseller"], visible:true, sold:31 },
  { id:"p3", reference:"YS-M003", name:"Benyar Squelette Givré", shortDesc:"Cadran squelette finition givré", longDesc:"L'art de la transparence horlogère. Mouvement automatique visible à travers le cadran squelette givré.", price:26000, oldPrice:30000, category:"Homme", movement:"Automatique", caseMaterial:"Acier", stock:8, images:[], tags:[], visible:true, sold:19 },
  { id:"p4", reference:"YS-F001", name:"Pagani Design Nacre", shortDesc:"Cadran nacre avec indices diamant", longDesc:"La féminité à l'état pur. Cadran en nacre naturelle, indices serties de cristaux, bracelet en acier plaqué or rose.", price:18500, category:"Femme", movement:"Quartz", caseMaterial:"Or rose", stock:0, images:[], tags:["Nouveauté","Bestseller"], visible:true, sold:28 },
  { id:"p5", reference:"YS-F002", name:"Lady Élégance Diamants", shortDesc:"Collection prestige avec vrais diamants", longDesc:"L'excellence incarnée. 42 diamants naturels certifiés, boîtier platine, mouvement automatique manufacture.", price:35000, category:"Femme", movement:"Automatique", caseMaterial:"Platine", stock:3, images:[], tags:[], visible:true, sold:11 },
  { id:"p6", reference:"YS-C001", name:"Heritage Complications", shortDesc:"Grande complication — perpétuel & tourbillon", longDesc:"Le summum de l'art horloger. Quantième perpétuel, tourbillon volant, réserve de marche 72h. Pièce de collection numérotée.", price:58000, category:"Collection", movement:"Manuel", caseMaterial:"Or jaune", stock:2, images:[], tags:[], visible:true, sold:4 },
];

const INITIAL_CUSTOMERS: Customer[] = [
  { id:"c1", name:"Mohammed Al-Rashid", phone:"0612345678", city:"Casablanca", totalOrders:5, totalSpent:87500, note:"", joinDate:"2024-03-15", lastOrder:"2025-05-02" },
  { id:"c2", name:"Isabelle Fontaine", phone:"0698765432", city:"Rabat", totalOrders:3, totalSpent:52000, note:"", joinDate:"2024-06-20", lastOrder:"2025-04-18" },
  { id:"c3", name:"Karim Benali", phone:"0655443322", city:"Fès", totalOrders:2, totalSpent:36500, note:"", joinDate:"2024-09-05", lastOrder:"2025-03-30" },
  { id:"c4", name:"Amira Cherif", phone:"0622333444", city:"Tanger", totalOrders:4, totalSpent:71000, note:"Cliente fidèle", joinDate:"2024-01-12", lastOrder:"2025-05-08" },
  { id:"c5", name:"Youssef Bensouda", phone:"0611223344", city:"Marrakech", totalOrders:1, totalSpent:22000, note:"", joinDate:"2025-01-03", lastOrder:"2025-01-03" },
  { id:"c6", name:"Fatima Zahra Idrissi", phone:"0677889900", city:"Casablanca", totalOrders:6, totalSpent:124000, note:"VIP — livraison prioritaire", joinDate:"2023-11-22", lastOrder:"2025-05-09" },
];

const INITIAL_ORDERS: Order[] = [
  { id:"o1", reference:"YS-2025-0089", customerName:"Fatima Zahra Idrissi", phone:"0677889900", city:"Casablanca", address:"12 Rue Hassan II, Maarif", items:[{productId:"p5",name:"Lady Élégance Diamants",qty:1,price:35000}], total:35000, status:"delivered", date:"2025-05-09T10:15:00", statusHistory:[{status:"pending",at:"2025-05-09T10:15:00"},{status:"confirmed",at:"2025-05-09T14:32:00",note:"Confirmée par téléphone"},{status:"shipped",at:"2025-05-10T09:00:00"},{status:"delivered",at:"2025-05-10T16:45:00"}], adminNote:"" },
  { id:"o2", reference:"YS-2025-0088", customerName:"Amira Cherif", phone:"0622333444", city:"Tanger", address:"5 Bd Mohammed V", items:[{productId:"p2",name:"Benyar Chronographe",qty:1,price:22000}], total:22000, status:"shipped", date:"2025-05-08T16:22:00", statusHistory:[{status:"pending",at:"2025-05-08T16:22:00"},{status:"confirmed",at:"2025-05-09T10:00:00"},{status:"shipped",at:"2025-05-10T08:30:00"}], adminNote:"" },
  { id:"o3", reference:"YS-2025-0087", customerName:"Mohammed Al-Rashid", phone:"0612345678", city:"Casablanca", address:"Résidence Palmier, Bd Zerktouni", items:[{productId:"p1",name:"Pagani Classic Cuir",qty:1,price:14500},{productId:"p3",name:"Benyar Squelette Givré",qty:1,price:26000}], total:40500, status:"confirmed", date:"2025-05-07T09:45:00", statusHistory:[{status:"pending",at:"2025-05-07T09:45:00"},{status:"confirmed",at:"2025-05-07T14:30:00",note:"Client VIP confirmé"}], adminNote:"Livraison prioritaire demandée" },
  { id:"o4", reference:"YS-2025-0086", customerName:"Isabelle Fontaine", phone:"0698765432", city:"Rabat", address:"10 Avenue OAU, Agdal", items:[{productId:"p6",name:"Heritage Complications",qty:1,price:58000}], total:58000, status:"pending", date:"2025-05-06T18:10:00", statusHistory:[{status:"pending",at:"2025-05-06T18:10:00"}], adminNote:"Attente confirmation" },
  { id:"o5", reference:"YS-2025-0085", customerName:"Karim Benali", phone:"0655443322", city:"Fès", address:"Rue Sidi Bou Abid", items:[{productId:"p2",name:"Benyar Chronographe",qty:1,price:22000}], total:22000, status:"cancelled", date:"2025-05-04T11:30:00", statusHistory:[{status:"pending",at:"2025-05-04T11:30:00"},{status:"cancelled",at:"2025-05-05T10:00:00",note:"Annulation demandée par client"}], adminNote:"" },
  { id:"o6", reference:"YS-2025-0084", customerName:"Youssef Bensouda", phone:"0611223344", city:"Marrakech", address:"Guéliz, Rue de Yougoslavie", items:[{productId:"p2",name:"Benyar Chronographe",qty:1,price:22000}], total:22000, status:"delivered", date:"2025-05-03T14:00:00", statusHistory:[{status:"pending",at:"2025-05-03T14:00:00"},{status:"confirmed",at:"2025-05-04T09:00:00"},{status:"shipped",at:"2025-05-04T15:00:00"},{status:"delivered",at:"2025-05-05T12:30:00"}], adminNote:"" },
  { id:"o7", reference:"YS-2025-0083", customerName:"Said Tazi", phone:"0644556677", city:"Agadir", address:"Cité Founty, Bd Hassan II", items:[{productId:"p4",name:"Pagani Design Nacre",qty:1,price:18500}], total:18500, status:"refused", date:"2025-04-28T10:00:00", statusHistory:[{status:"pending",at:"2025-04-28T10:00:00"},{status:"confirmed",at:"2025-04-29T09:00:00"},{status:"shipped",at:"2025-04-30T08:00:00"},{status:"refused",at:"2025-05-01T16:00:00",note:"Livreur déplacé, client absent"}], adminNote:"Numéro à surveiller" },
];

const INITIAL_BLACKLIST: BlacklistEntry[] = [
  { id:"b1", phone:"0644556677", name:"Said Tazi", reason:"Livreur déplacé — client absent et injoignable", addedAt:"2025-05-01T16:30:00", ordersCount:1 },
];

const INITIAL_SETTINGS: Settings = {
  storeName: "YsWatchs",
  whatsapp: "+212600000000",
  maintenanceMode: false,
  cities: [
    { city: "Casablanca", fee: 25 },
    { city: "Rabat", fee: 25 },
    { city: "Marrakech", fee: 35 },
    { city: "Fès", fee: 35 },
    { city: "Tanger", fee: 35 },
    { city: "Agadir", fee: 40 },
    { city: "Meknès", fee: 35 },
    { city: "Oujda", fee: 45 },
  ],
};

const getInitialState = (): StoreState => {
  try {
    const saved = localStorage.getItem("ys-admin-store");
    if (saved) {
      const parsed = JSON.parse(saved);
      return { ...parsed };
    }
  } catch {}
  return {
    orders: INITIAL_ORDERS,
    customers: INITIAL_CUSTOMERS,
    products: INITIAL_PRODUCTS,
    blacklist: INITIAL_BLACKLIST,
    settings: INITIAL_SETTINGS,
    theme: "light",
  };
};

// ─── Actions ─────────────────────────────────────────────────────────────────

type Action =
  | { type: "SET_THEME"; theme: "light" | "dark" }
  | { type: "UPDATE_ORDER_STATUS"; id: string; status: OrderStatus; note?: string }
  | { type: "UPDATE_ORDER_NOTE"; id: string; note: string }
  | { type: "DELETE_ORDER"; id: string }
  | { type: "ADD_TO_BLACKLIST"; phone: string; name: string; reason: string }
  | { type: "REMOVE_FROM_BLACKLIST"; id: string }
  | { type: "UPDATE_BLACKLIST_REASON"; id: string; reason: string }
  | { type: "ADD_PRODUCT"; product: Product }
  | { type: "UPDATE_PRODUCT"; product: Product }
  | { type: "DELETE_PRODUCT"; id: string }
  | { type: "ADJUST_STOCK"; id: string; delta: number }
  | { type: "UPDATE_CUSTOMER_NOTE"; id: string; note: string }
  | { type: "UPDATE_SETTINGS"; settings: Partial<Settings> };

function reducer(state: StoreState, action: Action): StoreState {
  switch (action.type) {
    case "SET_THEME":
      return { ...state, theme: action.theme };

    case "UPDATE_ORDER_STATUS": {
      const now = new Date().toISOString();
      return {
        ...state,
        orders: state.orders.map((o) =>
          o.id === action.id
            ? { ...o, status: action.status, statusHistory: [...o.statusHistory, { status: action.status, at: now, note: action.note }] }
            : o
        ),
      };
    }

    case "UPDATE_ORDER_NOTE":
      return { ...state, orders: state.orders.map((o) => o.id === action.id ? { ...o, adminNote: action.note } : o) };

    case "DELETE_ORDER":
      return { ...state, orders: state.orders.filter((o) => o.id !== action.id) };

    case "ADD_TO_BLACKLIST": {
      const existing = state.blacklist.find((b) => b.phone === action.phone);
      if (existing) return { ...state, blacklist: state.blacklist.map((b) => b.phone === action.phone ? { ...b, reason: action.reason, name: action.name } : b) };
      const ordersCount = state.orders.filter((o) => o.phone === action.phone).length;
      const newEntry: BlacklistEntry = { id: `b${Date.now()}`, phone: action.phone, name: action.name, reason: action.reason, addedAt: new Date().toISOString(), ordersCount };
      return { ...state, blacklist: [...state.blacklist, newEntry] };
    }

    case "REMOVE_FROM_BLACKLIST":
      return { ...state, blacklist: state.blacklist.filter((b) => b.id !== action.id) };

    case "UPDATE_BLACKLIST_REASON":
      return { ...state, blacklist: state.blacklist.map((b) => b.id === action.id ? { ...b, reason: action.reason } : b) };

    case "ADD_PRODUCT":
      return { ...state, products: [...state.products, action.product] };

    case "UPDATE_PRODUCT":
      return { ...state, products: state.products.map((p) => p.id === action.product.id ? action.product : p) };

    case "DELETE_PRODUCT":
      return { ...state, products: state.products.filter((p) => p.id !== action.id) };

    case "ADJUST_STOCK":
      return { ...state, products: state.products.map((p) => p.id === action.id ? { ...p, stock: Math.max(0, p.stock + action.delta) } : p) };

    case "UPDATE_CUSTOMER_NOTE":
      return { ...state, customers: state.customers.map((c) => c.id === action.id ? { ...c, note: action.note } : c) };

    case "UPDATE_SETTINGS":
      return { ...state, settings: { ...state.settings, ...action.settings } };

    default:
      return state;
  }
}

// ─── Context ─────────────────────────────────────────────────────────────────

interface StoreContextType {
  state: StoreState;
  dispatch: (action: Action) => void;
  isBlacklisted: (phone: string) => BlacklistEntry | undefined;
  getStockStatus: (stock: number) => StockStatus;
  formatPrice: (n: number) => string;
  formatDate: (d: string) => string;
}

const StoreContext = createContext<StoreContextType | null>(null);

export function StoreProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, undefined, getInitialState);

  useEffect(() => {
    try { localStorage.setItem("ys-admin-store", JSON.stringify(state)); } catch {}
  }, [state]);

  useEffect(() => {
    const root = document.documentElement;
    if (state.theme === "dark") root.classList.add("dark");
    else root.classList.remove("dark");
  }, [state.theme]);

  const isBlacklisted = useCallback((phone: string) => state.blacklist.find((b) => b.phone === phone), [state.blacklist]);

  const getStockStatus = useCallback((stock: number): StockStatus => {
    if (stock === 0) return "outofstock";
    if (stock <= 5) return "lowstock";
    return "instock";
  }, []);

  const formatPrice = useCallback((n: number) => new Intl.NumberFormat("fr-MA", { minimumFractionDigits: 0 }).format(n) + " MAD", []);

  const formatDate = useCallback((d: string) => {
    if (!d) return "—";
    return new Intl.DateTimeFormat("fr-FR", { day: "numeric", month: "short", year: "numeric" }).format(new Date(d));
  }, []);

  return (
    <StoreContext.Provider value={{ state, dispatch, isBlacklisted, getStockStatus, formatPrice, formatDate }}>
      {children}
    </StoreContext.Provider>
  );
}

export function useStore() {
  const ctx = useContext(StoreContext);
  if (!ctx) throw new Error("useStore must be used within StoreProvider");
  return ctx;
}

export const STATUS_LABELS: Record<OrderStatus, string> = {
  pending: "En attente",
  confirmed: "Confirmée",
  shipped: "Expédiée",
  delivered: "Livrée",
  cancelled: "Annulée",
  refused: "Refusée",
};

export const STATUS_NEXT: Partial<Record<OrderStatus, OrderStatus>> = {
  pending: "confirmed",
  confirmed: "shipped",
  shipped: "delivered",
};
