
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


function App() {
  return (
    <AuthProvider>
      {/* Tailwind test bar removed for production UI */}
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/tours" element={<TourListings />} />
          <Route path="/dashboard/tourist" element={
            <ProtectedRoute roles={['Tourist']}>
              <TouristDashboard />
            </ProtectedRoute>
          } />
          <Route path="/dashboard/guide" element={
            <ProtectedRoute roles={['Guide']}>
              <GuideDashboard />
            </ProtectedRoute>
          } />
          <Route path="/dashboard/admin" element={
            <ProtectedRoute roles={['Admin']}>
              <AdminDashboard />
            </ProtectedRoute>
          } />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
