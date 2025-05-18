/**
 * RelationshipMatrix
 * 
 * Tracks and manages relationships between characters in a multi-character chat.
 * Stores affinity, trust, and tension values between character pairs and
 * provides methods to update and query these relationships.
 */

export class RelationshipMatrix {
  constructor() {
    this.relationships = {};
    this.relationshipHistory = {};
    this.interactionCounts = {};
  }

  /**
   * Initialize a relationship between two characters
   * @param {string} char1 - First character's name
   * @param {string} char2 - Second character's name
   * @param {Object} initialValues - Initial relationship values
   */
  initializeRelationship(char1, char2, initialValues = {}) {
    // Create a unique key for this character pair
    const relationshipKey = this.getRelationshipKey(char1, char2);
    
    // If relationship already exists, don't overwrite it
    if (this.relationships[relationshipKey]) {
      return;
    }
    
    // Set default values
    const defaultValues = {
      affinity: 0,      // -10 to 10: how much characters like/dislike each other
      trust: 0,         // -10 to 10: how much characters trust/distrust each other
      tension: 0,       // 0 to 10: level of tension between characters
      familiarity: 0,   // 0 to 10: how well characters know each other
      power: 0,         // -5 to 5: power dynamic (positive means char1 has power over char2)
      respect: 0,       // -10 to 10: how much characters respect/disrespect each other
      shared_history: 0 // 0 to 10: extent of shared history between characters
    };
    
    // Create the relationship with merged values
    this.relationships[relationshipKey] = {
      characters: [char1, char2],
      ...defaultValues,
      ...initialValues,
      last_updated: new Date().toISOString()
    };
    
    // Initialize relationship history
    this.relationshipHistory[relationshipKey] = [
      {
        ...this.relationships[relationshipKey],
        timestamp: new Date().toISOString()
      }
    ];
    
    // Initialize interaction count
    this.interactionCounts[relationshipKey] = 0;
  }

  /**
   * Get a unique key for a character pair (order-independent)
   * @param {string} char1 - First character's name
   * @param {string} char2 - Second character's name
   * @returns {string} - Unique relationship key
   */
  getRelationshipKey(char1, char2) {
    return [char1, char2].sort().join('_&_');
  }

  /**
   * Get the relationship between two characters
   * @param {string} char1 - First character's name
   * @param {string} char2 - Second character's name
   * @returns {Object|null} - Relationship object or null if not found
   */
  getRelationship(char1, char2) {
    const relationshipKey = this.getRelationshipKey(char1, char2);
    return this.relationships[relationshipKey] || null;
  }

  /**
   * Update a relationship based on an interaction
   * @param {string} char1 - First character's name
   * @param {string} char2 - Second character's name
   * @param {Object} changes - Changes to apply to the relationship
   * @param {string} interactionType - Type of interaction (e.g., 'conversation', 'conflict')
   * @param {string} context - Additional context about the interaction
   */
  updateRelationship(char1, char2, changes, interactionType = 'conversation', context = '') {
    const relationshipKey = this.getRelationshipKey(char1, char2);
    
    // Initialize relationship if it doesn't exist
    if (!this.relationships[relationshipKey]) {
      this.initializeRelationship(char1, char2);
    }
    
    // Get current relationship
    const currentRelationship = this.relationships[relationshipKey];
    
    // Apply changes, ensuring values stay within bounds
    const updatedRelationship = {
      ...currentRelationship,
      ...Object.entries(changes).reduce((acc, [key, value]) => {
        if (key in currentRelationship) {
          // Apply bounds based on the attribute
          if (key === 'affinity' || key === 'trust' || key === 'respect') {
            acc[key] = Math.max(-10, Math.min(10, currentRelationship[key] + value));
          } else if (key === 'tension' || key === 'familiarity' || key === 'shared_history') {
            acc[key] = Math.max(0, Math.min(10, currentRelationship[key] + value));
          } else if (key === 'power') {
            acc[key] = Math.max(-5, Math.min(5, currentRelationship[key] + value));
          }
        }
        return acc;
      }, {}),
      last_updated: new Date().toISOString()
    };
    
    // Update the relationship
    this.relationships[relationshipKey] = updatedRelationship;
    
    // Record the update in history
    this.relationshipHistory[relationshipKey].push({
      ...updatedRelationship,
      interaction_type: interactionType,
      context: context,
      timestamp: new Date().toISOString()
    });
    
    // Increment interaction count
    this.interactionCounts[relationshipKey] = (this.interactionCounts[relationshipKey] || 0) + 1;
    
    return updatedRelationship;
  }

  /**
   * Get all relationships for a specific character
   * @param {string} characterName - Character's name
   * @returns {Array} - Array of relationship objects
   */
  getCharacterRelationships(characterName) {
    return Object.values(this.relationships).filter(rel => 
      rel.characters.includes(characterName)
    );
  }

  /**
   * Get relationship history between two characters
   * @param {string} char1 - First character's name
   * @param {string} char2 - Second character's name
   * @returns {Array} - Array of historical relationship states
   */
  getRelationshipHistory(char1, char2) {
    const relationshipKey = this.getRelationshipKey(char1, char2);
    return this.relationshipHistory[relationshipKey] || [];
  }

  /**
   * Get all relationships in the matrix
   * @returns {Array} - Array of all relationship objects
   */
  getAllRelationships() {
    return Object.values(this.relationships);
  }

  /**
   * Get a summary of a relationship suitable for display
   * @param {string} char1 - First character's name
   * @param {string} char2 - Second character's name
   * @returns {Object} - Relationship summary
   */
  getRelationshipSummary(char1, char2) {
    const relationship = this.getRelationship(char1, char2);
    if (!relationship) return null;
    
    // Determine relationship type based on affinity and trust
    let relationshipType = 'neutral';
    const { affinity, trust, tension } = relationship;
    
    if (affinity >= 7 && trust >= 7) {
      relationshipType = 'close friends';
    } else if (affinity >= 5 && trust >= 5) {
      relationshipType = 'friends';
    } else if (affinity <= -7 && trust <= -7) {
      relationshipType = 'enemies';
    } else if (affinity <= -5 && trust <= -5) {
      relationshipType = 'adversaries';
    } else if (affinity >= 5 && trust <= -5) {
      relationshipType = 'complicated';
    } else if (affinity <= -5 && trust >= 5) {
      relationshipType = 'reluctant allies';
    } else if (affinity >= 3 && trust >= 3) {
      relationshipType = 'acquaintances';
    } else if (tension >= 7) {
      relationshipType = 'tense';
    }
    
    // Create a descriptive summary
    let summary = '';
    if (affinity > 0 && trust > 0) {
      summary = `${char1} and ${char2} have a positive relationship with growing trust.`;
    } else if (affinity < 0 && trust < 0) {
      summary = `${char1} and ${char2} have a strained relationship with significant distrust.`;
    } else if (affinity > 0 && trust < 0) {
      summary = `${char1} likes ${char2} but doesn't fully trust them.`;
    } else if (affinity < 0 && trust > 0) {
      summary = `${char1} doesn't particularly like ${char2} but recognizes they can be trusted.`;
    } else {
      summary = `${char1} and ${char2} have a neutral relationship.`;
    }
    
    return {
      type: relationshipType,
      summary,
      affinity,
      trust,
      tension,
      interactionCount: this.interactionCounts[this.getRelationshipKey(char1, char2)] || 0
    };
  }

  /**
   * Analyze a message to determine its impact on a relationship
   * @param {Object} message - Message object
   * @param {string} sender - Sender's name
   * @param {string} recipient - Recipient's name
   * @returns {Object} - Relationship changes
   */
  analyzeMessageImpact(message, sender, recipient) {
    if (!message || !sender || !recipient) return {};
    
    const text = message.toLowerCase();
    const changes = {
      affinity: 0,
      trust: 0,
      tension: 0,
      familiarity: 0.1, // Small increase in familiarity for any interaction
    };
    
    // Check for positive sentiment
    if (
      text.includes('thank') || 
      text.includes('appreciate') || 
      text.includes('agree') || 
      text.includes('good idea') || 
      text.includes('help') ||
      text.includes('friend')
    ) {
      changes.affinity += 0.5;
      changes.trust += 0.3;
      changes.tension -= 0.2;
    }
    
    // Check for negative sentiment
    if (
      text.includes('disagree') || 
      text.includes('wrong') || 
      text.includes('bad idea') || 
      text.includes('mistake') ||
      text.includes('fool') ||
      text.includes('stupid')
    ) {
      changes.affinity -= 0.5;
      changes.tension += 0.5;
    }
    
    // Check for trust-building
    if (
      text.includes('trust') || 
      text.includes('rely') || 
      text.includes('count on') || 
      text.includes('believe you')
    ) {
      changes.trust += 0.7;
    }
    
    // Check for distrust
    if (
      text.includes('lie') || 
      text.includes('deceive') || 
      text.includes('betray') || 
      text.includes('doubt')
    ) {
      changes.trust -= 0.7;
      changes.tension += 0.5;
    }
    
    // Check for conflict
    if (
      text.includes('fight') || 
      text.includes('attack') || 
      text.includes('threat') || 
      text.includes('enemy') ||
      text.includes('hate')
    ) {
      changes.tension += 1.0;
      changes.affinity -= 0.5;
    }
    
    // Check for conflict resolution
    if (
      text.includes('sorry') || 
      text.includes('apologize') || 
      text.includes('forgive') || 
      text.includes('understand')
    ) {
      changes.tension -= 0.8;
      changes.affinity += 0.3;
      changes.trust += 0.3;
    }
    
    return changes;
  }
}
