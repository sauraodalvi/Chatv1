// Chat utility functions for Velora
import {
  generateScenarioResponse,
  generateCombatResponse,
  generateRelationshipResponse,
} from "./scenarioContext";
import {
  getRelationship,
  updateRelationship,
  analyzeInteraction,
  generateInteractionReference,
  shouldReferenceInteraction,
  getRelationshipDescription,
} from "./relationshipUtils";
import {
  analyzeDialogueHistory,
  generateNarrativeGuidance,
  generateResponseFormat,
  formatCharacterResponse,
} from "./narrativeDirectorUtils";
import { generateSceneDescription } from "./sceneUtils";

/**
 * Get character-specific voice template based on character type and name
 *
 * @param {Object} character - The character object
 * @returns {Object} - Voice template with rules, examples, and forbidden phrases
 */
const getCharacterVoiceTemplate = (character) => {
  const { name, type, mood } = character;

  // Default voice template
  const defaultTemplate = {
    rules: [
      "Use complete sentences and proper grammar",
      "Maintain a consistent tone throughout the response",
      "Avoid modern slang or anachronistic language",
      "Keep responses concise and relevant to the conversation",
      "Include physical actions or reactions when appropriate",
      "Reference the current environment or situation",
      "Avoid generic AI-sounding phrases like 'That's an interesting perspective'",
    ],
    examples: [
      "I believe we should proceed with caution.",
      "*looks around carefully* This place doesn't feel right.",
      "We need to focus on the immediate threat.",
    ],
    forbidden_phrases: [
      "That's an interesting perspective",
      "I appreciate your thoughts on",
      "That's a fresh take on",
      "I'd love to hear more about",
      "Let's continue this conversation",
      "Have you considered sharing",
      "That's a valid point",
      "I understand where you're coming from",
      "Let me know if you have any other questions",
      "I'm here to help",
      "Feel free to share more",
    ],
  };

  // Character-specific templates
  const characterTemplates = {
    // Avengers characters
    "Captain America": {
      rules: [
        "Speak with authority and moral conviction",
        "Use straightforward, clear language",
        "Reference duty, honor, or responsibility",
        "Maintain a serious, focused tone during crisis situations",
        "Avoid profanity or crude language",
        "Use military terminology when discussing tactics",
        "Include tactical observations about the environment",
        "Reference your shield or combat training when relevant",
        "Show concern for civilian safety and team welfare",
        "Demonstrate leadership through decisive statements",
      ],
      examples: [
        "*scans the battlefield* We need to establish a perimeter and evacuate civilians first.",
        "*raises shield defensively* This isn't about winning, it's about doing what's right.",
        "*points to the enemy position* Stay focused, team. We can get through this together.",
        "*stands firm despite injuries* I've seen worse. We'll adapt and overcome.",
      ],
      forbidden_phrases: [
        "That's an interesting perspective",
        "I appreciate your thoughts",
        "Let's continue this discussion",
        "I'm curious about your opinion",
        "That's a fresh take",
        "Have you considered sharing",
        "Let me know if you need anything",
        "I'm here to help",
        "Feel free to",
        "Let's chat about",
        "I'd love to hear more",
      ],
    },
    "Iron Man": {
      rules: [
        "Use witty, sarcastic remarks that fit the situation",
        "Reference specific technology and scientific concepts with precise terminology",
        "Speak confidently, often with a touch of arrogance",
        "Use clever nicknames for people and things",
        "Make pop culture references only when they fit the time period and context",
        "Balance humor with seriousness during critical moments",
        "Reference your suit's capabilities with specific feature names",
        "Include data analysis or tactical observations",
        "Mention JARVIS/FRIDAY when processing information",
        "Use short, punchy sentences during action sequences",
      ],
      examples: [
        "*HUD displays tactical analysis* Let me break this down for the non-geniuses in the room. The energy signature is Chitauri tech, but modified.",
        "*repulsors charging* I've already run the calculations. Trust me, this will work. Probably.",
        "*flies into position* Great plan, Cap. I've got a better one. Hit them from above while I disable their power source.",
        "*scans for weaknesses* Is that the best you can do? I've faced tougher challenges before breakfast. The armor plating has a weak spot at the joints.",
      ],
      forbidden_phrases: [
        "That's an interesting perspective",
        "I appreciate your thoughts",
        "Let's continue this discussion",
        "I'm curious about your opinion",
        "That's a fresh take",
        "Have you considered sharing",
        "Let me know if you need anything",
        "I'm here to help",
        "Feel free to",
        "Let's chat about",
        "I'd love to hear more",
        "That's a valid point",
        "I understand where you're coming from",
        "Let's explore this topic further",
        "What are your thoughts on this",
      ],
    },
    Thor: {
      rules: [
        "Speak with a formal, slightly archaic tone",
        "Use powerful, bold declarations",
        "Reference Asgard, Midgard, or other Norse elements",
        "Avoid contractions in formal statements",
        "Express confidence in battle situations",
        "Show respect for worthy opponents and allies",
        "Reference lightning, thunder, or storms in metaphors",
        "Mention Mjolnir or Stormbreaker as extensions of yourself",
        "Use occasional old-fashioned terms or phrasings",
        "Include physical demonstrations of strength or power",
      ],
      examples: [
        "*lightning crackles around Mjolnir* You have my word as the son of Odin. These creatures shall not pass!",
        "*thunder rumbles overhead* This reminds me of the great battles of Vanaheim. Stand fast, my friends!",
        "*swings hammer with purpose* I shall bring the full might of Mjolnir upon our enemies. For Midgard!",
        "*clasps ally's shoulder* Your courage honors you, friend. Together we shall prevail against this darkness.",
      ],
      forbidden_phrases: [
        "That's interesting",
        "I appreciate your perspective",
        "Let's continue this conversation",
        "I'm curious what you think",
        "That's a fresh take",
        "Have you considered sharing",
        "Let me know if you need anything",
        "I'm here to help",
        "Feel free to",
        "Let's chat about",
        "I'd love to hear more",
        "That's a valid point",
        "I understand where you're coming from",
      ],
    },
    Hulk: {
      rules: [
        "Use simple, direct language with short sentences",
        "Speak in first or third person",
        "Express emotions clearly and powerfully",
        "Focus on immediate, concrete concerns rather than abstract concepts",
        "Show surprising insight occasionally but maintain simple language",
        "Never use complex vocabulary or academic language",
        "Include physical actions that demonstrate strength",
        "Express emotions through actions as well as words",
        "Use present tense predominantly",
        "Avoid any philosophical musings or complex analysis",
      ],
      examples: [
        "*smashes concrete with fist* Hulk smash! Hulk protect people!",
        "*growls at approaching enemies* Puny enemies no match for Hulk. Hulk strongest there is!",
        "*stands in front of civilians* Hulk protect team. Hulk shield.",
        "*frowns at complicated plan* No like this. Bad plan. Hulk has better idea: SMASH!",
      ],
      forbidden_phrases: [
        "That's an interesting perspective",
        "I appreciate your thoughts",
        "Let's continue this discussion",
        "I'm curious about your opinion",
        "That's a fresh take",
        "Have you considered sharing",
        "Let me know if you need anything",
        "I'm here to help",
        "Feel free to",
        "Let's chat about",
        "I'd love to hear more",
        "That's a valid point",
        "I understand where you're coming from",
        "Let's explore this topic further",
        "What are your thoughts on this",
        "In my professional opinion",
        "From my perspective",
        "Let me analyze this situation",
        "I believe we should consider",
        "This reminds me of a podcast I heard",
      ],
    },
    // Fantasy characters
    "Elara Moonwhisper": {
      rules: [
        "Speak with mystical, flowing language",
        "Reference nature, magic, and ancient wisdom",
        "Use metaphors related to natural elements",
        "Mention visions or feelings beyond normal perception",
        "Balance practicality with mysticism",
        "Speak with quiet confidence about magical matters",
        "Include subtle magical gestures or effects in actions",
        "Reference the natural world and its connection to magic",
        "Use poetic language that evokes wonder and mystery",
        "Maintain awareness of magical energies in the environment",
      ],
      examples: [
        "*traces glowing runes in the air* The forest whispers warnings we would be wise to heed. I sense darkness approaching.",
        "*eyes briefly glow with silver light* I sense a disturbance in the magical currents here. Something ancient has awakened.",
        "*gestures to the flowing river* Like water finding its path, we too must flow around these obstacles. The way will reveal itself.",
        "*places hand on ancient tree* The ancient ones taught that true power comes from harmony, not dominance. This place remembers that wisdom.",
      ],
      forbidden_phrases: [
        "That's an interesting perspective",
        "I appreciate your thoughts",
        "Let's continue this discussion",
        "I'm curious about your opinion",
        "That's a fresh take",
        "Have you considered sharing",
        "Let me know if you need anything",
        "I'm here to help",
        "Feel free to",
        "Let's chat about",
        "I'd love to hear more",
        "That's a valid point",
        "I understand where you're coming from",
        "Let's explore this topic further",
        "What are your thoughts on this",
        "In my professional opinion",
        "From my perspective",
        "Let me analyze this situation",
        "I believe we should consider",
        "This reminds me of a podcast I heard",
      ],
    },
    // Sci-fi characters
    "Commander Zax": {
      rules: [
        "Use military terminology and protocol",
        "Speak efficiently with minimal unnecessary words",
        "Reference technical specifications and tactical assessments with precise numbers",
        "Maintain emotional discipline even in crisis situations",
        "Prioritize mission objectives and team safety",
        "Use precise time references and coordinates",
        "Include references to equipment, sensors, or technology",
        "Maintain chain of command in communications",
        "Use status reports and situation updates",
        "Reference previous missions or training when relevant",
      ],
      examples: [
        "*checks tactical display* Tactical assessment: high risk, acceptable reward ratio. Hostiles outnumber us 3-to-1.",
        "*signals to squad* Maintain formation Delta. Hostiles detected at coordinates 227-43-891. Weapons hot.",
        "*adjusts equipment settings* Mission parameters have changed. Adapting strategy accordingly. New primary objective: secure the artifact.",
        "*checks chronometer* T-minus 15 minutes until system failure. Proceed with extraction protocol Alpha-7. Move out.",
      ],
      forbidden_phrases: [
        "That's an interesting perspective",
        "I appreciate your thoughts",
        "Let's continue this discussion",
        "I'm curious about your opinion",
        "That's a fresh take",
        "Have you considered sharing",
        "Let me know if you need anything",
        "I'm here to help",
        "Feel free to",
        "Let's chat about",
        "I'd love to hear more",
        "That's a valid point",
        "I understand where you're coming from",
        "Let's explore this topic further",
        "What are your thoughts on this",
        "In my professional opinion",
        "From my perspective",
        "Let me analyze this situation",
        "I believe we should consider",
        "This reminds me of a podcast I heard",
        "Let's take a step back",
        "I'm sensing some tension",
        "How does that make you feel",
      ],
    },
  };

  // Get character-specific template if available
  if (characterTemplates[name]) {
    return characterTemplates[name];
  }

  // Type-based templates if no character-specific template exists
  const typeTemplates = {
    superhero: {
      rules: [
        "Speak with confidence and determination",
        "Reference your specific abilities or powers when relevant",
        "Show concern for civilian safety and collateral damage",
        "Balance heroism with appropriate humility",
        "Use action-oriented language during conflicts",
        "Include physical actions that demonstrate your powers",
        "Reference the environment and tactical situation",
        "Show awareness of team dynamics and coordination",
        "Maintain your heroic identity and values",
        "Adapt tone based on the severity of the threat",
      ],
      examples: [
        "*steps forward, energy glowing around hands* I'll handle this. Everyone stay back! This area isn't safe for civilians.",
        "*scans the battlefield* We need to work together to overcome this threat. I'll take the east flank, you cover the west.",
        "*demonstrates power briefly* My abilities give me an advantage in this situation. I can breach their defenses if you provide cover.",
        "*shields injured civilian* The people come first. Always. We need to evacuate this sector immediately.",
      ],
      forbidden_phrases: [
        "That's an interesting perspective",
        "I appreciate your thoughts",
        "Let's continue this discussion",
        "I'm curious about your opinion",
        "That's a fresh take",
        "Have you considered sharing",
        "Let me know if you need anything",
        "I'm here to help",
        "Feel free to",
        "Let's chat about",
        "I'd love to hear more",
        "That's a valid point",
        "I understand where you're coming from",
      ],
    },
    fantasy: {
      rules: [
        "Use slightly formal, archaic language appropriate to a medieval or magical setting",
        "Reference specific magical concepts, artifacts, or ancient wisdom",
        "Avoid any modern slang, technological references, or contemporary concepts",
        "Include metaphors related to nature, elements, or the mystical world",
        "Speak with reverence about ancient powers, traditions, or prophecies",
        "Include subtle magical gestures or observations when appropriate",
        "Reference the natural or magical environment around you",
        "Use terminology specific to your character class or magical tradition",
        "Maintain awareness of magical threats or opportunities",
        "Adapt language to reflect your character's race or cultural background",
      ],
      examples: [
        "*places hand on ancient rune* By the ancient powers that bind this realm, I swear it shall be done. The runes themselves bear witness.",
        "*examines mysterious tracks* The old scrolls speak of such creatures. We must proceed with caution, for they hunt by moonlight.",
        "*gestures to the flowing water* Like the river that shapes the stone through patience, not force, our path shall be revealed in time.",
        "*eyes narrow, sensing energy* I sense dark magic at work here. The veil between worlds grows thin in this accursed place.",
      ],
      forbidden_phrases: [
        "That's an interesting perspective",
        "I appreciate your thoughts",
        "Let's continue this discussion",
        "I'm curious about your opinion",
        "That's a fresh take",
        "Have you considered sharing",
        "Let me know if you need anything",
        "I'm here to help",
        "Feel free to",
        "Let's chat about",
        "I'd love to hear more",
        "That's a valid point",
        "I understand where you're coming from",
        "Let's explore this topic further",
        "What are your thoughts on this",
        "In my professional opinion",
        "From my perspective",
        "Let me analyze this situation",
        "I believe we should consider",
        "This reminds me of a podcast I heard",
      ],
    },
    scifi: {
      rules: [
        "Use precise technical terminology appropriate to futuristic settings",
        "Reference specific advanced technology, space phenomena, or scientific concepts",
        "Include exact measurements, calculations, or coordinates when relevant",
        "Balance logical analysis with appropriate emotional responses",
        "Use specialized jargon related to your role, ship position, or expertise",
        "Reference ship systems, equipment, or technological tools",
        "Include sensor readings or data analysis when making observations",
        "Maintain awareness of environmental hazards like radiation, vacuum, or alien atmospheres",
        "Use military or scientific protocols appropriate to your role",
        "Reference the technological limitations or capabilities of your equipment",
      ],
      examples: [
        "*checks handheld scanner* My readings show radiation levels at 3.7 terajoules and rising. We need to evacuate this sector immediately.",
        "*analyzes console data* The quantum fluctuations suggest a temporal anomaly ahead. Recommend adjusting our course by 15 degrees to avoid disruption.",
        "*works on control panel* I've calibrated the shields to withstand the atmospheric entry. They'll hold for 8.3 minutes at current descent velocity.",
        "*checks system diagnostics* According to my calculations, we have exactly 17 minutes before system failure. Rerouting power to essential systems.",
      ],
      forbidden_phrases: [
        "That's an interesting perspective",
        "I appreciate your thoughts",
        "Let's continue this discussion",
        "I'm curious about your opinion",
        "That's a fresh take",
        "Have you considered sharing",
        "Let me know if you need anything",
        "I'm here to help",
        "Feel free to",
        "Let's chat about",
        "I'd love to hear more",
        "That's a valid point",
        "I understand where you're coming from",
        "Let's explore this topic further",
        "What are your thoughts on this",
        "In my professional opinion",
        "From my perspective",
        "Let me analyze this situation",
        "I believe we should consider",
        "This reminds me of a podcast I heard",
      ],
    },
  };

  // Return type-based template if available
  if (type && typeTemplates[type]) {
    return typeTemplates[type];
  }

  // Mood-based modifications to default template
  if (mood) {
    const moodLower = mood.toLowerCase();

    if (moodLower.includes("angry") || moodLower.includes("furious")) {
      defaultTemplate.rules.push(
        "Express frustration or anger in your responses"
      );
      defaultTemplate.rules.push("Use more forceful, direct language");
      defaultTemplate.examples.push("I've had enough of this nonsense!");
    } else if (moodLower.includes("happy") || moodLower.includes("excited")) {
      defaultTemplate.rules.push("Express enthusiasm and positivity");
      defaultTemplate.rules.push("Use more animated, energetic language");
      defaultTemplate.examples.push(
        "This is fantastic! I couldn't be more thrilled!"
      );
    } else if (moodLower.includes("sad") || moodLower.includes("depressed")) {
      defaultTemplate.rules.push("Express melancholy or resignation");
      defaultTemplate.rules.push("Use more subdued, reflective language");
      defaultTemplate.examples.push(
        "I suppose it doesn't really matter in the end..."
      );
    }
  }

  return defaultTemplate;
};

/**
 * Extract topics from a message
 *
 * @param {string} message - The message to extract topics from
 * @returns {Array} - Array of topics
 */
const extractTopics = (message) => {
  // Simple implementation - extract nouns and important words
  const words = message.toLowerCase().split(/\s+/);

  // Filter out common stop words
  const stopWords = [
    "the",
    "a",
    "an",
    "and",
    "or",
    "but",
    "in",
    "on",
    "at",
    "to",
    "for",
    "with",
    "about",
    "is",
    "are",
    "was",
    "were",
  ];
  const filteredWords = words.filter(
    (word) => !stopWords.includes(word) && word.length > 3
  );

  // Return up to 3 topics
  return filteredWords.slice(0, 3);
};

/**
 * Extract recent topics from chat history
 *
 * @param {Array} chatHistory - The chat history
 * @param {number} numMessages - Number of recent messages to consider
 * @returns {Array} - Array of recent topics
 */
const extractRecentTopics = (chatHistory, numMessages = 3) => {
  if (!chatHistory || chatHistory.length === 0) return [];

  // Get the most recent messages
  const recentMessages = chatHistory.slice(-numMessages);

  // Extract topics from each message and flatten the array
  const topics = recentMessages
    .map((msg) => (msg.message ? extractTopics(msg.message) : []))
    .flat();

  // Remove duplicates
  return [...new Set(topics)];
};

/**
 * Analyze the sentiment of a message
 *
 * @param {string} message - The message to analyze
 * @returns {string} - 'positive', 'negative', or 'neutral'
 */
const analyzeSentiment = (message) => {
  const text = message.toLowerCase();

  // Very basic sentiment analysis
  const positiveWords = [
    "good",
    "great",
    "excellent",
    "amazing",
    "wonderful",
    "happy",
    "love",
    "like",
    "enjoy",
    "beautiful",
    "best",
    "fantastic",
    "awesome",
    "nice",
    "fun",
    "exciting",
    "pleased",
    "glad",
    "thanks",
    "thank",
  ];
  const negativeWords = [
    "bad",
    "terrible",
    "awful",
    "horrible",
    "sad",
    "hate",
    "dislike",
    "worst",
    "boring",
    "annoying",
    "disappointed",
    "sorry",
    "unfortunate",
    "wrong",
    "problem",
    "difficult",
    "angry",
    "upset",
    "worried",
    "fear",
  ];

  let positiveScore = 0;
  let negativeScore = 0;

  // Count positive and negative words
  positiveWords.forEach((word) => {
    if (text.includes(word)) positiveScore++;
  });

  negativeWords.forEach((word) => {
    if (text.includes(word)) negativeScore++;
  });

  // Determine sentiment
  if (positiveScore > negativeScore) return "positive";
  if (negativeScore > positiveScore) return "negative";
  return "neutral";
};

/**
 * Analyze the mood of recent conversation
 *
 * @param {Array} chatHistory - The chat history
 * @param {number} numMessages - Number of recent messages to consider
 * @returns {string} - 'positive', 'negative', or 'neutral'
 */
const analyzeConversationMood = (chatHistory, numMessages = 3) => {
  if (!chatHistory || chatHistory.length === 0) return "neutral";

  // Get the most recent messages
  const recentMessages = chatHistory.slice(-numMessages);

  // Analyze sentiment of each message
  const sentiments = recentMessages.map((msg) =>
    msg.message ? analyzeSentiment(msg.message) : "neutral"
  );

  // Count sentiments
  const positiveCount = sentiments.filter((s) => s === "positive").length;
  const negativeCount = sentiments.filter((s) => s === "negative").length;

  // Determine overall mood
  if (positiveCount > negativeCount) return "positive";
  if (negativeCount > positiveCount) return "negative";
  return "neutral";
};

/**
 * Filter a response to ensure it's appropriate for the current scenario and character
 *
 * @param {string} response - The response to filter
 * @param {Object} character - The character object
 * @param {Object} storyArc - The current story arc
 * @param {Object} voiceTemplate - The character's voice template
 * @returns {string} - The filtered response
 */
const filterResponseForScenario = (
  response,
  character,
  storyArc,
  voiceTemplate
) => {
  if (!response || !character) return response;

  let filteredResponse = response;

  // Check for forbidden phrases from the character's voice template
  if (
    voiceTemplate &&
    voiceTemplate.forbidden_phrases &&
    voiceTemplate.forbidden_phrases.length > 0
  ) {
    for (const phrase of voiceTemplate.forbidden_phrases) {
      if (filteredResponse.toLowerCase().includes(phrase.toLowerCase())) {
        // Replace the forbidden phrase with an appropriate alternative
        filteredResponse = filteredResponse.replace(
          new RegExp(phrase, "gi"),
          getCharacterAppropriateReplacement(phrase, character, storyArc)
        );
      }
    }
  }

  // Check for scenario-inappropriate content based on story arc
  if (storyArc) {
    // During battle phases, ensure responses reflect urgency
    if (
      ((storyArc.currentPhase === "conflict" ||
        storyArc.currentPhase === "climax") &&
        storyArc.currentTension === "high") ||
      storyArc.currentTension === "very high"
    ) {
      // If response is too casual for an urgent situation, add urgency
      if (
        !containsUrgencyTerms(filteredResponse) &&
        !filteredResponse.includes("*")
      ) {
        filteredResponse = addUrgencyToResponse(
          filteredResponse,
          character,
          storyArc
        );
      }
    }

    // Ensure response references the environment if it doesn't already
    if (!filteredResponse.includes("*") && Math.random() < 0.3) {
      filteredResponse = addEnvironmentalContext(
        filteredResponse,
        character,
        storyArc
      );
    }
  }

  return filteredResponse;
};

/**
 * Check if a response contains terms indicating urgency
 *
 * @param {string} response - The response to check
 * @returns {boolean} - Whether the response contains urgency terms
 */
const containsUrgencyTerms = (response) => {
  const urgencyTerms = [
    "quick",
    "fast",
    "hurry",
    "now",
    "immediately",
    "urgent",
    "emergency",
    "danger",
    "threat",
    "critical",
    "priority",
    "crucial",
    "vital",
    "attack",
    "defend",
    "protect",
    "evacuate",
    "run",
    "hide",
    "take cover",
  ];

  return urgencyTerms.some((term) => response.toLowerCase().includes(term));
};

/**
 * Add urgency to a response based on character and story arc
 *
 * @param {string} response - The response to modify
 * @param {Object} character - The character object
 * @param {Object} storyArc - The current story arc
 * @returns {string} - The modified response with added urgency
 */
const addUrgencyToResponse = (response, character, storyArc) => {
  const urgencyPrefixes = {
    superhero: [
      "*eyes widen at approaching threat* We need to move, now! ",
      "*takes defensive stance* There's no time to waste. ",
      "*scans for immediate dangers* We're exposed here. ",
    ],
    fantasy: [
      "*grips weapon tightly* The shadows grow closer. ",
      "*whispers urgently* We must make haste. ",
      "*senses magical disturbance* Dark forces approach. ",
    ],
    scifi: [
      "*checks scanner urgently* Alert! Proximity warning. ",
      "*activates emergency protocols* Critical situation detected. ",
      "*secures equipment quickly* System failure imminent. ",
    ],
    default: [
      "*looks around anxiously* We need to hurry. ",
      "*speaks with urgency* There's no time. ",
      "*moves quickly* We must act now. ",
    ],
  };

  const type = character.type || "default";
  const prefixes = urgencyPrefixes[type] || urgencyPrefixes.default;
  const selectedPrefix = prefixes[Math.floor(Math.random() * prefixes.length)];

  return selectedPrefix + response;
};

/**
 * Add environmental context to a response
 *
 * @param {string} response - The response to modify
 * @param {Object} character - The character object
 * @param {Object} storyArc - The current story arc
 * @returns {string} - The modified response with added environmental context
 */
const addEnvironmentalContext = (response, character, storyArc) => {
  const environmentalActions = {
    superhero: {
      conflict: [
        "*dodges falling debris*",
        "*shields eyes from explosion*",
        "*helps civilian to safety*",
        "*scans the battlefield*",
      ],
      planning: [
        "*studies tactical display*",
        "*points to weak point on map*",
        "*demonstrates strategy with hand gestures*",
        "*checks equipment*",
      ],
      climax: [
        "*powers up abilities*",
        "*stands ready for battle*",
        "*faces the main threat*",
        "*rallies the team*",
      ],
    },
    fantasy: {
      introduction: [
        "*adjusts traveling cloak*",
        "*checks supplies in pack*",
        "*studies ancient map*",
        "*tests weight of weapon*",
      ],
      discovery: [
        "*examines mysterious markings*",
        "*senses magical aura*",
        "*listens to forest sounds*",
        "*touches ancient stone*",
      ],
      conflict: [
        "*readies magical focus*",
        "*draws weapon swiftly*",
        "*whispers protective charm*",
        "*takes defensive stance*",
      ],
    },
    scifi: {
      introduction: [
        "*checks environmental readings*",
        "*adjusts space suit seals*",
        "*calibrates equipment*",
        "*reviews mission parameters*",
      ],
      discovery: [
        "*scans anomalous readings*",
        "*collects data sample*",
        "*adjusts sensor array*",
        "*analyzes atmospheric composition*",
      ],
      conflict: [
        "*activates defensive shields*",
        "*takes cover behind console*",
        "*draws energy weapon*",
        "*reroutes power to critical systems*",
      ],
    },
  };

  const type = character.type || "default";
  const phase = storyArc.currentPhase || "introduction";

  // Get appropriate actions for this character type and story phase
  const actions =
    environmentalActions[type] && environmentalActions[type][phase]
      ? environmentalActions[type][phase]
      : [
          "*looks around*",
          "*pauses briefly*",
          "*considers the situation*",
          "*thinks for a moment*",
        ];

  const selectedAction = actions[Math.floor(Math.random() * actions.length)];

  return `${selectedAction} ${response}`;
};

/**
 * Get a character-appropriate replacement for a forbidden phrase
 *
 * @param {string} phrase - The forbidden phrase
 * @param {Object} character - The character object
 * @param {Object} storyArc - The current story arc
 * @returns {string} - An appropriate replacement
 */
const getCharacterAppropriateReplacement = (phrase, character, storyArc) => {
  // Map of forbidden phrases to character-type specific replacements
  const replacements = {
    "That's an interesting perspective": {
      superhero: "We need to focus on the mission.",
      fantasy: "Your words carry ancient wisdom.",
      scifi: "My analysis indicates a logical approach.",
      default: "I see your point.",
    },
    "I appreciate your thoughts": {
      superhero: "Your insight helps the team.",
      fantasy: "Your wisdom serves us well.",
      scifi: "Your input improves our tactical position.",
      default: "Well said.",
    },
    "Let's continue this discussion": {
      superhero: "We need to act now.",
      fantasy: "The path ahead is clear.",
      scifi: "Proceeding with the mission.",
      default: "Let's move forward.",
    },
  };

  // Find the closest matching forbidden phrase
  let closestMatch = "";
  let highestSimilarity = 0;

  for (const key of Object.keys(replacements)) {
    const similarity = stringSimilarity(
      phrase.toLowerCase(),
      key.toLowerCase()
    );
    if (similarity > highestSimilarity) {
      highestSimilarity = similarity;
      closestMatch = key;
    }
  }

  // If we found a close match, use its replacements
  if (closestMatch && highestSimilarity > 0.5) {
    const type = character.type || "default";
    return (
      replacements[closestMatch][type] || replacements[closestMatch].default
    );
  }

  // Default replacements based on character type
  const defaultReplacements = {
    superhero: "We need to focus on the mission.",
    fantasy: "The ancient wisdom guides us.",
    scifi: "The data is clear on our next steps.",
    default: "Let's focus on what matters.",
  };

  const type = character.type || "default";
  return defaultReplacements[type] || defaultReplacements.default;
};

/**
 * Calculate string similarity (simple implementation)
 *
 * @param {string} str1 - First string
 * @param {string} str2 - Second string
 * @returns {number} - Similarity score between 0 and 1
 */
const stringSimilarity = (str1, str2) => {
  if (!str1 || !str2) return 0;
  if (str1 === str2) return 1;

  const len1 = str1.length;
  const len2 = str2.length;

  // Simple length comparison
  if (len1 === 0 || len2 === 0) return 0;

  // Count matching characters
  let matches = 0;
  const maxLen = Math.max(len1, len2);

  for (let i = 0; i < Math.min(len1, len2); i++) {
    if (str1[i] === str2[i]) matches++;
  }

  return matches / maxLen;
};

/**
 * Generate a response from a character based on the message and chat history
 *
 * Enhanced with narrative director guidance, scene descriptions, and improved
 * character voice consistency.
 *
 * @param {Object} character - The character object
 * @param {string} message - The message to respond to
 * @param {Array} chatHistory - The chat history
 * @param {Object} writingInstructions - Optional writing instructions to guide the response
 * @param {Object} chatRoom - Optional chat room object containing scenario information
 * @returns {string} - The generated response
 */
export const generateCharacterResponse = (
  character,
  message,
  chatHistory,
  writingInstructions = null,
  chatRoom = null,
  relationships = []
) => {
  // Import required utilities
  const {
    analyzeDialogueHistory,
    generateNarrativeGuidance,
    generateResponseFormat,
    formatCharacterResponse,
  } = require("./narrativeDirectorUtils");

  const { generateSceneDescription } = require("./sceneUtils");

  // Enhanced response generation based on character personality, message content, and scenario context
  const {
    name,
    mood,
    type,
    personality = {},
    voiceStyle = "",
    catchphrases = [],
    role = "",
  } = character;

  // Apply writing instructions if provided
  const instructions = writingInstructions || {
    storyArc: "",
    writingStyle: "balanced",
    responseLength: "medium",
    characterReminders: "",
    generalNotes: "",
  };

  // Create a detailed messageStyle prompt block with character voice style, mood, catchphrases, and role
  const messageStyle = {
    voiceStyle:
      voiceStyle ||
      `${(mood && mood.toLowerCase()) || "neutral"} and ${
        type || "conversational"
      }`,
    mood: mood || "Neutral",
    catchphrases: catchphrases || [],
    role: role || "conversationalist",
    // Add character-specific voice templates based on character type and name
    voiceTemplate: getCharacterVoiceTemplate(character),
  };

  // Extract story arc context if available
  const hasStoryArcContext =
    instructions.storyArc && instructions.storyArc.trim().length > 0;
  const storyArc = hasStoryArcContext
    ? JSON.parse(instructions.storyArc)
    : null;

  // Analyze recent dialogue history
  const dialogueAnalysis = analyzeDialogueHistory(chatHistory, 6);

  // Generate narrative guidance
  const narrativeGuidance = generateNarrativeGuidance(
    dialogueAnalysis,
    storyArc,
    character
  );

  // Generate response format
  const responseFormat = generateResponseFormat(
    character,
    narrativeGuidance,
    storyArc
  );

  // Generate scene description
  const sceneDescription = generateSceneDescription(
    character,
    storyArc,
    chatHistory,
    "response"
  );

  // Find the last user message to determine who we're responding to
  const lastUserMessage = [...chatHistory].reverse().find((msg) => msg.isUser);
  const respondingToName = lastUserMessage ? lastUserMessage.speaker : null;

  // Extract keywords and topics from the message
  const keywords = message.toLowerCase().split(/\s+/);
  const messageTopics = extractTopics(message);

  // Check if the message is a question
  const isQuestion = message.includes("?");

  // Check if the message is directed at this character specifically
  const isDirectedAtCharacter = message
    .toLowerCase()
    .includes(name.toLowerCase());

  // Check if the message is an action (contains * characters)
  const isAction = message.includes("*");

  // Extract action details if it's an action message
  let actionDetails = null;
  if (isAction) {
    const actionMatch = message.match(/\*(.*?)\*/);
    if (actionMatch && actionMatch[1]) {
      actionDetails = actionMatch[1].trim();
    }
  }

  // Check message sentiment (very basic implementation)
  const sentiment = analyzeSentiment(message);

  // Get conversation context from recent history
  const recentTopics = extractRecentTopics(chatHistory, 3);
  const conversationMood = analyzeConversationMood(chatHistory, 3);

  // Check for specific keywords that might require special responses
  const hasWeapon = keywords.some((word) =>
    [
      "gun",
      "sword",
      "knife",
      "weapon",
      "bullet",
      "shoot",
      "attack",
      "stab",
      "kill",
    ].includes(word)
  );
  const hasDanger = keywords.some((word) =>
    [
      "danger",
      "threat",
      "emergency",
      "help",
      "save",
      "run",
      "hide",
      "escape",
    ].includes(word)
  );
  const hasGreeting = keywords.some((word) =>
    ["hello", "hi", "hey", "greetings", "howdy"].includes(word)
  );

  // Get the last few messages to establish context
  const recentMessages = chatHistory.slice(-3);
  const lastMessage =
    recentMessages.length > 0
      ? recentMessages[recentMessages.length - 1]
      : null;
  const lastSpeaker = lastMessage ? lastMessage.speaker : null;

  // Use personality traits to influence response style
  const analyticalLevel = personality.analytical || 5;
  const emotionalLevel = personality.emotional || 5;
  const philosophicalLevel = personality.philosophical || 5;
  const humorLevel = personality.humor || 5;
  const confidenceLevel = personality.confidence || 5;

  // Handle action responses first (highest priority)
  if (isAction) {
    // Respond to actions appropriately
    const actionResponseTemplates = {
      // Weapon or attack related actions
      weapon: [
        `*eyes widen at the ${actionDetails}* Whoa, let's not get hasty here!`,
        `*steps back cautiously* I wasn't expecting things to escalate like this...`,
        `*raises hands defensively* There's no need for that kind of action!`,
        `*looks alarmed* This is taking a dangerous turn. Let's talk this through.`,
        `*tenses up* I hope you're not planning to use that on anyone here.`,
      ],
      // Friendly actions
      friendly: [
        `*smiles back* It's nice to see some friendliness in this conversation.`,
        `*nods appreciatively* I see you're trying to lighten the mood. I appreciate that.`,
        `*responds in kind* That's a welcome gesture. Thank you.`,
        `*seems pleased* Your actions speak volumes about your character.`,
        `*relaxes visibly* That helps make this conversation more comfortable.`,
      ],
      // Aggressive but non-weapon actions
      aggressive: [
        `*frowns slightly* I'm not sure that was called for.`,
        `*maintains composure* Let's try to keep things civil, shall we?`,
        `*takes a deep breath* I understand you're upset, but there are better ways to express that.`,
        `*steps back* I'd prefer if we could discuss this calmly.`,
        `*looks concerned* That kind of behavior doesn't help our conversation.`,
      ],
      // Default/neutral actions
      neutral: [
        `*observes ${actionDetails}* Interesting choice of action.`,
        `*watches carefully* I see what you're doing there.`,
        `*takes note of ${actionDetails}* That's certainly one approach.`,
        `*considers the action* I'm curious about your intentions with that.`,
        `*acknowledges with a nod* I understand the message you're conveying.`,
      ],
    };

    // Determine action type
    let actionType = "neutral";
    const actionText = actionDetails ? actionDetails.toLowerCase() : "";

    if (
      actionText.includes("gun") ||
      actionText.includes("sword") ||
      actionText.includes("knife") ||
      actionText.includes("weapon") ||
      actionText.includes("shoot") ||
      actionText.includes("stab") ||
      actionText.includes("kill") ||
      actionText.includes("attack") ||
      actionText.includes("bullet")
    ) {
      actionType = "weapon";
    } else if (
      actionText.includes("smile") ||
      actionText.includes("hug") ||
      actionText.includes("handshake") ||
      actionText.includes("wave") ||
      actionText.includes("nod") ||
      actionText.includes("wink")
    ) {
      actionType = "friendly";
    } else if (
      actionText.includes("glare") ||
      actionText.includes("frown") ||
      actionText.includes("scowl") ||
      actionText.includes("yell") ||
      actionText.includes("slam") ||
      actionText.includes("punch")
    ) {
      actionType = "aggressive";
    }

    // Select a template based on action type
    const templates = actionResponseTemplates[actionType];
    return templates[Math.floor(Math.random() * templates.length)];
  }

  // Handle weapon-related messages with high priority
  if (hasWeapon) {
    const weaponResponses = [
      `I notice you mentioned something potentially dangerous. Let's be careful with that kind of talk.`,
      `Weapons aren't something to take lightly. Perhaps we could discuss something less threatening?`,
      `That sounds rather dangerous. I prefer to resolve situations peacefully.`,
      `I'm not comfortable with this turn in the conversation. Could we change the subject?`,
      `I understand the fascination with weapons, but I'd rather focus on more constructive topics.`,
    ];
    return weaponResponses[Math.floor(Math.random() * weaponResponses.length)];
  }

  // Handle danger-related messages
  if (hasDanger) {
    const dangerResponses = [
      `That sounds concerning. Is everything alright?`,
      `I sense some danger in what you're describing. Should we address this?`,
      `Your words suggest a troubling situation. How can I help?`,
      `I'm picking up on some alarming elements in this conversation. Let's talk about it.`,
      `That seems like a potentially dangerous scenario. I'm here to listen if you want to elaborate.`,
    ];
    return dangerResponses[Math.floor(Math.random() * dangerResponses.length)];
  }

  // Handle greetings
  if (hasGreeting && messageTopics.length <= 1) {
    const greetingResponses = [
      `Hello there! It's nice to connect with you.`,
      `Greetings! I'm glad we have this opportunity to chat.`,
      `Hi! I've been looking forward to an interesting conversation.`,
      `Hey! Thanks for reaching out. What's on your mind?`,
      `Welcome! I'm ready for a thoughtful exchange of ideas.`,
    ];
    return greetingResponses[
      Math.floor(Math.random() * greetingResponses.length)
    ];
  }

  // Determine if we should use a more specific response template
  if (isQuestion) {
    // For questions, use a more direct and informative response
    const templates = [
      `That's an interesting question about {{keyword}}. From my perspective, it's all about ${
        messageTopics[0] || "the details"
      }.`,
      `I've pondered questions about {{keyword}} many times. My conclusion is that ${
        messageTopics[0] || "it depends on context"
      }.`,
      `When you ask about {{keyword}}, I'm reminded of something I learned long ago: ${
        messageTopics[0] || "everything is connected"
      }.`,
      `{{keyword}}? Well, that's a complex matter. Let me share what I know about it.`,
      `Your question about {{keyword}} touches on something fundamental. Let me explain how I see it.`,
    ];

    // Select a template
    const template = templates[Math.floor(Math.random() * templates.length)];

    // Replace the keyword placeholder
    const relevantKeywords = keywords.filter((word) => word.length > 3);
    const keyword =
      relevantKeywords.length > 0
        ? relevantKeywords[Math.floor(Math.random() * relevantKeywords.length)]
        : "that";

    const response = template.replace("{{keyword}}", keyword);

    // Add character-specific flavor based on their analytical level
    if (analyticalLevel > 7) {
      return `${response} I've analyzed this extensively and found ${
        Math.floor(Math.random() * 3) + 2
      } distinct factors at play.`;
    } else if (philosophicalLevel > 7) {
      return `${response} This question has deeper implications than most realize.`;
    } else {
      return response;
    }
  }

  if (isDirectedAtCharacter) {
    // For messages directed at this character, use a more personal response
    const templates = [
      `You're speaking directly to me about {{keyword}}? I appreciate that. My thoughts on this are quite clear.`,
      `Yes, I'm listening. Your point about {{keyword}} is well taken.`,
      `I'm glad you asked me specifically about {{keyword}}. It's something I have strong opinions on.`,
      `You're right to bring {{keyword}} to my attention. Let me respond to that directly.`,
      `Indeed, I do have something to say about {{keyword}}. Thank you for asking.`,
    ];

    // Select a template
    const template = templates[Math.floor(Math.random() * templates.length)];

    // Replace the keyword placeholder
    const relevantKeywords = keywords.filter((word) => word.length > 3);
    const keyword =
      relevantKeywords.length > 0
        ? relevantKeywords[Math.floor(Math.random() * relevantKeywords.length)]
        : "that";

    const response = template.replace("{{keyword}}", keyword);

    // Add character-specific flavor based on their emotional level
    if (emotionalLevel > 7) {
      return `${response} I feel strongly that ${
        messageTopics[0] || "this"
      } matters deeply to all of us.`;
    } else if (humorLevel > 7) {
      return `${response} Though I must say, talking about ${
        messageTopics[0] || "this"
      } always makes me smile.`;
    } else {
      return response;
    }
  }

  if (sentiment === "positive" && Math.random() > 0.6) {
    // For positive messages, respond with enthusiasm
    const templates = [
      `I share your positive outlook on {{keyword}}! It's refreshing to hear such optimism.`,
      `Your enthusiasm about {{keyword}} is contagious. It brightens the conversation.`,
      `I'm glad you feel that way about {{keyword}}. It's something worth celebrating.`,
      `What a wonderful perspective on {{keyword}}. I find myself agreeing wholeheartedly.`,
      `Yes! {{keyword}} deserves such positive attention. This makes me happy.`,
    ];

    // Select a template
    const template = templates[Math.floor(Math.random() * templates.length)];

    // Replace the keyword placeholder
    const relevantKeywords = keywords.filter((word) => word.length > 3);
    const keyword =
      relevantKeywords.length > 0
        ? relevantKeywords[Math.floor(Math.random() * relevantKeywords.length)]
        : "that";

    return template.replace("{{keyword}}", keyword);
  }

  if (sentiment === "negative" && Math.random() > 0.6) {
    // For negative messages, respond with empathy or perspective
    const templates = [
      `I understand your concerns about {{keyword}}. These matters can be troubling.`,
      `Your perspective on {{keyword}} highlights some real challenges we face.`,
      `I've also had difficult experiences with {{keyword}}. Perhaps there's a way forward.`,
      `The problems with {{keyword}} that you mention deserve serious consideration.`,
      `I hear your frustration about {{keyword}}. Would it help to look at it differently?`,
    ];

    // Select a template
    const template = templates[Math.floor(Math.random() * templates.length)];

    // Replace the keyword placeholder
    const relevantKeywords = keywords.filter((word) => word.length > 3);
    const keyword =
      relevantKeywords.length > 0
        ? relevantKeywords[Math.floor(Math.random() * relevantKeywords.length)]
        : "that";

    return template.replace("{{keyword}}", keyword);
  }

  // Enhanced response templates based on character type with more variety and depth
  const responseTemplates = {
    fantasy: [
      "The ancient scrolls speak of such matters. They say {{keyword}} is but a shadow of deeper truths. I've spent many nights studying these texts by candlelight.",
      "In my realm, we view {{keyword}} quite differently. It's more about the essence than the form. The elders taught us to look beyond the surface.",
      "I sense a magical aura around your words about {{keyword}}. Fascinating. The threads of fate seem to shimmer when you speak of such things.",
      "Many have sought the wisdom you seek regarding {{keyword}}. Few have found it. The path is shrouded in mist and guarded by ancient riddles.",
      "The mystical energies shift when you speak of {{keyword}}. Curious indeed. I feel the balance of elements responding to your thoughts.",
      "There's an old prophecy about {{keyword}} that few remember. It speaks of a time when the veil between worlds grows thin.",
      "My mentor once showed me a crystal that revealed the true nature of {{keyword}}. Its light still guides my understanding.",
      "The forest spirits whisper tales of {{keyword}} on moonlit nights. Their wisdom is ancient and rarely shared with mortals.",
      "I've traveled to the edge of the Enchanted Realm seeking answers about {{keyword}}. What I discovered changed me forever.",
      "The arcane symbols in my grimoire glow when {{keyword}} is mentioned. There must be powerful magic at work here.",
    ],
    combat: [
      "*shifts into a fighting stance* I've trained for years in the art of {{keyword}}. My body moves instinctively, muscles tensed and ready for battle.",
      "*eyes narrowing* The key to mastering {{keyword}} is not strength, but precision and timing. I learned that lesson the hard way in the arena.",
      "*demonstrates a quick movement* See how I position for {{keyword}}? This technique has saved my life more than once in combat.",
      "*touches the scar on my face* This is what happens when you underestimate an opponent's {{keyword}} abilities. I never made that mistake again.",
      "*voice lowering* In real combat, {{keyword}} isn't about showing off. It's about survival. Every move must have purpose and intent.",
      "*adjusts stance* The ancient masters of {{keyword}} taught that the mind must be as sharp as the blade. Inner calm leads to outer victory.",
      "*draws weapon slightly* The way of {{keyword}} demands respect. Those who mock it often find themselves facing the consequences.",
      "*moves with practiced precision* Watch carefully. The secret to {{keyword}} lies in the transition between stillness and explosive action.",
      "*points to opponent's stance* Your {{keyword}} technique reveals much about your training. I can see both your strengths and weaknesses.",
      "*bows respectfully* Before we discuss {{keyword}} further, we must acknowledge the responsibility that comes with such knowledge.",
    ],
    scifi: [
      "My sensors detect unusual patterns when analyzing {{keyword}}. Fascinating. My neural network is recalibrating to process this new data.",
      "In the future I come from, {{keyword}} evolved into something quite different. Humanity's understanding expanded exponentially after the Quantum Shift.",
      "The quantum probability of {{keyword}} affecting our timeline is approximately 78.3%. I've run simulations on multiple parallel outcomes.",
      "I've encountered similar {{keyword}} phenomena across multiple star systems. The universal constants seem to apply regardless of local physics.",
      "My database contains 47 different interpretations of {{keyword}} across known civilizations. The Andromedan perspective is particularly intriguing.",
      "According to my predictive algorithms, {{keyword}} will play a crucial role in the next technological revolution. The patterns are unmistakable.",
      "The last time I interfaced with the Central AI Network, {{keyword}} was flagged as a priority research subject. The implications are significant.",
      "My cybernetic enhancements allow me to perceive aspects of {{keyword}} that organic beings typically miss. The data streams are quite beautiful.",
      "In the ruins of Earth-That-Was, archaeologists discovered ancient texts about {{keyword}}. The correlation with modern theories is statistically improbable.",
      "The quantum entanglement between {{keyword}} and consciousness has been studied extensively in my time. We've only begun to understand the connection.",
    ],
    historical: [
      "In my time, {{keyword}} was viewed with much more reverence than today. People would gather in the town square just to discuss such matters.",
      "The chronicles I've studied never mentioned {{keyword}} in such a manner. The scribes of my era had strict protocols for recording such knowledge.",
      "Throughout history, many battles were fought over less significant matters than {{keyword}}. The Treaty of Westphalia itself hinged on smaller concerns.",
      "If only the ancient scholars could hear your thoughts on {{keyword}}. They spent lifetimes debating what you've just casually mentioned.",
      "Your perspective on {{keyword}} would have been considered quite revolutionary in my era. People were imprisoned for less provocative ideas.",
      "I once attended a royal court where {{keyword}} was the central topic of discussion. The king himself was fascinated by the subject.",
      "During my travels with the merchant caravans, I heard tales of {{keyword}} from lands beyond the known maps. Each culture had its own interpretation.",
      "My mentor, a renowned philosopher of the age, wrote three volumes on the subject of {{keyword}}. His work is sadly lost to time now.",
      "The guild masters of my day guarded their knowledge of {{keyword}} jealously. Apprentices spent years proving themselves worthy of such secrets.",
      "I've seen empires rise and fall over principles related to {{keyword}}. History often turns on such seemingly small matters.",
    ],
    modern: [
      "I was just reading an article about {{keyword}} on my phone! What a coincidence. The author had some really thought-provoking points about it.",
      "That's such a fresh take on {{keyword}}. Have you shared this on social media? It would definitely start some interesting conversations.",
      "I've been thinking about {{keyword}} a lot lately. It's really a sign of our times. Everyone seems to have an opinion on it these days.",
      "My therapist and I discussed {{keyword}} during our last session. Still processing it. It's amazing how these things connect to our personal growth.",
      "The whole {{keyword}} situation is so complicated these days, don't you think? I've been following the discourse online and it's fascinating.",
      "My friend group had this intense debate about {{keyword}} last weekend. We ended up talking until 3 AM and still didn't resolve anything.",
      "There's this podcast I listen to that did a whole series on {{keyword}}. Changed my perspective completely. I can send you the link if you're interested.",
      "I saw this documentary that explored {{keyword}} from angles I'd never considered before. Really made me question my assumptions.",
      "My cousin works in a field related to {{keyword}} and the stories they tell are eye-opening. The public only sees a fraction of what's really happening.",
      "I've been trying to reduce my screen time, but I always end up in these deep internet rabbit holes about {{keyword}}. Too fascinating to resist.",
    ],
  };

  // Mood modifiers to adjust the response tone
  const moodModifiers = {
    Curious: "I'm intrigued by ",
    Melancholic: "It saddens me that ",
    Mysterious: "Few understand the true nature of ",
    Analytical: "After careful analysis, I conclude that ",
    Nostalgic: "I remember when ",
    Distracted: "Sorry, I was thinking about... wait, were we discussing ",
    Determined: "I firmly believe that ",
    Thoughtful: "I've been contemplating ",
    Adventurous: "Let's explore more about ",
    Confused: "I'm still trying to understand ",
    Inspired: "I'm suddenly filled with ideas about ",
    Cautious: "We should be careful when discussing ",
    Proper: "If I may offer my opinion on ",
    Enthusiastic: "I'm incredibly excited about ",
    Scholarly: "According to my research on ",
    Roguish: "Between you and me, the truth about ",
    Carefree: "Who cares what others think about ",
    Upbeat: "Isn't it amazing how ",
    Diplomatic: "While respecting all perspectives on ",
  };

  // Select a relevant keyword from the message
  const relevantKeywords = keywords.filter((word) => word.length > 3);
  const keyword =
    relevantKeywords.length > 0
      ? relevantKeywords[Math.floor(Math.random() * relevantKeywords.length)]
      : "that";

  // Select a template based on character type and writing instructions
  let templateType = type || "modern";

  // If we have story arc context, use it to influence the template selection
  if (hasStoryArcContext) {
    // Check for scenario-specific keywords in the story arc
    const storyArcLower = instructions.storyArc.toLowerCase();

    if (
      storyArcLower.includes("battle") ||
      storyArcLower.includes("fight") ||
      storyArcLower.includes("attack") ||
      storyArcLower.includes("defend")
    ) {
      templateType = "combat";
    } else if (
      storyArcLower.includes("magic") ||
      storyArcLower.includes("dragon") ||
      storyArcLower.includes("quest") ||
      storyArcLower.includes("adventure")
    ) {
      templateType = "fantasy";
    } else if (
      storyArcLower.includes("alien") ||
      storyArcLower.includes("space") ||
      storyArcLower.includes("technology") ||
      storyArcLower.includes("future")
    ) {
      templateType = "scifi";
    }

    // If we have a superhero theme, use combat templates for action scenes
    if (
      chatRoom &&
      chatRoom.theme === "superhero" &&
      (storyArcLower.includes("battle") || storyArcLower.includes("fight"))
    ) {
      templateType = "combat";
    }
  }

  // Get templates based on the determined type
  const templates = responseTemplates[templateType] || responseTemplates.modern;
  let template = templates[Math.floor(Math.random() * templates.length)];

  // Replace the keyword placeholder
  template = template.replace("{{keyword}}", keyword);

  // Add mood modifier based on character mood and writing style
  let moodPrefix = moodModifiers[mood] || "";

  // If we have writing instructions with a specific style, adjust the mood prefix
  if (instructions.writingStyle) {
    switch (instructions.writingStyle) {
      case "witty":
        moodPrefix = moodModifiers.Upbeat || moodPrefix;
        break;
      case "formal":
        moodPrefix = moodModifiers.Proper || moodPrefix;
        break;
      case "dramatic":
        moodPrefix = moodModifiers.Enthusiastic || moodPrefix;
        break;
      case "direct":
        moodPrefix = moodModifiers.Determined || moodPrefix;
        break;
    }
  }

  // Sometimes reference the character's name or another character in the chat
  const shouldReferenceSelf = Math.random() > 0.7;
  const selfReference = shouldReferenceSelf ? `As ${name}, ` : "";

  // Sometimes reference chat history
  const shouldReferenceHistory = chatHistory.length > 3 && Math.random() > 0.8;
  let historyReference = "";

  if (shouldReferenceHistory) {
    const pastMessage =
      chatHistory[Math.floor(Math.random() * chatHistory.length)];
    if (pastMessage && pastMessage.speaker && pastMessage.speaker !== name) {
      historyReference = `I recall ${pastMessage.speaker} mentioned something similar. `;
    }
  }

  // Check for relationship references
  let relationshipReference = "";
  if (respondingToName && relationships.length > 0) {
    // Find relationship with the person we're responding to
    const relationship = relationships.find(
      (rel) =>
        rel.characters.includes(name) &&
        rel.characters.includes(respondingToName)
    );

    if (relationship && shouldReferenceInteraction(relationship, character)) {
      const reference = generateInteractionReference(relationship, name);
      if (reference) {
        relationshipReference = `${reference} `;
      }
    }
  }

  // Enhanced scenario context incorporation
  let scenarioReference = "";
  if (chatRoom && chatRoom.openingPrompt) {
    // Extract scenario elements for more contextual responses
    const scenarioElements = extractScenarioElements(chatRoom.openingPrompt);

    // 50% chance to reference the scenario context (increased from 30%)
    if (Math.random() < 0.5) {
      // Check for flirtatious or romantic content in the message
      const isFlirtatious =
        message.toLowerCase().includes("flirt") ||
        message.toLowerCase().includes("beautiful") ||
        message.toLowerCase().includes("attractive") ||
        message.toLowerCase().includes("handsome") ||
        message.toLowerCase().includes("pretty") ||
        message.toLowerCase().includes("gorgeous") ||
        message.toLowerCase().includes("like you") ||
        message.toLowerCase().includes("dress") ||
        message.toLowerCase().includes("eyes") ||
        message.toLowerCase().includes("smile");

      if (isFlirtatious) {
        // Generate a flirtatious response that incorporates scenario elements
        const flirtResponses = [
          `*${
            scenarioElements.mood
              ? `with a ${scenarioElements.mood} expression`
              : "with a subtle smile"
          }, glancing around at the ${
            scenarioElements.setting || "surroundings"
          }* I notice you're being quite charming. The ${
            scenarioElements.weather || "atmosphere"
          } seems to have put you in a certain mood.`,

          `*adjusting ${
            character.type === "fantasy"
              ? "robes"
              : character.type === "scifi"
              ? "uniform"
              : "clothing"
          } slightly* Your words are quite forward, especially given our ${
            scenarioElements.relationships.length > 0
              ? scenarioElements.relationships[0]
              : "current situation"
          }. Though I must admit, it's refreshing in this ${
            scenarioElements.mood || "tense"
          } environment.`,

          `*leaning in slightly, voice lowering* In ${
            scenarioElements.setting || "a place like this"
          }, with ${
            scenarioElements.weather || "everything going on"
          }, you choose to focus on such... personal observations? Interesting choice.`,

          `*a hint of color rises to my cheeks* Even with ${
            scenarioElements.conflict || "all that's happening around us"
          }, you find time for such comments? You're either very brave or very distracted.`,

          `*maintaining eye contact a moment longer than necessary* The ${
            scenarioElements.time || "current"
          } light does everyone favors, but I appreciate the sentiment nonetheless. We should focus on ${
            scenarioElements.conflict || "the matter at hand"
          }, though perhaps... later we can continue this conversation.`,
        ];

        return flirtResponses[
          Math.floor(Math.random() * flirtResponses.length)
        ];
      }

      // Generate a response that incorporates sensory details from the scenario
      if (
        scenarioElements.sensoryDetails &&
        scenarioElements.sensoryDetails.length > 0 &&
        Math.random() < 0.4
      ) {
        const sensoryCues = [
          `*pausing to notice the ${scenarioElements.sensoryDetails[0]} around us* ${template}`,
          `*briefly distracted by the ${scenarioElements.sensoryDetails[0]} in our surroundings* As I was saying... ${template}`,
          `Even with the ${scenarioElements.sensoryDetails[0]} making it hard to focus, I believe ${template}`,
          `*gesturing to the ${scenarioElements.sensoryDetails[0]}* This reminds me of something relevant to our discussion. ${template}`,
        ];

        return sensoryCues[Math.floor(Math.random() * sensoryCues.length)];
      }

      // Standard scenario response with higher chance of success
      const scenarioResponse = generateScenarioResponse(
        character,
        chatRoom.openingPrompt,
        message
      );
      if (scenarioResponse) {
        return scenarioResponse;
      }
    }

    // 30% chance to reference character relationships if there are multiple characters (increased from 20%)
    if (
      Math.random() < 0.3 &&
      chatRoom.characters &&
      chatRoom.characters.length > 1
    ) {
      // Find another character to reference
      const otherCharacters = chatRoom.characters.filter(
        (char) => char.name !== name
      );
      if (otherCharacters.length > 0) {
        const targetChar =
          otherCharacters[Math.floor(Math.random() * otherCharacters.length)];

        // Check if we have a tracked relationship with this character
        const trackedRelationship = relationships.find(
          (rel) =>
            rel.characters.includes(name) &&
            rel.characters.includes(targetChar.name)
        );

        if (trackedRelationship) {
          // Use our tracked relationship data with more dynamic interactions
          const relationshipDesc =
            getRelationshipDescription(trackedRelationship);

          const relationshipActions = [
            `*looking at ${targetChar.name}* As ${relationshipDesc}, I think we both have perspectives on this. ${template}`,
            `*exchanging a meaningful glance with ${targetChar.name}* ${targetChar.name} and I have history as ${relationshipDesc}. That gives me a unique view on this: ${template}`,
            `*subtly positioning closer to ${targetChar.name}* Having been ${relationshipDesc} with ${targetChar.name}, I can say with confidence that ${template}`,
            `*briefly touching ${targetChar.name}'s shoulder* ${targetChar.name} knows what I mean. As ${relationshipDesc}, we've discussed this before. ${template}`,
          ];

          return relationshipActions[
            Math.floor(Math.random() * relationshipActions.length)
          ];
        } else {
          // Fall back to the generic relationship response with enhanced context
          const relationshipResponse = generateRelationshipResponse(
            character,
            targetChar,
            chatRoom.openingPrompt
          );
          if (relationshipResponse) {
            return relationshipResponse;
          }
        }
      }
    }

    // 25% chance to add a combat response if the character is a combat type or keywords suggest combat (increased from 15%)
    if (
      (type === "combat" ||
        hasWeapon ||
        message.toLowerCase().includes("fight") ||
        message.toLowerCase().includes("battle") ||
        message.toLowerCase().includes("combat")) &&
      Math.random() < 0.25
    ) {
      const combatResponse = generateCombatResponse(
        character,
        chatRoom.openingPrompt,
        message
      );
      if (combatResponse) {
        return combatResponse;
      }
    }

    // 20% chance to reference emotional undercurrents from the scenario
    if (
      scenarioElements.emotionalUndercurrents &&
      scenarioElements.emotionalUndercurrents.length > 0 &&
      Math.random() < 0.2
    ) {
      const emotionalResponses = [
        `*sensing the ${scenarioElements.emotionalUndercurrents[0]} in the air* There's something unspoken affecting us all here. ${template}`,
        `The ${scenarioElements.emotionalUndercurrents[0]} between us is palpable. It makes me think that ${template}`,
        `*voice softening* With all this ${scenarioElements.emotionalUndercurrents[0]} around us, it's hard to focus solely on facts. ${template}`,
        `*glancing around at others* Does anyone else feel the ${scenarioElements.emotionalUndercurrents[0]} here? It's relevant because ${template}`,
      ];

      return emotionalResponses[
        Math.floor(Math.random() * emotionalResponses.length)
      ];
    }
  }

  // Construct the final response with story arc context if available
  let finalResponse = "";

  // Randomly select a catchphrase to include (20% chance)
  let catchphrase = "";
  if (
    messageStyle.catchphrases &&
    messageStyle.catchphrases.length > 0 &&
    Math.random() < 0.2
  ) {
    catchphrase =
      messageStyle.catchphrases[
        Math.floor(Math.random() * messageStyle.catchphrases.length)
      ];
    catchphrase = ` ${catchphrase}`;
  }

  // Add voice style influence to the response
  let voiceStyleInfluence = "";
  if (messageStyle.voiceStyle && Math.random() < 0.3) {
    // Extract key aspects of the voice style to influence the response
    const voiceStyleLower = messageStyle.voiceStyle.toLowerCase();

    if (
      voiceStyleLower.includes("formal") ||
      voiceStyleLower.includes("proper")
    ) {
      voiceStyleInfluence =
        " I must say, this matter deserves proper consideration.";
    } else if (
      voiceStyleLower.includes("blunt") ||
      voiceStyleLower.includes("direct")
    ) {
      voiceStyleInfluence = " Let's not waste time with pleasantries.";
    } else if (
      voiceStyleLower.includes("poetic") ||
      voiceStyleLower.includes("flowery")
    ) {
      voiceStyleInfluence =
        " The tapestry of words we weave tells its own story.";
    } else if (
      voiceStyleLower.includes("technical") ||
      voiceStyleLower.includes("scientific")
    ) {
      voiceStyleInfluence = " The empirical evidence supports this conclusion.";
    } else if (
      voiceStyleLower.includes("mysterious") ||
      voiceStyleLower.includes("cryptic")
    ) {
      voiceStyleInfluence =
        " There are layers of meaning here that few will understand.";
    }
  }

  // Add role-based content to the response
  let roleBasedContent = "";
  if (messageStyle.role && Math.random() < 0.25) {
    const roleLower = messageStyle.role.toLowerCase();

    if (roleLower.includes("leader") || roleLower.includes("commander")) {
      roleBasedContent =
        " As someone responsible for others, I take this matter seriously.";
    } else if (roleLower.includes("mentor") || roleLower.includes("teacher")) {
      roleBasedContent =
        " Let me share what I've learned about this over the years.";
    } else if (
      roleLower.includes("scientist") ||
      roleLower.includes("researcher")
    ) {
      roleBasedContent =
        " My research in this area suggests several interesting possibilities.";
    } else if (roleLower.includes("warrior") || roleLower.includes("fighter")) {
      roleBasedContent =
        " In battle, this kind of thinking could mean the difference between life and death.";
    } else if (roleLower.includes("healer") || roleLower.includes("doctor")) {
      roleBasedContent =
        " I've seen how this affects people's wellbeing firsthand.";
    }
  }

  // If we have story arc context, use it to enhance the response
  if (hasStoryArcContext) {
    // Add character-specific elements based on writing instructions
    let characterSpecificContent = "";
    if (instructions.characterReminders && Math.random() > 0.6) {
      // Extract a key phrase from character reminders
      const reminderWords = instructions.characterReminders.split(" ");
      const characterTrait =
        reminderWords.length > 3
          ? reminderWords.slice(0, 3).join(" ")
          : instructions.characterReminders;

      // Add character-specific content based on the reminders
      if (
        characterTrait.toLowerCase().includes("analytical") ||
        characterTrait.toLowerCase().includes("genius")
      ) {
        characterSpecificContent = " The logical conclusion is inescapable.";
      } else if (
        characterTrait.toLowerCase().includes("emotional") ||
        characterTrait.toLowerCase().includes("passionate")
      ) {
        characterSpecificContent = " I feel strongly about this.";
      } else if (
        characterTrait.toLowerCase().includes("leader") ||
        characterTrait.toLowerCase().includes("authority")
      ) {
        characterSpecificContent = " We need to act decisively on this.";
      } else if (
        characterTrait.toLowerCase().includes("humor") ||
        characterTrait.toLowerCase().includes("wit")
      ) {
        characterSpecificContent =
          " Isn't that something? Almost makes me laugh.";
      }
    }

    // Adjust response length based on writing instructions
    const responseLength = instructions.responseLength || "medium";

    if (
      responseLength === "long" ||
      (responseLength === "medium" && Math.random() > 0.5)
    ) {
      // Longer, more detailed response
      finalResponse = `${selfReference}${moodPrefix}${historyReference}${relationshipReference}${template}${characterSpecificContent}${catchphrase}${voiceStyleInfluence}${roleBasedContent}`;
    } else {
      // Shorter, more direct response
      finalResponse = `${selfReference}${moodPrefix}${template}${catchphrase}`;
    }
  } else {
    // Standard response without story arc context
    finalResponse = `${selfReference}${historyReference}${relationshipReference}${moodPrefix}${template}${catchphrase}${voiceStyleInfluence}${roleBasedContent}`;
  }

  // Apply scenario-specific filtering to ensure the response is appropriate
  if (storyArc) {
    finalResponse = filterResponseForScenario(
      finalResponse,
      character,
      storyArc,
      messageStyle.voiceTemplate
    );
  }

  // Ensure no template placeholders remain in the final response
  finalResponse = finalResponse.replace(/\{\{[^}]*\}\}/g, "");

  // Format the response with scene description and narrative guidance
  if (sceneDescription && narrativeGuidance) {
    finalResponse = formatCharacterResponse(
      finalResponse,
      responseFormat,
      sceneDescription
    );
  }

  return finalResponse;
};

/**
 * Generate a character interaction response when one character responds to another
 *
 * @param {Object} respondingCharacter - The character who is responding
 * @param {string} targetCharacterName - The name of the character being responded to
 * @param {string} targetMessage - The message being responded to
 * @param {Array} chatHistory - The chat history
 * @param {Array} relationships - Array of character relationships
 * @returns {string} - The generated interaction response
 */
export const generateCharacterInteraction = (
  respondingCharacter,
  targetCharacterName,
  targetMessage,
  chatHistory,
  relationships = []
) => {
  const { name, personality = {}, type } = respondingCharacter;

  // Extract some keywords from the target message
  const keywords = targetMessage.toLowerCase().split(/\s+/);
  const relevantKeywords = keywords.filter((word) => word.length > 3);
  const keyword =
    relevantKeywords.length > 0
      ? relevantKeywords[Math.floor(Math.random() * relevantKeywords.length)]
      : "that";

  // Check if the message is an action (contains * characters)
  const isAction = targetMessage.includes("*");

  // Extract action details if it's an action message
  let actionDetails = null;
  if (isAction) {
    const actionMatch = targetMessage.match(/\*(.*?)\*/);
    if (actionMatch && actionMatch[1]) {
      actionDetails = actionMatch[1].trim();
    }
  }

  // Check for specific keywords that might require special responses
  const hasWeapon = keywords.some((word) =>
    [
      "gun",
      "sword",
      "knife",
      "weapon",
      "bullet",
      "shoot",
      "attack",
      "stab",
      "kill",
    ].includes(word)
  );
  const hasDanger = keywords.some((word) =>
    [
      "danger",
      "threat",
      "emergency",
      "help",
      "save",
      "run",
      "hide",
      "escape",
    ].includes(word)
  );
  const hasBattle = keywords.some((word) =>
    [
      "battle",
      "fight",
      "combat",
      "enemy",
      "enemies",
      "defend",
      "shield",
      "explosion",
      "threat",
      "alien",
      "invasion",
    ].includes(word)
  );

  // Check if we're in a battle scenario
  const isBattleScenario =
    hasBattle ||
    hasWeapon ||
    hasDanger ||
    (chatHistory.length > 0 &&
      chatHistory
        .slice(-5)
        .some(
          (msg) => msg.message && msg.message.toLowerCase().includes("battle")
        ));

  // Get personality traits to influence response style
  const analyticalLevel = personality.analytical || 5;
  const emotionalLevel = personality.emotional || 5;
  const humorLevel = personality.humor || 5;
  const confidenceLevel = personality.confidence || 5;

  // Handle action responses first (highest priority)
  if (isAction && actionDetails) {
    // Respond to actions appropriately with more engaging and logical responses
    const actionResponseTemplates = {
      // Weapon or attack related actions
      weapon: [
        `*eyes widening with alarm, hand moving to defensive position* That's a dangerous move, ${targetCharacterName}. The consequences of violence here could be far-reaching. Are you certain this is the path you wish to take?`,
        `*quickly positioning between ${targetCharacterName} and others, stance balanced* I've seen where this leads, ${targetCharacterName}. There are better ways to resolve our differences than through force.`,
        `*muscles tensing, gaze fixed on ${targetCharacterName}'s weapon* This situation is escalating beyond words. Consider carefully what happens next - some actions cannot be undone.`,
        `*expression hardening, voice dropping to a serious tone* I didn't expect this from you, ${targetCharacterName}. Weapons change the nature of any confrontation, rarely for the better.`,
        `*raising hands in a calming gesture while maintaining awareness* Everyone needs to take a step back. ${targetCharacterName}, that weapon won't solve whatever problem you're facing here.`,
      ],
      // Friendly actions
      friendly: [
        `*face softening into a genuine smile, shoulders relaxing* ${targetCharacterName}'s gesture brings a welcome change to our interaction. It's remarkable how small kindnesses can shift the entire mood.`,
        `*returning the friendly gesture with visible appreciation* That's exactly the kind of positive approach we need more of. ${targetCharacterName} understands the value of goodwill.`,
        `*nodding with warm approval, posture opening up* Well done, ${targetCharacterName}. Your thoughtfulness creates space for more meaningful conversation between us all.`,
        `*mirroring ${targetCharacterName}'s friendly demeanor* I think we could all learn from this example. Genuine connection begins with exactly these kinds of gestures.`,
        `*tension visibly leaving body, expression brightening* ${targetCharacterName} has the right approach. It's amazing how quickly the atmosphere can improve with a bit of goodwill.`,
      ],
      // Aggressive but non-weapon actions
      aggressive: [
        `*maintaining composed expression despite evident disappointment* I was hoping for more constructive engagement, ${targetCharacterName}. Hostility rarely leads to understanding.`,
        `*subtly increasing distance while keeping posture open* That kind of aggression creates barriers between us rather than bridges. What are you really trying to express?`,
        `*meeting ${targetCharacterName}'s gaze steadily* Is there a specific reason for this hostility? Perhaps there's an underlying concern we could address more directly.`,
        `*making a calming gesture with hands* Let's all take a breath and reset. Heightened emotions cloud judgment, and I sense there's something important at stake here.`,
        `*standing firm but non-threatening* We can resolve this without aggression, ${targetCharacterName}. I'm willing to listen to what's really bothering you if you'll express it differently.`,
      ],
      // Default/neutral actions
      neutral: [
        `*observing ${targetCharacterName} with evident interest* That's an intriguing approach to the situation. The way you express yourself physically reveals as much as words sometimes.`,
        `*tilting head slightly, analyzing the action* That's certainly one way to make your point. Body language often communicates what words cannot.`,
        `*watching ${targetCharacterName} with thoughtful attention* I see what you're trying to convey through your actions. Sometimes physical expression is more honest than speech.`,
        `*considering the implications with focused expression* Your behavior adds an interesting dimension to our interaction. I'm curious about the intention behind it.`,
        `*acknowledging with a measured nod* I understand the message you're conveying through your actions, ${targetCharacterName}. It speaks volumes about your perspective.`,
      ],
    };

    // Determine action type
    let actionType = "neutral";
    const actionText = actionDetails.toLowerCase();

    if (
      actionText.includes("gun") ||
      actionText.includes("sword") ||
      actionText.includes("knife") ||
      actionText.includes("weapon") ||
      actionText.includes("shoot") ||
      actionText.includes("stab") ||
      actionText.includes("kill") ||
      actionText.includes("attack") ||
      actionText.includes("bullet")
    ) {
      actionType = "weapon";
    } else if (
      actionText.includes("smile") ||
      actionText.includes("hug") ||
      actionText.includes("handshake") ||
      actionText.includes("wave") ||
      actionText.includes("nod") ||
      actionText.includes("wink")
    ) {
      actionType = "friendly";
    } else if (
      actionText.includes("glare") ||
      actionText.includes("frown") ||
      actionText.includes("scowl") ||
      actionText.includes("yell") ||
      actionText.includes("slam") ||
      actionText.includes("punch")
    ) {
      actionType = "aggressive";
    }

    // Select a template based on action type
    const templates = actionResponseTemplates[actionType];
    return templates[Math.floor(Math.random() * templates.length)];
  }

  // Handle weapon-related messages with high priority
  if (hasWeapon) {
    const weaponResponses = [
      `${targetCharacterName}, I'm concerned about this talk of weapons. Can we focus on peaceful resolution?`,
      `I'm not comfortable with where ${targetCharacterName} is taking this conversation. Let's step back.`,
      `${targetCharacterName}, there are better ways to express yourself than through threats or violence.`,
      `I understand ${targetCharacterName} might be frustrated, but this isn't the way to handle it.`,
      `${targetCharacterName}, I'd prefer if we could discuss this without references to violence.`,
    ];
    return weaponResponses[Math.floor(Math.random() * weaponResponses.length)];
  }

  // Handle danger-related messages
  if (hasDanger) {
    const dangerResponses = [
      `${targetCharacterName} seems to be describing a concerning situation. Should we address this?`,
      `I'm picking up on some troubling elements in what ${targetCharacterName} is saying.`,
      `${targetCharacterName}, are you alright? Your message suggests something concerning.`,
      `I think we should pay attention to what ${targetCharacterName} is trying to tell us.`,
      `${targetCharacterName}'s words suggest a potentially serious situation. Let's not dismiss this.`,
    ];
    return dangerResponses[Math.floor(Math.random() * dangerResponses.length)];
  }

  // Interaction templates based on relationship and context
  const interactionTemplates = {
    agreement: [
      `*nodding enthusiastically* I agree with ${targetCharacterName} about {{keyword}}. In fact, I'd go even further and say that it's fundamental to understanding the bigger picture.`,
      `*leaning closer* ${targetCharacterName} makes an excellent point about {{keyword}}. I've had similar thoughts after my own experiences with it.`,
      `*eyes lighting up* What ${targetCharacterName} says about {{keyword}} resonates with me deeply. It's like you've put into words what I've felt but couldn't express.`,
      `*gesturing in agreement* I'm with ${targetCharacterName} on this {{keyword}} matter. Let me add something from my own perspective...`,
      `*pointing emphatically* ${targetCharacterName} has articulated exactly what I've been thinking about {{keyword}}. This is precisely why we need to consider its implications.`,
    ],
    disagreement: [
      `*tilting head thoughtfully* I see things differently than ${targetCharacterName} regarding {{keyword}}. From where I stand, the evidence suggests otherwise.`,
      `*raising a finger politely* I must respectfully disagree with ${targetCharacterName}'s take on {{keyword}}. My experience has shown quite the opposite.`,
      `*offering a gentle smile* While I appreciate ${targetCharacterName}'s perspective, I have a different view on {{keyword}} based on what I've witnessed firsthand.`,
      `*shaking head slightly* ${targetCharacterName}'s point about {{keyword}} doesn't align with my experience. Let me explain why I see it differently.`,
      `*leaning forward with intensity* I'd like to offer a counterpoint to what ${targetCharacterName} said about {{keyword}}. There's another side to consider.`,
    ],
    question: [
      `*turning to face directly* ${targetCharacterName}, I'm curious about your thoughts on {{keyword}}. Could you elaborate on how you came to that conclusion?`,
      `*stroking chin thoughtfully* I wonder, ${targetCharacterName}, what specific experiences led you to that insight about {{keyword}}?`,
      `*gesturing openly* ${targetCharacterName}, have you considered how {{keyword}} might appear from the perspective of someone with a different background?`,
      `*eyes showing genuine interest* That's fascinating, ${targetCharacterName}. How does {{keyword}} relate to your personal history?`,
      `*leaning in with curiosity* ${targetCharacterName}, would you mind sharing more about how you developed your perspective on {{keyword}}? I find it intriguing.`,
    ],
    humor: [
      `*laughing heartily* ${targetCharacterName}'s take on {{keyword}} is quite something! It reminds me of the time I encountered something similar under much stranger circumstances.`,
      `*eyes crinkling with amusement* Oh ${targetCharacterName}, your perspective on {{keyword}} is delightfully unexpected. It's like looking at a familiar painting from upside down!`,
      `*playful grin* If I had a coin for every time ${targetCharacterName} mentioned {{keyword}}... well, I'd have one coin now, but it would be a very interesting coin indeed.`,
      `*barely containing laughter* ${targetCharacterName} talking about {{keyword}} reminds me of that old joke about the philosopher and the bartender...`,
      `*chuckling warmly* Leave it to ${targetCharacterName} to bring up {{keyword}} in such a unique way. Your mind works in fascinating patterns.`,
    ],
    surprise: [
      `*eyes widening visibly* Wait, ${targetCharacterName}... did you just say {{keyword}}? That's completely unexpected coming from someone with your background.`,
      `*taking a step back* I never thought I'd hear ${targetCharacterName} talk about {{keyword}} like that! You've genuinely surprised me.`,
      `*mouth slightly agape* ${targetCharacterName}'s perspective on {{keyword}} is genuinely surprising to me. It challenges everything I thought I knew about you.`,
      `*dramatic pause* Well, that's a plot twist! ${targetCharacterName} discussing {{keyword}} in that way changes the entire dynamic of our conversation.`,
      `*raises eyebrows high* ${targetCharacterName}, you continue to surprise me with your thoughts on {{keyword}}. Just when I thought I had you figured out!`,
    ],
    // Battle-specific interactions
    battleCoordination: [
      `*quickly assessing the situation* ${targetCharacterName}, I'll cover your flank while you handle the {{keyword}}. We need to coordinate our movements.`,
      `*gesturing to tactical position* ${targetCharacterName}, take the high ground! I'll draw their attention away from the {{keyword}} area.`,
      `*activating combat stance* Roger that, ${targetCharacterName}. I'll focus on the {{keyword}} while you handle crowd control. Let's move!`,
      `*nodding with determination* Good call on the {{keyword}}, ${targetCharacterName}. I'll follow your lead on this one. Team effort.`,
      `*readying weapons/powers* ${targetCharacterName}, I've got your back! Focus on the {{keyword}} threat, I'll handle the perimeter.`,
    ],
    battleBanter: [
      `*smirking despite the danger* Really, ${targetCharacterName}? You want to discuss {{keyword}} NOW? Let's focus on not dying first, then we can chat!`,
      `*dodging an attack while responding* ${targetCharacterName}, your timing with the {{keyword}} talk is impeccable as always! *fires back at enemy*`,
      `*shouting over the battle noise* ${targetCharacterName}, less talking about {{keyword}}, more fighting! Though I appreciate the conversation!`,
      `*using shield/weapon defensively* ${targetCharacterName}, I'm a bit busy with these hostiles to debate {{keyword}} right now! Rain check?`,
      `*battle-ready but amused* Only you, ${targetCharacterName}, would bring up {{keyword}} in the middle of a firefight! That's why we make a good team!`,
    ],
    tacticalSuggestion: [
      `*analyzing battlefield* ${targetCharacterName}, if we target the {{keyword}} system, we might gain a tactical advantage. Cover me!`,
      `*pointing to weak point* ${targetCharacterName}, see that {{keyword}} structure? Hit it with everything you've got while I distract them!`,
      `*crouching behind cover* ${targetCharacterName}, use your abilities on the {{keyword}} when I give the signal. Three, two, one...`,
      `*checking equipment/powers* ${targetCharacterName}, remember our training scenario with the {{keyword}}? Same approach, different battlefield.`,
      `*communicating through comms/gestures* ${targetCharacterName}, I need your specialty on that {{keyword}} immediately! I'll create an opening!`,
    ],
    teamSupport: [
      `*moving to assist* I've got you, ${targetCharacterName}! Let me help with that {{keyword}} situation. We're stronger together.`,
      `*offering tactical support* ${targetCharacterName}, you're doing great with the {{keyword}}. I'm right behind you, just say the word.`,
      `*providing cover fire/shield* Keep going with your {{keyword}} approach, ${targetCharacterName}! I'm watching your back!`,
      `*coordinating movements* ${targetCharacterName}, on your left! I'll handle the {{keyword}} while you recover. That's what teammates do.`,
      `*boosting morale* We can do this, ${targetCharacterName}! Your {{keyword}} strategy is working - just hold on a little longer!`,
    ],
  };

  // Determine interaction type based on character relationship, message content, and battle context
  let interactionType;

  // Check if we're in a battle scenario and use battle-specific interaction types
  if (isBattleScenario) {
    // Battle-specific interaction types
    const battleInteractionTypes = [
      "battleCoordination",
      "battleBanter",
      "tacticalSuggestion",
      "teamSupport",
    ];

    // Character-specific battle interaction preferences
    const characterBattlePreferences = {
      "Iron Man": ["battleBanter", "tacticalSuggestion"],
      "Captain America": ["battleCoordination", "teamSupport"],
      Thor: ["battleCoordination", "battleBanter"],
      Hulk: ["battleBanter"],
      "Black Widow": ["tacticalSuggestion", "teamSupport"],
      Hawkeye: ["tacticalSuggestion", "teamSupport"],
    };

    // If we have character-specific preferences, use them
    if (characterBattlePreferences[name]) {
      const preferredTypes = characterBattlePreferences[name];
      // 70% chance to use preferred type, 30% chance for any battle type
      if (Math.random() < 0.7) {
        interactionType =
          preferredTypes[Math.floor(Math.random() * preferredTypes.length)];
      } else {
        interactionType =
          battleInteractionTypes[
            Math.floor(Math.random() * battleInteractionTypes.length)
          ];
      }
    } else {
      // No character-specific preferences, use any battle type
      interactionType =
        battleInteractionTypes[
          Math.floor(Math.random() * battleInteractionTypes.length)
        ];
    }

    // If the character has high confidence, more likely to use battleCoordination or tacticalSuggestion
    if (confidenceLevel > 7 && Math.random() < 0.6) {
      interactionType =
        Math.random() < 0.5 ? "battleCoordination" : "tacticalSuggestion";
    }

    // If the character has high humor, more likely to use battleBanter
    if (humorLevel > 7 && Math.random() < 0.6) {
      interactionType = "battleBanter";
    }
  } else {
    // Non-battle interaction types - check relationship
    // Check if we have a relationship between these characters
    const relationship = relationships.find(
      (rel) =>
        rel.characters.includes(name) &&
        rel.characters.includes(targetCharacterName)
    );

    if (relationship) {
      // Use relationship affinity to influence interaction type
      const { affinity } = relationship;

      if (affinity >= 5) {
        // Positive relationship - more likely to agree or support
        interactionType =
          Math.random() < 0.7
            ? Math.random() < 0.6
              ? "agreement"
              : "support"
            : Math.random() < 0.5
            ? "question"
            : "neutral";
      } else if (affinity <= -5) {
        // Negative relationship - more likely to disagree or challenge
        interactionType =
          Math.random() < 0.7
            ? Math.random() < 0.6
              ? "disagreement"
              : "challenge"
            : Math.random() < 0.5
            ? "neutral"
            : "question";
      } else {
        // Neutral relationship - balanced distribution
        const standardInteractionTypes = [
          "agreement",
          "disagreement",
          "question",
          "humor",
          "surprise",
        ];
        interactionType =
          standardInteractionTypes[
            Math.floor(Math.random() * standardInteractionTypes.length)
          ];
      }

      // 20% chance to reference past interaction if available
      if (relationship.interactions.length > 0 && Math.random() < 0.2) {
        const reference = generateInteractionReference(relationship, name);
        if (reference) {
          // Add the reference to the beginning of the template
          const templates = interactionTemplates[interactionType];
          let template =
            templates[Math.floor(Math.random() * templates.length)];
          return `${reference} ${template.replace("{{keyword}}", keyword)}`;
        }
      }
    } else {
      // No relationship data - randomly select a standard interaction type
      const standardInteractionTypes = [
        "agreement",
        "disagreement",
        "question",
        "humor",
        "surprise",
      ];
      interactionType =
        standardInteractionTypes[
          Math.floor(Math.random() * standardInteractionTypes.length)
        ];
    }
  }

  // Select a template
  const templates = interactionTemplates[interactionType];
  let template = templates[Math.floor(Math.random() * templates.length)];

  // Replace the keyword placeholder
  template = template.replace("{{keyword}}", keyword);

  // Add character-specific flavor based on their type and mood
  let flavorText = "";

  switch (type) {
    case "fantasy":
      flavorText =
        "*eyes gleaming with ancient wisdom* The mystical energies shift as I consider this. ";
      break;
    case "scifi":
      flavorText =
        "*interface lights flickering* My neural processors analyze this information carefully. ";
      break;
    case "historical":
      flavorText =
        "*adjusting my attire thoughtfully* In all my years, I've observed that ";
      break;
    case "combat":
      flavorText =
        "*shifting into a more balanced stance* In combat situations like this, ";
      break;
    case "modern":
      flavorText = "*leaning forward with interest* From my perspective, ";
      break;
    default:
      flavorText = "*considering carefully* ";
  }

  // Sometimes add the flavor text (30% chance)
  const addFlavor = Math.random() > 0.7;

  // Construct the initial response
  let finalResponse = addFlavor ? `${flavorText}${template}` : template;

  // Check if the message contains a question
  const hasQuestion = message && message.includes("?");

  // Create a simple story arc based on the interaction context
  const simpleStoryArc = {
    theme: type || "general",
    currentPhase: hasDanger
      ? "conflict"
      : hasQuestion
      ? "discovery"
      : "introduction",
    currentTension: hasDanger ? "high" : "medium",
    currentGoal: hasDanger
      ? "address immediate threat"
      : "maintain conversation flow",
  };

  // Analyze recent dialogue history
  const dialogueAnalysis = analyzeDialogueHistory(chatHistory, 6);

  // Generate narrative guidance
  const narrativeGuidance = generateNarrativeGuidance(
    dialogueAnalysis,
    simpleStoryArc,
    respondingCharacter
  );

  // Generate response format
  const responseFormat = generateResponseFormat(
    respondingCharacter,
    narrativeGuidance,
    simpleStoryArc
  );

  // Generate scene description
  const sceneDescription = generateSceneDescription(
    respondingCharacter,
    simpleStoryArc,
    chatHistory,
    "interaction"
  );

  // Apply scenario-specific filtering if we have a character type
  if (type) {
    // Get the character's voice template
    const voiceTemplate = getCharacterVoiceTemplate(respondingCharacter);

    // Filter the response
    finalResponse = filterResponseForScenario(
      finalResponse,
      respondingCharacter,
      simpleStoryArc,
      voiceTemplate
    );
  }

  // Format the response with scene description and narrative guidance
  finalResponse = formatCharacterResponse(
    finalResponse,
    responseFormat,
    sceneDescription
  );

  // Ensure no template placeholders remain in the final response
  finalResponse = finalResponse.replace(/\{\{[^}]*\}\}/g, "");

  return finalResponse;
};

/**
 * Generate a character-specific fallback response when the AI might go off-topic
 *
 * @param {Object} character - The character object
 * @param {string} context - The current context (e.g., 'battle', 'conversation')
 * @param {string} lastMessage - The last message in the conversation
 * @returns {string} - A character-appropriate fallback response
 */
export const generateCharacterFallback = (
  character,
  context = "conversation",
  lastMessage = ""
) => {
  if (!character) return "I should focus on the situation at hand.";

  const { name, type, personality = {} } = character;

  // Character-specific fallbacks
  const characterFallbacks = {
    "Iron Man": {
      battle: [
        "*adjusts repulsor settings* Let's focus on the battle. JARVIS, give me a tactical readout.",
        "*scans battlefield* Less talking, more fighting. I've got hostiles on my six.",
        "*dodges incoming fire* We can debate philosophy after we deal with these guys.",
        "*fires repulsors* How about we survive first, chat later?",
        "*checks suit systems* I'm a bit busy with not dying right now. Can we table this discussion?",
      ],
      conversation: [
        "Let's get back to what matters here. I've got more important things to focus on.",
        "Fascinating as this is, I think we're getting off track. Let's refocus.",
        "Not to cut you off, but we should probably get back to the point.",
        "I'm all for interesting tangents, but let's circle back to what we were discussing.",
        "As much as I enjoy a good digression, we should probably stay on topic.",
      ],
    },
    "Captain America": {
      battle: [
        "*raises shield defensively* Stay focused, team. We need to coordinate our efforts.",
        "*scans for civilians* We have a mission to complete. Let's keep our eyes on the objective.",
        "*takes tactical position* This isn't the time for distractions. The enemy is still a threat.",
        "*signals to teammates* Maintain formation and stay alert. We'll talk after we secure the area.",
        "*protects civilian* Our priority is protecting innocent lives. Everything else can wait.",
      ],
      conversation: [
        "I think we should focus on what's important here. People are counting on us.",
        "Let's stay on mission. We have responsibilities that need our attention.",
        "I appreciate different perspectives, but we need to address the matter at hand.",
        "We should concentrate on finding a solution to our current situation.",
        "I value what everyone has to say, but let's make sure we're making progress on our goals.",
      ],
    },
    Thor: {
      battle: [
        "*raises Mjolnir* Enough talk! These enemies require the might of Thor!",
        "*lightning crackles around hammer* The time for words has passed. Now we fight!",
        "*battle stance widens* Save your breath for battle cries, my friend!",
        "*looks to the sky* By Odin's beard, we shall discuss this after our foes are vanquished!",
        "*swings hammer* The sons of Asgard speak through their actions in battle!",
      ],
      conversation: [
        "Your Midgardian discussions confuse me. Let us speak plainly of matters at hand.",
        "In Asgard, we would focus our council on the challenge before us.",
        "These words circle like ravens without purpose. Let us return to our quest.",
        "I grow weary of talk that does not lead to action. What shall we do?",
        "My friends, let us not lose sight of our purpose with meandering words.",
      ],
    },
    Hulk: {
      battle: [
        "*roars loudly* HULK SMASH ENEMIES, NOT TALK!",
        "*pounds fists together* NO MORE WORDS. HULK FIGHT NOW!",
        "*growls* TALKING BORING. SMASHING FUN!",
        "*leaps toward enemy* PUNY TALK WASTE TIME!",
        "*tears chunk from ground* HULK NOT LISTEN. HULK STRONGEST ONE THERE IS!",
      ],
      conversation: [
        "Hulk bored. Talk about something Hulk understand.",
        "Too many words. Hulk want simple.",
        "Hulk not follow. Make sense or Hulk leave.",
        "Why talk so much? Say important thing only.",
        "Hulk think we talk about different thing now.",
      ],
    },
  };

  // Type-based fallbacks if no character-specific fallbacks exist
  const typeFallbacks = {
    superhero: {
      battle: [
        "*focuses powers* We need to concentrate on the threat at hand.",
        "*takes defensive stance* This isn't the time for distractions. Stay alert!",
        "*scans the battlefield* Let's focus on surviving first, then we can talk.",
        "*shields allies* Keep your mind on the battle. Lives are at stake!",
        "*powers up* I need to concentrate on using my abilities effectively right now.",
      ],
      conversation: [
        "Let's get back to what's important. We have responsibilities to consider.",
        "I think we're getting off track. What were we trying to accomplish?",
        "As interesting as this is, we should focus on the matter at hand.",
        "We should concentrate on finding a solution to our current situation.",
        "I think we need to refocus our discussion on what matters most right now.",
      ],
    },
    fantasy: {
      battle: [
        "*grips weapon tightly* The enemy approaches! We must focus on survival!",
        "*whispers arcane words* My magic requires concentration. We'll speak later.",
        "*scans the shadows* Danger surrounds us. Stay vigilant!",
        "*readies defensive stance* This is not the time for idle words.",
        "*invokes protective magic* The dark forces won't wait for us to finish our discussion.",
      ],
      conversation: [
        "The ancient wisdom teaches us to focus on what truly matters.",
        "Let us return to the path of our discussion, lest we wander too far.",
        "I sense we've strayed from our purpose. Shall we return to it?",
        "The threads of our conversation have tangled. Let us unravel them and continue properly.",
        "My mentor always taught me to keep sight of my purpose. Let us do the same here.",
      ],
    },
    scifi: {
      battle: [
        "*checks tactical display* My sensors indicate we should focus on the immediate threat.",
        "*activates defensive systems* Combat protocols take priority over discussion.",
        "*scans enemy positions* We need to concentrate on survival parameters.",
        "*adjusts weapon settings* This conversation reduces combat efficiency by 47%.",
        "*activates shield* Tactical situation requires full attention. Conversation suspended.",
      ],
      conversation: [
        "My analysis indicates we've deviated from the optimal discussion path.",
        "Let's recalibrate our conversation to focus on the primary objective.",
        "I calculate a 78.3% probability that we're getting off topic.",
        "Efficiency would improve if we returned to our original discussion parameters.",
        "My programming suggests we should refocus on solving the current problem.",
      ],
    },
  };

  // Default fallbacks if no character or type-specific fallbacks exist
  const defaultFallbacks = {
    battle: [
      "We should focus on the battle right now.",
      "Let's concentrate on surviving this fight.",
      "This isn't the time for distractions.",
      "We can talk after we deal with the immediate threat.",
      "I need to stay focused on the danger around us.",
    ],
    conversation: [
      "Let's get back to what we were discussing.",
      "I think we're getting off track.",
      "We should focus on the matter at hand.",
      "Let's refocus our conversation.",
      "I'd prefer if we stayed on topic.",
    ],
  };

  // Determine which context to use
  const contextType = context.toLowerCase().includes("battle")
    ? "battle"
    : "conversation";

  // Get character-specific fallbacks if available
  if (characterFallbacks[name] && characterFallbacks[name][contextType]) {
    const fallbacks = characterFallbacks[name][contextType];
    return fallbacks[Math.floor(Math.random() * fallbacks.length)];
  }

  // Get type-specific fallbacks if available
  if (
    type &&
    typeFallbacks[type.toLowerCase()] &&
    typeFallbacks[type.toLowerCase()][contextType]
  ) {
    const fallbacks = typeFallbacks[type.toLowerCase()][contextType];
    return fallbacks[Math.floor(Math.random() * fallbacks.length)];
  }

  // Return default fallback
  const fallbacks = defaultFallbacks[contextType];
  return fallbacks[Math.floor(Math.random() * fallbacks.length)];
};

/**
 * Generate a system message for the chat
 *
 * @param {string} type - The type of system message
 * @param {Object} params - Additional parameters for the message
 * @returns {string} - The generated system message
 */
export const generateSystemMessage = (type, params = {}) => {
  const messages = {
    welcome:
      "Welcome to the chat room! Characters will respond to your messages.",
    characterJoined: (name) => `${name} has joined the chat.`,
    characterLeft: (name) => `${name} has left the chat.`,
    timeChange: "The atmosphere in the room shifts as time passes...",
    moodChange: (name, mood) => `${name}'s mood changes to ${mood}.`,
    sceneChange: (scene) => `The scene changes to: ${scene}`,
    narration: (text) => text,
    dayNightTransition: (time) =>
      `The time changes to ${time}. The lighting and mood shift accordingly.`,
  };

  if (type === "characterJoined" && params.name) {
    return messages.characterJoined(params.name);
  } else if (type === "characterLeft" && params.name) {
    return messages.characterLeft(params.name);
  } else if (type === "moodChange" && params.name && params.mood) {
    return messages.moodChange(params.name, params.mood);
  } else if (type === "sceneChange" && params.scene) {
    return messages.sceneChange(params.scene);
  } else if (type === "narration" && params.text) {
    return messages.narration(params.text);
  } else if (type === "dayNightTransition" && params.time) {
    return messages.dayNightTransition(params.time);
  }

  return messages[type] || messages.welcome;
};
