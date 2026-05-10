import { useState, useEffect } from "react";
import { Switch, Route, Router as WouterRouter } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { CartProvider } from "@/hooks/use-cart";
import SplashScreen from "@/components/SplashScreen";
import HomePage from "@/pages/home";
import CataloguePage from "@/pages/catalogue";
import ProductPage from "@/pages/product";
import CartPage from "@/pages/cart";
import CollectionsPage from "@/pages/collections";
import SearchPage from "@/pages/search";
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
      <Route path="/collections" component={CollectionsPage} />
      <Route path="/recherche" component={SearchPage} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  const [showSplash, setShowSplash] = useState(() => {
    return !sessionStorage.getItem("ys_intro_seen");
  });

  useEffect(() => {
    document.documentElement.classList.add("dark");
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <CartProvider>
          {showSplash && (
            <SplashScreen onComplete={() => setShowSplash(false)} />
          )}
          <div className="noise-overlay" aria-hidden="true" />
          <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
            <Router />
          </WouterRouter>
          <Toaster />
        </CartProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
