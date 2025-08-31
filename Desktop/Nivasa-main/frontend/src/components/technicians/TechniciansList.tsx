import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Phone, Mail, Wrench } from 'lucide-react';
import API_BASE_URL from '@/config/api';

interface Technician {
  id: string;
  name: string;
  phone: string;
  email: string;
  specialty: string;
  apartmentCode: string;
}

interface TechniciansListProps {
  apartmentCode: string;
  isAdmin?: boolean;
}

const TechniciansList = ({ apartmentCode, isAdmin = false }: TechniciansListProps) => {
  const [technicians, setTechnicians] = useState<Technician[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchTechnicians = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/api/all-technicians?apartmentCode=${apartmentCode}`);
        if (!response.ok) throw new Error('Failed to fetch technicians');
        const data = await response.json();
        
        // Map _id to id for consistency with frontend interface
        const mappedTechnicians = data.map((tech: any) => ({
          id: tech._id,
          name: tech.name,
          phone: tech.phone,
          email: tech.email,
          specialty: tech.specialty,
          apartmentCode: tech.apartmentCode
        }));
        
        setTechnicians(mappedTechnicians);
      } catch (error) {
        console.error('Error fetching technicians:', error);
        // Fallback to empty array if API fails
        setTechnicians([]);
      } finally {
        setIsLoading(false);
      }
    };

    if (apartmentCode) {
      fetchTechnicians();
    } else {
      setIsLoading(false);
    }
  }, [apartmentCode]);

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="animate-pulse bg-gray-200 h-32 rounded-lg"></div>
        <div className="animate-pulse bg-gray-200 h-32 rounded-lg"></div>
        <div className="animate-pulse bg-gray-200 h-32 rounded-lg"></div>
      </div>
    );
  }
  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-2">
        <Wrench className="h-6 w-6 text-blue-600" />
        <h2 className="text-2xl font-bold">Technicians</h2>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {technicians.map((technician) => (
          <Card key={technician.id} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <span>{technician.name}</span>
              </CardTitle>
              <CardDescription>
                <Badge variant="secondary">{technician.specialty}</Badge>
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center space-x-2 text-sm">
                <Phone className="h-4 w-4 text-green-600" />
                <span>{technician.phone}</span>
              </div>
              <div className="flex items-center space-x-2 text-sm">
                <Mail className="h-4 w-4 text-blue-600" />
                <span className="truncate">{technician.email}</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};