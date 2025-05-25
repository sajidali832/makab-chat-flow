
import { useState, useRef, useEffect } from 'react';
import { Send, Search, Copy, ThumbsUp, ThumbsDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

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

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: 'Copied to clipboard',
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

    try {
      console.log('Sending message to AI:', { message: currentMessage, withSearch });
      
      const { data, error } = await supabase.functions.invoke('ai-chat', {
        body: { 
          message: currentMessage,
          withSearch 
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
    } catch (error) {
      console.error('Error getting AI response:', error);
      
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: 'Sorry, I encountered an error while processing your request. Please try again.',
        isUser: false,
        timestamp: new Date(),
        rating: null,
      };
      
      setMessages(prev => [...prev, errorMessage]);
      
      toast({
        title: 'Error',
        description: 'Failed to get AI response. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleRating = (messageId: string, rating: 'up' | 'down') => {
    setMessages(prev => prev.map(msg => 
      msg.id === messageId 
        ? { ...msg, rating: msg.rating === rating ? null : rating }
        : msg
    ));
  };

  return (
    <div className="h-screen flex flex-col bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b px-4 py-3">
        <div className="flex items-center justify-center">
          <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center mr-3">
            <span className="text-white font-bold text-sm">M</span>
          </div>
          <h1 className="text-xl font-semibold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Makab
          </h1>
        </div>
      </header>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4">
        {messages.length === 0 && (
          <div className="text-center text-gray-500 mt-20">
            <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-white font-bold text-2xl">M</span>
            </div>
            <p className="text-lg font-medium">Welcome to Makab!</p>
            <p className="text-sm">Start a conversation with your AI assistant</p>
          </div>
        )}

        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${message.isUser ? 'justify-end' : 'justify-start'}`}
          >
            <Card className={`max-w-[85%] p-3 shadow-sm ${
              message.isUser 
                ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white' 
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
                    className={`p-1 rounded hover:bg-opacity-20 hover:bg-gray-500 ${
                      message.isUser ? 'text-white' : 'text-gray-600'
                    }`}
                  >
                    <Copy size={14} />
                  </button>
                  
                  {!message.isUser && (
                    <>
                      <button
                        onClick={() => handleRating(message.id, 'up')}
                        className={`p-1 rounded ${
                          message.rating === 'up' 
                            ? 'text-green-600' 
                            : 'text-gray-400 hover:text-green-600'
                        }`}
                      >
                        <ThumbsUp size={14} />
                      </button>
                      <button
                        onClick={() => handleRating(message.id, 'down')}
                        className={`p-1 rounded ${
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
          <div className="flex justify-start">
            <Card className="max-w-[85%] p-3 bg-white border-gray-200">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-pulse"></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-pulse" style={{ animationDelay: '0.4s' }}></div>
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
              placeholder="Type your message..."
              onKeyPress={(e) => e.key === 'Enter' && handleSend()}
              className="pr-20"
              disabled={isLoading}
            />
            <div className="absolute right-2 top-1/2 transform -translate-y-1/2 flex space-x-1">
              <Button
                size="sm"
                variant="ghost"
                onClick={() => handleSend(true)}
                disabled={!inputMessage.trim() || isLoading}
                className="p-1 h-8 w-8"
                title="Search the web"
              >
                <Search size={16} />
              </Button>
              <Button
                size="sm"
                onClick={() => handleSend()}
                disabled={!inputMessage.trim() || isLoading}
                className="p-1 h-8 w-8 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
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
