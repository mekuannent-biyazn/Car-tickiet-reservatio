import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useSelector } from 'react-redux';

import Navbar      from './components/Navbar';
import Footer      from './components/Footer';
import Home        from './pages/Home';
import Login       from './pages/Login';
import Register    from './pages/Register';
import SearchResults from './pages/SearchResults';
import TripDetail  from './pages/TripDetail';
import BookingConfirmation from './pages/BookingConfirmation';
import MyBookings  from './pages/MyBookings';

// Driver pages
import DriverDashboard  from './pages/driver/Dashboard';
import RegisterVehicle  from './pages/driver/RegisterVehicle';
import CreateTrip       from './pages/driver/CreateTrip';

// Controller pages
import ControllerDashboard from './pages/controller/Dashboard';
import ManageRoutes        from './pages/controller/ManageRoutes';
import ManageTrips         from './pages/controller/ManageTrips';
import ManageDrivers       from './pages/controller/ManageDrivers';
import ManageVehicles      from './pages/controller/ManageVehicles';

const ProtectedRoute = ({ children, roles }) => {
  const { user } = useSelector((state) => state.auth);
  if (!user) return <Navigate to="/login" replace />;
  if (roles && !roles.includes(user.role)) return <Navigate to="/" replace />;
  return children;
};

function App() {
  return (
    <Router>
      <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
        <Navbar />
        <main style={{ flex: 1 }}>
          <Routes>
            {/* Public */}
            <Route path="/"         element={<Home />} />
            <Route path="/login"    element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/search"   element={<SearchResults />} />
            <Route path="/trips/:id" element={<TripDetail />} />

            {/* Passenger */}
            <Route path="/booking/confirm" element={
              <ProtectedRoute roles={['passenger']}>
                <BookingConfirmation />
              </ProtectedRoute>
            } />
            <Route path="/my-bookings" element={
              <ProtectedRoute roles={['passenger']}>
                <MyBookings />
              </ProtectedRoute>
            } />

            {/* Driver */}
            <Route path="/driver" element={
              <ProtectedRoute roles={['driver']}>
                <DriverDashboard />
              </ProtectedRoute>
            } />
            <Route path="/driver/vehicles/new" element={
              <ProtectedRoute roles={['driver']}>
                <RegisterVehicle />
              </ProtectedRoute>
            } />
            <Route path="/driver/trips/new" element={
              <ProtectedRoute roles={['driver']}>
                <CreateTrip />
              </ProtectedRoute>
            } />

            {/* Controller */}
            <Route path="/controller" element={
              <ProtectedRoute roles={['controller']}>
                <ControllerDashboard />
              </ProtectedRoute>
            } />
            <Route path="/controller/routes" element={
              <ProtectedRoute roles={['controller']}>
                <ManageRoutes />
              </ProtectedRoute>
            } />
            <Route path="/controller/trips" element={
              <ProtectedRoute roles={['controller']}>
                <ManageTrips />
              </ProtectedRoute>
            } />
            <Route path="/controller/drivers" element={
              <ProtectedRoute roles={['controller']}>
                <ManageDrivers />
              </ProtectedRoute>
            } />
            <Route path="/controller/vehicles" element={
              <ProtectedRoute roles={['controller']}>
                <ManageVehicles />
              </ProtectedRoute>
            } />

            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
        <Footer />
        <ToastContainer position="top-right" autoClose={3000} />
      </div>
    </Router>
  );
}

export default App;
