import { useState, useEffect } from 'react';

/**
 * A simple test component to diagnose chat room navigation issues
 */
const TestChatPage = ({ onBack }) => {
  const [testCharacters, setTestCharacters] = useState([
    {
      name: "Test Character",
      type: "fantasy",
      mood: "neutral",
      description: "A test character for debugging purposes.",
      avatar: "🧙‍♂️",
      personality: {
        analytical: 5,
        emotional: 5,
        philosophical: 5,
        humor: 5,
        confidence: 5
      }
    }
  ]);

  return (
    <div className="container mx-auto py-6 px-4">
      <div className="max-w-4xl mx-auto bg-background rounded-lg border border-primary/20 shadow-md p-6">
        <h1 className="text-2xl font-bold mb-4">Test Chat Page</h1>
        <p className="mb-4">This is a test page to diagnose chat room navigation issues.</p>
        
        <div className="flex flex-col gap-4">
          <div className="p-4 bg-secondary/10 rounded-lg">
            <h2 className="text-lg font-medium mb-2">Test Character</h2>
            <p className="text-sm text-muted-foreground">A test character for debugging purposes.</p>
          </div>
          
          <div className="p-4 bg-secondary/10 rounded-lg">
            <h2 className="text-lg font-medium mb-2">Test Message</h2>
            <div className="flex gap-2 items-start">
              <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
                🧙‍♂️
              </div>
              <div className="bg-background p-3 rounded-lg border border-primary/10">
                <p className="text-sm">This is a test message from the test character.</p>
              </div>
            </div>
          </div>
        </div>
        
        <div className="mt-6 flex justify-between">
          <button 
            onClick={onBack}
            className="px-4 py-2 rounded-md bg-secondary text-secondary-foreground hover:bg-secondary/80"
          >
            Back
          </button>
          
          <button 
            className="px-4 py-2 rounded-md bg-primary text-primary-foreground hover:bg-primary/80"
          >
            Send Test Message
          </button>
        </div>
      </div>
    </div>
  );
};

export default TestChatPage;
