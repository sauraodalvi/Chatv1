import { useState } from 'react';
import { ArrowRight, ArrowLeft, Check, Sparkles, MessageSquare, Users, Wand2, BookOpen } from 'lucide-react';
import { characterLibrary } from '../data/characters';

const Onboarding = ({ onComplete, onSelectCharacter, onCreateScenario, onQuickStart }) => {
  const [step, setStep] = useState(1);
  const [selectedCharacters, setSelectedCharacters] = useState([]);
  const [featuredCharacters, setFeaturedCharacters] = useState(() => {
    // Get 6 random characters from the library
    return [...characterLibrary]
      .sort(() => 0.5 - Math.random())
      .slice(0, 6);
  });

  const totalSteps = 4;

  const handleNext = () => {
    if (step < totalSteps) {
      setStep(step + 1);
    } else {
      onComplete(selectedCharacters);
    }
  };

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

  const toggleCharacterSelection = (character) => {
    if (selectedCharacters.some(char => char.name === character.name)) {
      setSelectedCharacters(selectedCharacters.filter(char => char.name !== character.name));
    } else {
      setSelectedCharacters([...selectedCharacters, character]);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="border-b p-4">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-bold">Welcome to Velora</h1>
          <button
            onClick={() => onComplete(selectedCharacters)}
            className="text-sm text-muted-foreground hover:text-foreground"
          >
            Skip Tutorial
          </button>
        </div>
      </header>

      {/* Content */}
      <div className="flex-1 overflow-y-auto">
        <div className="container mx-auto max-w-4xl py-8 px-4">
          {/* Progress indicator */}
          <div className="flex items-center justify-center mb-8">
            {Array.from({ length: totalSteps }).map((_, index) => (
              <div key={index} className="flex items-center">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    step > index + 1
                      ? 'bg-primary text-primary-foreground'
                      : step === index + 1
                      ? 'bg-primary/90 text-primary-foreground ring-2 ring-primary/30'
                      : 'bg-secondary text-muted-foreground'
                  }`}
                >
                  {step > index + 1 ? <Check className="h-4 w-4" /> : index + 1}
                </div>
                {index < totalSteps - 1 && (
                  <div
                    className={`h-1 w-12 ${
                      step > index + 1 ? 'bg-primary' : 'bg-secondary'
                    }`}
                  ></div>
                )}
              </div>
            ))}
          </div>

          {/* Step content */}
          <div className="bg-card rounded-lg border shadow-sm p-6 mb-8">
            {step === 1 && (
              <div className="space-y-6">
                <div className="text-center mb-6">
                  <h2 className="text-2xl font-bold mb-2">Welcome to Velora!</h2>
                  <p className="text-muted-foreground">
                    Your portal to living conversations with AI characters
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-background rounded-lg p-4 border">
                    <div className="flex items-center mb-3">
                      <MessageSquare className="h-5 w-5 mr-2 text-primary" />
                      <h3 className="font-medium">Engage in Dynamic Conversations</h3>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Chat with AI characters that respond naturally and remember context.
                    </p>
                  </div>

                  <div className="bg-background rounded-lg p-4 border">
                    <div className="flex items-center mb-3">
                      <Users className="h-5 w-5 mr-2 text-primary" />
                      <h3 className="font-medium">Create Custom Characters</h3>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Choose from our library or create your own unique characters.
                    </p>
                  </div>

                  <div className="bg-background rounded-lg p-4 border">
                    <div className="flex items-center mb-3">
                      <Wand2 className="h-5 w-5 mr-2 text-primary" />
                      <h3 className="font-medium">Generate Scenarios</h3>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Let AI create engaging scenarios based on your keywords and preferences.
                    </p>
                  </div>

                  <div className="bg-background rounded-lg p-4 border">
                    <div className="flex items-center mb-3">
                      <Sparkles className="h-5 w-5 mr-2 text-primary" />
                      <h3 className="font-medium">No Login Required</h3>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Start chatting immediately with no account creation or sign-up.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {step === 2 && (
              <div>
                <div className="text-center mb-6">
                  <h2 className="text-2xl font-bold mb-2">Choose Your Characters</h2>
                  <p className="text-muted-foreground">
                    Select characters to chat with or create your own
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mb-6">
                  {featuredCharacters.map(character => (
                    <div
                      key={character.name}
                      onClick={() => toggleCharacterSelection(character)}
                      className={`rounded-lg border overflow-hidden cursor-pointer transition-all hover:shadow-md ${
                        selectedCharacters.some(char => char.name === character.name)
                          ? 'border-primary shadow-md'
                          : 'border-border hover:border-primary/50'
                      }`}
                    >
                      {/* Character avatar/header */}
                      <div className="relative h-32 bg-gradient-to-r from-secondary/50 to-primary/30 flex items-center justify-center overflow-hidden">
                        {character.avatar ? (
                          <img
                            src={character.avatar}
                            alt={character.name}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className={`w-16 h-16 rounded-full flex items-center justify-center text-2xl ${
                            character.type === 'fantasy' ? 'bg-purple-500' :
                            character.type === 'scifi' ? 'bg-blue-500' :
                            character.type === 'historical' ? 'bg-amber-500' :
                            character.type === 'modern' ? 'bg-green-500' :
                            'bg-gray-500'
                          }`}>
                            {character.name.charAt(0)}
                          </div>
                        )}
                        
                        {/* Selection indicator */}
                        {selectedCharacters.some(char => char.name === character.name) && (
                          <div className="absolute top-2 right-2 bg-primary text-primary-foreground rounded-full w-6 h-6 flex items-center justify-center shadow-md">
                            <Check className="h-4 w-4" />
                          </div>
                        )}
                      </div>
                      
                      {/* Character info */}
                      <div className="p-3">
                        <div className="flex items-center justify-between mb-1">
                          <h3 className="font-medium">{character.name}</h3>
                          <span className="text-xs px-2 py-0.5 bg-secondary rounded-full">
                            {character.type}
                          </span>
                        </div>
                        <p className="text-xs text-muted-foreground line-clamp-2">
                          {character.description?.substring(0, 80) || "A mysterious character with an unknown background."}...
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="flex justify-center gap-4">
                  <button
                    onClick={onSelectCharacter}
                    className="inline-flex items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium shadow-sm hover:bg-accent hover:text-accent-foreground"
                  >
                    Browse All Characters
                  </button>
                  <button
                    onClick={() => {
                      // Select 3 random characters
                      const randomChars = featuredCharacters
                        .sort(() => 0.5 - Math.random())
                        .slice(0, 3);
                      setSelectedCharacters(randomChars);
                    }}
                    className="inline-flex items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium shadow-sm hover:bg-accent hover:text-accent-foreground"
                  >
                    <Sparkles className="h-4 w-4 mr-2" />
                    Random Selection
                  </button>
                </div>
              </div>
            )}

            {step === 3 && (
              <div>
                <div className="text-center mb-6">
                  <h2 className="text-2xl font-bold mb-2">Choose Your Adventure</h2>
                  <p className="text-muted-foreground">
                    Select how you want to start your conversation
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                  <div 
                    onClick={onQuickStart}
                    className="bg-background rounded-lg p-6 border hover:border-primary cursor-pointer transition-all hover:shadow-md flex flex-col items-center text-center"
                  >
                    <Sparkles className="h-10 w-10 mb-4 text-primary" />
                    <h3 className="font-medium mb-2">Quick Start</h3>
                    <p className="text-sm text-muted-foreground">
                      Choose from pre-made scenarios based on themes like fantasy, sci-fi, or mystery.
                    </p>
                  </div>

                  <div 
                    onClick={onCreateScenario}
                    className="bg-background rounded-lg p-6 border hover:border-primary cursor-pointer transition-all hover:shadow-md flex flex-col items-center text-center"
                  >
                    <Wand2 className="h-10 w-10 mb-4 text-primary" />
                    <h3 className="font-medium mb-2">AI-Generated</h3>
                    <p className="text-sm text-muted-foreground">
                      Let AI create a custom scenario based on your keywords and preferences.
                    </p>
                  </div>

                  <div 
                    onClick={() => handleNext()}
                    className="bg-background rounded-lg p-6 border hover:border-primary cursor-pointer transition-all hover:shadow-md flex flex-col items-center text-center"
                  >
                    <MessageSquare className="h-10 w-10 mb-4 text-primary" />
                    <h3 className="font-medium mb-2">Just Chat</h3>
                    <p className="text-sm text-muted-foreground">
                      Start a conversation with your selected characters without a specific scenario.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {step === 4 && (
              <div>
                <div className="text-center mb-6">
                  <h2 className="text-2xl font-bold mb-2">Chat Tips & Features</h2>
                  <p className="text-muted-foreground">
                    Get the most out of your Velora experience
                  </p>
                </div>

                <div className="space-y-4 mb-6">
                  <div className="bg-background rounded-lg p-4 border">
                    <div className="flex items-start">
                      <div className="bg-primary/10 rounded-full p-2 mr-3 mt-1">
                        <span className="text-lg">*</span>
                      </div>
                      <div>
                        <h3 className="font-medium mb-1">Use Asterisks for Actions</h3>
                        <p className="text-sm text-muted-foreground">
                          Type actions between asterisks like *smiles* or *opens the door* to describe physical actions.
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-background rounded-lg p-4 border">
                    <div className="flex items-start">
                      <div className="bg-primary/10 rounded-full p-2 mr-3 mt-1">
                        <BookOpen className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <h3 className="font-medium mb-1">Narrate the Scene</h3>
                        <p className="text-sm text-muted-foreground">
                          Use the Narrate button to add scene descriptions or move the story forward.
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-background rounded-lg p-4 border">
                    <div className="flex items-start">
                      <div className="bg-primary/10 rounded-full p-2 mr-3 mt-1">
                        <Users className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <h3 className="font-medium mb-1">Switch Characters</h3>
                        <p className="text-sm text-muted-foreground">
                          You can speak as yourself or take on the role of any character in the chat.
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-background rounded-lg p-4 border">
                    <div className="flex items-start">
                      <div className="bg-primary/10 rounded-full p-2 mr-3 mt-1">
                        <Wand2 className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <h3 className="font-medium mb-1">AI Instructions</h3>
                        <p className="text-sm text-muted-foreground">
                          Guide the AI's writing style, response length, and character behavior using the AI Instructions panel.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Footer with navigation buttons */}
      <footer className="border-t p-4">
        <div className="container mx-auto max-w-4xl flex justify-between">
          <button
            onClick={handleBack}
            disabled={step === 1}
            className="inline-flex items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium shadow-sm hover:bg-accent hover:text-accent-foreground disabled:opacity-50"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </button>

          <div className="flex items-center">
            <span className="text-sm text-muted-foreground mr-4">
              Step {step} of {totalSteps}
            </span>
            <button
              onClick={handleNext}
              className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow hover:bg-primary/90"
            >
              {step < totalSteps ? (
                <>
                  Next
                  <ArrowRight className="h-4 w-4 ml-2" />
                </>
              ) : (
                <>
                  Get Started
                  <ArrowRight className="h-4 w-4 ml-2" />
                </>
              )}
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Onboarding;
