import { useState, useEffect } from 'react';
import { X, Save, Trash2, Upload, Camera, User, Wand2 } from 'lucide-react';
import { saveUserCharacter, createUserCharacterTemplate } from '../utils/userCharacterUtils';
import { generateCharacterFromDescription } from '../utils/aiGenerationUtils';

const UserCharacterForm = ({ 
  initialCharacter = null, 
  onSave, 
  onCancel,
  onDelete
}) => {
  const [character, setCharacter] = useState(
    initialCharacter || createUserCharacterTemplate()
  );
  const [characterDescription, setCharacterDescription] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [avatarPreview, setAvatarPreview] = useState(initialCharacter?.avatar || '');
  const [errors, setErrors] = useState({});

  // Character type options
  const characterTypes = [
    { value: 'fantasy', label: 'Fantasy' },
    { value: 'scifi', label: 'Sci-Fi' },
    { value: 'historical', label: 'Historical' },
    { value: 'modern', label: 'Modern' },
    { value: 'superhero', label: 'Superhero' },
    { value: 'adventure', label: 'Adventure' },
  ];

  // Mood options
  const moodOptions = [
    'Neutral', 'Happy', 'Sad', 'Angry', 'Excited', 'Nervous', 
    'Calm', 'Curious', 'Determined', 'Mysterious', 'Playful', 
    'Serious', 'Thoughtful', 'Confident', 'Shy', 'Conflicted'
  ];

  // Handle form input changes
  const handleChange = (field, value) => {
    if (field.startsWith('personality.')) {
      const personalityField = field.split('.')[1];
      setCharacter(prev => ({
        ...prev,
        personality: {
          ...prev.personality,
          [personalityField]: value
        }
      }));
    } else {
      setCharacter(prev => ({
        ...prev,
        [field]: value
      }));
    }
  };

  // Generate character from description
  const handleGenerateCharacter = () => {
    if (!characterDescription || characterDescription.trim() === '') {
      setErrors({...errors, description: 'Please enter a description'});
      return;
    }

    setIsGenerating(true);
    setErrors({});

    // Generate character using our utility function
    setTimeout(() => {
      const generatedCharacter = generateCharacterFromDescription(characterDescription);

      if (generatedCharacter) {
        // Update the form with the generated character
        setCharacter({
          ...generatedCharacter,
          // Preserve the ID if editing an existing character
          id: character.id || null,
          isUserCreated: true,
          // Ensure all required properties are set
          personality: {
            analytical: generatedCharacter.personality?.analytical || 5,
            emotional: generatedCharacter.personality?.emotional || 5,
            philosophical: generatedCharacter.personality?.philosophical || 5,
            humor: generatedCharacter.personality?.humor || 5,
            confidence: generatedCharacter.personality?.confidence || 5,
            creativity: generatedCharacter.personality?.creativity || 5,
            sociability: generatedCharacter.personality?.sociability || 5
          }
        });
        
        // Update avatar preview if available
        if (generatedCharacter.avatar) {
          setAvatarPreview(generatedCharacter.avatar);
        }
      }

      setIsGenerating(false);
    }, 1000);
  };

  // Handle avatar upload
  const handleAvatarUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Check file size (max 2MB)
    if (file.size > 2 * 1024 * 1024) {
      setErrors({...errors, avatar: 'Image too large (max 2MB)'});
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      setAvatarPreview(event.target.result);
      handleChange('avatar', event.target.result);
    };
    reader.readAsDataURL(file);
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Validate form
    const newErrors = {};
    if (!character.name) newErrors.name = 'Name is required';
    if (!character.description) newErrors.description = 'Description is required';
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    
    // Save character
    const success = saveUserCharacter(character);
    
    if (success && onSave) {
      onSave(character);
    }
  };

  // Handle delete
  const handleDelete = () => {
    if (onDelete && character.id) {
      onDelete(character.id);
    }
  };

  return (
    <div className="max-w-3xl mx-auto">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">
          {initialCharacter ? 'Edit Your Character' : 'Create Your Character'}
        </h2>
        <button 
          onClick={onCancel}
          className="p-1.5 rounded-full hover:bg-secondary/50 transition-colors"
        >
          <X className="h-5 w-5" />
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Character Description Generator */}
        <div className="p-4 border border-primary/20 rounded-md bg-primary/5 mb-6">
          <h3 className="text-sm font-medium mb-2 flex items-center gap-1">
            <Wand2 className="h-4 w-4" />
            <span>AI Character Generator</span>
          </h3>
          <p className="text-xs text-muted-foreground mb-3">
            Describe your character in a few words, and we'll create a complete profile with personality, background, and more.
          </p>
          <div className="flex flex-col gap-3">
            <div className="flex gap-2">
              <textarea
                value={characterDescription}
                onChange={(e) => setCharacterDescription(e.target.value)}
                placeholder="e.g., A wise old wizard with a mysterious past and a dry sense of humor"
                className="flex-1 px-3 py-2 rounded-md border border-input bg-background min-h-[80px]"
              />
              <button
                type="button"
                onClick={handleGenerateCharacter}
                disabled={isGenerating}
                className="px-3 py-2 rounded-md bg-primary text-primary-foreground hover:bg-primary/90 transition-colors disabled:opacity-50"
              >
                {isGenerating ? (
                  <div className="flex items-center gap-1">
                    <span className="animate-spin">⟳</span>
                    <span>Generating...</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-1">
                    <Wand2 className="h-4 w-4" />
                    <span>Generate</span>
                  </div>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Basic Info */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Character Name*</label>
            <input
              type="text"
              value={character.name}
              onChange={(e) => handleChange('name', e.target.value)}
              placeholder="e.g., Elara Nightshade"
              className={`w-full px-3 py-2 rounded-md border ${errors.name ? 'border-red-500' : 'border-input'} bg-background`}
              required
            />
            {errors.name && <p className="text-xs text-red-500 mt-1">{errors.name}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Character Type*</label>
            <select
              value={character.type}
              onChange={(e) => handleChange('type', e.target.value)}
              className="w-full px-3 py-2 rounded-md border border-input bg-background"
              required
            >
              {characterTypes.map(type => (
                <option key={type.value} value={type.value}>{type.label}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm font-medium mb-1">Character Description*</label>
          <textarea
            value={character.description}
            onChange={(e) => handleChange('description', e.target.value)}
            placeholder="Describe your character's appearance, background, and personality..."
            className={`w-full px-3 py-2 rounded-md border ${errors.description ? 'border-red-500' : 'border-input'} bg-background min-h-[100px]`}
            required
          />
          {errors.description && <p className="text-xs text-red-500 mt-1">{errors.description}</p>}
        </div>

        {/* Mood and Avatar */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Current Mood*</label>
            <select
              value={character.mood}
              onChange={(e) => handleChange('mood', e.target.value)}
              className="w-full px-3 py-2 rounded-md border border-input bg-background"
              required
            >
              {moodOptions.map(mood => (
                <option key={mood.toLowerCase()} value={mood.toLowerCase()}>{mood}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Character Avatar</label>
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full overflow-hidden border border-input flex-shrink-0">
                {avatarPreview ? (
                  <img
                    src={avatarPreview}
                    alt={character.name || "Character avatar"}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className={`w-full h-full flex items-center justify-center ${
                    character.type === 'fantasy' ? 'bg-purple-500' :
                    character.type === 'scifi' ? 'bg-blue-500' :
                    character.type === 'historical' ? 'bg-amber-500' :
                    character.type === 'superhero' ? 'bg-red-500' :
                    character.type === 'adventure' ? 'bg-orange-500' :
                    'bg-green-500'
                  } text-white`}>
                    <User className="h-6 w-6" />
                  </div>
                )}
              </div>
              <div className="flex-1">
                <div className="flex gap-2">
                  <label className="flex-1 flex items-center gap-1 px-3 py-1.5 rounded-md bg-secondary/50 hover:bg-secondary cursor-pointer text-sm">
                    <Upload className="h-4 w-4" />
                    <span>Upload Image</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleAvatarUpload}
                      className="hidden"
                    />
                  </label>
                  <button
                    type="button"
                    onClick={() => {
                      setAvatarPreview('');
                      handleChange('avatar', '');
                    }}
                    className="px-3 py-1.5 rounded-md bg-secondary/50 hover:bg-secondary text-sm"
                  >
                    Clear
                  </button>
                </div>
                {errors.avatar && <p className="text-xs text-red-500 mt-1">{errors.avatar}</p>}
                <p className="text-xs text-muted-foreground mt-1">
                  Or paste an image URL in the field below
                </p>
                <input
                  type="text"
                  value={character.avatar}
                  onChange={(e) => {
                    handleChange('avatar', e.target.value);
                    setAvatarPreview(e.target.value);
                  }}
                  placeholder="https://example.com/image.jpg"
                  className="w-full px-3 py-1.5 mt-1 rounded-md border border-input bg-background text-sm"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Opening Line */}
        <div>
          <label className="block text-sm font-medium mb-1">Opening Line</label>
          <input
            type="text"
            value={character.opening_line}
            onChange={(e) => handleChange('opening_line', e.target.value)}
            placeholder={`Hello, I'm ${character.name || 'your character'}...`}
            className="w-full px-3 py-2 rounded-md border border-input bg-background"
          />
          <p className="text-xs text-muted-foreground mt-1">
            This is how your character will introduce themselves in a conversation
          </p>
        </div>

        {/* Personality Traits */}
        <div>
          <h3 className="text-sm font-medium mb-2">Personality Traits</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {/* Analytical */}
            <div>
              <div className="flex justify-between">
                <label className="text-xs">Analytical</label>
                <span className="text-xs">{character.personality?.analytical || 5}/10</span>
              </div>
              <input
                type="range"
                min="1"
                max="10"
                value={character.personality?.analytical || 5}
                onChange={(e) => handleChange('personality.analytical', parseInt(e.target.value))}
                className="w-full"
              />
            </div>
            
            {/* Emotional */}
            <div>
              <div className="flex justify-between">
                <label className="text-xs">Emotional</label>
                <span className="text-xs">{character.personality?.emotional || 5}/10</span>
              </div>
              <input
                type="range"
                min="1"
                max="10"
                value={character.personality?.emotional || 5}
                onChange={(e) => handleChange('personality.emotional', parseInt(e.target.value))}
                className="w-full"
              />
            </div>
            
            {/* Philosophical */}
            <div>
              <div className="flex justify-between">
                <label className="text-xs">Philosophical</label>
                <span className="text-xs">{character.personality?.philosophical || 5}/10</span>
              </div>
              <input
                type="range"
                min="1"
                max="10"
                value={character.personality?.philosophical || 5}
                onChange={(e) => handleChange('personality.philosophical', parseInt(e.target.value))}
                className="w-full"
              />
            </div>
            
            {/* Humor */}
            <div>
              <div className="flex justify-between">
                <label className="text-xs">Humor</label>
                <span className="text-xs">{character.personality?.humor || 5}/10</span>
              </div>
              <input
                type="range"
                min="1"
                max="10"
                value={character.personality?.humor || 5}
                onChange={(e) => handleChange('personality.humor', parseInt(e.target.value))}
                className="w-full"
              />
            </div>
            
            {/* Confidence */}
            <div>
              <div className="flex justify-between">
                <label className="text-xs">Confidence</label>
                <span className="text-xs">{character.personality?.confidence || 5}/10</span>
              </div>
              <input
                type="range"
                min="1"
                max="10"
                value={character.personality?.confidence || 5}
                onChange={(e) => handleChange('personality.confidence', parseInt(e.target.value))}
                className="w-full"
              />
            </div>
            
            {/* Creativity */}
            <div>
              <div className="flex justify-between">
                <label className="text-xs">Creativity</label>
                <span className="text-xs">{character.personality?.creativity || 5}/10</span>
              </div>
              <input
                type="range"
                min="1"
                max="10"
                value={character.personality?.creativity || 5}
                onChange={(e) => handleChange('personality.creativity', parseInt(e.target.value))}
                className="w-full"
              />
            </div>
          </div>
        </div>

        {/* Voice and Talkativeness */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Voice Style</label>
            <input
              type="text"
              value={character.voiceStyle || ''}
              onChange={(e) => handleChange('voiceStyle', e.target.value)}
              placeholder="e.g., formal and eloquent, casual and slangy"
              className="w-full px-3 py-2 rounded-md border border-input bg-background"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Talkativeness</label>
            <div className="flex items-center gap-2">
              <span className="text-xs">Quiet</span>
              <input
                type="range"
                min="1"
                max="10"
                value={character.talkativeness || 5}
                onChange={(e) => handleChange('talkativeness', parseInt(e.target.value))}
                className="flex-1"
              />
              <span className="text-xs">Chatty</span>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-between pt-4 border-t border-border">
          {initialCharacter ? (
            <button
              type="button"
              onClick={handleDelete}
              className="px-4 py-2 rounded-md bg-red-500/10 text-red-500 hover:bg-red-500/20 transition-colors flex items-center gap-1"
            >
              <Trash2 className="h-4 w-4" />
              <span>Delete Character</span>
            </button>
          ) : (
            <button
              type="button"
              onClick={onCancel}
              className="px-4 py-2 rounded-md bg-secondary/50 hover:bg-secondary transition-colors"
            >
              Cancel
            </button>
          )}
          <button
            type="submit"
            className="px-4 py-2 rounded-md bg-primary text-primary-foreground hover:bg-primary/90 transition-colors flex items-center gap-1"
          >
            <Save className="h-4 w-4" />
            <span>Save Character</span>
          </button>
        </div>
      </form>
    </div>
  );
};

export default UserCharacterForm;
