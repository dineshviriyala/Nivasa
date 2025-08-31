import { User as UserIcon, Phone, Building, Home } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export interface User {
  username?: string;
  phone: string;
  role: string;
  name?: string;
  flatNumber?: string;
  apartmentCode?: string;
}

interface ProfilePageProps {
  user: User;
}

const ProfilePage = ({ user }: ProfilePageProps) => {
  console.log('ProfilePage received user data:', user);

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-2">
        <UserIcon className="h-6 w-6 text-blue-600" />
        <h2 className="text-2xl font-bold">My Profile</h2>
      </div>

      <Card className="max-w-md">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <div>
              <span className="text-lg font-semibold">{user.name || user.role}</span>
              <CardDescription className="capitalize">{user.role}</CardDescription>
            </div>
          </CardTitle>

        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
            <UserIcon className="h-5 w-5 text-blue-600" />
            <div>
              <p className="text-sm text-gray-600">User Name</p>
              <p className="font-medium">{user.username || 'Not set'}</p>
            </div>
          </div>
          <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
            <Phone className="h-5 w-5 text-green-600" />
            <div>
              <p className="text-sm text-gray-600">Phone Number</p>
              <p className="font-medium">{user.phone}</p>
            </div>
          </div>

          <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
            <Building className="h-5 w-5 text-blue-600" />
            <div>
              <p className="text-sm text-gray-600">Apartment Code</p>
              <p className="font-medium">{user.apartmentCode || 'N/A'}</p>
            </div>
          </div>

          {user.flatNumber && (
            <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
              <Home className="h-5 w-5 text-purple-600" />
              <div>
                <p className="text-sm text-gray-600">Flat Number</p>
                <p className="font-medium">{user.flatNumber}</p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default ProfilePage;