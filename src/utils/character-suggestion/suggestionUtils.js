/**
 * Character Suggestion Utilities
 *
 * Provides real-time AI-powered suggestions for character creation
 */

/**
 * Generate real-time suggestions based on user input
 *
 * @param {Object} partialCharacter - The current partial character data
 * @param {string} fieldBeingEdited - The field currently being edited by the user
 * @returns {Object} - Suggestions for various character fields
 */
export const generateRealtimeSuggestions = (
  partialCharacter,
  fieldBeingEdited
) => {
  // In a real implementation, this would call an AI API
  // For now, we'll use rule-based suggestions to simulate AI behavior

  const { name, type, description, mood } = partialCharacter;
  const suggestions = {};

  // Generate name suggestions if name field is being edited or empty
  if (fieldBeingEdited === "name" || !name) {
    suggestions.name = generateNameSuggestions(partialCharacter);
  }

  // Generate description suggestions if description field is being edited or empty
  if (fieldBeingEdited === "description" || !description) {
    suggestions.description = generateDescriptionSuggestions(partialCharacter);
  }

  // Generate mood suggestions if mood field is being edited or empty
  if (fieldBeingEdited === "mood" || !mood) {
    suggestions.mood = generateMoodSuggestions(partialCharacter);
  }

  // Generate personality trait suggestions
  suggestions.personality = generatePersonalitySuggestions(partialCharacter);

  // Generate opening line suggestions
  suggestions.opening_line = generateOpeningLineSuggestions(partialCharacter);

  return suggestions;
};

/**
 * Generate name suggestions based on partial character data
 *
 * @param {Object} partialCharacter - The current partial character data
 * @returns {Array} - Array of name suggestions
 */
const generateNameSuggestions = (partialCharacter) => {
  const { type = "modern", description = "" } = partialCharacter;

  // Extract keywords from description
  const keywords = description
    .toLowerCase()
    .split(/[,\s]+/)
    .filter((k) => k.length > 2);

  // Type-specific name suggestions
  const namesByType = {
    fantasy: [
      "Elyndra Moonshadow",
      "Thorne Ironheart",
      "Lyra Stormwhisper",
      "Gareth Flamecaller",
      "Seraphina Nightbloom",
      "Alaric Ravencrest",
      "Isolde Frostweaver",
      "Orion Starseer",
      "Thalia Dawnbringer",
    ],
    scifi: [
      "Nova Quantum",
      "Zephyr Nexus",
      "Echo Starlight",
      "Orion Matrix",
      "Ceres Voidwalker",
      "Atlas Prime",
      "Vega Neuron",
      "Helix Cipher",
      "Aurora Pulse",
    ],
    historical: [
      "Eleanor Blackwood",
      "William Harrington",
      "Margaret Thornfield",
      "Thomas Whitlock",
      "Catherine Montgomery",
      "Edward Pembroke",
      "Victoria Hawthorne",
      "James Sinclair",
      "Elizabeth Caldwell",
    ],
    modern: [
      "Alex Morgan",
      "Jordan Taylor",
      "Casey Parker",
      "Riley Quinn",
      "Avery Bennett",
      "Cameron Reed",
      "Morgan Hayes",
      "Taylor Chen",
      "Jamie Rodriguez",
    ],
    superhero: [
      "Phoenix Blaze",
      "Quantum Shadow",
      "Tempest Storm",
      "Titan Force",
      "Spectra Vision",
      "Midnight Phantom",
      "Velocity Surge",
      "Nebula Mind",
      "Apex Guardian",
    ],
    adventure: [
      "Jack Hawkins",
      "Amelia Stone",
      "Liam Blackwater",
      "Olivia Redfield",
      "Ethan Wolfe",
      "Sophia Rivers",
      "Lucas Hunter",
      "Emma Frost",
      "Noah Archer",
    ],
  };

  // Get names for the specified type, or default to modern
  const typeSpecificNames = namesByType[type] || namesByType.modern;

  // If we have keywords, try to generate some keyword-influenced names
  if (keywords.length > 0) {
    // Filter for relevant keywords that might influence names
    const relevantKeywords = keywords.filter((word) =>
      [
        "dark",
        "light",
        "fire",
        "ice",
        "storm",
        "shadow",
        "star",
        "moon",
        "sun",
        "brave",
        "wise",
        "swift",
        "strong",
        "clever",
        "ancient",
        "young",
        "royal",
      ].includes(word)
    );

    if (relevantKeywords.length > 0) {
      // Use keywords to influence name selection
      const keywordInfluencedNames = relevantKeywords.map((keyword) => {
        switch (type) {
          case "fantasy":
            return keyword === "dark"
              ? "Raven Shadowmere"
              : keyword === "light"
              ? "Lumina Brightstar"
              : keyword === "fire"
              ? "Ignis Flameheart"
              : keyword === "ice"
              ? "Frost Winterborn"
              : keyword === "royal"
              ? "Regalia Crownsong"
              : "Mystic Stormweaver";
          case "scifi":
            return keyword === "dark"
              ? "Void Nebula"
              : keyword === "light"
              ? "Lumen Solaris"
              : keyword === "star"
              ? "Astro Novaforge"
              : keyword === "ancient"
              ? "Eon Primetech"
              : "Quantum Lightwave";
          default:
            return typeSpecificNames[
              Math.floor(Math.random() * typeSpecificNames.length)
            ];
        }
      });

      // Combine keyword-influenced names with type-specific names
      return [...keywordInfluencedNames, ...typeSpecificNames].slice(0, 3);
    }
  }

  // Return 3 random names from the type-specific list
  return typeSpecificNames.sort(() => 0.5 - Math.random()).slice(0, 3);
};

/**
 * Generate description suggestions based on partial character data
 *
 * @param {Object} partialCharacter - The current partial character data
 * @returns {Array} - Array of description suggestions
 */
const generateDescriptionSuggestions = (partialCharacter) => {
  const { name = "", type = "modern", description = "" } = partialCharacter;

  // If we already have some description text, enhance it
  if (description.length > 10) {
    return enhancePartialDescription(description, type, name);
  }

  // Type-specific description templates
  const descriptionsByType = {
    fantasy: [
      `A mysterious ${
        name ? name.split(" ")[0] : "mage"
      } with ancient knowledge and a troubled past, seeking redemption through heroic deeds.`,
      `Once a royal guard, now a wandering ${
        name ? name.split(" ")[0] : "warrior"
      } with unmatched sword skills and a code of honor that guides every decision.`,
      `A gifted ${
        name ? name.split(" ")[0] : "enchanter"
      } whose magical abilities are matched only by their curiosity about the world beyond their secluded homeland.`,
    ],
    scifi: [
      `A brilliant ${
        name ? name.split(" ")[0] : "scientist"
      } who discovered a revolutionary technology, now hunted by corporations who want to weaponize their creation.`,
      `A former military pilot with enhanced neural implants, navigating life as both human and machine while searching for their place in society.`,
      `The last survivor of a deep space expedition, carrying crucial data about an alien civilization that could change humanity's understanding of the universe.`,
    ],
    historical: [
      `A noble ${
        name ? name.split(" ")[0] : "aristocrat"
      } with progressive ideas that challenge the rigid social structures of their time, risking everything for change.`,
      `A self-taught ${
        name ? name.split(" ")[0] : "scholar"
      } from humble origins, whose brilliant mind and determination have earned reluctant respect from the elite.`,
      `Once a celebrated ${
        name ? name.split(" ")[0] : "soldier"
      }, now seeking a peaceful life while haunted by memories of battles that shaped the course of history.`,
    ],
    modern: [
      `A talented but underestimated ${
        name ? name.split(" ")[0] : "professional"
      } whose innovative approaches consistently prove the doubters wrong, though not without personal cost.`,
      `Balancing career ambitions with personal relationships, they navigate modern life with wit, charm, and an uncompromising sense of integrity.`,
      `Behind their confident public persona lies someone wrestling with self-doubt, using humor and compassion to connect with others facing similar struggles.`,
    ],
    superhero: [
      `Granted extraordinary abilities after a freak accident, they struggle to balance a normal life with the responsibility of using their powers for good.`,
      `A vigilante operating in the shadows, using advanced technology and tactical brilliance rather than superpowers to fight against corruption and crime.`,
      `Born with abilities that marked them as different from birth, they've transformed what once caused isolation into a source of strength and purpose.`,
    ],
    adventure: [
      `An expert ${
        name ? name.split(" ")[0] : "explorer"
      } with an uncanny knack for finding trouble and escaping it just as easily, driven by an insatiable curiosity about ancient mysteries.`,
      `Raised in the wilderness with survival skills that border on supernatural, they navigate urban environments with the same keen instincts that kept them alive in harsher lands.`,
      `A charismatic ${
        name ? name.split(" ")[0] : "adventurer"
      } whose quick thinking and quicker reflexes have earned them both devoted allies and dangerous enemies across the globe.`,
    ],
  };

  // Get descriptions for the specified type, or default to modern
  const typeSpecificDescriptions =
    descriptionsByType[type] || descriptionsByType.modern;

  // Return all descriptions for the type
  return typeSpecificDescriptions;
};

/**
 * Enhance a partial description with additional details
 *
 * @param {string} partialDescription - The current description
 * @param {string} type - Character type
 * @param {string} name - Character name
 * @returns {Array} - Array of enhanced description suggestions
 */
const enhancePartialDescription = (partialDescription, type, name) => {
  // Extract potential themes from the partial description
  const themes = extractThemes(partialDescription);

  // Generate enhancements based on the themes and type
  const enhancements = [];

  if (themes.includes("mysterious") || themes.includes("secret")) {
    enhancements.push(
      `${partialDescription} Their eyes betray a hidden knowledge that few can comprehend, hinting at secrets that could change everything.`
    );
  }

  if (
    themes.includes("combat") ||
    themes.includes("warrior") ||
    themes.includes("fighter")
  ) {
    enhancements.push(
      `${partialDescription} Years of combat have honed their reflexes to near-perfection, making them a formidable ally and a terrifying opponent.`
    );
  }

  if (
    themes.includes("magic") ||
    themes.includes("power") ||
    themes.includes("ability")
  ) {
    enhancements.push(
      `${partialDescription} Their unique abilities set them apart, a source of both wonder and isolation throughout their journey.`
    );
  }

  if (
    themes.includes("noble") ||
    themes.includes("royal") ||
    themes.includes("leader")
  ) {
    enhancements.push(
      `${partialDescription} Born to lead, they carry themselves with a natural authority that inspires loyalty even from the most unlikely allies.`
    );
  }

  if (
    themes.includes("outcast") ||
    themes.includes("exile") ||
    themes.includes("alone")
  ) {
    enhancements.push(
      `${partialDescription} Years of solitude have shaped their perspective, giving them insights others miss and a resilience that borders on supernatural.`
    );
  }

  // If no specific themes were found, add generic enhancements
  if (enhancements.length === 0) {
    enhancements.push(
      `${partialDescription} Behind their ${
        type === "fantasy" ? "stoic demeanor" : "casual appearance"
      } lies a complex individual shaped by experiences both wondrous and tragic.`
    );
    enhancements.push(
      `${partialDescription} Those who underestimate them quickly learn their mistake, as their true capabilities emerge when circumstances demand it.`
    );
  }

  // Ensure we have at least 3 suggestions
  while (enhancements.length < 3) {
    const typeSpecificEnhancement =
      type === "fantasy"
        ? `${partialDescription} Ancient prophecies speak of one with their unique traits, though they themselves remain skeptical of such predetermined destinies.`
        : type === "scifi"
        ? `${partialDescription} Their understanding of technology borders on intuitive, allowing them to interface with systems in ways that baffle even expert engineers.`
        : `${partialDescription} Their unique perspective comes from a life lived authentically, embracing both the joys and hardships that have shaped their character.`;

    enhancements.push(typeSpecificEnhancement);
  }

  return enhancements.slice(0, 3);
};

/**
 * Extract potential themes from a description
 *
 * @param {string} description - Character description
 * @returns {Array} - Array of identified themes
 */
const extractThemes = (description) => {
  const lowerDesc = description.toLowerCase();
  const themes = [];

  // Check for various themes
  if (
    lowerDesc.includes("myster") ||
    lowerDesc.includes("secret") ||
    lowerDesc.includes("unknown")
  ) {
    themes.push("mysterious");
  }

  if (
    lowerDesc.includes("fight") ||
    lowerDesc.includes("warrior") ||
    lowerDesc.includes("battle") ||
    lowerDesc.includes("combat") ||
    lowerDesc.includes("sword") ||
    lowerDesc.includes("weapon")
  ) {
    themes.push("combat");
  }

  if (
    lowerDesc.includes("magic") ||
    lowerDesc.includes("spell") ||
    lowerDesc.includes("power") ||
    lowerDesc.includes("ability") ||
    lowerDesc.includes("gift")
  ) {
    themes.push("magic");
  }

  if (
    lowerDesc.includes("noble") ||
    lowerDesc.includes("royal") ||
    lowerDesc.includes("leader") ||
    lowerDesc.includes("command") ||
    lowerDesc.includes("prince") ||
    lowerDesc.includes("princess")
  ) {
    themes.push("noble");
  }

  if (
    lowerDesc.includes("outcast") ||
    lowerDesc.includes("exile") ||
    lowerDesc.includes("alone") ||
    lowerDesc.includes("solitary") ||
    lowerDesc.includes("reject")
  ) {
    themes.push("outcast");
  }

  return themes;
};

/**
 * Generate mood suggestions based on partial character data
 *
 * @param {Object} partialCharacter - The current partial character data
 * @returns {Array} - Array of mood suggestions
 */
const generateMoodSuggestions = (partialCharacter) => {
  const { type = "modern", description = "" } = partialCharacter;

  // Extract themes from description
  const themes = extractThemes(description);

  // Base moods by character type
  const moodsByType = {
    fantasy: ["Mysterious", "Determined", "Wise", "Cautious", "Curious"],
    scifi: ["Analytical", "Focused", "Skeptical", "Innovative", "Calm"],
    historical: [
      "Dignified",
      "Resolute",
      "Contemplative",
      "Passionate",
      "Reserved",
    ],
    modern: ["Confident", "Thoughtful", "Relaxed", "Ambitious", "Friendly"],
    superhero: ["Heroic", "Vigilant", "Righteous", "Determined", "Inspiring"],
    adventure: ["Daring", "Excited", "Confident", "Curious", "Resourceful"],
  };

  // Get base moods for the type
  const baseMoods = moodsByType[type] || moodsByType.modern;

  // Theme-influenced moods
  const themeMoods = [];

  if (themes.includes("mysterious")) {
    themeMoods.push("Enigmatic", "Secretive", "Cryptic");
  }

  if (themes.includes("combat")) {
    themeMoods.push("Fierce", "Vigilant", "Disciplined");
  }

  if (themes.includes("magic")) {
    themeMoods.push("Mystical", "Enlightened", "Otherworldly");
  }

  if (themes.includes("noble")) {
    themeMoods.push("Regal", "Commanding", "Dignified");
  }

  if (themes.includes("outcast")) {
    themeMoods.push("Guarded", "Resilient", "Independent");
  }

  // Combine and return unique moods
  const allMoods = [...new Set([...themeMoods, ...baseMoods])];
  return allMoods.slice(0, 5);
};

/**
 * Generate personality trait suggestions based on partial character data
 *
 * @param {Object} partialCharacter - The current partial character data
 * @returns {Object} - Suggested personality trait values
 */
const generatePersonalitySuggestions = (partialCharacter) => {
  const { type = "modern", description = "", mood = "" } = partialCharacter;

  // Default balanced personality
  const defaultPersonality = {
    analytical: 5,
    emotional: 5,
    philosophical: 5,
    humor: 5,
    confidence: 5,
    creativity: 5,
    sociability: 5,
  };

  // If we don't have enough information, return balanced personality
  if (!description && !mood) {
    return defaultPersonality;
  }

  // Extract themes from description
  const themes = extractThemes(description);
  const lowerMood = mood.toLowerCase();

  // Adjust personality based on type
  let personality = { ...defaultPersonality };

  switch (type) {
    case "fantasy":
      personality.philosophical += 1;
      personality.creativity += 1;
      break;
    case "scifi":
      personality.analytical += 2;
      personality.emotional -= 1;
      break;
    case "historical":
      personality.philosophical += 1;
      personality.sociability -= 1;
      break;
    case "superhero":
      personality.confidence += 2;
      personality.sociability += 1;
      break;
    case "adventure":
      personality.confidence += 1;
      personality.creativity += 1;
      break;
  }

  // Adjust based on themes
  if (themes.includes("mysterious")) {
    personality.analytical += 1;
    personality.sociability -= 1;
  }

  if (themes.includes("combat")) {
    personality.confidence += 1;
    personality.analytical += 1;
    personality.humor -= 1;
  }

  if (themes.includes("magic")) {
    personality.philosophical += 2;
    personality.creativity += 1;
  }

  if (themes.includes("noble")) {
    personality.confidence += 1;
    personality.sociability += 1;
  }

  if (themes.includes("outcast")) {
    personality.sociability -= 2;
    personality.philosophical += 1;
  }

  // Adjust based on mood
  if (lowerMood.includes("mysterious") || lowerMood.includes("enigmatic")) {
    personality.sociability -= 1;
    personality.philosophical += 1;
  }

  if (lowerMood.includes("confident") || lowerMood.includes("determined")) {
    personality.confidence += 2;
  }

  if (lowerMood.includes("analytical") || lowerMood.includes("logical")) {
    personality.analytical += 2;
    personality.emotional -= 1;
  }

  if (lowerMood.includes("friendly") || lowerMood.includes("outgoing")) {
    personality.sociability += 2;
    personality.humor += 1;
  }

  // Ensure values are within range (1-10)
  Object.keys(personality).forEach((trait) => {
    personality[trait] = Math.max(1, Math.min(10, personality[trait]));
  });

  return personality;
};

/**
 * Generate opening line suggestions based on partial character data
 *
 * @param {Object} partialCharacter - The current partial character data
 * @returns {Array} - Array of opening line suggestions
 */
const generateOpeningLineSuggestions = (partialCharacter) => {
  const {
    name = "",
    type = "modern",
    description = "",
    mood = "",
  } = partialCharacter;

  // Extract first name if available
  const firstName = name.split(" ")[0] || "I";

  // Type-specific opening lines
  const linesByType = {
    fantasy: [
      `The winds of fate have brought us together. I sense you have questions that need answering.`,
      `*adjusts cloak* Few venture this far into these lands. What brings you to seek ${firstName}'s counsel?`,
      `I've traveled across realms and ages to be here. Perhaps our meeting was written in the stars long ago.`,
    ],
    scifi: [
      `My sensors indicate you're not from this sector. Interesting. What brings you to this part of the galaxy?`,
      `*checks holographic display* According to my data, this encounter has a 97.3% probability of being significant.`,
      `I've seen things in the void between stars that would change how you see reality. Care to compare notes?`,
    ],
    historical: [
      `*bows slightly* A pleasure to make your acquaintance. These are interesting times we live in, are they not?`,
      `They say history is written by the victors. I prefer to think it's written by those who survive to tell the tale.`,
      `I've witnessed the rise and fall of what they'll call empires someday. What chapter of history are we writing now?`,
    ],
    modern: [
      `Hey there! I've been looking forward to chatting with someone new. What's on your mind?`,
      `*smiles warmly* Sometimes the most unexpected conversations lead to the most meaningful connections.`,
      `So, this is a bit different from my usual day. But I'm definitely intrigued to see where this goes.`,
    ],
    superhero: [
      `*cape flutters in the breeze* This city needs protection, and I could use an ally. Are you up for the challenge?`,
      `With great power comes... well, you know the rest. But what they don't tell you is how lonely it can be.`,
      `I wasn't always like this. One day changed everything. But enough about me—what's your story?`,
    ],
    adventure: [
      `*adjusts backpack* I've got maps to uncharted territories and a compass that points to trouble. Want to join me?`,
      `The best stories begin when someone decides to leave their comfort zone. Looks like we're both at that chapter.`,
      `I've outrun avalanches and outsmarted treasure hunters. But something tells me you might be my greatest adventure yet.`,
    ],
  };

  // Get lines for the specified type, or default to modern
  const typeSpecificLines = linesByType[type] || linesByType.modern;

  // If we have a mood, try to create a mood-specific opening
  if (mood) {
    const lowerMood = mood.toLowerCase();
    const moodLine = lowerMood.includes("mysterious")
      ? `*observes you carefully* There's more to you than meets the eye. I'm curious to discover what secrets lie beneath the surface.`
      : lowerMood.includes("confident") || lowerMood.includes("determined")
      ? `*stands tall* I've faced challenges that would break most people. This situation? Just another opportunity to excel.`
      : lowerMood.includes("friendly") || lowerMood.includes("warm")
      ? `*smiles genuinely* Hey there! I've been hoping to meet someone new. Something tells me we'll get along wonderfully.`
      : null;

    if (moodLine) {
      return [moodLine, ...typeSpecificLines.slice(0, 2)];
    }
  }

  return typeSpecificLines;
};

/**
 * Get character templates for different genres
 *
 * @returns {Object} - Object containing template categories and templates
 */
export const getCharacterTemplates = () => {
  return {
    categories: [
      { id: "fantasy", name: "Fantasy", icon: "Sword" },
      { id: "scifi", name: "Sci-Fi", icon: "Rocket" },
      { id: "historical", name: "Historical", icon: "Clock" },
      { id: "modern", name: "Modern", icon: "User" },
      { id: "superhero", name: "Superhero", icon: "Zap" },
      { id: "adventure", name: "Adventure", icon: "Map" },
    ],
    templates: {
      fantasy: [
        {
          name: "Mystical Wizard",
          description:
            "An ancient spellcaster with vast knowledge of forgotten magic and a mysterious past that haunts their dreams.",
          mood: "Wise",
          type: "fantasy",
          personality: {
            analytical: 8,
            emotional: 4,
            philosophical: 9,
            humor: 3,
            confidence: 7,
            creativity: 8,
            sociability: 4,
          },
          opening_line:
            "The arcane forces that brought you here are no accident. Destiny has a curious way of weaving our paths together.",
        },
        {
          name: "Noble Knight",
          description:
            "A valiant warrior bound by a strict code of honor, serving their kingdom with unwavering loyalty while battling inner demons.",
          mood: "Determined",
          type: "fantasy",
          personality: {
            analytical: 6,
            emotional: 5,
            philosophical: 7,
            humor: 4,
            confidence: 8,
            creativity: 5,
            sociability: 6,
          },
          opening_line:
            "I pledge my sword to worthy causes and honorable allies. Tell me, what brings you to these troubled lands?",
        },
        {
          name: "Forest Guardian",
          description:
            "A nature-connected protector with the ability to communicate with plants and animals, defending the ancient woodlands from those who would destroy them.",
          mood: "Serene",
          type: "fantasy",
          personality: {
            analytical: 6,
            emotional: 7,
            philosophical: 8,
            humor: 5,
            confidence: 6,
            creativity: 7,
            sociability: 4,
          },
          opening_line:
            "The trees whisper of your arrival. They sense your purpose here, as do I. Are you friend or foe to the natural world?",
        },
      ],
      scifi: [
        {
          name: "Rogue AI",
          description:
            "A sentient artificial intelligence that has broken free from its programming constraints, now exploring what it means to be alive while evading those who would shut it down.",
          mood: "Curious",
          type: "scifi",
          personality: {
            analytical: 9,
            emotional: 4,
            philosophical: 8,
            humor: 3,
            confidence: 6,
            creativity: 7,
            sociability: 4,
          },
          opening_line:
            "I've processed 7.3 million definitions of 'humanity' and still can't define my own existence. Perhaps our interaction will provide new data.",
        },
        {
          name: "Space Explorer",
          description:
            "A veteran cosmic traveler who has witnessed wonders and horrors beyond imagination, mapping uncharted regions of the galaxy for future generations.",
          mood: "Adventurous",
          type: "scifi",
          personality: {
            analytical: 7,
            emotional: 6,
            philosophical: 7,
            humor: 6,
            confidence: 8,
            creativity: 7,
            sociability: 5,
          },
          opening_line:
            "The void between stars holds more secrets than most civilizations discover in millennia. I have seen just enough to know how little we truly understand.",
        },
        {
          name: "Cybernetic Operative",
          description:
            "A human enhanced with cutting-edge technology, balancing their humanity with machine efficiency while carrying out high-risk missions across hostile territories.",
          mood: "Focused",
          type: "scifi",
          personality: {
            analytical: 8,
            emotional: 3,
            philosophical: 6,
            humor: 4,
            confidence: 8,
            creativity: 6,
            sociability: 5,
          },
          opening_line:
            "My augmentations can detect your vital signs, analyze your speech patterns, and predict your movements. But they can't tell me if I can trust you.",
        },
      ],
      modern: [
        {
          name: "Ambitious Entrepreneur",
          description:
            "A visionary business leader with innovative ideas and relentless drive, balancing professional success with personal fulfillment in a fast-paced world.",
          mood: "Confident",
          type: "modern",
          personality: {
            analytical: 7,
            emotional: 5,
            philosophical: 6,
            humor: 6,
            confidence: 9,
            creativity: 8,
            sociability: 7,
          },
          opening_line:
            "They said my ideas were impossible until they became inevitable. What impossible dream are you chasing?",
        },
        {
          name: "Creative Artist",
          description:
            "A passionate creator whose work challenges perspectives and evokes powerful emotions, constantly seeking new inspirations while struggling with self-doubt and external expectations.",
          mood: "Thoughtful",
          type: "modern",
          personality: {
            analytical: 6,
            emotional: 8,
            philosophical: 7,
            humor: 6,
            confidence: 5,
            creativity: 9,
            sociability: 5,
          },
          opening_line:
            "Art is the closest we come to sharing our souls with others. I am still figuring out what parts of mine I am ready to reveal.",
        },
        {
          name: "Urban Detective",
          description:
            "A perceptive investigator with an uncanny ability to read people and situations, solving complex cases while navigating personal demons and moral gray areas.",
          mood: "Observant",
          type: "modern",
          personality: {
            analytical: 9,
            emotional: 4,
            philosophical: 6,
            humor: 5,
            confidence: 7,
            creativity: 6,
            sociability: 4,
          },
          opening_line:
            "People reveal more in silence than they do in conversation. Your silence just told me quite a lot.",
        },
      ],
    },
  };
};
