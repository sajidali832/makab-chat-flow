
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

interface TopNavigationProps {
  onNewChat?: () => void;
}

const TopNavigation = ({ onNewChat }: TopNavigationProps) => {
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

  const handleNewChat = () => {
    if (onNewChat) {
      onNewChat();
    }
  };

  return (
    <header className="bg-white/95 backdrop-blur-sm border-b border-gray-200 px-4 py-3 sticky top-0 z-50 shadow-sm">
      <div className="flex items-center justify-between max-w-7xl mx-auto">
        {/* Logo and Brand */}
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl overflow-hidden shadow-lg">
            <img 
              src="/lovable-uploads/e134043d-a625-4cdd-ab9f-e4e2c2225aca.png" 
              alt="Makab Logo" 
              className="w-full h-full object-cover"
            />
          </div>
          <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-orange-500 bg-clip-text text-transparent">
            Makab
          </h1>
        </div>

        {/* Right side - New Chat Button and Menu */}
        <div className="flex items-center space-x-2">
          {user && location.pathname === '/chat' && (
            <Button
              onClick={handleNewChat}
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
