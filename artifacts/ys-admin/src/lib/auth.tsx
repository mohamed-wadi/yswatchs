import { createContext, useContext, useState, ReactNode } from "react";
import { generateSecret, verifyTOTP, getOtpAuthUri } from "./totp";

interface AdminUser {
  id: string; name: string; email: string;
  role: "super_admin" | "admin" | "editor"; avatar?: string;
}
interface AuthConfig {
  twoFAEnabled: boolean;
  twoFASecret: string | null;
}
interface AuthState {
  step: "login" | "2fa" | "authenticated";
  user: AdminUser | null;
}
interface AuthContextType extends AuthState {
  twoFAEnabled: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  verify2FA: (code: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  beginEnable2FA: (password: string) => Promise<{ success: boolean; error?: string; secret?: string; uri?: string }>;
  confirmEnable2FA: (code: string, secret: string) => Promise<{ success: boolean; error?: string }>;
  disable2FA: (password: string) => Promise<{ success: boolean; error?: string }>;
  currentUserEmail: () => string;
}

const AuthContext = createContext<AuthContextType | null>(null);

const ADMIN_USERS: Array<AdminUser & { password: string }> = [
  { id: "1", name: "Youssef Slimani", email: "admin@yswatchs.com", password: "Admin@2025", role: "super_admin" },
  { id: "2", name: "Sophie Martin",   email: "editor@yswatchs.com", password: "Editor@2025", role: "editor" },
];

const CONFIG_KEY = "ys-admin-auth-config";

function loadConfig(): AuthConfig {
  try {
    const raw = localStorage.getItem(CONFIG_KEY);
    if (raw) return JSON.parse(raw) as AuthConfig;
  } catch {}
  return { twoFAEnabled: false, twoFASecret: null };
}

function saveConfig(cfg: AuthConfig) {
  try { localStorage.setItem(CONFIG_KEY, JSON.stringify(cfg)); } catch {}
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AuthState>({ step: "login", user: null });
  const [pendingUser, setPendingUser] = useState<AdminUser | null>(null);
  const [config, setConfigState] = useState<AuthConfig>(loadConfig);

  const updateConfig = (cfg: AuthConfig) => {
    setConfigState(cfg);
    saveConfig(cfg);
  };

  const login = async (email: string, password: string) => {
    await new Promise((r) => setTimeout(r, 500));
    const found = ADMIN_USERS.find((u) => u.email === email && u.password === password);
    if (!found) return { success: false, error: "Identifiants incorrects." };
    const { password: _p, ...user } = found;
    if (config.twoFAEnabled && config.twoFASecret) {
      setPendingUser(user);
      setState({ step: "2fa", user: null });
    } else {
      setState({ step: "authenticated", user });
    }
    return { success: true };
  };

  const verify2FA = async (code: string) => {
    await new Promise((r) => setTimeout(r, 300));
    if (!config.twoFASecret) return { success: false, error: "2FA non configurée." };
    const valid = await verifyTOTP(config.twoFASecret, code);
    if (!valid) return { success: false, error: "Code incorrect. Vérifiez votre application d'authentification." };
    setState({ step: "authenticated", user: pendingUser });
    return { success: true };
  };

  const logout = () => {
    setState({ step: "login", user: null });
    setPendingUser(null);
  };

  const beginEnable2FA = async (password: string) => {
    const user = state.user;
    if (!user) return { success: false, error: "Non connecté." };
    const found = ADMIN_USERS.find((u) => u.email === user.email && u.password === password);
    if (!found) return { success: false, error: "Mot de passe incorrect." };
    const secret = generateSecret();
    const uri = getOtpAuthUri(secret, user.email, "YsWatchs Admin");
    return { success: true, secret, uri };
  };

  const confirmEnable2FA = async (code: string, secret: string) => {
    const valid = await verifyTOTP(secret, code);
    if (!valid) return { success: false, error: "Code incorrect. Scannez à nouveau le QR code et réessayez." };
    updateConfig({ twoFAEnabled: true, twoFASecret: secret });
    return { success: true };
  };

  const disable2FA = async (password: string) => {
    const user = state.user;
    if (!user) return { success: false, error: "Non connecté." };
    const found = ADMIN_USERS.find((u) => u.email === user.email && u.password === password);
    if (!found) return { success: false, error: "Mot de passe incorrect." };
    updateConfig({ twoFAEnabled: false, twoFASecret: null });
    return { success: true };
  };

  const currentUserEmail = () => state.user?.email ?? pendingUser?.email ?? "";

  return (
    <AuthContext.Provider value={{
      ...state,
      twoFAEnabled: config.twoFAEnabled,
      login, verify2FA, logout,
      beginEnable2FA, confirmEnable2FA, disable2FA,
      currentUserEmail,
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
