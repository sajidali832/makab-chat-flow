
import React, { useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import AuthPage from '@/components/AuthPage';

const Index: React.FC = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    // Register service worker for PWA
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('/sw.js')
        .then((registration) => {
          console.log('Service Worker registered:', registration);
        })
        .catch((error) => {
          console.log('Service Worker registration failed:', error);
        });
    }

    // Redirect authenticated users to chat immediately
    if (user && !loading) {
      navigate('/chat');
    }
  }, [user, loading, navigate]);

  if (loading) {
    return <div className="min-h-screen bg-gradient-to-br from-blue-600 via-purple-600 to-orange-500 flex items-center justify-center">
      <div className="text-white">Loading...</div>
    </div>;
  }

  if (user) {
    return null; // Will redirect to chat
  }

  return <AuthPage />;
};

export default Index;
