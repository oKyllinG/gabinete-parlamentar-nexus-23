
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import { PermissionsProvider } from "@/contexts/PermissionsContext";
import { AgendaProvider } from "@/contexts/AgendaContext";
import { AgendaCategoriasProvider } from "@/contexts/AgendaCategoriasContext";
import Login from "./pages/Login";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <PermissionsProvider>
        <AgendaCategoriasProvider>
          <AgendaProvider>
            <BrowserRouter>
              <Routes>
                <Route path="/login" element={<Login />} />
                <Route path="/*" element={<Index />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </BrowserRouter>
          </AgendaProvider>
        </AgendaCategoriasProvider>
      </PermissionsProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
