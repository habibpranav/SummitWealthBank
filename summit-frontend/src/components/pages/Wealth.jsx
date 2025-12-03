import React, { useState, useEffect } from 'react';
import { 
  TrendingUp,
  TrendingDown,
  PieChart,
  BarChart3,
  DollarSign,
  Briefcase,
  Shield,
  Target,
  Plus,
  ArrowUpRight,
  ArrowDownRight,
  Info
} from 'lucide-react';
import { LineChart, Line, AreaChart, Area, PieChart as RePieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import axios from 'axios';

const Wealth = () => {
  const [totalWealth, setTotalWealth] = useState({
    checkingBalance: 0,
    savingsBalance: 0,
    stockPortfolioValue: 0,
    totalWealth: 0
  });
  const [stockHoldings, setStockHoldings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTotalWealth();
    fetchStockHoldings();
  }, []);

  const fetchTotalWealth = async () => {
    try {
      const response = await axios.get('/api/wealth/total');
      setTotalWealth(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching total wealth:', error);
      setLoading(false);
    }
  };

  const fetchStockHoldings = async () => {
    try {
      const response = await axios.get('/api/stocks/portfolio');
      setStockHoldings(response.data || []);
    } catch (error) {
      console.error('Error fetching stock holdings:', error);
      setStockHoldings([]);
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 2
    }).format(amount);
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Total Wealth</h1>
        <p className="text-gray-600 mt-1">Your complete financial overview</p>
      </div>

      {/* Total Wealth Summary */}
      <div className="bg-gradient-to-br from-blue-600 to-blue-700 rounded-xl p-6 text-white">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold">Total Wealth</h2>
          <Briefcase className="w-6 h-6" />
        </div>
        <p className="text-4xl font-bold mb-6">{formatCurrency(totalWealth.totalWealth)}</p>
        <div className="grid grid-cols-3 gap-4">
          <div className="bg-white bg-opacity-20 rounded-lg p-3">
            <p className="text-xs text-blue-100 mb-1">Checking</p>
            <p className="text-lg font-semibold">{formatCurrency(totalWealth.checkingBalance)}</p>
          </div>
          <div className="bg-white bg-opacity-20 rounded-lg p-3">
            <p className="text-xs text-blue-100 mb-1">Savings</p>
            <p className="text-lg font-semibold">{formatCurrency(totalWealth.savingsBalance)}</p>
          </div>
          <div className="bg-white bg-opacity-20 rounded-lg p-3">
            <p className="text-xs text-blue-100 mb-1">Stocks</p>
            <p className="text-lg font-semibold">{formatCurrency(totalWealth.stockPortfolioValue)}</p>
          </div>
        </div>
      </div>

      {/* Stock Holdings */}
      {stockHoldings.length > 0 ? (
        <div className="bg-white rounded-xl border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">Stock Holdings</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Symbol</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Company</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Shares</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Avg Cost</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Current Price</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Market Value</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">P/L</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {stockHoldings.map((holding) => (
                  <tr key={holding.stockSymbol} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <span className="font-mono font-bold text-gray-900">{holding.stockSymbol}</span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">{holding.companyName}</td>
                    <td className="px-6 py-4 text-sm text-gray-900">{holding.totalShares.toLocaleString()}</td>
                    <td className="px-6 py-4 text-sm text-gray-900">{formatCurrency(holding.averageCostBasis)}</td>
                    <td className="px-6 py-4 text-sm font-medium text-gray-900">{formatCurrency(holding.currentPrice)}</td>
                    <td className="px-6 py-4 text-sm font-medium text-gray-900">{formatCurrency(holding.marketValue)}</td>
                    <td className="px-6 py-4">
                      <div className="flex flex-col">
                        <span className={`text-sm font-medium ${holding.profitLoss >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                          {holding.profitLoss >= 0 ? '+' : ''}{formatCurrency(holding.profitLoss)}
                        </span>
                        <span className={`text-xs ${holding.profitLossPercent >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                          ({holding.profitLossPercent >= 0 ? '+' : ''}{holding.profitLossPercent.toFixed(2)}%)
                        </span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
          <Briefcase className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-500 mb-2">No stock holdings yet</p>
          <p className="text-sm text-gray-400">Visit the Stocks page to start trading</p>
        </div>
      )}
    </div>
  );
};

export default Wealth;
