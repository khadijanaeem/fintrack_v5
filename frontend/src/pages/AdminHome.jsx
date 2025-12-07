
import React, { useState, useEffect } from "react";

const AdminHome = ({ admin, setPage, handleLogout }) => {
  const [totalUsers, setTotalUsers] = useState(0);
  const [users, setUsers] = useState([]);

  useEffect(() => {
    if (!admin) {
      setPage("home"); // redirect if not admin
      return;
    }

    // Fetch total users from backend
    const fetchUsers = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/users/admin/users");
        const data = await res.json();

        if (res.ok) {
          setTotalUsers(data.totalUsers);

          // Optionally, you can fetch full users list here too
          // Example: map users with id/email if your backend provides it
          const userListRes = await fetch("http://localhost:5000/api/users"); // optional endpoint to list users
          const userListData = await userListRes.json();
          if (userListRes.ok) setUsers(userListData.users || []); 
        } else {
          console.error("Failed to fetch users:", data.message);
        }
      } catch (err) {
        console.error("Error fetching users:", err);
      }
    };

    fetchUsers();
  }, [admin, setPage]);

  return (
    <div className="admin-container">
      <header className="admin-header">
        <h1>Admin Dashboard</h1>
        <button className="btn logout-btn" onClick={handleLogout}>
          Logout
        </button>
      </header>

      <section className="admin-intro">
        <p>
          Welcome to your admin dashboard! Here you can monitor users, track
          activity, and manage the FinTrack application.
        </p>
      </section>

      <section className="admin-stats">
        <h2>Total Users: {totalUsers}</h2>
      </section>

      <section className="admin-user-list">
        <h3>Users List:</h3>
        {users.length > 0 ? (
          <table className="user-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Email</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user, index) => (
                <tr key={index}>
                  <td>{index + 1}</td>
                  <td>{user.email}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p>No users to display</p>
        )}
      </section>

      <section className="admin-notes">
        <h3>Notes / Quick Actions</h3>
        <ul>
          <li>Monitor user activity regularly.</li>
          <li>Review app feedback and suggestions.</li>
          <li>Manage and update content for users.</li>
        </ul>
      </section>
    </div>
  );
};

export default AdminHome;
