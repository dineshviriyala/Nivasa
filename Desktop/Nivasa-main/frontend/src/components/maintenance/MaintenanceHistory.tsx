import { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Calendar, DollarSign, Plus, CheckCircle, XCircle, Clock } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import axios from 'axios';
import API_BASE_URL from '@/config/api';
import QRCode from 'qrcode';

interface MaintenanceRecord {
  id: string;
  description: string;
  amount: number;
  status: 'pending' | 'approved' | 'rejected';
  submittedBy: string;
  flatNumber: string;
  submittedDate: string;
  approvedBy?: string;
  approvedDate?: string;
  months?: string[];
}

interface MaintenanceHistoryProps {
  apartmentCode: string;
  isAdmin: boolean;
  userFlatNumber?: string;
}

// Define props for PaymentRequestForm
interface PaymentRequestFormProps {
  maintenanceAmount: number;
  userFlatNumber?: string;
  monthsList: string[];
  bankDetails: any;
  setShowSubmitDialog: (open: boolean) => void;
  paymentRequests: any[];
  setPaymentRequests: (requests: any[]) => void;
  toast: any;
  API_BASE_URL: string;
  apartmentCode: string;
}

const MaintenanceHistory = ({ apartmentCode, isAdmin, userFlatNumber }: MaintenanceHistoryProps) => {
  const [isLoading, setIsLoading] = useState(true);
  const [showSubmitDialog, setShowSubmitDialog] = useState(false);
  const [newRequest, setNewRequest] = useState({
    description: '',
    amount: ''
  });
  const [maintenanceAmount, setMaintenanceAmount] = useState<number>(0);
  const [paymentRequests, setPaymentRequests] = useState<any[]>([]);
  const [selectedMonths, setSelectedMonths] = useState<string[]>([]);
  const [screenshotFile, setScreenshotFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const monthsList = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];
  const [editAmount, setEditAmount] = useState<string>('');
  const [upiTransactionId, setUpiTransactionId] = useState('');
  const [bankDetails, setBankDetails] = useState<any>(null);
  const [upiQrUrl, setUpiQrUrl] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch maintenance amount
        const amountRes = await axios.get(`${API_BASE_URL}/api/auth/maintenance/amount?apartmentCode=${apartmentCode}`);
        setMaintenanceAmount(amountRes.data.maintenanceAmount);
        // Fetch payment requests
        const paymentsRes = await axios.get(`${API_BASE_URL}/api/auth/maintenance/payments?apartmentCode=${apartmentCode}`);
        setPaymentRequests(paymentsRes.data.payments);
        // Fetch bank details
        const bankRes = await axios.get(`${API_BASE_URL}/api/auth/maintenance/bank-details?apartmentCode=${apartmentCode}`);
        setBankDetails(bankRes.data.bankDetails);
        setIsLoading(false);
      } catch (err: any) {
        console.error('Error fetching maintenance data:', err);
        setIsLoading(false);
        const errorMessage = err.response?.data?.error || err.message || 'Failed to fetch maintenance data';
        toast({ 
          title: 'Error', 
          description: errorMessage, 
          variant: 'destructive' 
        });
      }
    };
    fetchData();
  }, [apartmentCode]);

  const handleSubmitRequest = () => {
    if (!newRequest.description || !newRequest.amount) {
      toast({
        title: 'Error',
        description: 'Please fill in all fields',
        variant: 'destructive'
      });
      return;
    }

    const newRecord: MaintenanceRecord = {
      id: Date.now().toString(),
      description: newRequest.description,
      amount: parseFloat(newRequest.amount),
      status: 'pending',
      submittedBy: 'User',
      flatNumber: userFlatNumber || '',
      submittedDate: new Date().toISOString().split('T')[0]
    };

    setPaymentRequests(prev => [newRecord, ...prev]);
    setNewRequest({ description: '', amount: '' });
    setShowSubmitDialog(false);

    toast({
      title: 'Success',
      description: 'Maintenance payment request submitted'
    });
  };

  const handleStatusChange = async (paymentId: string, newStatus: 'approved' | 'rejected') => {
    try {
      await axios.patch(`${API_BASE_URL}/api/auth/maintenance/payment/${paymentId}/status`, {
        status: newStatus,
      });
      toast({
        title: 'Success',
        description: `Request ${newStatus} successfully`
      });
      // Refetch payment requests to update the UI
      const paymentsRes = await axios.get(`${API_BASE_URL}/api/auth/maintenance/payments?apartmentCode=${apartmentCode}`);
      setPaymentRequests(paymentsRes.data.payments);
    } catch (err: any) {
      toast({
        title: 'Error',
        description: `Failed to update status: ${err.response?.data?.error || err.message}`,
        variant: 'destructive'
      });
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'approved':
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'rejected':
        return <XCircle className="h-4 w-4 text-red-600" />;
      default:
        return <Clock className="h-4 w-4 text-yellow-600" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved':
        return 'bg-green-100 text-green-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-yellow-100 text-yellow-800';
    }
  };

  const handlePaymentSubmit = async () => {
    if (!maintenanceAmount || !userFlatNumber || selectedMonths.length === 0 || !upiTransactionId) {
      toast({ title: 'Error', description: 'Please fill all fields and enter UPI Transaction ID', variant: 'destructive' });
      return;
    }
    try {
      await axios.post(`${API_BASE_URL}/api/auth/maintenance/payment`, {
        apartmentCode,
        flatNumber: userFlatNumber,
        transactionId: upiTransactionId,
        months: selectedMonths
      });
      toast({ title: 'Success', description: 'Payment request submitted' });
      setSelectedMonths([]);
      setUpiTransactionId('');
      // Refresh payment requests
      const paymentsRes = await axios.get(`${API_BASE_URL}/api/auth/maintenance/payments?apartmentCode=${apartmentCode}`);
      setPaymentRequests(paymentsRes.data.payments);
    } catch (err) {
      toast({ title: 'Error', description: 'Failed to submit payment request', variant: 'destructive' });
    }
  };

  const handleAmountUpdate = async () => {
    if (!editAmount) return;
    try {
      const res = await axios.post(`${API_BASE_URL}/api/auth/maintenance/amount`, {
        apartmentCode,
        amount: parseFloat(editAmount)
      });
      setMaintenanceAmount(res.data.maintenanceAmount);
      setEditAmount('');
      toast({ title: 'Success', description: 'Maintenance amount updated' });
    } catch (err) {
      toast({ title: 'Error', description: 'Failed to update amount', variant: 'destructive' });
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="animate-pulse bg-gray-200 h-32 rounded-lg"></div>
        <div className="animate-pulse bg-gray-200 h-32 rounded-lg"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <DollarSign className="h-6 w-6 text-green-600" />
          <h2 className="text-2xl font-bold">Maintenance Payments</h2>
        </div>

        {!isAdmin && (
          <Dialog open={showSubmitDialog} onOpenChange={setShowSubmitDialog}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Submit Payment Request
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Submit Maintenance Payment Request</DialogTitle>
                <DialogDescription>
                  Submit a request for maintenance expenses you've paid for.
                </DialogDescription>
              </DialogHeader>
              <PaymentRequestForm 
                maintenanceAmount={maintenanceAmount}
                userFlatNumber={userFlatNumber}
                monthsList={monthsList}
                bankDetails={bankDetails}
                setShowSubmitDialog={setShowSubmitDialog}
                paymentRequests={paymentRequests}
                setPaymentRequests={setPaymentRequests}
                toast={toast}
                API_BASE_URL={API_BASE_URL}
                apartmentCode={apartmentCode}
              />
            </DialogContent>
          </Dialog>
        )}
      </div>

      <div className="space-y-4">
        {paymentRequests.length === 0 ? (
          <Card>
            <CardContent className="p-6 text-center">
              <p className="text-gray-500">No maintenance requests found.</p>
            </CardContent>
          </Card>
        ) : (
          paymentRequests.map((payment) => (
            <Card key={payment._id}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center space-x-2">
                    {getStatusIcon(payment.status)}
                    <span>₹{payment.amount.toFixed(2)}</span>
                  </CardTitle>
                  <Badge className={getStatusColor(payment.status)}>
                    {payment.status.charAt(0).toUpperCase() + payment.status.slice(1)}
                  </Badge>
                </div>
                <CardDescription className="flex items-center space-x-4">
                  <span className="flex items-center space-x-1">
                    <Calendar className="h-4 w-4" />
                    <span>{new Date(payment.createdAt).toLocaleDateString()}</span>
                  </span>
                  {isAdmin && (
                    <span>Flat {payment.flatNumber}</span>
                  )}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700 mb-4">Transaction ID: {payment.transactionId}</p>
                {isAdmin && payment.status === 'pending' && (
                  <div className="flex space-x-2 mt-4">
                    <Button
                      size="sm"
                      onClick={() => handleStatusChange(payment._id, 'approved')}
                      className="bg-green-600 hover:bg-green-700"
                    >
                      <CheckCircle className="h-4 w-4 mr-1" />
                      Approve
                    </Button>
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => handleStatusChange(payment._id, 'rejected')}
                    >
                      <XCircle className="h-4 w-4 mr-1" />
                      Reject
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* Bank Details Display for Residents */}
      {!isAdmin && bankDetails && (
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Apartment Bank Details</CardTitle>
            <CardDescription>
              Use these details for maintenance payments
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-3">
                <div>
                  <Label className="text-sm font-medium text-gray-600">Account Holder</Label>
                  <p className="text-gray-900 font-medium">{bankDetails.accountHolder}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-600">Account Number</Label>
                  <p className="text-gray-900 font-medium">{bankDetails.accountNumber}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-600">IFSC Code</Label>
                  <p className="text-gray-900 font-medium">{bankDetails.ifscCode}</p>
                </div>
              </div>
              <div className="space-y-3">
                <div>
                  <Label className="text-sm font-medium text-gray-600">Bank Name</Label>
                  <p className="text-gray-900 font-medium">{bankDetails.bankName}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-600">Branch</Label>
                  <p className="text-gray-900 font-medium">{bankDetails.branch}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-600">UPI ID</Label>
                  <p className="text-gray-900 font-medium">{bankDetails.upiId}</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {isAdmin && (
        <div className="space-y-6 mb-6">
          {/* Bank Details Management */}
          <Card className="mb-4">
            <CardHeader>
              <CardTitle>Apartment Bank Details</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={async (e) => {
                e.preventDefault();
                setIsLoading(true);
                try {
                  const requestData = {
                    apartmentCode,
                    accountHolder: bankDetails?.accountHolder || '',
                    accountNumber: bankDetails?.accountNumber || '',
                    ifscCode: bankDetails?.ifscCode || '',
                    bankName: bankDetails?.bankName || '',
                    branch: bankDetails?.branch || '',
                    upiId: bankDetails?.upiId || ''
                  };
                  
                  console.log('=== FRONTEND: Sending bank details ===');
                  console.log('Apartment code:', apartmentCode);
                  console.log('Request data:', requestData);
                  
                  const response = await axios.post(`${API_BASE_URL}/api/auth/maintenance/bank-details`, requestData);
                  
                  console.log('Response received:', response.data);
                  
                  toast({ title: 'Success', description: 'Bank details updated' });
                  // Refresh bank details
                  const bankRes = await axios.get(`${API_BASE_URL}/api/auth/maintenance/bank-details?apartmentCode=${apartmentCode}`);
                  setBankDetails(bankRes.data.bankDetails);
                  console.log('Refreshed bank details:', bankRes.data.bankDetails);
                } catch (err: any) {
                  console.error('Error updating bank details:', err);
                  const errorMessage = err.response?.data?.error || err.message || 'Failed to update bank details';
                  toast({ 
                    title: 'Error', 
                    description: errorMessage, 
                    variant: 'destructive' 
                  });
                }
                setIsLoading(false);
              }} className="space-y-4">
                <div className="flex items-center space-x-4">
                  <Label className="w-32 font-medium">Account Holder:</Label>
                  <Input name="accountHolder" value={bankDetails?.accountHolder || ''} onChange={e => setBankDetails({ ...bankDetails, accountHolder: e.target.value })} required className="flex-1" />
                </div>
                <div className="flex items-center space-x-4">
                  <Label className="w-32 font-medium">Account Number:</Label>
                  <Input name="accountNumber" value={bankDetails?.accountNumber || ''} onChange={e => setBankDetails({ ...bankDetails, accountNumber: e.target.value })} required className="flex-1" />
                </div>
                <div className="flex items-center space-x-4">
                  <Label className="w-32 font-medium">IFSC Code:</Label>
                  <Input name="ifscCode" value={bankDetails?.ifscCode || ''} onChange={e => setBankDetails({ ...bankDetails, ifscCode: e.target.value })} required className="flex-1" />
                </div>
                <div className="flex items-center space-x-4">
                  <Label className="w-32 font-medium">Bank Name:</Label>
                  <Input name="bankName" value={bankDetails?.bankName || ''} onChange={e => setBankDetails({ ...bankDetails, bankName: e.target.value })} required className="flex-1" />
                </div>
                <div className="flex items-center space-x-4">
                  <Label className="w-32 font-medium">Branch:</Label>
                  <Input name="branch" value={bankDetails?.branch || ''} onChange={e => setBankDetails({ ...bankDetails, branch: e.target.value })} required className="flex-1" />
                </div>
                <div className="flex items-center space-x-4">
                  <Label className="w-32 font-medium">UPI ID:</Label>
                  <Input name="upiId" value={bankDetails?.upiId || ''} onChange={e => setBankDetails({ ...bankDetails, upiId: e.target.value })} required className="flex-1" />
                </div>
                <Button type="submit" disabled={isLoading}>{isLoading ? 'Saving...' : 'Save Bank Details'}</Button>
              </form>
            </CardContent>
          </Card>
          {/* Maintenance Amount Management */}
          <Card className="mb-4">
            <CardHeader>
              <CardTitle>Set Maintenance Amount</CardTitle>
            </CardHeader>
            <CardContent className="flex items-center gap-4">
              <Input type="number" placeholder="Enter amount" value={editAmount} onChange={e => setEditAmount(e.target.value)} className="w-32" />
              <Button onClick={handleAmountUpdate}>Update</Button>
              <span className="ml-4 text-gray-600">Current: <b>₹{maintenanceAmount}</b></span>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};

// PaymentRequestForm: Handles the payment request dialog, including months selection, total calculation, and UPI QR/link
function PaymentRequestForm({
  maintenanceAmount,
  userFlatNumber,
  monthsList,
  bankDetails,
  setShowSubmitDialog,
  paymentRequests,
  setPaymentRequests,
  toast,
  API_BASE_URL,
  apartmentCode
}: PaymentRequestFormProps) {
  const [selectedMonths, setSelectedMonths] = useState<string[]>([]);
  const [upiTransactionId, setUpiTransactionId] = useState('');
  const [upiQrUrl, setUpiQrUrl] = useState<string | null>(null);

  const totalAmount = maintenanceAmount * (selectedMonths.length || 1);

  useEffect(() => {
    if (!bankDetails?.upiId || !maintenanceAmount) {
      setUpiQrUrl(null);
      return;
    }
    const upiId = bankDetails.upiId;
    const name = bankDetails.accountHolder || 'Apartment';
    const upiLink = `upi://pay?pa=${encodeURIComponent(upiId)}&pn=${encodeURIComponent(name)}&am=${totalAmount}&cu=INR`;
    QRCode.toDataURL(upiLink, { width: 160, margin: 2 }, (err: any, url: string) => {
      if (!err) setUpiQrUrl(url);
    });
  }, [bankDetails, maintenanceAmount, selectedMonths, totalAmount]);

  const handlePaymentSubmit = async () => {
    if (!maintenanceAmount || !userFlatNumber || selectedMonths.length === 0 || !upiTransactionId) {
      toast({ title: 'Error', description: 'Please fill all fields and enter UPI Transaction ID', variant: 'destructive' });
      return;
    }
    try {
      await axios.post(`${API_BASE_URL}/api/auth/maintenance/payment`, {
        apartmentCode,
        flatNumber: userFlatNumber,
        transactionId: upiTransactionId,
        months: selectedMonths
      });
      toast({ title: 'Success', description: 'Payment request submitted' });
      setSelectedMonths([]);
      setUpiTransactionId('');
      setShowSubmitDialog(false);
      // Refresh payment requests
      const paymentsRes = await axios.get(`${API_BASE_URL}/api/auth/maintenance/payments?apartmentCode=${apartmentCode}`);
      setPaymentRequests(paymentsRes.data.payments);
    } catch (err) {
      toast({ title: 'Error', description: 'Failed to submit payment request', variant: 'destructive' });
    }
  };

  return (
    <div className="space-y-4">
      <div>
        <Label>Flat Number</Label>
        <Input value={userFlatNumber} readOnly />
      </div>
      <div>
        <Label>Months</Label>
        <select multiple className="w-full border rounded p-2" value={selectedMonths} onChange={e => setSelectedMonths(Array.from(e.target.selectedOptions, o => o.value))}>
          {monthsList.map(month => <option key={month} value={month}>{month}</option>)}
        </select>
      </div>
      <div>
        <Label>Total Amount (₹)</Label>
        <Input value={totalAmount} readOnly />
      </div>
      {bankDetails?.upiId && (
        <div className="flex flex-col items-center gap-2">
          <a
            href={`upi://pay?pa=${encodeURIComponent(bankDetails.upiId)}&pn=${encodeURIComponent(bankDetails.accountHolder || 'Apartment')}&am=${totalAmount}&cu=INR`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 underline mb-2"
          >
            Pay via UPI App
          </a>
          {upiQrUrl && (
            <img src={upiQrUrl} alt="UPI QR Code" width={160} height={160} style={{ background: '#fff', padding: 8, borderRadius: 8 }} />
          )}
          <div className="text-xs text-gray-500 mt-2">
            UPI ID: <span className="font-mono">{bankDetails.upiId}</span>
          </div>
        </div>
      )}
      <div>
        <Label>UPI Transaction ID</Label>
        <Input value={upiTransactionId} onChange={e => setUpiTransactionId(e.target.value)} placeholder="Enter UPI Transaction ID" />
      </div>
      <div className="flex space-x-2">
        <Button onClick={handlePaymentSubmit} className="flex-1">Submit Payment</Button>
        <Button variant="outline" onClick={() => setShowSubmitDialog(false)} className="flex-1">Cancel</Button>
      </div>
    </div>
  );
}

export default MaintenanceHistory;