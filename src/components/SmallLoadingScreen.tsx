
import React from 'react';

const SmallLoadingScreen: React.FC = () => {
  return (
    <div className="flex items-center justify-center py-8">
      <div className="flex flex-col items-center space-y-4">
        <div className="w-12 h-12 rounded-xl overflow-hidden shadow-lg">
          <img 
            src="/lovable-uploads/e134043d-a625-4cdd-ab9f-e4e2c2225aca.png" 
            alt="Makab Logo" 
            className="w-full h-full object-cover"
          />
        </div>
        <div className="flex space-x-1">
          <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"></div>
          <div className="w-2 h-2 bg-purple-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
          <div className="w-2 h-2 bg-orange-500 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
        </div>
      </div>
    </div>
  );
};

export default SmallLoadingScreen;
