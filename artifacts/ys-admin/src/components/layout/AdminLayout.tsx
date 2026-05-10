import { ReactNode } from "react";
import Sidebar from "./Sidebar";
import Header from "./Header";

interface AdminLayoutProps {
  children: ReactNode;
  title: string;
  subtitle?: string;
}

export default function AdminLayout({ children, title, subtitle }: AdminLayoutProps) {
  return (
    <div style={{ display: "flex", minHeight: "100vh" }}>
      <Sidebar />
      <div
        style={{
          flex: 1,
          marginLeft: "var(--ys-sidebar-w)",
          display: "flex",
          flexDirection: "column",
          minHeight: "100vh",
        }}
      >
        <Header title={title} subtitle={subtitle} />
        <main
          style={{
            flex: 1,
            padding: "1.5rem",
            background: "var(--ys-bg)",
          }}
        >
          {children}
        </main>
      </div>
    </div>
  );
}
