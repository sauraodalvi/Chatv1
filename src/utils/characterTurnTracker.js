/**
 * Character Turn Tracking System
 * 
 * This module provides utilities for tracking which character should respond next
 * in a conversation, with special handling for battle scenarios and team dynamics.
 */

/**
 * Character Turn Tracker class
 * Manages the state of character turns in a conversation
 */
export class CharacterTurnTracker {
  constructor() {
    this.turnHistory = [];
    this.speakingOrder = [];
    this.lastSpeaker = null;
    this.currentContext = 'conversation';
    this.battleState = {
      inProgress: false,
      intensity: 0, // 0-10 scale
      focusCharacter: null,
      threatLevel: 'low' // low, medium, high
    };
  }

  /**
   * Record a character's turn in the conversation
   * 
   * @param {string} characterName - The name of the character who spoke
   * @param {string} messageType - The type of message (e.g., 'dialogue', 'action', 'reaction')
   * @param {Object} context - Additional context about the turn
   */
  recordTurn(characterName, messageType = 'dialogue', context = {}) {
    // Record the turn
    this.turnHistory.push({
      character: characterName,
      type: messageType,
      timestamp: new Date().getTime(),
      context: context
    });

    // Update last speaker
    this.lastSpeaker = characterName;

    // Update speaking order (move this character to the end)
    this.speakingOrder = this.speakingOrder.filter(name => name !== characterName);
    this.speakingOrder.push(characterName);
  }

  /**
   * Set the current conversation context
   * 
   * @param {string} context - The context (e.g., 'conversation', 'battle', 'planning')
   * @param {Object} details - Additional details about the context
   */
  setContext(context, details = {}) {
    this.currentContext = context;

    // If this is a battle context, update battle state
    if (context.toLowerCase().includes('battle') || 
        context.toLowerCase().includes('fight') || 
        context.toLowerCase().includes('combat')) {
      this.battleState.inProgress = true;
      
      if (details.intensity !== undefined) {
        this.battleState.intensity = details.intensity;
      }
      
      if (details.focusCharacter) {
        this.battleState.focusCharacter = details.focusCharacter;
      }
      
      if (details.threatLevel) {
        this.battleState.threatLevel = details.threatLevel;
      }
    } else {
      this.battleState.inProgress = false;
    }
  }

  /**
   * Determine which character should speak next based on conversation context
   * 
   * @param {Array} availableCharacters - Array of available character objects
   * @param {Object} lastMessage - The last message in the conversation
   * @param {Object} chatRoom - The chat room object containing scenario information
   * @returns {Object} - The character who should speak next
   */
  determineNextSpeaker(availableCharacters, lastMessage, chatRoom) {
    if (!availableCharacters || availableCharacters.length === 0) {
      return null;
    }

    // Filter out the last speaker to avoid the same character speaking twice in a row
    const eligibleCharacters = availableCharacters.filter(char => 
      char.name !== this.lastSpeaker
    );

    if (eligibleCharacters.length === 0) {
      // If no eligible characters, allow the last speaker to speak again
      return availableCharacters[0];
    }

    // If there's only one eligible character, return that one
    if (eligibleCharacters.length === 1) {
      return eligibleCharacters[0];
    }

    // Check if we're in a battle scenario
    if (this.battleState.inProgress) {
      return this.determineBattleSpeaker(eligibleCharacters, lastMessage, chatRoom);
    }

    // Check if any characters are mentioned in the last message
    if (lastMessage && lastMessage.message) {
      const messageLower = lastMessage.message.toLowerCase();
      
      // Find characters mentioned by name in the message
      const mentionedCharacters = eligibleCharacters.filter(char => 
        messageLower.includes(char.name.toLowerCase())
      );
      
      // If characters are mentioned, randomly select one of them
      if (mentionedCharacters.length > 0) {
        return mentionedCharacters[Math.floor(Math.random() * mentionedCharacters.length)];
      }
    }

    // Check for characters with mood "Intense"
    const intenseCharacters = eligibleCharacters.filter(char => 
      char.mood === "Intense"
    );
    
    // If there are intense characters, randomly select one of them (70% chance)
    if (intenseCharacters.length > 0 && Math.random() < 0.7) {
      return intenseCharacters[Math.floor(Math.random() * intenseCharacters.length)];
    }

    // Check for characters who haven't spoken recently
    if (this.speakingOrder.length > 0) {
      // Find characters who are eligible but haven't spoken recently
      const notRecentlySpokeCharacters = eligibleCharacters.filter(char => 
        !this.speakingOrder.slice(-2).includes(char.name)
      );
      
      if (notRecentlySpokeCharacters.length > 0) {
        // Sort by talkativeness
        const sortedByTalkativeness = [...notRecentlySpokeCharacters].sort((a, b) => {
          const aTalkativeness = a.talkativeness || 5;
          const bTalkativeness = b.talkativeness || 5;
          return bTalkativeness - aTalkativeness;
        });
        
        // Select from the top half with preference for talkative characters
        const topHalfIndex = Math.floor(sortedByTalkativeness.length / 2) || 0;
        const topHalf = sortedByTalkativeness.slice(0, topHalfIndex + 1);
        
        return topHalf[Math.floor(Math.random() * topHalf.length)];
      }
    }
    
    // Otherwise, sort by talkativeness and select with weighted probability
    const sortedByTalkativeness = [...eligibleCharacters].sort((a, b) => {
      const aTalkativeness = a.talkativeness || 5;
      const bTalkativeness = b.talkativeness || 5;
      return bTalkativeness - aTalkativeness;
    });
    
    // Create a weighted selection based on talkativeness
    const totalTalkativeness = sortedByTalkativeness.reduce(
      (sum, char) => sum + (char.talkativeness || 5), 
      0
    );
    
    // Select a character based on weighted probability
    let randomValue = Math.random() * totalTalkativeness;
    let cumulativeWeight = 0;
    
    for (const character of sortedByTalkativeness) {
      cumulativeWeight += (character.talkativeness || 5);
      if (randomValue <= cumulativeWeight) {
        return character;
      }
    }
    
    // Fallback to the most talkative character
    return sortedByTalkativeness[0];
  }

  /**
   * Determine which character should speak next in a battle scenario
   * 
   * @param {Array} eligibleCharacters - Array of eligible character objects
   * @param {Object} lastMessage - The last message in the conversation
   * @param {Object} chatRoom - The chat room object containing scenario information
   * @returns {Object} - The character who should speak next
   */
  determineBattleSpeaker(eligibleCharacters, lastMessage, chatRoom) {
    // If there's a focus character in the battle and they're eligible, prioritize them
    if (this.battleState.focusCharacter) {
      const focusCharacter = eligibleCharacters.find(char => 
        char.name === this.battleState.focusCharacter
      );
      
      if (focusCharacter && Math.random() < 0.7) {
        return focusCharacter;
      }
    }

    // In high-intensity battles, prioritize combat-oriented characters
    if (this.battleState.intensity >= 7) {
      // For Avengers, we know specific combat roles
      const combatPriority = {
        "Thor": this.battleState.intensity * 0.9, // Thor is powerful in high-intensity battles
        "Hulk": this.battleState.intensity * 0.85, // Hulk gets stronger as battle intensifies
        "Iron Man": 7, // Iron Man is consistently combat-effective
        "Captain America": 6.5, // Cap is a tactical leader
        "Black Widow": 6, // Black Widow is combat-effective but not as powerful
        "Hawkeye": 5.5 // Hawkeye is more tactical/support
      };
      
      // Sort eligible characters by combat priority
      const sortedByCombat = [...eligibleCharacters].sort((a, b) => {
        const aPriority = combatPriority[a.name] || (a.personality?.confidence || 5);
        const bPriority = combatPriority[b.name] || (b.personality?.confidence || 5);
        return bPriority - aPriority;
      });
      
      // 70% chance to pick from top half of combat-oriented characters
      if (Math.random() < 0.7) {
        const topHalfIndex = Math.floor(sortedByCombat.length / 2) || 0;
        return sortedByCombat[Math.floor(Math.random() * (topHalfIndex + 1))];
      }
    }

    // Check if any characters are mentioned in the last message (tactical orders)
    if (lastMessage && lastMessage.message) {
      const messageLower = lastMessage.message.toLowerCase();
      
      // Find characters mentioned by name in the message
      const mentionedCharacters = eligibleCharacters.filter(char => 
        messageLower.includes(char.name.toLowerCase())
      );
      
      // If characters are mentioned (likely being given orders), prioritize them
      if (mentionedCharacters.length > 0 && Math.random() < 0.8) {
        return mentionedCharacters[Math.floor(Math.random() * mentionedCharacters.length)];
      }
      
      // If Captain America was the last speaker, he's likely giving orders
      if (this.lastSpeaker === "Captain America" && Math.random() < 0.75) {
        // Someone should respond to Cap's orders
        return eligibleCharacters[Math.floor(Math.random() * eligibleCharacters.length)];
      }
    }
    
    // Otherwise, use a weighted random selection based on character type and personality
    const battleWeights = eligibleCharacters.map(char => {
      let weight = 5; // Default weight
      
      // Adjust weight based on character
      if (char.name === "Thor" || char.name === "Hulk") {
        weight += 3; // More likely to speak during battle
      } else if (char.name === "Iron Man") {
        weight += 2; // Tony talks a lot during battle
      } else if (char.name === "Captain America") {
        weight += 2; // Cap gives orders
      }
      
      // Adjust based on personality
      if (char.personality) {
        if (char.personality.confidence > 7) weight += 1;
        if (char.personality.analytical > 7) weight += 1;
      }
      
      return { character: char, weight };
    });
    
    // Calculate total weight
    const totalWeight = battleWeights.reduce((sum, item) => sum + item.weight, 0);
    
    // Select character based on weight
    let randomValue = Math.random() * totalWeight;
    let cumulativeWeight = 0;
    
    for (const item of battleWeights) {
      cumulativeWeight += item.weight;
      if (randomValue <= cumulativeWeight) {
        return item.character;
      }
    }
    
    // Fallback
    return eligibleCharacters[Math.floor(Math.random() * eligibleCharacters.length)];
  }

  /**
   * Get the current battle state
   * 
   * @returns {Object} - The current battle state
   */
  getBattleState() {
    return { ...this.battleState };
  }

  /**
   * Update the battle state
   * 
   * @param {Object} updates - Updates to apply to the battle state
   */
  updateBattleState(updates) {
    this.battleState = {
      ...this.battleState,
      ...updates
    };
  }

  /**
   * Get the speaking history
   * 
   * @param {number} limit - Maximum number of entries to return
   * @returns {Array} - Recent speaking history
   */
  getSpeakingHistory(limit = 5) {
    return this.turnHistory.slice(-limit);
  }

  /**
   * Reset the turn tracker
   */
  reset() {
    this.turnHistory = [];
    this.speakingOrder = [];
    this.lastSpeaker = null;
    this.currentContext = 'conversation';
    this.battleState = {
      inProgress: false,
      intensity: 0,
      focusCharacter: null,
      threatLevel: 'low'
    };
  }
}
