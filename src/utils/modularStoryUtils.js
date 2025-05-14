/**
 * Modular Story Utilities
 * 
 * Provides Lego-like building blocks for story architecture with:
 * - Theme switching
 * - Character/plotline swapping
 * - Reusable choice/arc/outcome logic
 */

const storyModules = {
  // Sensory description templates by theme
  sensoryDescriptions: {
    fantasy: {
      sight: ['The flickering torchlight casts long shadows', 'Moonlight filters through ancient stained glass', 'A golden glow emanates from the magical artifact'],
      sound: ['The clang of steel echoes through the hall', 'Distant chanting fills the air with arcane energy', 'The crackle of magical energy hums in your ears'],
      smell: ['The scent of old parchment and candle wax', 'A metallic tang of blood in the air', 'The sweet aroma of healing herbs'],
      touch: ['The rough texture of stone walls', 'The smooth coolness of a marble floor', 'The prickling sensation of magical energy'],
      taste: ['The bitterness of a healing potion', 'The sweetness of faerie wine', 'The saltiness of sweat on your lips']
    },
    superhero: {
      sight: ['Neon lights reflect off rain-slicked streets', 'A streak of color as a hero dashes by', 'The ominous glow of a villain's energy weapon'],
      sound: ['Sirens wail in the distance', 'The whoosh of a cape in the wind', 'The crackle of electricity from a power surge'],
      smell: ['Ozone from discharged powers', 'The acrid scent of burning metal', 'The faint perfume of a civilian bystander'],
      touch: ['The vibration of a speeding vehicle', 'The sting of concrete scraping your skin', 'The warmth of a healing factor at work'],
      taste: ['The coppery tang of blood', 'The artificial sweetness of energy drinks', 'The chalkiness of emergency rations']
    },
    noir: {
      sight: ['The flicker of a streetlamp through venetian blinds', 'Cigarette smoke curling in a dim office', 'The glint of a revolver in a desk drawer'],
      sound: ['The click of heels on wet pavement', 'The scratch of a phonograph needle', 'The muffled conversation from the next booth'],
      smell: ['Cheap whiskey and cheaper perfume', 'The musty scent of old case files', 'Gunpowder residue on a suspect's hands'],
      touch: ['The weight of a fedora pulled low', 'The slick handle of a getaway car', 'The rough texture of a suspect's stubble'],
      taste: ['The bitterness of black coffee', 'The metallic aftertaste of fear', 'The sweetness of a dame's lipstick']
    }
  },

  // Narration templates by theme and plot state
  narrationTemplates: {
    fantasy: {
      opening: ['The ancient prophecy foretold this moment', 'Legends speak of a hero like you', 'The kingdom's fate hangs in the balance'],
      rising: ['Dark forces gather at the borders', 'The artifact pulses with forbidden power', 'Your companions look to you for guidance'],
      climax: ['The final battle begins with a thunderous roar', 'Magic crackles in the air as spells collide', 'The villain reveals their true form'],
      resolution: ['The kingdom celebrates its saviors', 'The wounded land begins to heal', 'Your legend will be told for generations']
    },
    superhero: {
      opening: ['The city never sleeps, and neither do its protectors', 'An ominous alert flashes on your communicator', 'The streets whisper of a new threat'],
      rising: ['The villain's plan becomes terrifyingly clear', 'Civilians scramble for safety', 'Your team assembles for the coming storm'],
      climax: ['The skyline erupts in explosions', 'Powers clash in a dazzling display', 'The final confrontation begins'],
      resolution: ['The city begins rebuilding', 'Reporters clamor for your statement', 'You know this victory is only temporary']
    },
    noir: {
      opening: ['The case file lands on your desk with a thud', 'A dame with trouble written all over her walks in', 'The city's underbelly stirs with new activity'],
      rising: ['The pieces don't quite fit together', 'Your gut says there's more to this', 'Danger lurks in every shadow'],
      climax: ['The truth hits you like a .45', 'Betrayal cuts deeper than any knife', 'The final confrontation in a rain-soaked alley'],
      resolution: ['Justice is served, but at what cost?', 'The case is closed, but you can't forget', 'Another bottle, another unsolved mystery']
    }
  },
  themes: {
    fantasy: {
      tags: ['@setting=medieval', '@tone=epic', '@character_role=hero', '@twist_trigger=magic'],
      components: {
        locations: ['castle', 'forest', 'dungeon'],
        items: ['sword', 'potion', 'amulet'],
        events: ['quest', 'prophecy', 'battle']
      }
    },
    superhero: {
      tags: ['@setting=modern', '@tone=action', '@character_role=hero', '@twist_trigger=betrayal'],
      components: {
        locations: ['city', 'hideout', 'space'],
        items: ['gadget', 'armor', 'artifact'],
        events: ['rescue', 'fight', 'heist']
      }
    },
    noir: {
      tags: ['@setting=1940s', '@tone=mystery', '@character_role=detective', '@twist_trigger=secret'],
      components: {
        locations: ['office', 'alley', 'club'],
        items: ['gun', 'whiskey', 'photo'],
        events: ['investigation', 'ambush', 'revelation']
      }
    }
  },
  
  characters: {
    // Character templates by archetype
    archetypes: {
      hero: {
        traits: ['brave', 'determined', 'selfless'],
        motivations: ['justice', 'protection', 'redemption']
      },
      villain: {
        traits: ['ambitious', 'ruthless', 'charismatic'],
        motivations: ['power', 'revenge', 'destruction']
      },
      mentor: {
        traits: ['wise', 'patient', 'mysterious'],
        motivations: ['guidance', 'balance', 'prophecy']
      }
    },
    
    // Personality models with emotional ranges
    personalities: {
      stoic: {
        emotionalRange: {
          trust: [0, 5],
          tension: [0, 3],
          humor: [0, 2]
        },
        voice: 'terse, direct'
      },
      passionate: {
        emotionalRange: {
          trust: [0, 10],
          tension: [0, 8],
          humor: [0, 6]
        },
        voice: 'expressive, dramatic'
      },
      quirky: {
        emotionalRange: {
          trust: [0, 7],
          tension: [0, 5],
          humor: [3, 9]
        },
        voice: 'playful, unconventional'
      }
    }
  },
  
  // Reusable choice logic
  choiceSystem: {
    quickActions: {
      fantasy: ['Attack', 'Cast Spell', 'Negotiate', 'Investigate'],
      superhero: ['Fight', 'Use Power', 'Plan', 'Protect'],
      noir: ['Question', 'Threaten', 'Bribe', 'Follow']
    },
    
    intentClusters: {
      // Maps freeform input to standardized intents
      mapToIntent: (input, theme) => {
        const inputLower = input.toLowerCase();
        
        if (theme === 'fantasy') {
          if (inputLower.includes('attack') || inputLower.includes('fight')) return 'combat';
          if (inputLower.includes('cast') || inputLower.includes('magic')) return 'magic';
          if (inputLower.includes('talk') || inputLower.includes('negotiate')) return 'diplomacy';
        } 
        // Add other theme mappings
        
        return 'default';
      }
    }
  }
};

export class ModularStoryManager {
  /**
   * Get a random sensory description for current theme
   * @param {string} sense - The sense to describe (sight/sound/smell/touch/taste)
   * @returns {string} - Sensory description
   */
  getSensoryDescription(sense) {
    const descriptions = storyModules.sensoryDescriptions[this.currentTheme]?.[sense];
    if (descriptions && descriptions.length > 0) {
      // Filter descriptions based on current plot state and character emotions
      const filtered = descriptions.filter(desc => {
        // Prioritize descriptions matching current plot intensity
        const isIntense = desc.includes('!') || desc.includes('intense') || desc.includes('powerful');
        const hasTension = Object.values(this.activeCharacters).some(c => c.emotionalState.tension > 5);
        
        return hasTension ? isIntense : !isIntense;
      });
      
      return filtered.length > 0 
        ? filtered[Math.floor(Math.random() * filtered.length)]
        : descriptions[Math.floor(Math.random() * descriptions.length)];
    }
    return '';
  }

  /**
   * Get a narration snippet for current theme and plot state
   * @param {string} plotState - Current plot state (opening/rising/climax/resolution)
   * @returns {string} - Narration text
   */
  getNarration(plotState) {
    const templates = storyModules.narrationTemplates[this.currentTheme]?.[plotState];
    if (templates && templates.length > 0) {
      return templates[Math.floor(Math.random() * templates.length)];
    }
    return '';
  }

  /**
   * Generate a character action description
   * @param {string} characterId - Character ID
   * @param {string} action - Action being performed
   * @returns {string} - Formatted action description
   */
  generateCharacterAction(characterId, action) {
    if (!characterId || !action) return '';
    
    if (this.activeCharacters[characterId]) {
      const char = this.activeCharacters[characterId];
      const archetype = char.archetype;
      const personality = char.personality;
      
      // Get action style based on personality
      const actionStyles = {
        stoic: ['calmly', 'methodically', 'deliberately'],
        passionate: ['passionately', 'dramatically', 'intensely'],
        quirky: ['playfully', 'unpredictably', 'whimsically']
      };
      
      const style = actionStyles[personality]?.[Math.floor(Math.random() * actionStyles[personality].length)] || '';
      const emotionalState = char.emotionalState;
      
      // Enhance action description based on emotional state
      let emotionalModifier = '';
      if (emotionalState.tension > 5) emotionalModifier = 'nervously';
      else if (emotionalState.trust > 5) emotionalModifier = 'confidently';
      else if (emotionalState.humor > 5) emotionalModifier = 'playfully';
      
      // Clean up and format the final string
      const parts = [
        characterId,
        style,
        emotionalModifier,
        action
      ].filter(Boolean);
      
      return parts.join(' ').replace(/\s+/g, ' ').trim();
    }
    return `${characterId} ${action}`;
  }
  constructor(initialTheme = 'fantasy') {
    this.currentTheme = initialTheme;
    this.activeCharacters = {};
    this.currentPlotlines = [];
  }
  
  /**
   * Switch to a different story theme
   * @param {string} theme - New theme to activate
   */
  switchTheme(theme) {
    if (storyModules.themes[theme]) {
      this.currentTheme = theme;
      return true;
    }
    return false;
  }
  
  /**
   * Add a character to the active story
   * @param {string} id - Character ID
   * @param {string} archetype - Character archetype
   * @param {string} personality - Personality type
   */
  addCharacter(id, archetype, personality) {
    if (storyModules.characters.archetypes[archetype] && 
        storyModules.characters.personalities[personality]) {
      this.activeCharacters[id] = {
        archetype,
        personality,
        emotionalState: {
          trust: 0,
          tension: 0,
          humor: 0
        }
      };
      return true;
    }
    return false;
  }
  
  /**
   * Remove a character from the active story
   * @param {string} id - Character ID to remove
   */
  removeCharacter(id) {
    if (this.activeCharacters[id]) {
      delete this.activeCharacters[id];
      return true;
    }
    return false;
  }
  
  /**
   * Update character emotional state
   * @param {string} id - Character ID
   * @param {string} emotion - Emotion to update (trust/tension/humor)
   * @param {number} change - Amount to change by (-10 to 10)
   */
  updateCharacterEmotion(id, emotion, change) {
    if (this.activeCharacters[id] && ['trust', 'tension', 'humor'].includes(emotion)) {
      const personality = this.activeCharacters[id].personality;
      const [min, max] = storyModules.characters.personalities[personality].emotionalRange[emotion];
      
      this.activeCharacters[id].emotionalState[emotion] = Math.max(min, 
        Math.min(max, this.activeCharacters[id].emotionalState[emotion] + change));
      return true;
    }
    return false;
  }
  
  /**
   * Add a new plotline to the story
   * @param {string} plotType - Type of plotline
   * @param {Object} config - Configuration for the plotline
   */
  addPlotline(plotType, config) {
    // Implementation would vary based on plot type
    this.currentPlotlines.push({
      type: plotType,
      config,
      state: 'active'
    });
  }
  
  /**
   * Get quick actions for current theme
   * @returns {Array} - Available quick actions
   */
  getQuickActions() {
    return storyModules.choiceSystem.quickActions[this.currentTheme] || [];
  }
  
  /**
   * Interpret freeform input into standardized intent
   * @param {string} input - Player's freeform input
   * @returns {string} - Standardized intent
   */
  interpretInputIntent(input) {
    return storyModules.choiceSystem.intentClusters.mapToIntent(input, this.currentTheme);
  }
  
  /**
   * Get all active tags for current configuration
   * @returns {Array} - Active tags
   */
  getActiveTags() {
    const themeTags = storyModules.themes[this.currentTheme].tags || [];
    const characterTags = Object.values(this.activeCharacters).map(char => {
      return `@character=${char.archetype}`;
    });
    
    return [...themeTags, ...characterTags];
  }
}