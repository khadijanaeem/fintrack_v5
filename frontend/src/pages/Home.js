import React, { useContext } from "react";
import { ThemeContext } from "../App";

const Home = ({ setPage, user, handleLogout }) => {
  const { darkMode, setDarkMode } = useContext(ThemeContext);

  return (
    <div className="home-container">
      {/* HEADER */}
      <header className="home-header">
        <h2 className="logo">FinTrack</h2>

        <div className="nav-buttons">
          {/* Dark/Light toggle */}
          <button className="btn" onClick={() => setDarkMode(!darkMode)}>
            {darkMode ? "Light Mode" : "Dark Mode"}
          </button>

          {/* User buttons */}
          {user ? (
            <button className="btn" onClick={handleLogout}>
              Logout
            </button>
          ) : (
            <>
              <button className="btn" onClick={() => setPage("login")}>
                Login
              </button>
              <button className="btn" onClick={() => setPage("signup")}>
                Sign Up
              </button>
            </>
          )}

          {/* ⭐ ADMIN LOGIN BUTTON (Missing Before) */}
          <button className="btn admin-btn" onClick={() => setPage("adminLogin")}>
            Admin Login
          </button>
        </div>
      </header>

      {/* INTRO SECTION */}
      <section className="home-intro">
        <h1>Welcome to FinTrack</h1>
        <p>
          FinTrack helps you track your income and expenses easily. 
          Manage your budgets, analyze your spending, and stay in control 
          of your financial journey.
        </p>
      </section>

      {/* FOOTER */}
      <footer className="home-footer">
        <p>
          Contact: <strong>+92 300 1234567</strong> |{" "}
          <a href="https://maps.google.com" target="_blank" rel="noreferrer">
            View Location on Map
          </a>
        </p>
      </footer>
    </div>
  );
};

export default Home;