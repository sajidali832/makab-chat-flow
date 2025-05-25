
import { ReactNode } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { MessageCircle, User } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';

interface LayoutProps {
  children: ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();

  // Don't show layout for non-authenticated users
  if (!user) {
    return <>{children}</>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex flex-col">
      <main className="flex-1 pb-16">
        {children}
      </main>
      
      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white/90 backdrop-blur-sm border-t border-gray-200 px-4 py-2 shadow-lg">
        <div className="flex justify-around max-w-md mx-auto">
          <button
            onClick={() => navigate('/chat')}
            className={`flex flex-col items-center py-2 px-4 rounded-lg transition-all duration-200 ${
              location.pathname === '/chat'
                ? 'text-blue-600 bg-blue-50 scale-105'
                : 'text-gray-600 hover:text-blue-600 hover:bg-blue-50'
            }`}
          >
            <MessageCircle size={24} />
            <span className="text-xs mt-1 font-medium">Chat 💬</span>
          </button>
          
          <button
            onClick={() => navigate('/profile')}
            className={`flex flex-col items-center py-2 px-4 rounded-lg transition-all duration-200 ${
              location.pathname === '/profile'
                ? 'text-blue-600 bg-blue-50 scale-105'
                : 'text-gray-600 hover:text-blue-600 hover:bg-blue-50'
            }`}
          >
            <User size={24} />
            <span className="text-xs mt-1 font-medium">Profile 👤</span>
          </button>
        </div>
      </nav>
      
      {/* Footer */}
      <div className="text-center text-xs text-gray-400 py-2 bg-white/80 backdrop-blur-sm border-t">
        Makab — Built & Developed by Sajid with ❤️
      </div>
    </div>
  );
};

export default Layout;
