import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import ProtectedRoute from "@/components/ProtectedRoute";
import AdminProtectedRoute from "@/components/AdminProtectedRoute";
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import Nutrition from "./pages/Nutrition";
import Mindset from "./pages/Mindset";
import Treino from "./pages/Treino";
import Complemento from "./pages/Complemento";
import CreatePlan from "./pages/CreatePlan";
import MyPlan from "./pages/MyPlan";

import CarnivoreDiet from "./pages/CarnivoreDiet";
import LowCarbDiet from "./pages/LowCarbDiet";
import KetoDiet from "./pages/KetoDiet";
import IntermittentFasting from "./pages/IntermittentFasting";
import DetoxJuices from "./pages/DetoxJuices";
import FoodEducation from "./pages/FoodEducation";
import NotFound from "./pages/NotFound";

import AdminDashboard from "./pages/admin/Dashboard";
import AdminUsers from "./pages/admin/Users";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            <Route path="/auth" element={<Auth />} />
            <Route
              path="/"
              element={
                <ProtectedRoute>
                  <Index />
                </ProtectedRoute>
              }
            />
            <Route
              path="/criar-plano"
              element={
                <ProtectedRoute>
                  <CreatePlan />
                </ProtectedRoute>
              }
            />
            <Route
              path="/meu-plano"
              element={
                <ProtectedRoute>
                  <MyPlan />
                </ProtectedRoute>
              }
            />
            <Route
              path="/nutricao"
              element={
                <ProtectedRoute>
                  <Nutrition />
                </ProtectedRoute>
              }
            />
            <Route
              path="/mentalidade"
              element={
                <ProtectedRoute>
                  <Mindset />
                </ProtectedRoute>
              }
            />
            <Route
              path="/treino"
              element={
                <ProtectedRoute>
                  <Treino />
                </ProtectedRoute>
              }
            />
            <Route
              path="/dieta-carnivora"
              element={
                <ProtectedRoute>
                  <CarnivoreDiet />
                </ProtectedRoute>
              }
            />
            <Route
              path="/dieta-lowcarb"
              element={
                <ProtectedRoute>
                  <LowCarbDiet />
                </ProtectedRoute>
              }
            />
            <Route
              path="/dieta-cetogenica"
              element={
                <ProtectedRoute>
                  <KetoDiet />
                </ProtectedRoute>
              }
            />
            <Route
              path="/jejum-intermitente"
              element={
                <ProtectedRoute>
                  <IntermittentFasting />
                </ProtectedRoute>
              }
            />
            <Route
              path="/sucos-detox"
              element={
                <ProtectedRoute>
                  <DetoxJuices />
                </ProtectedRoute>
              }
            />
            <Route
              path="/complemento"
              element={
                <ProtectedRoute>
                  <Complemento />
                </ProtectedRoute>
              }
            />
            <Route
              path="/educacao-alimentar"
              element={
                <ProtectedRoute>
                  <FoodEducation />
                </ProtectedRoute>
              }
            />
            {/* Admin Routes */}
            <Route
              path="/admin"
              element={
                <AdminProtectedRoute>
                  <AdminDashboard />
                </AdminProtectedRoute>
              }
            />
            <Route
              path="/admin/users"
              element={
                <AdminProtectedRoute>
                  <AdminUsers />
                </AdminProtectedRoute>
              }
            />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
