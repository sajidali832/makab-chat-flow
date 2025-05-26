import { useState, useRef, useEffect } from 'react';
import { Send, Search, Copy, ThumbsUp, ThumbsDown, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';

interface Message {
  id: string;
  content: string;
  isUser: boolean;
  timestamp: Date;
  rating?: 'up' | 'down' | null;
}

const ChatPage = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();
  const { user } = useAuth();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Remove the loading chat history effect - just start fresh
  // useEffect(() => {
  //   if (user) {
  //     loadChatHistory();
  //   }
  // }, [user]);

  const saveMessage = async (content: string, isUser: boolean, rating?: string) => {
    if (!user) return null;

    try {
      const { data, error } = await supabase
        .from('chat_messages')
        .insert({
          user_id: user.id,
          content,
          is_user: isUser,
          rating: rating || null,
        })
        .select()
        .single();

      if (error) {
        console.error('Error saving message:', error);
        return null;
      }
      return data;
    } catch (error) {
      console.error('Error saving message:', error);
      return null;
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: '📋 Copied to clipboard',
      duration: 2000,
    });
  };

  const handleSend = async (withSearch = false) => {
    if (!inputMessage.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      content: inputMessage,
      isUser: true,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    const currentMessage = inputMessage;
    setInputMessage('');
    setIsLoading(true);

    await saveMessage(currentMessage, true);

    try {
      console.log('Sending message to AI:', { message: currentMessage, withSearch });
      
      const recentMessages = messages.slice(-6).map(msg => ({
        role: msg.isUser ? 'user' : 'assistant',
        content: msg.content
      }));

      const { data, error } = await supabase.functions.invoke('ai-chat', {
        body: { 
          message: currentMessage,
          withSearch,
          context: recentMessages
        }
      });

      if (error) {
        throw error;
      }

      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        content: data.response,
        isUser: false,
        timestamp: new Date(),
        rating: null,
      };
      
      setMessages(prev => [...prev, aiResponse]);
      await saveMessage(data.response, false);
      
      toast({
        title: '🤖 Response received',
        duration: 1000,
      });
    } catch (error) {
      console.error('Error getting AI response:', error);
      
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: '😅 Sorry, I encountered an error while processing your request. Please try again!',
        isUser: false,
        timestamp: new Date(),
        rating: null,
      };
      
      setMessages(prev => [...prev, errorMessage]);
      
      toast({
        title: '❌ Error',
        description: 'Failed to get AI response. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegenerate = async (messageId: string) => {
    const messageIndex = messages.findIndex(msg => msg.id === messageId);
    if (messageIndex === -1 || messages[messageIndex].isUser) return;

    const userMessage = messages[messageIndex - 1];
    if (!userMessage || !userMessage.isUser) return;

    setIsLoading(true);

    try {
      const recentMessages = messages.slice(0, messageIndex - 1).slice(-6).map(msg => ({
        role: msg.isUser ? 'user' : 'assistant',
        content: msg.content
      }));

      const { data, error } = await supabase.functions.invoke('ai-chat', {
        body: { 
          message: userMessage.content,
          withSearch: false,
          context: recentMessages
        }
      });

      if (error) {
        throw error;
      }

      const newAiResponse: Message = {
        ...messages[messageIndex],
        content: data.response,
        timestamp: new Date(),
        rating: null,
      };

      const newMessages = [...messages];
      newMessages[messageIndex] = newAiResponse;
      setMessages(newMessages);

      if (user) {
        await supabase
          .from('chat_messages')
          .update({ content: data.response, rating: null })
          .eq('id', messageId);
      }

      toast({
        title: '🔄 Response regenerated',
        duration: 2000,
      });
    } catch (error) {
      console.error('Error regenerating response:', error);
      toast({
        title: '❌ Error',
        description: 'Failed to regenerate response.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleRating = async (messageId: string, rating: 'up' | 'down') => {
    const newRating = messages.find(msg => msg.id === messageId)?.rating === rating ? null : rating;
    
    setMessages(prev => prev.map(msg => 
      msg.id === messageId 
        ? { ...msg, rating: newRating }
        : msg
    ));

    if (user) {
      await supabase
        .from('chat_messages')
        .update({ rating: newRating })
        .eq('id', messageId);
    }

    if (newRating) {
      toast({
        title: newRating === 'up' ? '👍 Feedback sent' : '👎 Feedback sent',
        duration: 1500,
      });
    }
  };

  return (
    <div className="h-screen flex flex-col bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4">
        {messages.length === 0 && (
          <div className="text-center text-gray-500 mt-20">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-500 via-purple-600 to-orange-500 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
              <div className="relative">
                <div className="w-6 h-4 bg-white rounded-t-lg"></div>
                <div className="w-1.5 h-1.5 bg-blue-500 rounded-full absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-0.5"></div>
                <div className="flex space-x-1 mt-0.5">
                  <div className="w-1 h-1 bg-blue-600 rounded-full"></div>
                  <div className="w-1 h-1 bg-blue-600 rounded-full"></div>
                </div>
                <div className="w-4 h-3 bg-white rounded-b-md mt-0.5"></div>
              </div>
            </div>
            <p className="text-lg font-medium">Welcome to Makab! 👋</p>
            <p className="text-sm">Start a conversation with your AI assistant</p>
          </div>
        )}

        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${message.isUser ? 'justify-end' : 'justify-start'} animate-fade-in`}
          >
            <Card className={`max-w-[85%] p-3 shadow-sm transition-all duration-200 hover:shadow-md ${
              message.isUser 
                ? 'bg-gradient-to-r from-blue-500 via-purple-600 to-orange-500 text-white' 
                : 'bg-white border-gray-200'
            }`}>
              <p className="text-sm whitespace-pre-wrap">{message.content}</p>
              
              <div className={`flex items-center justify-between mt-2 text-xs ${
                message.isUser ? 'text-blue-100' : 'text-gray-500'
              }`}>
                <span>{message.timestamp.toLocaleTimeString()}</span>
                
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => copyToClipboard(message.content)}
                    className={`p-1 rounded hover:bg-opacity-20 hover:bg-gray-500 transition-colors ${
                      message.isUser ? 'text-white' : 'text-gray-600'
                    }`}
                  >
                    <Copy size={14} />
                  </button>
                  
                  {!message.isUser && (
                    <>
                      <button
                        onClick={() => handleRegenerate(message.id)}
                        disabled={isLoading}
                        className="p-1 rounded text-gray-400 hover:text-blue-600 transition-colors"
                      >
                        <RotateCcw size={14} />
                      </button>
                      <button
                        onClick={() => handleRating(message.id, 'up')}
                        className={`p-1 rounded transition-colors ${
                          message.rating === 'up' 
                            ? 'text-green-600' 
                            : 'text-gray-400 hover:text-green-600'
                        }`}
                      >
                        <ThumbsUp size={14} />
                      </button>
                      <button
                        onClick={() => handleRating(message.id, 'down')}
                        className={`p-1 rounded transition-colors ${
                          message.rating === 'down' 
                            ? 'text-red-600' 
                            : 'text-gray-400 hover:text-red-600'
                        }`}
                      >
                        <ThumbsDown size={14} />
                      </button>
                    </>
                  )}
                </div>
              </div>
            </Card>
          </div>
        ))}

        {isLoading && (
          <div className="flex justify-start animate-fade-in">
            <Card className="max-w-[85%] p-3 bg-white border-gray-200">
              <div className="flex items-center space-x-2">
                <div className="text-sm text-gray-600">🤖 Makab is thinking</div>
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                </div>
              </div>
            </Card>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="bg-white border-t px-4 py-3">
        <div className="flex items-center space-x-2 max-w-4xl mx-auto">
          <div className="flex-1 relative">
            <Input
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              placeholder="Type your message... 💬"
              onKeyPress={(e) => e.key === 'Enter' && handleSend()}
              className="pr-20 transition-all duration-200 focus:ring-2 focus:ring-blue-500"
              disabled={isLoading}
            />
            <div className="absolute right-2 top-1/2 transform -translate-y-1/2 flex space-x-1">
              <Button
                size="sm"
                variant="ghost"
                onClick={() => handleSend(true)}
                disabled={!inputMessage.trim() || isLoading}
                className="p-1 h-8 w-8 hover:bg-blue-50"
                title="Search the web 🔍"
              >
                <Search size={16} />
              </Button>
              <Button
                size="sm"
                onClick={() => handleSend()}
                disabled={!inputMessage.trim() || isLoading}
                className="p-1 h-8 w-8 bg-gradient-to-r from-blue-500 via-purple-600 to-orange-500 hover:from-blue-600 hover:via-purple-700 hover:to-orange-600"
              >
                <Send size={16} />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatPage;
