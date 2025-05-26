
import React from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import Layout from '@/components/Layout';
import ChatPage from '@/components/ChatPage';

const Chat: React.FC = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  // Only redirect if we're certain there's no user and not loading
  React.useEffect(() => {
    if (!loading && !user) {
      navigate('/');
    }
  }, [user, loading, navigate]);

  // Show loading only briefly, then show chat regardless
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center">
        <div className="text-gray-600">Loading...</div>
      </div>
    );
  }

  // Always show the chat if we reach this point
  return (
    <Layout>
      <ChatPage />
    </Layout>
  );
};

export default Chat;
