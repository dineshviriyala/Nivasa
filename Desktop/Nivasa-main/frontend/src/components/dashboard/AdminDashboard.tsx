import { useState, useEffect } from 'react';
import {
  Building2, Ticket, Users, Wrench, LogOut, Menu, X,
  DollarSign, User as UserIcon, Plus
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Card, CardContent, CardDescription, CardHeader, CardTitle
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import TicketManagement from '@/components/tickets/TicketManagement';
import NeighborsList from '@/components/neighbors/NeighborsList';
import AdminNeighborsList from '@/components/neighbors/AdminNeighborsList';
import MaintenanceHistory from '@/components/maintenance/MaintenanceHistory';
import ProfilePage from '@/components/profile/ProfilePage';
import { useNavigate } from 'react-router-dom';
import { toast } from '@/hooks/use-toast';
import CreateTicketForm from '../tickets/CreateTicketForm';
import axios from 'axios';
import { Input } from '@/components/ui/input';
import TechnicianManagement from '@/components/technicians/TechnicianManagement';
import API_BASE_URL from '@/config/api';

interface AdminUser {
  username?: string;
  phone: string;
  role: string;
  name?: string;
  flatNumber?: string;
  apartmentCode?: string;
}

interface AdminDashboardProps {
  user: AdminUser;
}

const AdminDashboard = ({ user }: AdminDashboardProps) => {
  const [activeTab, setActiveTab] = useState('overview');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [stats, setStats] = useState({ open: 0, resolved: 0 });
  const navigate = useNavigate();

  useEffect(() => {
    let intervalId: NodeJS.Timeout;
    const fetchStats = async () => {
      try {
        const res = await axios.get(`${API_BASE_URL}/api/auth/stats/${user.apartmentCode}`);
        setStats(res.data);
      } catch (err) {
        console.error('Failed to fetch ticket stats:', err);
      }
    };
    fetchStats();
    intervalId = setInterval(fetchStats, 5000);
    return () => clearInterval(intervalId);
  }, [user.apartmentCode]);

  const statsArray = [
    { title: 'Open Tickets', value: stats.open, description: 'Active maintenance requests' },
    { title: 'Resolved Tickets', value: stats.resolved, description: 'Resolved requests' }
  ];

  const handleLogout = () => {
    localStorage.removeItem('user');
    toast({ title: 'Logged out', description: 'You have been logged out successfully' });
    navigate('/');
  };

  const menuItems = [
    { id: 'overview', label: 'Overview', icon: Building2 },
    { id: 'tickets', label: 'Tickets', icon: Ticket },
    { id: 'create', label: 'Report Issue', icon: Plus },
    { id: 'neighbors', label: 'All Residents', icon: Users },
    { id: 'maintenance', label: 'Maintenance', icon: DollarSign },
    { id: 'technicians', label: 'Technicians', icon: Wrench },
  ];

  const getPageTitle = () => {
    if (activeTab === 'profile') return 'My Profile';
    const item = menuItems.find(item => item.id === activeTab);
    return item?.label || 'Dashboard';
  };

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={`fixed lg:static inset-y-0 left-0 z-50 w-64 bg-white shadow-lg transform ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0 transition-transform duration-300 ease-in-out`}>
        <div className="flex flex-col h-full">
          <div className="flex items-center justify-between p-6 border-b">
            <div className="flex items-center space-x-3">
              <button
                className="flex items-center space-x-3 focus:outline-none"
                onClick={() => {
                  setActiveTab('overview');
                  setSidebarOpen(false);
                }}
              >
                <Building2 className="h-8 w-8 text-blue-600" />
                <span className="text-xl font-bold text-gray-900">Nivasa</span>
              </button>
            </div>
            <Button variant="ghost" size="sm" className="lg:hidden" onClick={() => setSidebarOpen(false)}>
              <X className="h-4 w-4" />
            </Button>
          </div>

          {/* User Info */}
          <div className="p-6 border-b">
            <button
              onClick={() => {
                setActiveTab('profile');
                setSidebarOpen(false);
              }}
              className="flex items-center space-x-3 w-full hover:bg-gray-50 p-2 rounded-lg transition-colors"
            >
              <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center">
                <span className="text-white font-medium text-lg">
                  {(user.username && user.username[0]?.toUpperCase()) || '?'}
                </span>
              </div>
              <div className="text-left">
                <p className="font-medium text-gray-900">{user.username || 'User'}</p>
                <p className="text-sm text-gray-500">Apt {user.flatNumber}</p>
              </div>
            </button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-6 space-y-2">
            {menuItems.map((item) => (
              <button
                key={item.id}
                onClick={() => {
                  setActiveTab(item.id);
                  setSidebarOpen(false);
                }}
                className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${activeTab === item.id
                  ? 'bg-blue-100 text-blue-700'
                  : 'text-gray-600 hover:bg-gray-100'
                  }`}
              >
                <item.icon className="h-5 w-5" />
                <span className="font-medium text-sm">{item.label}</span>
              </button>
            ))}
          </nav>

          {/* Logout */}
          <div className="p-6 border-t">
            <Button variant="outline" className="w-full" onClick={handleLogout}>
              <LogOut className="h-4 w-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="bg-white shadow-sm border-b p-4 lg:p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button variant="ghost" size="sm" className="lg:hidden" onClick={() => setSidebarOpen(true)}>
                <Menu className="h-5 w-5" />
              </Button>
              <h1 className="text-2xl font-bold text-gray-900">
                {getPageTitle()}
              </h1>
            </div>
            <Badge variant="secondary" className="hidden sm:inline-flex">Admin Panel</Badge>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 overflow-auto p-4 lg:p-6">
          {activeTab === 'profile' && <ProfilePage user={user as any} />}
          {activeTab === 'overview' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
                {statsArray.map((stat, index) => (
                  <Card key={index}>
                    <CardHeader className="pb-3">
                      <CardDescription>{stat.title}</CardDescription>
                      <CardTitle className="text-3xl">{stat.value}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-gray-600">{stat.description}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>

              <Card>
                <CardHeader>
                  <CardTitle>Need Help?</CardTitle>
                  <CardDescription>Report a maintenance issue quickly</CardDescription>
                </CardHeader>
                <CardContent>
                  <Button onClick={() => setActiveTab('create')} className="w-full md:w-auto">
                    <Plus className="h-4 w-4 mr-2" />
                    Report New Issue
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Quick Actions</CardTitle>
                  <CardDescription>Manage your property efficiently</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Button onClick={() => setActiveTab('tickets')} className="h-20 flex-col space-y-2">
                      <Ticket className="h-6 w-6" />
                      <span>Manage Tickets</span>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {activeTab === 'tickets' && <TicketManagement user={user} />}
          {activeTab === 'neighbors' && (
            <AdminNeighborsList
              apartmentCode={user.apartmentCode || ''}
              currentUserFlatNumber={user.flatNumber}
            />
          )}
          {activeTab === 'maintenance' && (
            <MaintenanceHistory
              apartmentCode={user.apartmentCode || ''}
              isAdmin={true}
            />
          )}
          {activeTab === 'create' && (
            <CreateTicketForm user={user} onSuccess={() => setActiveTab('tickets')} />
          )}
          {activeTab === 'technicians' && <TechnicianManagement apartmentCode={user.apartmentCode || ''} />}
        </main>
      </div>
    </div>
  );
}

export default AdminDashboard;