import NotFound from './pages/NotFound';

import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import TourListings from './pages/TourListings';
import TouristDashboard from './pages/TouristDashboard';
import GuideDashboard from './pages/GuideDashboard';
import AdminDashboard from './pages/AdminDashboard';
import ProtectedRoute from './components/ProtectedRoute';
import Profile from './pages/Profile';
import Footer from './components/Footer';
import Breadcrumbs from './components/Breadcrumbs';


  return (
    <Router>
      <div className="min-h-screen flex flex-col">
        <Breadcrumbs />
        <div className="flex-1">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/tours" element={<TourListings />} />
            <Route path="/dashboard/tourist" element={
              <ProtectedRoute roles={["Tourist"]}>
                <TouristDashboard />
              </ProtectedRoute>
            } />
            <Route path="/dashboard/guide" element={
              <ProtectedRoute roles={["Guide"]}>
                <GuideDashboard />
              </ProtectedRoute>
            } />
            <Route path="/dashboard/admin" element={
              <ProtectedRoute roles={["Admin"]}>
                <AdminDashboard />
              </ProtectedRoute>
            } />
            <Route path="/profile" element={<Profile />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </div>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
