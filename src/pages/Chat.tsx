
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '@/components/Layout';
import ChatPage from '@/components/ChatPage';

const Chat = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const isAuthenticated = localStorage.getItem('makab-auth');
    if (!isAuthenticated) {
      navigate('/');
    }
  }, [navigate]);

  return (
    <Layout>
      <ChatPage />
    </Layout>
  );
};

export default Chat;
