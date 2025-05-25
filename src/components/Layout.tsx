
import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { MessageCircle, User } from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    // Check if user is authenticated
    const authStatus = localStorage.getItem('makab-auth');
    setIsAuthenticated(!!authStatus);
    
    // Redirect to chat if authenticated and on login page
    if (authStatus && location.pathname === '/') {
      navigate('/chat');
    }
  }, [location.pathname, navigate]);

  // Don't show layout for auth pages
  if (!isAuthenticated && location.pathname === '/') {
    return <>{children}</>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex flex-col">
      <main className="flex-1 pb-16">
        {children}
      </main>
      
      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-4 py-2 shadow-lg">
        <div className="flex justify-around max-w-md mx-auto">
          <button
            onClick={() => navigate('/chat')}
            className={`flex flex-col items-center py-2 px-4 rounded-lg transition-colors ${
              location.pathname === '/chat'
                ? 'text-blue-600 bg-blue-50'
                : 'text-gray-600 hover:text-blue-600'
            }`}
          >
            <MessageCircle size={24} />
            <span className="text-xs mt-1">Chat</span>
          </button>
          
          <button
            onClick={() => navigate('/profile')}
            className={`flex flex-col items-center py-2 px-4 rounded-lg transition-colors ${
              location.pathname === '/profile'
                ? 'text-blue-600 bg-blue-50'
                : 'text-gray-600 hover:text-blue-600'
            }`}
          >
            <User size={24} />
            <span className="text-xs mt-1">Profile</span>
          </button>
        </div>
      </nav>
      
      {/* Footer */}
      <div className="text-center text-xs text-gray-400 py-2 bg-white border-t">
        Makab — Built & Developed by Sajid
      </div>
    </div>
  );
};

export default Layout;
