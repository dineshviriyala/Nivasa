
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Phone, Mail, Search, UserPlus, MapPin } from 'lucide-react';

interface Tenant {
  id: string;
  name: string;
  email: string;
  phone: string;
  apartment: string;
  moveInDate: string;
  status: 'active' | 'inactive';
  activeTickets: number;
}

const TenantManagement = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [tenants] = useState<Tenant[]>([
    {
      id: '1',
      name: 'John Doe',
      email: 'john.doe@email.com',
      phone: '(555) 123-4567',
      apartment: '2A',
      moveInDate: '2023-06-15',
      status: 'active',
      activeTickets: 2
    },
    {
      id: '2',
      name: 'Jane Smith',
      email: 'jane.smith@email.com',
      phone: '(555) 234-5678',
      apartment: '3B',
      moveInDate: '2023-08-01',
      status: 'active',
      activeTickets: 1
    },
    {
      id: '3',
      name: 'Bob Wilson',
      email: 'bob.wilson@email.com',
      phone: '(555) 345-6789',
      apartment: '1C',
      moveInDate: '2023-04-20',
      status: 'active',
      activeTickets: 0
    },
    {
      id: '4',
      name: 'Alice Johnson',
      email: 'alice.johnson@email.com',
      phone: '(555) 456-7890',
      apartment: '4D',
      moveInDate: '2023-09-10',
      status: 'active',
      activeTickets: 3
    }
  ]);

  const filteredTenants = tenants.filter(tenant =>
    tenant.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    tenant.apartment.toLowerCase().includes(searchTerm.toLowerCase()) ||
    tenant.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalTenants = tenants.length;
  const activeTenants = tenants.filter(t => t.status === 'active').length;
  const totalActiveTickets = tenants.reduce((sum, tenant) => sum + tenant.activeTickets, 0);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Tenant Management</h2>
        <Button>
          <UserPlus className="h-4 w-4 mr-2" />
          Add New Tenant
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="pb-3">
            <CardDescription>Total Tenants</CardDescription>
            <CardTitle className="text-3xl">{totalTenants}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-600">Registered in the system</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardDescription>Active Tenants</CardDescription>
            <CardTitle className="text-3xl">{activeTenants}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-600">Currently residing</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardDescription>Active Tickets</CardDescription>
            <CardTitle className="text-3xl">{totalActiveTickets}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-600">Open maintenance requests</p>
          </CardContent>
        </Card>
      </div>

      {/* Search */}
      <Card>
        <CardHeader>
          <CardTitle>Tenant Directory</CardTitle>
          <CardDescription>Manage tenant information and contact details</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-2 mb-6">
            <Search className="h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search by name, apartment, or email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="flex-1"
            />
          </div>

          {/* Tenants List */}
          <div className="space-y-4">
            {filteredTenants.map((tenant) => (
              <Card key={tenant.id} className="border-l-4 border-l-blue-500">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-3">
                        <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center">
                          <span className="text-white font-medium">
                            {tenant.name.split(' ').map(n => n[0]).join('')}
                          </span>
                        </div>
                        <div>
                          <h3 className="font-semibold text-lg">{tenant.name}</h3>
                          <p className="text-gray-500 flex items-center">
                            <MapPin className="h-4 w-4 mr-1" />
                            Apartment {tenant.apartment}
                          </p>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        <div className="flex items-center space-x-2 text-sm text-gray-600">
                          <Mail className="h-4 w-4" />
                          <span>{tenant.email}</span>
                        </div>
                        <div className="flex items-center space-x-2 text-sm text-gray-600">
                          <Phone className="h-4 w-4" />
                          <span>{tenant.phone}</span>
                        </div>
                      </div>

                      <div className="flex items-center space-x-4 text-sm text-gray-500">
                        <span>Move-in date: {tenant.moveInDate}</span>
                        <span>•</span>
                        <span>Active tickets: {tenant.activeTickets}</span>
                      </div>
                    </div>

                    <div className="flex flex-col items-end space-y-2">
                      <Badge variant={tenant.status === 'active' ? 'default' : 'secondary'}>
                        {tenant.status}
                      </Badge>
                      {tenant.activeTickets > 0 && (
                        <Badge variant="destructive">
                          {tenant.activeTickets} Open Ticket{tenant.activeTickets > 1 ? 's' : ''}
                        </Badge>
                      )}
                      <div className="flex space-x-2">
                        <Button variant="outline" size="sm">
                          Contact
                        </Button>
                        <Button variant="outline" size="sm">
                          View Profile
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {filteredTenants.length === 0 && (
            <div className="text-center py-8">
              <p className="text-gray-500">No tenants found matching your search</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default TenantManagement;
