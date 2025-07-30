import React, { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import TopBar from "../components/TopBar";

interface User {
  email: string;
  userType: string;
  location: string;
  specialty: string;
}

function UserCountDashboard() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("http://localhost:3000/api/admin/allUsers")
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to fetch users");
        }
        return response.json();
      })
      .then((data) => {
        setUsers(data.users || []);
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="flex h-screen">
        <Sidebar />
        <div className="flex-1 overflow-auto ml-64">
          <TopBar />
          <div className="flex flex-col min-h-[calc(100vh-80px)] p-4">
            <div className="p-6 bg-gray-50 min-h-full">
              <div>Loading user data...</div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen">
      <Sidebar />
      <div className="flex-1 overflow-auto ml-64">
        <TopBar />
        <div className="flex flex-col min-h-[calc(100vh-80px)] p-4">
          <div className="p-6 bg-gray-50 min-h-full">
            <h2 className="text-3xl font-bold text-gray-800 mb-8">User List</h2>
            {users.length > 0 ? (
              <div className="grid gap-4">
                {users.map((user, index) => (
                  <div 
                    key={index}
                    className="p-4 border border-gray-200 rounded-lg bg-white"
                  >
                    <p><strong>Email:</strong> {user.email}</p>
                    <p><strong>Type:</strong> {user.userType}</p>
                    <p><strong>Location:</strong> {user.location}</p>
                    <p><strong>Specialty:</strong> {user.specialty}</p>
                  </div>
                ))}
              </div>
            ) : (
              <p>No users found</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default UserCountDashboard;