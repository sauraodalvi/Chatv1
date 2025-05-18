/**
 * Utility functions for managing user-created characters in Velora
 */

/**
 * Get all user-created characters from localStorage
 * @returns {Array} Array of user character objects
 */
export const getUserCharacters = () => {
  try {
    const characters = JSON.parse(localStorage.getItem('velora-user-characters') || '[]');
    return Array.isArray(characters) ? characters : [];
  } catch (error) {
    console.error('Error retrieving user characters:', error);
    return [];
  }
};

/**
 * Save a new user character to localStorage
 * @param {Object} character - The character object to save
 * @returns {boolean} Success status
 */
export const saveUserCharacter = (character) => {
  try {
    // Validate required fields
    if (!character.name || !character.type || !character.description) {
      console.error('Character missing required fields');
      return false;
    }

    // Ensure the character has all required properties
    const completeCharacter = {
      ...character,
      // Add any missing required fields
      mood: character.mood || 'neutral',
      background: character.description,
      catchphrases: character.catchphrases || [],
      // Ensure these properties are properly set
      talkativeness: character.talkativeness || 5,
      thinkingSpeed: character.thinkingSpeed || 1.0,
      personality: {
        analytical: character.personality?.analytical || 5,
        emotional: character.personality?.emotional || 5,
        philosophical: character.personality?.philosophical || 5,
        humor: character.personality?.humor || 5,
        confidence: character.personality?.confidence || 5,
        // Add any other personality traits that might be expected
        creativity: character.personality?.creativity || 5,
        sociability: character.personality?.sociability || 5
      },
      // Ensure opening line is set
      opening_line: character.opening_line || `Hello, I'm ${character.name}.`,
      // Add a unique ID and creation timestamp
      id: character.id || `user-char-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      isUserCreated: true,
      createdAt: character.createdAt || new Date().toISOString()
    };

    // Get existing characters
    const existingCharacters = getUserCharacters();
    
    // Check if this is an update to an existing character
    const existingIndex = existingCharacters.findIndex(c => c.id === completeCharacter.id);
    
    if (existingIndex >= 0) {
      // Update existing character
      existingCharacters[existingIndex] = {
        ...completeCharacter,
        updatedAt: new Date().toISOString()
      };
    } else {
      // Add new character
      existingCharacters.push(completeCharacter);
    }
    
    // Save back to localStorage
    localStorage.setItem('velora-user-characters', JSON.stringify(existingCharacters));
    return true;
  } catch (error) {
    console.error('Error saving user character:', error);
    return false;
  }
};

/**
 * Delete a user character from localStorage
 * @param {string} characterId - ID of the character to delete
 * @returns {boolean} Success status
 */
export const deleteUserCharacter = (characterId) => {
  try {
    const existingCharacters = getUserCharacters();
    const filteredCharacters = existingCharacters.filter(c => c.id !== characterId);
    
    if (filteredCharacters.length === existingCharacters.length) {
      // No character was removed
      return false;
    }
    
    localStorage.setItem('velora-user-characters', JSON.stringify(filteredCharacters));
    return true;
  } catch (error) {
    console.error('Error deleting user character:', error);
    return false;
  }
};

/**
 * Get a user character by ID
 * @param {string} characterId - ID of the character to retrieve
 * @returns {Object|null} The character object or null if not found
 */
export const getUserCharacterById = (characterId) => {
  try {
    const characters = getUserCharacters();
    return characters.find(c => c.id === characterId) || null;
  } catch (error) {
    console.error('Error retrieving user character by ID:', error);
    return null;
  }
};

/**
 * Create a default template for a new user character
 * @param {string} type - Character type (fantasy, scifi, etc.)
 * @returns {Object} A new character template
 */
export const createUserCharacterTemplate = (type = 'modern') => {
  return {
    name: '',
    description: '',
    type: type,
    mood: 'neutral',
    avatar: '',
    opening_line: '',
    personality: {
      analytical: 5,
      emotional: 5,
      philosophical: 5,
      humor: 5,
      confidence: 5,
      creativity: 5,
      sociability: 5
    },
    voiceStyle: '',
    talkativeness: 5,
    thinkingSpeed: 1.0,
    isUserCreated: true
  };
};
