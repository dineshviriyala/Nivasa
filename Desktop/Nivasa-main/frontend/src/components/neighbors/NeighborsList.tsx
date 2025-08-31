import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Phone, Mail, Users, Home, User } from 'lucide-react';
import axios from 'axios';
import API_BASE_URL from '@/config/api';

interface Neighbor {
    username: string;
    _id: string;
    name: string;
    phoneNumber: string;
    email: string;
    flatNumber: string;
    role: string;
}

interface NeighborsListProps {
    apartmentCode: string;
    currentUserFlatNumber?: string;
}

const getInitials = (name: string, username: string) => {
    if (name) {
        return name.split(' ').map(n => n[0]).join('').toUpperCase();
    }
    if (username) {
        return username[0].toUpperCase();
    }
    return '?';
};

const roleColors: Record<string, string> = {
    admin: 'bg-blue-100 text-blue-700',
    resident: 'bg-green-100 text-green-700',
    default: 'bg-gray-100 text-gray-700',
};

const NeighborsList = ({ apartmentCode, currentUserFlatNumber }: NeighborsListProps) => {
    const [neighbors, setNeighbors] = useState<Neighbor[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [maintenanceAmount, setMaintenanceAmount] = useState<number | null>(null);

    useEffect(() => {
        if (!apartmentCode) {
            setNeighbors([]);
            setIsLoading(false);
            return;
        }

        const fetchNeighbors = async () => {
            setIsLoading(true);
            setError(null);

            try {
                const response = await axios.get(`${API_BASE_URL}/api/auth/neighbors/${apartmentCode}`);
                setNeighbors(response.data.neighbors || []);
            } catch (err) {
                setError(err instanceof Error ? err.message : 'Failed to fetch neighbors');
                console.error('Error fetching neighbors:', err);
            } finally {
                setIsLoading(false);
            }
        };

        fetchNeighbors();
    }, [apartmentCode, currentUserFlatNumber]);

    useEffect(() => {
        const fetchMaintenanceAmount = async () => {
            if (!apartmentCode) return;
            try {
                const res = await axios.get(`${API_BASE_URL}/api/auth/maintenance/amount?apartmentCode=${apartmentCode}`);
                setMaintenanceAmount(res.data.maintenanceAmount);
            } catch (err) {
                setMaintenanceAmount(null);
            }
        };
        fetchMaintenanceAmount();
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

    if (error) {
        return (
            <div className="p-4 border border-red-200 bg-red-50 rounded-lg">
                <p className="text-red-600 font-semibold">Error loading neighbors</p>
                <p className="text-red-500 text-sm mt-1">{error}</p>
            </div>
        );
    }

    return (
        <div className="space-y-6 bg-gradient-to-br from-green-50 to-blue-50 p-4 rounded-xl">
            <div className="flex items-center space-x-2 mb-2">
                <Users className="h-6 w-6 text-green-600" />
                <h2 className="text-2xl font-bold">My Neighbors</h2>
            </div>

            {neighbors.length === 0 ? (
                <div className="p-4 border rounded-lg bg-gray-50">
                    <p>No neighbors found in this apartment.</p>
                </div>
            ) : (
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {neighbors.map(neighbor => {
                        const isCurrentUser = neighbor.flatNumber === currentUserFlatNumber;
                        const roleClass = roleColors[neighbor.role] || roleColors.default;
                        return (
                            <Card
                                key={neighbor._id}
                                className={`relative overflow-hidden rounded-2xl shadow-md border-2 transition-all duration-200 ${isCurrentUser ? 'border-green-500 ring-2 ring-green-200' : 'border-gray-200 hover:border-blue-400 hover:shadow-lg'}`}
                            >
                                {isCurrentUser && (
                                    <span className="absolute top-2 right-2 bg-green-500 text-white text-xs px-2 py-1 rounded-full z-10 shadow">You</span>
                                )}
                                <CardHeader className="flex flex-row items-center space-x-4 pb-2">
                                    <div className="flex-shrink-0 w-12 h-12 rounded-full bg-gradient-to-br from-blue-200 to-green-200 flex items-center justify-center text-xl font-bold text-white shadow">
                                        {getInitials(neighbor.name, neighbor.username)}
                                    </div>
                                    <div className="flex-1">
                                        <CardTitle className="text-lg font-semibold truncate">{neighbor.name || neighbor.username}</CardTitle>
                                        <div className="flex items-center space-x-2 mt-1">
                                            <span className={`px-2 py-0.5 rounded-full text-xs font-medium capitalize ${roleClass}`}>{neighbor.role}</span>
                                            <span className="flex items-center text-xs text-gray-500"><Home className="h-3 w-3 mr-1" />Flat {neighbor.flatNumber}</span>
                                        </div>
                                    </div>
                                </CardHeader>
                                <CardContent className="space-y-2 pt-0">
                                    <div className="flex items-center space-x-2 text-sm">
                                        <Phone className="h-4 w-4 text-green-600" />
                                        <span>{neighbor.phoneNumber}</span>
                                    </div>
                                    {neighbor.email && (
                                        <div className="flex items-center space-x-2 text-sm">
                                            <Mail className="h-4 w-4 text-blue-600" />
                                            <span className="truncate">{neighbor.email}</span>
                                        </div>
                                    )}
                                </CardContent>
                            </Card>
                        );
                    })}
                </div>
            )}
        </div>
    );
};

export default NeighborsList;