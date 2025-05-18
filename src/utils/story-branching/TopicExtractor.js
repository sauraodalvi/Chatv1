/**
 * Topic Extractor
 * 
 * Extracts key topics and themes from conversation messages
 * to inform contextually relevant story branches.
 */

/**
 * Extract topics from recent messages
 * @param {Array} messages - Recent messages to analyze
 * @returns {Array} - Array of extracted topics
 */
export const extractTopicsFromMessages = (messages) => {
  if (!messages || messages.length === 0) return [];
  
  // Combine all message text
  const combinedText = messages
    .map(msg => msg.message || '')
    .join(' ')
    .toLowerCase();
  
  // Extract potential topics using various methods
  const topics = [
    ...extractNamedEntities(combinedText),
    ...extractKeyPhrases(combinedText),
    ...extractActionVerbs(combinedText),
    ...extractEmotionalThemes(combinedText),
    ...extractLocationReferences(combinedText)
  ];
  
  // Remove duplicates and filter out common words
  return [...new Set(topics)]
    .filter(topic => topic.length > 3)
    .filter(topic => !commonWords.includes(topic))
    .slice(0, 10); // Limit to top 10 topics
};

/**
 * Extract named entities (people, places, objects)
 * @param {string} text - Text to analyze
 * @returns {Array} - Array of named entities
 */
const extractNamedEntities = (text) => {
  // In a real implementation, this would use NLP techniques
  // For now, we'll use a simple approach to simulate entity extraction
  
  const entities = [];
  
  // Look for capitalized words that might be names
  const namePattern = /\b[A-Z][a-z]+\b/g;
  const potentialNames = text.match(namePattern) || [];
  entities.push(...potentialNames.map(name => name.toLowerCase()));
  
  // Look for specific entity patterns
  const patterns = [
    // Objects that might be important
    /\b(sword|book|key|map|scroll|artifact|gem|crystal|potion|device|machine|computer|weapon|tool|ship|vehicle)\b/g,
    // Places
    /\b(castle|tower|forest|mountain|cave|dungeon|city|village|temple|shrine|lab|station|planet|galaxy|dimension|realm)\b/g,
    // Concepts
    /\b(magic|technology|science|power|energy|force|spirit|soul|mind|knowledge|wisdom|truth|secret|mystery|quest|mission)\b/g
  ];
  
  patterns.forEach(pattern => {
    const matches = text.match(pattern) || [];
    entities.push(...matches);
  });
  
  return entities;
};

/**
 * Extract key phrases that might indicate important topics
 * @param {string} text - Text to analyze
 * @returns {Array} - Array of key phrases
 */
const extractKeyPhrases = (text) => {
  const phrases = [];
  
  // Look for phrases that indicate important topics
  const patterns = [
    // "The X" phrases often indicate important elements
    /\bthe ([a-z]+)\b/g,
    // "This X" phrases
    /\bthis ([a-z]+)\b/g,
    // "That X" phrases
    /\bthat ([a-z]+)\b/g,
    // Possessive phrases
    /\b([a-z]+)'s ([a-z]+)\b/g
  ];
  
  patterns.forEach(pattern => {
    let match;
    while ((match = pattern.exec(text)) !== null) {
      if (match[1] && match[1].length > 3) {
        phrases.push(match[1]);
      }
      if (match[2] && match[2].length > 3) {
        phrases.push(match[2]);
      }
    }
  });
  
  return phrases;
};

/**
 * Extract action verbs that might indicate activities
 * @param {string} text - Text to analyze
 * @returns {Array} - Array of action verbs
 */
const extractActionVerbs = (text) => {
  const verbs = [];
  
  // Common action verbs that might indicate story direction
  const actionVerbPatterns = [
    /\b(attack|fight|defend|protect|save|rescue|escape|flee|hide|search|find|discover|explore|investigate|solve|create|build|make|destroy|break|steal|take|give|help|heal|hurt|kill|travel|journey|quest|seek)\b/g
  ];
  
  actionVerbPatterns.forEach(pattern => {
    const matches = text.match(pattern) || [];
    verbs.push(...matches);
  });
  
  return verbs;
};

/**
 * Extract emotional themes
 * @param {string} text - Text to analyze
 * @returns {Array} - Array of emotional themes
 */
const extractEmotionalThemes = (text) => {
  const themes = [];
  
  // Emotional theme patterns
  const emotionalPatterns = [
    /\b(love|hate|fear|hope|despair|joy|sorrow|anger|peace|conflict|betrayal|loyalty|trust|suspicion|revenge|forgiveness)\b/g
  ];
  
  emotionalPatterns.forEach(pattern => {
    const matches = text.match(pattern) || [];
    themes.push(...matches);
  });
  
  return themes;
};

/**
 * Extract location references
 * @param {string} text - Text to analyze
 * @returns {Array} - Array of location references
 */
const extractLocationReferences = (text) => {
  const locations = [];
  
  // Location patterns
  const locationPatterns = [
    /\b(north|south|east|west|inside|outside|above|below|beyond|behind|beneath|within|around)\b/g,
    /\b(go to|head to|travel to|arrive at|reach|enter|exit|leave) the ([a-z]+)\b/g
  ];
  
  locationPatterns.forEach(pattern => {
    let match;
    if (pattern.toString().includes('(go to|head to')) {
      // Extract the location from phrases like "go to the castle"
      while ((match = pattern.exec(text)) !== null) {
        if (match[2] && match[2].length > 3) {
          locations.push(match[2]);
        }
      }
    } else {
      const matches = text.match(pattern) || [];
      locations.push(...matches);
    }
  });
  
  return locations;
};

// Common words to filter out
const commonWords = [
  'this', 'that', 'these', 'those', 'there', 'here', 'where', 'when', 'what', 'which',
  'who', 'whom', 'whose', 'why', 'how', 'have', 'has', 'had', 'does', 'did', 'doing',
  'will', 'would', 'should', 'could', 'might', 'must', 'just', 'very', 'really', 'quite',
  'more', 'most', 'some', 'other', 'another', 'many', 'much', 'such', 'with', 'from',
  'about', 'like', 'into', 'onto', 'upon', 'after', 'before', 'during', 'while', 'since',
  'until', 'though', 'although', 'even', 'also', 'then', 'than', 'well', 'back', 'down',
  'over', 'under', 'again', 'still', 'only', 'ever', 'never', 'always', 'often', 'sometimes'
];
