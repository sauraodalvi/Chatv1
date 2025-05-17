// Utility functions for generating contextual quick actions

/**
 * Get character-specific quick actions based on character name, type, and narrative context
 * @param {Object} character - The character object
 * @param {string} narrativePhase - Current narrative phase (introduction, rising, climax, resolution)
 * @param {boolean} isBattleContext - Whether the current context is a battle
 * @returns {Array} - Array of quick action strings
 */
export const getCharacterQuickActions = (character, narrativePhase, isBattleContext = false) => {
  if (!character) return [];
  
  // Character-specific actions based on name
  const characterSpecificActions = {
    // Avengers characters
    "Thor": {
      battle: [
        "Summon lightning",
        "Throw Mjolnir",
        "Call down thunder",
        "Shield allies",
        "Engage enemy directly"
      ],
      exploration: [
        "Scan the skies",
        "Sense magical energies",
        "Share Asgardian wisdom",
        "Inspect with godly senses"
      ],
      social: [
        "Speak of Asgard",
        "Tell a warrior's tale",
        "Make a bold declaration",
        "Raise spirits with booming voice"
      ]
    },
    "Iron Man": {
      battle: [
        "Deploy repulsors",
        "Activate targeting system",
        "Launch micro-missiles",
        "Scan for weaknesses",
        "Reroute power to shields"
      ],
      exploration: [
        "Scan environment",
        "Analyze data",
        "Deploy reconnaissance drone",
        "Check suit diagnostics"
      ],
      social: [
        "Make sarcastic remark",
        "Reference pop culture",
        "Offer technical solution",
        "Challenge authority"
      ]
    },
    "Captain America": {
      battle: [
        "Throw shield",
        "Coordinate team attack",
        "Protect civilians",
        "Take defensive stance",
        "Rally the team"
      ],
      exploration: [
        "Scout ahead",
        "Assess tactical options",
        "Check for civilians",
        "Secure the perimeter"
      ],
      social: [
        "Give inspiring speech",
        "Appeal to values",
        "Mediate conflict",
        "Share strategic insight"
      ]
    },
    "Hulk": {
      battle: [
        "SMASH!",
        "Roar with rage",
        "Leap into battle",
        "Throw massive object",
        "Ground pound"
      ],
      exploration: [
        "Sniff the air",
        "Break through obstacle",
        "Climb to high ground",
        "Listen for danger"
      ],
      social: [
        "Grunt in agreement",
        "Cross arms stubbornly",
        "Give simple wisdom",
        "Show surprising gentleness"
      ]
    },
    "Black Widow": {
      battle: [
        "Use Widow's Bite",
        "Execute acrobatic attack",
        "Deploy smoke grenade",
        "Target weak points",
        "Stealth takedown"
      ],
      exploration: [
        "Infiltrate quietly",
        "Hack security system",
        "Gather intelligence",
        "Set up surveillance"
      ],
      social: [
        "Read body language",
        "Extract information subtly",
        "Change the subject",
        "Offer pragmatic view"
      ]
    },
    "Hawkeye": {
      battle: [
        "Fire precision arrow",
        "Use explosive arrow",
        "Target from high ground",
        "Provide covering fire",
        "Set up trick shot"
      ],
      exploration: [
        "Spot hidden details",
        "Take up vantage point",
        "Track movement patterns",
        "Set up perimeter sensors"
      ],
      social: [
        "Make dry observation",
        "Offer grounded perspective",
        "Cut through nonsense",
        "Share family wisdom"
      ]
    }
  };
  
  // Get actions based on character type if no specific character actions exist
  const typeActions = {
    "superhero": {
      battle: [
        "Use powers",
        "Protect civilians",
        "Coordinate with team",
        "Target weakness",
        "Create diversion"
      ],
      exploration: [
        "Scout the area",
        "Use enhanced senses",
        "Check for traps",
        "Look for clues"
      ],
      social: [
        "Inspire hope",
        "Share heroic wisdom",
        "Reassure civilians",
        "Plan next steps"
      ]
    },
    "fantasy": {
      battle: [
        "Cast spell",
        "Draw weapon",
        "Take defensive stance",
        "Call upon ancient power",
        "Prepare ritual"
      ],
      exploration: [
        "Check for magic",
        "Consult ancient knowledge",
        "Search for hidden doors",
        "Examine artifacts"
      ],
      social: [
        "Share prophecy",
        "Speak in riddles",
        "Offer mystical insight",
        "Tell legendary tale"
      ]
    },
    "scifi": {
      battle: [
        "Activate shields",
        "Fire energy weapon",
        "Deploy drone",
        "Hack enemy systems",
        "Use advanced tech"
      ],
      exploration: [
        "Scan for lifeforms",
        "Analyze atmosphere",
        "Check radiation levels",
        "Deploy sensor array"
      ],
      social: [
        "Share scientific theory",
        "Reference alien culture",
        "Discuss technological ethics",
        "Propose logical solution"
      ]
    }
  };
  
  // Default actions if no character or type-specific actions exist
  const defaultActions = {
    battle: [
      "Attack",
      "Defend",
      "Take cover",
      "Assess the situation",
      "Call for help"
    ],
    exploration: [
      "Look around",
      "Check surroundings",
      "Investigate object",
      "Listen carefully"
    ],
    social: [
      "Ask question",
      "Share opinion",
      "Change subject",
      "Express emotion"
    ]
  };
  
  // Determine context type based on narrative phase and battle context
  let contextType = "social";
  if (isBattleContext) {
    contextType = "battle";
  } else if (narrativePhase === "introduction" || narrativePhase === "rising") {
    contextType = "exploration";
  }
  
  // Get character-specific actions if available
  if (characterSpecificActions[character.name] && characterSpecificActions[character.name][contextType]) {
    return characterSpecificActions[character.name][contextType];
  }
  
  // Get type-specific actions if available
  if (character.type && typeActions[character.type.toLowerCase()] && typeActions[character.type.toLowerCase()][contextType]) {
    return typeActions[character.type.toLowerCase()][contextType];
  }
  
  // Return default actions
  return defaultActions[contextType];
};

/**
 * Get narrative phase-specific quick actions
 * @param {string} narrativePhase - Current narrative phase
 * @param {number} tension - Current tension level (1-10)
 * @returns {Array} - Array of narrative action objects with text and icon properties
 */
export const getNarrativePhaseActions = (narrativePhase, tension = 5) => {
  const phaseActions = {
    "introduction": [
      { text: "Reveal Detail", action: "Reveal an important detail about the situation", icon: "Compass" },
      { text: "Foreshadow", action: "Introduce a subtle hint of upcoming conflict", icon: "Wind" }
    ],
    "rising": [
      { text: "Escalate", action: "Escalate the tension with an unexpected complication", icon: "Flame" },
      { text: "Reveal Motive", action: "Reveal a character's hidden motivation", icon: "Sparkle" }
    ],
    "climax": [
      { text: "Critical Moment", action: "Force a critical decision that will change everything", icon: "Zap" },
      { text: "Plot Twist", action: "Reveal a shocking twist that changes the situation", icon: "Sparkles" }
    ],
    "resolution": [
      { text: "Resolve", action: "Begin wrapping up loose story threads", icon: "Leaf" },
      { text: "Epilogue", action: "Hint at future adventures or unresolved questions", icon: "Droplets" }
    ]
  };
  
  return phaseActions[narrativePhase] || [];
};

/**
 * Detect if the current context is a battle based on recent messages
 * @param {Array} messages - Recent chat messages
 * @param {number} threshold - Number of battle keywords needed to trigger battle context
 * @returns {boolean} - Whether the current context is a battle
 */
export const detectBattleContext = (messages, threshold = 3) => {
  if (!messages || messages.length === 0) return false;
  
  // Battle-related keywords
  const battleKeywords = [
    "attack", "fight", "battle", "enemy", "enemies", "combat", "defend",
    "shield", "weapon", "explosion", "danger", "threat", "alien", "invasion"
  ];
  
  // Count battle keywords in recent messages
  let battleKeywordCount = 0;
  messages.forEach(msg => {
    if (msg.message) {
      const messageLower = msg.message.toLowerCase();
      battleKeywords.forEach(keyword => {
        if (messageLower.includes(keyword)) battleKeywordCount++;
      });
    }
  });
  
  // If we find multiple battle keywords, it's likely a battle
  return battleKeywordCount >= threshold;
};
