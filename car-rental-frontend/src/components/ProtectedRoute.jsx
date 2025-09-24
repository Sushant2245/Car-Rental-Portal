import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 flex items-center justify-center">
        <div className="text-center text-white">
          <div className="text-8xl mb-6 animate-spin">⚡</div>
          <h2 className="text-3xl font-bold mb-4">Loading...</h2>
          <p className="text-slate-300 text-lg">Please wait while we check your authentication</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    // Store the intended destination
    localStorage.setItem('redirectAfterLogin', location.pathname);
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
};

export default ProtectedRoute;
