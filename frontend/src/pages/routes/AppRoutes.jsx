import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuthContext } from '../../context/AuthContext';

import MainLayout    from '../../layouts/MainLayout';
import AuthLayout    from '../../layouts/AuthLayout';
import AdminLayout   from '../../layouts/AdminLayout';

import Landing        from '../Landing/Landing';
import Login          from '../Auth/Login';
import Signup         from '../Auth/Signup';
import ForgotPassword from '../Auth/ForgotPassword';
import VerifyOTP      from '../Auth/VerifyOTP';
import ResetPassword  from '../Auth/ResetPassword';
import Products       from '../Products/Products';
import ProductDetails from '../Products/ProductDetails';
import Dashboard      from '../Dashboard/Dashboard';
import Checkout       from '../Checkout/Checkout';
import Profile        from '../Profile/Profile';
import Notifications  from '../Notifications/Notifications';
import QRGeneratorPage from '../QRGenerator/QRGenerator';

import AdminDashboard  from '../Admin/AdminDashboard';
import ManageProducts  from '../Admin/ManageProducts';
import ManageOrders    from '../Admin/ManageOrders';
import ManageUsers     from '../Admin/ManageUsers';
import ManagePayments  from '../Admin/ManagePayments';

const PrivateRoute = ({ children }) => {
  const { isAuthenticated } = useAuthContext();
  return isAuthenticated ? children : <Navigate to="/login" replace />;
};

const AdminRoute = ({ children }) => {
  const { isAuthenticated, isAdmin } = useAuthContext();
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  if (!isAdmin) return <Navigate to="/" replace />;
  return children;
};

const GuestRoute = ({ children }) => {
  const { isAuthenticated, isAdmin } = useAuthContext();
  if (!isAuthenticated) return children;
  return <Navigate to={isAdmin ? '/admin' : '/'} replace />;
};

const AppRoutes = () => (
  <Routes>
    {/* Public */}
    <Route path="/" element={<MainLayout><Landing /></MainLayout>} />
    <Route path="/products" element={<MainLayout><Products /></MainLayout>} />
    <Route path="/products/:id" element={<MainLayout><ProductDetails /></MainLayout>} />

    {/* Auth */}
    <Route path="/login" element={<GuestRoute><AuthLayout><Login /></AuthLayout></GuestRoute>} />
    <Route path="/signup" element={<GuestRoute><AuthLayout><Signup /></AuthLayout></GuestRoute>} />
    <Route path="/forgot-password" element={<GuestRoute><AuthLayout><ForgotPassword /></AuthLayout></GuestRoute>} />
    <Route path="/verify-otp" element={<GuestRoute><AuthLayout><VerifyOTP /></AuthLayout></GuestRoute>} />
    <Route path="/reset-password" element={<GuestRoute><AuthLayout><ResetPassword /></AuthLayout></GuestRoute>} />

    {/* Protected */}
    <Route path="/dashboard" element={<PrivateRoute><MainLayout><Dashboard /></MainLayout></PrivateRoute>} />
    <Route path="/checkout" element={<PrivateRoute><MainLayout><Checkout /></MainLayout></PrivateRoute>} />
    <Route path="/profile" element={<PrivateRoute><MainLayout><Profile /></MainLayout></PrivateRoute>} />
    <Route path="/notifications" element={<PrivateRoute><MainLayout><Notifications /></MainLayout></PrivateRoute>} />
    <Route path="/qr-generator" element={<PrivateRoute><MainLayout><QRGeneratorPage /></MainLayout></PrivateRoute>} />

    {/* Admin */}
    <Route path="/admin" element={<AdminRoute><AdminLayout><AdminDashboard /></AdminLayout></AdminRoute>} />
    <Route path="/admin/products" element={<AdminRoute><AdminLayout><ManageProducts /></AdminLayout></AdminRoute>} />
    <Route path="/admin/orders" element={<AdminRoute><AdminLayout><ManageOrders /></AdminLayout></AdminRoute>} />
    <Route path="/admin/users" element={<AdminRoute><AdminLayout><ManageUsers /></AdminLayout></AdminRoute>} />
    <Route path="/admin/payments" element={<AdminRoute><AdminLayout><ManagePayments /></AdminLayout></AdminRoute>} />

    {/* 404 */}
    <Route path="*" element={<Navigate to="/" replace />} />
  </Routes>
);

export default AppRoutes;
