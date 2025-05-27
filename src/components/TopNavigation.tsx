
import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Menu, X, MessageCircle, User, LogOut, Settings, Plus } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

const TopNavigation = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { user, signOut } = useAuth();

  const handleSignOut = async () => {
    try {
      await signOut();
      navigate('/');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const startNewChat = () => {
    // Force a page reload to clear chat history
    window.location.href = '/chat';
  };

  return (
    <header className="bg-white/95 backdrop-blur-sm border-b border-gray-200 px-4 py-3 sticky top-0 z-50 shadow-sm">
      <div className="flex items-center justify-between max-w-7xl mx-auto">
        {/* Logo and Brand */}
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-gradient-to-br from-blue-500 via-purple-600 to-orange-500 rounded-lg flex items-center justify-center animate-pulse">
            <div className="relative">
              <div className="w-3 h-2 bg-white rounded-t-sm"></div>
              <div className="w-0.5 h-0.5 bg-blue-500 rounded-full absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-0.5"></div>
              <div className="flex space-x-0.5 mt-0.5">
                <div className="w-0.5 h-0.5 bg-blue-600 rounded-full"></div>
                <div className="w-0.5 h-0.5 bg-blue-600 rounded-full"></div>
              </div>
              <div className="w-2 h-1 bg-white rounded-b-sm mt-0.5"></div>
            </div>
          </div>
          <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-orange-500 bg-clip-text text-transparent">
            Makab
          </h1>
        </div>

        {/* Right side - New Chat Button and Menu */}
        <div className="flex items-center space-x-2">
          {user && location.pathname === '/chat' && (
            <Button
              onClick={startNewChat}
              variant="ghost"
              size="sm"
              className="h-8 px-3 bg-gradient-to-r from-blue-500 via-purple-600 to-orange-500 text-white hover:from-blue-600 hover:via-purple-700 hover:to-orange-600"
            >
              <Plus size={16} className="mr-1" />
              New Chat
            </Button>
          )}
          
          {user && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="h-8 w-8 rounded-full p-0">
                  <Menu size={18} />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuItem onClick={() => navigate('/chat')} className="cursor-pointer">
                  <MessageCircle className="mr-2 h-4 w-4" />
                  Chat
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => navigate('/profile')} className="cursor-pointer">
                  <User className="mr-2 h-4 w-4" />
                  Profile
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleSignOut} className="cursor-pointer text-red-600">
                  <LogOut className="mr-2 h-4 w-4" />
                  Sign Out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
      </div>
    </header>
  );
};

export default TopNavigation;
