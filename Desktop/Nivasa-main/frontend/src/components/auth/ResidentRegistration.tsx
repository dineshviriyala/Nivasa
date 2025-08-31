import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Building2, Eye, EyeOff, ArrowLeft, CheckCircle, XCircle } from "lucide-react";
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

const ResidentRegistration = () => {
  const [formData, setFormData] = useState({
    username: "",
    phone: "",
    flatNumber: "",
    apartmentCode: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [flatNumberStatus, setFlatNumberStatus] = useState({
    checking: false,
    available: null,
    message: "",
  });
  const navigate = useNavigate();

  // Debounced flat number availability check
  useEffect(() => {
    if (formData.flatNumber && formData.apartmentCode) {
      const timeoutId = setTimeout(() => {
        checkFlatNumberAvailability();
      }, 500);

      return () => clearTimeout(timeoutId);
    } else {
      setFlatNumberStatus({ checking: false, available: null, message: "" });
    }
  }, [formData.flatNumber, formData.apartmentCode]);

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const checkFlatNumberAvailability = async () => {
    if (!formData.flatNumber || !formData.apartmentCode) return;

    setFlatNumberStatus({ checking: true, available: null, message: "" });

    try {
      const response = await axios.get(
        `${API_BASE_URL}/api/auth/check-flat-availability?flatNumber=${encodeURIComponent(formData.flatNumber)}&apartmentCode=${encodeURIComponent(formData.apartmentCode)}`
      );

      setFlatNumberStatus({
        checking: false,
        available: response.data.isAvailable,
        message: response.data.message,
      });
    } catch (error: any) {
      setFlatNumberStatus({
        checking: false,
        available: false,
        message: error.response?.data?.error || "Error checking availability",
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Check if flat number is available before submitting
    if (flatNumberStatus.available === false) {
      toast({
        title: "Flat number not available",
        description: "Please choose a different flat number",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      await axios.post(`${API_BASE_URL}/api/auth/signup-resident`, {
        username: formData.username,
        phoneNumber: formData.phone,
        flatNumber: formData.flatNumber,
        password: formData.password,
        apartmentCode: formData.apartmentCode,
      });

      toast({
        title: "Account created!",
        description: "Login to access dashboard",
      });
      navigate("/login-form");
    } catch (error: any) {
      toast({
        title: "Signup failed",
        description: error.response?.data?.error || "Server error",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const getFlatNumberStatusIcon = () => {
    if (flatNumberStatus.checking) {
      return <div className="animate-spin h-4 w-4 border-2 border-blue-500 border-t-transparent rounded-full" />;
    }
    if (flatNumberStatus.available === true) {
      return <CheckCircle className="h-4 w-4 text-green-500" />;
    }
    if (flatNumberStatus.available === false) {
      return <XCircle className="h-4 w-4 text-red-500" />;
    }
    return null;
  };

  const getFlatNumberStatusColor = () => {
    if (flatNumberStatus.available === true) return "text-green-600";
    if (flatNumberStatus.available === false) return "text-red-600";
    return "text-gray-500";
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <Button
            variant="ghost"
            onClick={() => navigate("/")}
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
          <CardTitle className="text-2xl">Resident Registration</CardTitle>
          <CardDescription>
            Join your apartment community as a resident
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="username">Username</Label>
              <Input
                id="username"
                value={formData.username}
                onChange={(e) => handleChange("username", e.target.value)}
                placeholder="Enter your username"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number</Label>
              <Input
                id="phone"
                type="tel"
                value={formData.phone}
                onChange={(e) => handleChange("phone", e.target.value)}
                placeholder="Enter your phone number"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="apartmentCode">Apartment Code</Label>
              <Input
                id="apartmentCode"
                value={formData.apartmentCode}
                onChange={(e) => handleChange("apartmentCode", e.target.value)}
                placeholder="Enter code provided by admin"
                required
              />
              <p className="text-xs text-gray-500">
                Get this code from your apartment admin or another resident
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="flatNumber">Flat Number</Label>
              <div className="relative">
                <Input
                  id="flatNumber"
                  value={formData.flatNumber}
                  onChange={(e) => handleChange("flatNumber", e.target.value)}
                  placeholder="e.g., 2A, 15B, 101"
                  required
                  className={flatNumberStatus.available === false ? "border-red-500" : ""}
                />
                {flatNumberStatus.checking || flatNumberStatus.available !== null ? (
                  <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                    {getFlatNumberStatusIcon()}
                  </div>
                ) : null}
              </div>
              {flatNumberStatus.message && (
                <p className={`text-xs ${getFlatNumberStatusColor()}`}>
                  {flatNumberStatus.message}
                </p>
              )}
              <p className="text-xs text-gray-500">
                Each flat number must be unique within your apartment
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={formData.password}
                  onChange={(e) => handleChange("password", e.target.value)}
                  placeholder="Create a password"
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

            <Button
              type="submit"
              className="w-full"
              disabled={isLoading || flatNumberStatus.available === false}
            >
              {isLoading ? "Creating Account..." : "Join Apartment"}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              Need to create a new apartment?{" "}
              <Button
                variant="link"
                onClick={() => navigate("/register-apartment")}
                className="p-0 h-auto text-blue-600 hover:underline font-medium"
              >
                Register new apartment
              </Button>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ResidentRegistration;