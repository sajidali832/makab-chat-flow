
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AuthPage from '@/components/AuthPage';

const Index = () => {
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

    // Check if user is already authenticated
    const isAuthenticated = localStorage.getItem('makab-auth');
    if (isAuthenticated) {
      navigate('/chat');
    }
  }, [navigate]);

  return <AuthPage />;
};

export default Index;
