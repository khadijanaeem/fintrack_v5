import React, { useState,useEffect } from 'react';
import ExportPDF from '../components/ExportPDF';

const Transactions = () => {
  // Hardcoded transaction data
  // const hardcodedTransactions = [
  //   {
  //     id: 1,
  //     date: '2024-01-15',
  //     description: 'Grocery Store',
  //     category: 'Food',
  //     amount: -85.50,
  //     type: 'expense'
  //   },
  //   {
  //     id: 2,
  //     date: '2024-01-14',
  //     description: 'Salary',
  //     category: 'Income',
  //     amount: 2500.00,
  //     type: 'income'
  //   },
  //   {
  //     id: 3,
  //     date: '2024-01-13',
  //     description: 'Electricity Bill',
  //     category: 'Utilities',
  //     amount: -120.75,
  //     type: 'expense'
  //   },
  //   {
  //     id: 4,
  //     date: '2024-01-12',
  //     description: 'Freelance Work',
  //     category: 'Income',
  //     amount: 800.00,
  //     type: 'income'
  //   },
  //   {
  //     id: 5,
  //     date: '2024-01-11',
  //     description: 'Restaurant',
  //     category: 'Dining',
  //     amount: -45.25,
  //     type: 'expense'
  //   },
  //   {
  //     id: 6,
  //     date: '2024-01-10',
  //     description: 'Online Course',
  //     category: 'Education',
  //     amount: -99.99,
  //     type: 'expense'
  //   }
  // ];

  const [transactions, setTransactions] = useState([]);
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [newTransaction, setNewTransaction] = useState({
    amount: '',
    category: '',
    description: '',
    date: '',
    type: 'expense'
  });
  const fetchTransactions = async () => {
  try {
    setLoading(true);
    setError(null);
    
    const response = await fetch('http://localhost:5000/api/transactions', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const backendTransactions = await response.json();
    
    console.log('📦 Raw backend data:', backendTransactions);
    
    // Transform backend data to match frontend format
    const transformedTransactions = backendTransactions.map(transaction => {
      // Convert amount: positive for income, negative for expense
      const amount = transaction.type === 'income' 
        ? Math.abs(transaction.amount) 
        : -Math.abs(transaction.amount);
      
      return {
        id: transaction._id,
        date: new Date(transaction.date).toISOString().split('T')[0], // Format as YYYY-MM-DD
        description: transaction.description,
        category: transaction.categoryId ? `Category-${transaction.categoryId}` : 'General',
        amount: amount,
        type: transaction.type
      };
    });

    console.log('🔄 Transformed data:', transformedTransactions);
    setTransactions(transformedTransactions);
  } catch (error) {
    console.error('Error fetching transactions:', error);
    setError('Failed to fetch transactions. Please check if the server is running.');
  } finally {
    setLoading(false);
  }
};

// Fetch transactions on component mount
useEffect(() => {
  fetchTransactions();
}, []);

  const [filters, setFilters] = useState({
    type: 'all', 
    category: 'all',
    dateFrom: '',
    dateTo: '',
    search: ''
  });

  // Get unique categories for dropdown
  const categories = ['all', ...new Set(transactions.map(t => t.category))];

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({
      ...prev,
      [name]: value
    }));
  };
  

  // Clear all filters
  const clearFilters = () => {
    setFilters({
      type: 'all',
      category: 'all',
      dateFrom: '',
      dateTo: '',
      search: ''
    });
  };

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewTransaction(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Handle form submission
const handleSubmit = async (e) => {
  e.preventDefault();
  
  // Basic validation
  if (!newTransaction.amount || !newTransaction.category || !newTransaction.date) {
    alert('Please fill in all required fields');
    return;
  }

  try {
    // Prepare data for API
    const transactionData = {
      amount: parseFloat(newTransaction.amount),
      description: newTransaction.description,
      type: newTransaction.type,
      date: new Date(newTransaction.date).toISOString(),
      categoryId: newTransaction.category,
       userId: "65a1b2c3d4e5f67890123456"
    };

    const response = await fetch('http://localhost:5000/api/transactions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(transactionData)
    });

    if (!response.ok) {
      throw new Error('Failed to create transaction');
    }

    // Refresh transactions list
    await fetchTransactions();
    
    // Reset form and close
    setNewTransaction({
      amount: '',
      category: '',
      description: '',
      date: '',
      type: 'expense'
    });
    
    setShowForm(false);
    
  } catch (err) {
    alert('Failed to add transaction. Please try again.');
    console.error('Error adding transaction:', err);
  }
};

  // Enhanced filter function
  const filteredTransactions = transactions.filter(transaction => {
    // Filter by type
    if (filters.type !== 'all') {
      if (filters.type === 'income' && transaction.amount <= 0) return false;
      if (filters.type === 'expense' && transaction.amount >= 0) return false;
    }

    // Filter by category
    if (filters.category !== 'all' && transaction.category !== filters.category) {
      return false;
    }

    // Filter by date range
    if (filters.dateFrom && transaction.date < filters.dateFrom) return false;
    if (filters.dateTo && transaction.date > filters.dateTo) return false;

    // Filter by search term
    if (filters.search) {
      const searchTerm = filters.search.toLowerCase();
      const matchesDescription = transaction.description.toLowerCase().includes(searchTerm);
      const matchesCategory = transaction.category.toLowerCase().includes(searchTerm);
      if (!matchesDescription && !matchesCategory) return false;
    }

    return true;
  });

  // Calculate totals based on filtered transactions
  const filteredIncome = filteredTransactions
    .filter(t => t.amount > 0)
    .reduce((sum, t) => sum + t.amount, 0);
  
  const filteredExpenses = filteredTransactions
    .filter(t => t.amount < 0)
    .reduce((sum, t) => sum + Math.abs(t.amount), 0);
  
  const filteredBalance = filteredIncome - filteredExpenses;

  // Calculate overall totals
  const totalIncome = transactions
    .filter(t => t.amount > 0)
    .reduce((sum, t) => sum + t.amount, 0);
  
  const totalExpenses = transactions
    .filter(t => t.amount < 0)
    .reduce((sum, t) => sum + Math.abs(t.amount), 0);
  
  const balance = totalIncome - totalExpenses;
  if (loading) {
  return (
    <div className="transactions-page">
      <div className="container">
        <div className="loading">Loading transactions...</div>
      </div>
    </div>
  );
}

if (error) {
  return (
    <div className="transactions-page">
      <div className="container">
        <div className="error-message">
          <p>{error}</p>
          <button onClick={fetchTransactions} className="btn-retry">
            Retry
          </button>
        </div>
      </div>
    </div>
  );
}
  return (
    <div className="transactions-page">
      <div className="container">
        {/* Header with Add Button */}
        <div className="page-header">
          <h1>Transactions</h1>
          <div className="header-actions">
            <ExportPDF transactions={filteredTransactions} />
            <button 
              className="btn-add-transaction"
              onClick={() => setShowForm(true)}
            >
              + Add New Transaction
            </button>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="summary-cards">
          <div className="card balance">
            <h3>Current Balance</h3>
            <p className="amount">${balance.toFixed(2)}</p>
            <small>Filtered: ${filteredBalance.toFixed(2)}</small>
          </div>
          <div className="card income">
            <h3>Total Income</h3>
            <p className="amount">${totalIncome.toFixed(2)}</p>
            <small>Filtered: ${filteredIncome.toFixed(2)}</small>
          </div>
          <div className="card expense">
            <h3>Total Expenses</h3>
            <p className="amount">${totalExpenses.toFixed(2)}</p>
            <small>Filtered: ${filteredExpenses.toFixed(2)}</small>
          </div>
        </div>

        {/* Enhanced Filters Section */}
        <div className="filters-section">
          <h3>Filter Transactions</h3>
          <div className="filter-controls">
            {/* Type Filter */}
            <div className="filter-group">
              <label>Type</label>
              <select
                name="type"
                value={filters.type}
                onChange={handleFilterChange}
              >
                <option value="all">All Types</option>
                <option value="income">Income</option>
                <option value="expense">Expense</option>
              </select>
            </div>

            {/* Category Filter */}
            <div className="filter-group">
              <label>Category</label>
              <select
                name="category"
                value={filters.category}
                onChange={handleFilterChange}
              >
                <option value="all">All Categories</option>
                {categories.filter(cat => cat !== 'all').map(category => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </div>

            {/* Date Range Filters */}
            <div className="filter-group">
              <label>Date From</label>
              <input
                type="date"
                name="dateFrom"
                value={filters.dateFrom}
                onChange={handleFilterChange}
              />
            </div>

            <div className="filter-group">
              <label>Date To</label>
              <input
                type="date"
                name="dateTo"
                value={filters.dateTo}
                onChange={handleFilterChange}
              />
            </div>

            {/* Search Filter */}
            <div className="filter-group">
              <label>Search</label>
              <input
                type="text"
                name="search"
                placeholder="Search description or category..."
                value={filters.search}
                onChange={handleFilterChange}
              />
            </div>

            {/* Clear Filters Button */}
            <div className="filter-group">
              <label>&nbsp;</label>
              <button 
                className="btn-clear-filters"
                onClick={clearFilters}
              >
                Clear Filters
              </button>
            </div>
          </div>

          {/* Results Count */}
          <div className="filter-results">
            <p>
              Showing {filteredTransactions.length} of {transactions.length} transactions
            </p>
          </div>
        </div>

        {/* Add Transaction Form Modal */}
        {showForm && (
          <div className="form-overlay">
            <div className="transaction-form">
              <h2>Add New Transaction</h2>
              <form onSubmit={handleSubmit}>
                <div className="form-group">
                  <label>Amount *</label>
                  <input
                    type="number"
                    name="amount"
                    value={newTransaction.amount}
                    onChange={handleInputChange}
                    placeholder="Enter amount"
                    step="0.01"
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Category *</label>
                  <input
                    type="text"
                    name="category"
                    value={newTransaction.category}
                    onChange={handleInputChange}
                    placeholder="e.g., Food, Shopping, Salary"
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Description</label>
                  <input
                    type="text"
                    name="description"
                    value={newTransaction.description}
                    onChange={handleInputChange}
                    placeholder="Transaction description"
                  />
                </div>

                <div className="form-group">
                  <label>Date *</label>
                  <input
                    type="date"
                    name="date"
                    value={newTransaction.date}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Type</label>
                  <select
                    name="type"
                    value={newTransaction.type}
                    onChange={handleInputChange}
                  >
                    <option value="expense">Expense</option>
                    <option value="income">Income</option>
                  </select>
                </div>

                <div className="form-buttons">
                  <button type="submit" className="btn-submit">
                    Add Transaction
                  </button>
                  <button 
                    type="button" 
                    className="btn-cancel"
                    onClick={() => setShowForm(false)}
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Transactions Table */}
        <div className="transactions-table">
          <table>
            <thead>
              <tr>
                <th>Date</th>
                <th>Description</th>
                <th>Category</th>
                <th>Amount</th>
                <th>Type</th>
              </tr>
            </thead>
            <tbody>
              {filteredTransactions.length > 0 ? (
                filteredTransactions.map(transaction => (
                  <tr key={transaction.id}>
                    <td>{transaction.date}</td>
                    <td>{transaction.description}</td>
                    <td>{transaction.category}</td>
                    <td className={transaction.type === 'income' ? 'income' : 'expense'}>
                      {transaction.type === 'income' ? '+' : '-'}${Math.abs(transaction.amount).toFixed(2)}
                    </td>
                    <td>
                      <span className={`badge ${transaction.type}`}>
                        {transaction.type}
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="no-data">
                    No transactions found matching your filters.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Transactions;