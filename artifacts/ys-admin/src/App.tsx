import { Switch, Route, Router as WouterRouter, Redirect } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AuthProvider, useAuth } from "@/lib/auth";
import LoginPage from "@/pages/login";
import Dashboard from "@/pages/dashboard";
import OrdersPage from "@/pages/orders";
import ProductsPage from "@/pages/products";
import InventoryPage from "@/pages/inventory";
import CustomersPage from "@/pages/customers";
import PromosPage from "@/pages/promos";
import AnalyticsPage from "@/pages/analytics";
import SettingsPage from "@/pages/settings";
import NotFound from "@/pages/not-found";

const queryClient = new QueryClient();

function ProtectedRouter() {
  const { step } = useAuth();

  if (step !== "authenticated") {
    return <LoginPage />;
  }

  return (
    <Switch>
      <Route path="/admin" component={Dashboard} />
      <Route path="/admin/" component={Dashboard} />
      <Route path="/admin/orders" component={OrdersPage} />
      <Route path="/admin/products" component={ProductsPage} />
      <Route path="/admin/inventory" component={InventoryPage} />
      <Route path="/admin/customers" component={CustomersPage} />
      <Route path="/admin/promos" component={PromosPage} />
      <Route path="/admin/analytics" component={AnalyticsPage} />
      <Route path="/admin/settings" component={SettingsPage} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  const base = import.meta.env.BASE_URL.replace(/\/$/, "");

  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <WouterRouter base={base}>
          <ProtectedRouter />
        </WouterRouter>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
