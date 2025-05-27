
import React, { ReactNode } from 'react';
import { useAuth } from '@/hooks/useAuth';
import TopNavigation from './TopNavigation';

interface LayoutProps {
  children: ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex flex-col">
      {user && <TopNavigation />}
      
      <main className="flex-1">
        {children}
      </main>
      
      {/* Footer */}
      <div className="text-center text-xs text-gray-400 py-2 bg-white/80 backdrop-blur-sm border-t">
        Makab — Built & Developed by Sajid with ❤️
      </div>
    </div>
  );
};

export default Layout;
