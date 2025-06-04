import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Provider } from 'react-redux';
import { Toaster } from 'react-hot-toast';
import { store } from './store';
import { AuthProvider } from './contexts/AuthContext';
import { MentalHealthProvider } from './contexts/MentalHealthContext';
import NotificationSystem, { setNotifyInstance } from './components/common/NotificationSystem';
import Layout from './layouts/main/Layout';
import Home from './pages/Home';
import Dashboard from './pages/Dashboard';
import Resources from './pages/Resources';
import Community from './pages/Community';
import MindGarden from './pages/MindGarden';
import Games from './pages/Games';
import Login from './components/auth/Login';
import Register from './components/auth/Register';
import PrivateRoute from './components/auth/PrivateRoute';

function App() {
  // Initialize notification system
  useEffect(() => {
    let notifications: { id: string; type: 'success' | 'error' | 'info'; message: string; }[] = [];
    setNotifyInstance((message, type) => {
      const newNotification = {
        id: Date.now().toString(),
        type,
        message
      };
      notifications = [...notifications, newNotification];
      // NotificationSystem component will handle the display
    });
  }, []);

  return (
    <Provider store={store}>
      <Router>
        <AuthProvider>
          <MentalHealthProvider>
            <Toaster
              position="top-right"
              toastOptions={{
                duration: 3000,
                style: {
                  background: '#fff',
                  color: '#363636',
                  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
                },
                success: {
                  style: {
                    background: '#ecfdf5',
                    border: '1px solid #059669',
                  },
                },
                error: {
                  style: {
                    background: '#fef2f2',
                    border: '1px solid #dc2626',
                  },
                },
              }}
            />
            <NotificationSystem position="top-right" />
            <div className="min-h-screen bg-gradient-to-br from-teal-50 via-blue-50 to-purple-50">
              <Routes>
                <Route path="/" element={<Layout />}>
                  <Route index element={<Login />} />
                  <Route path="/login" element={<Login />} />
                  <Route path="/register" element={<Register />} />
                  <Route path="/home" element={<Home />} />
                  <Route
                    path="/dashboard"
                    element={
                      <PrivateRoute>
                        <Dashboard />
                      </PrivateRoute>
                    }
                  />
                  <Route
                    path="/resources"
                    element={
                      <PrivateRoute>
                        <Resources />
                      </PrivateRoute>
                    }
                  />
                  <Route
                    path="/community"
                    element={
                      <PrivateRoute>
                        <Community />
                      </PrivateRoute>
                    }
                  />                  <Route
                    path="/mind-garden"
                    element={
                      <PrivateRoute>
                        <MindGarden />
                      </PrivateRoute>
                    }
                  />
                  <Route
                    path="/games"
                    element={
                      <PrivateRoute>
                        <Games />
                      </PrivateRoute>
                    }
                  />
                </Route>
              </Routes>
            </div>
          </MentalHealthProvider>
        </AuthProvider>
      </Router>
    </Provider>
  );
}

export default App;