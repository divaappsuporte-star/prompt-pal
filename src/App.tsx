import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Nutrition from "./pages/Nutrition";
import Mindset from "./pages/Mindset";
import CarnivoreDiet from "./pages/CarnivoreDiet";
import LowCarbDiet from "./pages/LowCarbDiet";
import KetoDiet from "./pages/KetoDiet";
import IntermittentFasting from "./pages/IntermittentFasting";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/nutricao" element={<Nutrition />} />
          <Route path="/mentalidade" element={<Mindset />} />
          <Route path="/dieta-carnivora" element={<CarnivoreDiet />} />
          <Route path="/dieta-lowcarb" element={<LowCarbDiet />} />
          <Route path="/dieta-cetogenica" element={<KetoDiet />} />
          <Route path="/jejum-intermitente" element={<IntermittentFasting />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
