import { useEffect, useState } from 'react';
import { authService } from '../api/authService';
import type { UserResponse } from '../api/authService'; // Fixed: Explicitly imported as a type

export const Dashboard = () => {
  const [user, setUser] = useState<UserResponse | null>(null);

  useEffect(() => {
    authService.getMe()
      .then(data => setUser(data))
      .catch(() => handleLogout());
  }, []);
  const handleLogout = () => {
    authService.logout()
      .finally(() => {
        window.location.href = '/login';
      });
  };

  if (!user) return <div className="p-8">Loading profile...</div>;

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <div className="max-w-4xl mx-auto bg-white p-6 rounded shadow">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-800">Cafe Dashboard</h1>
          <button onClick={handleLogout} className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600">
            Logout
          </button>
        </div>
        <div className="border-t pt-4">
          <p><strong>Welcome,</strong> {user.name}</p>
          <p><strong>Email:</strong> {user.email}</p>
          <p><strong>Role Level:</strong> {user.role}</p>
        </div>
      </div>
    </div>
  );
};

