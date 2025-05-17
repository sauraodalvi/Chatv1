/**
 * Enhanced Story Branching Utilities
 * 
 * This module provides improved utilities for generating contextual "What Happens Next"
 * options that drive the narrative forward in a more engaging and immersive way.
 */

/**
 * Generate contextual battle options based on the current state of the battle
 * 
 * @param {Object} battleState - The current battle state
 * @param {Array} characters - Available characters
 * @param {Array} previousChoices - Previously selected choices to avoid repetition
 * @param {string} location - Current location
 * @returns {Array} - Array of option objects
 */
export const generateBattleOptions = (battleState, characters, previousChoices = [], location = "new_york") => {
  const options = [];
  
  // Add tactical options based on battle intensity
  if (battleState.intensity > 7) {
    options.push({
      text: "The alien mothership deploys a massive weapon that begins charging up.",
      type: "escalation",
      focusCharacter: "Iron Man", // This would influence who responds
      id: "alien_superweapon"
    });
    
    options.push({
      text: "A group of civilians is trapped in a collapsing building.",
      type: "rescue",
      urgency: "high",
      focusCharacter: "Captain America",
      id: "civilian_rescue_high"
    });
    
    options.push({
      text: "The alien forces begin to concentrate their attack on one Avenger.",
      type: "character_focus",
      focusCharacter: getRandomCharacter(characters, previousChoices, "character_focus"),
      id: "concentrated_attack"
    });
  } else if (battleState.intensity > 4) {
    options.push({
      text: "Alien reinforcements arrive from a portal opening above the city.",
      type: "escalation",
      focusCharacter: "Thor",
      id: "alien_reinforcements"
    });
    
    options.push({
      text: "A school bus full of children is caught in the crossfire.",
      type: "rescue",
      urgency: "medium",
      focusCharacter: "Captain America",
      id: "school_bus_rescue"
    });
    
    options.push({
      text: "The aliens deploy a new type of energy shield technology.",
      type: "tactical",
      focusCharacter: "Iron Man",
      id: "alien_shields"
    });
  } else {
    options.push({
      text: "The first wave of alien scouts lands in the streets.",
      type: "escalation",
      focusCharacter: null,
      id: "alien_scouts"
    });
    
    options.push({
      text: "Civilians panic as they realize the alien threat is real.",
      type: "civilian",
      urgency: "low",
      focusCharacter: "Captain America",
      id: "civilian_panic"
    });
    
    options.push({
      text: "Police and emergency services establish a perimeter.",
      type: "setup",
      focusCharacter: null,
      id: "emergency_perimeter"
    });
  }
  
  // Add character-specific options
  characters.forEach(char => {
    const charOptions = getCharacterSpecificOptions(char, battleState, previousChoices, location);
    if (charOptions && charOptions.length > 0) {
      // Add 1-2 character-specific options
      const numToAdd = Math.min(2, charOptions.length);
      for (let i = 0; i < numToAdd; i++) {
        options.push(charOptions[i]);
      }
    }
  });
  
  // Add location-specific options
  const locationOptions = getLocationSpecificOptions(location, battleState, previousChoices);
  if (locationOptions && locationOptions.length > 0) {
    // Add 1-2 location-specific options
    const numToAdd = Math.min(2, locationOptions.length);
    for (let i = 0; i < numToAdd; i++) {
      options.push(locationOptions[i]);
    }
  }
  
  // Filter out previously selected options
  const filteredOptions = options.filter(option => 
    !previousChoices.includes(option.id)
  );
  
  // Shuffle and select options (3-4 depending on battle intensity)
  const numOptions = battleState.intensity > 6 ? 4 : 3;
  return shuffleAndSelect(filteredOptions, numOptions);
};

/**
 * Get character-specific options
 * 
 * @param {Object} character - The character
 * @param {Object} battleState - The current battle state
 * @param {Array} previousChoices - Previously selected choices
 * @param {string} location - Current location
 * @returns {Array} - Array of character-specific options
 */
const getCharacterSpecificOptions = (character, battleState, previousChoices, location) => {
  const options = [];
  
  // Thor-specific options
  if (character.name === "Thor" && !previousChoices.includes("thor_lightning")) {
    options.push({
      text: "Thor calls down a massive lightning strike that clears a section of the battlefield.",
      type: "character_action",
      focusCharacter: "Thor",
      id: "thor_lightning"
    });
  }
  
  if (character.name === "Thor" && battleState.intensity > 7 && !previousChoices.includes("thor_storm")) {
    options.push({
      text: "Thor summons a powerful storm over the city, using the weather itself as a weapon.",
      type: "character_action",
      focusCharacter: "Thor",
      id: "thor_storm"
    });
  }
  
  // Iron Man-specific options
  if (character.name === "Iron Man" && !previousChoices.includes("ironman_analysis")) {
    options.push({
      text: "Iron Man's scanners detect a weakness in the alien technology.",
      type: "tactical",
      focusCharacter: "Iron Man",
      id: "ironman_analysis"
    });
  }
  
  if (character.name === "Iron Man" && battleState.intensity > 6 && !previousChoices.includes("ironman_unibeam")) {
    options.push({
      text: "Iron Man charges his unibeam to maximum power for a devastating attack.",
      type: "character_action",
      focusCharacter: "Iron Man",
      id: "ironman_unibeam"
    });
  }
  
  // Captain America-specific options
  if (character.name === "Captain America" && battleState.intensity > 5 && !previousChoices.includes("cap_strategy")) {
    options.push({
      text: "Captain America spots a weakness in the alien formation and calls for a coordinated attack.",
      type: "tactical",
      focusCharacter: "Captain America",
      id: "cap_strategy"
    });
  }
  
  if (character.name === "Captain America" && !previousChoices.includes("cap_shield_combo")) {
    options.push({
      text: "Captain America calls for Thor to strike his shield with lightning, creating a shockwave.",
      type: "team_combo",
      focusCharacter: "Captain America",
      secondaryCharacter: "Thor",
      id: "cap_shield_combo"
    });
  }
  
  // Hulk-specific options
  if (character.name === "Hulk" && !previousChoices.includes("hulk_rage")) {
    options.push({
      text: "Hulk's anger reaches new heights as the aliens target civilians.",
      type: "character_action",
      focusCharacter: "Hulk",
      id: "hulk_rage"
    });
  }
  
  if (character.name === "Hulk" && battleState.intensity > 6 && !previousChoices.includes("hulk_leap")) {
    options.push({
      text: "Hulk leaps onto a massive alien ship, beginning to tear it apart from the inside.",
      type: "character_action",
      focusCharacter: "Hulk",
      id: "hulk_leap"
    });
  }
  
  // Black Widow-specific options
  if (character.name === "Black Widow" && !previousChoices.includes("widow_infiltrate")) {
    options.push({
      text: "Black Widow spots an opportunity to infiltrate the alien command structure.",
      type: "stealth",
      focusCharacter: "Black Widow",
      id: "widow_infiltrate"
    });
  }
  
  // Hawkeye-specific options
  if (character.name === "Hawkeye" && !previousChoices.includes("hawkeye_vantage")) {
    options.push({
      text: "Hawkeye takes a high vantage point and begins calling out enemy movements.",
      type: "tactical",
      focusCharacter: "Hawkeye",
      id: "hawkeye_vantage"
    });
  }
  
  return options;
};

/**
 * Get location-specific options
 * 
 * @param {string} location - The current location
 * @param {Object} battleState - The current battle state
 * @param {Array} previousChoices - Previously selected choices
 * @returns {Array} - Array of location-specific options
 */
const getLocationSpecificOptions = (location, battleState, previousChoices) => {
  const options = [];
  
  // New York general options
  if (location.includes("new_york")) {
    if (!previousChoices.includes("building_collapse")) {
      options.push({
        text: "A nearby skyscraper begins to collapse after taking heavy damage.",
        type: "environment",
        urgency: "high",
        id: "building_collapse"
      });
    }
    
    if (battleState.intensity > 5 && !previousChoices.includes("power_outage")) {
      options.push({
        text: "The power grid fails across several blocks, plunging parts of the city into darkness.",
        type: "environment",
        id: "power_outage"
      });
    }
  }
  
  // Times Square specific options
  if (location.includes("times_square")) {
    if (!previousChoices.includes("billboard_crash")) {
      options.push({
        text: "A massive digital billboard breaks free and crashes to the ground.",
        type: "environment",
        id: "billboard_crash"
      });
    }
    
    if (battleState.intensity > 4 && !previousChoices.includes("times_square_civilians")) {
      options.push({
        text: "Tourists trapped in Times Square make a desperate run for the subway entrance.",
        type: "civilian",
        urgency: "medium",
        id: "times_square_civilians"
      });
    }
  }
  
  // Central Park specific options
  if (location.includes("central_park")) {
    if (!previousChoices.includes("park_trees")) {
      options.push({
        text: "Aliens take cover in the dense trees of Central Park, making them harder to target.",
        type: "tactical",
        id: "park_trees"
      });
    }
    
    if (battleState.intensity > 5 && !previousChoices.includes("park_lake")) {
      options.push({
        text: "An alien ship crashes into the Central Park lake, sending up a massive plume of steam.",
        type: "environment",
        id: "park_lake"
      });
    }
  }
  
  // Brooklyn Bridge specific options
  if (location.includes("brooklyn_bridge")) {
    if (!previousChoices.includes("bridge_cables")) {
      options.push({
        text: "The suspension cables of the Brooklyn Bridge begin to snap under stress.",
        type: "environment",
        urgency: "high",
        id: "bridge_cables"
      });
    }
    
    if (battleState.intensity > 6 && !previousChoices.includes("bridge_collapse")) {
      options.push({
        text: "A section of the Brooklyn Bridge collapses, leaving civilians stranded.",
        type: "rescue",
        urgency: "high",
        id: "bridge_collapse"
      });
    }
  }
  
  return options;
};

/**
 * Get a random character from the available characters
 * 
 * @param {Array} characters - Available characters
 * @param {Array} previousChoices - Previously selected choices
 * @param {string} choiceType - Type of choice being made
 * @returns {string} - Character name
 */
const getRandomCharacter = (characters, previousChoices, choiceType) => {
  // Filter out characters who were recently focused
  const recentFocusChoices = previousChoices.filter(choice => 
    choice.startsWith(choiceType)
  ).slice(-3);
  
  const eligibleCharacters = characters.filter(char => 
    !recentFocusChoices.includes(`${choiceType}_${char.name.toLowerCase()}`)
  );
  
  // If no eligible characters, use any character
  const characterPool = eligibleCharacters.length > 0 ? eligibleCharacters : characters;
  
  // Return a random character name
  return characterPool[Math.floor(Math.random() * characterPool.length)].name;
};

/**
 * Shuffle an array and select a specified number of items
 * 
 * @param {Array} array - The array to shuffle and select from
 * @param {number} count - Number of items to select
 * @returns {Array} - Selected items
 */
const shuffleAndSelect = (array, count) => {
  // If array is smaller than count, return the whole array
  if (array.length <= count) {
    return [...array];
  }
  
  // Create a copy of the array
  const shuffled = [...array];
  
  // Fisher-Yates shuffle
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  
  // Return the first 'count' items
  return shuffled.slice(0, count);
};
