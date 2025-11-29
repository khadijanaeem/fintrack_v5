



// // import logo from './logo.svg';
// // import './App.css';

// // function App() {
// //   return (
// //     <div className="App">
// //       <header className="App-header">
// //         <img src={logo} className="App-logo" alt="logo" />
// //         <p>
// //           Edit <code>src/App.js</code> and save to reload.
// //         </p>
// //         <a
// //           className="App-link"
// //           href="https://reactjs.org"
// //           target="_blank"
// //           rel="noopener noreferrer"
// //         >
// //           Learn React
// //         </a>
// //       </header>
// //     </div>
// //   );
// // }

// // export default App;



// import React from 'react';
// import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
// import Transactions from './pages/Transactions';
// import Dashboard from './pages/Dashboard';
// import './App.css';

// function App() {
//   return (
//     <Router>
//       <div className="App">
//         <nav style={{ padding: '20px', background: '#f8f9fa', borderBottom: '1px solid #ddd' }}>
//           <Link to="/transactions" style={{ marginRight: '20px', textDecoration: 'none', color: '#007bff' }}>
//             Transactions
//           </Link>
//         </nav>
        
//         <Routes>
//           <Route path="/" element={<Transactions />} />
//           <Route path="/transactions" element={<Transactions />} />
//         </Routes>
//       </div>
//     </Router>
//   );
// }

// export default App;

import './App.css';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Sidebar from "./components/Sidebar";
import Dashboard from "./pages/Dashboard";
import Transactions from "./pages/Transactions";
import Support from "./pages/Support";
import Budget from './pages/Budget';

function App() {
  return (
    <Router>
      <div style={{ display: "flex" }}>

        {/* Sidebar */}
        <Sidebar />

        {/* Main Content */}
        <div style={{ flex: 1, padding: "20px" }}>
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
}

export default App;
