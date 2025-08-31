import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Building2, Eye, EyeOff, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { toast } from "@/hooks/use-toast";
import axios from "axios";
import API_BASE_URL from '@/config/api';

interface LoginFormProps {
  onBack: () => void;
  onSwitchToSignup: () => void;
}

const LoginForm = ({ onBack, onSwitchToSignup }: LoginFormProps) => {
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const res = await axios.post(`${API_BASE_URL}/api/auth/login`, {
        phoneNumber: phone,
        password,
      });

      const { user, token } = res.data;

      sessionStorage.setItem("user", JSON.stringify(user));
      sessionStorage.setItem("token", token);

      toast({
        title: "Welcome back!",
      });

      console.log('Login response data:', res.data);

      sessionStorage.setItem('user', JSON.stringify({
        phone: res.data.phone,
        username: res.data.username,
        role: res.data.role,
        name: res.data.name,
        flatNumber: res.data.flatNumber,
        apartmentCode: res.data.apartmentCode,
      }));

      console.log('Stored user data in sessionStorage:', {
        phone: res.data.phone,
        username: res.data.username,
        role: res.data.role,
        name: res.data.name,
        flatNumber: res.data.flatNumber,
        apartmentCode: res.data.apartmentCode,
      });

      navigate("/dashboard");
    } catch (error: any) {
      toast({
        title: "Login failed",
        description:
          error.response?.data?.error || "Invalid credentials or server error",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <Button
            variant="ghost"
            onClick={onBack || (() => navigate('/'))}
            className="absolute top-4 left-4 p-2"
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div className="flex items-center justify-center space-x-2 mb-4">
            <Building2 className="h-8 w-8 text-blue-600" />
            <span className="text-2xl font-bold text-gray-900">
              Nivasa
            </span>
          </div>
          <CardTitle className="text-2xl">Welcome Back</CardTitle>
          <CardDescription>Sign in to access your dashboard</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number</Label>
              <Input
                id="phone"
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="Enter your phone number"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  required
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </div>

            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? "Signing In..." : "Sign In"}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              Don't have an account?{" "}
              <button
                onClick={onSwitchToSignup}
                className="text-blue-600 hover:underline font-medium"
              >
                Register here
              </button>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default LoginForm;