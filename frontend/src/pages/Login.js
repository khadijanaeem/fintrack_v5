import React, { useState } from "react";

const Login = ({ setUser, setPage }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  /*const handleLogin = (e) => {
    e.preventDefault();
    // Simple fake login for demo
    if (email && password) {
      setUser({ email });
      setPage("home");
    } else {
      alert("Enter email and password");
    }
  };*/
  
  
  const HARDCODED_EMAIL = "test@gmail.com";
  const HARDCODED_PASSWORD = "123456";

  const handleLogin = async (e) => {
  e.preventDefault();
  if (!email || !password) return alert("Enter email and password");

   if (email === HARDCODED_EMAIL && password === HARDCODED_PASSWORD) {
      setUser({ email, role: "user" });
      setPage("home");
      return;
    }
  try {
    const res = await fetch("http://localhost:5000/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    const data = await res.json();

    if (data.message === "Login successful") {
      setUser({ email, role: data.role });
      setPage("home");
    } else {
      alert(data.message);
    }
  } catch (err) {
    console.error(err);
    alert("Server error");
  }
};


  return (
    <form onSubmit={handleLogin}>
      <h2>Login</h2>
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <button className="btn" type="submit">Login</button>
      <p style={{ textAlign: "center", marginTop: "10px" }}>
        Don't have an account? <span style={{ color: "blue", cursor: "pointer" }} onClick={() => setPage("signup")}>Sign Up</span>
      </p>
    </form>
  );
};

export default Login;