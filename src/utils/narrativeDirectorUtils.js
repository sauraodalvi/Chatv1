/**
 * Narrative Director Utility Functions
 *
 * This module acts as a hidden narrative director to guide the conversation flow,
 * maintain contextual continuity, and ensure engaging story progression.
 */

/**
 * Track the recent dialogue history and extract key narrative elements
 *
 * @param {Array} chatHistory - The full chat history
 * @param {number} messageCount - Number of recent messages to analyze
 * @returns {Object} - Extracted narrative elements
 */
export const analyzeDialogueHistory = (chatHistory, messageCount = 6) => {
  if (!chatHistory || chatHistory.length === 0) {
    return {
      recentSpeakers: [],
      dominantSpeaker: null,
      recentTopics: [],
      dominantTopic: null,
      emotionalTone: 'neutral',
      actionCount: 0,
      questionCount: 0,
      unaddressedQuestions: [],
      recentActions: [],
      conversationPace: 'moderate'
    };
  }

  // Get the most recent messages
  const recentMessages = chatHistory.slice(-messageCount);

  // Extract speakers
  const speakers = recentMessages.map(msg => msg.speaker);
  const speakerCounts = speakers.reduce((counts, speaker) => {
    counts[speaker] = (counts[speaker] || 0) + 1;
    return counts;
  }, {});

  // Find dominant speaker
  const dominantSpeaker = Object.entries(speakerCounts)
    .sort((a, b) => b[1] - a[1])[0]?.[0] || null;

  // Extract topics from messages
  const allTopics = recentMessages.flatMap(msg => extractTopics(msg.message));
  const topicCounts = allTopics.reduce((counts, topic) => {
    counts[topic] = (counts[topic] || 0) + 1;
    return counts;
  }, {});

  // Find dominant topic
  const dominantTopic = Object.entries(topicCounts)
    .sort((a, b) => b[1] - a[1])[0]?.[0] || null;

  // Analyze emotional tone
  const emotionalTone = analyzeEmotionalTone(recentMessages);

  // Count actions (messages with asterisks)
  const actionCount = recentMessages.filter(msg =>
    msg.message.includes('*') || (msg.isAction === true)
  ).length;

  // Extract recent actions
  const recentActions = recentMessages
    .filter(msg => msg.message.includes('*') || (msg.isAction === true))
    .map(msg => {
      // Extract text between asterisks
      const actionMatch = msg.message.match(/\*(.*?)\*/);
      return {
        speaker: msg.speaker,
        action: actionMatch ? actionMatch[1] : msg.message
      };
    });

  // Count questions
  const questionCount = recentMessages.filter(msg =>
    msg.message.includes('?')
  ).length;

  // Find unaddressed questions
  const unaddressedQuestions = [];
  for (let i = 0; i < recentMessages.length; i++) {
    const msg = recentMessages[i];
    if (msg.message.includes('?')) {
      // Check if any subsequent message addresses this question
      const isAddressed = recentMessages.slice(i + 1).some(laterMsg =>
        laterMsg.replyTo === msg.id
      );

      if (!isAddressed) {
        unaddressedQuestions.push({
          id: msg.id,
          speaker: msg.speaker,
          question: msg.message
        });
      }
    }
  }

  // Determine conversation pace
  const timestamps = recentMessages.map(msg => new Date(msg.timestamp).getTime());
  let timeDiffs = [];
  for (let i = 1; i < timestamps.length; i++) {
    timeDiffs.push(timestamps[i] - timestamps[i - 1]);
  }

  const averageTimeBetweenMessages = timeDiffs.length > 0
    ? timeDiffs.reduce((sum, diff) => sum + diff, 0) / timeDiffs.length
    : 0;

  let conversationPace;
  if (averageTimeBetweenMessages < 5000) {
    conversationPace = 'rapid';
  } else if (averageTimeBetweenMessages < 15000) {
    conversationPace = 'moderate';
  } else {
    conversationPace = 'slow';
  }

  return {
    recentSpeakers: speakers,
    dominantSpeaker,
    recentTopics: Object.keys(topicCounts),
    dominantTopic,
    emotionalTone,
    actionCount,
    questionCount,
    unaddressedQuestions,
    recentActions,
    conversationPace
  };
};

/**
 * Extract topics from a message
 *
 * @param {string} message - The message to analyze
 * @returns {Array} - Extracted topics
 */
const extractTopics = (message) => {
  if (!message) return [];

  // Remove action text (text between asterisks)
  const cleanMessage = message.replace(/\*.*?\*/g, '');

  // Simple keyword extraction (could be enhanced with NLP)
  const words = cleanMessage.toLowerCase().split(/\s+/);
  const stopWords = ['the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'with', 'by', 'about', 'like', 'through', 'over', 'before', 'after', 'between', 'under', 'during', 'without', 'of', 'up', 'down', 'is', 'are', 'was', 'were', 'be', 'been', 'being', 'have', 'has', 'had', 'do', 'does', 'did', 'will', 'would', 'shall', 'should', 'can', 'could', 'may', 'might', 'must', 'that', 'this', 'these', 'those', 'i', 'you', 'he', 'she', 'it', 'we', 'they', 'me', 'him', 'her', 'us', 'them'];

  // Filter out stop words and short words
  const significantWords = words.filter(word =>
    !stopWords.includes(word) && word.length > 3
  );

  // Return unique topics
  return [...new Set(significantWords)];
};

/**
 * Analyze the emotional tone of recent messages
 *
 * @param {Array} messages - Messages to analyze
 * @returns {string} - Dominant emotional tone
 */
const analyzeEmotionalTone = (messages) => {
  if (!messages || messages.length === 0) return 'neutral';

  // Simple emotion keywords
  const emotionKeywords = {
    angry: ['angry', 'furious', 'enraged', 'mad', 'outraged', 'livid', 'seething', 'hate', 'fury'],
    sad: ['sad', 'depressed', 'unhappy', 'miserable', 'gloomy', 'heartbroken', 'grief', 'sorrow'],
    happy: ['happy', 'joyful', 'delighted', 'pleased', 'glad', 'cheerful', 'thrilled', 'excited'],
    afraid: ['afraid', 'scared', 'frightened', 'terrified', 'fearful', 'panicked', 'alarmed'],
    surprised: ['surprised', 'shocked', 'amazed', 'astonished', 'stunned', 'startled'],
    tense: ['tense', 'anxious', 'nervous', 'worried', 'concerned', 'uneasy', 'stressed'],
    curious: ['curious', 'interested', 'intrigued', 'fascinated', 'wonder', 'questioning'],
    determined: ['determined', 'resolved', 'committed', 'focused', 'steadfast', 'dedicated']
  };

  // Count emotion keywords in messages
  const emotionCounts = Object.keys(emotionKeywords).reduce((counts, emotion) => {
    counts[emotion] = 0;
    return counts;
  }, {});

  messages.forEach(msg => {
    const messageLower = msg.message.toLowerCase();

    Object.entries(emotionKeywords).forEach(([emotion, keywords]) => {
      if (keywords.some(keyword => messageLower.includes(keyword))) {
        emotionCounts[emotion]++;
      }
    });

    // Check for exclamation marks (intensity)
    if (messageLower.includes('!')) {
      // Increase counts for intense emotions
      emotionCounts.angry += (messageLower.match(/!/g) || []).length * 0.5;
      emotionCounts.happy += (messageLower.match(/!/g) || []).length * 0.5;
      emotionCounts.surprised += (messageLower.match(/!/g) || []).length * 0.5;
    }

    // Check for question marks (curiosity)
    if (messageLower.includes('?')) {
      emotionCounts.curious += (messageLower.match(/\?/g) || []).length;
    }
  });

  // Find dominant emotion
  const dominantEmotion = Object.entries(emotionCounts)
    .sort((a, b) => b[1] - a[1])[0];

  // If no clear emotion or very low counts, return neutral
  if (!dominantEmotion || dominantEmotion[1] < 2) {
    return 'neutral';
  }

  return dominantEmotion[0];
};

/**
 * Generate narrative guidance for the next message
 *
 * @param {Object} narrativeAnalysis - Analysis of recent dialogue
 * @param {Object} storyArc - Current story arc
 * @param {Object} character - Character who will be speaking
 * @returns {Object} - Narrative guidance for the next message
 */
export const generateNarrativeGuidance = (narrativeAnalysis, storyArc, character) => {
  if (!narrativeAnalysis || !storyArc || !character) {
    return {
      narrativeGoal: 'continue-conversation',
      suggestedApproach: 'respond-naturally',
      topicGuidance: '',
      emotionalGuidance: '',
      paceGuidance: 'maintain-current-pace',
      continuityNotes: ''
    };
  }

  const {
    recentSpeakers,
    dominantSpeaker,
    recentTopics,
    dominantTopic,
    emotionalTone,
    actionCount,
    questionCount,
    unaddressedQuestions,
    recentActions,
    conversationPace
  } = narrativeAnalysis;

  const {
    theme,
    currentPhase,
    currentTension,
    currentGoal
  } = storyArc;

  // Initialize guidance
  const guidance = {
    narrativeGoal: 'continue-conversation',
    suggestedApproach: 'respond-naturally',
    topicGuidance: '',
    emotionalGuidance: '',
    paceGuidance: 'maintain-current-pace',
    continuityNotes: ''
  };

  // Determine narrative goal based on story phase
  if (currentPhase === 'introduction') {
    guidance.narrativeGoal = 'establish-character-relationships';
    guidance.suggestedApproach = 'reveal-character-traits';
    guidance.continuityNotes = 'Introduce character background and establish initial dynamics.';
  } else if (currentPhase === 'discovery') {
    guidance.narrativeGoal = 'explore-scenario-mystery';
    guidance.suggestedApproach = 'share-observations';
    guidance.continuityNotes = 'Focus on uncovering new information about the scenario.';
  } else if (currentPhase === 'conflict') {
    guidance.narrativeGoal = 'address-immediate-threat';
    guidance.suggestedApproach = 'take-action';
    guidance.continuityNotes = 'Respond to the current threat with urgency and purpose.';
  } else if (currentPhase === 'planning') {
    guidance.narrativeGoal = 'develop-strategy';
    guidance.suggestedApproach = 'contribute-ideas';
    guidance.continuityNotes = 'Focus on finding solutions and preparing for the climax.';
  } else if (currentPhase === 'climax') {
    guidance.narrativeGoal = 'resolve-central-conflict';
    guidance.suggestedApproach = 'decisive-action';
    guidance.continuityNotes = 'This is the critical moment - actions should be dramatic and consequential.';
  } else if (currentPhase === 'resolution') {
    guidance.narrativeGoal = 'reflect-on-events';
    guidance.suggestedApproach = 'provide-closure';
    guidance.continuityNotes = 'Acknowledge what has happened and look toward the future.';
  }

  // Adjust for conversation balance
  if (dominantSpeaker && dominantSpeaker === character.name) {
    guidance.suggestedApproach = 'invite-others-to-speak';
    guidance.continuityNotes += ' Avoid dominating the conversation.';
  }

  // Address unaddressed questions
  if (unaddressedQuestions.length > 0) {
    const relevantQuestion = unaddressedQuestions.find(q => q.speaker !== character.name);
    if (relevantQuestion) {
      guidance.narrativeGoal = 'address-open-question';
      guidance.topicGuidance = `Answer the question from ${relevantQuestion.speaker}.`;
      guidance.continuityNotes += ` Respond to the unanswered question.`;
    }
  }

  // Adjust for action balance
  if (actionCount < 2 && currentPhase !== 'planning' && currentPhase !== 'resolution') {
    guidance.suggestedApproach = 'include-physical-action';
    guidance.continuityNotes += ' Include more physical actions to create a sense of movement.';
  } else if (actionCount > 4) {
    guidance.suggestedApproach = 'focus-on-dialogue';
    guidance.continuityNotes += ' Balance physical actions with meaningful dialogue.';
  }

  // Adjust for emotional tone
  if (emotionalTone === 'neutral' && (currentPhase === 'conflict' || currentPhase === 'climax')) {
    guidance.emotionalGuidance = 'increase-emotional-intensity';
    guidance.continuityNotes += ' Show more emotional response to the high-stakes situation.';
  } else if ((emotionalTone === 'angry' || emotionalTone === 'tense') && currentPhase === 'resolution') {
    guidance.emotionalGuidance = 'move-toward-resolution';
    guidance.continuityNotes += ' Begin to resolve emotional tensions as the story concludes.';
  }

  // Adjust for conversation pace
  if (conversationPace === 'rapid' && (currentPhase === 'planning' || currentPhase === 'discovery')) {
    guidance.paceGuidance = 'slow-down-for-depth';
    guidance.continuityNotes += ' Take time to explore ideas more thoroughly.';
  } else if (conversationPace === 'slow' && (currentPhase === 'conflict' || currentPhase === 'climax')) {
    guidance.paceGuidance = 'increase-urgency';
    guidance.continuityNotes += ' Respond with greater urgency to match the situation.';
  }

  // Add topic continuity
  if (recentTopics.length > 0 && currentPhase !== 'introduction') {
    guidance.topicGuidance = `Maintain continuity with recent topics: ${recentTopics.slice(0, 3).join(', ')}.`;
  }

  return guidance;
};

/**
 * Generate a character-specific response format based on narrative guidance
 *
 * @param {Object} character - The character who will be speaking
 * @param {Object} narrativeGuidance - Guidance for the narrative direction
 * @param {Object} storyArc - Current story arc
 * @returns {Object} - Response format guidance
 */
export const generateResponseFormat = (character, narrativeGuidance, storyArc) => {
  if (!character || !narrativeGuidance || !storyArc) {
    return {
      includeAction: true,
      actionPlacement: 'before',
      responseLength: 'medium',
      includeThought: false
    };
  }

  const { currentPhase, currentTension } = storyArc;
  const { narrativeGoal, suggestedApproach, paceGuidance } = narrativeGuidance;

  // Default format
  const format = {
    includeAction: true,
    actionPlacement: 'before',
    responseLength: 'medium',
    includeThought: false
  };

  // Adjust action inclusion and placement
  if (suggestedApproach === 'include-physical-action') {
    format.includeAction = true;
    format.actionPlacement = Math.random() > 0.5 ? 'before' : 'during';
  } else if (suggestedApproach === 'focus-on-dialogue') {
    format.includeAction = Math.random() > 0.7; // 30% chance of action
  }

  // Adjust response length based on pace guidance and phase
  if (paceGuidance === 'increase-urgency' || currentPhase === 'conflict' || currentPhase === 'climax') {
    format.responseLength = 'short';
  } else if (paceGuidance === 'slow-down-for-depth' || currentPhase === 'planning' || currentPhase === 'discovery') {
    format.responseLength = 'long';
  }

  // Determine if internal thoughts should be included
  if (narrativeGoal === 'establish-character-relationships' ||
      narrativeGoal === 'reflect-on-events' ||
      suggestedApproach === 'reveal-character-traits') {
    format.includeThought = Math.random() > 0.5; // 50% chance
  }

  return format;
};

/**
 * Format a character response according to the response format
 *
 * @param {string} response - The raw response text
 * @param {Object} format - Response format guidance
 * @param {string} sceneDescription - Optional scene description
 * @returns {string} - Formatted response
 */
export const formatCharacterResponse = (response, format, sceneDescription = '') => {
  if (!response) return '';

  const {
    includeAction,
    actionPlacement,
    responseLength,
    includeThought
  } = format || {
    includeAction: true,
    actionPlacement: 'before',
    responseLength: 'medium',
    includeThought: false
  };

  // Clean up the response
  let cleanResponse = response.trim();

  // Remove any existing scene descriptions or actions
  cleanResponse = cleanResponse.replace(/^\*.*?\*\s*/g, '');

  // Enforce dialogue rules - limit to 1-3 sentences for better pacing
  const sentences = cleanResponse.split(/(?<=[.!?])\s+/);
  if (sentences.length > 3) {
    // Keep only the first 3 sentences
    cleanResponse = sentences.slice(0, 3).join(' ');
  }

  // Adjust response length based on format guidance
  if (responseLength === 'short' && cleanResponse.length > 100) {
    // Shorten to first sentence or first 100 characters
    const firstSentence = cleanResponse.split(/[.!?]/, 1)[0];
    if (firstSentence.length > 30) {
      cleanResponse = firstSentence + '.';
    } else {
      cleanResponse = cleanResponse.substring(0, 100) + '...';
    }
  }

  // Check for generic AI phrases and replace them with character-appropriate alternatives
  const genericPhrases = [
    "I understand",
    "I see",
    "That's interesting",
    "Let me think",
    "Let's explore",
    "Let's discuss",
    "Let's talk about",
    "Let's change the topic",
    "As an AI",
    "As a language model",
    "I don't have personal",
    "I don't have the ability",
    "I cannot",
    "I'm not able to",
    "I'm just a",
    "I'm an AI",
    "I'm a character",
    "I'm here to help",
    "I'm happy to assist",
    "I'd be happy to",
    "I'd love to help",
    "I'd be glad to",
    "I apologize, but",
    "I'm sorry, but",
    "Thanks for sharing",
    "Thank you for sharing"
  ];

  // Check for and remove generic phrases
  for (const phrase of genericPhrases) {
    if (cleanResponse.toLowerCase().includes(phrase.toLowerCase())) {
      // Remove the phrase and any following comma
      cleanResponse = cleanResponse.replace(new RegExp(phrase + ',?\\s*', 'i'), '');
      // Capitalize the first letter if needed
      cleanResponse = cleanResponse.charAt(0).toUpperCase() + cleanResponse.slice(1);
    }
  }

  // Format with scene description
  let formattedResponse = '';

  if (includeAction && sceneDescription) {
    if (actionPlacement === 'before') {
      formattedResponse = `*${sceneDescription}* ${cleanResponse}`;
    } else if (actionPlacement === 'during') {
      // Split response roughly in half for mid-sentence action
      const words = cleanResponse.split(' ');
      const midpoint = Math.floor(words.length / 2);

      const firstHalf = words.slice(0, midpoint).join(' ');
      const secondHalf = words.slice(midpoint).join(' ');

      formattedResponse = `${firstHalf} *${sceneDescription}* ${secondHalf}`;
    } else {
      formattedResponse = `${cleanResponse} *${sceneDescription}*`;
    }
  } else {
    formattedResponse = cleanResponse;
  }

  // Add internal thought if needed
  if (includeThought) {
    // Extract a key phrase from the response
    const words = cleanResponse.split(' ');
    const startIndex = Math.floor(words.length / 3);
    const endIndex = Math.min(startIndex + 5, words.length);
    const thoughtPhrase = words.slice(startIndex, endIndex).join(' ');

    // Add thought at the end
    formattedResponse += ` *thinking: ${thoughtPhrase}...*`;
  }

  return formattedResponse;
};
