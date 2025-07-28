import React, { useEffect, useState } from "react";

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
    return <div>Loading user data...</div>;
  }

  return (
    <div>
      <h2>User List</h2>
      {users.length > 0 ? (
        <div style={{ display: "grid", gap: "1rem" }}>
          {users.map((user, index) => (
            <div 
              key={index}
              style={{
                padding: "1rem",
                border: "1px solid #eee",
                borderRadius: "4px"
              }}
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
  );
}

export default UserCountDashboard;