import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Clock, Wrench, CheckCircle, AlertCircle, MessageSquare, Filter } from 'lucide-react';
import axios from 'axios';
import API_BASE_URL from '@/config/api';

interface User {
  apartmentCode: any;
  apartment: any;
  apartmentNumber?: string;
  flatNumber: String;
  phone: string;
}

interface TenantTicketListProps {
  user: User;
}

interface Ticket {
  id: string;
  title: string;
  description: string;
  category: string;
  status: 'unassigned' | 'in-progress' | 'resolved';
  createdAt: string;
  tenant: string;
  phoneNumber: string;
  apartment: string;
}

const TenantTicketList = ({ user }: TenantTicketListProps) => {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [statusFilter, setStatusFilter] = useState<string>('all');

  useEffect(() => {
    let intervalId: NodeJS.Timeout;
    const fetchTickets = async () => {
      try {
        const res = await axios.get(`${API_BASE_URL}/api/auth/all-complaint?apartmentCode=${user.apartmentCode}`);
        const data = res.data.complaints.map((complaint: any) => ({
          id: complaint._id,
          title: complaint.title,
          description: complaint.description,
          category: complaint.category,
          status: complaint.status,
          createdAt: new Date(complaint.createdAt).toLocaleDateString(),
          tenant: complaint.user?.username && complaint.user?.flatNumber
            ? `${complaint.user.username} (Flat ${complaint.user.flatNumber})`
            : 'Unknown',
          phoneNumber: complaint.user?.phoneNumber || 'N/A',
          apartment: complaint.apartment?.apartmentCode || 'Unknown',
        }));
        setTickets(data);
      } catch (error) {
        console.error("Error fetching tickets:", error);
      }
    };
    fetchTickets();
    intervalId = setInterval(fetchTickets, 5000);
    return () => clearInterval(intervalId);
  }, [user.apartmentCode, user.phone]);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'unassigned': return <AlertCircle className="h-4 w-4" />;
      case 'in-progress': return <Clock className="h-4 w-4" />;
      case 'resolved': return <CheckCircle className="h-4 w-4" />;
      default: return <Clock className="h-4 w-4" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'unassigned': return 'destructive';
      case 'in-progress': return 'default';
      case 'resolved': return 'secondary';
      default: return 'outline';
    }
  };

  const getStatusBorderColor = (status: string) => {
    switch (status) {
      case 'unassigned': return 'border-l-red-500';
      case 'in-progress': return 'border-l-blue-500';
      case 'resolved': return 'border-l-green-500';
      default: return 'border-l-gray-500';
    }
  };

  const getFilteredTickets = () => {
    switch (statusFilter) {
      case 'my-tickets':
        return tickets.filter(ticket => ticket.phoneNumber === user.phone);
      case 'completed':
        return tickets.filter(ticket => ticket.status === 'resolved');
      case 'in-progress':
        return tickets.filter(ticket => ticket.status !== 'resolved');
      default:
        return tickets;
    }
  };

  const filteredTickets = getFilteredTickets();

  const renderTicketCard = (ticket: Ticket) => (
    <Card key={ticket.id} className={`border-l-4 ${getStatusBorderColor(ticket.status)}`}>
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div>
            <CardTitle className="text-lg">{ticket.title}</CardTitle>
            <CardDescription className="mt-1">
              {ticket.tenant} • Apartment {ticket.apartment} • {ticket.createdAt} • Phone: {ticket.phoneNumber}
            </CardDescription>
          </div>
          <div className="flex space-x-2">
            <Badge variant={getStatusColor(ticket.status) as any}>
              {getStatusIcon(ticket.status)}
              <span className="ml-1 capitalize">{ticket.status.replace('-', ' ')}</span>
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
          </div>

        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="space-y-6">


      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center gap-4">
            <Filter className="h-4 w-4 text-gray-500" />
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Filter tickets" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Tickets ({tickets.length})</SelectItem>
                <SelectItem value="my-tickets">My Tickets ({tickets.filter(t => t.phoneNumber === user.phone).length})</SelectItem>
                <SelectItem value="completed">Completed ({tickets.filter(t => t.status === 'resolved').length})</SelectItem>
                <SelectItem value="in-progress">In Progress ({tickets.filter(t => t.status !== 'resolved').length})</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      <div className="space-y-4">
        {filteredTickets.length > 0 ? (
          filteredTickets.map(renderTicketCard)
        ) : (
          <Card>
            <CardContent className="text-center py-8">
              <CheckCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">No tickets found for the selected filter</p>
              <p className="text-sm text-gray-400 mt-1">
                Try selecting a different filter or submit a new maintenance request
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default TenantTicketList;