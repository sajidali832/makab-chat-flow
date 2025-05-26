
import { useState, useEffect } from 'react';

const LoadingScreen = () => {
  const [dots, setDots] = useState('');

  useEffect(() => {
    const interval = setInterval(() => {
      setDots(prev => {
        if (prev === '...') return '';
        return prev + '.';
      });
    }, 500);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 via-purple-600 to-orange-500 flex items-center justify-center">
      <div className="text-center">
        <div className="relative mb-8">
          {/* Robot Icon with Animation */}
          <div className="w-20 h-20 bg-white rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-2xl animate-bounce">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-500 via-purple-600 to-orange-500 rounded-xl flex items-center justify-center">
              {/* Robot Head */}
              <div className="relative">
                <div className="w-8 h-6 bg-white rounded-t-lg"></div>
                <div className="w-2 h-2 bg-blue-500 rounded-full absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1"></div>
                {/* Eyes */}
                <div className="flex space-x-1 mt-1">
                  <div className="w-1.5 h-1.5 bg-blue-600 rounded-full"></div>
                  <div className="w-1.5 h-1.5 bg-blue-600 rounded-full"></div>
                </div>
                {/* Body */}
                <div className="w-6 h-4 bg-white rounded-b-md mt-1"></div>
              </div>
            </div>
          </div>
          
          <div className="absolute inset-0 w-20 h-20 mx-auto border-4 border-white/30 border-t-white rounded-full animate-spin"></div>
        </div>
        
        <h1 className="text-3xl font-bold text-white mb-4 animate-fade-in">
          Welcome to Makab
        </h1>
        
        <p className="text-white/90 text-lg mb-6 animate-fade-in">
          Your AI Assistant is Loading{dots}
        </p>
        
        <div className="flex justify-center space-x-1">
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className="w-3 h-3 bg-white rounded-full animate-bounce"
              style={{ animationDelay: `${i * 0.2}s` }}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default LoadingScreen;
