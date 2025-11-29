import { Link } from "react-router-dom";

export default function Sidebar() {
  return (
    <div className="sidebar">
      <h2 className="logo">FINTRACK</h2>

      <nav>
        <Link to="/dashboard">Dashboard</Link>
        <Link to="/transactions">Transactions</Link>
<Link to="/budget">Budget </Link>
        <Link to="/support">Support / Donate</Link>
        
      </nav>
    </div>
  );
}
