import React, { useState } from "react";


const AdminLogin = ({ setAdmin, setPage }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = (e) => {
    e.preventDefault();

    if (username === "admin@gmail.com" && password === "admin") {
      setAdmin(true);
      setPage("adminHome");
    } else {
      alert("Invalid admin credentials");
    }
  };

  return (
    <div className="page-container">
      <form className="form-card" onSubmit={handleLogin}>
        <h2 className="form-title">Admin Login</h2>

        <input
          type="text"
          placeholder="Admin Email"
          className="input-box"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />

        <input
          type="password"
          placeholder="Password"
          className="input-box"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <button className="btn" type="submit">
          Login
        </button>
      </form>
    </div>
  );
};

export default AdminLogin;