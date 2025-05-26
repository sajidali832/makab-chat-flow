
import React, { useEffect, useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import Layout from '@/components/Layout';
import ChatPage from '@/components/ChatPage';
import LoadingScreen from '@/components/LoadingScreen';

const Chat: React.FC = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const [showLoading, setShowLoading] = useState(true);

  useEffect(() => {
    if (!loading && !user) {
      navigate('/');
    }

    // Force loading screen for 1.5 seconds
    const timer = setTimeout(() => {
      setShowLoading(false);
    }, 1500);

    return () => clearTimeout(timer);
  }, [user, loading, navigate]);

  if (loading || showLoading) {
    return <LoadingScreen />;
  }

  if (!user) {
    return <LoadingScreen />;
  }

  return (
    <Layout>
      <ChatPage />
    </Layout>
  );
};

export default Chat;
