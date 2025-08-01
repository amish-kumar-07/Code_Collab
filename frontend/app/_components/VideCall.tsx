import React, { useState } from 'react';

interface ChatMessage {
  sender: string;
  message: string;
}

const VideoCallPanel: React.FC = () => {
  const [chatMessage, setChatMessage] = useState<string>('');
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    { sender: 'Partner', message: "Let's work on this together!" },
    { sender: 'You', message: 'Sounds good!' }
  ]);
  const [isCallActive, setIsCallActive] = useState<boolean>(false);

  const sendMessage = (): void => {
    if (chatMessage.trim()) {
      setChatMessages([...chatMessages, { sender: 'You', message: chatMessage }]);
      setChatMessage('');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>): void => {
    if (e.key === 'Enter') {
      sendMessage();
    }
  };

  const toggleCall = (): void => {
    setIsCallActive(!isCallActive);
  };

  return (
    <div className="col-span-3 bg-white rounded-lg shadow-md p-6 flex flex-col">
      <h2 className="text-xl font-semibold text-gray-800 mb-4">Video Call Area</h2>
      
      {/* Video placeholder */}
      <div className="flex-1 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center mb-4">
        <div className="text-center text-gray-500">
          <div className={`w-16 h-16 rounded-full mx-auto mb-2 flex items-center justify-center ${
            isCallActive ? 'bg-green-200' : 'bg-gray-200'
          }`}>
            <span className="text-2xl">📹</span>
          </div>
          <p className="text-sm">
            {isCallActive ? 'Call in progress...' : 'Video call will appear here'}
          </p>
        </div>
      </div>

      {/* Call controls */}
      <div className="space-y-2">
        <div className="flex space-x-2">
          <button 
            onClick={toggleCall}
            className={`flex-1 px-3 py-2 text-white rounded text-sm transition-colors ${
              isCallActive 
                ? 'bg-red-600 hover:bg-red-700' 
                : 'bg-green-600 hover:bg-green-700'
            }`}
          >
            {isCallActive ? 'Leave Call' : 'Join Call'}
          </button>
          <button 
            disabled={!isCallActive}
            className="flex-1 px-3 py-2 bg-blue-600 text-white rounded text-sm hover:bg-blue-700 transition-colors disabled:bg-gray-400"
          >
            Mute/Unmute
          </button>
        </div>
        
        <div className="text-xs text-gray-500 text-center mt-4">
          <p>Participants: {isCallActive ? '2/4' : '1/4'}</p>
          <p className="mt-1">
            🟢 You {isCallActive && '• 🟢 Partner'}
          </p>
        </div>
      </div>

      {/* Chat area */}
      <div className="mt-6 border-t pt-4">
        <h3 className="text-sm font-semibold text-gray-700 mb-2">Chat</h3>
        <div className="h-32 border border-gray-200 rounded p-2 text-xs text-gray-500 overflow-y-auto">
          {chatMessages.map((msg, index) => (
            <div key={index} className="mb-2">
              <span className="font-semibold">{msg.sender}:</span> {msg.message}
            </div>
          ))}
        </div>
        <div className="flex mt-2">
          <input 
            type="text" 
            value={chatMessage}
            onChange={(e) => setChatMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Type a message..." 
            className="flex-1 px-2 py-1 border border-gray-300 rounded-l text-xs focus:outline-none focus:border-blue-500"
          />
          <button 
            onClick={sendMessage}
            className="px-3 py-1 bg-blue-600 text-white rounded-r text-xs hover:bg-blue-700 transition-colors"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
};

export default VideoCallPanel;