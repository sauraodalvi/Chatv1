import React, { useState, useEffect } from 'react';

/**
 * Debug panel component to help diagnose issues with the chat functionality
 */
const DebugPanel = ({ chatRoom, storyArc, activeCharacter, chatHistory }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [lastError, setLastError] = useState(null);

  // Listen for errors
  useEffect(() => {
    const handleError = (event) => {
      console.log("Error captured by DebugPanel:", event.error);
      setLastError({
        message: event.error?.message || "Unknown error",
        stack: event.error?.stack || "",
        time: new Date().toISOString()
      });
    };

    window.addEventListener('error', handleError);
    return () => window.removeEventListener('error', handleError);
  }, []);

  if (!isOpen) {
    return (
      <button 
        className="fixed bottom-2 right-2 bg-red-600 text-white px-3 py-1 rounded-md z-50"
        onClick={() => setIsOpen(true)}
      >
        Debug
      </button>
    );
  }

  return (
    <div className="fixed bottom-0 right-0 w-full md:w-1/2 h-1/2 bg-gray-900 text-white p-4 overflow-auto z-50 border-t border-l border-gray-700">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">Debug Panel</h2>
        <button 
          className="bg-gray-700 px-3 py-1 rounded-md"
          onClick={() => setIsOpen(false)}
        >
          Close
        </button>
      </div>

      {lastError && (
        <div className="mb-4 p-2 bg-red-900 rounded">
          <h3 className="font-bold">Last Error:</h3>
          <p>{lastError.message}</p>
          <p className="text-xs opacity-70">{lastError.time}</p>
          <pre className="text-xs mt-2 overflow-auto max-h-20">{lastError.stack}</pre>
        </div>
      )}

      <div className="grid grid-cols-2 gap-4">
        <div className="bg-gray-800 p-2 rounded">
          <h3 className="font-bold mb-2">Chat Room:</h3>
          <pre className="text-xs overflow-auto max-h-32">
            {chatRoom ? JSON.stringify(chatRoom, null, 2) : "No chat room data"}
          </pre>
        </div>
        
        <div className="bg-gray-800 p-2 rounded">
          <h3 className="font-bold mb-2">Story Arc:</h3>
          <pre className="text-xs overflow-auto max-h-32">
            {storyArc ? JSON.stringify(storyArc, null, 2) : "No story arc data"}
          </pre>
        </div>
        
        <div className="bg-gray-800 p-2 rounded">
          <h3 className="font-bold mb-2">Active Character:</h3>
          <pre className="text-xs overflow-auto max-h-32">
            {activeCharacter ? JSON.stringify(activeCharacter, null, 2) : "No active character"}
          </pre>
        </div>
        
        <div className="bg-gray-800 p-2 rounded">
          <h3 className="font-bold mb-2">Chat History:</h3>
          <pre className="text-xs overflow-auto max-h-32">
            {chatHistory && chatHistory.length > 0 
              ? `${chatHistory.length} messages` 
              : "No chat history"}
          </pre>
        </div>
      </div>

      <div className="mt-4">
        <button 
          className="bg-blue-600 px-3 py-1 rounded-md mr-2"
          onClick={() => {
            console.log("Debug data:", {
              chatRoom,
              storyArc,
              activeCharacter,
              chatHistory
            });
            alert("Debug data logged to console");
          }}
        >
          Log Data to Console
        </button>
      </div>
    </div>
  );
};

export default DebugPanel;
