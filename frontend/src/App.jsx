import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import Footer from './components/Footer';

// Public Pages
import Landing from './pages/Landing';
import Login from './pages/Login';
import Register from './pages/Register';

// Farmer Pages
import FarmerDashboard from './pages/farmer/FarmerDashboard';
import BookSlot from './pages/farmer/BookSlot';
import BookingConfirmation from './pages/farmer/BookingConfirmation';
import MyBookings from './pages/farmer/MyBookings';
import QueueStatus from './pages/farmer/QueueStatus';
import ProcurementStatus from './pages/farmer/ProcurementStatus';
import PaymentStatus from './pages/farmer/PaymentStatus';
import Notifications from './pages/farmer/Notifications';
import Profile from './pages/farmer/Profile';

// Operator Pages
import OperatorDashboard from './pages/operator/OperatorDashboard';
import LiveQueue from './pages/operator/LiveQueue';
import TodayBookings from './pages/operator/TodayBookings';
import PaymentManagement from './pages/operator/PaymentManagement';

// Admin Pages
import AdminDashboard from './pages/admin/AdminDashboard';
import Analytics from './pages/admin/Analytics';
import CentresManager from './pages/admin/CentresManager';
import FarmersManager from './pages/admin/FarmersManager';
import OperatorsManager from './pages/admin/OperatorsManager';
import CropsManager from './pages/admin/CropsManager';
import SlotsManager from './pages/admin/SlotsManager';
import BookingsManager from './pages/admin/BookingsManager';
import ProcurementManager from './pages/admin/ProcurementManager';
import PaymentsManager from './pages/admin/PaymentsManager';

// Role-based Protected Route Wrapper
const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user, loading } = useAuth();
  if (loading) return <div className="p-8 text-center text-slate-500">Authenticating...</div>;
  if (!user) return <Navigate to="/login" replace />;
  if (allowedRoles && !allowedRoles.includes(user.role)) {
    if (user.role === 'FARMER') return <Navigate to="/farmer/dashboard" replace />;
    if (user.role === 'OPERATOR') return <Navigate to="/operator/dashboard" replace />;
    if (user.role === 'ADMIN') return <Navigate to="/admin/dashboard" replace />;
    return <Navigate to="/" replace />;
  }
  return (
    <div className="flex min-h-[calc(100vh-4rem)]">
      <Sidebar />
      <main className="flex-1 p-6 bg-slate-50 overflow-y-auto">{children}</main>
    </div>
  );
};

const AppRoutes = () => {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Navbar />
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Farmer Routes */}
        <Route path="/farmer/dashboard" element={<ProtectedRoute allowedRoles={['FARMER']}><FarmerDashboard /></ProtectedRoute>} />
        <Route path="/farmer/book-slot" element={<ProtectedRoute allowedRoles={['FARMER']}><BookSlot /></ProtectedRoute>} />
        <Route path="/farmer/booking-confirmation/:bookingId" element={<ProtectedRoute allowedRoles={['FARMER']}><BookingConfirmation /></ProtectedRoute>} />
        <Route path="/farmer/bookings" element={<ProtectedRoute allowedRoles={['FARMER']}><MyBookings /></ProtectedRoute>} />
        <Route path="/farmer/queue" element={<ProtectedRoute allowedRoles={['FARMER']}><QueueStatus /></ProtectedRoute>} />
        <Route path="/farmer/procurement" element={<ProtectedRoute allowedRoles={['FARMER']}><ProcurementStatus /></ProtectedRoute>} />
        <Route path="/farmer/payments" element={<ProtectedRoute allowedRoles={['FARMER']}><PaymentStatus /></ProtectedRoute>} />
        <Route path="/farmer/notifications" element={<ProtectedRoute allowedRoles={['FARMER']}><Notifications /></ProtectedRoute>} />
        <Route path="/farmer/profile" element={<ProtectedRoute allowedRoles={['FARMER']}><Profile /></ProtectedRoute>} />

        {/* Operator Routes */}
        <Route path="/operator/dashboard" element={<ProtectedRoute allowedRoles={['OPERATOR', 'ADMIN']}><OperatorDashboard /></ProtectedRoute>} />
        <Route path="/operator/queue" element={<ProtectedRoute allowedRoles={['OPERATOR', 'ADMIN']}><LiveQueue /></ProtectedRoute>} />
        <Route path="/operator/bookings" element={<ProtectedRoute allowedRoles={['OPERATOR', 'ADMIN']}><TodayBookings /></ProtectedRoute>} />
        <Route path="/operator/procurement" element={<ProtectedRoute allowedRoles={['OPERATOR', 'ADMIN']}><LiveQueue /></ProtectedRoute>} />
        <Route path="/operator/payments" element={<ProtectedRoute allowedRoles={['OPERATOR', 'ADMIN']}><PaymentManagement /></ProtectedRoute>} />

        {/* Admin Routes */}
        <Route path="/admin/dashboard" element={<ProtectedRoute allowedRoles={['ADMIN']}><AdminDashboard /></ProtectedRoute>} />
        <Route path="/admin/analytics" element={<ProtectedRoute allowedRoles={['ADMIN']}><Analytics /></ProtectedRoute>} />
        <Route path="/admin/centres" element={<ProtectedRoute allowedRoles={['ADMIN']}><CentresManager /></ProtectedRoute>} />
        <Route path="/admin/farmers" element={<ProtectedRoute allowedRoles={['ADMIN']}><FarmersManager /></ProtectedRoute>} />
        <Route path="/admin/operators" element={<ProtectedRoute allowedRoles={['ADMIN']}><OperatorsManager /></ProtectedRoute>} />
        <Route path="/admin/crops" element={<ProtectedRoute allowedRoles={['ADMIN']}><CropsManager /></ProtectedRoute>} />
        <Route path="/admin/slots" element={<ProtectedRoute allowedRoles={['ADMIN']}><SlotsManager /></ProtectedRoute>} />
        <Route path="/admin/bookings" element={<ProtectedRoute allowedRoles={['ADMIN']}><BookingsManager /></ProtectedRoute>} />
        <Route path="/admin/procurement" element={<ProtectedRoute allowedRoles={['ADMIN']}><ProcurementManager /></ProtectedRoute>} />
        <Route path="/admin/payments" element={<ProtectedRoute allowedRoles={['ADMIN']}><PaymentsManager /></ProtectedRoute>} />

        {/* Catch-all Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      <Footer />
    </div>
  );
};

const App = () => {
  return (
    <Router>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </Router>
  );
};

export default App;
