/**
 * NarrativeDirector
 * 
 * Analyzes conversation history and context to suggest relevant story branches
 * that enhance the narrative experience.
 */

import { extractTopicsFromMessages } from './TopicExtractor';
import { BranchGenerator } from './BranchGenerator';

export class NarrativeDirector {
  constructor(scenarioType = 'adventure') {
    this.scenarioType = scenarioType;
    this.branchGenerator = new BranchGenerator();
    this.lastBranchTime = 0;
    this.messageCountSinceLastBranch = 0;
    this.minMessagesBetweenBranches = 8;
    this.maxMessagesBetweenBranches = 12;
    this.branchHistory = [];
    this.characterRelationships = {};
    this.narrativePhase = 'introduction'; // introduction, rising_action, conflict, resolution, etc.
    this.emotionalTone = 'neutral'; // neutral, tense, relaxed, excited, etc.
    this.narrativeThemes = []; // themes detected in the conversation
  }

  /**
   * Update the scenario type
   * @param {string} scenarioType - The type of scenario (adventure, mystery, etc.)
   */
  setScenarioType(scenarioType) {
    this.scenarioType = scenarioType;
  }

  /**
   * Set character relationships to inform branch generation
   * @param {Object} relationships - Character relationship data
   */
  setCharacterRelationships(relationships) {
    this.characterRelationships = relationships;
  }

  /**
   * Analyze conversation and determine if it's time to suggest a story branch
   * @param {Array} chatHistory - The full chat history
   * @returns {boolean} - Whether it's time to suggest a branch
   */
  shouldSuggestBranch(chatHistory) {
    if (!chatHistory || chatHistory.length === 0) return false;
    
    // Check if enough messages have passed since the last branch
    if (this.messageCountSinceLastBranch < this.minMessagesBetweenBranches) {
      this.messageCountSinceLastBranch++;
      return false;
    }
    
    // If we've reached the maximum messages between branches, definitely suggest one
    if (this.messageCountSinceLastBranch >= this.maxMessagesBetweenBranches) {
      return true;
    }
    
    // Between min and max, use a probability that increases with message count
    const probability = (this.messageCountSinceLastBranch - this.minMessagesBetweenBranches) / 
                        (this.maxMessagesBetweenBranches - this.minMessagesBetweenBranches);
    
    return Math.random() < probability;
  }

  /**
   * Generate story branch options based on the current conversation context
   * @param {Array} chatHistory - The full chat history
   * @param {Object} scenario - The current scenario data
   * @returns {Array} - Array of story branch options
   */
  generateBranchOptions(chatHistory, scenario) {
    // Reset message counter
    this.messageCountSinceLastBranch = 0;
    this.lastBranchTime = Date.now();
    
    // Analyze recent messages to extract context
    const recentMessages = chatHistory.slice(-10);
    const topics = extractTopicsFromMessages(recentMessages);
    
    // Analyze emotional tone
    this.emotionalTone = this.analyzeEmotionalTone(recentMessages);
    
    // Determine narrative phase
    this.updateNarrativePhase(chatHistory);
    
    // Generate branches based on all context
    const branchOptions = this.branchGenerator.generateBranches(
      this.scenarioType,
      topics,
      this.emotionalTone,
      this.narrativePhase,
      this.characterRelationships,
      this.branchHistory
    );
    
    // Record these branches in history to avoid repetition
    this.branchHistory = [...this.branchHistory, ...branchOptions].slice(-10);
    
    return branchOptions;
  }

  /**
   * Analyze the emotional tone of recent messages
   * @param {Array} messages - Recent messages to analyze
   * @returns {string} - The dominant emotional tone
   */
  analyzeEmotionalTone(messages) {
    if (!messages || messages.length === 0) return 'neutral';
    
    // Count emotional indicators in messages
    const emotionCounts = {
      tense: 0,
      excited: 0,
      sad: 0,
      happy: 0,
      angry: 0,
      fearful: 0,
      neutral: 0
    };
    
    // Words that indicate different emotions
    const emotionIndicators = {
      tense: ['worried', 'anxious', 'nervous', 'tense', 'stress', 'uneasy', 'concerned'],
      excited: ['excited', 'thrilled', 'eager', 'enthusiastic', 'amazed', 'wow', 'incredible'],
      sad: ['sad', 'sorry', 'unfortunate', 'regret', 'miss', 'loss', 'disappointed'],
      happy: ['happy', 'glad', 'pleased', 'joy', 'delighted', 'wonderful', 'great'],
      angry: ['angry', 'furious', 'annoyed', 'irritated', 'mad', 'rage', 'hate'],
      fearful: ['afraid', 'scared', 'terrified', 'fear', 'dread', 'horror', 'panic']
    };
    
    // Analyze each message
    messages.forEach(message => {
      if (!message.message) return;
      
      const text = message.message.toLowerCase();
      let foundEmotion = false;
      
      // Check for emotion indicators
      Object.entries(emotionIndicators).forEach(([emotion, indicators]) => {
        if (indicators.some(indicator => text.includes(indicator))) {
          emotionCounts[emotion]++;
          foundEmotion = true;
        }
      });
      
      // If no specific emotion was found, count as neutral
      if (!foundEmotion) {
        emotionCounts.neutral++;
      }
    });
    
    // Find the dominant emotion
    let dominantEmotion = 'neutral';
    let maxCount = 0;
    
    Object.entries(emotionCounts).forEach(([emotion, count]) => {
      if (count > maxCount) {
        maxCount = count;
        dominantEmotion = emotion;
      }
    });
    
    return dominantEmotion;
  }

  /**
   * Update the current narrative phase based on conversation progress
   * @param {Array} chatHistory - The full chat history
   */
  updateNarrativePhase(chatHistory) {
    if (!chatHistory) return;
    
    const messageCount = chatHistory.length;
    
    // Simple phase determination based on message count
    // In a more sophisticated implementation, this would analyze narrative structure
    if (messageCount < 10) {
      this.narrativePhase = 'introduction';
    } else if (messageCount < 25) {
      this.narrativePhase = 'rising_action';
    } else if (messageCount < 40) {
      this.narrativePhase = 'conflict';
    } else if (messageCount < 60) {
      this.narrativePhase = 'climax';
    } else {
      this.narrativePhase = 'resolution';
    }
    
    // Adjust based on emotional tone
    if (this.emotionalTone === 'tense' || this.emotionalTone === 'angry') {
      // Tense emotions push the narrative toward conflict
      if (this.narrativePhase === 'rising_action') {
        this.narrativePhase = 'conflict';
      }
    } else if (this.emotionalTone === 'happy' || this.emotionalTone === 'excited') {
      // Positive emotions can delay conflict
      if (this.narrativePhase === 'conflict' && Math.random() < 0.3) {
        this.narrativePhase = 'rising_action';
      }
    }
  }

  /**
   * Record that a specific branch was selected
   * @param {string} selectedBranch - The branch that was selected
   */
  recordBranchSelection(selectedBranch) {
    // In a more sophisticated implementation, this would influence future branch generation
    // by learning from user preferences
    
    // For now, just ensure this exact branch doesn't appear again too soon
    this.branchHistory.push(selectedBranch);
    this.branchHistory = this.branchHistory.slice(-10); // Keep last 10 branches
  }
}
