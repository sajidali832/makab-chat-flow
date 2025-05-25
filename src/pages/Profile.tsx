
import { useAuth } from '@/hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import Layout from '@/components/Layout';
import ProfilePage from '@/components/ProfilePage';
import LoadingScreen from '@/components/LoadingScreen';

const Profile = () => {
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
      <ProfilePage />
    </Layout>
  );
};

export default Profile;
