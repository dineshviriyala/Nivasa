import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from '@/components/ui/use-toast';
import axios from 'axios';
import API_BASE_URL from '@/config/api';

interface TechnicianFormProps {
    open: boolean;
    onClose: () => void;
    onSubmit: (technicianData: {
        id: string;
        name: string;
        email: string;
        phone: string;
        specialty: string;
        status: 'available' | 'busy' | 'offline';
    }) => void;
    apartmentCode: string;
}

const TechnicianForm = ({ open, onClose, onSubmit, apartmentCode }: TechnicianFormProps) => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        specialty: '',
        status: 'available' as 'available' | 'busy' | 'offline'
    });
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleChange = (field: string, value: string) => {
        setFormData(prev => ({
            ...prev,
            [field]: value
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        // Validation
        if (!formData.name || !formData.email || !formData.phone || !formData.specialty) {
            toast({
                title: 'Validation Error',
                description: 'Please fill in all required fields.',
                variant: 'destructive'
            });
            setIsSubmitting(false);
            return;
        }

        try {
            const response = await axios.post(
                `${API_BASE_URL}/api/add-technicians`, // Updated endpoint
                { ...formData, apartmentCode },
                {
                    headers: {
                        'Content-Type': 'application/json'
                    }
                }
            );

            const data = response.data;

            toast({
                title: 'Technician added successfully!',
                description: `Technician ${data.name} has been added to the system.`,
                variant: 'default'
            });

            onSubmit({
                id: data._id,
                name: data.name,
                email: data.email,
                phone: data.phone,
                specialty: data.specialty,
                status: data.status
            });

            setFormData({
                name: '',
                email: '',
                phone: '',
                specialty: '',
                status: 'available'
            });

            onClose();
        } catch (error: any) {
            console.error('Error adding technician:', error);
            toast({
                title: 'Error',
                description: error.response?.data?.error || error.message || 'Failed to add technician',
                variant: 'destructive'
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    const specialties = [
        'Plumbing',
        'Electrical',
        'HVAC',
        'General Maintenance',
        'Carpentry'
    ];

    const statuses = [
        { value: 'available', label: 'Available' },
        { value: 'busy', label: 'Busy' },
        { value: 'offline', label: 'Offline' }
    ];

    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                    <DialogTitle>Add New Technician</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="name">Name *</Label>
                        <Input
                            id="name"
                            value={formData.name}
                            onChange={(e) => handleChange('name', e.target.value)}
                            placeholder="Enter technician name"
                            required
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="email">Email *</Label>
                        <Input
                            id="email"
                            type="email"
                            value={formData.email}
                            onChange={(e) => handleChange('email', e.target.value)}
                            placeholder="Enter email address"
                            required
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="phone">Phone Number *</Label>
                        <Input
                            id="phone"
                            type="tel"
                            value={formData.phone}
                            onChange={(e) => handleChange('phone', e.target.value)}
                            placeholder="Enter 10-digit phone number"
                            required
                            pattern="\d{10}"
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="specialty">Specialty *</Label>
                        <Select
                            value={formData.specialty}
                            onValueChange={(value) => handleChange('specialty', value)}
                            required
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="Select specialty" />
                            </SelectTrigger>
                            <SelectContent>
                                {specialties.map((specialty) => (
                                    <SelectItem key={specialty} value={specialty}>
                                        {specialty}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="status">Status</Label>
                        <Select
                            value={formData.status}
                            onValueChange={(value: 'available' | 'busy' | 'offline') => handleChange('status', value)}
                        >
                            <SelectTrigger>
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                {statuses.map((status) => (
                                    <SelectItem key={status.value} value={status.value}>
                                        {status.label}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="flex justify-end space-x-2 pt-4">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={onClose}
                            disabled={isSubmitting}
                        >
                            Cancel
                        </Button>
                        <Button
                            type="submit"
                            disabled={isSubmitting}
                        >
                            {isSubmitting ? 'Adding...' : 'Add Technician'}
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
};

export default TechnicianForm;
