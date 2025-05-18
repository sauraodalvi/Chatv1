/**
 * RelationshipAnalyzer
 * 
 * Analyzes conversations to detect relationship-affecting interactions
 * and updates the relationship matrix accordingly.
 */

export class RelationshipAnalyzer {
  constructor(relationshipMatrix) {
    this.relationshipMatrix = relationshipMatrix;
    this.conversationMemory = [];
    this.maxMemorySize = 50;
    this.lastAnalysisTime = null;
    this.analysisInterval = 5; // Analyze every 5 messages
    this.messagesSinceLastAnalysis = 0;
  }

  /**
   * Process a new message and update relationships if needed
   * @param {Object} message - Message object
   * @param {Array} characters - Array of character objects in the conversation
   * @returns {Object|null} - Updated relationship if analysis was performed
   */
  processMessage(message, characters) {
    if (!message || !message.sender || !characters || characters.length < 2) {
      return null;
    }
    
    // Add message to conversation memory
    this.addToConversationMemory(message);
    
    // Increment message counter
    this.messagesSinceLastAnalysis++;
    
    // Check if it's time to analyze
    if (this.messagesSinceLastAnalysis >= this.analysisInterval) {
      return this.analyzeConversation(characters);
    }
    
    return null;
  }

  /**
   * Add a message to the conversation memory
   * @param {Object} message - Message object
   */
  addToConversationMemory(message) {
    this.conversationMemory.push({
      ...message,
      timestamp: message.timestamp || new Date().toISOString()
    });
    
    // Trim memory if it exceeds max size
    if (this.conversationMemory.length > this.maxMemorySize) {
      this.conversationMemory = this.conversationMemory.slice(
        this.conversationMemory.length - this.maxMemorySize
      );
    }
  }

  /**
   * Analyze the conversation and update relationships
   * @param {Array} characters - Array of character objects
   * @returns {Object} - Updated relationships
   */
  analyzeConversation(characters) {
    // Reset counter
    this.messagesSinceLastAnalysis = 0;
    this.lastAnalysisTime = new Date().toISOString();
    
    // Get recent messages
    const recentMessages = this.conversationMemory.slice(-this.analysisInterval);
    
    // Track which character pairs have interacted
    const interactingPairs = new Set();
    
    // Analyze direct interactions
    recentMessages.forEach(message => {
      if (!message.sender || message.system) return;
      
      // Find the sender character
      const sender = characters.find(c => c.name === message.sender);
      if (!sender) return;
      
      // If message has a specific recipient
      if (message.recipient) {
        const recipient = characters.find(c => c.name === message.recipient);
        if (recipient) {
          // Add to interacting pairs
          interactingPairs.add(this.getPairKey(sender.name, recipient.name));
          
          // Analyze message impact
          const changes = this.relationshipMatrix.analyzeMessageImpact(
            message.message,
            sender.name,
            recipient.name
          );
          
          // Update relationship
          this.relationshipMatrix.updateRelationship(
            sender.name,
            recipient.name,
            changes,
            'direct_message',
            message.message.substring(0, 50) + '...'
          );
        }
      } else {
        // Message to everyone - find who was mentioned
        characters.forEach(recipient => {
          if (recipient.name !== sender.name && 
              message.message.toLowerCase().includes(recipient.name.toLowerCase())) {
            
            // Add to interacting pairs
            interactingPairs.add(this.getPairKey(sender.name, recipient.name));
            
            // Analyze message impact
            const changes = this.relationshipMatrix.analyzeMessageImpact(
              message.message,
              sender.name,
              recipient.name
            );
            
            // Update relationship with reduced impact (mentioned, not direct)
            const reducedChanges = {};
            Object.entries(changes).forEach(([key, value]) => {
              reducedChanges[key] = value * 0.7; // 70% impact for mentions
            });
            
            this.relationshipMatrix.updateRelationship(
              sender.name,
              recipient.name,
              reducedChanges,
              'mention',
              message.message.substring(0, 50) + '...'
            );
          }
        });
      }
    });
    
    // Analyze conversation patterns
    this.analyzeConversationPatterns(recentMessages, characters, interactingPairs);
    
    // Return all updated relationships
    return this.relationshipMatrix.getAllRelationships();
  }

  /**
   * Analyze conversation patterns for indirect relationship effects
   * @param {Array} messages - Recent messages
   * @param {Array} characters - Characters in the conversation
   * @param {Set} interactingPairs - Set of character pairs that directly interacted
   */
  analyzeConversationPatterns(messages, characters, interactingPairs) {
    // Count messages per character
    const messageCounts = {};
    messages.forEach(message => {
      if (message.sender && !message.system) {
        messageCounts[message.sender] = (messageCounts[message.sender] || 0) + 1;
      }
    });
    
    // Analyze character pairs that haven't directly interacted
    for (let i = 0; i < characters.length; i++) {
      for (let j = i + 1; j < characters.length; j++) {
        const char1 = characters[i].name;
        const char2 = characters[j].name;
        const pairKey = this.getPairKey(char1, char2);
        
        // Skip pairs that have directly interacted
        if (interactingPairs.has(pairKey)) continue;
        
        // Get current relationship
        const relationship = this.relationshipMatrix.getRelationship(char1, char2);
        
        // Initialize if needed
        if (!relationship) {
          this.relationshipMatrix.initializeRelationship(char1, char2);
        }
        
        // Small familiarity increase for being in the same conversation
        this.relationshipMatrix.updateRelationship(
          char1,
          char2,
          { familiarity: 0.05 },
          'shared_conversation',
          'Present in the same conversation'
        );
        
        // Analyze conversation dynamics
        this.analyzeConversationDynamics(char1, char2, messages, messageCounts);
      }
    }
  }

  /**
   * Analyze conversation dynamics between two characters
   * @param {string} char1 - First character's name
   * @param {string} char2 - Second character's name
   * @param {Array} messages - Recent messages
   * @param {Object} messageCounts - Count of messages per character
   */
  analyzeConversationDynamics(char1, char2, messages, messageCounts) {
    // Check for agreement patterns
    let agreementCount = 0;
    let disagreementCount = 0;
    
    // Analyze sequential messages
    for (let i = 1; i < messages.length; i++) {
      const prevMsg = messages[i - 1];
      const currMsg = messages[i];
      
      if (!prevMsg.sender || !currMsg.sender || 
          prevMsg.sender !== char1 || currMsg.sender !== char2) {
        continue;
      }
      
      // Check for agreement
      if (this.indicatesAgreement(currMsg.message, prevMsg.message)) {
        agreementCount++;
      }
      
      // Check for disagreement
      if (this.indicatesDisagreement(currMsg.message, prevMsg.message)) {
        disagreementCount++;
      }
    }
    
    // Update relationship based on agreement patterns
    if (agreementCount > 0 || disagreementCount > 0) {
      const changes = {
        affinity: (agreementCount - disagreementCount) * 0.2,
        tension: disagreementCount * 0.3 - agreementCount * 0.1
      };
      
      this.relationshipMatrix.updateRelationship(
        char1,
        char2,
        changes,
        'conversation_dynamics',
        `Agreement patterns: ${agreementCount} agreements, ${disagreementCount} disagreements`
      );
    }
    
    // Check for conversation dominance
    const char1Count = messageCounts[char1] || 0;
    const char2Count = messageCounts[char2] || 0;
    const totalCount = char1Count + char2Count;
    
    if (totalCount > 0) {
      const dominanceRatio = (char1Count - char2Count) / totalCount;
      
      // Only update if there's significant dominance
      if (Math.abs(dominanceRatio) > 0.3) {
        const changes = {
          power: dominanceRatio * 0.5
        };
        
        this.relationshipMatrix.updateRelationship(
          char1,
          char2,
          changes,
          'conversation_dominance',
          `Conversation dominance: ${char1} spoke ${char1Count} times, ${char2} spoke ${char2Count} times`
        );
      }
    }
  }

  /**
   * Check if a message indicates agreement with a previous message
   * @param {string} message - Current message
   * @param {string} prevMessage - Previous message
   * @returns {boolean} - Whether agreement is indicated
   */
  indicatesAgreement(message, prevMessage) {
    if (!message || !prevMessage) return false;
    
    const lowerMsg = message.toLowerCase();
    return (
      lowerMsg.includes('agree') ||
      lowerMsg.includes('good point') ||
      lowerMsg.includes('you\'re right') ||
      lowerMsg.includes('you are right') ||
      lowerMsg.includes('exactly') ||
      lowerMsg.includes('precisely') ||
      lowerMsg.includes('i think so too') ||
      lowerMsg.includes('that\'s true') ||
      lowerMsg.includes('that is true')
    );
  }

  /**
   * Check if a message indicates disagreement with a previous message
   * @param {string} message - Current message
   * @param {string} prevMessage - Previous message
   * @returns {boolean} - Whether disagreement is indicated
   */
  indicatesDisagreement(message, prevMessage) {
    if (!message || !prevMessage) return false;
    
    const lowerMsg = message.toLowerCase();
    return (
      lowerMsg.includes('disagree') ||
      lowerMsg.includes('not true') ||
      lowerMsg.includes('i don\'t think so') ||
      lowerMsg.includes('you\'re wrong') ||
      lowerMsg.includes('you are wrong') ||
      lowerMsg.includes('that\'s incorrect') ||
      lowerMsg.includes('that is incorrect') ||
      lowerMsg.includes('i don\'t agree') ||
      lowerMsg.includes('actually, no')
    );
  }

  /**
   * Get a consistent key for a character pair
   * @param {string} char1 - First character's name
   * @param {string} char2 - Second character's name
   * @returns {string} - Pair key
   */
  getPairKey(char1, char2) {
    return [char1, char2].sort().join('_&_');
  }

  /**
   * Get relationship suggestions based on current relationships
   * @param {Array} characters - Characters in the conversation
   * @returns {Array} - Array of relationship suggestions
   */
  getRelationshipSuggestions(characters) {
    if (!characters || characters.length < 2) return [];
    
    const suggestions = [];
    
    // Check each character pair
    for (let i = 0; i < characters.length; i++) {
      for (let j = i + 1; j < characters.length; j++) {
        const char1 = characters[i].name;
        const char2 = characters[j].name;
        
        const relationship = this.relationshipMatrix.getRelationship(char1, char2);
        if (!relationship) continue;
        
        // Generate suggestions based on relationship state
        const { affinity, trust, tension } = relationship;
        
        // Significant changes in relationship
        if (Math.abs(affinity) >= 7 || Math.abs(trust) >= 7 || tension >= 7) {
          const summary = this.relationshipMatrix.getRelationshipSummary(char1, char2);
          suggestions.push({
            type: 'relationship_state',
            characters: [char1, char2],
            suggestion: summary.summary,
            priority: Math.max(Math.abs(affinity), Math.abs(trust), tension) / 10
          });
        }
        
        // Tension-based suggestions
        if (tension >= 6) {
          suggestions.push({
            type: 'tension',
            characters: [char1, char2],
            suggestion: `The tension between ${char1} and ${char2} is palpable, affecting everyone in the room.`,
            priority: tension / 10
          });
        }
        
        // Trust-based suggestions
        if (trust >= 8) {
          suggestions.push({
            type: 'trust',
            characters: [char1, char2],
            suggestion: `${char1} and ${char2} share a look of mutual understanding, their trust in each other evident.`,
            priority: trust / 10
          });
        } else if (trust <= -8) {
          suggestions.push({
            type: 'distrust',
            characters: [char1, char2],
            suggestion: `${char1} watches ${char2}'s every move with suspicion, clearly distrusting their motives.`,
            priority: Math.abs(trust) / 10
          });
        }
      }
    }
    
    // Sort by priority and return top 3
    return suggestions
      .sort((a, b) => b.priority - a.priority)
      .slice(0, 3);
  }
}
