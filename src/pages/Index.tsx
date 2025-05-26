
import React, { useEffect, useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import AuthPage from '@/components/AuthPage';
import LoadingScreen from '@/components/LoadingScreen';

const Index: React.FC = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const [showLoading, setShowLoading] = useState(true);

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

    // Force loading screen to show for at least 2 seconds
    const timer = setTimeout(() => {
      setShowLoading(false);
    }, 2000);

    // Redirect authenticated users to chat after loading
    if (user && !loading) {
      setTimeout(() => {
        navigate('/chat');
      }, 2000);
    }

    return () => clearTimeout(timer);
  }, [user, loading, navigate]);

  if (loading || showLoading) {
    return <LoadingScreen />;
  }

  if (user) {
    return <LoadingScreen />;
  }

  return <AuthPage />;
};

export default Index;
