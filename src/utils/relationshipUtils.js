/**
 * Utility functions for tracking and managing character relationships
 */

/**
 * Initialize a relationship between two characters
 * 
 * @param {string} character1Id - First character's identifier (name)
 * @param {string} character2Id - Second character's identifier (name)
 * @returns {Object} - The initial relationship object
 */
export const initializeRelationship = (character1Id, character2Id) => {
  return {
    characters: [character1Id, character2Id],
    affinity: 0, // Range from -10 (hostile) to 10 (very close)
    interactions: [], // Array of recent interactions
    traits: {}, // Discovered traits about each other
    lastInteraction: null // Timestamp of last interaction
  };
};

/**
 * Get a relationship between two characters, or create it if it doesn't exist
 * 
 * @param {Array} relationships - Array of all relationships
 * @param {string} character1Id - First character's identifier (name)
 * @param {string} character2Id - Second character's identifier (name)
 * @returns {Object} - The relationship object
 */
export const getRelationship = (relationships, character1Id, character2Id) => {
  // Check if relationship exists
  const existingRelationship = relationships.find(rel => 
    (rel.characters.includes(character1Id) && rel.characters.includes(character2Id))
  );
  
  if (existingRelationship) {
    return existingRelationship;
  }
  
  // Create new relationship if it doesn't exist
  const newRelationship = initializeRelationship(character1Id, character2Id);
  relationships.push(newRelationship);
  return newRelationship;
};

/**
 * Update a relationship based on an interaction
 * 
 * @param {Object} relationship - The relationship to update
 * @param {string} initiatorId - Character who initiated the interaction
 * @param {string} message - The interaction message
 * @param {number} affinityChange - How much to change the affinity (-3 to +3)
 * @param {string} interactionType - Type of interaction (e.g., 'agreement', 'disagreement', 'question', 'help')
 * @returns {Object} - The updated relationship
 */
export const updateRelationship = (relationship, initiatorId, message, affinityChange, interactionType) => {
  // Create a copy of the relationship to update
  const updatedRelationship = { ...relationship };
  
  // Update affinity (clamped between -10 and 10)
  updatedRelationship.affinity = Math.max(-10, Math.min(10, updatedRelationship.affinity + affinityChange));
  
  // Create the interaction record
  const interaction = {
    timestamp: new Date().toISOString(),
    initiator: initiatorId,
    message: message,
    type: interactionType,
    affinityChange: affinityChange
  };
  
  // Add to interactions array (limited to last 10)
  updatedRelationship.interactions = [interaction, ...updatedRelationship.interactions].slice(0, 10);
  updatedRelationship.lastInteraction = interaction.timestamp;
  
  return updatedRelationship;
};

/**
 * Analyze a message to determine its sentiment and impact on relationship
 * 
 * @param {string} message - The message to analyze
 * @returns {Object} - Analysis results including sentiment and affinity change
 */
export const analyzeInteraction = (message) => {
  // Simple keyword-based sentiment analysis
  const positiveKeywords = [
    'thank', 'appreciate', 'good', 'great', 'excellent', 'amazing', 'wonderful',
    'help', 'kind', 'friend', 'like', 'love', 'agree', 'yes', 'please', 'nice',
    'happy', 'glad', 'impressive', 'beautiful', 'smart', 'clever', 'brave'
  ];
  
  const negativeKeywords = [
    'hate', 'dislike', 'bad', 'terrible', 'awful', 'horrible', 'stupid', 'idiot',
    'fool', 'wrong', 'no', 'never', 'not', 'disagree', 'annoying', 'irritating',
    'angry', 'upset', 'disappointed', 'failure', 'useless', 'worthless', 'ugly'
  ];
  
  // Count occurrences of positive and negative keywords
  const words = message.toLowerCase().split(/\s+/);
  let positiveCount = 0;
  let negativeCount = 0;
  
  words.forEach(word => {
    if (positiveKeywords.some(keyword => word.includes(keyword))) {
      positiveCount++;
    }
    if (negativeKeywords.some(keyword => word.includes(keyword))) {
      negativeCount++;
    }
  });
  
  // Determine sentiment and affinity change
  let sentiment = 'neutral';
  let affinityChange = 0;
  
  if (positiveCount > negativeCount) {
    sentiment = 'positive';
    affinityChange = Math.min(3, positiveCount - negativeCount);
  } else if (negativeCount > positiveCount) {
    sentiment = 'negative';
    affinityChange = Math.max(-3, -(negativeCount - positiveCount));
  }
  
  // Determine interaction type
  let interactionType = 'statement';
  if (message.includes('?')) {
    interactionType = 'question';
  } else if (message.includes('!')) {
    interactionType = 'exclamation';
  } else if (message.toLowerCase().includes('thank')) {
    interactionType = 'gratitude';
  } else if (message.toLowerCase().includes('help')) {
    interactionType = 'request';
  } else if (message.toLowerCase().includes('agree')) {
    interactionType = 'agreement';
  } else if (message.toLowerCase().includes('disagree')) {
    interactionType = 'disagreement';
  }
  
  return {
    sentiment,
    affinityChange,
    interactionType
  };
};

/**
 * Get a description of the relationship between two characters
 * 
 * @param {Object} relationship - The relationship object
 * @returns {string} - A description of the relationship
 */
export const getRelationshipDescription = (relationship) => {
  const { affinity } = relationship;
  
  if (affinity >= 8) return 'very close friends';
  if (affinity >= 5) return 'friends';
  if (affinity >= 2) return 'friendly acquaintances';
  if (affinity >= -1) return 'neutral acquaintances';
  if (affinity >= -4) return 'tense acquaintances';
  if (affinity >= -7) return 'adversaries';
  return 'bitter enemies';
};

/**
 * Get a significant past interaction between characters
 * 
 * @param {Object} relationship - The relationship object
 * @returns {Object|null} - A significant interaction or null if none exists
 */
export const getSignificantInteraction = (relationship) => {
  if (!relationship.interactions || relationship.interactions.length === 0) {
    return null;
  }
  
  // Find interactions with the largest affinity changes (positive or negative)
  const significantInteractions = [...relationship.interactions]
    .sort((a, b) => Math.abs(b.affinityChange) - Math.abs(a.affinityChange));
  
  // Return one of the top 3 significant interactions at random
  const topInteractions = significantInteractions.slice(0, Math.min(3, significantInteractions.length));
  return topInteractions[Math.floor(Math.random() * topInteractions.length)];
};

/**
 * Generate a reference to a past interaction
 * 
 * @param {Object} relationship - The relationship object
 * @param {string} characterId - The character making the reference
 * @returns {string|null} - A reference to a past interaction or null if none exists
 */
export const generateInteractionReference = (relationship, characterId) => {
  const significantInteraction = getSignificantInteraction(relationship);
  if (!significantInteraction) {
    return null;
  }
  
  // Get the other character in the relationship
  const otherCharacterId = relationship.characters.find(id => id !== characterId);
  
  // Create a reference based on the interaction type and sentiment
  const { type, affinityChange, message } = significantInteraction;
  
  // Extract a key phrase from the message (up to 5 words)
  const words = message.split(/\s+/);
  const keyPhrase = words.slice(0, Math.min(5, words.length)).join(' ');
  
  // Generate different references based on interaction type and affinity change
  if (type === 'agreement' && affinityChange > 0) {
    return `I remember when we agreed about "${keyPhrase}..." That was a good point you made.`;
  } else if (type === 'disagreement' && affinityChange < 0) {
    return `I haven't forgotten our disagreement about "${keyPhrase}..." but I'm willing to move past it.`;
  } else if (type === 'question') {
    return `You asked me about "${keyPhrase}..." earlier. I've been thinking more about that.`;
  } else if (type === 'gratitude' && affinityChange > 0) {
    return `I appreciated when you thanked me regarding "${keyPhrase}..."`;
  } else if (affinityChange > 1) {
    return `I enjoyed our previous conversation about "${keyPhrase}..."`;
  } else if (affinityChange < -1) {
    return `I'm still thinking about what you said earlier about "${keyPhrase}..."`;
  }
  
  return `As we discussed earlier regarding "${keyPhrase}..."`;
};

/**
 * Determine if a character should reference a past interaction
 * 
 * @param {Object} relationship - The relationship object
 * @param {Object} character - The character object
 * @returns {boolean} - Whether the character should reference a past interaction
 */
export const shouldReferenceInteraction = (relationship, character) => {
  if (!relationship.interactions || relationship.interactions.length === 0) {
    return false;
  }
  
  // Characters with higher analytical or philosophical traits are more likely to reference past interactions
  const { personality = {} } = character;
  const { analytical = 5, philosophical = 5 } = personality;
  
  // Base chance is 15%, increased by character traits
  const baseChance = 0.15;
  const traitBonus = ((analytical + philosophical) / 20) * 0.2; // Up to 20% additional chance
  
  return Math.random() < (baseChance + traitBonus);
};
