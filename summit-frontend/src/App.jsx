import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './contexts/AuthContext';

// Auth Components
import Login from './components/auth/Login';
import Register from './components/auth/Register';

// Layout Components
import Layout from './components/layout/Layout';

// Page Components
import Dashboard from './components/pages/Dashboard';
import Accounts from './components/pages/Accounts';
import Transfer from './components/pages/Transfer';
import Transactions from './components/pages/Transactions';
import Wealth from './components/pages/Wealth';
import Stocks from './components/pages/Stocks';
import StockTransactions from './components/pages/StockTransactions';
import Admin from './components/pages/Admin';
import Settings from './components/pages/Settings';
import OperationalDashboard from './components/pages/OperationalDashboard';

// Protected Route Component
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="spinner"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

function App() {
  const { isAuthenticated, loading, user } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="spinner"></div>
      </div>
    );
  }

  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/login" element={
        isAuthenticated
          ? <Navigate to={user?.role === 'ADMIN' ? '/admin' : '/dashboard'} replace />
          : <Login />
      } />
      <Route path="/register" element={
        isAuthenticated ? <Navigate to="/dashboard" replace /> : <Register />
      } />

      {/* Protected Routes */}
      <Route path="/" element={
        <ProtectedRoute>
          <Layout />
        </ProtectedRoute>
      }>
        <Route index element={<Navigate to={user?.role === 'ADMIN' ? '/admin' : '/dashboard'} replace />} />
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="accounts" element={<Accounts />} />
        <Route path="transfer" element={<Transfer />} />
        <Route path="transactions" element={<Transactions />} />
        <Route path="wealth" element={<Wealth />} />
        <Route path="stocks" element={<Stocks />} />
        <Route path="settings" element={<Settings />} />
        {user?.role === 'ADMIN' && (
          <>
            <Route path="admin" element={<Admin />} />
            <Route path="admin/stocks" element={<Admin />} />
            <Route path="admin/stock-transactions" element={<StockTransactions />} />
            <Route path="admin/operational" element={<OperationalDashboard />} />
          </>
        )}
      </Route>

      {/* 404 Route */}
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
}

export default App;
