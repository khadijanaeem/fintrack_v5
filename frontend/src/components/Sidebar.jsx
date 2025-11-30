import { Link } from "react-router-dom";

export default function Sidebar() {
  return (
    <div className="sidebar fixed top-0 left-0 h-full w-64 bg-gray-900 text-white p-6 shadow-lg">
      <h2 className="logo text-2xl font-bold mb-8">FINTRACK</h2>

      <nav className="flex flex-col gap-4 text-lg">
        <Link to="/dashboard" className="hover:text-gray-300">Dashboard</Link>
        <Link to="/transactions" className="hover:text-gray-300">Transactions</Link>
        <Link to="/budget" className="hover:text-gray-300">Budget</Link>
        <Link to="/support" className="hover:text-gray-300">Support / Donate</Link>
      </nav>
    </div>
  );
}
