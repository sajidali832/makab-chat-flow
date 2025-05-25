
import { useAuth } from '@/hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import Layout from '@/components/Layout';
import ChatPage from '@/components/ChatPage';
import LoadingScreen from '@/components/LoadingScreen';

const Chat = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && !user) {
      navigate('/');
    }
  }, [user, loading, navigate]);

  if (loading) {
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
