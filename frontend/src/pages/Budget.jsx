import React, { useState, useEffect } from 'react';
import '../App.css';
import '../App.css'

const Budget = () => {
  const [budgets, setBudgets] = useState([]);
  const [categories, setCategories] = useState([]);
  const [newBudget, setNewBudget] = useState({
    category: '',
    amount: '',
    period: 'monthly' // monthly, weekly, yearly
  });
  const [notificationsEnabled, setNotificationsEnabled] = useState(false);
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);

  // Fetch existing budgets and categories
  const fetchBudgets = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/budgets');
      if (response.ok) {
        const data = await response.json();
        setBudgets(data);
      }
    } catch (error) {
      console.error('Error fetching budgets:', error);
    }
  };

  // Fetch categories from transactions
  const fetchCategories = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/transactions');
      if (response.ok) {
        const transactions = await response.json();
        const uniqueCategories = [...new Set(transactions.map(t => t.category))];
        setCategories(uniqueCategories.filter(cat => cat && cat !== 'all'));
      }
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  useEffect(() => {
    fetchBudgets();
    fetchCategories();
    
    // Load notification settings from localStorage
    const savedNotifications = localStorage.getItem('notificationsEnabled');
    const savedEmail = localStorage.getItem('userEmail');
    
    if (savedNotifications) setNotificationsEnabled(JSON.parse(savedNotifications));
    if (savedEmail) setEmail(savedEmail);
  }, []);

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewBudget(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Add new budget
  const handleAddBudget = async (e) => {
    e.preventDefault();
    
    if (!newBudget.category || !newBudget.amount) {
      alert('Please fill in all fields');
      return;
    }

    try {
      const response = await fetch('http://localhost:5000/api/budgets', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          category: newBudget.category,
          amount: parseFloat(newBudget.amount),
          period: newBudget.period
        })
      });

      if (response.ok) {
        const savedBudget = await response.json();
        setBudgets(prev => [...prev, savedBudget]);
        setNewBudget({ category: '', amount: '', period: 'monthly' });
        alert('Budget added successfully!');
      } else {
        throw new Error('Failed to add budget');
      }
    } catch (error) {
      console.error('Error adding budget:', error);
      alert('Failed to add budget. Please try again.');
    }
  };

  // Delete budget
  const handleDeleteBudget = async (budgetId) => {
    if (window.confirm('Are you sure you want to delete this budget?')) {
      try {
        const response = await fetch(`http://localhost:5000/api/budgets/${budgetId}`, {
          method: 'DELETE'
        });

        if (response.ok) {
          setBudgets(prev => prev.filter(budget => budget._id !== budgetId));
          alert('Budget deleted successfully!');
        }
      } catch (error) {
        console.error('Error deleting budget:', error);
        alert('Failed to delete budget.');
      }
    }
  };

  // Toggle notifications
  const handleToggleNotifications = () => {
    const newStatus = !notificationsEnabled;
    setNotificationsEnabled(newStatus);
    localStorage.setItem('notificationsEnabled', JSON.stringify(newStatus));
    
    if (newStatus && !email) {
      const userEmail = prompt('Please enter your email address for notifications:');
      if (userEmail) {
        setEmail(userEmail);
        localStorage.setItem('userEmail', userEmail);
      } else {
        setNotificationsEnabled(false);
      }
    }
  };

  // Send budget email manually
  const handleSendEmail = async () => {
    if (!email) {
      alert('Please set your email address first');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch('http://localhost:5000/api/budgets/send-budget-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email })
      });

      if (response.ok) {
        alert('Budget allocation email sent successfully!');
      } else {
        throw new Error('Failed to send email');
      }
    } catch (error) {
      console.error('Error sending email:', error);
      alert('Failed to send email. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Calculate budget usage (this would be enhanced with real transaction data)
  const calculateBudgetUsage = (budget) => {
    // This is a simplified calculation - you'd want to fetch actual spending per category
    const spent = Math.random() * budget.amount; // Mock data
    const percentage = (spent / budget.amount) * 100;
    return {
      spent: spent.toFixed(2),
      percentage: percentage.toFixed(1),
      remaining: (budget.amount - spent).toFixed(2)
    };
  };

  return (
    <div className="budget-page">
      <div className="container">
        <div className="page-header">
          <h1>Budget Allocation & Notifications</h1>
          <p>Manage your budgets and email notifications</p>
        </div>

        <div className="budget-layout">
          {/* Left Column - Budget Form and List */}
          <div className="budget-section">
            <div className="budget-form-card">
              <h3>Add New Budget</h3>
              <form onSubmit={handleAddBudget}>
                <div className="form-group">
                  <label>Category</label>
                  <select
                    name="category"
                    value={newBudget.category}
                    onChange={handleInputChange}
                    required
                  >
                    <option value="">Select Category</option>
                    {categories.map(category => (
                      <option key={category} value={category}>
                        {category}
                      </option>
                    ))}
                    <option value="other">Other</option>
                  </select>
                </div>

                {newBudget.category === 'other' && (
                  <div className="form-group">
                    <label>Custom Category</label>
                    <input
                      type="text"
                      name="customCategory"
                      placeholder="Enter custom category"
                      onChange={(e) => setNewBudget(prev => ({...prev, category: e.target.value}))}
                    />
                  </div>
                )}

                <div className="form-group">
                  <label>Amount</label>
                  <input
                    type="number"
                    name="amount"
                    value={newBudget.amount}
                    onChange={handleInputChange}
                    placeholder="Enter budget amount"
                    step="0.01"
                    min="0"
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Period</label>
                  <select
                    name="period"
                    value={newBudget.period}
                    onChange={handleInputChange}
                  >
                    <option value="weekly">Weekly</option>
                    <option value="monthly">Monthly</option>
                    <option value="yearly">Yearly</option>
                  </select>
                </div>

                <button type="submit" className="btn-add-budget">
                  Add Budget
                </button>
              </form>
            </div>

            {/* Budget List */}
            <div className="budget-list-card">
              <h3>Your Budgets</h3>
              {budgets.length === 0 ? (
                <p className="no-budgets">No budgets set yet. Add your first budget above.</p>
              ) : (
                <div className="budgets-list">
                  {budgets.map(budget => {
                    const usage = calculateBudgetUsage(budget);
                    return (
                      <div key={budget._id} className="budget-item">
                        <div className="budget-header">
                          <div className="budget-category">{budget.category}</div>
                          <button 
                            onClick={() => handleDeleteBudget(budget._id)}
                            className="btn-delete"
                          >
                            Delete
                          </button>
                        </div>
                        <div className="budget-details">
                          <div className="budget-amount">
                            ${budget.amount} ({budget.period})
                          </div>
                          <div className="budget-usage">
                            <div className="usage-bar">
                              <div 
                                className="usage-fill"
                                style={{ width: `${Math.min(usage.percentage, 100)}%` }}
                              ></div>
                            </div>
                            <div className="usage-text">
                              ${usage.spent} spent (${usage.remaining} remaining)
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>

          {/* Right Column - Notifications */}
          <div className="notifications-section">
            <div className="notifications-card">
              <h3>Email Notifications</h3>
              
              {/* Notification Toggle */}
              <div className="notification-toggle">
                <label className="toggle-label">
                  <span>Enable Email Notifications</span>
                  <div className="toggle-switch">
                    <input
                      type="checkbox"
                      checked={notificationsEnabled}
                      onChange={handleToggleNotifications}
                    />
                    <span className="slider"></span>
                  </div>
                </label>
                <p className="toggle-description">
                  Receive email alerts when you're close to exceeding your budgets
                </p>
              </div>

              {/* Email Input */}
              {notificationsEnabled && (
                <div className="email-section">
                  <div className="form-group">
                    <label>Email Address</label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => {
                        setEmail(e.target.value);
                        localStorage.setItem('userEmail', e.target.value);
                      }}
                      placeholder="your@email.com"
                    />
                  </div>
                  
                  <div className="email-actions">
                    <button 
                      onClick={handleSendEmail}
                      disabled={loading || !email}
                      className="btn-send-email"
                    >
                      {loading ? 'Sending...' : 'Send Budget Summary Email'}
                    </button>
                    
                    <p className="email-note">
                      This will send your current budget allocation and spending summary to your email.
                    </p>
                  </div>
                </div>
              )}

              {/* Notification Settings */}
              {notificationsEnabled && (
                <div className="notification-settings">
                  <h4>Alert Preferences</h4>
                  <div className="alert-options">
                    <label className="alert-option">
                      <input type="checkbox" defaultChecked />
                      <span>Notify when 80% of budget is used</span>
                    </label>
                    <label className="alert-option">
                      <input type="checkbox" defaultChecked />
                      <span>Notify when budget is exceeded</span>
                    </label>
                    <label className="alert-option">
                      <input type="checkbox" defaultChecked />
                      <span>Weekly budget summary</span>
                    </label>
                    <label className="alert-option">
                      <input type="checkbox" />
                      <span>Large transaction alerts</span>
                    </label>
                  </div>
                </div>
              )}
            </div>

            {/* Budget Tips */}
            <div className="tips-card">
              <h3>Budgeting Tips</h3>
              <ul className="tips-list">
                <li>💡 Set realistic budgets based on your past spending</li>
                <li>📊 Review your budgets monthly and adjust as needed</li>
                <li>🔔 Enable notifications to stay on track</li>
                <li>🎯 Focus on reducing spending in your highest categories</li>
                <li>💰 Allocate 20% of income to savings when possible</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Budget;