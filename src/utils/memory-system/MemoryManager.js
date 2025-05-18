/**
 * MemoryManager
 * 
 * Manages the storage, retrieval, and prioritization of memories
 * extracted from conversations.
 */

import { MemoryExtractor } from './MemoryExtractor';

export class MemoryManager {
  constructor(options = {}) {
    this.memories = [];
    this.extractor = new MemoryExtractor();
    this.maxMemories = options.maxMemories || 100;
    this.recentMessageCount = options.recentMessageCount || 10;
    this.summaryInterval = options.summaryInterval || 20; // Create summary every 20 messages
    this.lastSummaryIndex = 0;
    this.storageKey = options.storageKey || 'velora-memories';
    
    // Load memories from storage if available
    this.loadFromStorage();
  }
  
  /**
   * Process a new message to extract memories
   * @param {Object} message - Message object
   * @param {Array} recentMessages - Recent messages for context
   * @returns {Array} - Newly created memories
   */
  processMessage(message, recentMessages = []) {
    if (!message || !message.message) {
      return [];
    }
    
    const speakerName = message.speaker || 'Unknown';
    
    // Extract memories from the message
    const extractedMemories = this.extractor.extractMemories(message, speakerName);
    
    // Add the memories to our collection
    extractedMemories.forEach(memory => this.addMemory(memory));
    
    // Check if we should create a summary
    if (recentMessages.length >= this.summaryInterval && 
        recentMessages.length - this.lastSummaryIndex >= this.summaryInterval) {
      
      const messagesToSummarize = recentMessages.slice(
        Math.max(0, recentMessages.length - this.summaryInterval)
      );
      
      const summaryMemory = this.extractor.createSummaryMemory(messagesToSummarize);
      
      if (summaryMemory) {
        this.addMemory(summaryMemory);
        this.lastSummaryIndex = recentMessages.length;
      }
    }
    
    // Save to storage
    this.saveToStorage();
    
    return extractedMemories;
  }
  
  /**
   * Add a memory to the collection
   * @param {Object} memory - Memory object
   */
  addMemory(memory) {
    if (!memory || !memory.content) {
      return;
    }
    
    // Check for duplicates (similar content)
    const isDuplicate = this.memories.some(m => 
      m.content === memory.content || 
      (m.content.length > 10 && memory.content.includes(m.content)) ||
      (memory.content.length > 10 && m.content.includes(memory.content))
    );
    
    if (!isDuplicate) {
      // Add the memory
      this.memories.push({
        ...memory,
        lastAccessed: new Date().toISOString(),
        accessCount: 0,
      });
      
      // Sort by importance and recency
      this.memories.sort((a, b) => {
        // Primary sort by importance (descending)
        if (b.importance !== a.importance) {
          return b.importance - a.importance;
        }
        // Secondary sort by timestamp (most recent first)
        return new Date(b.timestamp) - new Date(a.timestamp);
      });
      
      // Trim if we exceed max memories
      if (this.memories.length > this.maxMemories) {
        // Remove least important memories
        this.memories = this.memories.slice(0, this.maxMemories);
      }
    }
  }
  
  /**
   * Retrieve memories relevant to a context
   * @param {string} context - Context to find relevant memories for
   * @param {Object} options - Options for retrieval
   * @returns {Array} - Relevant memories
   */
  retrieveMemories(context, options = {}) {
    if (!context || !this.memories.length) {
      return [];
    }
    
    const {
      limit = 5,
      minImportance = 0,
      speakerFilter = null,
      typeFilter = null,
      recencyWeight = 0.3,
      importanceWeight = 0.7,
    } = options;
    
    // Calculate relevance scores
    const scoredMemories = this.memories
      .filter(memory => 
        // Apply filters
        (minImportance === 0 || memory.importance >= minImportance) &&
        (speakerFilter === null || memory.speaker === speakerFilter) &&
        (typeFilter === null || memory.type === typeFilter)
      )
      .map(memory => {
        // Calculate relevance score
        const relevanceScore = this.calculateRelevance(memory, context);
        
        // Calculate recency score (0-1)
        const ageInDays = (new Date() - new Date(memory.timestamp)) / (1000 * 60 * 60 * 24);
        const recencyScore = Math.max(0, 1 - (ageInDays / 30)); // 0 after 30 days
        
        // Calculate importance score (0-1)
        const importanceScore = memory.importance / 10;
        
        // Combined score
        const score = (
          (relevanceScore * 0.5) + 
          (recencyScore * recencyWeight) + 
          (importanceScore * importanceWeight)
        );
        
        return { ...memory, score };
      });
    
    // Sort by score and take top results
    const results = scoredMemories
      .sort((a, b) => b.score - a.score)
      .slice(0, limit);
    
    // Update access information for returned memories
    results.forEach(memory => {
      const index = this.memories.findIndex(m => m.id === memory.id);
      if (index !== -1) {
        this.memories[index].lastAccessed = new Date().toISOString();
        this.memories[index].accessCount = (this.memories[index].accessCount || 0) + 1;
      }
    });
    
    // Save to storage after updating access info
    this.saveToStorage();
    
    return results;
  }
  
  /**
   * Calculate relevance of a memory to a context
   * @param {Object} memory - Memory object
   * @param {string} context - Context string
   * @returns {number} - Relevance score (0-1)
   */
  calculateRelevance(memory, context) {
    if (!memory || !memory.content || !context) {
      return 0;
    }
    
    // Convert to lowercase for comparison
    const memoryContent = memory.content.toLowerCase();
    const contextLower = context.toLowerCase();
    
    // Split into words
    const memoryWords = new Set(memoryContent.split(/\W+/).filter(w => w.length > 3));
    const contextWords = new Set(contextLower.split(/\W+/).filter(w => w.length > 3));
    
    // Count matching words
    let matchCount = 0;
    for (const word of memoryWords) {
      if (contextWords.has(word)) {
        matchCount++;
      }
    }
    
    // Calculate Jaccard similarity
    const union = new Set([...memoryWords, ...contextWords]);
    const similarity = matchCount / union.size;
    
    // Check for direct phrase matches
    const phrases = contextLower.split(/[.!?]+/).filter(p => p.trim().length > 0);
    let phraseMatchScore = 0;
    
    for (const phrase of phrases) {
      if (phrase.length > 10 && memoryContent.includes(phrase)) {
        phraseMatchScore = 0.8; // High score for phrase match
        break;
      }
    }
    
    // Return the higher of similarity or phrase match
    return Math.max(similarity, phraseMatchScore);
  }
  
  /**
   * Create a manual memory
   * @param {string} content - Memory content
   * @param {string} speaker - Speaker name
   * @param {string} type - Memory type
   * @param {number} importance - Importance (1-10)
   * @returns {Object} - Created memory
   */
  createMemory(content, speaker = 'User', type = 'manual', importance = 8) {
    if (!content) {
      return null;
    }
    
    const memory = {
      id: `memory_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      type,
      content,
      speaker,
      timestamp: new Date().toISOString(),
      importance,
      extracted: false,
    };
    
    this.addMemory(memory);
    this.saveToStorage();
    
    return memory;
  }
  
  /**
   * Delete a memory by ID
   * @param {string} memoryId - ID of memory to delete
   * @returns {boolean} - Whether deletion was successful
   */
  deleteMemory(memoryId) {
    const initialLength = this.memories.length;
    this.memories = this.memories.filter(memory => memory.id !== memoryId);
    
    const deleted = initialLength > this.memories.length;
    
    if (deleted) {
      this.saveToStorage();
    }
    
    return deleted;
  }
  
  /**
   * Update a memory's importance
   * @param {string} memoryId - ID of memory to update
   * @param {number} importance - New importance value (1-10)
   * @returns {boolean} - Whether update was successful
   */
  updateMemoryImportance(memoryId, importance) {
    const index = this.memories.findIndex(memory => memory.id === memoryId);
    
    if (index !== -1) {
      this.memories[index].importance = Math.max(1, Math.min(10, importance));
      this.saveToStorage();
      return true;
    }
    
    return false;
  }
  
  /**
   * Get all memories
   * @param {Object} options - Filter options
   * @returns {Array} - Filtered memories
   */
  getAllMemories(options = {}) {
    const {
      speakerFilter = null,
      typeFilter = null,
      sortBy = 'importance', // 'importance', 'recency', 'access'
      limit = 0,
    } = options;
    
    let result = [...this.memories];
    
    // Apply filters
    if (speakerFilter) {
      result = result.filter(memory => memory.speaker === speakerFilter);
    }
    
    if (typeFilter) {
      result = result.filter(memory => memory.type === typeFilter);
    }
    
    // Apply sorting
    if (sortBy === 'recency') {
      result.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
    } else if (sortBy === 'access') {
      result.sort((a, b) => (b.accessCount || 0) - (a.accessCount || 0));
    } else {
      // Default: sort by importance
      result.sort((a, b) => b.importance - a.importance);
    }
    
    // Apply limit
    if (limit > 0) {
      result = result.slice(0, limit);
    }
    
    return result;
  }
  
  /**
   * Save memories to local storage
   */
  saveToStorage() {
    try {
      localStorage.setItem(this.storageKey, JSON.stringify(this.memories));
    } catch (error) {
      console.error('Failed to save memories to storage:', error);
    }
  }
  
  /**
   * Load memories from local storage
   */
  loadFromStorage() {
    try {
      const stored = localStorage.getItem(this.storageKey);
      if (stored) {
        this.memories = JSON.parse(stored);
      }
    } catch (error) {
      console.error('Failed to load memories from storage:', error);
      this.memories = [];
    }
  }
  
  /**
   * Clear all memories
   */
  clearMemories() {
    this.memories = [];
    this.saveToStorage();
  }
  
  /**
   * Export memories to JSON
   * @returns {string} - JSON string of memories
   */
  exportMemories() {
    return JSON.stringify(this.memories);
  }
  
  /**
   * Import memories from JSON
   * @param {string} json - JSON string of memories
   * @returns {boolean} - Whether import was successful
   */
  importMemories(json) {
    try {
      const imported = JSON.parse(json);
      if (Array.isArray(imported)) {
        this.memories = imported;
        this.saveToStorage();
        return true;
      }
      return false;
    } catch (error) {
      console.error('Failed to import memories:', error);
      return false;
    }
  }
}
