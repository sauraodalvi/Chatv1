import { useState, useEffect } from "react";
import {
  ArrowLeft,
  Check,
  ChevronRight,
  Sparkles,
  Wand2,
  User,
  Sword,
  Rocket,
  Clock,
  Zap,
  Map,
  X,
  Save,
  Palette,
  Sliders,
  MessageSquare,
  Heart,
  Brain,
  Laugh,
  Lightbulb,
  Users,
  Loader,
} from "lucide-react";
import SuggestionPanel from "./SuggestionPanel";
import TemplateGallery from "./TemplateGallery";
import { generateRealtimeSuggestions, getCharacterTemplates } from "../../utils/character-suggestion/suggestionUtils";
import { createUserCharacterTemplate } from "../../utils/userCharacterUtils";

/**
 * Enhanced Character Creation Panel with AI-powered suggestions
 */
const CharacterCreationPanel = ({ onSave, onCancel, initialCharacter = null }) => {
  // Creation steps
  const STEPS = ["template", "basics", "personality", "details", "review"];
  const [currentStep, setCurrentStep] = useState("template");
  
  // Character state
  const [character, setCharacter] = useState(
    initialCharacter || createUserCharacterTemplate()
  );
  
  // Field being edited for focused suggestions
  const [activeField, setActiveField] = useState("");
  
  // Suggestions state
  const [suggestions, setSuggestions] = useState({});
  const [isGeneratingSuggestions, setIsGeneratingSuggestions] = useState(false);
  
  // Templates
  const [templates, setTemplates] = useState(getCharacterTemplates());
  
  // Generate suggestions when character data changes
  useEffect(() => {
    if (currentStep !== "template") {
      setIsGeneratingSuggestions(true);
      
      // Simulate API delay
      const timer = setTimeout(() => {
        const newSuggestions = generateRealtimeSuggestions(character, activeField);
        setSuggestions(newSuggestions);
        setIsGeneratingSuggestions(false);
      }, 500);
      
      return () => clearTimeout(timer);
    }
  }, [character, activeField, currentStep]);
  
  // Handle field changes
  const handleChange = (field, value) => {
    if (field.startsWith("personality.")) {
      const personalityField = field.split(".")[1];
      setCharacter((prev) => ({
        ...prev,
        personality: {
          ...prev.personality,
          [personalityField]: value,
        },
      }));
    } else {
      setCharacter((prev) => ({
        ...prev,
        [field]: value,
      }));
    }
  };
  
  // Apply a suggestion
  const applySuggestion = (field, value) => {
    handleChange(field, value);
  };
  
  // Apply a template
  const applyTemplate = (template) => {
    setCharacter({
      ...createUserCharacterTemplate(template.type),
      ...template,
      isUserCreated: true,
    });
    setCurrentStep("basics");
  };
  
  // Navigate to next step
  const goToNextStep = () => {
    const currentIndex = STEPS.indexOf(currentStep);
    if (currentIndex < STEPS.length - 1) {
      setCurrentStep(STEPS[currentIndex + 1]);
    } else {
      handleSave();
    }
  };
  
  // Navigate to previous step
  const goToPrevStep = () => {
    const currentIndex = STEPS.indexOf(currentStep);
    if (currentIndex > 0) {
      setCurrentStep(STEPS[currentIndex - 1]);
    } else {
      onCancel();
    }
  };
  
  // Save the character
  const handleSave = () => {
    // Ensure all required fields are set
    const finalCharacter = {
      ...character,
      background: character.description,
      catchphrases: character.catchphrases || [],
    };
    
    onSave(finalCharacter);
  };
  
  // Check if current step is valid
  const isCurrentStepValid = () => {
    switch (currentStep) {
      case "template":
        return true; // Can always proceed from template selection
      case "basics":
        return character.name && character.type && character.description;
      case "personality":
        return true; // Personality traits have defaults
      case "details":
        return character.opening_line && character.mood;
      case "review":
        return true;
      default:
        return false;
    }
  };
  
  // Render the current step content
  const renderStepContent = () => {
    switch (currentStep) {
      case "template":
        return (
          <TemplateGallery
            templates={templates}
            onSelectTemplate={applyTemplate}
            onSkip={() => setCurrentStep("basics")}
          />
        );
      case "basics":
        return renderBasicsStep();
      case "personality":
        return renderPersonalityStep();
      case "details":
        return renderDetailsStep();
      case "review":
        return renderReviewStep();
      default:
        return null;
    }
  };
  
  // Render the basics step (name, type, description)
  const renderBasicsStep = () => (
    <div className="space-y-6">
      <div className="space-y-2">
        <label className="block text-sm font-medium">Character Name</label>
        <input
          type="text"
          value={character.name}
          onChange={(e) => handleChange("name", e.target.value)}
          onFocus={() => setActiveField("name")}
          className="w-full p-2 border rounded-md bg-background"
          placeholder="Enter character name"
        />
      </div>
      
      <div className="space-y-2">
        <label className="block text-sm font-medium">Character Type</label>
        <div className="grid grid-cols-3 gap-2">
          {templates.categories.map((category) => (
            <button
              key={category.id}
              onClick={() => handleChange("type", category.id)}
              className={`p-2 rounded-md flex flex-col items-center justify-center ${
                character.type === category.id
                  ? "bg-primary text-primary-foreground"
                  : "bg-secondary hover:bg-secondary/80"
              }`}
            >
              {category.id === "fantasy" ? (
                <Sword className="h-5 w-5 mb-1" />
              ) : category.id === "scifi" ? (
                <Rocket className="h-5 w-5 mb-1" />
              ) : category.id === "historical" ? (
                <Clock className="h-5 w-5 mb-1" />
              ) : category.id === "superhero" ? (
                <Zap className="h-5 w-5 mb-1" />
              ) : category.id === "adventure" ? (
                <Map className="h-5 w-5 mb-1" />
              ) : (
                <User className="h-5 w-5 mb-1" />
              )}
              <span className="text-xs">{category.name}</span>
            </button>
          ))}
        </div>
      </div>
      
      <div className="space-y-2">
        <label className="block text-sm font-medium">Character Description</label>
        <textarea
          value={character.description}
          onChange={(e) => handleChange("description", e.target.value)}
          onFocus={() => setActiveField("description")}
          className="w-full p-2 border rounded-md bg-background min-h-[100px]"
          placeholder="Describe your character's background, appearance, and personality"
        />
      </div>
    </div>
  );
  
  // Render the personality step
  const renderPersonalityStep = () => (
    <div className="space-y-6">
      <h3 className="text-lg font-medium">Personality Traits</h3>
      <p className="text-sm text-muted-foreground">
        Adjust the sliders to define your character's personality traits.
      </p>
      
      <div className="space-y-4">
        <div className="space-y-2">
          <div className="flex justify-between">
            <label className="text-sm font-medium flex items-center">
              <Brain className="h-4 w-4 mr-1" /> Analytical
            </label>
            <span className="text-sm">{character.personality.analytical}/10</span>
          </div>
          <input
            type="range"
            min="1"
            max="10"
            value={character.personality.analytical}
            onChange={(e) => handleChange("personality.analytical", parseInt(e.target.value))}
            className="w-full"
          />
          <p className="text-xs text-muted-foreground">
            How logically and methodically your character approaches problems.
          </p>
        </div>
        
        <div className="space-y-2">
          <div className="flex justify-between">
            <label className="text-sm font-medium flex items-center">
              <Heart className="h-4 w-4 mr-1" /> Emotional
            </label>
            <span className="text-sm">{character.personality.emotional}/10</span>
          </div>
          <input
            type="range"
            min="1"
            max="10"
            value={character.personality.emotional}
            onChange={(e) => handleChange("personality.emotional", parseInt(e.target.value))}
            className="w-full"
          />
          <p className="text-xs text-muted-foreground">
            How strongly your character experiences and expresses emotions.
          </p>
        </div>
        
        <div className="space-y-2">
          <div className="flex justify-between">
            <label className="text-sm font-medium flex items-center">
              <Lightbulb className="h-4 w-4 mr-1" /> Philosophical
            </label>
            <span className="text-sm">{character.personality.philosophical}/10</span>
          </div>
          <input
            type="range"
            min="1"
            max="10"
            value={character.personality.philosophical}
            onChange={(e) => handleChange("personality.philosophical", parseInt(e.target.value))}
            className="w-full"
          />
          <p className="text-xs text-muted-foreground">
            How deeply your character contemplates the meaning of events and existence.
          </p>
        </div>
        
        <div className="space-y-2">
          <div className="flex justify-between">
            <label className="text-sm font-medium flex items-center">
              <Laugh className="h-4 w-4 mr-1" /> Humor
            </label>
            <span className="text-sm">{character.personality.humor}/10</span>
          </div>
          <input
            type="range"
            min="1"
            max="10"
            value={character.personality.humor}
            onChange={(e) => handleChange("personality.humor", parseInt(e.target.value))}
            className="w-full"
          />
          <p className="text-xs text-muted-foreground">
            How likely your character is to use humor and appreciate jokes.
          </p>
        </div>
        
        <div className="space-y-2">
          <div className="flex justify-between">
            <label className="text-sm font-medium flex items-center">
              <Zap className="h-4 w-4 mr-1" /> Confidence
            </label>
            <span className="text-sm">{character.personality.confidence}/10</span>
          </div>
          <input
            type="range"
            min="1"
            max="10"
            value={character.personality.confidence}
            onChange={(e) => handleChange("personality.confidence", parseInt(e.target.value))}
            className="w-full"
          />
          <p className="text-xs text-muted-foreground">
            How self-assured and decisive your character is in their actions.
          </p>
        </div>
        
        <div className="space-y-2">
          <div className="flex justify-between">
            <label className="text-sm font-medium flex items-center">
              <Sparkles className="h-4 w-4 mr-1" /> Creativity
            </label>
            <span className="text-sm">{character.personality.creativity}/10</span>
          </div>
          <input
            type="range"
            min="1"
            max="10"
            value={character.personality.creativity}
            onChange={(e) => handleChange("personality.creativity", parseInt(e.target.value))}
            className="w-full"
          />
          <p className="text-xs text-muted-foreground">
            How imaginative and innovative your character is when solving problems.
          </p>
        </div>
        
        <div className="space-y-2">
          <div className="flex justify-between">
            <label className="text-sm font-medium flex items-center">
              <Users className="h-4 w-4 mr-1" /> Sociability
            </label>
            <span className="text-sm">{character.personality.sociability}/10</span>
          </div>
          <input
            type="range"
            min="1"
            max="10"
            value={character.personality.sociability}
            onChange={(e) => handleChange("personality.sociability", parseInt(e.target.value))}
            className="w-full"
          />
          <p className="text-xs text-muted-foreground">
            How comfortable and skilled your character is in social interactions.
          </p>
        </div>
      </div>
    </div>
  );
  
  // Render the details step
  const renderDetailsStep = () => (
    <div className="space-y-6">
      <div className="space-y-2">
        <label className="block text-sm font-medium">Character Mood</label>
        <select
          value={character.mood}
          onChange={(e) => handleChange("mood", e.target.value)}
          onFocus={() => setActiveField("mood")}
          className="w-full p-2 border rounded-md bg-background"
        >
          <option value="">Select a mood...</option>
          {[
            "Neutral", "Happy", "Sad", "Angry", "Excited", "Nervous", 
            "Calm", "Curious", "Determined", "Mysterious", "Playful", 
            "Serious", "Thoughtful", "Confident", "Shy", "Conflicted"
          ].map((mood) => (
            <option key={mood} value={mood.toLowerCase()}>
              {mood}
            </option>
          ))}
        </select>
      </div>
      
      <div className="space-y-2">
        <label className="block text-sm font-medium">Opening Line</label>
        <textarea
          value={character.opening_line}
          onChange={(e) => handleChange("opening_line", e.target.value)}
          onFocus={() => setActiveField("opening_line")}
          className="w-full p-2 border rounded-md bg-background min-h-[80px]"
          placeholder="What's the first thing your character would say?"
        />
      </div>
      
      <div className="space-y-2">
        <label className="block text-sm font-medium">Voice Style (Optional)</label>
        <input
          type="text"
          value={character.voiceStyle || ""}
          onChange={(e) => handleChange("voiceStyle", e.target.value)}
          className="w-full p-2 border rounded-md bg-background"
          placeholder="Describe how your character speaks (e.g., 'formal with a hint of sarcasm')"
        />
      </div>
      
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="block text-sm font-medium">Talkativeness</label>
          <div className="flex items-center">
            <input
              type="range"
              min="1"
              max="10"
              value={character.talkativeness}
              onChange={(e) => handleChange("talkativeness", parseInt(e.target.value))}
              className="w-full"
            />
            <span className="ml-2 text-sm">{character.talkativeness}/10</span>
          </div>
        </div>
        
        <div className="space-y-2">
          <label className="block text-sm font-medium">Thinking Speed</label>
          <div className="flex items-center">
            <input
              type="range"
              min="0.5"
              max="2"
              step="0.1"
              value={character.thinkingSpeed}
              onChange={(e) => handleChange("thinkingSpeed", parseFloat(e.target.value))}
              className="w-full"
            />
            <span className="ml-2 text-sm">{character.thinkingSpeed}x</span>
          </div>
        </div>
      </div>
    </div>
  );
  
  // Render the review step
  const renderReviewStep = () => (
    <div className="space-y-6">
      <h3 className="text-lg font-medium">Review Your Character</h3>
      
      <div className="bg-secondary/30 p-4 rounded-md space-y-4">
        <div>
          <h4 className="font-medium">{character.name}</h4>
          <p className="text-sm text-muted-foreground capitalize">{character.type} • {character.mood}</p>
        </div>
        
        <div>
          <h5 className="text-sm font-medium">Description</h5>
          <p className="text-sm">{character.description}</p>
        </div>
        
        <div>
          <h5 className="text-sm font-medium">Opening Line</h5>
          <p className="text-sm italic">"{character.opening_line}"</p>
        </div>
        
        <div>
          <h5 className="text-sm font-medium">Personality</h5>
          <div className="grid grid-cols-2 gap-x-4 gap-y-1 mt-1">
            <div className="flex justify-between text-xs">
              <span>Analytical:</span>
              <span>{character.personality.analytical}/10</span>
            </div>
            <div className="flex justify-between text-xs">
              <span>Emotional:</span>
              <span>{character.personality.emotional}/10</span>
            </div>
            <div className="flex justify-between text-xs">
              <span>Philosophical:</span>
              <span>{character.personality.philosophical}/10</span>
            </div>
            <div className="flex justify-between text-xs">
              <span>Humor:</span>
              <span>{character.personality.humor}/10</span>
            </div>
            <div className="flex justify-between text-xs">
              <span>Confidence:</span>
              <span>{character.personality.confidence}/10</span>
            </div>
            <div className="flex justify-between text-xs">
              <span>Creativity:</span>
              <span>{character.personality.creativity}/10</span>
            </div>
            <div className="flex justify-between text-xs">
              <span>Sociability:</span>
              <span>{character.personality.sociability}/10</span>
            </div>
          </div>
        </div>
        
        <div className="grid grid-cols-2 gap-4 text-xs">
          <div>
            <span className="font-medium">Talkativeness:</span> {character.talkativeness}/10
          </div>
          <div>
            <span className="font-medium">Thinking Speed:</span> {character.thinkingSpeed}x
          </div>
        </div>
      </div>
      
      <p className="text-sm text-muted-foreground">
        If everything looks good, click "Create Character" to save. Otherwise, go back to make changes.
      </p>
    </div>
  );
  
  return (
    <div className="flex flex-col md:flex-row h-full">
      {/* Left panel - Character form */}
      <div className="flex-1 p-4 overflow-y-auto">
        <div className="mb-4 flex items-center justify-between">
          <button
            onClick={goToPrevStep}
            className="flex items-center text-sm text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="h-4 w-4 mr-1" />
            {currentStep === "template" ? "Cancel" : "Back"}
          </button>
          
          <div className="flex space-x-1">
            {STEPS.map((step, index) => (
              <div
                key={step}
                className={`h-2 w-2 rounded-full ${
                  STEPS.indexOf(currentStep) >= index
                    ? "bg-primary"
                    : "bg-muted"
                }`}
              />
            ))}
          </div>
          
          <button
            onClick={goToNextStep}
            disabled={!isCurrentStepValid()}
            className={`flex items-center text-sm ${
              isCurrentStepValid()
                ? "text-primary hover:text-primary/90"
                : "text-muted-foreground cursor-not-allowed"
            }`}
          >
            {currentStep === "review" ? "Create Character" : "Next"}
            <ChevronRight className="h-4 w-4 ml-1" />
          </button>
        </div>
        
        <div className="mb-6">
          <h2 className="text-xl font-bold">
            {currentStep === "template"
              ? "Choose a Template"
              : currentStep === "basics"
              ? "Basic Information"
              : currentStep === "personality"
              ? "Personality Traits"
              : currentStep === "details"
              ? "Character Details"
              : "Review Character"}
          </h2>
          <p className="text-sm text-muted-foreground">
            {currentStep === "template"
              ? "Start with a template or create from scratch"
              : currentStep === "basics"
              ? "Define who your character is"
              : currentStep === "personality"
              ? "Shape your character's personality traits"
              : currentStep === "details"
              ? "Add finishing touches to your character"
              : "Make sure everything is just right"}
          </p>
        </div>
        
        {renderStepContent()}
      </div>
      
      {/* Right panel - AI suggestions */}
      {currentStep !== "template" && (
        <SuggestionPanel
          suggestions={suggestions}
          isLoading={isGeneratingSuggestions}
          onApplySuggestion={applySuggestion}
          character={character}
        />
      )}
    </div>
  );
};

export default CharacterCreationPanel;
