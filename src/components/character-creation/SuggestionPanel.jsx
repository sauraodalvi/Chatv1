import { useState, useEffect } from "react";
import { Sparkles, Loader, Plus, Check, RefreshCw } from "lucide-react";

/**
 * AI-powered suggestion panel that displays real-time suggestions
 * for character creation fields
 */
const SuggestionPanel = ({
  suggestions,
  isLoading,
  onApplySuggestion,
  character,
}) => {
  const [activeSuggestionType, setActiveSuggestionType] = useState("name");
  const [appliedSuggestions, setAppliedSuggestions] = useState({});
  
  // Reset applied suggestions when character changes significantly
  useEffect(() => {
    setAppliedSuggestions({});
  }, [character.type]);
  
  // Determine which suggestion types are available
  const availableSuggestionTypes = Object.keys(suggestions).filter(
    (type) => suggestions[type] && (
      Array.isArray(suggestions[type]) ? 
      suggestions[type].length > 0 : 
      Object.keys(suggestions[type]).length > 0
    )
  );
  
  // Set first available suggestion type as active if current is not available
  useEffect(() => {
    if (
      availableSuggestionTypes.length > 0 &&
      !availableSuggestionTypes.includes(activeSuggestionType)
    ) {
      setActiveSuggestionType(availableSuggestionTypes[0]);
    }
  }, [availableSuggestionTypes, activeSuggestionType]);
  
  // Handle applying a suggestion
  const handleApplySuggestion = (type, value) => {
    onApplySuggestion(type, value);
    setAppliedSuggestions((prev) => ({
      ...prev,
      [type]: value,
    }));
  };
  
  // Check if a suggestion has been applied
  const isSuggestionApplied = (type, value) => {
    if (type === "personality") {
      // For personality, we check if any trait has been applied
      return Object.keys(appliedSuggestions).some(
        (key) => key.startsWith("personality.")
      );
    }
    
    return appliedSuggestions[type] === value;
  };
  
  // Render suggestions based on the active type
  const renderSuggestions = () => {
    if (isLoading) {
      return (
        <div className="flex flex-col items-center justify-center h-40">
          <Loader className="h-8 w-8 animate-spin text-primary mb-2" />
          <p className="text-sm text-muted-foreground">
            Generating suggestions...
          </p>
        </div>
      );
    }
    
    if (!availableSuggestionTypes.includes(activeSuggestionType)) {
      return (
        <div className="flex flex-col items-center justify-center h-40">
          <p className="text-sm text-muted-foreground">
            No suggestions available for this field.
          </p>
        </div>
      );
    }
    
    switch (activeSuggestionType) {
      case "name":
        return renderNameSuggestions();
      case "description":
        return renderDescriptionSuggestions();
      case "mood":
        return renderMoodSuggestions();
      case "personality":
        return renderPersonalitySuggestions();
      case "opening_line":
        return renderOpeningLineSuggestions();
      default:
        return null;
    }
  };
  
  // Render name suggestions
  const renderNameSuggestions = () => {
    if (!Array.isArray(suggestions.name) || suggestions.name.length === 0) {
      return (
        <div className="text-sm text-muted-foreground p-4">
          No name suggestions available.
        </div>
      );
    }
    
    return (
      <div className="space-y-2 p-4">
        {suggestions.name.map((name, index) => (
          <button
            key={index}
            onClick={() => handleApplySuggestion("name", name)}
            className={`w-full p-3 rounded-md text-left transition-colors ${
              isSuggestionApplied("name", name)
                ? "bg-primary/20 border border-primary"
                : "bg-secondary hover:bg-secondary/80 border border-transparent"
            }`}
          >
            <div className="flex items-center justify-between">
              <span>{name}</span>
              {isSuggestionApplied("name", name) ? (
                <Check className="h-4 w-4 text-primary" />
              ) : (
                <Plus className="h-4 w-4 opacity-60" />
              )}
            </div>
          </button>
        ))}
      </div>
    );
  };
  
  // Render description suggestions
  const renderDescriptionSuggestions = () => {
    if (!Array.isArray(suggestions.description) || suggestions.description.length === 0) {
      return (
        <div className="text-sm text-muted-foreground p-4">
          No description suggestions available.
        </div>
      );
    }
    
    return (
      <div className="space-y-3 p-4">
        {suggestions.description.map((description, index) => (
          <button
            key={index}
            onClick={() => handleApplySuggestion("description", description)}
            className={`w-full p-3 rounded-md text-left transition-colors ${
              isSuggestionApplied("description", description)
                ? "bg-primary/20 border border-primary"
                : "bg-secondary hover:bg-secondary/80 border border-transparent"
            }`}
          >
            <div className="flex items-start justify-between">
              <p className="text-sm line-clamp-3">{description}</p>
              <div className="ml-2 mt-1 flex-shrink-0">
                {isSuggestionApplied("description", description) ? (
                  <Check className="h-4 w-4 text-primary" />
                ) : (
                  <Plus className="h-4 w-4 opacity-60" />
                )}
              </div>
            </div>
          </button>
        ))}
      </div>
    );
  };
  
  // Render mood suggestions
  const renderMoodSuggestions = () => {
    if (!Array.isArray(suggestions.mood) || suggestions.mood.length === 0) {
      return (
        <div className="text-sm text-muted-foreground p-4">
          No mood suggestions available.
        </div>
      );
    }
    
    return (
      <div className="grid grid-cols-2 gap-2 p-4">
        {suggestions.mood.map((mood, index) => (
          <button
            key={index}
            onClick={() => handleApplySuggestion("mood", mood.toLowerCase())}
            className={`p-2 rounded-md text-center transition-colors ${
              isSuggestionApplied("mood", mood.toLowerCase())
                ? "bg-primary/20 border border-primary"
                : "bg-secondary hover:bg-secondary/80 border border-transparent"
            }`}
          >
            <div className="flex items-center justify-center">
              <span className="text-sm">{mood}</span>
              {isSuggestionApplied("mood", mood.toLowerCase()) && (
                <Check className="h-3 w-3 ml-1 text-primary" />
              )}
            </div>
          </button>
        ))}
      </div>
    );
  };
  
  // Render personality suggestions
  const renderPersonalitySuggestions = () => {
    if (!suggestions.personality || Object.keys(suggestions.personality).length === 0) {
      return (
        <div className="text-sm text-muted-foreground p-4">
          No personality suggestions available.
        </div>
      );
    }
    
    const personalityTraits = Object.entries(suggestions.personality);
    
    return (
      <div className="space-y-3 p-4">
        <button
          onClick={() => {
            // Apply all personality traits at once
            Object.entries(suggestions.personality).forEach(([trait, value]) => {
              onApplySuggestion(`personality.${trait}`, value);
            });
            setAppliedSuggestions((prev) => ({
              ...prev,
              personality: true,
            }));
          }}
          className={`w-full p-3 rounded-md text-left transition-colors ${
            appliedSuggestions.personality
              ? "bg-primary/20 border border-primary"
              : "bg-secondary hover:bg-secondary/80 border border-transparent"
          }`}
        >
          <div className="flex items-center justify-between mb-2">
            <span className="font-medium">Suggested Personality Profile</span>
            {appliedSuggestions.personality ? (
              <Check className="h-4 w-4 text-primary" />
            ) : (
              <Plus className="h-4 w-4 opacity-60" />
            )}
          </div>
          
          <div className="grid grid-cols-2 gap-x-4 gap-y-1">
            {personalityTraits.map(([trait, value]) => (
              <div key={trait} className="flex justify-between text-xs">
                <span className="capitalize">{trait}:</span>
                <span>{value}/10</span>
              </div>
            ))}
          </div>
        </button>
        
        <p className="text-xs text-muted-foreground">
          This personality profile is generated based on your character's type, description, and mood.
        </p>
      </div>
    );
  };
  
  // Render opening line suggestions
  const renderOpeningLineSuggestions = () => {
    if (!Array.isArray(suggestions.opening_line) || suggestions.opening_line.length === 0) {
      return (
        <div className="text-sm text-muted-foreground p-4">
          No opening line suggestions available.
        </div>
      );
    }
    
    return (
      <div className="space-y-3 p-4">
        {suggestions.opening_line.map((line, index) => (
          <button
            key={index}
            onClick={() => handleApplySuggestion("opening_line", line)}
            className={`w-full p-3 rounded-md text-left transition-colors ${
              isSuggestionApplied("opening_line", line)
                ? "bg-primary/20 border border-primary"
                : "bg-secondary hover:bg-secondary/80 border border-transparent"
            }`}
          >
            <div className="flex items-start justify-between">
              <p className="text-sm italic line-clamp-3">"{line}"</p>
              <div className="ml-2 mt-1 flex-shrink-0">
                {isSuggestionApplied("opening_line", line) ? (
                  <Check className="h-4 w-4 text-primary" />
                ) : (
                  <Plus className="h-4 w-4 opacity-60" />
                )}
              </div>
            </div>
          </button>
        ))}
      </div>
    );
  };
  
  return (
    <div className="w-full md:w-80 border-l bg-background/50 flex flex-col h-full">
      <div className="p-4 border-b">
        <div className="flex items-center">
          <Sparkles className="h-5 w-5 text-primary mr-2" />
          <h3 className="font-medium">AI Suggestions</h3>
        </div>
        <p className="text-xs text-muted-foreground mt-1">
          Real-time suggestions based on your character details
        </p>
      </div>
      
      {/* Suggestion type tabs */}
      <div className="flex overflow-x-auto border-b">
        {availableSuggestionTypes.map((type) => (
          <button
            key={type}
            onClick={() => setActiveSuggestionType(type)}
            className={`px-3 py-2 text-sm whitespace-nowrap ${
              activeSuggestionType === type
                ? "border-b-2 border-primary text-primary"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            {type === "name"
              ? "Name"
              : type === "description"
              ? "Description"
              : type === "mood"
              ? "Mood"
              : type === "personality"
              ? "Personality"
              : type === "opening_line"
              ? "Opening Line"
              : type}
          </button>
        ))}
      </div>
      
      {/* Suggestion content */}
      <div className="flex-1 overflow-y-auto">
        {renderSuggestions()}
      </div>
    </div>
  );
};

export default SuggestionPanel;
