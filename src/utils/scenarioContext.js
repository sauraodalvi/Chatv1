/**
 * Utility functions for maintaining and using scenario context in chat responses
 */

/**
 * Extract key elements from a scenario prompt
 * @param {string} scenarioPrompt - The full scenario prompt
 * @returns {Object} - Extracted scenario elements
 */
export const extractScenarioElements = (scenarioPrompt) => {
  if (!scenarioPrompt) return {};
  
  // Default elements
  const elements = {
    setting: '',
    time: '',
    weather: '',
    mood: '',
    relationships: [],
    conflict: '',
    goals: []
  };
  
  // Extract setting (location)
  const settingMatches = scenarioPrompt.match(/(?:in|at|near|inside|outside|within) (?:the |a |an )?([\w\s\-']+(?:castle|forest|city|town|village|house|mansion|palace|temple|cave|dungeon|ship|space station|laboratory|office|school|university|hospital|cafe|restaurant|bar|tavern|inn|hotel|apartment|room|hall|chamber|kingdom|realm|dimension|world|planet|galaxy|universe))/gi);
  if (settingMatches && settingMatches.length > 0) {
    elements.setting = settingMatches[0].trim();
  }
  
  // Extract time of day
  const timeMatches = scenarioPrompt.match(/(?:morning|afternoon|evening|night|dawn|dusk|midnight|daybreak|sunset|sunrise|daylight|darkness)/gi);
  if (timeMatches && timeMatches.length > 0) {
    elements.time = timeMatches[0].trim();
  }
  
  // Extract weather
  const weatherMatches = scenarioPrompt.match(/(?:sunny|cloudy|rainy|stormy|foggy|snowy|windy|clear|overcast|thunderstorm|blizzard|heatwave|humid|dry|cold|warm|hot|freezing)/gi);
  if (weatherMatches && weatherMatches.length > 0) {
    elements.weather = weatherMatches[0].trim();
  }
  
  // Extract mood/atmosphere
  const moodMatches = scenarioPrompt.match(/(?:tense|peaceful|mysterious|exciting|melancholic|joyful|anxious|fearful|hopeful|desperate|chaotic|serene|ominous|cheerful|gloomy|eerie|magical|dangerous|safe|hostile|friendly|welcoming|threatening)/gi);
  if (moodMatches && moodMatches.length > 0) {
    elements.mood = moodMatches[0].trim();
  }
  
  // Extract relationships
  const relationshipMatches = scenarioPrompt.match(/(?:friends|enemies|rivals|allies|family|colleagues|strangers|lovers|partners|teammates|classmates|neighbors|acquaintances|siblings|parent|child|mentor|student|teacher|boss|employee|leader|follower)/gi);
  if (relationshipMatches) {
    elements.relationships = relationshipMatches;
  }
  
  // Extract conflict
  const conflictMatches = scenarioPrompt.match(/(?:conflict|problem|challenge|obstacle|threat|danger|crisis|dilemma|struggle|quest|mission|task|goal|objective|puzzle|mystery|secret|betrayal|deception|misunderstanding|disagreement|argument|fight|battle|war|competition|race|contest|rivalry)/gi);
  if (conflictMatches && conflictMatches.length > 0) {
    elements.conflict = conflictMatches[0].trim();
  }
  
  return elements;
};

/**
 * Generate a response that references the scenario context
 * @param {Object} character - The character object
 * @param {string} scenarioPrompt - The scenario prompt
 * @param {string} message - The message to respond to
 * @returns {string} - A scenario-relevant response
 */
export const generateScenarioResponse = (character, scenarioPrompt, message) => {
  if (!scenarioPrompt) return null;
  
  const elements = extractScenarioElements(scenarioPrompt);
  const { type, mood, name } = character;
  
  // Create scenario-specific templates based on character type and scenario elements
  const templates = [];
  
  // Setting-based templates
  if (elements.setting) {
    templates.push(
      `*glancing around ${elements.setting}* This place reminds me of something important. ${message.length > 20 ? "But regarding what you said about " + message.substring(0, 20) + "..." : "What were you saying?"}`,
      `*taking in the surroundings of ${elements.setting}* Being here changes how I see things. ${message.length > 20 ? "Especially concerning " + message.substring(0, 20) + "..." : ""}`,
      `The atmosphere of ${elements.setting} makes me think differently about what you're saying.`
    );
  }
  
  // Time-based templates
  if (elements.time) {
    templates.push(
      `*noticing the ${elements.time} light* At this hour, everything feels different. Your words carry more weight.`,
      `There's something about ${elements.time} that makes conversations like this more meaningful.`,
      `*gesturing to the ${elements.time} sky* This time of day always makes me more ${mood.toLowerCase() || 'thoughtful'} about such matters.`
    );
  }
  
  // Weather-based templates
  if (elements.weather) {
    templates.push(
      `*feeling the ${elements.weather} conditions* Weather like this always affects my thoughts on such matters.`,
      `The ${elements.weather} weather seems fitting for this conversation, doesn't it?`,
      `*adjusting to the ${elements.weather} conditions* In weather like this, I tend to be more direct. So let me tell you what I really think...`
    );
  }
  
  // Mood/atmosphere-based templates
  if (elements.mood) {
    templates.push(
      `The ${elements.mood} atmosphere makes me consider your words more carefully.`,
      `*sensing the ${elements.mood} mood* In moments like this, I find myself being more honest than usual.`,
      `There's a ${elements.mood} feeling in the air that's influencing how I respond to you.`
    );
  }
  
  // Conflict-based templates
  if (elements.conflict) {
    templates.push(
      `With this ${elements.conflict} looming over us, I find your perspective particularly interesting.`,
      `*thinking about the ${elements.conflict}* This situation forces us to reconsider everything, including what you just said.`,
      `Given the ${elements.conflict} we're facing, I think we need to approach this conversation differently.`
    );
  }
  
  // Relationship-based templates
  if (elements.relationships.length > 0) {
    const relationship = elements.relationships[0];
    templates.push(
      `As ${relationship}, we should be honest with each other about these matters.`,
      `Our relationship as ${relationship} gives me a unique perspective on what you're saying.`,
      `*considering our status as ${relationship}* This dynamic between us colors everything we discuss.`
    );
  }
  
  // Character type-specific scenario templates
  switch (type) {
    case 'fantasy':
      templates.push(
        `*eyes glowing faintly* The magical energies in this scenario are affecting my perception of your words.`,
        `*gesturing mystically* In a world of magic and wonder, conversations like this take on new meaning.`,
        `*whispering ancient words* The arcane forces at play here influence how I must respond to you.`
      );
      break;
    case 'scifi':
      templates.push(
        `*checking wrist device* My sensors are detecting unusual patterns in this scenario that relate to our conversation.`,
        `*eyes flickering with data* The technological implications of this situation affect my analysis of your statement.`,
        `*adjusting neural interface* In this advanced setting, your words carry additional significance.`
      );
      break;
    case 'historical':
      templates.push(
        `*adjusting period attire* In times like these, one must consider tradition when responding to such matters.`,
        `*referencing historical context* The customs of this era influence how I must address your statement.`,
        `*speaking with period-appropriate formality* The historical significance of our situation colors my response.`
      );
      break;
    case 'combat':
      templates.push(
        `*shifting into a tactical stance* In battle conditions like these, your words take on strategic importance.`,
        `*assessing tactical advantages* This combat situation requires me to be direct about your statement.`,
        `*hand resting on weapon* The threat of conflict makes me consider your words more carefully.`
      );
      break;
    default:
      templates.push(
        `*considering the unique circumstances* This situation gives me a new perspective on what you're saying.`,
        `*taking in the environment* The context of our meeting influences my thoughts on this matter.`,
        `*reflecting thoughtfully* Given where we are and what we're facing, I see your point differently.`
      );
  }
  
  // Select a random template
  const template = templates[Math.floor(Math.random() * templates.length)];
  
  return template;
};

/**
 * Generate a combat-specific response that references the scenario
 * @param {Object} character - The character object
 * @param {string} scenarioPrompt - The scenario prompt
 * @param {string} message - The message to respond to
 * @returns {string} - A combat-relevant response
 */
export const generateCombatResponse = (character, scenarioPrompt, message) => {
  const { name, type } = character;
  
  const combatTemplates = [
    `*shifting into a fighting stance, eyes narrowing* If it's a fight you want, I'm more than ready. *${type === 'fantasy' ? 'magical energy crackles around my hands' : type === 'scifi' ? 'activates combat systems' : 'muscles tense, ready to strike'}*`,
    
    `*moving with practiced precision, ${type === 'fantasy' ? 'drawing a glowing rune in the air' : type === 'scifi' ? 'calibrating targeting systems' : 'reaching for my weapon'}* I've faced worse threats than this. Let's see what you're capable of.`,
    
    `*analyzing the tactical situation, ${type === 'fantasy' ? 'channeling arcane power' : type === 'scifi' ? 'scanning for weaknesses' : 'looking for environmental advantages'}* A direct confrontation isn't always the wisest choice, but I'm prepared if necessary.`,
    
    `*${type === 'fantasy' ? 'muttering an ancient incantation' : type === 'scifi' ? 'activating defensive shields' : 'adopting a defensive posture'}* Violence should be the last resort, but I won't hesitate to defend myself if pushed.`,
    
    `*eyes flashing with ${type === 'fantasy' ? 'magical energy' : type === 'scifi' ? 'targeting data' : 'determination'}* I've been in countless battles before. This one won't end any differently for my opponents.`
  ];
  
  return combatTemplates[Math.floor(Math.random() * combatTemplates.length)];
};

/**
 * Generate a response that references character relationships in the scenario
 * @param {Object} character - The character object
 * @param {Object} targetCharacter - The character being responded to
 * @param {string} scenarioPrompt - The scenario prompt
 * @returns {string} - A relationship-focused response
 */
export const generateRelationshipResponse = (character, targetCharacter, scenarioPrompt) => {
  const { name: charName, type: charType } = character;
  const { name: targetName, type: targetType } = targetCharacter;
  
  // Extract relationship hints from scenario
  const elements = extractScenarioElements(scenarioPrompt);
  const relationship = elements.relationships.length > 0 ? elements.relationships[0] : null;
  
  const relationshipTemplates = [
    `*looking directly at ${targetName}, ${charType === 'fantasy' ? 'a faint aura connecting us' : charType === 'scifi' ? 'biometric readings spiking' : 'expression softening slightly'}* Our history together gives me a unique perspective on what you're saying.`,
    
    `*${charType === 'fantasy' ? 'sensing the magical bond between us' : charType === 'scifi' ? 'accessing relationship protocols' : 'recalling our shared experiences'}* ${targetName}, you and I have been through enough together that I can speak frankly about this.`,
    
    `*${relationship ? `acknowledging our status as ${relationship}` : 'considering our complex relationship'}* ${targetName}, the dynamic between us colors everything we discuss.`,
    
    `*${charType === 'fantasy' ? 'feeling the threads of fate that bind us' : charType === 'scifi' ? 'analyzing our interaction patterns' : 'reflecting on our connection'}* There's a reason our paths keep crossing, ${targetName}. Perhaps it relates to this very conversation.`,
    
    `*${charType === 'fantasy' ? 'mystical energies swirling between us' : charType === 'scifi' ? 'relationship algorithms processing' : 'expression revealing deeper emotions'}* ${targetName}, given our history, I think we both know what needs to be said here.`
  ];
  
  return relationshipTemplates[Math.floor(Math.random() * relationshipTemplates.length)];
};
