import React, { useState } from "react";

const Signup = ({ setUser, setPage }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  /*const handleSignup = (e) => {
    e.preventDefault();
    if (email && password) {
      setUser({ email });
      setPage("home");
    } else {
      alert("Enter email and password");
    }
  };*/
  const handleSignup = async (e) => {
  e.preventDefault();
  if (!email || !password) return alert("Enter email and password");

  try {
    const res = await fetch("http://localhost:5000/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password, name: email.split("@")[0] }),
    });

    const data = await res.json();
    alert(data.message);
    if (res.ok) setPage("login"); // Redirect to login after signup
  } catch (err) {
    console.error(err);
    alert("Server error");
  }
};


  return (
    <form onSubmit={handleSignup}>
      <h2>Sign Up</h2>
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
      <button className="btn" type="submit">Sign Up</button>
      <p style={{ textAlign: "center", marginTop: "10px" }}>
        Already have an account? <span style={{ color: "blue", cursor: "pointer" }} onClick={() => setPage("login")}>Login</span>
      </p>
    </form>
  );
};

export default Signup;