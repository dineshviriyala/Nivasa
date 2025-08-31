import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import AdminDashboard from "@/components/dashboard/AdminDashboard";
import TenantDashboard from "@/components/dashboard/TenantDashboard";
import { toast } from "@/hooks/use-toast";
import axios from "axios";
import type { User } from "@/components/profile/ProfilePage";
import API_BASE_URL from '@/config/api';

const Dashboard = () => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = sessionStorage.getItem("user"); // or localStorage if you're using that
    console.log('Stored user from sessionStorage:', storedUser);

    if (!storedUser) {
      toast({
        title: "Access denied",
        description: "Please log in to access the dashboard",
        variant: "destructive",
      });
      navigate("/login-form");
      return;
    }

    const parsed = JSON.parse(storedUser);
    console.log('Parsed user data from sessionStorage:', parsed);
    const { phone } = parsed;

    const validateUser = async () => {
      try {
        const res = await axios.post(`${API_BASE_URL}/api/auth/validate`, { phoneNumber: phone });
        console.log('Dashboard received user data from validate:', res.data);
        console.log('🔍 User apartmentCode:', res.data.apartmentCode);
        console.log('🔍 User role:', res.data.role);
        console.log('🔍 User phone:', res.data.phone);
        setUser(res.data);
      } catch (err: any) {
        console.error("Validation failed:", err);
        toast({
          title: "Session expired",
          description: "Please log in again",
          variant: "destructive",
        });
        sessionStorage.removeItem("user");
        navigate("/login-form");
      } finally {
        setIsLoading(false);
      }
    };

    validateUser();
  }, [navigate]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {user.role === "admin" ? (
        <AdminDashboard user={user} />
      ) : (
        <TenantDashboard user={user} />
      )}
    </div>
  );
};

export default Dashboard;
