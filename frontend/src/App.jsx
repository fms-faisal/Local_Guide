
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
          <Route path="/dashboard/tourist" element={
          <Route path="/dashboard/tourist" element={
            <ProtectedRoute roles={['Tourist']}>
              <TouristDashboard />
            </ProtectedRoute>
          <Route path="/dashboard/guide" element={
          } />
          <Route path="/dashboard/guide" element={
            <ProtectedRoute roles={['Guide']}>
              <GuideDashboard />
          <Route path="/dashboard/admin" element={
            </ProtectedRoute>
          } />
          <Route path="/dashboard/admin" element={
            <ProtectedRoute roles={['Admin']}>
          <Route path="/profile" element={<Profile />} />
              <AdminDashboard />
            </ProtectedRoute>
          } />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
