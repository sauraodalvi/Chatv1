import { useState } from "react";
import { Edit, X, Check, User, Pencil } from "lucide-react";
import MoodIndicator from "./MoodIndicator";

/**
 * Component for displaying and editing character details
 * 
 * @param {Object} props - Component props
 * @param {Object} props.character - The character object to display
 * @param {Function} props.onUpdate - Function to call when character is updated
 * @param {Function} props.onClose - Function to call when the card is closed
 * @returns {JSX.Element} - The rendered component
 */
const CharacterDetailsCard = ({ character, onUpdate, onClose }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedCharacter, setEditedCharacter] = useState({ ...character });
  
  // Handle input changes
  const handleChange = (field, value) => {
    if (field.startsWith("personality.")) {
      const personalityField = field.split(".")[1];
      setEditedCharacter(prev => ({
        ...prev,
        personality: {
          ...prev.personality,
          [personalityField]: value
        }
      }));
    } else {
      setEditedCharacter(prev => ({
        ...prev,
        [field]: value
      }));
    }
  };
  
  // Save changes
  const handleSave = () => {
    onUpdate(editedCharacter);
    setIsEditing(false);
  };
  
  // Cancel editing
  const handleCancel = () => {
    setEditedCharacter({ ...character });
    setIsEditing(false);
  };
  
  // Get background color based on character type
  const getTypeColor = (type) => {
    switch (type?.toLowerCase()) {
      case 'fantasy': return 'bg-purple-100 text-purple-800';
      case 'scifi': return 'bg-blue-100 text-blue-800';
      case 'historical': return 'bg-amber-100 text-amber-800';
      case 'modern': return 'bg-green-100 text-green-800';
      case 'superhero': return 'bg-red-100 text-red-800';
      case 'adventure': return 'bg-teal-100 text-teal-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };
  
  return (
    <div className="bg-background rounded-lg border border-border shadow-md overflow-hidden animate-fadeIn">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b">
        <h3 className="font-bold text-lg">Character Details</h3>
        <button 
          onClick={onClose}
          className="p-1 rounded-full hover:bg-secondary/50"
          title="Close"
        >
          <X className="h-5 w-5" />
        </button>
      </div>
      
      {/* Content */}
      <div className="p-4">
        {/* Avatar and basic info */}
        <div className="flex gap-4 mb-6">
          <div className="flex-shrink-0">
            {character.avatar ? (
              <img 
                src={character.avatar} 
                alt={character.name}
                className="w-20 h-20 rounded-full object-cover border-2 border-primary/20"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(character.name)}&background=random`;
                }}
              />
            ) : (
              <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center border-2 border-primary/20">
                <User className="h-10 w-10 text-primary/50" />
              </div>
            )}
          </div>
          
          <div className="flex-1">
            {isEditing ? (
              <input
                type="text"
                value={editedCharacter.name}
                onChange={(e) => handleChange("name", e.target.value)}
                className="w-full px-3 py-2 rounded-md border border-input bg-background font-bold text-xl mb-2"
              />
            ) : (
              <h2 className="font-bold text-xl mb-2">{character.name}</h2>
            )}
            
            <div className="flex items-center gap-2 mb-2">
              {isEditing ? (
                <select
                  value={editedCharacter.type}
                  onChange={(e) => handleChange("type", e.target.value)}
                  className="px-2 py-1 rounded text-xs border border-input bg-background"
                >
                  <option value="fantasy">Fantasy</option>
                  <option value="scifi">Sci-Fi</option>
                  <option value="historical">Historical</option>
                  <option value="modern">Modern</option>
                  <option value="superhero">Superhero</option>
                  <option value="adventure">Adventure</option>
                </select>
              ) : (
                <span className={`px-2 py-0.5 rounded text-xs ${getTypeColor(character.type)}`}>
                  {character.type}
                </span>
              )}
              
              {isEditing ? (
                <select
                  value={editedCharacter.mood}
                  onChange={(e) => handleChange("mood", e.target.value)}
                  className="px-2 py-1 rounded text-xs border border-input bg-background"
                >
                  <option value="neutral">Neutral</option>
                  <option value="happy">Happy</option>
                  <option value="sad">Sad</option>
                  <option value="angry">Angry</option>
                  <option value="excited">Excited</option>
                  <option value="nervous">Nervous</option>
                  <option value="curious">Curious</option>
                </select>
              ) : (
                <div className="flex items-center gap-1">
                  <MoodIndicator mood={character.mood} showLabel={true} />
                </div>
              )}
            </div>
            
            {!isEditing && (
              <button
                onClick={() => setIsEditing(true)}
                className="text-xs flex items-center gap-1 text-primary hover:text-primary/80"
              >
                <Pencil className="h-3 w-3" />
                <span>Edit Character</span>
              </button>
            )}
          </div>
        </div>
        
        {/* Description */}
        <div className="mb-4">
          <h4 className="font-medium text-sm mb-1">Description</h4>
          {isEditing ? (
            <textarea
              value={editedCharacter.description}
              onChange={(e) => handleChange("description", e.target.value)}
              className="w-full px-3 py-2 rounded-md border border-input bg-background min-h-[80px] text-sm"
            />
          ) : (
            <p className="text-sm bg-secondary/20 p-3 rounded-md">{character.description}</p>
          )}
        </div>
        
        {/* Opening Line */}
        {(character.opening_line || isEditing) && (
          <div className="mb-4">
            <h4 className="font-medium text-sm mb-1">Opening Line</h4>
            {isEditing ? (
              <textarea
                value={editedCharacter.opening_line || ""}
                onChange={(e) => handleChange("opening_line", e.target.value)}
                className="w-full px-3 py-2 rounded-md border border-input bg-background min-h-[60px] text-sm"
                placeholder="How this character might introduce themselves..."
              />
            ) : (
              <p className="text-sm italic border-l-2 border-primary/30 pl-3 py-1">
                "{character.opening_line}"
              </p>
            )}
          </div>
        )}
        
        {/* Personality Traits (if editing) */}
        {isEditing && character.personality && (
          <div className="mb-4">
            <h4 className="font-medium text-sm mb-2">Personality Traits</h4>
            <div className="grid grid-cols-2 gap-3">
              {Object.entries(character.personality).map(([trait, value]) => (
                <div key={trait} className="flex flex-col">
                  <label className="text-xs capitalize mb-1">{trait}</label>
                  <input
                    type="range"
                    min="1"
                    max="10"
                    value={editedCharacter.personality[trait] || value}
                    onChange={(e) => handleChange(`personality.${trait}`, parseInt(e.target.value))}
                    className="w-full"
                  />
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>Low</span>
                    <span>High</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
        
        {/* Edit controls */}
        {isEditing && (
          <div className="flex justify-end gap-2 mt-4">
            <button
              onClick={handleCancel}
              className="px-3 py-1.5 rounded-md border border-input bg-background text-sm hover:bg-secondary/50"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              className="px-3 py-1.5 rounded-md bg-primary text-primary-foreground text-sm hover:bg-primary/90 flex items-center gap-1"
            >
              <Check className="h-4 w-4" />
              Save Changes
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default CharacterDetailsCard;
