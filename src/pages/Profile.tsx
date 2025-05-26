
import { useAuth } from '@/hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import Layout from '@/components/Layout';
import ProfilePage from '@/components/ProfilePage';
import LoadingScreen from '@/components/LoadingScreen';

const Profile = () => {
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
      <ProfilePage />
    </Layout>
  );
};

export default Profile;
