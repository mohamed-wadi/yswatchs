import { ReactNode } from "react";
import Sidebar from "./Sidebar";
import Header from "./Header";

interface AdminLayoutProps { children: ReactNode; title: string; subtitle?: string; }

export default function AdminLayout({ children, title, subtitle }: AdminLayoutProps) {
  return (
    <div style={{ display: "flex", height: "100vh", overflow: "hidden" }}>
      <Sidebar />
      <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden", minWidth: 0 }}>
        <Header title={title} subtitle={subtitle} />
        <main style={{ flex: 1, overflow: "auto", padding: "1.5rem" }}>
          {children}
        </main>
      </div>
    </div>
  );
}
