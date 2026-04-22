import { Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Navbar from './components/Navbar';
import WaveBackground from './components/WaveBackground';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import DailyLog from './pages/DailyLog';
import Analytics from './pages/Analytics';
import Medications from './pages/Medications';
import DoctorVisits from './pages/DoctorVisits';
import HealthReport from './pages/HealthReport';

function ProtectedRoute() {
  const { user, loading } = useAuth();
  if (loading) return <div className="loading-screen">Loading…</div>;
  if (!user) return <Navigate to="/login" replace />;
  return <Outlet />;
}

function AppLayout() {
  return (
    <div className="app">
      <WaveBackground />
      <div
        style={{ position: 'relative', zIndex: 1, display: 'flex', width: '100%', height: '100%' }}
      >
        <Navbar />
        <main className="main">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        <Route element={<ProtectedRoute />}>
          <Route element={<AppLayout />}>
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/log" element={<DailyLog />} />
            <Route path="/analytics" element={<Analytics />} />
            <Route path="/medications" element={<Medications />} />
            <Route path="/visits" element={<DoctorVisits />} />
            <Route path="/report" element={<HealthReport />} />
          </Route>
        </Route>
      </Routes>
    </AuthProvider>
  );
}
