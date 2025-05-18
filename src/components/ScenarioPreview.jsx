import { useState } from "react";
import { Eye, MessageSquare, Users, Sparkles } from "lucide-react";
import { extractScenarioElements } from "../utils/scenarioContext";

/**
 * Component for previewing how a scenario will appear in the chat
 * 
 * @param {Object} props - Component props
 * @param {string} props.scenarioDescription - The scenario description
 * @param {Array} props.characters - The characters in the scenario
 * @param {string} props.backgroundImage - Optional background image URL
 * @returns {JSX.Element} - The rendered component
 */
const ScenarioPreview = ({ 
  scenarioDescription, 
  characters = [],
  backgroundImage
}) => {
  const [expanded, setExpanded] = useState(false);
  
  // Extract scenario elements for preview
  const scenarioElements = extractScenarioElements(scenarioDescription);
  
  // Generate a sample message from each character
  const generateSampleMessage = (character) => {
    const messages = [
      `I'm ${character.name}. ${character.opening_line || "Nice to meet you."}`,
      `As ${character.type === "fantasy" ? "a being of magic" : 
        character.type === "scifi" ? "someone from an advanced civilization" : 
        character.type === "historical" ? "a person of historical significance" : 
        "someone in this scenario"}, I find this situation quite interesting.`,
      `Given my ${character.mood} mood, I'm approaching this with ${
        character.mood === "happy" ? "enthusiasm and optimism" :
        character.mood === "sad" ? "a heavy heart" :
        character.mood === "angry" ? "frustration and intensity" :
        character.mood === "curious" ? "inquisitiveness and wonder" :
        "my own perspective"
      }.`
    ];
    
    return messages[Math.floor(Math.random() * messages.length)];
  };
  
  // Get background style
  const getBackgroundStyle = () => {
    if (backgroundImage) {
      return {
        backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.7)), url(${backgroundImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        color: 'white'
      };
    }
    
    // Default gradient based on scenario type
    const isFantasy = scenarioDescription.toLowerCase().includes('magic') || 
                      scenarioDescription.toLowerCase().includes('fantasy') ||
                      scenarioDescription.toLowerCase().includes('enchanted');
    
    const isScifi = scenarioDescription.toLowerCase().includes('space') || 
                    scenarioDescription.toLowerCase().includes('future') ||
                    scenarioDescription.toLowerCase().includes('technology');
    
    const isAdventure = scenarioDescription.toLowerCase().includes('adventure') || 
                        scenarioDescription.toLowerCase().includes('quest') ||
                        scenarioDescription.toLowerCase().includes('journey');
    
    if (isFantasy) {
      return { background: 'linear-gradient(to right, #8e2de2, #4a00e0)' };
    } else if (isScifi) {
      return { background: 'linear-gradient(to right, #2193b0, #6dd5ed)' };
    } else if (isAdventure) {
      return { background: 'linear-gradient(to right, #f2994a, #f2c94c)' };
    }
    
    // Default gradient
    return { background: 'linear-gradient(to right, #4568dc, #b06ab3)' };
  };
  
  return (
    <div className="bg-background rounded-lg border border-border shadow-md overflow-hidden animate-fadeIn">
      {/* Header */}
      <div className="flex items-center justify-between p-3 bg-primary/5 border-b">
        <div className="flex items-center gap-2">
          <Eye className="h-4 w-4 text-primary" />
          <h3 className="font-medium">Scenario Preview</h3>
        </div>
        <button
          onClick={() => setExpanded(!expanded)}
          className="text-xs text-primary hover:text-primary/80"
        >
          {expanded ? "Collapse" : "Expand"}
        </button>
      </div>
      
      {/* Preview header */}
      <div 
        className="p-4 text-white"
        style={getBackgroundStyle()}
      >
        <h2 className="font-bold text-lg mb-1">
          {scenarioDescription.split('.')[0] || "Custom Scenario"}
        </h2>
        <p className="text-sm opacity-90 mb-3">
          {scenarioDescription || "No description provided yet."}
        </p>
        
        <div className="flex items-center gap-3 text-xs">
          <div className="flex items-center gap-1">
            <Users className="h-3.5 w-3.5" />
            <span>{characters.length} Characters</span>
          </div>
          {scenarioElements.setting && (
            <div className="flex items-center gap-1">
              <MessageSquare className="h-3.5 w-3.5" />
              <span>{scenarioElements.setting}</span>
            </div>
          )}
        </div>
      </div>
      
      {/* Character preview */}
      {expanded && characters.length > 0 && (
        <div className="p-4">
          <h4 className="text-sm font-medium mb-3 flex items-center gap-1">
            <Sparkles className="h-3.5 w-3.5 text-primary" />
            <span>Sample Character Interactions</span>
          </h4>
          
          <div className="space-y-3">
            {characters.map((character) => (
              <div key={character.name} className="flex items-start gap-2">
                <div className="flex-shrink-0 w-8 h-8 rounded-full overflow-hidden bg-secondary flex items-center justify-center">
                  {character.avatar ? (
                    <img 
                      src={character.avatar} 
                      alt={character.name}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(character.name)}&background=random`;
                      }}
                    />
                  ) : (
                    <span className="font-bold text-xs">
                      {character.name.charAt(0)}
                    </span>
                  )}
                </div>
                
                <div className="flex-1">
                  <div className="bg-secondary/20 rounded-lg p-2 text-sm">
                    <p className="font-medium text-xs mb-1">{character.name}</p>
                    <p>{generateSampleMessage(character)}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ScenarioPreview;
