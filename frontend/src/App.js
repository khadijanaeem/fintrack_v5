// // import './App.css';
// // import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
// // import Sidebar from "./components/Sidebar";
// // import Dashboard from "./pages/Dashboard";
// // import Transactions from "./pages/Transactions";
// // import Support from "./pages/Support";
// // import Budget from './pages/Budget';

// // function App() {
// //   return (
// //     <Router>
// //       <div style={{ display: "flex" }}>
// //         {/* Sidebar */}
// //         <Sidebar />

// //         {/* Main Content - Add left margin equal to sidebar width */}
// //         <div style={{ 
// //           flex: 1, 
// //           marginLeft: "256px", // matches w-64 (64 * 4px = 256px)
// //           padding: "20px",
// //           minHeight: "100vh"
// //         }}>
// //           <Routes>
// //             <Route path="/dashboard" element={<Dashboard />} />
// //             <Route path="/transactions" element={<Transactions />} />
// //             <Route path="/budget" element={<Budget />} />
// //             <Route path="/support" element={<Support />} />
// //           </Routes>
// //         </div>
// //       </div>
// //     </Router>
// //   );
// // }

// // export default App;


// import React, { useState, createContext } from "react";
// import './styles.css';
// import Home from "./pages/Home";
// import Login from "./pages/Login";
// import Signup from "./pages/Signup";
// import AdminLogin from "./pages/AdminLogin";
// import AdminHome from "./pages/AdminHome";

// export const ThemeContext = createContext();

// const App = () => {
//   const [darkMode, setDarkMode] = useState(false);
//   const [user, setUser] = useState(null);
//   const [admin, setAdmin] = useState(false);
//   const [page, setPage] = useState("home");

//   const handleLogout = () => {
//     setUser(null);
//     setAdmin(false);
//     setPage("home");
//   };
  

//   return (
//     <ThemeContext.Provider value={{ darkMode, setDarkMode }}>
//       <div className={darkMode ? "dark-mode" : ""}>
//         {page === "home" && (
//           <Home setPage={setPage} user={user} handleLogout={handleLogout} />
//         )}
//         {page === "login" && <Login setUser={setUser} setPage={setPage}  />}
//         {page === "signup" && <Signup setUser={setUser} setPage={setPage} />}
//         {page === "adminLogin" && (
//           <AdminLogin setAdmin={setAdmin} setPage={setPage} />
//         )}
//         {page === "adminHome" && (
//           <AdminHome admin={admin} setPage={setPage} handleLogout={handleLogout} />
//         )}
//       </div>
//     </ThemeContext.Provider>
//   );
// };

// export default App;


import React, { useState, createContext } from "react";
import './styles.css';
import Home from "./pages/Home";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import AdminLogin from "./pages/AdminLogin";
import AdminHome from "./pages/AdminHome";
import DashboardApp from "./DashboardApp";

export const ThemeContext = createContext();

const App = () => {
  const [darkMode, setDarkMode] = useState(false);
  const [user, setUser] = useState(null);
  const [admin, setAdmin] = useState(false);
  const [page, setPage] = useState("home");

  const handleLogout = () => {
    setUser(null);
    setAdmin(false);
    setPage("home");
  };
if (user) {
    return <DashboardApp handleLogout={handleLogout} />;
  }

  return (
    <ThemeContext.Provider value={{ darkMode, setDarkMode }}>
      <div className={darkMode ? "dark-mode" : ""}>
        {page === "home" && (
          <Home setPage={setPage} user={user} handleLogout={handleLogout} />
        )}
        {page === "login" && (
          <Login setUser={setUser} setPage={setPage} />
        )}
        {page === "signup" && (
          <Signup setUser={setUser} setPage={setPage} />
        )}
        {page === "adminLogin" && (
          <AdminLogin setAdmin={setAdmin} setPage={setPage} />
        )}
        {page === "adminHome" && (
          <AdminHome
            admin={admin}
            setPage={setPage}
            handleLogout={handleLogout}
          />
        )}
      </div>
    </ThemeContext.Provider>
  );
};

export default App;
