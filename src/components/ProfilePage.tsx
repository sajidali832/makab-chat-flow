
import { useState, useEffect } from 'react';
import { LogOut, Trash2, Copy, Edit, Save, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';

interface HistoryMessage {
  id: string;
  content: string;
  timestamp: Date;
  isUser: boolean;
}

const ProfilePage = () => {
  const [history, setHistory] = useState<HistoryMessage[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState('');
  const [loading, setLoading] = useState(false);
  const { user, profile, signOut } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    if (profile) {
      setEditName(profile.name || '');
    }
  }, [profile]);

  useEffect(() => {
    if (user) {
      loadChatHistory();
    }
  }, [user]);

  const loadChatHistory = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('chat_messages')
        .select('*')
        .eq('user_id', user.id)
        .order('timestamp', { ascending: false })
        .limit(20);

      if (error) {
        console.error('Error loading chat history:', error);
      } else if (data) {
        const historyMessages: HistoryMessage[] = data.map(msg => ({
          id: msg.id,
          content: msg.content,
          timestamp: new Date(msg.timestamp),
          isUser: msg.is_user,
        }));
        setHistory(historyMessages);
      }
    } catch (error) {
      console.error('Error loading chat history:', error);
    }
  };

  const handleUpdateProfile = async () => {
    if (!user || !editName.trim()) return;

    setLoading(true);
    try {
      const { error } = await supabase
        .from('profiles')
        .update({ name: editName.trim() })
        .eq('id', user.id);

      if (error) {
        throw error;
      }

      setIsEditing(false);
      toast({
        title: '✅ Profile updated!',
        description: 'Your name has been updated successfully.',
      });
    } catch (error: any) {
      toast({
        title: '❌ Error',
        description: error.message || 'Failed to update profile',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await signOut();
      toast({
        title: '👋 See you later!',
        description: 'You have been logged out successfully.',
      });
    } catch (error) {
      toast({
        title: '❌ Error',
        description: 'Failed to logout',
        variant: 'destructive',
      });
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: '📋 Copied to clipboard',
      duration: 2000,
    });
  };

  const deleteHistoryItem = async (id: string) => {
    try {
      const { error } = await supabase
        .from('chat_messages')
        .delete()
        .eq('id', id);

      if (error) {
        throw error;
      }

      setHistory(prev => prev.filter(item => item.id !== id));
      toast({
        title: '🗑️ Message deleted',
        duration: 2000,
      });
    } catch (error) {
      toast({
        title: '❌ Error',
        description: 'Failed to delete message',
        variant: 'destructive',
      });
    }
  };

  const clearAllHistory = async () => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('chat_messages')
        .delete()
        .eq('user_id', user.id);

      if (error) {
        throw error;
      }

      setHistory([]);
      toast({
        title: '🧹 History cleared',
        description: 'All chat history has been deleted.',
      });
    } catch (error) {
      toast({
        title: '❌ Error',
        description: 'Failed to clear history',
        variant: 'destructive',
      });
    }
  };

  if (!user || !profile) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse">
            <span className="text-white font-bold text-2xl">M</span>
          </div>
          <p className="text-gray-600">Loading profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-4">
      <div className="max-w-2xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
            <span className="text-white font-bold text-3xl">
              {profile.name?.charAt(0).toUpperCase() || user.email?.charAt(0).toUpperCase() || 'U'}
            </span>
          </div>
          <h1 className="text-2xl font-bold text-gray-900">Profile 👤</h1>
        </div>

        {/* User Info */}
        <Card className="shadow-sm hover:shadow-md transition-shadow duration-200">
          <CardHeader>
            <CardTitle className="text-lg flex items-center justify-between">
              User Information 📝
              {!isEditing && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsEditing(true)}
                  className="text-blue-600 hover:text-blue-700"
                >
                  <Edit size={16} />
                </Button>
              )}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm font-medium text-gray-600">Name</label>
              {isEditing ? (
                <div className="flex items-center space-x-2 mt-1">
                  <Input
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    placeholder="Enter your name"
                    className="flex-1"
                  />
                  <Button
                    size="sm"
                    onClick={handleUpdateProfile}
                    disabled={loading || !editName.trim()}
                    className="bg-green-600 hover:bg-green-700"
                  >
                    <Save size={16} />
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => {
                      setIsEditing(false);
                      setEditName(profile.name || '');
                    }}
                  >
                    <X size={16} />
                  </Button>
                </div>
              ) : (
                <p className="text-gray-900 font-medium mt-1">{profile.name || 'Not set'}</p>
              )}
            </div>
            <div>
              <label className="text-sm font-medium text-gray-600">Email</label>
              <p className="text-gray-900 font-medium mt-1">{user.email}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-600">User ID</label>
              <p className="text-gray-500 text-sm font-mono mt-1">{user.id}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-600">Member Since</label>
              <p className="text-gray-700 mt-1">
                {new Date(profile.created_at).toLocaleDateString()}
              </p>
            </div>
          </CardContent>
        </Card>

        {/* About Us */}
        <Card className="shadow-sm hover:shadow-md transition-shadow duration-200">
          <CardHeader>
            <CardTitle className="text-lg">About Makab 🤖</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-700 leading-relaxed">
              Makab is your intelligent AI chat assistant, powered by Llama 3.3 8B model 🚀. 
              Built with cutting-edge technology, Makab offers both direct responses and 
              web-search capabilities to give you the most comprehensive answers to your questions.
              Every conversation is remembered to provide better context and continuity! 💬
            </p>
            <Separator className="my-4" />
            <p className="text-sm text-gray-600">
              Version 2.0 • Built & Developed by Sajid with ❤️
            </p>
          </CardContent>
        </Card>

        {/* Chat History */}
        <Card className="shadow-sm hover:shadow-md transition-shadow duration-200">
          <CardHeader>
            <CardTitle className="text-lg flex items-center justify-between">
              Chat History 💬
              {history.length > 0 && (
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={clearAllHistory}
                  className="text-xs"
                >
                  Clear All
                </Button>
              )}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {history.length === 0 ? (
              <p className="text-gray-500 text-center py-8">No chat history yet 📭</p>
            ) : (
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {history.map((message) => (
                  <div
                    key={message.id}
                    className={`p-3 rounded-lg border transition-all duration-200 hover:shadow-sm ${
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
                        <p className="text-xs text-gray-500 mt-1 flex items-center space-x-2">
                          <span>{message.timestamp.toLocaleDateString()}</span>
                          <span>•</span>
                          <span>
                            {message.isUser ? '👤 You' : '🤖 Assistant'}
                          </span>
                        </p>
                      </div>
                      <div className="flex space-x-1 ml-2">
                        <button
                          onClick={() => copyToClipboard(message.content)}
                          className="p-1 text-gray-400 hover:text-gray-600 rounded transition-colors"
                        >
                          <Copy size={14} />
                        </button>
                        <button
                          onClick={() => deleteHistoryItem(message.id)}
                          className="p-1 text-gray-400 hover:text-red-600 rounded transition-colors"
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
        <Card className="shadow-sm hover:shadow-md transition-shadow duration-200">
          <CardContent className="pt-6">
            <Button 
              onClick={handleLogout}
              variant="destructive"
              className="w-full flex items-center justify-center space-x-2 hover:scale-105 transition-transform duration-200"
            >
              <LogOut size={18} />
              <span>Logout 👋</span>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ProfilePage;
