/**
 * Story Arc Utilities for Velora
 * 
 * This module provides functions for managing dynamic story arcs that evolve
 * based on chat interactions, ensuring more coherent and engaging scenarios.
 */

/**
 * Initialize a story arc based on the scenario type and prompt
 * @param {string} scenarioTitle - The title of the scenario
 * @param {string} scenarioPrompt - The scenario description
 * @param {string} scenarioTheme - The theme of the scenario (e.g., "superhero", "fantasy")
 * @returns {Object} - Initial story arc object
 */
export const initializeStoryArc = (scenarioTitle, scenarioPrompt, scenarioTheme) => {
  // Default story arc structure
  const storyArc = {
    title: scenarioTitle,
    theme: scenarioTheme || detectThemeFromPrompt(scenarioPrompt),
    currentPhase: 'introduction',
    currentGoal: '',
    currentTension: 'medium',
    keyCharacters: [],
    keyLocations: [],
    plotPoints: [],
    currentContext: '',
    previousContext: '',
  };

  // Customize based on known scenarios
  if (scenarioTitle === "Avengers: Alien Invasion" && scenarioTheme === "superhero") {
    return {
      ...storyArc,
      currentPhase: 'conflict',
      currentGoal: 'Defend New York City from the alien invasion',
      currentTension: 'high',
      keyCharacters: ['Iron Man', 'Captain America', 'Thor', 'Hulk'],
      keyLocations: ['New York City', 'Alien Mothership', 'Stark Tower'],
      plotPoints: [
        'Aliens have begun their invasion of New York',
        'The Avengers are fighting to protect civilians',
        'The team needs to find the aliens\' weakness',
        'The final battle will take place on the mothership'
      ],
      currentContext: 'The Avengers are in the midst of battle against alien forces in downtown New York. Civilians are being evacuated while the team fights to push back the invasion. The alien mothership looms overhead, continuously sending down reinforcements. The team needs to coordinate their defense while looking for a way to stop the invasion at its source.',
    };
  } else if (scenarioTheme === "fantasy") {
    return {
      ...storyArc,
      currentPhase: 'introduction',
      currentTension: 'building',
      currentContext: 'The party has just begun their adventure, getting to know one another and establishing their quest objectives.',
    };
  } else if (scenarioTheme === "scifi") {
    return {
      ...storyArc,
      currentPhase: 'introduction',
      currentTension: 'building',
      currentContext: 'The crew is aboard their spacecraft, preparing for the challenges that lie ahead in the vast unknown of space.',
    };
  } else if (scenarioTheme === "mystery") {
    return {
      ...storyArc,
      currentPhase: 'discovery',
      currentTension: 'building',
      currentContext: 'The first clues have been discovered, raising more questions than answers as the investigation begins.',
    };
  }

  // For custom scenarios, extract context from the prompt
  return {
    ...storyArc,
    currentContext: extractContextFromPrompt(scenarioPrompt),
  };
};

/**
 * Update the story arc based on recent chat messages
 * @param {Object} currentArc - The current story arc
 * @param {Array} recentMessages - Recent chat messages
 * @param {number} messageCount - Number of messages to analyze
 * @returns {Object} - Updated story arc
 */
export const updateStoryArc = (currentArc, recentMessages, messageCount = 5) => {
  if (!currentArc || !recentMessages || recentMessages.length === 0) {
    return currentArc;
  }

  // Get the most recent messages for analysis
  const messagesToAnalyze = recentMessages.slice(-messageCount);
  
  // Extract key information from recent messages
  const combinedContent = messagesToAnalyze
    .map(msg => msg.message)
    .join(' ');

  // Check for phase transitions based on content
  const updatedArc = { ...currentArc };
  
  // Save the previous context
  updatedArc.previousContext = currentArc.currentContext;
  
  // Update context based on recent messages
  updatedArc.currentContext = generateUpdatedContext(currentArc, combinedContent);
  
  // Check for phase transitions
  if (currentArc.currentPhase === 'introduction' && 
      (combinedContent.includes('attack') || 
       combinedContent.includes('fight') || 
       combinedContent.includes('battle'))) {
    updatedArc.currentPhase = 'conflict';
    updatedArc.currentTension = 'high';
  } else if (currentArc.currentPhase === 'conflict' && 
            (combinedContent.includes('plan') || 
             combinedContent.includes('strategy') || 
             combinedContent.includes('weakness'))) {
    updatedArc.currentPhase = 'planning';
  } else if (currentArc.currentPhase === 'planning' && 
            (combinedContent.includes('final') || 
             combinedContent.includes('mothership') || 
             combinedContent.includes('confront'))) {
    updatedArc.currentPhase = 'climax';
    updatedArc.currentTension = 'very high';
  }
  
  // For superhero themes, check for specific plot developments
  if (currentArc.theme === 'superhero') {
    if (combinedContent.includes('civilian') || combinedContent.includes('rescue')) {
      updatedArc.currentGoal = 'Rescue civilians and minimize casualties';
    } else if (combinedContent.includes('weakness') || combinedContent.includes('vulnerability')) {
      updatedArc.currentGoal = 'Discover the aliens\' weakness';
    } else if (combinedContent.includes('mothership') || combinedContent.includes('source')) {
      updatedArc.currentGoal = 'Infiltrate the mothership and stop the invasion';
    }
  }
  
  return updatedArc;
};

/**
 * Generate writing instructions based on the current story arc
 * @param {Object} storyArc - The current story arc
 * @param {Object} character - The character who will be speaking
 * @returns {Object} - Writing instructions for the AI
 */
export const generateWritingInstructions = (storyArc, character) => {
  if (!storyArc || !character) {
    return {
      storyArc: '',
      writingStyle: 'balanced',
      responseLength: 'medium',
      characterReminders: '',
      generalNotes: ''
    };
  }
  
  // Base instructions on character personality and story arc
  const instructions = {
    storyArc: storyArc.currentContext,
    writingStyle: 'balanced',
    responseLength: 'medium',
    characterReminders: `Remember that ${character.name} is ${character.description}`,
    generalNotes: ''
  };
  
  // Customize based on character
  if (character.name === "Iron Man") {
    instructions.writingStyle = 'witty';
    instructions.characterReminders += ` He's analytical, sarcastic, and uses technical jargon. He often makes pop culture references and quips during battle.`;
  } else if (character.name === "Captain America") {
    instructions.writingStyle = 'formal';
    instructions.characterReminders += ` He's a natural leader who speaks with authority and moral clarity. He uses military terminology and focuses on teamwork and protecting civilians.`;
  } else if (character.name === "Thor") {
    instructions.writingStyle = 'dramatic';
    instructions.characterReminders += ` He speaks with a slight Asgardian formality, occasionally using archaic terms. He's confident, powerful, and refers to his lightning abilities and Asgardian heritage.`;
  } else if (character.name === "Hulk") {
    instructions.writingStyle = 'direct';
    instructions.responseLength = 'brief';
    instructions.characterReminders += ` He speaks in simple, direct sentences, often in third person. He's driven by emotion, especially anger, and focuses on smashing enemies.`;
  }
  
  // Customize based on story phase
  if (storyArc.currentPhase === 'introduction') {
    instructions.generalNotes = 'Focus on establishing character relationships and setting the scene. Keep tension moderate but building.';
  } else if (storyArc.currentPhase === 'conflict') {
    instructions.generalNotes = 'Emphasize action and immediate threats. Responses should be urgent and focused on the current battle.';
  } else if (storyArc.currentPhase === 'planning') {
    instructions.generalNotes = 'Focus on strategy and analysis. Characters should be thinking about next steps and discussing the enemy\'s weaknesses.';
  } else if (storyArc.currentPhase === 'climax') {
    instructions.generalNotes = 'This is the high point of tension. Responses should be dramatic and impactful, with high stakes clearly communicated.';
  } else if (storyArc.currentPhase === 'resolution') {
    instructions.generalNotes = 'Wind down the action and reflect on what happened. Focus on character growth and next steps.';
  }
  
  return instructions;
};

/**
 * Detect the theme of a scenario from its prompt
 * @param {string} prompt - The scenario prompt
 * @returns {string} - Detected theme
 */
const detectThemeFromPrompt = (prompt) => {
  if (!prompt) return 'general';
  
  const promptLower = prompt.toLowerCase();
  
  if (promptLower.includes('superhero') || 
      promptLower.includes('avenger') || 
      promptLower.includes('hero') ||
      promptLower.includes('villain')) {
    return 'superhero';
  } else if (promptLower.includes('magic') || 
             promptLower.includes('dragon') || 
             promptLower.includes('wizard') ||
             promptLower.includes('fantasy')) {
    return 'fantasy';
  } else if (promptLower.includes('space') || 
             promptLower.includes('alien') || 
             promptLower.includes('future') ||
             promptLower.includes('technology')) {
    return 'scifi';
  } else if (promptLower.includes('mystery') || 
             promptLower.includes('detective') || 
             promptLower.includes('crime') ||
             promptLower.includes('clue')) {
    return 'mystery';
  } else if (promptLower.includes('horror') || 
             promptLower.includes('scary') || 
             promptLower.includes('monster') ||
             promptLower.includes('fear')) {
    return 'horror';
  }
  
  return 'general';
};

/**
 * Extract context from a scenario prompt
 * @param {string} prompt - The scenario prompt
 * @returns {string} - Extracted context
 */
const extractContextFromPrompt = (prompt) => {
  if (!prompt) return '';
  
  // For now, just return the prompt as the context
  // In a more advanced implementation, this could use NLP to extract key elements
  return prompt;
};

/**
 * Generate updated context based on the current arc and recent messages
 * @param {Object} currentArc - The current story arc
 * @param {string} recentContent - Combined content from recent messages
 * @returns {string} - Updated context
 */
const generateUpdatedContext = (currentArc, recentContent) => {
  if (!currentArc || !recentContent) return currentArc.currentContext || '';
  
  // Start with the current context
  let updatedContext = currentArc.currentContext;
  
  // For superhero theme, update based on the current phase
  if (currentArc.theme === 'superhero') {
    if (currentArc.currentPhase === 'conflict') {
      if (recentContent.includes('civilian') || recentContent.includes('rescue')) {
        updatedContext = `The battle rages in New York City. Civilians are in danger and need to be evacuated. The Avengers are fighting to protect the people while dealing with waves of alien attackers. The mothership continues to send reinforcements.`;
      } else if (recentContent.includes('damage') || recentContent.includes('destruction')) {
        updatedContext = `Parts of the city have been damaged by the alien attack. The Avengers are working to contain the destruction while fighting back against the invaders. They need to find a way to stop the aliens before more of the city is destroyed.`;
      }
    } else if (currentArc.currentPhase === 'planning') {
      updatedContext = `The team has gained some ground against the alien forces. Now they need to analyze the aliens' technology and tactics to find a weakness. The mothership remains the primary target, but they need a plan to reach it and shut it down.`;
    } else if (currentArc.currentPhase === 'climax') {
      updatedContext = `The Avengers have identified the aliens' weakness and are preparing for a final assault on the mothership. This will be the decisive battle that determines the fate of New York City and possibly the world.`;
    }
  }
  
  return updatedContext;
};
