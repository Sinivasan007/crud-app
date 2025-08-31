import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Link, Navigate, Outlet, useNavigate } from 'react-router-dom';

import Login from './login';
import Registration from './Registration';
import Home from './Home';
import Dashboard from './dashboard';


const ProtectedRoute = ({ isAuth }) => {
  if (!isAuth) return <Navigate to="/" replace />;
  return <Outlet />;
};

const DashboardButton = () => {
  const navigate = useNavigate();

  const goToDashboard = () => {
    navigate('/dashboard');
  };

  return (
    <button onClick={goToDashboard} className="dashboard-button">
      Dashboard
    </button>
  );
};

const App = () => {
  const [isAuth, setIsAuth] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    setIsAuth(!!token);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userId');
    setIsAuth(false);
  };


  const handleLogin = () => {
    setIsAuth(true);
  };

  return (
    <Router>
      <div className="app-container">
        <header className="app-header">
          {isAuth ? (
            <div className="header-inner">
              <DashboardButton />
            </div>
          ) : (
            <nav className="nav-links">
              <Link to="/">Home</Link> | <Link to="/login">Login</Link> | <Link to="/register">Register</Link>
            </nav>
          )}
        </header>

        <main className="main-container">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login onLogin={handleLogin} />} />
            <Route path="/register" element={<Registration />} />

            {/* Protected Routes */}
            <Route element={<ProtectedRoute isAuth={isAuth} />}>
              <Route path="/dashboard" element={<Dashboard onLogout={handleLogout} />} />
            </Route>

            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
};

export default App;
