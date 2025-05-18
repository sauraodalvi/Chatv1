/**
 * Utility functions for enhancing scenario descriptions
 */

/**
 * Check if a scenario description is too short (approximately one sentence)
 * 
 * @param {string} description - The scenario description to check
 * @returns {boolean} - True if the description is considered too short
 */
export const isDescriptionTooShort = (description) => {
  if (!description || typeof description !== 'string') return true;
  
  // Trim the description
  const trimmed = description.trim();
  
  // If empty, it's definitely too short
  if (trimmed.length === 0) return true;
  
  // Count sentences (roughly) by looking for sentence-ending punctuation
  const sentences = trimmed.split(/[.!?]+/).filter(s => s.trim().length > 0);
  
  // Count words
  const words = trimmed.split(/\s+/).filter(w => w.length > 0);
  
  // Consider it too short if it has only one sentence and fewer than 25 words,
  // or if it has fewer than 15 words regardless of sentence count
  return (sentences.length <= 1 && words.length < 25) || words.length < 15;
};

/**
 * Generate suggestions to enhance a scenario description
 * 
 * @param {string} description - The current scenario description
 * @param {Array} characters - The selected characters
 * @returns {Object} - Suggestions for enhancing the scenario
 */
export const generateScenarioSuggestions = (description, characters = []) => {
  // Extract key elements from the description
  const descriptionLower = description ? description.toLowerCase() : '';
  
  // Detect themes in the description
  const themes = {
    adventure: ['journey', 'quest', 'discover', 'explore', 'adventure', 'treasure', 'map'].some(w => descriptionLower.includes(w)),
    combat: ['fight', 'battle', 'war', 'conflict', 'weapon', 'enemy', 'attack', 'defend'].some(w => descriptionLower.includes(w)),
    mystery: ['mystery', 'clue', 'detective', 'solve', 'case', 'investigate', 'secret'].some(w => descriptionLower.includes(w)),
    fantasy: ['magic', 'wizard', 'spell', 'dragon', 'mythical', 'enchanted', 'potion'].some(w => descriptionLower.includes(w)),
    scifi: ['space', 'alien', 'future', 'technology', 'robot', 'starship', 'planet'].some(w => descriptionLower.includes(w)),
    romance: ['love', 'romance', 'relationship', 'passion', 'heart', 'emotion', 'feeling'].some(w => descriptionLower.includes(w)),
    horror: ['fear', 'terror', 'horror', 'scary', 'monster', 'nightmare', 'dark'].some(w => descriptionLower.includes(w)),
    historical: ['history', 'ancient', 'medieval', 'century', 'era', 'period', 'kingdom'].some(w => descriptionLower.includes(w)),
  };
  
  // Determine the dominant theme
  const dominantTheme = Object.entries(themes).reduce(
    (prev, [theme, isPresent]) => (isPresent ? theme : prev),
    'general'
  );
  
  // Check what elements are missing from the description
  const hasSetting = ['in', 'at', 'near', 'inside', 'outside', 'around'].some(w => descriptionLower.includes(w));
  const hasTime = ['morning', 'afternoon', 'evening', 'night', 'dawn', 'dusk', 'day', 'hour', 'time'].some(w => descriptionLower.includes(w));
  const hasWeather = ['rain', 'snow', 'sunny', 'cloudy', 'storm', 'wind', 'fog', 'mist', 'weather'].some(w => descriptionLower.includes(w));
  const hasEmotion = ['feel', 'emotion', 'happy', 'sad', 'angry', 'afraid', 'excited', 'nervous', 'tense'].some(w => descriptionLower.includes(w));
  const hasGoal = ['goal', 'objective', 'mission', 'task', 'quest', 'find', 'seek', 'search', 'achieve'].some(w => descriptionLower.includes(w));
  const hasObstacle = ['obstacle', 'challenge', 'problem', 'difficulty', 'trouble', 'barrier', 'prevent', 'block'].some(w => descriptionLower.includes(w));
  const hasCharacterRelationships = characters.length >= 2 && characters.some(char => 
    descriptionLower.includes(char.name.toLowerCase())
  );
  
  // Generate suggestions based on what's missing
  const suggestions = {
    setting: !hasSetting ? {
      title: "Add Setting Details",
      description: "Describe where the scene takes place to create a more vivid picture.",
      examples: [
        dominantTheme === 'fantasy' ? "in an ancient enchanted forest with towering trees that whisper secrets" :
        dominantTheme === 'scifi' ? "aboard a massive starship with corridors humming with advanced technology" :
        dominantTheme === 'historical' ? "in a medieval marketplace filled with merchants and the scent of spices" :
        "in a location with distinctive features that set the mood"
      ]
    } : null,
    
    time: !hasTime ? {
      title: "Add Time Context",
      description: "Mention when the scene takes place to establish atmosphere.",
      examples: [
        dominantTheme === 'horror' ? "as darkness falls and shadows grow longer" :
        dominantTheme === 'adventure' ? "at dawn, as the first light reveals the path ahead" :
        "during a specific time that affects the mood or circumstances"
      ]
    } : null,
    
    atmosphere: !hasWeather ? {
      title: "Add Atmospheric Elements",
      description: "Include weather or environmental conditions to enhance immersion.",
      examples: [
        dominantTheme === 'romance' ? "under a gentle rainfall that creates a intimate atmosphere" :
        dominantTheme === 'adventure' ? "with a strong wind carrying distant sounds of danger" :
        "with weather or environmental conditions that reflect the mood"
      ]
    } : null,
    
    emotion: !hasEmotion ? {
      title: "Add Emotional Context",
      description: "Describe how characters feel to create emotional investment.",
      examples: [
        dominantTheme === 'mystery' ? "with a sense of unease that something important is being overlooked" :
        dominantTheme === 'combat' ? "with tension and adrenaline coursing through everyone present" :
        "with emotional states that drive character motivations and reactions"
      ]
    } : null,
    
    goal: !hasGoal ? {
      title: "Add Clear Objectives",
      description: "Define what characters are trying to achieve.",
      examples: [
        dominantTheme === 'adventure' ? "seeking a legendary artifact said to grant its wielder immense power" :
        dominantTheme === 'mystery' ? "trying to uncover the truth behind a series of mysterious disappearances" :
        "with a clear purpose that drives the narrative forward"
      ]
    } : null,
    
    obstacle: !hasObstacle ? {
      title: "Add Challenges or Obstacles",
      description: "Include what stands in the way of the characters' goals.",
      examples: [
        dominantTheme === 'fantasy' ? "but a powerful curse prevents anyone from reaching their destination" :
        dominantTheme === 'scifi' ? "while malfunctioning systems threaten to expose their position to enemies" :
        "with obstacles that create tension and require characters to make difficult choices"
      ]
    } : null,
    
    relationships: !hasCharacterRelationships && characters.length >= 2 ? {
      title: "Add Character Relationships",
      description: "Establish how the characters know each other or interact.",
      examples: characters.length >= 2 ? [
        `${characters[0].name} and ${characters[1].name} have a complicated history that creates tension`,
        `${characters[0].name} relies on ${characters[1].name}'s expertise, despite their differences`,
        "with relationships that create interesting dynamics and potential conflict"
      ] : [
        "with pre-existing relationships that affect how characters interact",
        "where trust is limited due to past experiences between characters",
        "with alliances and rivalries that influence decision-making"
      ]
    } : null
  };
  
  // Filter out null suggestions
  return Object.values(suggestions).filter(suggestion => suggestion !== null);
};

/**
 * Generate example questions to help users expand their scenario
 * 
 * @param {string} description - The current scenario description
 * @param {Array} characters - The selected characters
 * @returns {Array} - Array of questions to help expand the scenario
 */
export const generateGuidingQuestions = (description, characters = []) => {
  const questions = [
    "What unique features does the setting have that affect the characters?",
    "What recent event has created the current situation?",
    "What are the stakes if the characters fail?",
    "What hidden motivations might the characters have?",
    "What unexpected complication might arise?",
    "What sensory details (sounds, smells, etc.) make this scene distinctive?",
    "What time constraints add pressure to the situation?",
    "What social or political context influences the scenario?",
    "What resources or tools do the characters have access to?",
    "What secrets might be revealed during this encounter?"
  ];
  
  // If we have characters, add character-specific questions
  if (characters.length >= 2) {
    questions.push(
      `How do ${characters[0].name} and ${characters[1].name} feel about each other?`,
      `What history do ${characters[0].name} and ${characters[1].name} share?`,
      `What conflicting goals might ${characters[0].name} and ${characters[1].name} have?`
    );
  }
  
  // Shuffle and return 3 random questions
  return shuffleArray(questions).slice(0, 3);
};

/**
 * Shuffle an array (Fisher-Yates algorithm)
 * 
 * @param {Array} array - The array to shuffle
 * @returns {Array} - The shuffled array
 */
const shuffleArray = (array) => {
  const newArray = [...array];
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }
  return newArray;
};
