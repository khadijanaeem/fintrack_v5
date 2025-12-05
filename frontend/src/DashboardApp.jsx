import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Sidebar from "./components/Sidebar";
import Dashboard from "./pages/Dashboard";
import Transactions from "./pages/Transactions";
import Support from "./pages/Support";
import Budget from "./pages/Budget";

const DashboardApp = () => {
  return (
    
    <Router>
      <div style={{ display: "flex" }}>
        <Sidebar />

        <div
          style={{
            flex: 1,
            marginLeft: "256px",
            padding: "20px",
            minHeight: "100vh",
          }}
        >
          <Routes>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/transactions" element={<Transactions />} />
            <Route path="/budget" element={<Budget />} />
            <Route path="/support" element={<Support />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
};

export default DashboardApp;
