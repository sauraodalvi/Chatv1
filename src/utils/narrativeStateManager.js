/**
 * Narrative State Manager
 * 
 * Tracks player choices, tone, preferences and maintains story state
 * across different narrative branches and character interactions.
 */

export class NarrativeStateManager {
  constructor() {
    this.playerState = {
      choices: [],
      tone: 'neutral',
      preferences: {},
      alliances: {},
      inventory: [],
      moodScore: 0,
      trustLevels: {}
    };
    
    this.storyState = {
      currentBranch: 'main',
      branches: {},
      worldState: {},
      characterStates: {},
      triggeredEvents: []
    };
  }

  /**
   * Records a player choice and updates narrative state
   * @param {string} choiceId - Unique identifier for the choice
   * @param {string} choiceText - Display text of the choice
   * @param {string} intent - Player's intent (e.g., 'help', 'attack', 'explore')
   */
  recordChoice(choiceId, choiceText, intent) {
    this.playerState.choices.push({
      id: choiceId,
      text: choiceText,
      intent,
      timestamp: Date.now()
    });
    
    // Update mood based on choice intent
    this.updateMood(intent);
  }

  /**
   * Updates player mood score based on choice intent
   * @param {string} intent - Player's intent from the choice
   */
  updateMood(intent) {
    const moodImpacts = {
      'help': 1,
      'attack': -2,
      'explore': 0.5,
      'defend': -1,
      'negotiate': 0.5
    };
    
    this.playerState.moodScore += moodImpacts[intent] || 0;
    
    // Clamp mood score between -10 and 10
    this.playerState.moodScore = Math.max(-10, Math.min(10, this.playerState.moodScore));
    
    // Update overall tone based on mood
    this.updateTone();
  }

  /**
   * Updates overall tone based on current mood score
   */
  updateTone() {
    if (this.playerState.moodScore > 5) {
      this.playerState.tone = 'positive';
    } else if (this.playerState.moodScore < -5) {
      this.playerState.tone = 'negative';
    } else {
      this.playerState.tone = 'neutral';
    }
  }

  /**
   * Updates trust level with a specific character
   * @param {string} characterId - ID of the character
   * @param {number} change - Amount to change trust by (-5 to 5)
   */
  updateTrust(characterId, change) {
    if (!this.playerState.trustLevels[characterId]) {
      this.playerState.trustLevels[characterId] = 0;
    }
    
    this.playerState.trustLevels[characterId] += change;
    
    // Clamp trust between -10 and 10
    this.playerState.trustLevels[characterId] = Math.max(-10, 
      Math.min(10, this.playerState.trustLevels[characterId]));
  }

  /**
   * Adds an item to player inventory
   * @param {string} itemId - Unique item identifier
   * @param {string} itemName - Display name of the item
   */
  addToInventory(itemId, itemName) {
    this.playerState.inventory.push({
      id: itemId,
      name: itemName
    });
  }

  /**
   * Updates world state with key changes
   * @param {string} key - World state key (e.g., 'cityDestroyed', 'artifactFound')
   * @param {*} value - New value for the world state
   */
  updateWorldState(key, value) {
    this.storyState.worldState[key] = value;
  }

  /**
   * Updates character state
   * @param {string} characterId - ID of the character
   * @param {string} key - State key (e.g., 'alive', 'location')
   * @param {*} value - New value for the state
   */
  updateCharacterState(characterId, key, value) {
    if (!this.storyState.characterStates[characterId]) {
      this.storyState.characterStates[characterId] = {};
    }
    
    this.storyState.characterStates[characterId][key] = value;
  }

  /**
   * Records a triggered story event
   * @param {string} eventId - Unique event identifier
   */
  recordTriggeredEvent(eventId) {
    this.storyState.triggeredEvents.push(eventId);
  }

  /**
   * Creates a new narrative branch
   * @param {string} branchId - Unique branch identifier
   * @param {string} fromBranch - Branch this forks from
   */
  createBranch(branchId, fromBranch = 'main') {
    this.storyState.branches[branchId] = {
      from: fromBranch,
      state: JSON.parse(JSON.stringify(this.storyState))
    };
  }

  /**
   * Switches to a different narrative branch
   * @param {string} branchId - Branch to switch to
   */
  switchBranch(branchId) {
    if (this.storyState.branches[branchId]) {
      this.storyState = JSON.parse(JSON.stringify(
        this.storyState.branches[branchId].state
      ));
      this.storyState.currentBranch = branchId;
    }
  }

  /**
   * Gets current narrative state snapshot
   * @returns {Object} - Combined player and story state
   */
  getStateSnapshot() {
    return {
      player: JSON.parse(JSON.stringify(this.playerState)),
      story: JSON.parse(JSON.stringify(this.storyState))
    };
  }

  /**
   * Loads state from snapshot
   * @param {Object} snapshot - State snapshot to load
   */
  loadStateSnapshot(snapshot) {
    if (snapshot.player) {
      this.playerState = JSON.parse(JSON.stringify(snapshot.player));
    }
    
    if (snapshot.story) {
      this.storyState = JSON.parse(JSON.stringify(snapshot.story));
    }
  }
}