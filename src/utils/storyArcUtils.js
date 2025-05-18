/**
 * Story Arc Utilities for Velora
 *
 * This module provides functions for managing dynamic story arcs that evolve
 * based on chat interactions, ensuring more coherent and engaging scenarios.
 */

// Scenario data repository - can be moved to a separate file as it grows
const scenarioDataRepository = {
  "Avengers: Alien Invasion": {
    theme: "superhero",
    initialPhase: "conflict",
    initialGoal: "Defend New York City from the alien invasion",
    initialTension: "high",
    keyCharacters: ["Iron Man", "Captain America", "Thor", "Hulk"],
    keyLocations: ["New York City", "Alien Mothership", "Stark Tower"],
    plotPoints: [
      "Aliens have begun their invasion of New York",
      "The Avengers are fighting to protect civilians",
      "The team needs to find the aliens' weakness",
      "The final battle will take place on the mothership",
    ],
    initialContext:
      "The Avengers are in the midst of battle against alien forces in downtown New York. Civilians are being evacuated while the team fights to push back the invasion. The alien mothership looms overhead, continuously sending down reinforcements. The team needs to coordinate their defense while looking for a way to stop the invasion at its source.",
    initialNarration:
      "The skies above New York City are filled with alien ships. Explosions echo through the streets as civilians run for cover. The Avengers have assembled in the heart of Manhattan, ready to defend Earth.",
    initialMessages: [
      {
        speaker: "Hulk",
        message:
          "*smashes an alien soldier with a powerful blow, sending it flying into a nearby wall*",
        isAction: true,
      },
      {
        speaker: "Captain America",
        message:
          "Team, we need to establish a perimeter! Thor, take the skies and thin out their air support. Iron Man, scan for weaknesses in their tech. Hulk, keep smashing but try to keep the destruction away from civilians. I'll coordinate evacuation with local authorities.",
      },
    ],
    phaseTransitions: {
      introduction: {
        keywords: ["assemble", "prepare", "briefing"],
        nextPhase: "conflict",
      },
      conflict: {
        keywords: ["plan", "strategy", "weakness"],
        nextPhase: "planning",
      },
      planning: {
        keywords: ["attack", "mothership", "final"],
        nextPhase: "climax",
      },
      climax: {
        keywords: ["victory", "defeated", "won"],
        nextPhase: "resolution",
      },
    },
    environmentalEvents: {
      minor: [
        "Distant explosions echo as alien ships target another part of the city.",
        "Emergency sirens wail continuously in the background.",
        "Civilians rush past, seeking shelter from the chaos.",
        "News helicopters circle overhead, broadcasting the invasion worldwide.",
      ],
      major: [
        "A massive explosion rocks the area as an alien weapon discharges!",
        "The ground shakes violently as a massive alien walker crashes through a nearby building!",
        "The sky darkens as the mothership moves into position directly overhead!",
        "A blinding flash of energy surges from the mothership, targeting key infrastructure!",
      ],
    },
    quickActions: [
      "Shield civilians",
      "Attack alien",
      "Coordinate team",
      "Analyze tech",
    ],
  },
  "The Lost Artifact": {
    theme: "fantasy",
    initialPhase: "introduction",
    initialGoal: "Locate the ancient artifact before dark forces claim it",
    initialTension: "building",
    keyLocations: ["Ancient Temple", "Forbidden Forest", "Crystal Caverns"],
    initialContext:
      "A group of adventurers has gathered at the edge of the Forbidden Forest. Ancient texts speak of a powerful artifact hidden within the ruins of a forgotten civilization. Dark forces are also seeking the artifact, and time is running out.",
    initialNarration:
      "The air is thick with magic as your party stands at the entrance to the ancient forest. Mist swirls around gnarled trees, and distant whispers seem to call from within the depths. The map you've been following has led you here, to the first step of your quest for the legendary artifact.",
    initialMessages: [
      {
        speaker: "Elara Moonwhisper",
        message:
          "*traces glowing runes in the air, creating a protective ward around the group*",
        isAction: true,
      },
      {
        speaker: "Elara Moonwhisper",
        message:
          "The forest's magic is ancient and unpredictable. Stay close, and whatever you do, don't stray from the path. The artifact's energy calls to me... it's definitely in there, but we're not the only ones seeking it.",
      },
    ],
    phaseTransitions: {
      introduction: {
        keywords: ["journey", "begin", "quest"],
        nextPhase: "discovery",
      },
      discovery: {
        keywords: ["clue", "found", "trail"],
        nextPhase: "conflict",
      },
      conflict: {
        keywords: ["battle", "fight", "defend"],
        nextPhase: "climax",
      },
      climax: {
        keywords: ["artifact", "power", "final"],
        nextPhase: "resolution",
      },
    },
    environmentalEvents: {
      minor: [
        "A gentle breeze carries the scent of distant flowers through the area.",
        "The light shifts as clouds pass overhead, casting moving shadows.",
        "A small magical creature darts past, leaving a trail of sparkling dust.",
        "Ancient runes on a nearby wall begin to glow faintly.",
      ],
      major: [
        "The ground trembles violently! Cracks appear in the earth, and everyone struggles to maintain balance.",
        "A massive portal tears open in the air nearby, swirling with arcane energy!",
        "The sky darkens unnaturally as storm clouds gather with impossible speed. Lightning strikes nearby!",
        "Ancient statues around the area suddenly animate, their stone eyes following everyone's movements!",
      ],
    },
    quickActions: [
      "Cast spell",
      "Check for traps",
      "Examine runes",
      "Draw weapon",
    ],
  },
  "Space Station Omega": {
    theme: "scifi",
    initialPhase: "introduction",
    initialGoal:
      "Investigate the mysterious signal coming from the abandoned station",
    initialTension: "building",
    keyLocations: ["Command Center", "Research Lab", "Maintenance Tunnels"],
    initialContext:
      "Your crew has been dispatched to investigate a mysterious signal emanating from Space Station Omega, which was abandoned years ago after a catastrophic incident. The nature of the signal is unknown, but it matches no known pattern in the database.",
    initialNarration:
      "The airlock hisses as your ship completes its docking procedure with Space Station Omega. Through the viewport, you can see the station's exterior is damaged and dark, with only a few emergency lights still functioning. The mysterious signal continues to pulse from somewhere deep within the station.",
    initialMessages: [
      {
        speaker: "Commander Zax",
        message:
          "*checks the readings on his wrist device, frowning at the data*",
        isAction: true,
      },
      {
        speaker: "Commander Zax",
        message:
          "Atmospheric readings show the station's life support is functioning at minimal capacity. We have approximately six hours before our oxygen reserves become critical. Stay alert - the last crew disappeared without a trace, and that signal doesn't match anything in our database. Standard protocol: weapons ready, comms open at all times.",
      },
    ],
    phaseTransitions: {
      introduction: {
        keywords: ["dock", "arrive", "board"],
        nextPhase: "discovery",
      },
      discovery: {
        keywords: ["found", "signal", "evidence"],
        nextPhase: "conflict",
      },
      conflict: {
        keywords: ["danger", "threat", "malfunction"],
        nextPhase: "climax",
      },
      climax: {
        keywords: ["escape", "override", "final"],
        nextPhase: "resolution",
      },
    },
    environmentalEvents: {
      minor: [
        "The ship's systems emit a series of diagnostic beeps as routine checks complete.",
        "Holographic displays flicker with incoming data streams.",
        "The artificial gravity fluctuates momentarily, causing a brief sensation of weightlessness.",
        "Distant mechanical sounds echo through the corridors.",
      ],
      major: [
        "WARNING! Multiple system failures detected! Red emergency lights flash as alarms blare throughout the ship.",
        "A massive energy surge overloads nearby systems, causing explosions and electrical arcs!",
        "The ship violently shudders as it's hit by something massive. Artificial gravity fails momentarily!",
        "Proximity alarms scream as an unidentified vessel drops out of hyperspace dangerously close!",
      ],
    },
    quickActions: [
      "Scan area",
      "Check systems",
      "Draw weapon",
      "Access terminal",
    ],
  },
  "Avengers join battle": {
    theme: "superhero",
    initialPhase: "conflict",
    initialGoal: "Join the Avengers in their battle against the alien invasion",
    initialTension: "high",
    keyCharacters: ["Iron Man", "Captain America", "Thor", "Hulk"],
    keyLocations: ["New York City", "Alien Mothership", "Stark Tower"],
    plotPoints: [
      "Aliens have begun their invasion of New York",
      "The Avengers are fighting to protect civilians",
      "You join the team in the midst of battle",
      "The team needs to find the aliens' weakness",
      "The final battle will take place on the mothership",
    ],
    initialContext:
      "The Avengers are in the midst of battle against alien forces in downtown New York. Civilians are being evacuated while the team fights to push back the invasion. The alien mothership looms overhead, continuously sending down reinforcements. You join the team as they coordinate their defense while looking for a way to stop the invasion at its source.",
    initialNarration:
      "The skies above New York City are filled with alien ships. Explosions echo through the streets as civilians run for cover. The Avengers are fighting valiantly, and you've just arrived to join the battle.",
    initialMessages: [
      {
        speaker: "Iron Man",
        message:
          "*flies overhead, blasting aliens with repulsor beams* Look who decided to join the party! We could use the help - these things are everywhere!",
        isAction: true,
      },
      {
        speaker: "Captain America",
        message:
          "Glad you're here! We need to establish a perimeter and protect civilians. Thor is handling air support, Hulk is on the front lines, and Iron Man is scanning for weaknesses. Where do you want to help?",
      },
    ],
    phaseTransitions: {
      introduction: {
        keywords: ["assemble", "prepare", "briefing"],
        nextPhase: "conflict",
      },
      conflict: {
        keywords: ["plan", "strategy", "weakness"],
        nextPhase: "planning",
      },
      planning: {
        keywords: ["attack", "mothership", "final"],
        nextPhase: "climax",
      },
      climax: {
        keywords: ["victory", "defeated", "won"],
        nextPhase: "resolution",
      },
    },
    environmentalEvents: {
      minor: [
        "Distant explosions echo as alien ships target another part of the city.",
        "Emergency sirens wail continuously in the background.",
        "Civilians rush past, seeking shelter from the chaos.",
        "News helicopters circle overhead, broadcasting the invasion worldwide.",
      ],
      major: [
        "A massive explosion rocks the area as an alien weapon discharges!",
        "The ground shakes violently as a massive alien walker crashes through a nearby building!",
        "The sky darkens as the mothership moves into position directly overhead!",
        "A blinding flash of energy surges from the mothership, targeting key infrastructure!",
      ],
    },
    quickActions: [
      "Shield civilians",
      "Attack alien",
      "Coordinate team",
      "Analyze tech",
    ],
  },
};

/**
 * Get scenario data from the repository
 *
 * @param {string} scenarioTitle - The title of the scenario
 * @param {string} scenarioTheme - The theme of the scenario
 * @returns {Object|null} - The scenario data or null if not found
 */
export const getScenarioData = (scenarioTitle, scenarioTheme) => {
  try {
    // Validate inputs
    if (!scenarioTitle && !scenarioTheme) {
      console.warn("getScenarioData called with no title or theme");
      return null;
    }

    // Check if repository exists
    if (!scenarioDataRepository || typeof scenarioDataRepository !== "object") {
      console.error("Scenario data repository is missing or invalid");
      return null;
    }

    console.log(
      `getScenarioData called with title: "${
        scenarioTitle || "none"
      }", theme: "${scenarioTheme || "none"}"`
    );

    // Safely get keys from repository
    const availableScenarios = Object.keys(scenarioDataRepository);
    console.log("Available scenarios:", availableScenarios);

    // Special case for "Avengers join battle" scenario - direct lookup with exact match
    if (
      scenarioTitle === "Avengers join battle" &&
      scenarioDataRepository["Avengers join battle"]
    ) {
      console.log(`Found Avengers join battle scenario by exact title`);
      return scenarioDataRepository["Avengers join battle"];
    }

    // First try to find by exact title if title is provided
    if (scenarioTitle && scenarioDataRepository[scenarioTitle]) {
      console.log(`Found scenario by exact title: "${scenarioTitle}"`);
      return scenarioDataRepository[scenarioTitle];
    }

    // Try partial title match if exact match fails
    if (scenarioTitle) {
      const partialMatches = availableScenarios.filter((title) =>
        title.toLowerCase().includes(scenarioTitle.toLowerCase())
      );

      if (partialMatches.length > 0) {
        console.log(
          `Found scenario by partial title match: "${partialMatches[0]}"`
        );
        return scenarioDataRepository[partialMatches[0]];
      }
    }

    // If not found by title and theme is provided, look for scenarios with matching theme
    if (scenarioTheme) {
      const scenariosByTheme = Object.values(scenarioDataRepository).filter(
        (scenario) => scenario && scenario.theme === scenarioTheme
      );

      if (scenariosByTheme.length > 0) {
        // Return the first scenario with matching theme
        console.log(`Found scenario by theme: "${scenarioTheme}"`);
        return scenariosByTheme[0];
      }
    }

    console.log(
      `No scenario found for title: "${scenarioTitle || "none"}", theme: "${
        scenarioTheme || "none"
      }"`
    );
    return null;
  } catch (error) {
    console.error("Error in getScenarioData:", error);
    return null;
  }
};

/**
 * Initialize a story arc based on the scenario type and prompt
 * @param {string} scenarioTitle - The title of the scenario
 * @param {string} scenarioPrompt - The scenario description
 * @param {string} scenarioTheme - The theme of the scenario (e.g., "superhero", "fantasy")
 * @returns {Object} - Initial story arc object
 */
export const initializeStoryArc = (
  scenarioTitle,
  scenarioPrompt,
  scenarioTheme
) => {
  try {
    // Validate inputs and provide defaults
    const safeTitle = scenarioTitle || "Chat Room";
    const safePrompt = scenarioPrompt || "Welcome to the chat room.";
    let safeTheme = scenarioTheme;

    if (!safeTheme) {
      try {
        safeTheme = detectThemeFromPrompt(safePrompt);
      } catch (error) {
        console.error("Error detecting theme from prompt:", error);
        safeTheme = "general";
      }
    }

    // Default story arc structure
    const storyArc = {
      title: safeTitle,
      theme: safeTheme,
      currentPhase: "introduction",
      currentGoal: "",
      currentTension: "medium",
      keyCharacters: [],
      keyLocations: [],
      plotPoints: [],
      currentContext: safePrompt,
      previousContext: "",
    };

    // Get scenario details from the scenario data if available
    const scenarioData = getScenarioData(safeTitle, safeTheme);

    if (scenarioData) {
      return {
        ...storyArc,
        currentPhase: scenarioData.initialPhase || "introduction",
        currentGoal: scenarioData.initialGoal || "",
        currentTension: scenarioData.initialTension || "medium",
        keyCharacters: scenarioData.keyCharacters || [],
        keyLocations: scenarioData.keyLocations || [],
        plotPoints: scenarioData.plotPoints || [],
        currentContext: scenarioData.initialContext || safePrompt,
      };
    }

    // If no specific scenario data is found, use theme-based defaults
    if (safeTheme === "fantasy") {
      return {
        ...storyArc,
        currentPhase: "introduction",
        currentTension: "building",
        currentContext:
          "The party has just begun their adventure, getting to know one another and establishing their quest objectives.",
      };
    } else if (safeTheme === "scifi") {
      return {
        ...storyArc,
        currentPhase: "introduction",
        currentTension: "building",
        currentContext:
          "The crew is aboard their spacecraft, preparing for the challenges that lie ahead in the vast unknown of space.",
      };
    } else if (safeTheme === "mystery") {
      return {
        ...storyArc,
        currentPhase: "discovery",
        currentTension: "building",
        currentContext:
          "The first clues have been discovered, raising more questions than answers as the investigation begins.",
      };
    } else if (safeTheme === "superhero") {
      return {
        ...storyArc,
        currentPhase: "conflict",
        currentTension: "high",
        currentContext:
          "Heroes have assembled to face a growing threat. The situation is tense as they prepare to defend innocent lives.",
      };
    } else if (safeTheme === "horror") {
      return {
        ...storyArc,
        currentPhase: "discovery",
        currentTension: "building",
        currentContext:
          "Something feels wrong. The first signs of danger have appeared, but the true horror remains hidden.",
      };
    }

    // For custom scenarios, extract context from the prompt
    return {
      ...storyArc,
      currentContext: extractContextFromPrompt(safePrompt) || safePrompt,
    };
  } catch (error) {
    console.error("Error in initializeStoryArc:", error);
    // Return a minimal valid story arc in case of error
    return {
      title: scenarioTitle || "Chat Room",
      theme: "general",
      currentPhase: "introduction",
      currentTension: "medium",
      currentContext: scenarioPrompt || "Welcome to the chat room.",
      previousContext: "",
      keyCharacters: [],
      keyLocations: [],
      plotPoints: [],
    };
  }
};

/**
 * Update the story arc based on recent chat messages
 * @param {Object} currentArc - The current story arc
 * @param {Array} recentMessages - Recent chat messages
 * @param {number} messageCount - Number of messages to analyze
 * @returns {Object} - Updated story arc
 */
export const updateStoryArc = (
  currentArc,
  recentMessages,
  messageCount = 5
) => {
  if (!currentArc || !recentMessages || recentMessages.length === 0) {
    return currentArc;
  }

  // Get the most recent messages for analysis
  const messagesToAnalyze = recentMessages.slice(-messageCount);

  // Extract key information from recent messages
  const combinedContent = messagesToAnalyze.map((msg) => msg.message).join(" ");

  // Check for phase transitions based on content
  const updatedArc = { ...currentArc };

  // Save the previous context
  updatedArc.previousContext = currentArc.currentContext;

  // Update context based on recent messages
  updatedArc.currentContext = generateUpdatedContext(
    currentArc,
    combinedContent
  );

  // Get scenario data for phase transition keywords
  const scenarioData = getScenarioData(currentArc.title, currentArc.theme);

  // Check for phase transitions using scenario-specific keywords if available
  if (
    scenarioData &&
    scenarioData.phaseTransitions &&
    scenarioData.phaseTransitions[currentArc.currentPhase]
  ) {
    const transition = scenarioData.phaseTransitions[currentArc.currentPhase];
    const keywords = transition.keywords || [];

    // Check if any keywords are present in the recent messages
    const shouldTransition = keywords.some((keyword) =>
      combinedContent.toLowerCase().includes(keyword.toLowerCase())
    );

    if (shouldTransition) {
      updatedArc.currentPhase = transition.nextPhase;

      // Update tension based on the new phase
      if (transition.nextPhase === "conflict") {
        updatedArc.currentTension = "high";
      } else if (transition.nextPhase === "climax") {
        updatedArc.currentTension = "very high";
      } else if (transition.nextPhase === "resolution") {
        updatedArc.currentTension = "falling";
      }
    }
  } else {
    // Fallback to generic phase transitions if no scenario-specific ones are available
    if (
      currentArc.currentPhase === "introduction" &&
      (combinedContent.includes("attack") ||
        combinedContent.includes("fight") ||
        combinedContent.includes("battle"))
    ) {
      updatedArc.currentPhase = "conflict";
      updatedArc.currentTension = "high";
    } else if (
      currentArc.currentPhase === "conflict" &&
      (combinedContent.includes("plan") ||
        combinedContent.includes("strategy") ||
        combinedContent.includes("weakness"))
    ) {
      updatedArc.currentPhase = "planning";
    } else if (
      currentArc.currentPhase === "planning" &&
      (combinedContent.includes("final") ||
        combinedContent.includes("confront") ||
        combinedContent.includes("ready"))
    ) {
      updatedArc.currentPhase = "climax";
      updatedArc.currentTension = "very high";
    } else if (
      currentArc.currentPhase === "climax" &&
      (combinedContent.includes("victory") ||
        combinedContent.includes("defeated") ||
        combinedContent.includes("over"))
    ) {
      updatedArc.currentPhase = "resolution";
      updatedArc.currentTension = "falling";
    }
  }

  // Update goals based on theme and content
  if (currentArc.theme === "superhero") {
    if (
      combinedContent.includes("civilian") ||
      combinedContent.includes("rescue")
    ) {
      updatedArc.currentGoal = "Rescue civilians and minimize casualties";
    } else if (
      combinedContent.includes("weakness") ||
      combinedContent.includes("vulnerability")
    ) {
      updatedArc.currentGoal = "Discover the enemy's weakness";
    } else if (
      combinedContent.includes("final") ||
      combinedContent.includes("confront")
    ) {
      updatedArc.currentGoal = "Confront the main threat and save the day";
    }
  } else if (currentArc.theme === "fantasy") {
    if (
      combinedContent.includes("quest") ||
      combinedContent.includes("journey")
    ) {
      updatedArc.currentGoal = "Begin the quest and gather resources";
    } else if (
      combinedContent.includes("clue") ||
      combinedContent.includes("map")
    ) {
      updatedArc.currentGoal = "Follow the trail to the next location";
    } else if (
      combinedContent.includes("battle") ||
      combinedContent.includes("fight")
    ) {
      updatedArc.currentGoal = "Overcome the immediate threat";
    } else if (
      combinedContent.includes("artifact") ||
      combinedContent.includes("treasure")
    ) {
      updatedArc.currentGoal =
        "Secure the artifact before it falls into the wrong hands";
    }
  } else if (currentArc.theme === "scifi") {
    if (
      combinedContent.includes("scan") ||
      combinedContent.includes("analyze")
    ) {
      updatedArc.currentGoal = "Analyze the anomaly and gather data";
    } else if (
      combinedContent.includes("malfunction") ||
      combinedContent.includes("system")
    ) {
      updatedArc.currentGoal = "Repair critical systems before it's too late";
    } else if (
      combinedContent.includes("alien") ||
      combinedContent.includes("contact")
    ) {
      updatedArc.currentGoal = "Establish contact with the unknown entity";
    } else if (
      combinedContent.includes("escape") ||
      combinedContent.includes("evacuate")
    ) {
      updatedArc.currentGoal =
        "Evacuate before the situation becomes catastrophic";
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
      storyArc: "",
      writingStyle: "balanced",
      responseLength: "medium",
      characterReminders: "",
      generalNotes: "",
    };
  }

  // Base instructions on character personality and story arc
  const instructions = {
    storyArc: storyArc.currentContext,
    writingStyle: "balanced",
    responseLength: "medium",
    characterReminders: `Remember that ${character.name} is ${character.description}`,
    generalNotes: "",
  };

  // Customize based on character personality traits
  const personality = character.personality || {};

  // Determine writing style based on personality traits
  if (personality.analytical && personality.analytical > 7) {
    instructions.writingStyle = "analytical";
    instructions.characterReminders += ` Uses logical reasoning and precise language. May reference facts, data, or technical details.`;
  } else if (personality.humor && personality.humor > 7) {
    instructions.writingStyle = "witty";
    instructions.characterReminders += ` Uses humor, sarcasm, and witty remarks. May make jokes or pop culture references.`;
  } else if (personality.emotional && personality.emotional > 7) {
    instructions.writingStyle = "emotional";
    instructions.characterReminders += ` Expresses feelings openly. Uses emotive language and may react strongly to situations.`;
  } else if (personality.philosophical && personality.philosophical > 7) {
    instructions.writingStyle = "philosophical";
    instructions.characterReminders += ` Contemplates deeper meanings. May speak in metaphors or ask thought-provoking questions.`;
  } else if (personality.confidence && personality.confidence > 8) {
    instructions.writingStyle = "assertive";
    instructions.characterReminders += ` Speaks with authority and conviction. Makes decisive statements and takes charge.`;
  }

  // Customize based on character type
  if (character.type === "fantasy") {
    instructions.characterReminders += ` Uses magical or mystical terminology. May reference ancient wisdom or supernatural elements.`;
  } else if (character.type === "scifi") {
    instructions.characterReminders += ` Uses technical jargon and scientific concepts. May reference advanced technology or space phenomena.`;
  } else if (character.type === "historical") {
    instructions.characterReminders += ` Uses period-appropriate language and references. May have formal speech patterns.`;
  } else if (character.type === "superhero") {
    instructions.characterReminders += ` References heroic ideals and responsibilities. May mention powers or abilities.`;
  }

  // Add voice style if available
  if (character.voiceStyle) {
    instructions.characterReminders += ` Speaks in a ${character.voiceStyle} manner.`;
  }

  // Adjust response length based on talkativeness
  if (character.talkativeness) {
    if (character.talkativeness > 7) {
      instructions.responseLength = "long";
    } else if (character.talkativeness < 4) {
      instructions.responseLength = "brief";
    }
  }

  // Customize based on story phase and theme
  const phaseInstructions = {
    introduction: {
      general:
        "Focus on establishing character relationships and setting the scene. Keep tension moderate but building.",
      superhero:
        "Establish your heroic persona and relationship to the team. Reference your powers or abilities when relevant.",
      fantasy:
        "Establish your role in the party and your connection to the magical world. Reference your background and skills.",
      scifi:
        "Establish your role on the crew and your technical expertise. Reference your specialized knowledge or equipment.",
    },
    discovery: {
      general:
        "Focus on exploration and uncovering new information. Show curiosity and analytical thinking.",
      superhero:
        "Analyze the situation and gather intelligence about the threat. Use your unique perspective to contribute insights.",
      fantasy:
        "Interpret clues and magical signs. Use your knowledge of lore and legends to guide the party.",
      scifi:
        "Analyze sensor readings and anomalies. Use scientific reasoning to form hypotheses about what you're encountering.",
    },
    conflict: {
      general:
        "Emphasize action and immediate threats. Responses should be urgent and focused on the current battle.",
      superhero:
        "Focus on protecting civilians and coordinating with teammates. Reference the immediate battle tactics.",
      fantasy:
        "Focus on using your abilities in combat. Reference spells, weapons, or tactical advantages in the environment.",
      scifi:
        "Focus on technical solutions to the crisis. Reference systems, equipment, or scientific principles that could help.",
    },
    planning: {
      general:
        "Focus on strategy and analysis. Characters should be thinking about next steps and discussing the enemy's weaknesses.",
      superhero:
        "Contribute strategic ideas based on your powers and experience. Reference previous battles or known weaknesses.",
      fantasy:
        "Share knowledge of magical weaknesses or prophecies. Reference ancient texts or wisdom that might help.",
      scifi:
        "Propose technical solutions based on data analysis. Reference scientific principles or technological capabilities.",
    },
    climax: {
      general:
        "This is the high point of tension. Responses should be dramatic and impactful, with high stakes clearly communicated.",
      superhero:
        "Show determination in the face of overwhelming odds. Reference what's at stake and your resolve to protect others.",
      fantasy:
        "Channel your full power against the final challenge. Reference prophecies, destinies, or ancient powers.",
      scifi:
        "Execute the final plan with precision and adaptability. Reference critical systems, countdown timers, or final calculations.",
    },
    resolution: {
      general:
        "Wind down the action and reflect on what happened. Focus on character growth and next steps.",
      superhero:
        "Reflect on the victory and lessons learned. Reference the cost of the battle and plans for rebuilding.",
      fantasy:
        "Celebrate the completion of the quest. Reference rewards, magical discoveries, or new bonds formed.",
      scifi:
        "Analyze the mission outcomes and collected data. Reference scientific discoveries or technological advancements made.",
    },
  };

  // Get the appropriate instructions based on phase and theme
  const phase = storyArc.currentPhase || "introduction";
  const theme = storyArc.theme || "general";

  // Get phase-specific instructions
  if (phaseInstructions[phase]) {
    if (phaseInstructions[phase][theme]) {
      instructions.generalNotes = phaseInstructions[phase][theme];
    } else {
      instructions.generalNotes = phaseInstructions[phase].general;
    }
  }

  // Add urgency based on tension level
  if (storyArc.currentTension === "high") {
    instructions.generalNotes +=
      " Maintain a sense of urgency in your responses.";
  } else if (storyArc.currentTension === "very high") {
    instructions.generalNotes +=
      " Convey extreme urgency and high stakes in every response.";
  }

  // Add scenario-specific context if available
  if (storyArc.title) {
    const scenarioData = getScenarioData(storyArc.title, theme);
    if (scenarioData) {
      instructions.generalNotes += ` Remember that you are in the "${storyArc.title}" scenario.`;

      // Add current goal if available
      if (storyArc.currentGoal) {
        instructions.generalNotes += ` Your current goal is to ${storyArc.currentGoal}.`;
      }
    }
  }

  return instructions;
};

/**
 * Detect the theme of a scenario from its prompt
 * @param {string} prompt - The scenario prompt
 * @returns {string} - Detected theme
 */
const detectThemeFromPrompt = (prompt) => {
  if (!prompt) return "general";

  const promptLower = prompt.toLowerCase();

  if (
    promptLower.includes("superhero") ||
    promptLower.includes("avenger") ||
    promptLower.includes("hero") ||
    promptLower.includes("villain")
  ) {
    return "superhero";
  } else if (
    promptLower.includes("magic") ||
    promptLower.includes("dragon") ||
    promptLower.includes("wizard") ||
    promptLower.includes("fantasy")
  ) {
    return "fantasy";
  } else if (
    promptLower.includes("space") ||
    promptLower.includes("alien") ||
    promptLower.includes("future") ||
    promptLower.includes("technology")
  ) {
    return "scifi";
  } else if (
    promptLower.includes("mystery") ||
    promptLower.includes("detective") ||
    promptLower.includes("crime") ||
    promptLower.includes("clue")
  ) {
    return "mystery";
  } else if (
    promptLower.includes("horror") ||
    promptLower.includes("scary") ||
    promptLower.includes("monster") ||
    promptLower.includes("fear")
  ) {
    return "horror";
  }

  return "general";
};

/**
 * Extract context from a scenario prompt
 * @param {string} prompt - The scenario prompt
 * @returns {string} - Extracted context
 */
const extractContextFromPrompt = (prompt) => {
  try {
    if (!prompt) return "";

    // Ensure prompt is a string
    const safePrompt = String(prompt);

    // For now, just return the prompt as the context
    // In a more advanced implementation, this could use NLP to extract key elements
    return safePrompt;
  } catch (error) {
    console.error("Error in extractContextFromPrompt:", error);
    return prompt ? String(prompt) : "";
  }
};

/**
 * Generate updated context based on the current arc and recent messages
 * @param {Object} currentArc - The current story arc
 * @param {string} recentContent - Combined content from recent messages
 * @returns {string} - Updated context
 */
const generateUpdatedContext = (currentArc, recentContent) => {
  if (!currentArc || !recentContent) return currentArc.currentContext || "";

  // Start with the current context
  let updatedContext = currentArc.currentContext;

  // Get scenario data
  const scenarioData = getScenarioData(currentArc.title, currentArc.theme);

  // If we have scenario data, use it to generate context based on the current phase
  if (scenarioData) {
    // Check if we have phase-specific context in the scenario data
    if (
      scenarioData.phaseContexts &&
      scenarioData.phaseContexts[currentArc.currentPhase]
    ) {
      updatedContext = scenarioData.phaseContexts[currentArc.currentPhase];
    } else {
      // Generate context based on theme and phase
      if (currentArc.theme === "superhero") {
        if (currentArc.currentPhase === "conflict") {
          if (
            recentContent.includes("civilian") ||
            recentContent.includes("rescue")
          ) {
            updatedContext = `The battle rages on. Civilians are in danger and need to be evacuated. The heroes are fighting to protect the people while dealing with the ongoing threat.`;
          } else if (
            recentContent.includes("damage") ||
            recentContent.includes("destruction")
          ) {
            updatedContext = `Parts of the area have been damaged by the attack. The heroes are working to contain the destruction while fighting back against the threat. They need to find a way to stop the enemy before more damage is done.`;
          }
        } else if (currentArc.currentPhase === "planning") {
          updatedContext = `The team has gained some ground against the enemy forces. Now they need to analyze their opponent's tactics to find a weakness. They need a plan to defeat the main threat once and for all.`;
        } else if (currentArc.currentPhase === "climax") {
          updatedContext = `The heroes have identified the enemy's weakness and are preparing for a final confrontation. This will be the decisive battle that determines the fate of everyone involved.`;
        } else if (currentArc.currentPhase === "resolution") {
          updatedContext = `The threat has been neutralized. The heroes can now reflect on their victory and begin the process of rebuilding and recovery.`;
        }
      } else if (currentArc.theme === "fantasy") {
        if (currentArc.currentPhase === "introduction") {
          updatedContext = `The party is beginning their quest, getting to know one another and preparing for the journey ahead.`;
        } else if (currentArc.currentPhase === "discovery") {
          updatedContext = `The adventurers have found important clues that point them toward their goal. The path ahead is becoming clearer, though dangers still lurk in the shadows.`;
        } else if (currentArc.currentPhase === "conflict") {
          updatedContext = `The party faces significant opposition. Enemies or obstacles block their path, and they must use all their skills and magic to overcome these challenges.`;
        } else if (currentArc.currentPhase === "climax") {
          updatedContext = `The final challenge lies before them. Everything they've learned and every skill they've honed will be put to the test in this decisive moment.`;
        } else if (currentArc.currentPhase === "resolution") {
          updatedContext = `The quest has been completed. The party celebrates their victory, divides their rewards, and considers what adventures might lie ahead.`;
        }
      } else if (currentArc.theme === "scifi") {
        if (currentArc.currentPhase === "introduction") {
          updatedContext = `The crew is aboard their spacecraft, receiving their mission briefing and checking systems. The vastness of space awaits them.`;
        } else if (currentArc.currentPhase === "discovery") {
          updatedContext = `Unusual readings have been detected. The crew is investigating the anomaly, collecting data and forming hypotheses about its nature.`;
        } else if (currentArc.currentPhase === "conflict") {
          updatedContext = `An unexpected threat has emerged. The crew must respond quickly to survive, using their technology and expertise to address the crisis.`;
        } else if (currentArc.currentPhase === "climax") {
          updatedContext = `The final challenge approaches - a critical system failure, a confrontation with the main antagonist, or a race against time to prevent catastrophe.`;
        } else if (currentArc.currentPhase === "resolution") {
          updatedContext = `The mission is complete. The crew has survived and succeeded, though perhaps changed by their experiences. They prepare for the journey home or their next assignment.`;
        }
      }
    }
  }

  return updatedContext;
};
