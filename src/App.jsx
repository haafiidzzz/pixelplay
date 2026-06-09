import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { useAuth } from './context/AuthContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Landing from './pages/Landing';
import Home from './pages/Home';
import SignUp from './pages/SignUp';
import SignIn from './pages/SignIn';
import Leaderboard from './pages/Leaderboard';
import Achievements from './pages/Achievements';
import Library from './pages/Library';
import GenrePage from './pages/GenrePage';
import './App.css';

// Protected Route Component
const ProtectedRoute = ({ element, loading, user }) => {
  if (loading) return <div>Loading...</div>;
  return user ? element : <Navigate to="/landing" replace />;
};

// Main App Content
function AppContent() {
  const { user, loading } = useAuth();

  return (
    <div className="app">
      {/* Show Navbar and Footer only for authenticated users */}
      {user && <Navbar />}
      <main>
        <Routes>
          {/* Public Routes */}
          <Route path="/landing" element={<Landing />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/signin" element={<SignIn />} />

          {/* Protected Routes */}
          <Route
            path="/"
            element={<ProtectedRoute element={<Home />} loading={loading} user={user} />}
          />
          <Route
            path="/home"
            element={<ProtectedRoute element={<Home />} loading={loading} user={user} />}
          />
          <Route
            path="/leaderboard"
            element={<ProtectedRoute element={<Leaderboard />} loading={loading} user={user} />}
          />
          <Route
            path="/achievements"
            element={<ProtectedRoute element={<Achievements />} loading={loading} user={user} />}
          />
          <Route
            path="/library"
            element={<ProtectedRoute element={<Library />} loading={loading} user={user} />}
          />
          <Route
            path="/genre/:slug"
            element={<ProtectedRoute element={<GenrePage />} loading={loading} user={user} />}
          />
        </Routes>
      </main>
      {user && <Footer />}
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;