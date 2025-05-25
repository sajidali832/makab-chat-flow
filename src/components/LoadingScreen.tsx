
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
    <div className="min-h-screen bg-gradient-to-br from-blue-600 via-purple-600 to-blue-800 flex items-center justify-center">
      <div className="text-center">
        <div className="relative mb-8">
          <div className="w-20 h-20 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto animate-pulse">
            <span className="text-white font-bold text-3xl">M</span>
          </div>
          <div className="absolute inset-0 w-20 h-20 mx-auto border-4 border-white border-t-transparent rounded-full animate-spin"></div>
        </div>
        
        <h1 className="text-3xl font-bold text-white mb-4">
          Welcome to Makab
        </h1>
        
        <p className="text-blue-100 text-lg mb-6">
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
