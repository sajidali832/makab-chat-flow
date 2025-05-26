
import React, { useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import AuthPage from '@/components/AuthPage';

const Index: React.FC = () => {
  const { user } = useAuth();
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

    // Redirect authenticated users to chat immediately - no loading check
    if (user) {
      navigate('/chat');
    }
  }, [user, navigate]);

  if (user) {
    return null; // Will redirect to chat
  }

  return <AuthPage />;
};

export default Index;
