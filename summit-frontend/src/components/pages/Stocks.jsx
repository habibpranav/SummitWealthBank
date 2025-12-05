import React, { useState, useEffect } from 'react';
import {
  TrendingUp,
  TrendingDown,
  DollarSign,
  Package,
  Plus,
  Minus,
  ArrowUpRight,
  ArrowDownRight,
  Search,
  X,
  ShoppingCart
} from 'lucide-react';
import axios from 'axios';
import { useAuth } from '../../contexts/AuthContext';

const Stocks = () => {
  const { user } = useAuth();
  const [availableStocks, setAvailableStocks] = useState([]);
  const [myPortfolio, setMyPortfolio] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [accounts, setAccounts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  // Modals
  const [showBuyModal, setShowBuyModal] = useState(false);
  const [showSellModal, setShowSellModal] = useState(false);
  const [selectedStock, setSelectedStock] = useState(null);

  // Forms
  const [buyForm, setBuyForm] = useState({
    accountId: '',
    quantity: ''
  });
  const [sellForm, setSellForm] = useState({
    accountId: '',
    quantity: ''
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [stocksRes, portfolioRes, transactionsRes, accountsRes] = await Promise.all([
        axios.get('/api/stocks/available'),
        axios.get('/api/stocks/portfolio'),
        axios.get('/api/stocks/transactions?limit=10'),
        axios.get('/api/accounts')
      ]);

      setAvailableStocks(stocksRes.data);
      setMyPortfolio(portfolioRes.data);
      setTransactions(transactionsRes.data);
      setAccounts(accountsRes.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching data:', error);
      setLoading(false);
    }
  };

  const handleBuy = async (e) => {
    e.preventDefault();
    try {
      await axios.post('/api/stocks/buy', {
        accountId: parseInt(buyForm.accountId),
        stockSymbol: selectedStock.symbol,
        quantity: parseInt(buyForm.quantity)
      });
      alert('Stock purchased successfully!');
      setShowBuyModal(false);
      setBuyForm({ accountId: '', quantity: '' });
      fetchData();
    } catch (error) {
      console.error('Error buying stock:', error);
      alert(error.response?.data || 'Failed to buy stock');
    }
  };

  const handleSell = async (e) => {
    e.preventDefault();
    try {
      await axios.post('/api/stocks/sell', {
        accountId: parseInt(sellForm.accountId),
        stockSymbol: selectedStock.stockSymbol,
        quantity: parseInt(sellForm.quantity)
      });
      alert('Stock sold successfully!');
      setShowSellModal(false);
      setSellForm({ accountId: '', quantity: '' });
      fetchData();
    } catch (error) {
      console.error('Error selling stock:', error);
      alert(error.response?.data || 'Failed to sell stock');
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
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const calculateTotalValue = () => {
    return myPortfolio.reduce((sum, position) => sum + parseFloat(position.marketValue), 0);
  };

  const calculateTotalProfitLoss = () => {
    return myPortfolio.reduce((sum, position) => sum + parseFloat(position.profitLoss), 0);
  };

  const filteredStocks = availableStocks.filter(stock =>
    stock.symbol.toLowerCase().includes(searchTerm.toLowerCase()) ||
    stock.companyName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Buy Modal
  const BuyModal = () => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl p-6 w-full max-w-md">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-semibold text-gray-900">
            Buy {selectedStock?.symbol}
          </h3>
          <button onClick={() => setShowBuyModal(false)} className="p-1 hover:bg-gray-100 rounded">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="mb-4 p-4 bg-blue-50 rounded-lg">
          <p className="text-sm font-medium text-gray-900">{selectedStock?.companyName}</p>
          <p className="text-2xl font-bold text-blue-600 mt-1">
            {formatCurrency(selectedStock?.currentPrice)}
          </p>
          <p className="text-sm text-gray-600 mt-1">
            {selectedStock?.availableShares?.toLocaleString()} shares available
          </p>
        </div>

        <form onSubmit={handleBuy} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Select Account</label>
            <select
              value={buyForm.accountId}
              onChange={(e) => setBuyForm({...buyForm, accountId: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              required
            >
              <option value="">Choose account...</option>
              {accounts.map(account => (
                <option key={account.id} value={account.id}>
                  {account.type} - {account.accountNumber} ({formatCurrency(account.balance)})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Quantity</label>
            <input
              type="number"
              min="1"
              max={selectedStock?.availableShares}
              value={buyForm.quantity}
              onChange={(e) => setBuyForm({...buyForm, quantity: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              placeholder="Number of shares"
              required
            />
          </div>

          {buyForm.quantity && selectedStock && (
            <div className="p-4 bg-gray-50 rounded-lg">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Total Cost:</span>
                <span className="font-bold text-gray-900">
                  {formatCurrency(buyForm.quantity * selectedStock.currentPrice)}
                </span>
              </div>
            </div>
          )}

          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={() => setShowBuyModal(false)}
              className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Buy Shares
            </button>
          </div>
        </form>
      </div>
    </div>
  );

  // Sell Modal
  const SellModal = () => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl p-6 w-full max-w-md">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-semibold text-gray-900">
            Sell {selectedStock?.stockSymbol}
          </h3>
          <button onClick={() => setShowSellModal(false)} className="p-1 hover:bg-gray-100 rounded">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="mb-4 p-4 bg-green-50 rounded-lg">
          <p className="text-sm font-medium text-gray-900">{selectedStock?.companyName}</p>
          <p className="text-2xl font-bold text-green-600 mt-1">
            {formatCurrency(selectedStock?.currentPrice)}
          </p>
          <p className="text-sm text-gray-600 mt-1">
            You own {selectedStock?.totalShares?.toLocaleString()} shares
          </p>
          <p className="text-sm text-gray-600">
            Avg cost: {formatCurrency(selectedStock?.averageCostBasis)}
          </p>
        </div>

        <form onSubmit={handleSell} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Select Account</label>
            <select
              value={sellForm.accountId}
              onChange={(e) => setSellForm({...sellForm, accountId: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 outline-none"
              required
            >
              <option value="">Choose account...</option>
              {accounts.map(account => (
                <option key={account.id} value={account.id}>
                  {account.type} - {account.accountNumber}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Quantity</label>
            <input
              type="number"
              min="1"
              max={selectedStock?.totalShares}
              value={sellForm.quantity}
              onChange={(e) => setSellForm({...sellForm, quantity: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 outline-none"
              placeholder="Number of shares"
              required
            />
          </div>

          {sellForm.quantity && selectedStock && (
            <div className="p-4 bg-gray-50 rounded-lg space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Proceeds:</span>
                <span className="font-bold text-gray-900">
                  {formatCurrency(sellForm.quantity * selectedStock.currentPrice)}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Estimated P/L:</span>
                <span className={`font-bold ${
                  (sellForm.quantity * (selectedStock.currentPrice - selectedStock.averageCostBasis)) >= 0
                    ? 'text-green-600'
                    : 'text-red-600'
                }`}>
                  {formatCurrency(sellForm.quantity * (selectedStock.currentPrice - selectedStock.averageCostBasis))}
                </span>
              </div>
            </div>
          )}

          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={() => setShowSellModal(false)}
              className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
            >
              Sell Shares
            </button>
          </div>
        </form>
      </div>
    </div>
  );

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
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Stock Trading</h1>
        <p className="text-gray-600 mt-1">Buy and sell stocks from your accounts</p>
      </div>

      {/* Portfolio Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-xl p-6 border border-gray-200">
          <div className="flex items-center justify-between mb-2">
            <DollarSign className="w-5 h-5 text-blue-600" />
          </div>
          <p className="text-sm text-gray-600 mb-1">Portfolio Value</p>
          <p className="text-2xl font-bold text-gray-900">
            {formatCurrency(calculateTotalValue())}
          </p>
        </div>

        <div className="bg-white rounded-xl p-6 border border-gray-200">
          <div className="flex items-center justify-between mb-2">
            {calculateTotalProfitLoss() >= 0 ? (
              <TrendingUp className="w-5 h-5 text-green-600" />
            ) : (
              <TrendingDown className="w-5 h-5 text-red-600" />
            )}
          </div>
          <p className="text-sm text-gray-600 mb-1">Total P/L</p>
          <p className={`text-2xl font-bold ${calculateTotalProfitLoss() >= 0 ? 'text-green-600' : 'text-red-600'}`}>
            {formatCurrency(calculateTotalProfitLoss())}
          </p>
        </div>

        <div className="bg-white rounded-xl p-6 border border-gray-200">
          <div className="flex items-center justify-between mb-2">
            <Package className="w-5 h-5 text-purple-600" />
          </div>
          <p className="text-sm text-gray-600 mb-1">Holdings</p>
          <p className="text-2xl font-bold text-gray-900">{myPortfolio.length}</p>
        </div>
      </div>

      {/* My Holdings */}
      {myPortfolio.length > 0 && (
        <div className="bg-white rounded-xl border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">My Holdings</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Symbol</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Shares</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Avg Cost</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Current Price</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Market Value</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">P/L</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {myPortfolio.map((position) => (
                  <tr key={position.stockSymbol} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div>
                        <p className="font-mono font-bold text-gray-900">{position.stockSymbol}</p>
                        <p className="text-xs text-gray-500">{position.companyName}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">{position.totalShares.toLocaleString()}</td>
                    <td className="px-6 py-4 text-sm text-gray-900">{formatCurrency(position.averageCostBasis)}</td>
                    <td className="px-6 py-4 text-sm font-medium text-gray-900">{formatCurrency(position.currentPrice)}</td>
                    <td className="px-6 py-4 text-sm font-medium text-gray-900">{formatCurrency(position.marketValue)}</td>
                    <td className="px-6 py-4">
                      <div className="flex flex-col">
                        <span className={`text-sm font-medium ${position.profitLoss >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                          {formatCurrency(position.profitLoss)}
                        </span>
                        <span className={`text-xs ${position.profitLossPercent >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                          {position.profitLossPercent.toFixed(2)}%
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <button
                        onClick={() => {
                          setSelectedStock(position);
                          setShowSellModal(true);
                        }}
                        className="flex items-center gap-2 px-3 py-1.5 bg-red-600 text-white rounded-lg hover:bg-red-700 text-sm"
                      >
                        <Minus className="w-3 h-3" />
                        Sell
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Available Stocks */}
      <div className="bg-white rounded-xl border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-900">Available Stocks</h2>
            <div className="relative w-64">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                placeholder="Search stocks..."
              />
            </div>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Symbol</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Company</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Price</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Available</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Sector</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredStocks.map((stock) => (
                <tr key={stock.symbol} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <span className="font-mono font-bold text-gray-900">{stock.symbol}</span>
                  </td>
                  <td className="px-6 py-4">
                    <div>
                      <p className="text-sm font-medium text-gray-900">{stock.companyName}</p>
                      {stock.description && (
                        <p className="text-xs text-gray-500 line-clamp-1">{stock.description}</p>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm font-medium text-gray-900">
                    {formatCurrency(stock.currentPrice)}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900">
                    {stock.availableShares.toLocaleString()}
                  </td>
                  <td className="px-6 py-4">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                      {stock.sector || 'N/A'}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <button
                      onClick={() => {
                        setSelectedStock(stock);
                        setShowBuyModal(true);
                      }}
                      className="flex items-center gap-2 px-3 py-1.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm"
                      disabled={stock.availableShares === 0}
                    >
                      <Plus className="w-3 h-3" />
                      Buy
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Recent Transactions */}
      {transactions.length > 0 && (
        <div className="bg-white rounded-xl border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">Recent Transactions</h2>
          </div>
          <div className="divide-y divide-gray-200">
            {transactions.map((txn) => (
              <div key={txn.id} className="p-4 hover:bg-gray-50 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className={`p-2 rounded-lg ${txn.type === 'BUY' ? 'bg-blue-100' : 'bg-red-100'}`}>
                    {txn.type === 'BUY' ? (
                      <ArrowDownRight className="w-4 h-4 text-blue-600" />
                    ) : (
                      <ArrowUpRight className="w-4 h-4 text-red-600" />
                    )}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      {txn.type} {txn.quantity} shares of {txn.stockSymbol}
                    </p>
                    <p className="text-xs text-gray-500">
                      {txn.companyName} • {formatDate(txn.timestamp)}
                    </p>
                    <p className="text-xs text-gray-500 font-mono mt-0.5">{txn.transactionReference}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium text-gray-900">
                    {formatCurrency(txn.totalAmount)}
                  </p>
                  {txn.profitLoss && (
                    <p className={`text-xs font-medium ${txn.profitLoss >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                      P/L: {formatCurrency(txn.profitLoss)}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Modals */}
      {showBuyModal && <BuyModal />}
      {showSellModal && <SellModal />}
    </div>
  );
};

export default Stocks;
