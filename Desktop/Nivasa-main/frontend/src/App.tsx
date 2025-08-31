import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useNavigate } from "react-router-dom";
import Index from "./components/pages/Index";
import Dashboard from "./components/pages/Dashboard";
import NotFound from "./components/pages/NotFound";
import RegisterApartment from "./components/apartment/RegisterApartment";
import AdminRegistration from "./components/auth/AdminRegistration";
import ResidentRegistration from "./components/auth/ResidentRegistration";
import LoginForm from "./components/auth/LoginForm";
import AdminDashboard from "./components/dashboard/AdminDashboard";
import TenantDashboard from "./components/dashboard/TenantDashboard";

const queryClient = new QueryClient();

// Wrapper component for standalone login form
const LoginFormWrapper = () => {
  const navigate = useNavigate();

  return (
    <LoginForm
      onBack={() => navigate('/')}
      onSwitchToSignup={function (): void {
        throw new Error("Function not implemented.");
      }}
    />
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/dashboard" element={<Dashboard />} />

          <Route path="/register-apartment" element={<RegisterApartment />} />
          <Route path="/admin-registration" element={<AdminRegistration />} />
          <Route path="/admin-dashboard" element={<AdminDashboard user={undefined} />} />
          <Route path="/tenant-dashboard" element={<TenantDashboard user={undefined} />} />
          <Route
            path="/resident-registration"
            element={<ResidentRegistration />}
          />
          <Route path="/login-form" element={<LoginFormWrapper />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;