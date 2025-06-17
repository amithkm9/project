// Create this file as app/test-access/page.tsx for quick testing
'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useRouter } from 'next/navigation';

export default function TestAccessPage() {
  const router = useRouter();

  const createTestUser = () => {
    const testUser = {
      id: 'test-user-123',
      fullName: 'Test User',
      email: 'test@edusign.com',
      age: 25
    };

    localStorage.setItem('user', JSON.stringify(testUser));
    alert('Test user created! Redirecting to dashboard...');
    router.push('/home');
  };

  const createChildUser = () => {
    const childUser = {
      id: 'child-user-123',
      fullName: 'Child User',
      email: 'child@edusign.com',
      age: 8
    };

    localStorage.setItem('user', JSON.stringify(childUser));
    alert('Child user created! Redirecting to dashboard...');
    router.push('/home');
  };

  const createTeenUser = () => {
    const teenUser = {
      id: 'teen-user-123',
      fullName: 'Teen User',
      email: 'teen@edusign.com',
      age: 14
    };

    localStorage.setItem('user', JSON.stringify(teenUser));
    alert('Teen user created! Redirecting to dashboard...');
    router.push('/home');
  };

  const clearStorage = () => {
    localStorage.removeItem('user');
    alert('User data cleared!');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-teal-50 p-8">
      <div className="max-w-2xl mx-auto">
        <Card>
          <CardHeader>
            <CardTitle>🚀 Quick Access for Testing</CardTitle>
            <p className="text-gray-600">Bypass login and test different user types</p>
          </CardHeader>
          <CardContent className="space-y-4">
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Button 
                onClick={createChildUser}
                className="bg-pink-600 hover:bg-pink-700 text-white"
              >
                👶 Child User (Age 8)
                <br />
                <small>See ages 6-10 courses</small>
              </Button>
              
              <Button 
                onClick={createTeenUser}
                className="bg-purple-600 hover:bg-purple-700 text-white"
              >
                🧑‍🎓 Teen User (Age 14)
                <br />
                <small>See ages 11-15 courses</small>
              </Button>
              
              <Button 
                onClick={createTestUser}
                className="bg-blue-600 hover:bg-blue-700 text-white"
              >
                👨‍💼 Adult User (Age 25)
                <br />
                <small>See ages 16+ courses</small>
              </Button>
            </div>

            <div className="border-t pt-4">
              <h3 className="font-semibold mb-2">Database Credentials (if DB works):</h3>
              <div className="bg-gray-100 p-3 rounded text-sm">
                <strong>Email:</strong> demo@edusign.com<br />
                <strong>Password:</strong> demo123456
              </div>
            </div>

            <div className="flex gap-2">
              <Button 
                onClick={() => router.push('/login')}
                variant="outline"
              >
                Go to Login Page
              </Button>
              
              <Button 
                onClick={clearStorage}
                variant="destructive"
              >
                Clear User Data
              </Button>
            </div>

            <div className="text-sm text-gray-600">
              <strong>How to use:</strong>
              <ol className="list-decimal list-inside mt-2 space-y-1">
                <li>Click one of the user type buttons above</li>
                <li>You'll be automatically logged in and redirected</li>
                <li>Check how courses are filtered by age</li>
                <li>Test the lesson functionality</li>
              </ol>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}