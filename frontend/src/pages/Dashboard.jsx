import React, { useState, useEffect } from 'react';
import { Doughnut, Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

const Dashboard = () => {
  const [dashboardData, setDashboardData] = useState({
    summary: {
      totalBalance: 0,
      totalIncome: 0,
      totalExpenses: 0,
      monthlySavings: 0
    },
    recentTransactions: [],
    spendingByCategory: {},
    monthlyTrend: {
      labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
      income: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      expenses: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
    }
  });
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch transactions and calculate dashboard data
  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch('http://localhost:5000/api/transactions');
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const backendTransactions = await response.json();
      console.log('📊 Raw transactions for dashboard:', backendTransactions);
      
      // Transform and calculate dashboard data
      const transformedData = calculateDashboardData(backendTransactions);
      setDashboardData(transformedData);
      
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      setError('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  // Calculate all dashboard metrics from transactions
  const calculateDashboardData = (transactions) => {
    if (!transactions || transactions.length === 0) {
      return {
        summary: { totalBalance: 0, totalIncome: 0, totalExpenses: 0, monthlySavings: 0 },
        recentTransactions: [],
        spendingByCategory: {},
        monthlyTrend: {
          labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
          income: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
          expenses: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
        }
      };
    }

    // Transform transactions to frontend format
    const transformedTransactions = transactions.map(transaction => ({
      id: transaction._id,
      date: new Date(transaction.date).toISOString().split('T')[0],
      description: transaction.description,
      category: transaction.categoryId ? `Category-${transaction.categoryId}` : 'General',
      amount: transaction.type === 'income' ? Math.abs(transaction.amount) : -Math.abs(transaction.amount),
      type: transaction.type
    }));

    // Calculate summary
    const totalIncome = transformedTransactions
      .filter(t => t.type === 'income')
      .reduce((sum, t) => sum + t.amount, 0);
    
    const totalExpenses = transformedTransactions
      .filter(t => t.type === 'expense')
      .reduce((sum, t) => sum + Math.abs(t.amount), 0);
    
    const totalBalance = totalIncome - totalExpenses;
    
    // Calculate current month savings (simplified)
    const currentMonth = new Date().getMonth();
    const currentMonthTransactions = transformedTransactions.filter(t => {
      const transactionMonth = new Date(t.date).getMonth();
      return transactionMonth === currentMonth;
    });
    
    const monthlyIncome = currentMonthTransactions
      .filter(t => t.type === 'income')
      .reduce((sum, t) => sum + t.amount, 0);
    
    const monthlyExpenses = currentMonthTransactions
      .filter(t => t.type === 'expense')
      .reduce((sum, t) => sum + Math.abs(t.amount), 0);
    
    const monthlySavings = monthlyIncome - monthlyExpenses;

    // Calculate spending by category
    const spendingByCategory = {};
    transformedTransactions
      .filter(t => t.type === 'expense')
      .forEach(transaction => {
        spendingByCategory[transaction.category] = 
          (spendingByCategory[transaction.category] || 0) + Math.abs(transaction.amount);
      });

    // Get recent transactions (last 4)
    const recentTransactions = [...transformedTransactions]
      .sort((a, b) => new Date(b.date) - new Date(a.date))
      .slice(0, 4);

    // Calculate monthly trend (simplified - you might want to enhance this)
    const monthlyTrend = calculateMonthlyTrend(transformedTransactions);

    return {
      summary: {
        totalBalance,
        totalIncome,
        totalExpenses,
        monthlySavings
      },
      recentTransactions,
      spendingByCategory,
      monthlyTrend
    };
  };

  // Calculate monthly income/expense trends
  const calculateMonthlyTrend = (transactions) => {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const incomeByMonth = Array(12).fill(0);
    const expensesByMonth = Array(12).fill(0);

    transactions.forEach(transaction => {
      const month = new Date(transaction.date).getMonth();
      if (transaction.type === 'income') {
        incomeByMonth[month] += transaction.amount;
      } else {
        expensesByMonth[month] += Math.abs(transaction.amount);
      }
    });

    return {
      labels: months,
      income: incomeByMonth,
      expenses: expensesByMonth
    };
  };

  // Calculate quick stats
  const calculateQuickStats = () => {
    const monthlyBudget = 3500; // You can make this dynamic
    const budgetUsed = dashboardData.summary.totalExpenses > 0 
      ? Math.min(100, (dashboardData.summary.totalExpenses / monthlyBudget) * 100)
      : 0;
    
    const savingsRate = dashboardData.summary.totalIncome > 0
      ? (dashboardData.summary.monthlySavings / dashboardData.summary.totalIncome) * 100
      : 0;

    const transactionsThisMonth = dashboardData.recentTransactions.length;

    return {
      monthlyBudget,
      budgetUsed: Math.round(budgetUsed),
      savingsRate: Math.round(savingsRate),
      transactionsThisMonth
    };
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const quickStats = calculateQuickStats();

  // Chart data (same as your existing code)
  const spendingChartData = {
    labels: Object.keys(dashboardData.spendingByCategory),
    datasets: [
      {
        data: Object.values(dashboardData.spendingByCategory),
        backgroundColor: [
          '#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', 
          '#9966FF', '#FF9F40', '#FF6384'
        ],
        hoverBackgroundColor: [
          '#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0',
          '#9966FF', '#FF9F40', '#FF6384'
        ]
      }
    ]
  };

  const monthlyTrendData = {
    labels: dashboardData.monthlyTrend.labels,
    datasets: [
      {
        label: 'Income',
        data: dashboardData.monthlyTrend.income,
        borderColor: '#10B981',
        backgroundColor: 'rgba(16, 185, 129, 0.1)',
        fill: true,
        tension: 0.4
      },
      {
        label: 'Expenses',
        data: dashboardData.monthlyTrend.expenses,
        borderColor: '#EF4444',
        backgroundColor: 'rgba(239, 68, 68, 0.1)',
        fill: true,
        tension: 0.4
      }
    ]
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom',
      }
    }
  };

  const doughnutOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'right',
      }
    }
  };

  if (loading) {
    return (
      <div className="dashboard-page">
        <div className="container">
          <div className="loading">Loading dashboard data...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="dashboard-page">
        <div className="container">
          <div className="error-message">
            <p>{error}</p>
            <button onClick={fetchDashboardData} className="btn-retry">
              Retry
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard-page">
      <div className="container">
        <div className="page-header">
          <h1>Dashboard Overview</h1>
          <p>Welcome back! Here's your financial summary</p>
        </div>

        {/* Summary Cards */}
        <div className="summary-grid">
          <div className="summary-card balance">
            <div className="card-icon">💰</div>
            <div className="card-content">
              <h3>Total Balance</h3>
              <p className="amount">${dashboardData.summary.totalBalance.toFixed(2)}</p>
            </div>
          </div>
          
          <div className="summary-card income">
            <div className="card-icon">📈</div>
            <div className="card-content">
              <h3>Total Income</h3>
              <p className="amount">${dashboardData.summary.totalIncome.toFixed(2)}</p>
            </div>
          </div>
          
          <div className="summary-card expense">
            <div className="card-icon">📉</div>
            <div className="card-content">
              <h3>Total Expenses</h3>
              <p className="amount">${dashboardData.summary.totalExpenses.toFixed(2)}</p>
            </div>
          </div>
          
          <div className="summary-card savings">
            <div className="card-icon">🎯</div>
            <div className="card-content">
              <h3>Monthly Savings</h3>
              <p className="amount">${dashboardData.summary.monthlySavings.toFixed(2)}</p>
            </div>
          </div>
        </div>

        {/* Charts Section */}
        <div className="charts-grid">
          {/* Monthly Trends Chart */}
          <div className="chart-card">
            <h3>Monthly Income vs Expenses</h3>
            <div className="chart-container">
              <Line data={monthlyTrendData} options={chartOptions} />
            </div>
          </div>

          {/* Spending by Category */}
          <div className="chart-card">
            <h3>Spending by Category</h3>
            <div className="chart-container">
              <Doughnut data={spendingChartData} options={doughnutOptions} />
            </div>
          </div>
        </div>

        <div className="bottom-grid">
          {/* Recent Transactions */}
          <div className="recent-transactions">
            <h3>Recent Transactions</h3>
            <div className="transactions-list">
              {dashboardData.recentTransactions.map(transaction => (
                <div key={transaction.id} className="transaction-item">
                  <div className="transaction-info">
                    <span className="description">{transaction.description}</span>
                    <span className="date">{transaction.date}</span>
                  </div>
                  <span className={`amount ${transaction.type}`}>
                    {transaction.type === 'income' ? '+' : '-'}${Math.abs(transaction.amount).toFixed(2)}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Stats */}
          <div className="quick-stats">
            <h3>Quick Stats</h3>
            <div className="stats-list">
              <div className="stat-item">
                <span className="stat-label">Monthly Budget</span>
                <span className="stat-value">${quickStats.monthlyBudget}</span>
              </div>
              <div className="stat-item">
                <span className="stat-label">Budget Used</span>
                <span className="stat-value">{quickStats.budgetUsed}%</span>
              </div>
              <div className="stat-item">
                <span className="stat-label">Savings Rate</span>
                <span className="stat-value">{quickStats.savingsRate}%</span>
              </div>
              <div className="stat-item">
                <span className="stat-label">Transactions This Month</span>
                <span className="stat-value">{quickStats.transactionsThisMonth}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;