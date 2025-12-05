import React, { useState, useEffect } from "react";

const AdminHome = ({ admin, setPage, handleLogout }) => {
  // Simulated user data for demo
  const [users, setUsers] = useState([]);

  // Simulate fetching users when component mounts
  useEffect(() => {
    if (!admin) {
      setPage("home"); // Redirect if not admin
      return;
    }

    // Simulate fetching user data
    const fetchedUsers = [
      { id: 1, email: "user1@example.com" },
      { id: 2, email: "user2@example.com" },
      { id: 3, email: "user3@example.com" },
    ];
    setUsers(fetchedUsers);
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
        <h2>Total Users: {users.length}</h2>
      </section>

      <section className="admin-user-list">
        <h3>Users List:</h3>
        <table className="user-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Email</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id}>
                <td>{user.id}</td>
                <td>{user.email}</td>
              </tr>
            ))}
          </tbody>
        </table>
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

/*
import React, { useEffect, useState } from "react";

const AdminHome = ({ admin, setPage, handleLogout }) => {
  const [totalUsers, setTotalUsers] = useState(0);

  useEffect(() => {
    if (!admin) {
      setPage("home");
      return;
    }

    fetch("http://localhost:5000/admin/users")
      .then((res) => res.json())
      .then((data) => setTotalUsers(data.totalUsers))
      .catch((err) => console.error(err));
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
          Welcome, Admin! Here you can monitor all users and manage the
          application.
        </p>
      </section>

      <section className="admin-stats">
        <h2>Total Users: {totalUsers}</h2>
      </section>
    </div>
  );
};

export default AdminHome;*/