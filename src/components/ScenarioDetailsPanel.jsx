import { useState } from "react";
import { 
  MapPin, 
  Clock, 
  Cloud, 
  Target, 
  AlertTriangle, 
  Heart, 
  Edit, 
  Check, 
  X,
  Save,
  Plus
} from "lucide-react";

/**
 * Component for displaying and editing detailed scenario information
 * 
 * @param {Object} props - Component props
 * @param {string} props.scenarioDescription - The current scenario description
 * @param {Array} props.characters - The characters in the scenario
 * @param {Function} props.onUpdate - Function to call when scenario details are updated
 * @returns {JSX.Element} - The rendered component
 */
const ScenarioDetailsPanel = ({ 
  scenarioDescription, 
  characters = [],
  onUpdate
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [scenarioDetails, setScenarioDetails] = useState({
    setting: "",
    time: "",
    atmosphere: "",
    goal: "",
    obstacle: "",
    relationships: "",
    ...extractScenarioDetails(scenarioDescription)
  });
  
  // Extract details from the scenario description
  function extractScenarioDetails(description) {
    if (!description) return {};
    
    const details = {};
    
    // Simple pattern matching for common scenario elements
    const settingMatch = description.match(/(?:in|at|near) (the |a |an )?([^,.]+)/i);
    if (settingMatch) details.setting = settingMatch[2].trim();
    
    const timeMatch = description.match(/(?:during|at|in the) (morning|afternoon|evening|night|dawn|dusk|day)/i);
    if (timeMatch) details.time = timeMatch[1].trim();
    
    const weatherMatch = description.match(/(?:with|under|during) (?:a |the )?([^,.]+(?:rain|snow|sun|cloud|storm|wind|fog|mist))/i);
    if (weatherMatch) details.atmosphere = weatherMatch[1].trim();
    
    const goalMatch = description.match(/(?:trying to|seeking|looking for|searching for|aiming to) ([^,.]+)/i);
    if (goalMatch) details.goal = goalMatch[1].trim();
    
    const obstacleMatch = description.match(/(?:but|however|unfortunately|despite) ([^,.]+)/i);
    if (obstacleMatch) details.obstacle = obstacleMatch[1].trim();
    
    // Check for character relationships
    if (characters.length >= 2) {
      const char1 = characters[0].name;
      const char2 = characters[1].name;
      const relationshipMatch = description.match(new RegExp(`${char1}[^,.]+${char2}|${char2}[^,.]+${char1}`, 'i'));
      if (relationshipMatch) details.relationships = relationshipMatch[0].trim();
    }
    
    return details;
  }
  
  // Handle input changes
  const handleChange = (field, value) => {
    setScenarioDetails(prev => ({
      ...prev,
      [field]: value
    }));
  };
  
  // Save changes
  const handleSave = () => {
    // Construct an enhanced description from the details
    const enhancedDescription = constructEnhancedDescription();
    onUpdate(enhancedDescription);
    setIsEditing(false);
  };
  
  // Construct an enhanced description from the details
  const constructEnhancedDescription = () => {
    let description = scenarioDescription || "";
    
    // Add setting if it's not already in the description
    if (scenarioDetails.setting && !description.toLowerCase().includes(scenarioDetails.setting.toLowerCase())) {
      description = `${description.trim()} The scene takes place in ${scenarioDetails.setting}.`.trim();
    }
    
    // Add time if it's not already in the description
    if (scenarioDetails.time && !description.toLowerCase().includes(scenarioDetails.time.toLowerCase())) {
      description = `${description.trim()} It's ${scenarioDetails.time}.`.trim();
    }
    
    // Add atmosphere if it's not already in the description
    if (scenarioDetails.atmosphere && !description.toLowerCase().includes(scenarioDetails.atmosphere.toLowerCase())) {
      description = `${description.trim()} The atmosphere is filled with ${scenarioDetails.atmosphere}.`.trim();
    }
    
    // Add goal if it's not already in the description
    if (scenarioDetails.goal && !description.toLowerCase().includes(scenarioDetails.goal.toLowerCase())) {
      description = `${description.trim()} The characters are trying to ${scenarioDetails.goal}.`.trim();
    }
    
    // Add obstacle if it's not already in the description
    if (scenarioDetails.obstacle && !description.toLowerCase().includes(scenarioDetails.obstacle.toLowerCase())) {
      description = `${description.trim()} However, ${scenarioDetails.obstacle}.`.trim();
    }
    
    // Add relationships if it's not already in the description
    if (scenarioDetails.relationships && !description.toLowerCase().includes(scenarioDetails.relationships.toLowerCase())) {
      description = `${description.trim()} ${scenarioDetails.relationships}.`.trim();
    }
    
    return description;
  };
  
  // Detail item component
  const DetailItem = ({ icon, label, value, field }) => (
    <div className="flex items-start gap-2 mb-3">
      <div className="flex-shrink-0 mt-0.5 text-primary/70">
        {icon}
      </div>
      <div className="flex-1">
        <h4 className="text-xs font-medium text-muted-foreground mb-1">{label}</h4>
        {isEditing ? (
          <input
            type="text"
            value={value || ""}
            onChange={(e) => handleChange(field, e.target.value)}
            placeholder={`Add ${label.toLowerCase()}`}
            className="w-full px-2 py-1 text-sm rounded-md border border-input bg-background"
          />
        ) : (
          <p className="text-sm">
            {value || <span className="text-muted-foreground italic">Not specified</span>}
          </p>
        )}
      </div>
    </div>
  );
  
  return (
    <div className="bg-background rounded-lg border border-border shadow-md overflow-hidden animate-fadeIn">
      {/* Header */}
      <div className="flex items-center justify-between p-3 bg-primary/5 border-b">
        <h3 className="font-medium">Scenario Details</h3>
        {!isEditing ? (
          <button
            onClick={() => setIsEditing(true)}
            className="text-xs flex items-center gap-1 text-primary hover:text-primary/80 p-1 rounded-full hover:bg-primary/10"
          >
            <Edit className="h-3.5 w-3.5" />
            <span>Edit</span>
          </button>
        ) : (
          <div className="flex items-center gap-1">
            <button
              onClick={() => setIsEditing(false)}
              className="p-1 rounded-full hover:bg-secondary/50"
              title="Cancel"
            >
              <X className="h-3.5 w-3.5" />
            </button>
            <button
              onClick={handleSave}
              className="p-1 rounded-full hover:bg-primary/20 text-primary"
              title="Save changes"
            >
              <Save className="h-3.5 w-3.5" />
            </button>
          </div>
        )}
      </div>
      
      {/* Content */}
      <div className="p-4">
        <DetailItem 
          icon={<MapPin className="h-4 w-4" />} 
          label="Setting" 
          value={scenarioDetails.setting}
          field="setting"
        />
        
        <DetailItem 
          icon={<Clock className="h-4 w-4" />} 
          label="Time" 
          value={scenarioDetails.time}
          field="time"
        />
        
        <DetailItem 
          icon={<Cloud className="h-4 w-4" />} 
          label="Atmosphere" 
          value={scenarioDetails.atmosphere}
          field="atmosphere"
        />
        
        <DetailItem 
          icon={<Target className="h-4 w-4" />} 
          label="Goal" 
          value={scenarioDetails.goal}
          field="goal"
        />
        
        <DetailItem 
          icon={<AlertTriangle className="h-4 w-4" />} 
          label="Obstacle" 
          value={scenarioDetails.obstacle}
          field="obstacle"
        />
        
        <DetailItem 
          icon={<Heart className="h-4 w-4" />} 
          label="Character Relationships" 
          value={scenarioDetails.relationships}
          field="relationships"
        />
        
        {isEditing && (
          <div className="mt-4 pt-3 border-t">
            <button
              onClick={handleSave}
              className="w-full py-2 rounded-md bg-primary text-primary-foreground text-sm hover:bg-primary/90 flex items-center justify-center gap-1"
            >
              <Plus className="h-4 w-4" />
              Add Details to Scenario
            </button>
            <p className="text-xs text-muted-foreground text-center mt-2">
              These details will be incorporated into your scenario description
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ScenarioDetailsPanel;
