import React, { useState, useEffect } from 'react';
import {
  Download,
  Search,
  ArrowUpRight,
  ArrowDownRight,
  ShoppingBag,
  Utensils,
  Car,
  Home,
  Briefcase,
  Heart,
  MoreHorizontal,
  TrendingUp,
  DollarSign,
  CreditCard
} from 'lucide-react';
import axios from 'axios';

const Transactions = () => {
  const [transactions, setTransactions] = useState([]);
  const [filteredTransactions, setFilteredTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchError, setSearchError] = useState('');

  useEffect(() => {
    fetchTransactions();
  }, []);

  useEffect(() => {
    filterTransactions();
  }, [transactions, searchTerm]);

  const fetchTransactions = async () => {
    try {
      const [transactionsResponse, accountsResponse] = await Promise.all([
        axios.get('/api/transactions/recent?limit=100'),
        axios.get('/api/accounts')
      ]);

      const transactionsData = transactionsResponse.data || [];
      const accountsData = accountsResponse.data || [];

      // Get user's account IDs for determining transaction type
      const userAccountIds = accountsData.map(acc => acc.id);

      // Transform backend Transaction data to match frontend expectations
      const transformedTransactions = transactionsData.map(t => {
        // Use account numbers directly from backend
        const fromAccountNum = t.fromAccountNumber;
        const toAccountNum = t.toAccountNumber;

        // Determine if this is a credit or debit based on whether user owns from/to account
        const isUserSender = userAccountIds.includes(t.fromAccountId);
        const isUserReceiver = userAccountIds.includes(t.toAccountId);

        let type, accountNumber, merchant;

        if (isUserSender && isUserReceiver) {
          // Internal transfer between user's own accounts - show as both
          type = 'TRANSFER';
          accountNumber = fromAccountNum;
          merchant = `${fromAccountNum} → ${toAccountNum}`;
        } else if (isUserReceiver) {
          // Incoming transfer - CREDIT
          type = 'CREDIT';
          accountNumber = toAccountNum;
          merchant = `${fromAccountNum} → ${toAccountNum}`;
        } else {
          // Outgoing transfer - DEBIT
          type = 'DEBIT';
          accountNumber = fromAccountNum;
          merchant = `${fromAccountNum} → ${toAccountNum}`;
        }

        return {
          id: t.id,
          transactionReference: t.transactionReference || 'N/A',
          description: t.description || 'Transfer',
          amount: t.amount,
          date: t.timestamp,
          type: type,
          category: 'Transfer',
          merchant: merchant,
          accountNumber: accountNumber,
          fromAccountId: t.fromAccountId,
          toAccountId: t.toAccountId
        };
      });

      setTransactions(transformedTransactions);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching transactions:', error);
      // Mock data
      const mockTransactions = [
        {
          id: 1,
          description: 'Amazon Purchase',
          amount: -89.99,
          date: '2025-11-28',
          type: 'DEBIT',
          category: 'Shopping',
          merchant: 'Amazon.com',
          accountNumber: '****4521'
        },
        {
          id: 2,
          description: 'Salary Deposit',
          amount: 3500.00,
          date: '2025-11-27',
          type: 'CREDIT',
          category: 'Income',
          merchant: 'TechCorp Inc',
          accountNumber: '****4521'
        },
        {
          id: 3,
          description: 'Starbucks',
          amount: -12.50,
          date: '2025-11-26',
          type: 'DEBIT',
          category: 'Dining',
          merchant: 'Starbucks',
          accountNumber: '****4521'
        },
        {
          id: 4,
          description: 'Transfer from Savings',
          amount: 500.00,
          date: '2025-11-25',
          type: 'CREDIT',
          category: 'Transfer',
          merchant: 'Internal Transfer',
          accountNumber: '****4521'
        },
        {
          id: 5,
          description: 'Utilities Bill',
          amount: -145.30,
          date: '2025-11-24',
          type: 'DEBIT',
          category: 'Bills',
          merchant: 'City Utilities',
          accountNumber: '****4521'
        },
        {
          id: 6,
          description: 'Grocery Store',
          amount: -78.45,
          date: '2025-11-23',
          type: 'DEBIT',
          category: 'Groceries',
          merchant: 'Whole Foods',
          accountNumber: '****4521'
        },
        {
          id: 7,
          description: 'Gas Station',
          amount: -45.00,
          date: '2025-11-22',
          type: 'DEBIT',
          category: 'Transportation',
          merchant: 'Shell',
          accountNumber: '****4521'
        },
        {
          id: 8,
          description: 'Investment Return',
          amount: 250.00,
          date: '2025-11-20',
          type: 'CREDIT',
          category: 'Investment',
          merchant: 'Vanguard',
          accountNumber: '****7832'
        }
      ];
      setTransactions(mockTransactions);
      setLoading(false);
    }
  };

  const searchByReference = async (reference) => {
    if (!reference || reference.trim() === '') {
      setSearchError('');
      filterTransactions();
      return;
    }

    setLoading(true);
    setSearchError('');

    try {
      const response = await axios.get(`/api/transactions/search?reference=${reference.trim()}`);
      const transaction = response.data;

      // Fetch accounts to determine if user owns the accounts
      const accountsResponse = await axios.get('/api/accounts');
      const accountsData = accountsResponse.data || [];

      const userAccountIds = accountsData.map(acc => acc.id);

      // Transform the single transaction - use account numbers from backend
      const fromAccountNum = transaction.fromAccountNumber;
      const toAccountNum = transaction.toAccountNumber;
      const isUserSender = userAccountIds.includes(transaction.fromAccountId);
      const isUserReceiver = userAccountIds.includes(transaction.toAccountId);

      let type, accountNumber, merchant;

      if (isUserSender && isUserReceiver) {
        type = 'TRANSFER';
        accountNumber = fromAccountNum;
        merchant = `${fromAccountNum} → ${toAccountNum}`;
      } else if (isUserReceiver) {
        type = 'CREDIT';
        accountNumber = toAccountNum;
        merchant = `${fromAccountNum} → ${toAccountNum}`;
      } else {
        type = 'DEBIT';
        accountNumber = fromAccountNum;
        merchant = `${fromAccountNum} → ${toAccountNum}`;
      }

      const transformedTransaction = {
        id: transaction.id,
        transactionReference: transaction.transactionReference || 'N/A',
        description: transaction.description || 'Transfer',
        amount: transaction.amount,
        date: transaction.timestamp,
        type: type,
        category: 'Transfer',
        merchant: merchant,
        accountNumber: accountNumber,
        fromAccountId: transaction.fromAccountId,
        toAccountId: transaction.toAccountId
      };

      setFilteredTransactions([transformedTransaction]);
      setLoading(false);
    } catch (error) {
      console.error('Error searching by reference:', error);
      if (error.response && error.response.status === 404) {
        setSearchError('Transaction not found with this reference ID');
      } else if (error.response && error.response.status === 403) {
        setSearchError('You do not have permission to view this transaction');
      } else {
        setSearchError('Failed to search transaction. Please try again.');
      }
      setFilteredTransactions([]);
      setLoading(false);
    }
  };

  const filterTransactions = () => {
    let filtered = [...transactions];

    // Filter by search term (includes transaction reference)
    if (searchTerm) {
      // Check if search term looks like a transaction reference (starts with TXN-)
      if (searchTerm.toUpperCase().startsWith('TXN-')) {
        searchByReference(searchTerm);
        return;
      }

      filtered = filtered.filter(t =>
        t.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        t.merchant.toLowerCase().includes(searchTerm.toLowerCase()) ||
        t.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (t.transactionReference && t.transactionReference.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    setFilteredTransactions(filtered);
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

  const getCategoryIcon = (category) => {
    const icons = {
      'Shopping': <ShoppingBag className="w-4 h-4" />,
      'Dining': <Utensils className="w-4 h-4" />,
      'Transportation': <Car className="w-4 h-4" />,
      'Bills': <Home className="w-4 h-4" />,
      'Income': <Briefcase className="w-4 h-4" />,
      'Investment': <TrendingUp className="w-4 h-4" />,
      'Healthcare': <Heart className="w-4 h-4" />
    };
    return icons[category] || <MoreHorizontal className="w-4 h-4" />;
  };

  const getCategoryColor = (category) => {
    const colors = {
      'Shopping': 'bg-purple-100 text-purple-600',
      'Dining': 'bg-orange-100 text-orange-600',
      'Transportation': 'bg-blue-100 text-blue-600',
      'Bills': 'bg-red-100 text-red-600',
      'Income': 'bg-green-100 text-green-600',
      'Investment': 'bg-indigo-100 text-indigo-600',
      'Healthcare': 'bg-pink-100 text-pink-600'
    };
    return colors[category] || 'bg-gray-100 text-gray-600';
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
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Transactions</h1>
          <p className="text-gray-600 mt-1">Track and manage your financial activity</p>
        </div>
        <button className="mt-4 sm:mt-0 flex items-center gap-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
          <Download className="w-4 h-4" />
          Export
        </button>
      </div>

      {/* Search */}
      <div className="bg-white rounded-xl border border-gray-200 p-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setSearchError('');
            }}
            className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
            placeholder="Search by description, merchant, or transaction reference (TXN-XXXXXXXX-XXXXXX)..."
          />
        </div>
        {searchError && (
          <p className="mt-1 text-sm text-red-600">{searchError}</p>
        )}
      </div>

      {/* Transactions Table */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Transaction
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Reference ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Category
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Account
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Amount
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredTransactions.length === 0 ? (
                <tr>
                  <td colSpan="6" className="px-6 py-12 text-center">
                    <div className="flex flex-col items-center justify-center">
                      <DollarSign className="w-12 h-12 text-gray-400 mb-4" />
                      <p className="text-gray-500 mb-2">No transactions found</p>
                      <p className="text-sm text-gray-400">
                        {searchTerm
                          ? 'Try adjusting your search'
                          : 'Make a transfer to see your transaction history'}
                      </p>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredTransactions.map((transaction) => (
                  <tr key={transaction.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className={`p-2 rounded-lg ${
                          transaction.type === 'CREDIT' ? 'bg-green-100' : 'bg-red-100'
                        }`}>
                          {transaction.type === 'CREDIT' ? (
                            <ArrowDownRight className="w-4 h-4 text-green-600" />
                          ) : (
                            <ArrowUpRight className="w-4 h-4 text-red-600" />
                          )}
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-900">{transaction.description}</p>
                          <p className="text-xs text-gray-500">{transaction.merchant}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-xs font-mono text-gray-600 bg-gray-100 px-2 py-1 rounded">
                        {transaction.transactionReference || 'N/A'}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium ${getCategoryColor(transaction.category)}`}>
                        {getCategoryIcon(transaction.category)}
                        {transaction.category}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      {formatDate(transaction.date)}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      {transaction.accountNumber}
                    </td>
                    <td className={`px-6 py-4 text-right text-sm font-medium ${
                      transaction.type === 'CREDIT' ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {transaction.type === 'CREDIT' ? '+' : ''}{formatCurrency(Math.abs(transaction.amount))}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Transactions;
