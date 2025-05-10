/**
 * Utility functions for tracking and managing character moods
 */

/**
 * Initialize a character's mood state
 * 
 * @param {Object} character - The character object
 * @returns {Object} - The initial mood state
 */
export const initializeMoodState = (character) => {
  return {
    characterId: character.name,
    baseMood: character.mood || 'Neutral',
    currentMood: character.mood || 'Neutral',
    intensity: 5, // Range from 1-10
    triggers: [], // What caused mood changes
    lastChange: null, // Timestamp of last mood change
    history: [] // History of mood changes
  };
};

/**
 * Get a mood state for a character, or create it if it doesn't exist
 * 
 * @param {Array} moodStates - Array of all mood states
 * @param {string} characterId - Character's identifier (name)
 * @param {Object} character - The character object (used if state needs to be created)
 * @returns {Object} - The mood state object
 */
export const getMoodState = (moodStates, characterId, character) => {
  // Check if mood state exists
  const existingState = moodStates.find(state => state.characterId === characterId);
  
  if (existingState) {
    return existingState;
  }
  
  // Create new mood state if it doesn't exist
  const newState = initializeMoodState(character);
  moodStates.push(newState);
  return newState;
};

/**
 * Update a character's mood based on an interaction
 * 
 * @param {Object} moodState - The mood state to update
 * @param {string} trigger - What triggered the mood change
 * @param {number} emotionalImpact - How much to change the mood (-3 to +3)
 * @param {string} interactionType - Type of interaction (e.g., 'agreement', 'disagreement', 'question', 'help')
 * @returns {Object} - The updated mood state
 */
export const updateMood = (moodState, trigger, emotionalImpact, interactionType) => {
  // Create a copy of the mood state to update
  const updatedState = { ...moodState };
  
  // Add to mood history
  const moodChange = {
    timestamp: new Date().toISOString(),
    previousMood: updatedState.currentMood,
    trigger: trigger,
    impact: emotionalImpact,
    type: interactionType
  };
  
  updatedState.history = [moodChange, ...updatedState.history].slice(0, 10);
  updatedState.lastChange = moodChange.timestamp;
  
  // Update intensity based on emotional impact
  updatedState.intensity = Math.max(1, Math.min(10, updatedState.intensity + emotionalImpact));
  
  // Update current mood based on intensity and impact
  if (emotionalImpact >= 2) {
    // Strong positive impact
    updatedState.currentMood = getPositiveMood(updatedState.baseMood, updatedState.intensity);
  } else if (emotionalImpact <= -2) {
    // Strong negative impact
    updatedState.currentMood = getNegativeMood(updatedState.baseMood, updatedState.intensity);
  } else if (updatedState.intensity <= 3) {
    // Low intensity - return to neutral
    updatedState.currentMood = 'Neutral';
  }
  
  // Add trigger
  updatedState.triggers.push(trigger);
  if (updatedState.triggers.length > 5) {
    updatedState.triggers.shift(); // Keep only the 5 most recent triggers
  }
  
  return updatedState;
};

/**
 * Get a positive mood variant based on base mood and intensity
 * 
 * @param {string} baseMood - The character's base mood
 * @param {number} intensity - The intensity level (1-10)
 * @returns {string} - A positive mood variant
 */
export const getPositiveMood = (baseMood, intensity) => {
  const baseMoodLower = baseMood.toLowerCase();
  
  // High intensity positive moods
  if (intensity >= 8) {
    if (baseMoodLower.includes('happy') || baseMoodLower.includes('joyful')) {
      return 'Ecstatic';
    } else if (baseMoodLower.includes('calm') || baseMoodLower.includes('peaceful')) {
      return 'Blissful';
    } else if (baseMoodLower.includes('curious') || baseMoodLower.includes('inquisitive')) {
      return 'Fascinated';
    } else if (baseMoodLower.includes('intense')) {
      return 'Passionate';
    } else {
      return 'Elated';
    }
  }
  
  // Medium intensity positive moods
  if (intensity >= 5) {
    if (baseMoodLower.includes('happy') || baseMoodLower.includes('joyful')) {
      return 'Delighted';
    } else if (baseMoodLower.includes('calm') || baseMoodLower.includes('peaceful')) {
      return 'Content';
    } else if (baseMoodLower.includes('curious') || baseMoodLower.includes('inquisitive')) {
      return 'Intrigued';
    } else if (baseMoodLower.includes('intense')) {
      return 'Enthusiastic';
    } else {
      return 'Pleased';
    }
  }
  
  // Low intensity positive moods
  return 'Positive';
};

/**
 * Get a negative mood variant based on base mood and intensity
 * 
 * @param {string} baseMood - The character's base mood
 * @param {number} intensity - The intensity level (1-10)
 * @returns {string} - A negative mood variant
 */
export const getNegativeMood = (baseMood, intensity) => {
  const baseMoodLower = baseMood.toLowerCase();
  
  // High intensity negative moods
  if (intensity >= 8) {
    if (baseMoodLower.includes('angry') || baseMoodLower.includes('irritable')) {
      return 'Furious';
    } else if (baseMoodLower.includes('sad') || baseMoodLower.includes('melancholic')) {
      return 'Devastated';
    } else if (baseMoodLower.includes('anxious') || baseMoodLower.includes('nervous')) {
      return 'Panicked';
    } else if (baseMoodLower.includes('intense')) {
      return 'Enraged';
    } else {
      return 'Distraught';
    }
  }
  
  // Medium intensity negative moods
  if (intensity >= 5) {
    if (baseMoodLower.includes('angry') || baseMoodLower.includes('irritable')) {
      return 'Angry';
    } else if (baseMoodLower.includes('sad') || baseMoodLower.includes('melancholic')) {
      return 'Sorrowful';
    } else if (baseMoodLower.includes('anxious') || baseMoodLower.includes('nervous')) {
      return 'Worried';
    } else if (baseMoodLower.includes('intense')) {
      return 'Agitated';
    } else {
      return 'Upset';
    }
  }
  
  // Low intensity negative moods
  return 'Displeased';
};

/**
 * Determine if a mood change should be announced
 * 
 * @param {Object} previousState - The previous mood state
 * @param {Object} currentState - The current mood state
 * @returns {boolean} - Whether the mood change should be announced
 */
export const shouldAnnounceMoodChange = (previousState, currentState) => {
  // Don't announce if the mood hasn't changed
  if (previousState.currentMood === currentState.currentMood) {
    return false;
  }
  
  // Always announce high intensity mood changes
  if (currentState.intensity >= 8) {
    return true;
  }
  
  // Announce medium intensity changes with 50% probability
  if (currentState.intensity >= 5) {
    return Math.random() < 0.5;
  }
  
  // Announce low intensity changes with 20% probability
  return Math.random() < 0.2;
};

/**
 * Get a description of a mood change
 * 
 * @param {Object} previousState - The previous mood state
 * @param {Object} currentState - The current mood state
 * @returns {string} - A description of the mood change
 */
export const getMoodChangeDescription = (previousState, currentState) => {
  const { characterId, currentMood, triggers } = currentState;
  const recentTrigger = triggers.length > 0 ? triggers[triggers.length - 1] : null;
  
  if (recentTrigger) {
    return `${characterId}'s mood changes to ${currentMood} after ${recentTrigger}.`;
  }
  
  return `${characterId}'s mood changes to ${currentMood}.`;
};
