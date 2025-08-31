import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Phone, Mail, Users, Home, User, Edit, Trash2, Search, Plus } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
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

interface AdminNeighborsListProps {
    apartmentCode: string;
    currentUserFlatNumber?: string;
}

interface EditFormData {
    username: string;
    phoneNumber: string;
    flatNumber: string;
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

const AdminNeighborsList = ({ apartmentCode, currentUserFlatNumber }: AdminNeighborsListProps) => {
    const [neighbors, setNeighbors] = useState<Neighbor[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [editingNeighbor, setEditingNeighbor] = useState<Neighbor | null>(null);
    const [editFormData, setEditFormData] = useState<EditFormData>({
        username: '',
        phoneNumber: '',
        flatNumber: '',
    });
    const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);

    useEffect(() => {
        if (!apartmentCode) {
            setNeighbors([]);
            setIsLoading(false);
            return;
        }

        fetchNeighbors();
    }, [apartmentCode]);

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

    const handleEdit = (neighbor: Neighbor) => {
        setEditingNeighbor(neighbor);
        setEditFormData({
            username: neighbor.username,
            phoneNumber: neighbor.phoneNumber,
            flatNumber: neighbor.flatNumber,
        });
        setIsEditDialogOpen(true);
    };

    const handleEditSubmit = async () => {
        if (!editingNeighbor) return;

        try {
            // Check if flat number is already taken by another user
            if (editFormData.flatNumber !== editingNeighbor.flatNumber) {
                const existingFlat = neighbors.find(n =>
                    n.flatNumber === editFormData.flatNumber && n._id !== editingNeighbor._id
                );
                if (existingFlat) {
                    toast({
                        title: "Flat number already taken",
                        description: `Flat number ${editFormData.flatNumber} is already registered by another resident.`,
                        variant: "destructive",
                    });
                    return;
                }
            }

            await axios.put(`${API_BASE_URL}/api/auth/update-resident/${editingNeighbor._id}`, {
                username: editFormData.username,
                phoneNumber: editFormData.phoneNumber,
                flatNumber: editFormData.flatNumber,
            });

            toast({
                title: "Resident updated successfully",
                description: "The resident information has been updated.",
            });

            setIsEditDialogOpen(false);
            setEditingNeighbor(null);
            fetchNeighbors(); // Refresh the list
        } catch (error: any) {
            console.error('Update error:', error);
            toast({
                title: "Update failed",
                description: error.response?.data?.error || "Failed to update resident",
                variant: "destructive",
            });
        }
    };

    const handleDelete = async (neighbor: Neighbor) => {
        if (neighbor.role === 'admin') {
            toast({
                title: "Cannot delete admin",
                description: "Admin users cannot be deleted from the system.",
                variant: "destructive",
            });
            return;
        }

        setIsDeleting(true);
        try {
            console.log('Attempting to delete resident:', neighbor._id);
            const response = await axios.delete(`${API_BASE_URL}/api/auth/delete-resident/${neighbor._id}`);
            console.log('Delete response:', response.data);

            toast({
                title: "Resident deleted successfully",
                description: "The resident has been removed from the apartment.",
            });

            fetchNeighbors(); // Refresh the list
        } catch (error: any) {
            console.error('Delete error:', error);
            console.error('Delete error response:', error.response?.data);
            toast({
                title: "Delete failed",
                description: error.response?.data?.error || "Failed to delete resident",
                variant: "destructive",
            });
        } finally {
            setIsDeleting(false);
        }
    };

    const filteredNeighbors = neighbors.filter(neighbor =>
        neighbor.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (neighbor.name && neighbor.name.toLowerCase().includes(searchTerm.toLowerCase())) ||
        neighbor.flatNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
        neighbor.phoneNumber.includes(searchTerm)
    );

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
                <p className="text-red-600 font-semibold">Error loading residents</p>
                <p className="text-red-500 text-sm mt-1">{error}</p>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                    <Users className="h-6 w-6 text-blue-600" />
                    <h2 className="text-2xl font-bold">All Residents</h2>
                </div>
                <div className="text-sm text-gray-500">
                    {filteredNeighbors.length} of {neighbors.length} residents
                </div>
            </div>

            {/* Search */}
            <div className="flex items-center space-x-2">
                <Search className="h-4 w-4 text-gray-400" />
                <Input
                    placeholder="Search by name, username, flat number, or phone..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="flex-1"
                />
            </div>

            {/* Residents Grid */}
            {filteredNeighbors.length === 0 ? (
                <div className="p-8 border rounded-lg bg-gray-50 text-center">
                    <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-500">
                        {searchTerm ? 'No residents found matching your search' : 'No residents found in this apartment.'}
                    </p>
                </div>
            ) : (
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {filteredNeighbors.map(neighbor => {
                        const isCurrentUser = neighbor.flatNumber === currentUserFlatNumber;
                        const roleClass = roleColors[neighbor.role] || roleColors.default;
                        const canDelete = neighbor.role !== 'admin';

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
                                        <CardTitle className="text-lg font-semibold truncate">
                                            {neighbor.name || neighbor.username}
                                        </CardTitle>
                                        <div className="flex items-center space-x-2 mt-1">
                                            <span className={`px-2 py-0.5 rounded-full text-xs font-medium capitalize ${roleClass}`}>
                                                {neighbor.role}
                                            </span>
                                            <span className="flex items-center text-xs text-gray-500">
                                                <Home className="h-3 w-3 mr-1" />
                                                Flat {neighbor.flatNumber}
                                            </span>
                                        </div>
                                    </div>
                                </CardHeader>

                                <CardContent className="space-y-3 pt-0">
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

                                    {/* Action Buttons */}
                                    <div className="flex space-x-2 pt-2">
                                        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
                                            <DialogTrigger asChild>
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    onClick={() => handleEdit(neighbor)}
                                                    className="flex-1"
                                                >
                                                    <Edit className="h-3 w-3 mr-1" />
                                                    Edit
                                                </Button>
                                            </DialogTrigger>
                                        </Dialog>

                                        {canDelete && (
                                            <AlertDialog>
                                                <AlertDialogTrigger asChild>
                                                    <Button
                                                        variant="outline"
                                                        size="sm"
                                                        className="flex-1 text-red-600 hover:text-red-700 hover:bg-red-50"
                                                    >
                                                        <Trash2 className="h-3 w-3 mr-1" />
                                                        Delete
                                                    </Button>
                                                </AlertDialogTrigger>
                                                <AlertDialogContent>
                                                    <AlertDialogHeader>
                                                        <AlertDialogTitle>Delete Resident</AlertDialogTitle>
                                                        <AlertDialogDescription>
                                                            Are you sure you want to delete {neighbor.name || neighbor.username}?
                                                            This action cannot be undone and will remove them from the apartment.
                                                        </AlertDialogDescription>
                                                    </AlertDialogHeader>
                                                    <AlertDialogFooter>
                                                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                                                        <AlertDialogAction
                                                            onClick={() => handleDelete(neighbor)}
                                                            className="bg-red-600 hover:bg-red-700"
                                                            disabled={isDeleting}
                                                        >
                                                            {isDeleting ? 'Deleting...' : 'Delete'}
                                                        </AlertDialogAction>
                                                    </AlertDialogFooter>
                                                </AlertDialogContent>
                                            </AlertDialog>
                                        )}
                                    </div>
                                </CardContent>
                            </Card>
                        );
                    })}
                </div>
            )}

            {/* Edit Dialog */}
            <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
                <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                        <DialogTitle>Edit Resident</DialogTitle>
                        <DialogDescription>
                            Update the resident's information. Click save when you're done.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="username" className="text-right">
                                Username
                            </Label>
                            <Input
                                id="username"
                                value={editFormData.username}
                                onChange={(e) => setEditFormData(prev => ({ ...prev, username: e.target.value }))}
                                className="col-span-3"
                            />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="phone" className="text-right">
                                Phone
                            </Label>
                            <Input
                                id="phone"
                                value={editFormData.phoneNumber}
                                onChange={(e) => setEditFormData(prev => ({ ...prev, phoneNumber: e.target.value }))}
                                className="col-span-3"
                            />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="flatNumber" className="text-right">
                                Flat Number
                            </Label>
                            <Input
                                id="flatNumber"
                                value={editFormData.flatNumber}
                                onChange={(e) => setEditFormData(prev => ({ ...prev, flatNumber: e.target.value }))}
                                className="col-span-3"
                            />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
                            Cancel
                        </Button>
                        <Button onClick={handleEditSubmit}>
                            Save Changes
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default AdminNeighborsList; 