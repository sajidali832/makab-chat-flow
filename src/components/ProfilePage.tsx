
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { LogOut, Trash2, Copy } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';

interface User {
  email: string;
  name: string;
  id: string;
}

interface HistoryMessage {
  id: string;
  content: string;
  timestamp: Date;
  isUser: boolean;
}

const ProfilePage = () => {
  const [user, setUser] = useState<User | null>(null);
  const [history, setHistory] = useState<HistoryMessage[]>([]);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const userData = localStorage.getItem('makab-user');
    if (userData) {
      setUser(JSON.parse(userData));
    }

    // Mock history data - replace with actual API call
    const mockHistory: HistoryMessage[] = [
      { id: '1', content: 'What is artificial intelligence?', timestamp: new Date(2024, 0, 15), isUser: true },
      { id: '2', content: 'Artificial intelligence refers to...', timestamp: new Date(2024, 0, 15), isUser: false },
      { id: '3', content: 'How does machine learning work?', timestamp: new Date(2024, 0, 14), isUser: true },
      { id: '4', content: 'Machine learning is a subset of AI...', timestamp: new Date(2024, 0, 14), isUser: false },
    ];
    setHistory(mockHistory);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('makab-auth');
    localStorage.removeItem('makab-user');
    navigate('/');
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: 'Copied to clipboard',
      duration: 2000,
    });
  };

  const deleteHistoryItem = (id: string) => {
    setHistory(prev => prev.filter(item => item.id !== id));
    toast({
      title: 'Message deleted',
      duration: 2000,
    });
  };

  if (!user) {
    return <div>Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-4">
      <div className="max-w-2xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-white font-bold text-3xl">
              {user.name.charAt(0).toUpperCase()}
            </span>
          </div>
          <h1 className="text-2xl font-bold text-gray-900">Profile</h1>
        </div>

        {/* User Info */}
        <Card className="shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg">User Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm font-medium text-gray-600">Name</label>
              <p className="text-gray-900 font-medium">{user.name}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-600">Email</label>
              <p className="text-gray-900 font-medium">{user.email}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-600">User ID</label>
              <p className="text-gray-500 text-sm font-mono">{user.id}</p>
            </div>
          </CardContent>
        </Card>

        {/* About Us */}
        <Card className="shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg">About Makab</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-700 leading-relaxed">
              Makab is your intelligent AI chat assistant, designed to provide helpful, 
              accurate, and engaging conversations. Built with cutting-edge technology, 
              Makab offers both direct responses and web-search capabilities to give you 
              the most comprehensive answers to your questions.
            </p>
            <Separator className="my-4" />
            <p className="text-sm text-gray-600">
              Version 1.0 • Built & Developed by Sajid
            </p>
          </CardContent>
        </Card>

        {/* History */}
        <Card className="shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg">Chat History</CardTitle>
          </CardHeader>
          <CardContent>
            {history.length === 0 ? (
              <p className="text-gray-500 text-center py-8">No chat history yet</p>
            ) : (
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {history.map((message) => (
                  <div
                    key={message.id}
                    className={`p-3 rounded-lg border ${
                      message.isUser 
                        ? 'bg-blue-50 border-blue-200' 
                        : 'bg-gray-50 border-gray-200'
                    }`}
                  >
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <p className="text-sm text-gray-900 line-clamp-2">
                          {message.content}
                        </p>
                        <p className="text-xs text-gray-500 mt-1">
                          {message.timestamp.toLocaleDateString()} • {
                            message.isUser ? 'You' : 'Assistant'
                          }
                        </p>
                      </div>
                      <div className="flex space-x-1 ml-2">
                        <button
                          onClick={() => copyToClipboard(message.content)}
                          className="p-1 text-gray-400 hover:text-gray-600 rounded"
                        >
                          <Copy size={14} />
                        </button>
                        <button
                          onClick={() => deleteHistoryItem(message.id)}
                          className="p-1 text-gray-400 hover:text-red-600 rounded"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Logout */}
        <Card className="shadow-sm">
          <CardContent className="pt-6">
            <Button 
              onClick={handleLogout}
              variant="destructive"
              className="w-full flex items-center justify-center space-x-2"
            >
              <LogOut size={18} />
              <span>Logout</span>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ProfilePage;
