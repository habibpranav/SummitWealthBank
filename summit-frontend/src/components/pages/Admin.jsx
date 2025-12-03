import React, { useState, useEffect } from 'react';
import {
  Users,
  UserCheck,
  UserX,
  Shield,
  AlertCircle,
  CheckCircle,
  XCircle,
  Search,
  Filter,
  MoreVertical,
  Lock,
  Unlock,
  TrendingUp,
  DollarSign,
  Activity,
  Package,
  Plus,
  Edit,
  Trash2,
  X
} from 'lucide-react';
import axios from 'axios';

const Admin = () => {
  const [activeTab, setActiveTab] = useState('users'); // 'users' or 'stocks'
  const [users, setUsers] = useState([]);
  const [stats, setStats] = useState({
    totalUsers: 0,
    activeUsers: 0
  });
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [loading, setLoading] = useState(true);
  const [selectedUser, setSelectedUser] = useState(null);
  const [showActionModal, setShowActionModal] = useState(false);
  const [userAccounts, setUserAccounts] = useState([]);

  // Stock management state
  const [stocks, setStocks] = useState([]);
  const [showStockModal, setShowStockModal] = useState(false);
  const [showUpdatePriceModal, setShowUpdatePriceModal] = useState(false);
  const [selectedStock, setSelectedStock] = useState(null);
  const [stockForm, setStockForm] = useState({
    symbol: '',
    companyName: '',
    currentPrice: '',
    totalShares: '',
    sector: '',
    description: ''
  });
  const [priceForm, setPriceForm] = useState({
    symbol: '',
    newPrice: ''
  });

  useEffect(() => {
    fetchAdminData();
    if (activeTab === 'stocks') {
      fetchStocks();
    }
  }, [activeTab]);

  const fetchAdminData = async () => {
    try {
      const usersRes = await axios.get('/api/admin/users');
      const users = usersRes.data;

      setUsers(users);

      // Calculate stats from actual data
      const stats = {
        totalUsers: users.length,
        activeUsers: users.filter(u => u.role !== 'ADMIN').length
      };
      setStats(stats);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching admin data:', error);
      alert('Failed to fetch users. Please try again.');
      setLoading(false);
    }
  };

  const fetchUserAccounts = async (userEmail) => {
    try {
      // Fetch all accounts from admin endpoint
      const allAccountsRes = await axios.get('/api/admin/accounts');
      // Filter accounts by user email
      const filteredAccounts = allAccountsRes.data.filter(acc =>
        acc.user && acc.user.email === userEmail
      );
      setUserAccounts(filteredAccounts);
    } catch (error) {
      console.error('Error fetching user accounts:', error);
      alert('Failed to fetch user accounts. Please try again.');
      setUserAccounts([]);
    }
  };

  const handleFreezeAccount = async (accountId) => {
    try {
      await axios.post('/api/admin/freeze', { accountId });
      alert('Account frozen successfully!');
      // Refresh accounts
      await fetchUserAccounts(selectedUser.email);
      fetchAdminData();
    } catch (error) {
      console.error('Error freezing account:', error);
      alert(error.response?.data || 'Failed to freeze account');
    }
  };

  const handleUnfreezeAccount = async (accountId) => {
    try {
      await axios.post('/api/admin/unfreeze', { accountId });
      alert('Account unfrozen successfully!');
      // Refresh accounts
      await fetchUserAccounts(selectedUser.email);
      fetchAdminData();
    } catch (error) {
      console.error('Error unfreezing account:', error);
      alert(error.response?.data || 'Failed to unfreeze account');
    }
  };

  // Stock Management Functions
  const fetchStocks = async () => {
    try {
      const response = await axios.get('/api/admin/stocks');
      setStocks(response.data);
    } catch (error) {
      console.error('Error fetching stocks:', error);
      alert('Failed to fetch stocks');
    }
  };

  const handleCreateStock = async (e) => {
    e.preventDefault();
    try {
      await axios.post('/api/admin/stocks/create', {
        ...stockForm,
        currentPrice: parseFloat(stockForm.currentPrice),
        totalShares: parseInt(stockForm.totalShares)
      });
      alert('Stock created successfully!');
      setShowStockModal(false);
      setStockForm({
        symbol: '',
        companyName: '',
        currentPrice: '',
        totalShares: '',
        sector: '',
        description: ''
      });
      fetchStocks();
    } catch (error) {
      console.error('Error creating stock:', error);
      alert(error.response?.data || 'Failed to create stock');
    }
  };

  const handleUpdatePrice = async (e) => {
    e.preventDefault();
    try {
      await axios.post('/api/admin/stocks/update-price', {
        symbol: priceForm.symbol,
        newPrice: parseFloat(priceForm.newPrice)
      });
      alert('Stock price updated successfully!');
      setShowUpdatePriceModal(false);
      setPriceForm({ symbol: '', newPrice: '' });
      fetchStocks();
    } catch (error) {
      console.error('Error updating price:', error);
      alert(error.response?.data || 'Failed to update price');
    }
  };

  const handleDeleteStock = async (symbol) => {
    if (!confirm(`Are you sure you want to delete ${symbol}? This action cannot be undone.`)) {
      return;
    }
    try {
      await axios.delete(`/api/admin/stocks/${symbol}`);
      alert('Stock deleted successfully!');
      fetchStocks();
    } catch (error) {
      console.error('Error deleting stock:', error);
      alert(error.response?.data || 'Failed to delete stock');
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const getRiskBadge = (risk) => {
    const badges = {
      'LOW': 'bg-green-100 text-green-800',
      'MEDIUM': 'bg-yellow-100 text-yellow-800',
      'HIGH': 'bg-red-100 text-red-800',
      'UNKNOWN': 'bg-gray-100 text-gray-800'
    };
    return badges[risk] || badges['UNKNOWN'];
  };

  const getStatusBadge = (status) => {
    const badges = {
      'ACTIVE': 'bg-green-100 text-green-800',
      'SUSPENDED': 'bg-red-100 text-red-800',
      'PENDING_VERIFICATION': 'bg-yellow-100 text-yellow-800'
    };
    return badges[status] || 'bg-gray-100 text-gray-800';
  };

  const filteredUsers = users.filter(user => {
    const matchesSearch = 
      user.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesFilter = 
      filterStatus === 'all' || 
      user.status === filterStatus;
    
    return matchesSearch && matchesFilter;
  });

  // Stock Modals
  const StockCreateModal = () => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-semibold text-gray-900">Create New Stock</h3>
          <button onClick={() => setShowStockModal(false)} className="p-1 hover:bg-gray-100 rounded">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleCreateStock} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Stock Symbol *</label>
              <input
                type="text"
                value={stockForm.symbol}
                onChange={(e) => setStockForm({...stockForm, symbol: e.target.value.toUpperCase()})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                placeholder="AAPL"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Company Name *</label>
              <input
                type="text"
                value={stockForm.companyName}
                onChange={(e) => setStockForm({...stockForm, companyName: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                placeholder="Apple Inc."
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Current Price *</label>
              <input
                type="number"
                step="0.01"
                value={stockForm.currentPrice}
                onChange={(e) => setStockForm({...stockForm, currentPrice: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                placeholder="175.50"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Total Shares *</label>
              <input
                type="number"
                value={stockForm.totalShares}
                onChange={(e) => setStockForm({...stockForm, totalShares: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                placeholder="10000"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Sector</label>
            <input
              type="text"
              value={stockForm.sector}
              onChange={(e) => setStockForm({...stockForm, sector: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              placeholder="Technology"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
            <textarea
              value={stockForm.description}
              onChange={(e) => setStockForm({...stockForm, description: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              rows="3"
              placeholder="Brief company description"
            />
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={() => setShowStockModal(false)}
              className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Create Stock
            </button>
          </div>
        </form>
      </div>
    </div>
  );

  const UpdatePriceModal = () => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl p-6 w-full max-w-md">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-semibold text-gray-900">Update Stock Price</h3>
          <button onClick={() => setShowUpdatePriceModal(false)} className="p-1 hover:bg-gray-100 rounded">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleUpdatePrice} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Stock Symbol</label>
            <select
              value={priceForm.symbol}
              onChange={(e) => setPriceForm({...priceForm, symbol: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              required
            >
              <option value="">Select a stock</option>
              {stocks.map(stock => (
                <option key={stock.symbol} value={stock.symbol}>
                  {stock.symbol} - {stock.companyName}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">New Price</label>
            <input
              type="number"
              step="0.01"
              value={priceForm.newPrice}
              onChange={(e) => setPriceForm({...priceForm, newPrice: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              placeholder="180.25"
              required
            />
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={() => setShowUpdatePriceModal(false)}
              className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Update Price
            </button>
          </div>
        </form>
      </div>
    </div>
  );

  const ActionModal = () => {
    if (!selectedUser) return null;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-xl font-semibold text-gray-900">
                Manage Accounts: {selectedUser.firstName} {selectedUser.lastName}
              </h3>
              <p className="text-sm text-gray-500">{selectedUser.email}</p>
            </div>
            <button
              onClick={() => {
                setShowActionModal(false);
                setSelectedUser(null);
                setUserAccounts([]);
              }}
              className="p-1 hover:bg-gray-100 rounded"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {userAccounts.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-500">No accounts found for this user</p>
            </div>
          ) : (
            <div className="space-y-3">
              {userAccounts.map((account) => (
                <div
                  key={account.id}
                  className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50"
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-3">
                      <div>
                        <p className="font-medium text-gray-900">
                          {account.type} Account
                        </p>
                        <p className="text-sm text-gray-500">
                          Account #{account.accountNumber}
                        </p>
                        <p className="text-sm font-medium text-gray-900 mt-1">
                          {formatCurrency(account.balance)}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium ${
                        account.frozen
                          ? 'bg-red-100 text-red-800'
                          : 'bg-green-100 text-green-800'
                      }`}
                    >
                      {account.frozen ? 'Frozen' : 'Active'}
                    </span>

                    {account.frozen ? (
                      <button
                        onClick={() => handleUnfreezeAccount(account.id)}
                        className="flex items-center gap-2 px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 text-sm"
                      >
                        <Unlock className="w-4 h-4" />
                        Unfreeze
                      </button>
                    ) : (
                      <button
                        onClick={() => handleFreezeAccount(account.id)}
                        className="flex items-center gap-2 px-3 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 text-sm"
                      >
                        <Lock className="w-4 h-4" />
                        Freeze
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}

          <div className="mt-6">
            <button
              onClick={() => {
                setShowActionModal(false);
                setSelectedUser(null);
                setUserAccounts([]);
              }}
              className="w-full px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="spinner"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center gap-3">
        <Shield className="w-8 h-8 text-blue-600" />
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
          <p className="text-gray-600 mt-1">Manage users and monitor system activity</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex gap-6">
          <button
            onClick={() => setActiveTab('users')}
            className={`py-2 px-1 border-b-2 font-medium text-sm transition-colors ${
              activeTab === 'users'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            <Users className="w-4 h-4 inline mr-2" />
            User Management
          </button>
          <button
            onClick={() => setActiveTab('stocks')}
            className={`py-2 px-1 border-b-2 font-medium text-sm transition-colors ${
              activeTab === 'stocks'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            <Package className="w-4 h-4 inline mr-2" />
            Stock Management
          </button>
        </nav>
      </div>

      {/* Tab Content */}
      {activeTab === 'users' ? (
        <>
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-white rounded-xl p-6 border border-gray-200">
          <div className="flex items-center justify-between mb-2">
            <Users className="w-5 h-5 text-blue-600" />
            <span className="text-sm text-gray-500">Total</span>
          </div>
          <p className="text-2xl font-bold text-gray-900">{stats.totalUsers}</p>
          <p className="text-sm text-gray-600 mt-1">Registered Users</p>
        </div>

        <div className="bg-white rounded-xl p-6 border border-gray-200">
          <div className="flex items-center justify-between mb-2">
            <Activity className="w-5 h-5 text-green-600" />
            <span className="text-sm text-gray-500">Active</span>
          </div>
          <p className="text-2xl font-bold text-gray-900">{stats.activeUsers}</p>
          <p className="text-sm text-gray-600 mt-1">Active Users</p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl border border-gray-200 p-4">
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                placeholder="Search users..."
              />
            </div>
          </div>
          
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
          >
            <option value="all">All Status</option>
            <option value="ACTIVE">Active</option>
            <option value="SUSPENDED">Suspended</option>
            <option value="PENDING_VERIFICATION">Pending Verification</option>
          </select>
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  User
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Role
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Phone
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredUsers.map((user) => (
                <tr key={user.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div>
                      <p className="text-sm font-medium text-gray-900">
                        {user.firstName} {user.lastName}
                      </p>
                      <p className="text-sm text-gray-500">{user.email}</p>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      user.role === 'ADMIN' ? 'bg-purple-100 text-purple-800' : 'bg-blue-100 text-blue-800'
                    }`}>
                      {user.role}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusBadge(user.status)}`}>
                      {user.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    {user.phone || 'N/A'}
                  </td>
                  <td className="px-6 py-4">
                    {user.role !== 'ADMIN' && (
                      <button
                        onClick={() => {
                          setSelectedUser(user);
                          fetchUserAccounts(user.email);
                          setShowActionModal(true);
                        }}
                        className="p-2 hover:bg-gray-100 rounded-lg"
                      >
                        <MoreVertical className="w-4 h-4 text-gray-600" />
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

        </>
      ) : (
        <>
          {/* Stock Management Section */}
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold text-gray-900">Stock Inventory</h2>
              <p className="text-sm text-gray-600">Manage available stocks for trading</p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => setShowUpdatePriceModal(true)}
                className="flex items-center gap-2 px-4 py-2 border border-blue-600 text-blue-600 rounded-lg hover:bg-blue-50 transition-colors"
              >
                <Edit className="w-4 h-4" />
                Update Price
              </button>
              <button
                onClick={() => setShowStockModal(true)}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Plus className="w-4 h-4" />
                Add Stock
              </button>
            </div>
          </div>

          {/* Stocks Table */}
          <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Symbol
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Company
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Price
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Total Shares
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Available
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Sector
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {stocks.length === 0 ? (
                    <tr>
                      <td colSpan="7" className="px-6 py-12 text-center">
                        <Package className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                        <p className="text-gray-500 mb-2">No stocks available</p>
                        <p className="text-sm text-gray-400">Add stocks to enable trading</p>
                      </td>
                    </tr>
                  ) : (
                    stocks.map((stock) => (
                      <tr key={stock.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4">
                          <span className="font-mono font-bold text-gray-900">{stock.symbol}</span>
                        </td>
                        <td className="px-6 py-4">
                          <p className="text-sm font-medium text-gray-900">{stock.companyName}</p>
                          {stock.description && (
                            <p className="text-xs text-gray-500 mt-1 line-clamp-1">{stock.description}</p>
                          )}
                        </td>
                        <td className="px-6 py-4 text-sm font-medium text-gray-900">
                          {formatCurrency(stock.currentPrice)}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-900">
                          {stock.totalShares.toLocaleString()}
                        </td>
                        <td className="px-6 py-4 text-sm">
                          <span className={`font-medium ${stock.availableShares > 0 ? 'text-green-600' : 'text-red-600'}`}>
                            {stock.availableShares.toLocaleString()}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                            {stock.sector || 'N/A'}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => {
                                setPriceForm({ symbol: stock.symbol, newPrice: stock.currentPrice });
                                setShowUpdatePriceModal(true);
                              }}
                              className="p-2 hover:bg-blue-50 rounded-lg text-blue-600"
                              title="Update Price"
                            >
                              <Edit className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleDeleteStock(stock.symbol)}
                              className="p-2 hover:bg-red-50 rounded-lg text-red-600"
                              title="Delete Stock"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}

      {/* Modals */}
      {showActionModal && <ActionModal />}
      {showStockModal && <StockCreateModal />}
      {showUpdatePriceModal && <UpdatePriceModal />}
    </div>
  );
};

export default Admin;
