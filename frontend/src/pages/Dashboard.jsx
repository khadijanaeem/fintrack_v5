import React from 'react';
import { Doughnut, Bar, Line } from 'react-chartjs-2';
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
  const dashboardData = {
    summary: {
      totalBalance: 12500.75,
      totalIncome: 8500.00,
      totalExpenses: 3250.25,
      monthlySavings: 5249.75
    },
    recentTransactions: [
      { id: 1, description: 'Grocery Store', amount: -85.50, date: '2024-01-15', type: 'expense' },
      { id: 2, description: 'Salary', amount: 2500.00, date: '2024-01-14', type: 'income' },
      { id: 3, description: 'Electricity Bill', amount: -120.75, date: '2024-01-13', type: 'expense' },
      { id: 4, description: 'Freelance Work', amount: 800.00, date: '2024-01-12', type: 'income' }
    ],
    spendingByCategory: {
      Food: 450.00,
      Transportation: 280.50,
      Utilities: 320.75,
      Entertainment: 150.25,
      Shopping: 420.00,
      Healthcare: 95.00,
      Other: 1533.75
    },
    monthlyTrend: {
      labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
      income: [2500, 2800, 3200, 3000, 3500, 4000, 3800, 4200, 4500, 4800, 5200, 5500],
      expenses: [1800, 1950, 2200, 2100, 2300, 2500, 2400, 2600, 2800, 2700, 2900, 3000]
    }
  };

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

          {/*Stats*/}
          <div className="quick-stats">
            <h3>Quick Stats</h3>
            <div className="stats-list">
              <div className="stat-item">
                <span className="stat-label">Monthly Budget</span>
                <span className="stat-value">$3,500</span>
              </div>
              <div className="stat-item">
                <span className="stat-label">Budget Used</span>
                <span className="stat-value">72%</span>
              </div>
              <div className="stat-item">
                <span className="stat-label">Savings Rate</span>
                <span className="stat-value">42%</span>
              </div>
              <div className="stat-item">
                <span className="stat-label">Transactions This Month</span>
                <span className="stat-value">24</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;