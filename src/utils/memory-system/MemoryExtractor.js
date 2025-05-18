/**
 * MemoryExtractor
 *
 * Extracts key information from conversations to create memories
 * that can be recalled later for contextual awareness.
 */

export class MemoryExtractor {
  constructor() {
    this.keywordPatterns = {
      // Personal information
      personal: [
        /my name is ([A-Za-z\s]+)/i,
        /I am ([A-Za-z\s]+)/i,
        /I'm ([A-Za-z\s]+)/i,
        /call me ([A-Za-z\s]+)/i,
        /I work as a ([A-Za-z\s]+)/i,
        /I'm from ([A-Za-z\s]+)/i,
        /I live in ([A-Za-z\s]+)/i,
        /I was born in ([A-Za-z\s]+)/i,
      ],

      // Preferences
      preferences: [
        /I like ([A-Za-z\s]+)/i,
        /I love ([A-Za-z\s]+)/i,
        /I enjoy ([A-Za-z\s]+)/i,
        /I prefer ([A-Za-z\s]+)/i,
        /my favorite ([A-Za-z\s]+) is ([A-Za-z\s]+)/i,
        /I don't like ([A-Za-z\s]+)/i,
        /I hate ([A-Za-z\s]+)/i,
        /I can't stand ([A-Za-z\s]+)/i,
      ],

      // Relationships
      relationships: [
        /my (friend|brother|sister|mother|father|partner|wife|husband|boyfriend|girlfriend|son|daughter) ([A-Za-z\s]+)/i,
        /([A-Za-z\s]+) is my (friend|brother|sister|mother|father|partner|wife|husband|boyfriend|girlfriend|son|daughter)/i,
      ],

      // Events
      events: [
        /I (went|visited|traveled) to ([A-Za-z\s]+)/i,
        /I (did|made|created|built|wrote) ([A-Za-z\s]+)/i,
        /I (will|plan to|want to|hope to) ([A-Za-z\s]+)/i,
        /yesterday I ([A-Za-z\s]+)/i,
        /last (week|month|year) I ([A-Za-z\s]+)/i,
        /tomorrow I (will|plan to) ([A-Za-z\s]+)/i,
      ],

      // Feelings
      feelings: [
        /I feel ([A-Za-z\s]+)/i,
        /I am feeling ([A-Za-z\s]+)/i,
        /I'm feeling ([A-Za-z\s]+)/i,
        /makes me feel ([A-Za-z\s]+)/i,
        /I was ([A-Za-z\s]+) when/i,
      ],

      // Beliefs
      beliefs: [
        /I believe ([A-Za-z\s]+)/i,
        /I think that ([A-Za-z\s]+)/i,
        /in my opinion ([A-Za-z\s]+)/i,
        /I'm convinced that ([A-Za-z\s]+)/i,
      ],
    };

    // Keywords that indicate important information
    this.importantKeywords = [
      "remember",
      "important",
      "forget",
      "key",
      "critical",
      "essential",
      "vital",
      "crucial",
      "significant",
      "major",
      "primary",
      "central",
      "fundamental",
      "necessary",
      "imperative",
      "urgent",
      "priority",
      "secret",
      "confidential",
      "private",
      "personal",
      "sensitive",
    ];
  }

  /**
   * Extract memories from a message
   * @param {Object} message - Message object with text content
   * @param {string} speakerName - Name of the message speaker
   * @returns {Array} - Array of extracted memory objects
   */
  extractMemories(message, speakerName) {
    if (!message || !message.message || typeof message.message !== "string") {
      return [];
    }

    const text = message.message;
    const memories = [];

    // Check for pattern matches
    if (this.keywordPatterns) {
      for (const [category, patterns] of Object.entries(this.keywordPatterns)) {
        if (patterns && Array.isArray(patterns)) {
          for (const pattern of patterns) {
            const matches = text.match(pattern);
            if (matches && matches.length > 1) {
              // Create a memory from the match
              const memory = {
                id: `memory_${Date.now()}_${Math.random()
                  .toString(36)
                  .substr(2, 9)}`,
                type: category,
                content: matches[0],
                speaker: speakerName,
                timestamp: message.timestamp || new Date().toISOString(),
                importance: this.calculateImportance(text, category),
                extracted: true,
              };

              memories.push(memory);
            }
          }
        }
      }
    }

    // Check for sentences with important keywords
    const sentences = text.split(/[.!?]+/).filter((s) => s.trim().length > 0);
    for (const sentence of sentences) {
      if (this.containsImportantKeyword(sentence)) {
        const memory = {
          id: `memory_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
          type: "important",
          content: sentence.trim(),
          speaker: speakerName,
          timestamp: message.timestamp || new Date().toISOString(),
          importance: this.calculateImportance(sentence, "important"),
          extracted: true,
        };

        memories.push(memory);
      }
    }

    return memories;
  }

  /**
   * Check if text contains important keywords
   * @param {string} text - Text to check
   * @returns {boolean} - Whether the text contains important keywords
   */
  containsImportantKeyword(text) {
    const lowerText = text.toLowerCase();
    return this.importantKeywords.some((keyword) =>
      lowerText.includes(keyword)
    );
  }

  /**
   * Calculate importance score for a memory
   * @param {string} text - Memory text
   * @param {string} category - Memory category
   * @returns {number} - Importance score (1-10)
   */
  calculateImportance(text, category) {
    let score = 5; // Default medium importance

    // Adjust based on category
    if (category === "important") {
      score += 2;
    } else if (category === "personal" || category === "relationships") {
      score += 1;
    }

    // Check for important keywords
    const lowerText = text.toLowerCase();
    const keywordCount = this.importantKeywords.filter((keyword) =>
      lowerText.includes(keyword)
    ).length;

    score += Math.min(3, keywordCount); // Max +3 for keywords

    // Check for emphasis (caps, exclamation)
    if (text.match(/[A-Z]{2,}/)) {
      score += 1; // Contains CAPS
    }

    if (text.includes("!")) {
      score += 1; // Contains exclamation
    }

    // Ensure score is within range
    return Math.max(1, Math.min(10, score));
  }

  /**
   * Extract entities from text (people, places, things)
   * @param {string} text - Text to extract entities from
   * @returns {Object} - Object with entity types as keys and arrays of entities as values
   */
  extractEntities(text) {
    // In a real implementation, this would use NLP techniques
    // For now, we'll use simple pattern matching

    const entities = {
      people: [],
      places: [],
      things: [],
    };

    // Extract people (names with capital letters)
    const nameMatches = text.match(/\b[A-Z][a-z]+ [A-Z][a-z]+\b/g);
    if (nameMatches) {
      entities.people = [...new Set(nameMatches)];
    }

    // Extract places (locations often preceded by prepositions)
    const placeMatches = text.match(/\b(in|at|to|from) ([A-Z][a-zA-Z\s]+)\b/g);
    if (placeMatches) {
      entities.places = placeMatches.map((match) => {
        const parts = match.split(" ");
        return parts.slice(1).join(" ");
      });
      entities.places = [...new Set(entities.places)];
    }

    // Extract things (nouns, often preceded by articles)
    const thingMatches = text.match(/\b(the|a|an) ([a-zA-Z\s]+)\b/g);
    if (thingMatches) {
      entities.things = thingMatches.map((match) => {
        const parts = match.split(" ");
        return parts.slice(1).join(" ");
      });
      entities.things = [...new Set(entities.things)];
    }

    return entities;
  }

  /**
   * Create a summary memory from a conversation segment
   * @param {Array} messages - Array of message objects
   * @returns {Object|null} - Summary memory object or null if not enough content
   */
  createSummaryMemory(messages) {
    if (!messages || messages.length < 3) {
      return null;
    }

    // Extract speakers
    const speakers = [
      ...new Set(messages.filter((m) => m.speaker).map((m) => m.speaker)),
    ];

    // Extract main topics using keyword frequency
    const allText = messages
      .filter((m) => m.message && typeof m.message === "string")
      .map((m) => m.message)
      .join(" ");

    // Get word frequency (excluding common words)
    const words = allText.toLowerCase().split(/\W+/);
    const commonWords = [
      "the",
      "and",
      "a",
      "an",
      "in",
      "on",
      "at",
      "to",
      "for",
      "of",
      "with",
      "is",
      "are",
      "was",
      "were",
      "be",
      "been",
      "being",
      "have",
      "has",
      "had",
      "do",
      "does",
      "did",
      "but",
      "or",
      "as",
      "if",
      "then",
      "else",
      "when",
      "up",
      "down",
      "in",
      "out",
      "no",
      "yes",
      "so",
      "this",
      "that",
      "these",
      "those",
      "my",
      "your",
      "his",
      "her",
      "its",
      "our",
      "their",
      "i",
      "you",
      "he",
      "she",
      "it",
      "we",
      "they",
    ];

    const wordFrequency = {};
    words.forEach((word) => {
      if (word.length > 3 && !commonWords.includes(word)) {
        wordFrequency[word] = (wordFrequency[word] || 0) + 1;
      }
    });

    // Get top 5 words by frequency
    const topWords =
      wordFrequency && Object.keys(wordFrequency).length > 0
        ? Object.entries(wordFrequency)
            .sort((a, b) => b[1] - a[1])
            .slice(0, 5)
            .map((entry) => entry[0])
        : [];

    // Create a summary
    const startTime = new Date(messages[0].timestamp || Date.now());
    const endTime = new Date(
      messages[messages.length - 1].timestamp || Date.now()
    );

    let summary = `Conversation between ${speakers.join(" and ")} `;

    if (topWords.length > 0) {
      summary += `about ${topWords.join(", ")}. `;
    }

    // Add time context
    const duration = Math.round((endTime - startTime) / 60000); // minutes
    if (duration > 0) {
      summary += `Lasted about ${duration} minute${duration !== 1 ? "s" : ""}.`;
    }

    return {
      id: `summary_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      type: "summary",
      content: summary,
      speakers: speakers,
      topics: topWords,
      timestamp: endTime.toISOString(),
      importance: 4, // Summaries are moderately important
      messageCount: messages.length,
      extracted: true,
    };
  }
}
