import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Building2, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from '@/hooks/use-toast';
import axios from 'axios';
import API_BASE_URL from '@/config/api';

const RegisterApartment = () => {
  const [apartmentName, setApartmentName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const generateApartmentCode = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let result = '';
    for (let i = 0; i < 4; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!apartmentName.trim()) {
      toast({ title: 'Missing apartment name', variant: 'destructive' });
      return;
    }

    setIsLoading(true);
    try {
      const response = await axios.post(`${API_BASE_URL}/api/auth/register-apartment`, {
        name: apartmentName,
      });

      const { apartmentCode } = response.data;

      toast({
        title: 'Apartment registered!',
        description: `Code generated: ${apartmentCode}`,
      });

      navigate(`/admin-registration?code=${apartmentCode}`);
    } catch (error: any) {
      toast({
        title: 'Registration failed',
        description: error.response?.data?.error || 'Server error',
        variant: 'destructive',
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
            onClick={() => navigate('/')}
            className="absolute top-4 left-4 p-2"
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div className="flex items-center justify-center space-x-2 mb-4">
            <Building2 className="h-8 w-8 text-blue-600" />
            <span className="text-2xl font-bold text-gray-900">Nivasa</span>
          </div>
          <CardTitle className="text-2xl">Register New Apartment</CardTitle>
          <CardDescription>
            Create a new apartment community and get your management code
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="apartmentName">Apartment Name *</Label>
              <Input
                id="apartmentName"
                value={apartmentName}
                onChange={(e) => setApartmentName(e.target.value)}
                placeholder="e.g., Sunset Heights, Park View Apartments"
                required
              />
              <p className="text-xs text-gray-500">
                This will be the name displayed for your apartment community
              </p>
            </div>

            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? 'Creating Apartment...' : 'Generate Code & Continue'}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              Already have an apartment code?{' '}
              <Button
                variant="link"
                onClick={() => navigate('/resident-registration')}
                className="p-0 h-auto text-blue-600 hover:underline font-medium"
              >
                Join as resident
              </Button>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default RegisterApartment;
