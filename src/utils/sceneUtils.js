/**
 * Utility functions for generating scene descriptions and environmental cues
 */

// Track the last scene description type to ensure rotation
let lastSceneDescriptionType = 'action'; // Start with action so first one will be environment

/**
 * Generate a scene description or action cue based on the current context
 *
 * @param {Object} character - The character who will be speaking
 * @param {Object} storyArc - The current story arc
 * @param {Array} recentMessages - Recent messages for context
 * @param {string} messageType - Type of message (response, action, etc.)
 * @returns {string} - A scene description or action cue
 */
export const generateSceneDescription = (character, storyArc, recentMessages = [], messageType = 'response') => {
  if (!character || !storyArc) return '';

  const { theme, currentPhase, currentTension } = storyArc;
  const characterName = character.name;
  const characterType = character.type || 'general';

  // Get the most recent non-user message for context
  const lastMessage = recentMessages.filter(msg => !msg.isUser).slice(-1)[0];

  // Rotate between different types of scene descriptions
  // This ensures variety and prevents stacking multiple descriptions
  let descriptionType;

  if (messageType === 'action') {
    // For explicit action messages, always use character actions
    descriptionType = 'action';
  } else {
    // Otherwise rotate between environment, plot beat, and character action
    if (lastSceneDescriptionType === 'action') {
      descriptionType = 'environment';
    } else if (lastSceneDescriptionType === 'environment') {
      descriptionType = 'plot';
    } else {
      descriptionType = 'action';
    }

    // Override for high tension situations - prefer action descriptions
    if (currentTension === 'high' || currentTension === 'very high') {
      // 70% chance to use action during high tension
      if (Math.random() < 0.7) {
        descriptionType = 'action';
      }
    }

    // Save for next rotation
    lastSceneDescriptionType = descriptionType;
  }

  // Environmental descriptions based on theme
  const environmentalCues = {
    superhero: {
      introduction: [
        "Sirens wail in the distance.",
        "Civilians watch nervously from behind police barriers.",
        "News helicopters circle overhead.",
        "The city skyline looms against darkening clouds.",
        "Emergency services rush to evacuate the area."
      ],
      conflict: [
        "Explosions rock the ground.",
        "Debris rains down from damaged buildings.",
        "Smoke billows across the battlefield.",
        "Energy blasts illuminate the chaos.",
        "The sound of combat echoes through the streets."
      ],
      planning: [
        "Holographic displays show enemy positions.",
        "Maps and tactical data cover the table.",
        "Communication devices buzz with urgent updates.",
        "The team gathers in a momentary lull.",
        "Surveillance footage reveals enemy movements."
      ],
      climax: [
        "The final confrontation looms.",
        "Time is running out.",
        "The fate of the city hangs in the balance.",
        "The enemy's ultimate weapon powers up.",
        "This is the moment everything has led to."
      ],
      resolution: [
        "Dust settles over the battlefield.",
        "The first rays of sunlight break through.",
        "Civilians emerge from shelter, looking hopeful.",
        "Emergency crews begin the cleanup.",
        "The city stands, battered but unbroken."
      ]
    },
    fantasy: {
      introduction: [
        "Torches flicker in the ancient hall.",
        "The forest whispers with unseen movement.",
        "Mist curls around gnarled tree roots.",
        "The tavern hums with hushed conversations.",
        "Ancient runes glow faintly on stone walls."
      ],
      discovery: [
        "A hidden doorway reveals itself.",
        "Ancient texts hold forgotten secrets.",
        "Magic tingles in the air.",
        "Mysterious tracks lead deeper into the unknown.",
        "Artifacts pulse with dormant power."
      ],
      conflict: [
        "Dark magic crackles through the air.",
        "Shadows move with unnatural purpose.",
        "The ground trembles beneath an unseen force.",
        "Weapons gleam in the dim light.",
        "The scent of fear and magic mingles."
      ],
      climax: [
        "The ancient prophecy unfolds.",
        "Magical energies reach their peak.",
        "The veil between worlds thins.",
        "Destiny's moment arrives.",
        "The final ritual begins."
      ],
      resolution: [
        "Magic settles like dust in sunlight.",
        "The natural order returns to balance.",
        "Ancient powers return to slumber.",
        "The realm breathes a collective sigh.",
        "New growth emerges from magical soil."
      ]
    },
    scifi: {
      introduction: [
        "Ship systems hum with quiet efficiency.",
        "Stars streak past the viewport.",
        "Holographic displays flicker with data.",
        "The alien atmosphere shimmers with strange colors.",
        "Scanners detect unusual energy signatures."
      ],
      discovery: [
        "Sensors detect an anomalous reading.",
        "The alien artifact pulses with unknown energy.",
        "Encrypted data begins to decode itself.",
        "A previously hidden doorway slides open.",
        "The ship's AI flags a critical discovery."
      ],
      conflict: [
        "Warning lights bathe the corridor in red.",
        "The ship shudders under enemy fire.",
        "Artificial gravity fluctuates momentarily.",
        "Emergency containment fields activate.",
        "Life support systems switch to backup power."
      ],
      climax: [
        "The countdown reaches critical levels.",
        "System failures cascade across all decks.",
        "The alien technology reaches full power.",
        "The fabric of space-time begins to warp.",
        "All escape routes are cut off."
      ],
      resolution: [
        "Systems return to normal operation.",
        "The ship's damage control teams begin repairs.",
        "New star charts are plotted.",
        "The alien technology is safely contained.",
        "Communication channels open with home base."
      ]
    },
    general: {
      introduction: [
        "The conversation begins in earnest.",
        "Attention focuses on the matter at hand.",
        "The atmosphere is charged with possibility.",
        "First impressions form quickly.",
        "The stage is set for what comes next."
      ],
      conflict: [
        "Tension fills the air.",
        "Opposing viewpoints clash.",
        "The stakes suddenly seem higher.",
        "A challenge has been issued.",
        "The easy rapport gives way to friction."
      ],
      resolution: [
        "Understanding dawns gradually.",
        "Common ground is finally found.",
        "The atmosphere lightens noticeably.",
        "A new perspective emerges.",
        "The path forward becomes clear."
      ]
    }
  };

  // Character-specific action cues
  const characterActions = {
    superhero: {
      "Captain America": [
        "*adjusts shield on arm, standing tall*",
        "*scans the battlefield with tactical precision*",
        "*helps a civilian to safety before turning back*",
        "*communicates quickly through team comms*",
        "*takes a defensive stance, shield ready*"
      ],
      "Iron Man": [
        "*HUD displays light up with tactical data*",
        "*repulsors glow as systems power up*",
        "*helmet retracts to reveal a determined expression*",
        "*hovers slightly above ground, surveying the scene*",
        "*runs diagnostics while speaking*"
      ],
      "Thor": [
        "*lightning crackles around Mjolnir*",
        "*cape billows in the wind as he lands*",
        "*looks to the skies, sensing a change*",
        "*twirls hammer with practiced ease*",
        "*voice carries with godly authority*"
      ],
      "Hulk": [
        "*muscles tense, barely containing rage*",
        "*fists clench, creating small tremors*",
        "*growls low, eyes scanning for threats*",
        "*towers over others, protective stance*",
        "*smashes fist into palm for emphasis*"
      ],
      "default": [
        "*powers flare momentarily*",
        "*stands ready for action*",
        "*watches the surroundings with heightened awareness*",
        "*moves with superhuman grace*",
        "*demonstrates abilities briefly*"
      ]
    },
    fantasy: {
      "Elara Moonwhisper": [
        "*silver eyes gleam with ancient wisdom*",
        "*traces magical symbols in the air*",
        "*commune with nature spirits briefly*",
        "*robes shimmer with arcane energy*",
        "*staff glows in response to emotions*"
      ],
      "default": [
        "*ancient power stirs at the words*",
        "*gestures with practiced mystical movements*",
        "*senses shift in magical energies*",
        "*incantation forms on lips*",
        "*connects to the elements around*"
      ]
    },
    scifi: {
      "Commander Zax": [
        "*checks tactical display on wrist computer*",
        "*adjusts environmental suit settings*",
        "*scans surroundings with enhanced vision*",
        "*communicates briefly through neural link*",
        "*weapon systems remain on standby*"
      ],
      "default": [
        "*tech interfaces respond to neural commands*",
        "*scans environment with advanced sensors*",
        "*adjusts to changing atmospheric conditions*",
        "*holographic data appears with a gesture*",
        "*cybernetic enhancements whir quietly*"
      ]
    },
    general: {
      "default": [
        "*expression shifts thoughtfully*",
        "*gestures to emphasize the point*",
        "*pauses to consider the implications*",
        "*moves with deliberate purpose*",
        "*voice carries emotional weight*"
      ]
    }
  };

  // Select appropriate descriptions based on context
  let descriptions;
  let actions;

  // Get environmental cues based on theme and phase
  if (environmentalCues[theme] && environmentalCues[theme][currentPhase]) {
    descriptions = environmentalCues[theme][currentPhase];
  } else if (environmentalCues[theme]) {
    // Fallback to any available phase for this theme
    const availablePhases = Object.keys(environmentalCues[theme]);
    const fallbackPhase = availablePhases[0];
    descriptions = environmentalCues[theme][fallbackPhase];
  } else {
    // Ultimate fallback to general descriptions
    descriptions = environmentalCues.general.introduction;
  }

  // Get character actions based on type and name
  if (characterActions[characterType] && characterActions[characterType][characterName]) {
    actions = characterActions[characterType][characterName];
  } else if (characterActions[characterType]) {
    // Fallback to default actions for this character type
    actions = characterActions[characterType].default;
  } else {
    // Ultimate fallback to general actions
    actions = characterActions.general.default;
  }

  // Select a random description and action
  const description = descriptions[Math.floor(Math.random() * descriptions.length)];
  const action = actions[Math.floor(Math.random() * actions.length)];

  // Plot beat descriptions based on theme and phase
  const plotBeats = {
    superhero: {
      introduction: [
        "The team assembles, ready for action.",
        "A mission briefing appears on the screen.",
        "Satellite imagery reveals enemy positions.",
        "Communications channels open between team members.",
        "Tactical data shows the situation is developing."
      ],
      conflict: [
        "The enemy forces are advancing rapidly.",
        "Civilian evacuation is only 60% complete.",
        "A secondary threat has been detected.",
        "Critical systems are beginning to fail.",
        "Time is running out for a peaceful resolution."
      ],
      planning: [
        "Multiple strategies are being considered.",
        "Intelligence suggests a weakness in the enemy's plan.",
        "A countdown timer appears, showing the deadline.",
        "Resources are being allocated to priority targets.",
        "Backup plans are being prepared in case of failure."
      ],
      climax: [
        "This is the moment everything has led to.",
        "The final confrontation is inevitable now.",
        "All systems are at maximum capacity.",
        "There's no turning back from this point.",
        "The outcome will determine everything."
      ],
      resolution: [
        "The situation is finally under control.",
        "Recovery efforts are already underway.",
        "The cost of victory becomes apparent.",
        "A sense of relief spreads through the area.",
        "The aftermath reveals new challenges ahead."
      ]
    },
    fantasy: {
      introduction: [
        "Ancient prophecies begin to unfold.",
        "Magic stirs in the forgotten places.",
        "Whispers of a coming change spread.",
        "The balance of power shifts subtly.",
        "Signs and portents appear to those who can read them."
      ],
      discovery: [
        "A hidden truth comes to light.",
        "The pieces of the puzzle start to fit together.",
        "An ancient secret reveals itself.",
        "The true nature of the threat becomes clear.",
        "Knowledge long forgotten returns to the world."
      ],
      conflict: [
        "Dark forces gather strength with each passing moment.",
        "The corruption spreads further into the realm.",
        "Allies become harder to distinguish from enemies.",
        "The cost of inaction grows with each passing hour.",
        "The enemy's plan advances despite resistance."
      ],
      climax: [
        "The fate of the realm hangs in the balance.",
        "Ancient powers awaken fully.",
        "The final trial cannot be avoided.",
        "Destiny and choice converge at this moment.",
        "The world holds its breath."
      ],
      resolution: [
        "A new age begins to dawn.",
        "The balance is restored, though changed forever.",
        "Wounds begin to heal, leaving scars as reminders.",
        "Stories of what transpired spread across the land.",
        "Seeds of future conflicts lie dormant in victory."
      ]
    },
    general: {
      introduction: [
        "The situation unfolds gradually.",
        "Initial impressions prove important.",
        "The stage is set for what comes next.",
        "First moves are made carefully.",
        "Opening positions are established."
      ],
      conflict: [
        "Tensions rise as positions harden.",
        "The stakes become increasingly clear.",
        "Pressure builds on all sides.",
        "The point of no return approaches.",
        "Choices narrow as consequences loom."
      ],
      resolution: [
        "A new understanding begins to form.",
        "The aftermath reveals what truly matters.",
        "Lessons emerge from the experience.",
        "The path forward becomes visible.",
        "What was lost and gained becomes clear."
      ]
    }
  };

  // Get plot beats based on theme and phase
  let beats;
  if (plotBeats[theme] && plotBeats[theme][currentPhase]) {
    beats = plotBeats[theme][currentPhase];
  } else if (plotBeats[theme]) {
    // Fallback to any available phase for this theme
    const availablePhases = Object.keys(plotBeats[theme]);
    const fallbackPhase = availablePhases[0];
    beats = plotBeats[theme][fallbackPhase];
  } else {
    // Ultimate fallback to general beats
    beats = plotBeats.general.introduction;
  }

  // Select a random plot beat
  const plotBeat = beats[Math.floor(Math.random() * beats.length)];

  // Return the appropriate description based on the rotation type
  switch (descriptionType) {
    case 'environment':
      return description;
    case 'plot':
      return plotBeat;
    case 'action':
    default:
      return action;
  }
};

/**
 * Generate an environmental event description
 *
 * @param {Object} storyArc - The current story arc
 * @param {Array} characters - The characters in the scene
 * @returns {string} - An environmental event description
 */
export const generateEnvironmentalEvent = (storyArc, characters = []) => {
  if (!storyArc) return '';

  const { theme, currentPhase, currentTension } = storyArc;

  // Environmental events based on theme and phase
  const environmentalEvents = {
    superhero: {
      introduction: [
        "A news helicopter flies overhead, broadcasting the scene live.",
        "Civilians rush to evacuate the area as police set up barriers.",
        "The ground trembles as something massive approaches in the distance.",
        "Emergency services arrive, setting up a command center nearby.",
        "A government official arrives, demanding a briefing on the situation."
      ],
      conflict: [
        "A building's support structure fails, sending debris crashing down.",
        "Civilians are trapped in a bus teetering on the edge of a damaged bridge.",
        "Enemy reinforcements arrive, dropping from the sky in attack formation.",
        "A power line snaps, sending dangerous electrical arcs across the battlefield.",
        "The enemy deploys a new weapon that distorts the very air around it."
      ],
      planning: [
        "Satellite imagery reveals enemy movement toward a civilian center.",
        "A wounded ally arrives with critical intelligence about the enemy's plans.",
        "Communications are briefly jammed by an unknown source.",
        "A civilian expert offers unexpected insight into the enemy's technology.",
        "Weather conditions begin to deteriorate, complicating the tactical situation."
      ],
      climax: [
        "The enemy's doomsday device begins its activation sequence.",
        "A forcefield surrounds the final battleground, cutting off escape.",
        "The ground splits open, revealing an underground facility beneath.",
        "Temporal distortions warp the battlefield as reality itself is threatened.",
        "Civilian evacuations are only half-complete as the final countdown begins."
      ],
      resolution: [
        "Cheers erupt from watching civilians as the threat is neutralized.",
        "Emergency services move in to treat the wounded and assess damage.",
        "The first rays of sunrise break through, symbolizing hope restored.",
        "Military officials arrive to secure dangerous technology left behind.",
        "News crews swarm the area, eager for statements from the heroes."
      ]
    },
    fantasy: {
      introduction: [
        "Ancient runes on the walls begin to glow with mysterious energy.",
        "A messenger arrives with an urgent scroll bearing the royal seal.",
        "Wildlife flees through the area, sensing danger before humans can.",
        "The tavern falls silent as a hooded stranger enters and surveys the room.",
        "A mystical fog rolls in, bringing with it whispers of ancient times."
      ],
      discovery: [
        "The ground shifts, revealing a hidden entrance to forgotten catacombs.",
        "A magical barrier flickers and fails, allowing access to a forbidden area.",
        "Ancient texts begin to translate themselves in swirling magical script.",
        "A spectral figure appears briefly, pointing toward an unmarked path.",
        "Artifacts in the room resonate with each other, creating a map of energy."
      ],
      conflict: [
        "Dark energy corrupts the surrounding plant life, turning it twisted and hostile.",
        "The sky darkens unnaturally as magical forces gather strength.",
        "Protective wards flare and strain against an unseen magical assault.",
        "The ground trembles as ancient guardians awaken from their slumber.",
        "Rifts to other planes begin to open, allowing glimpses of other worlds."
      ],
      climax: [
        "The convergence of ley lines reaches its peak, flooding the area with raw magic.",
        "Ancient prophecy manifests in physical signs and portents all around.",
        "The barrier between worlds thins to transparency as realms begin to merge.",
        "Magical artifacts activate simultaneously, their powers combining unpredictably.",
        "Time flows strangely as past, present and future briefly overlap."
      ],
      resolution: [
        "Natural balance returns to the land as corrupted magic dissipates.",
        "Magical creatures emerge from hiding, sensing the return of harmony.",
        "Ancient guardians return to their slumber, their purpose fulfilled.",
        "The first new growth appears in previously blighted areas.",
        "Celestial alignments shift, marking the end of one age and the beginning of another."
      ]
    },
    scifi: {
      introduction: [
        "Ship sensors detect an anomalous energy signature approaching.",
        "Artificial gravity fluctuates momentarily as systems calibrate.",
        "A transmission from command arrives, updating mission parameters.",
        "The ship's AI announces completion of a deep scan of the sector.",
        "Environmental systems adjust to compensate for external radiation."
      ],
      discovery: [
        "Scanners detect life signs where none should exist.",
        "The ship's computer decodes part of an alien transmission.",
        "A previously dormant alien artifact begins to power up.",
        "Sensors map a hidden structure beneath the planet's surface.",
        "Quantum fluctuations reveal glimpses of parallel timelines."
      ],
      conflict: [
        "Hull breach alerts sound as enemy weapons find their mark.",
        "Critical systems switch to backup power after a direct hit.",
        "Artificial intelligence subroutines show signs of external tampering.",
        "Hostile boarding parties are detected in multiple sectors.",
        "Radiation from damaged systems reaches dangerous levels."
      ],
      climax: [
        "The ship's self-destruct sequence is activated with a countdown.",
        "Quantum singularity readings spike to unprecedented levels.",
        "All escape pods automatically prepare for emergency launch.",
        "The alien mothership begins charging its main weapon array.",
        "Space-time distortions threaten to tear the ship apart."
      ],
      resolution: [
        "Damage control teams report successful containment of critical failures.",
        "Long-range sensors confirm the retreat of enemy forces.",
        "The ship's AI completes diagnostics and begins self-repair protocols.",
        "Communication channels reopen with allied forces in the sector.",
        "New stellar phenomena emerge in the aftermath of the conflict."
      ]
    },
    general: {
      introduction: [
        "The atmosphere in the room shifts as new information comes to light.",
        "External events interrupt, demanding immediate attention.",
        "A message arrives that changes the context of the discussion.",
        "Environmental conditions change, affecting everyone present.",
        "Unexpected evidence appears, altering the course of conversation."
      ],
      conflict: [
        "External pressures escalate the tension in the room.",
        "A deadline is suddenly moved up, creating urgency.",
        "New stakeholders enter the situation with their own agendas.",
        "Resources become more limited than previously thought.",
        "Conflicting information arrives, causing confusion and disagreement."
      ],
      resolution: [
        "External validation arrives for the chosen course of action.",
        "New resources become available, easing previous constraints.",
        "The environment becomes more conducive to cooperation.",
        "Time pressure eases, allowing for more thoughtful consideration.",
        "A shared external challenge unites previously opposing viewpoints."
      ]
    }
  };

  // Select appropriate events based on context
  let events;

  // Get environmental events based on theme and phase
  if (environmentalEvents[theme] && environmentalEvents[theme][currentPhase]) {
    events = environmentalEvents[theme][currentPhase];
  } else if (environmentalEvents[theme]) {
    // Fallback to any available phase for this theme
    const availablePhases = Object.keys(environmentalEvents[theme]);
    const fallbackPhase = availablePhases[0];
    events = environmentalEvents[theme][fallbackPhase];
  } else {
    // Ultimate fallback to general events
    events = environmentalEvents.general.introduction;
  }

  // Select a random event
  const event = events[Math.floor(Math.random() * events.length)];

  return event;
};

/**
 * Determine if an environmental event should occur
 *
 * @param {Object} storyArc - The current story arc
 * @param {number} messageCount - Number of messages since last event
 * @returns {boolean} - Whether an environmental event should occur
 */
export const shouldTriggerEnvironmentalEvent = (storyArc, messageCount) => {
  if (!storyArc) return false;

  const { currentPhase, currentTension } = storyArc;

  // Enforce minimum spacing between events (5-8 turns)
  if (messageCount < 5) {
    return false; // Too soon for another event
  }

  // Base chance increases with message count, maxing out at 8 messages
  // This creates a window of opportunity between 5-8 messages
  let eventChance = 0;

  if (messageCount >= 8) {
    // After 8 messages, higher chance to trigger
    eventChance = 0.35; // 35% chance
  } else if (messageCount >= 7) {
    eventChance = 0.25; // 25% chance
  } else if (messageCount >= 6) {
    eventChance = 0.15; // 15% chance
  } else if (messageCount >= 5) {
    eventChance = 0.05; // 5% chance
  }

  // Adjust chance based on story phase and tension
  if (currentPhase === 'climax') {
    eventChance += 0.1; // +10% during climax
  } else if (currentPhase === 'conflict') {
    eventChance += 0.05; // +5% during conflict
  } else if (currentPhase === 'resolution') {
    eventChance -= 0.05; // -5% during resolution
  }

  if (currentTension === 'very high') {
    eventChance += 0.1; // +10% during very high tension
  } else if (currentTension === 'high') {
    eventChance += 0.05; // +5% during high tension
  } else if (currentTension === 'low') {
    eventChance -= 0.05; // -5% during low tension
  }

  // Random check
  return Math.random() < eventChance;
};
