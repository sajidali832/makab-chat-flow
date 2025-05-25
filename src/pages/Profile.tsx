
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '@/components/Layout';
import ProfilePage from '@/components/ProfilePage';

const Profile = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const isAuthenticated = localStorage.getItem('makab-auth');
    if (!isAuthenticated) {
      navigate('/');
    }
  }, [navigate]);

  return (
    <Layout>
      <ProfilePage />
    </Layout>
  );
};

export default Profile;
