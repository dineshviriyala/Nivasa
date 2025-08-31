import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from '@/hooks/use-toast';
import axios from 'axios';
import API_BASE_URL from '@/config/api';

interface User {
  name: string;
  phone?: string;
  apartmentNumber?: string;
}

interface CreateTicketFormProps {
  user: User;
  onSuccess: () => void;
}

const CreateTicketForm = ({ user, onSuccess }: CreateTicketFormProps) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    priority: '',
    phoneNumber: user.phone || '',
    additionalInfo: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Debug log
    console.log('Submitting formData:', formData);

    if (!formData.title || !formData.description || !formData.category || !formData.priority) {
      toast({
        title: 'Missing required fields',
        description: 'Please fill out all required fields',
        variant: 'destructive'
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await axios.post(
        `${API_BASE_URL}/api/auth/new-complaint`,
        {
          title: formData.title,
          description: formData.description,
          category: formData.category,
          priority: formData.priority,
          phoneNumber: formData.phoneNumber,
          //additionalInfo: formData.additionalInfo
        },
        {
          headers: {
            'Content-Type': 'application/json',
          }
        }
      );

      const data = response.data;

      toast({
        title: 'Ticket created successfully!',
        description: `Your ticket #${data.complaint._id} has been submitted and will be reviewed shortly.`,
        variant: 'default'
      });

      setFormData({
        title: '',
        description: '',
        category: '',
        priority: '',
        phoneNumber: user.phone || '',
        additionalInfo: ''
      });

      onSuccess();
    } catch (error: any) {
      console.error('Error submitting ticket:', error);
      toast({
        title: 'Error',
        description: error.response?.data?.error || error.message || 'Failed to submit ticket',
        variant: 'destructive'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const categories = [
    'Plumbing',
    'Electrical',
    'HVAC',
    'Appliances',
    'Maintenance',
    'Security',
    'Other'
  ];

  const priorities = [
    { value: 'Low', label: 'Low - Can wait a few days' },
    { value: 'Medium', label: 'Medium - Should be addressed soon' },
    { value: 'High', label: 'High - Urgent attention needed' },
    { value: 'Emergency', label: 'Emergency - Immediate response required' }
  ];

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Report a Maintenance Issue</CardTitle>
          <CardDescription>
            Fill out the form below to submit a maintenance request for apartment {user.apartmentNumber}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="title">Issue Title *</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => handleChange('title', e.target.value)}
                placeholder="Brief description of the issue"
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="category">Category *</Label>
                <Select
                  value={formData.category}
                  onValueChange={(value) => handleChange('category', value)}
                  required
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((category) => (
                      <SelectItem key={category} value={category}>
                        {category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="priority">Priority *</Label>
                <Select
                  value={formData.priority}
                  onValueChange={(value) => handleChange('priority', value)}
                  required
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select priority" />
                  </SelectTrigger>
                  <SelectContent>
                    {priorities.map((priority) => (
                      <SelectItem key={priority.value} value={priority.value}>
                        {priority.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Detailed Description *</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => handleChange('description', e.target.value)}
                placeholder="Provide as much detail as possible about the issue, including when it started and exact location."
                rows={5}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="phoneNumber">Phone Number *</Label>
              <Input
                id="phoneNumber"
                value={formData.phoneNumber}
                placeholder="Enter your 10-digit phone number"
                required
                type="tel"
                pattern="[0-9]{10}"
                readOnly
                disabled
              />
            </div>

            {/* <div className="space-y-2">
              <Label htmlFor="additionalInfo">Additional Information</Label>
              <Textarea
                id="additionalInfo"
                value={formData.additionalInfo}
                onChange={(e) => handleChange('additionalInfo', e.target.value)}
                placeholder="Optional: preferred time for visit, entry instructions, etc."
                rows={3}
              />
            </div> */}

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h4 className="font-medium text-blue-900 mb-2">What happens next?</h4>
              <ul className="text-sm text-blue-800 space-y-1">
                <li>• Your request will be reviewed by our maintenance team</li>
                <li>• You'll receive a confirmation with a ticket number</li>
                <li>• We'll contact you to schedule the repair</li>
                <li>• You can track the status in your dashboard</li>
              </ul>
            </div>

            <div className="flex space-x-4">
              <Button
                type="submit"
                disabled={isSubmitting}
                className="flex-1"
              >
                {isSubmitting ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Submitting...
                  </>
                ) : 'Submit Ticket'}
              </Button>
              <Button type="button" variant="outline" onClick={onSuccess}>
                Cancel
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default CreateTicketForm;
