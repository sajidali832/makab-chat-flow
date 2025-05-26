
import React from 'react';
import Layout from '@/components/Layout';
import ChatPage from '@/components/ChatPage';

const Chat: React.FC = () => {
  // Remove all loading and auth checks - just show the chat
  return (
    <Layout>
      <ChatPage />
    </Layout>
  );
};

export default Chat;
