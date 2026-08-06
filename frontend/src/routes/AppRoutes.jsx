import React from 'react';
import { Routes, Route } from 'react-router-dom';
import MainLayout from '../components/layout/MainLayout';
import ProtectedRoute from '../components/ProtectedRoute';
import Home from '../pages/Home';
import Chat from '../pages/Chat';
import DocumentsPage from '../pages/DocumentsPage';
import ProfilePage from '../pages/ProfilePage';
import Settings from '../pages/Settings';
import Login from '../pages/Login';
import Signup from '../pages/Signup';
import NotFound from '../pages/NotFound';

export const AppRoutes = () => {
  return (
    <Routes>
      {/* Public Authentication Routes */}
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />

      {/* Protected Application Routes */}
      <Route element={<ProtectedRoute />}>
        <Route
          path="/*"
          element={
            <MainLayout>
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/chat" element={<Home />} />
                <Route path="/chat/:chatId" element={<Chat />} />
                <Route path="/documents" element={<DocumentsPage />} />
                <Route path="/profile" element={<ProfilePage />} />
                <Route path="/settings" element={<Settings />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </MainLayout>
          }
        />
      </Route>
    </Routes>
  );
};

export default AppRoutes;
