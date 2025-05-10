/**
 * Utility functions for interactive story branching
 */

/**
 * Generate story branch options based on the current conversation context
 * 
 * @param {Array} chatHistory - The chat history
 * @param {Object} scenario - The current scenario
 * @param {string} scenarioType - The type of scenario (adventure, mystery, etc.)
 * @returns {Array} - Array of story branch options
 */
export const generateStoryBranches = (chatHistory, scenario, scenarioType = 'adventure') => {
  // Extract recent topics and themes from chat history
  const recentMessages = chatHistory.slice(-5);
  const recentTopics = extractTopicsFromMessages(recentMessages);
  
  // Generate branches based on scenario type
  switch (scenarioType.toLowerCase()) {
    case 'adventure':
      return generateAdventureBranches(recentTopics, scenario);
    case 'mystery':
      return generateMysteryBranches(recentTopics, scenario);
    case 'romance':
      return generateRomanceBranches(recentTopics, scenario);
    case 'fantasy':
      return generateFantasyBranches(recentTopics, scenario);
    case 'scifi':
      return generateSciFiBranches(recentTopics, scenario);
    case 'horror':
      return generateHorrorBranches(recentTopics, scenario);
    default:
      return generateGenericBranches(recentTopics, scenario);
  }
};

/**
 * Extract topics from recent messages
 * 
 * @param {Array} messages - Recent chat messages
 * @returns {Array} - Array of topics
 */
const extractTopicsFromMessages = (messages) => {
  const topics = [];
  
  // Extract text content from messages
  const messageTexts = messages
    .filter(msg => !msg.system && msg.message)
    .map(msg => msg.message);
  
  // Simple keyword extraction (could be enhanced with NLP in a real implementation)
  const stopWords = ['the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'with', 'about', 'is', 'are', 'was', 'were'];
  
  messageTexts.forEach(text => {
    // Remove action markers
    const cleanText = text.replace(/\*.*?\*/g, '');
    
    // Split into words and filter out stop words
    const words = cleanText.toLowerCase().split(/\s+/);
    const filteredWords = words.filter(word => !stopWords.includes(word) && word.length > 3);
    
    // Add to topics
    topics.push(...filteredWords);
  });
  
  // Return unique topics
  return [...new Set(topics)];
};

/**
 * Generate adventure-themed story branches
 * 
 * @param {Array} topics - Recent topics from the conversation
 * @param {Object} scenario - The current scenario
 * @returns {Array} - Array of story branch options
 */
const generateAdventureBranches = (topics, scenario) => {
  const branches = [
    "A hidden door suddenly reveals itself in the wall, offering a new path forward.",
    "The ground begins to shake, and cracks appear in the floor, forcing everyone to find stable ground.",
    "A mysterious stranger approaches, offering vital information in exchange for a favor.",
    "A loud explosion in the distance draws everyone's attention, suggesting trouble ahead.",
    "An ancient artifact begins to glow, revealing previously invisible markings or pathways.",
    "A messenger arrives with an urgent letter that changes the group's priorities.",
    "The weather suddenly shifts dramatically, creating new challenges for the journey.",
    "A creature or vehicle appears, offering a faster way to travel to the destination.",
    "A rival group is spotted nearby, raising questions about their intentions.",
    "One character discovers they've been carrying an important item without realizing its significance."
  ];
  
  // If we have topics, try to incorporate them into some branches
  if (topics.length > 0) {
    const topic1 = topics[Math.floor(Math.random() * topics.length)];
    const topic2 = topics.length > 1 
      ? topics[Math.floor(Math.random() * topics.length)] 
      : topic1;
    
    // Add topic-specific branches
    branches.push(
      `A local inhabitant recognizes the group and shares crucial information about ${topic1}.`,
      `An unexpected obstacle related to ${topic1} blocks the path forward, requiring a creative solution.`,
      `A mysterious map is discovered, showing the location of a legendary ${topic2}.`
    );
  }
  
  // Shuffle and return 3 options
  return shuffleArray(branches).slice(0, 3);
};

/**
 * Generate mystery-themed story branches
 * 
 * @param {Array} topics - Recent topics from the conversation
 * @param {Object} scenario - The current scenario
 * @returns {Array} - Array of story branch options
 */
const generateMysteryBranches = (topics, scenario) => {
  const branches = [
    "A previously overlooked clue is discovered, changing the understanding of the case.",
    "A witness comes forward with new information that contradicts earlier testimony.",
    "A suspect's alibi suddenly falls apart when new evidence emerges.",
    "A mysterious phone call provides cryptic information about the case.",
    "Someone attempts to destroy evidence, suggesting they have something to hide.",
    "A seemingly unrelated event is revealed to be connected to the main mystery.",
    "A hidden room or compartment is discovered, containing unexpected items.",
    "An expert consultant provides insight that reframes the entire investigation.",
    "A deadline is suddenly imposed, adding time pressure to solve the case.",
    "A key character goes missing, raising questions about their involvement or safety."
  ];
  
  // If we have topics, try to incorporate them into some branches
  if (topics.length > 0) {
    const topic1 = topics[Math.floor(Math.random() * topics.length)];
    const topic2 = topics.length > 1 
      ? topics[Math.floor(Math.random() * topics.length)] 
      : topic1;
    
    // Add topic-specific branches
    branches.push(
      `A journal is found with entries about ${topic1}, providing new insights.`,
      `Security footage reveals unexpected activity related to ${topic1}.`,
      `An anonymous informant leaves a message warning about ${topic2}.`
    );
  }
  
  // Shuffle and return 3 options
  return shuffleArray(branches).slice(0, 3);
};

/**
 * Generate romance-themed story branches
 * 
 * @param {Array} topics - Recent topics from the conversation
 * @param {Object} scenario - The current scenario
 * @returns {Array} - Array of story branch options
 */
const generateRomanceBranches = (topics, scenario) => {
  const branches = [
    "A chance encounter brings the characters to a romantic setting they hadn't planned to visit.",
    "A misunderstanding creates tension that must be resolved through honest communication.",
    "A mutual friend reveals information that changes how the characters see each other.",
    "An unexpected gift expresses feelings that haven't been put into words.",
    "A storm forces the characters to seek shelter together, creating an intimate moment.",
    "A competition or challenge brings out new sides of the characters' personalities.",
    "A past relationship resurfaces, creating complications or jealousy.",
    "A shared interest or hobby creates a deeper connection between the characters.",
    "A moment of vulnerability reveals deeper feelings than previously expressed.",
    "An opportunity arises that would separate the characters, testing their commitment."
  ];
  
  // If we have topics, try to incorporate them into some branches
  if (topics.length > 0) {
    const topic1 = topics[Math.floor(Math.random() * topics.length)];
    const topic2 = topics.length > 1 
      ? topics[Math.floor(Math.random() * topics.length)] 
      : topic1;
    
    // Add topic-specific branches
    branches.push(
      `A conversation about ${topic1} leads to a surprising revelation about shared values.`,
      `A disagreement about ${topic1} tests the relationship but offers growth.`,
      `A special event related to ${topic2} creates an opportunity for a meaningful moment.`
    );
  }
  
  // Shuffle and return 3 options
  return shuffleArray(branches).slice(0, 3);
};

/**
 * Generate fantasy-themed story branches
 * 
 * @param {Array} topics - Recent topics from the conversation
 * @param {Object} scenario - The current scenario
 * @returns {Array} - Array of story branch options
 */
const generateFantasyBranches = (topics, scenario) => {
  const branches = [
    "A magical portal opens unexpectedly, offering passage to an unknown realm.",
    "An ancient prophecy is recalled that seems to describe the current situation.",
    "A mythical creature appears, either as a guide or a challenge to overcome.",
    "A character discovers latent magical abilities triggered by the current circumstances.",
    "A magical item changes properties, revealing new powers or purposes.",
    "The laws of magic suddenly shift in the area, causing unpredictable effects.",
    "A spirit or deity makes contact, offering guidance or making demands.",
    "A curse or blessing is activated, affecting one or more characters.",
    "A magical barrier appears or disappears, changing what paths are available.",
    "Signs of ancient magic begin to manifest, transforming the environment."
  ];
  
  // If we have topics, try to incorporate them into some branches
  if (topics.length > 0) {
    const topic1 = topics[Math.floor(Math.random() * topics.length)];
    const topic2 = topics.length > 1 
      ? topics[Math.floor(Math.random() * topics.length)] 
      : topic1;
    
    // Add topic-specific branches
    branches.push(
      `An enchanted object related to ${topic1} reveals its true nature.`,
      `A magical transformation occurs, changing something ordinary about ${topic1} into something extraordinary.`,
      `Ancient runes begin to glow, revealing secrets about ${topic2}.`
    );
  }
  
  // Shuffle and return 3 options
  return shuffleArray(branches).slice(0, 3);
};

/**
 * Generate sci-fi-themed story branches
 * 
 * @param {Array} topics - Recent topics from the conversation
 * @param {Object} scenario - The current scenario
 * @returns {Array} - Array of story branch options
 */
const generateSciFiBranches = (topics, scenario) => {
  const branches = [
    "A system malfunction creates a new threat or opportunity that must be addressed.",
    "Unusual readings are detected, suggesting an anomaly that requires investigation.",
    "A distress signal is received from an unexpected source.",
    "A previously unknown technology is discovered that could change everything.",
    "A temporal distortion creates confusion about what is happening when.",
    "Contact is made with a new alien species or artificial intelligence.",
    "A power surge or failure forces immediate adaptation to limited resources.",
    "Classified information is leaked or discovered, revealing hidden agendas.",
    "A scientific breakthrough occurs that challenges existing understanding.",
    "A quarantine protocol is activated, restricting movement or communication."
  ];
  
  // If we have topics, try to incorporate them into some branches
  if (topics.length > 0) {
    const topic1 = topics[Math.floor(Math.random() * topics.length)];
    const topic2 = topics.length > 1 
      ? topics[Math.floor(Math.random() * topics.length)] 
      : topic1;
    
    // Add topic-specific branches
    branches.push(
      `A scan reveals unusual properties about ${topic1} that weren't apparent before.`,
      `A holographic projection appears, displaying information about ${topic1}.`,
      `An AI analysis suggests an unexpected connection between current events and ${topic2}.`
    );
  }
  
  // Shuffle and return 3 options
  return shuffleArray(branches).slice(0, 3);
};

/**
 * Generate horror-themed story branches
 * 
 * @param {Array} topics - Recent topics from the conversation
 * @param {Object} scenario - The current scenario
 * @returns {Array} - Array of story branch options
 */
const generateHorrorBranches = (topics, scenario) => {
  const branches = [
    "Strange noises begin emanating from a location that should be empty.",
    "The lights flicker and fail, plunging the area into darkness.",
    "A door that was definitely locked is found standing open.",
    "Personal items are discovered moved or altered when no one was watching.",
    "Unexplainable cold spots develop in the area, causing visible breath even indoors.",
    "Writing or symbols appear on surfaces that were previously blank.",
    "Electronic devices malfunction, displaying disturbing images or messages.",
    "A character experiences a vivid vision or nightmare that feels prophetic.",
    "Blood or a similar substance is discovered with no apparent source.",
    "Someone or something is glimpsed just at the edge of vision, but disappears when looked at directly."
  ];
  
  // If we have topics, try to incorporate them into some branches
  if (topics.length > 0) {
    const topic1 = topics[Math.floor(Math.random() * topics.length)];
    const topic2 = topics.length > 1 
      ? topics[Math.floor(Math.random() * topics.length)] 
      : topic1;
    
    // Add topic-specific branches
    branches.push(
      `A disturbing discovery related to ${topic1} raises new fears.`,
      `Whispers can be heard mentioning ${topic1} when no one is around.`,
      `An old photograph is found showing something impossible involving ${topic2}.`
    );
  }
  
  // Shuffle and return 3 options
  return shuffleArray(branches).slice(0, 3);
};

/**
 * Generate generic story branches for any scenario type
 * 
 * @param {Array} topics - Recent topics from the conversation
 * @param {Object} scenario - The current scenario
 * @returns {Array} - Array of story branch options
 */
const generateGenericBranches = (topics, scenario) => {
  const branches = [
    "An unexpected visitor arrives, bringing news that changes the situation.",
    "A previously unknown connection between characters is revealed.",
    "A sudden change in weather or environment creates new challenges.",
    "A valuable item goes missing, requiring attention to recover it.",
    "A misunderstanding leads to tension that needs to be resolved.",
    "An opportunity presents itself that wasn't available before.",
    "A deadline or time constraint is introduced, adding urgency.",
    "A character reveals a hidden skill or knowledge relevant to the situation.",
    "A minor event triggers a chain reaction with significant consequences.",
    "A choice must be made between two equally important priorities."
  ];
  
  // If we have topics, try to incorporate them into some branches
  if (topics.length > 0) {
    const topic1 = topics[Math.floor(Math.random() * topics.length)];
    const topic2 = topics.length > 1 
      ? topics[Math.floor(Math.random() * topics.length)] 
      : topic1;
    
    // Add topic-specific branches
    branches.push(
      `New information about ${topic1} comes to light, changing perspectives.`,
      `A surprising development related to ${topic1} requires immediate attention.`,
      `A decision about ${topic2} must be made that will affect everyone involved.`
    );
  }
  
  // Shuffle and return 3 options
  return shuffleArray(branches).slice(0, 3);
};

/**
 * Generate environmental events based on scenario type and current context
 * 
 * @param {Array} chatHistory - The chat history
 * @param {Object} scenario - The current scenario
 * @param {string} scenarioType - The type of scenario (adventure, mystery, etc.)
 * @param {boolean} isMajorEvent - Whether this should be a major event (more impactful)
 * @returns {string} - A description of the environmental event
 */
export const generateEnvironmentalEvent = (chatHistory, scenario, scenarioType = 'adventure', isMajorEvent = false) => {
  // Extract recent topics from chat history
  const recentMessages = chatHistory.slice(-5);
  const recentTopics = extractTopicsFromMessages(recentMessages);
  
  // Select appropriate event pool based on scenario type
  let eventPool;
  
  switch (scenarioType.toLowerCase()) {
    case 'adventure':
      eventPool = isMajorEvent ? majorAdventureEvents : minorAdventureEvents;
      break;
    case 'mystery':
      eventPool = isMajorEvent ? majorMysteryEvents : minorMysteryEvents;
      break;
    case 'fantasy':
      eventPool = isMajorEvent ? majorFantasyEvents : minorFantasyEvents;
      break;
    case 'scifi':
      eventPool = isMajorEvent ? majorSciFiEvents : minorSciFiEvents;
      break;
    case 'horror':
      eventPool = isMajorEvent ? majorHorrorEvents : minorHorrorEvents;
      break;
    default:
      eventPool = isMajorEvent ? majorGenericEvents : minorGenericEvents;
  }
  
  // Select a random event
  const event = eventPool[Math.floor(Math.random() * eventPool.length)];
  
  // If we have topics and it's a major event, try to incorporate a topic
  if (isMajorEvent && topics.length > 0 && Math.random() > 0.5) {
    const topic = topics[Math.floor(Math.random() * topics.length)];
    return event.replace('{{topic}}', topic);
  }
  
  // Return the event, removing any topic placeholders
  return event.replace('{{topic}}', 'the situation');
};

// Minor environmental events by scenario type
const minorAdventureEvents = [
  "A gentle rain begins to fall, creating a soothing rhythm on the surroundings.",
  "The wind picks up, rustling leaves and carrying distant sounds.",
  "Clouds shift overhead, changing the patterns of light and shadow.",
  "The temperature noticeably shifts, becoming warmer or cooler.",
  "Wildlife becomes more active nearby, creating a chorus of natural sounds.",
  "The path ahead changes, becoming steeper, narrower, or wider.",
  "The scent in the air changes, carrying hints of flowers, earth, or water.",
  "Distant sounds can be heard - perhaps voices, animals, or natural phenomena.",
  "The quality of light changes as the sun's position shifts in the sky.",
  "Small obstacles appear that require minor adjustments to navigate."
];

const minorMysteryEvents = [
  "A shadow moves across the wall in a way that doesn't match any visible source.",
  "A door creaks open or closed without anyone touching it.",
  "Papers or small objects seem to have been moved when no one was looking.",
  "A clock ticks unusually loudly, drawing attention to the passage of time.",
  "A photograph or painting seems to show details that weren't noticed before.",
  "The temperature in the room subtly changes, becoming warmer or cooler.",
  "A faint, unidentifiable sound can be heard just at the edge of perception.",
  "A light flickers briefly, creating momentary shadows.",
  "A familiar scent wafts through the air, triggering memories or associations.",
  "A reflection in a mirror or window doesn't quite match what it should show."
];

const minorFantasyEvents = [
  "Tiny magical lights appear briefly, floating in the air like fireflies.",
  "Plants seem to respond to the conversation, subtly turning or growing.",
  "The colors in the environment become slightly more vivid or muted.",
  "Small magical creatures can be glimpsed darting about at the edge of vision.",
  "Runes or symbols briefly glow on nearby surfaces.",
  "The air shimmers with barely visible magical energy.",
  "Sounds have a slightly ethereal quality, as if coming from far away.",
  "Small objects float momentarily before settling back down.",
  "Shadows move in ways that don't match their sources.",
  "The scent of exotic spices or flowers fills the air briefly."
];

const minorSciFiEvents = [
  "Lights on nearby technology blink in unusual patterns.",
  "A brief power fluctuation causes screens or displays to flicker.",
  "Ambient background noise from machinery changes pitch or rhythm.",
  "A holographic display glitches momentarily, showing unexpected data.",
  "Communication devices pick up static or fragments of unrelated transmissions.",
  "Environmental controls adjust, changing temperature, lighting, or air flow.",
  "Automated systems run a brief diagnostic sequence with visible indicators.",
  "Distant mechanical sounds suggest activity in other areas of the facility.",
  "Sensors display unusual readings that quickly return to normal.",
  "Artificial gravity or atmospheric pressure subtly shifts before stabilizing."
];

const minorHorrorEvents = [
  "Shadows seem to deepen in corners, making the room feel smaller.",
  "A cold draft passes through the area, raising goosebumps.",
  "Lights dim slightly, creating more areas of shadow.",
  "A faint scratching sound comes from inside the walls or ceiling.",
  "A door slowly creaks without any visible cause.",
  "Objects seem to be slightly out of place from where they were left.",
  "Reflective surfaces briefly show something that isn't there.",
  "The scent of something unpleasant wafts through the air momentarily.",
  "A floorboard creaks as if someone stepped on it, but no one is there.",
  "Electronic devices briefly malfunction or display static."
];

const minorGenericEvents = [
  "The lighting changes as clouds pass overhead or lights adjust.",
  "A gentle breeze passes through the area, stirring papers or hair.",
  "Distant sounds can be heard - voices, traffic, or nature.",
  "The temperature shifts slightly, becoming warmer or cooler.",
  "A clock ticks or chimes, drawing attention to the passage of time.",
  "Someone passes by outside, briefly visible through a window.",
  "A phone or device makes a notification sound in the distance.",
  "The scent in the air changes - food, perfume, or the outdoors.",
  "Furniture creaks as someone shifts position.",
  "A pet or small animal makes its presence known nearby."
];

// Major environmental events by scenario type
const majorAdventureEvents = [
  "A violent storm erupts suddenly, forcing everyone to seek shelter immediately.",
  "The ground shakes in a tremor, causing loose objects to fall and creating new obstacles.",
  "A landslide or avalanche blocks the path ahead, requiring a new route to be found.",
  "A flash flood surges through the area, threatening to sweep away people and equipment.",
  "A fire breaks out nearby, creating danger and urgency to either fight it or flee.",
  "A wild animal or creature appears, clearly agitated and potentially dangerous.",
  "The bridge or path ahead collapses, creating a significant obstacle to progress.",
  "A thick fog rolls in, drastically reducing visibility and making navigation difficult.",
  "A rival group or enemy force is spotted approaching, requiring immediate decisions.",
  "An urgent message arrives about {{topic}}, demanding immediate attention or action."
];

const majorMysteryEvents = [
  "A power outage plunges the area into darkness, affecting electronic devices and security systems.",
  "A previously locked door is found wide open, with signs of forced entry.",
  "A crucial piece of evidence is discovered to be missing or tampered with.",
  "An unexpected witness arrives with information that changes the understanding of {{topic}}.",
  "Authorities or other investigators arrive, creating time pressure to solve the case.",
  "A threatening message is received, warning against further investigation of {{topic}}.",
  "A suspect attempts to flee, suggesting guilt or fear.",
  "A hidden room or compartment is discovered, containing unexpected items related to {{topic}}.",
  "Security footage reveals someone was present at a critical time who shouldn't have been there.",
  "A seemingly unrelated crime or incident is discovered to be connected to the main case."
];

const majorFantasyEvents = [
  "A magical portal opens unexpectedly, leading to an unknown destination.",
  "A powerful magical artifact activates, causing dramatic effects in the surrounding area.",
  "The laws of magic suddenly shift, causing spells to fail or have unpredictable effects.",
  "A powerful magical creature appears, either as a threat or with an important message.",
  "The environment transforms magically, changing terrain, weather, or other conditions.",
  "A curse or blessing is triggered, affecting one or more characters significantly.",
  "A prophecy begins to unfold, with clear signs relating to present circumstances.",
  "A magical barrier appears or falls, changing what areas are accessible.",
  "A deity or powerful entity makes contact, offering a quest or making demands.",
  "A magical conflict erupts nearby, with dangerous energies affecting the surrounding area."
];

const majorSciFiEvents = [
  "A critical system failure occurs, threatening life support or other essential functions.",
  "An alien or artificial intelligence makes unexpected contact with a message about {{topic}}.",
  "A security breach is detected, with unknown entities gaining access to restricted areas.",
  "A temporal anomaly creates confusion about the sequence of events or duplicates objects.",
  "Radiation or another hazardous condition is detected, requiring immediate countermeasures.",
  "A previously unknown technology activates, with powerful and unpredictable effects.",
  "A quarantine protocol is initiated, restricting movement and communication.",
  "A spacecraft or vehicle arrives unexpectedly, carrying unknown passengers or cargo.",
  "A virtual reality or simulation glitches severely, blurring the line between real and artificial.",
  "An experimental technology malfunctions, creating a dangerous situation related to {{topic}}."
];

const majorHorrorEvents = [
  "The building shakes violently as if something massive is moving within the walls.",
  "All lights fail simultaneously, plunging the area into complete darkness.",
  "A horrific sound—like screaming or inhuman wailing—echoes through the area.",
  "Blood or a similar substance begins seeping from walls, ceiling, or objects.",
  "Temperature plummets dramatically, creating visible breath and freezing surfaces.",
  "Doors slam and lock or unlock themselves in rapid succession.",
  "A grotesque figure is clearly visible for a moment before vanishing.",
  "Objects fly across the room as if thrown by an invisible force.",
  "Writing appears on walls or surfaces, with disturbing messages about {{topic}}.",
  "Electronic devices all activate simultaneously, displaying disturbing images or playing unsettling sounds."
];

const majorGenericEvents = [
  "A severe weather event begins, affecting travel and communication.",
  "An urgent news bulletin interrupts, announcing a significant event related to {{topic}}.",
  "A power outage or technical failure affects essential systems or services.",
  "An unexpected visitor arrives with urgent information or requests.",
  "A medical or personal emergency occurs, requiring immediate attention.",
  "A conflict erupts nearby, creating potential danger or complications.",
  "A valuable item is discovered to be missing or damaged.",
  "A deadline is suddenly moved up, creating time pressure to complete tasks.",
  "Transportation issues arise, affecting ability to leave or access the area.",
  "A communication arrives that significantly changes plans or priorities regarding {{topic}}."
];

/**
 * Shuffle an array randomly
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
