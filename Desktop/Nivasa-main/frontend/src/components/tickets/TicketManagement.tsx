import { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Clock, User as UserIcon, Wrench, CheckCircle, AlertCircle } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import axios from 'axios';
import API_BASE_URL from '@/config/api';


interface User {
  apartmentCode: any;
  apartment: any;
  apartmentNumber?: string;
  flatNumber: String;
}

interface TicketManagementProps {
  user: User;
}

interface Ticket {
  id: string;
  title: string;
  description: string;
  category: string;
  priority: string;
  status: 'open' | 'assigned' | 'cleared';
  tenant: string;
  apartment: string;
  createdAt: string;
  assignedTo?: string;
  phoneNumber?: string;
}

const TicketManagement = ({ user }: TicketManagementProps) => {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTickets = async () => {
      try {
        const res = await axios.get(`${API_BASE_URL}/api/auth/all-complaint?apartmentCode=${user.apartmentCode}`);
        const data = res.data.complaints.map((complaint: any) => ({
          id: complaint._id,
          title: complaint.title,
          description: complaint.description,
          category: complaint.category,
          priority: complaint.priority || 'Medium',
          status: complaint.status === 'resolved' ? 'cleared' :
            complaint.status === 'in-progress' ? 'assigned' : 'open',
          tenant: complaint.user?.username && complaint.user?.flatNumber
            ? `${complaint.user.username} (Flat ${complaint.user.flatNumber})`
            : 'Unknown',
          apartment: complaint.apartment?.apartmentCode || 'Unknown',
          createdAt: new Date(complaint.createdAt).toLocaleDateString(),
          assignedTo: complaint.assignedTo || undefined,
          phoneNumber: complaint.user?.phoneNumber || 'N/A'
        }));
        setTickets(data);
      } catch (err) {
        console.error("Error fetching tickets:", err);
        setError("Failed to load tickets. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchTickets();
  }, []);

  const updateTicketStatus = async (ticketId: string, newStatus: 'open' | 'assigned' | 'cleared', assignedTo?: string) => {
    try {
      // Map our status to the backend's expected status
      const backendStatus = newStatus === 'cleared' ? 'resolved' :
        newStatus === 'assigned' ? 'in-progress' : 'open';

      await axios.put(`${API_BASE_URL}/api/auth/update-complaint/${ticketId}`, {
        status: backendStatus,
        assignedTo
      });

      setTickets(prev => prev.map(ticket =>
        ticket.id === ticketId
          ? { ...ticket, status: newStatus, assignedTo }
          : ticket
      ));

      const statusText = newStatus === 'open' ? 'open' :
        newStatus === 'assigned' ? 'assigned' : 'cleared';
      toast({
        title: 'Ticket updated',
        description: `Ticket #${ticketId} has been ${statusText}`,
        variant: 'default'
      });
    } catch (err) {
      console.error("Error updating ticket:", err);
      toast({
        title: 'Error',
        description: 'Failed to update ticket status',
        variant: 'destructive'
      });
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'open': return <AlertCircle className="h-4 w-4" />;
      case 'assigned': return <UserIcon className="h-4 w-4" />;
      case 'cleared': return <CheckCircle className="h-4 w-4" />;
      default: return <Clock className="h-4 w-4" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'open': return 'destructive';
      case 'assigned': return 'default';
      case 'cleared': return 'secondary';
      default: return 'outline';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'High': return 'bg-red-100 text-red-800';
      case 'Medium': return 'bg-yellow-100 text-yellow-800';
      case 'Low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusBorderColor = (status: string) => {
    switch (status) {
      case 'open': return 'border-l-gray-500';
      case 'assigned': return 'border-l-blue-500';
      case 'cleared': return 'border-l-green-500';
      default: return 'border-l-gray-300';
    }
  };

  const renderTicketCard = (ticket: Ticket) => (
    <Card key={ticket.id} className={`mb-4 border-l-4 ${getStatusBorderColor(ticket.status)}`}>
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div>
            <CardTitle className="text-lg">{ticket.title}</CardTitle>
            <CardDescription className="mt-1">
              {ticket.tenant} • Apartment {ticket.apartment} • {ticket.createdAt} • Phone: {ticket.phoneNumber}
            </CardDescription>
          </div>
          <div className="flex space-x-2">
            <Badge className={getPriorityColor(ticket.priority)}>
              {ticket.priority}
            </Badge>
            <Badge variant={getStatusColor(ticket.status) as any}>
              {getStatusIcon(ticket.status)}
              <span className="ml-1 capitalize">{ticket.status}</span>
            </Badge>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-gray-600 mb-4">{ticket.description}</p>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4 text-sm text-gray-500">
            <span className="flex items-center">
              <Wrench className="h-4 w-4 mr-1" />
              {ticket.category}
            </span>
            {ticket.assignedTo && (
              <span className="flex items-center">
                <UserIcon className="h-4 w-4 mr-1" />
                {ticket.assignedTo}
              </span>
            )}
          </div>
          <div className="flex space-x-2">
            {ticket.status !== 'open' && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => updateTicketStatus(ticket.id, 'open')}
              >
                Unassign
              </Button>
            )}
            {ticket.status !== 'cleared' && (
              <Button
                variant="default"
                size="sm"
                onClick={() => updateTicketStatus(ticket.id, 'cleared', ticket.assignedTo)}
              >
                Mark Cleared
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );

  const openTickets = tickets.filter(t => t.status === 'open');
  const clearedTickets = tickets.filter(t => t.status === 'cleared');

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <p>Loading tickets...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-64">
        <p className="text-red-500">{error}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Ticket Management</h2>
        <div className="flex space-x-2">
          <Select defaultValue="all">
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              <SelectItem value="plumbing">Plumbing</SelectItem>
              <SelectItem value="electrical">Electrical</SelectItem>
              <SelectItem value="hvac">HVAC</SelectItem>
              <SelectItem value="maintenance">Maintenance</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <Tabs defaultValue="open" className="space-y-4">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="open" className="flex items-center space-x-2">
            <AlertCircle className="h-4 w-4" />
            <span>Open ({openTickets.length})</span>
          </TabsTrigger>
          <TabsTrigger value="cleared" className="flex items-center space-x-2">
            <CheckCircle className="h-4 w-4" />
            <span>Cleared ({clearedTickets.length})</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="open" className="space-y-4">
          {openTickets.length === 0 ? (
            <Card>
              <CardContent className="text-center py-8">
                <p className="text-gray-500">No open tickets</p>
              </CardContent>
            </Card>
          ) : (
            openTickets.map(renderTicketCard)
          )}
        </TabsContent>

        <TabsContent value="cleared" className="space-y-4">
          {clearedTickets.length === 0 ? (
            <Card>
              <CardContent className="text-center py-8">
                <p className="text-gray-500">No cleared tickets</p>
              </CardContent>
            </Card>
          ) : (
            clearedTickets.map(renderTicketCard)
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}


//const TicketManagement = () => {

//};

export default TicketManagement;