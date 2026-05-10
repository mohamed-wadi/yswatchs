import { createContext, useContext, useState, ReactNode } from "react";

interface AdminUser {
  id: string; name: string; email: string;
  role: "super_admin" | "admin" | "editor"; avatar?: string;
}
interface AuthState { step: "login" | "2fa" | "authenticated"; user: AdminUser | null; }
interface AuthContextType extends AuthState {
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  verify2FA: (code: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

const ADMIN_USERS: Array<AdminUser & { password: string }> = [
  { id:"1", name:"Youssef Slimani", email:"admin@yswatchs.com", password:"Admin@2025", role:"super_admin" },
  { id:"2", name:"Sophie Martin",   email:"editor@yswatchs.com", password:"Editor@2025", role:"editor" },
];

export function AuthProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AuthState>({ step: "login", user: null });
  const [pendingUser, setPendingUser] = useState<AdminUser | null>(null);

  const login = async (email: string, password: string) => {
    await new Promise((r) => setTimeout(r, 500));
    const found = ADMIN_USERS.find((u) => u.email === email && u.password === password);
    if (!found) return { success: false, error: "Identifiants incorrects." };
    const { password: _p, ...user } = found;
    setPendingUser(user);
    setState({ step: "2fa", user: null });
    return { success: true };
  };

  const verify2FA = async (code: string) => {
    await new Promise((r) => setTimeout(r, 400));
    if (code !== "123456") return { success: false, error: "Code incorrect. (Démo: 123456)" };
    setState({ step: "authenticated", user: pendingUser });
    return { success: true };
  };

  const logout = () => { setState({ step: "login", user: null }); setPendingUser(null); };

  return (
    <AuthContext.Provider value={{ ...state, login, verify2FA, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
