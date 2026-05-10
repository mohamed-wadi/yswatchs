import { useState } from "react";
import { Switch, Route, Router as WouterRouter } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { CartProvider } from "@/hooks/use-cart";
import { ThemeProvider } from "@/hooks/use-theme";
import SplashScreen from "@/components/SplashScreen";
import HomePage from "@/pages/home";
import CataloguePage from "@/pages/catalogue";
import ProductPage from "@/pages/product";
import CartPage from "@/pages/cart";
import CheckoutPage from "@/pages/checkout";
import CollectionsPage from "@/pages/collections";
import SearchPage from "@/pages/search";
import PromosPage from "@/pages/promos";
import NotFound from "@/pages/not-found";

const queryClient = new QueryClient();

function Router() {
  return (
    <Switch>
      <Route path="/" component={HomePage} />
      <Route path="/montres/homme" component={CataloguePage} />
      <Route path="/montres/femme" component={CataloguePage} />
      <Route path="/produit/:id" component={ProductPage} />
      <Route path="/panier" component={CartPage} />
      <Route path="/commande" component={CheckoutPage} />
      <Route path="/collections" component={CollectionsPage} />
      <Route path="/recherche" component={SearchPage} />
      <Route path="/promotions" component={PromosPage} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  const [showSplash, setShowSplash] = useState(() => {
    return !sessionStorage.getItem("ys_intro_seen");
  });

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <ThemeProvider>
          <CartProvider>
            {showSplash && (
              <SplashScreen onComplete={() => setShowSplash(false)} />
            )}
            <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
              <Router />
            </WouterRouter>
            <Toaster />
          </CartProvider>
        </ThemeProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
