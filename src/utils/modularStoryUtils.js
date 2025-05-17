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
      sight: ["The flickering torchlight casts long shadows", "Moonlight filters through ancient stained glass", "A golden glow emanates from the magical artifact"],
      sound: ["The clang of steel echoes through the hall", "Distant chanting fills the air with arcane energy", "The crackle of magical energy hums in your ears"],
      smell: ["The scent of old parchment and candle wax", "A metallic tang of blood in the air", "The sweet aroma of healing herbs"],
      touch: ["The rough texture of stone walls", "The smooth coolness of a marble floor", "The prickling sensation of magical energy"],
      taste: ["The bitterness of a healing potion", "The sweetness of faerie wine", "The saltiness of sweat on your lips"]
    },
    superhero: {
      sight: [
        "Neon lights reflect off rain-slicked streets as heroes take position",
        "A streak of red and gold as Iron Man rockets overhead",
        "The ominous blue glow of alien energy weapons illuminating the smoke",
        "Captain America's shield ricocheting between multiple targets with impossible precision",
        "Lightning arcing from Mjolnir to strike clustered enemies with devastating effect",
        "Hulk's massive green form leaping impossible distances between buildings",
        "Black Widow's Widow's Bite crackling with blue electricity as she strikes",
        "Hawkeye's specialized arrows finding their marks with unerring accuracy",
        "Civilians watching from windows as their heroes fight to protect them",
        "The distinctive red, white, and blue of the Captain's shield becoming a rallying point",
        "Shattered glass raining down from damaged skyscrapers, catching the light",
        "The Quinjet hovering above, providing tactical support and surveillance"
      ],
      sound: [
        "Sirens wail in the distance as emergency services respond to the crisis",
        "The whoosh of Thor's hammer cutting through the air",
        "The crackle of repulsor technology firing in rapid succession",
        "Hulk's earth-shaking roar echoing between Manhattan skyscrapers",
        "The distinctive ping of vibranium deflecting enemy fire",
        "The twang of Hawkeye's bowstring releasing arrow after arrow",
        "Civilians cheering as the Avengers gain the upper hand",
        "The tactical chatter of the team coordinating through comm systems",
        "The thunderous boom as Thor summons lightning from storm clouds",
        "The whine of Iron Man's boot jets as he maneuvers through the battlefield",
        "The crunch of concrete as Hulk lands from a massive leap",
        "The staccato rhythm of Black Widow's weapons finding their targets"
      ],
      smell: [
        "Ozone from discharged energy weapons and Thor's lightning",
        "The acrid scent of burning metal and concrete dust",
        "The distinctive smell of Iron Man's armor heating up during combat",
        "Smoke from damaged buildings filling the air with a choking haze",
        "The chemical tang of alien technology unlike anything on Earth",
        "The scent of rain beginning to fall on hot battlefield debris",
        "Fuel leaking from damaged vehicles creating a hazardous atmosphere",
        "The clean, sharp smell that follows Thor's lightning strikes",
        "The metallic tang of blood from minor injuries sustained in battle",
        "The smell of fire as emergency services work to contain the damage",
        "The distinctive scent of the Hudson River mixing with the chaos",
        "The smell of hot metal as Captain America's shield returns to his grip"
      ],
      touch: [
        "The vibration of Hulk's impact trembling through the ground beneath your feet",
        "The sting of concrete dust and debris against exposed skin",
        "The pressure wave from nearby explosions pushing against your body",
        "The heat radiating from recently discharged energy weapons",
        "The cool metal of tactical equipment gripped tightly in tense hands",
        "The static electricity raising the hair on your arms after Thor's lightning",
        "The rough texture of broken concrete and twisted metal all around",
        "The slick wetness of rain beginning to fall on the battlefield",
        "The firm grip of a hero pulling you to safety from danger",
        "The sharp contrast between hot and cold areas of the battlefield",
        "The weight of responsibility as civilians look to you for protection",
        "The reassuring solidity of a defensive position amid the chaos"
      ],
      taste: [
        "The coppery tang of blood from a split lip sustained in combat",
        "The chalky dust of pulverized concrete coating your mouth and throat",
        "The metallic flavor that accompanies fear and adrenaline",
        "The bitter taste of smoke from burning buildings and vehicles",
        "The artificial sweetness of energy drinks consumed during brief respites",
        "The distinctive taste of the air after Thor's lightning strikes nearby",
        "The dryness in your mouth as you catch your breath between engagements",
        "The chemical aftertaste of emergency oxygen systems and smoke filters",
        "The saltiness of sweat dripping down your face during intense combat",
        "The taste of determination as you push through exhaustion to continue",
        "The refreshing coolness of water hastily consumed during a tactical pause",
        "The taste of victory as the tide of battle finally turns in your favor"
      ]
    },
    noir: {
      sight: ["The flicker of a streetlamp through venetian blinds", "Cigarette smoke curling in a dim office", "The glint of a revolver in a desk drawer"],
      sound: ["The click of heels on wet pavement", "The scratch of a phonograph needle", "The muffled conversation from the next booth"],
      smell: ["Cheap whiskey and cheaper perfume", "The musty scent of old case files", "Gunpowder residue on a suspect hands"],
      touch: ["The weight of a fedora pulled low", "The slick handle of a getaway car", "The rough texture of a suspect stubble"],
      taste: ["The bitterness of black coffee", "The metallic aftertaste of fear", "The sweetness of a lipstick mark"]
    }
  },

  // Narration templates by theme and plot state
  narrationTemplates: {
    fantasy: {
      opening: ["The ancient prophecy foretold this moment", "Legends speak of a hero like you", "The kingdom fate hangs in the balance"],
      rising: ["Dark forces gather at the borders", "The artifact pulses with forbidden power", "Your companions look to you for guidance"],
      climax: ["The final battle begins with a thunderous roar", "Magic crackles in the air as spells collide", "The villain reveals their true form"],
      resolution: ["The kingdom celebrates its saviors", "The wounded land begins to heal", "Your legend will be told for generations"]
    },
    superhero: {
      opening: [
        "The city never sleeps, and neither do its protectors as the Avengers assemble",
        "An ominous alert flashes across Stark's systems as alien signatures appear",
        "The streets of New York whisper of a new threat as civilians point to the sky",
        "S.H.I.E.L.D. reports confirm what the team already feared - the invasion has begun",
        "Captain America's shield gleams in the sunlight as he prepares to lead the team",
        "Thor's arrival brings storm clouds gathering over Manhattan, a harbinger of the battle to come",
        "Banner reluctantly acknowledges that this is a job for the Other Guy",
        "Black Widow and Hawkeye exchange knowing glances - they've been through this before"
      ],
      rising: [
        "The alien invasion plan becomes terrifyingly clear as more portals open",
        "Civilians scramble for safety as the first buildings sustain damage",
        "The Avengers assemble in formation, each ready to deploy their unique abilities",
        "Iron Man's scanners reveal the alien mothership approaching Earth's atmosphere",
        "Captain America coordinates evacuation routes while planning the defensive strategy",
        "Thor summons lightning that illuminates the darkening sky, a show of force",
        "Hulk's roar echoes between skyscrapers as he embraces the coming battle",
        "S.H.I.E.L.D. teams establish a perimeter as the heroes move to engage"
      ],
      climax: [
        "The New York skyline erupts in explosions as the battle reaches its peak",
        "Superhuman powers clash in a dazzling display against alien technology",
        "The final confrontation begins as the team executes their desperate plan",
        "Iron Man rockets toward the mothership on what might be a one-way journey",
        "Captain America rallies the team with a speech about what they're fighting for",
        "Thor channels unprecedented power, becoming a living conduit for lightning",
        "Hulk targets the largest alien creatures, matching their strength with raw fury",
        "Black Widow and Hawkeye protect civilians while targeting critical enemy systems"
      ],
      resolution: [
        "The city begins rebuilding as the Avengers help clear the debris",
        "News reporters clamor for statements as the team stands victorious but exhausted",
        "The heroes know this victory is only temporary as they secure alien technology",
        "S.H.I.E.L.D. containment teams arrive to handle the aftermath and study the threat",
        "Captain America checks on his team members, ensuring everyone is accounted for",
        "Iron Man's damaged armor powers down as he joins the team for a well-earned rest",
        "Thor offers Asgardian insights on preventing future incursions from the stars",
        "The team shares a quiet moment together before dispersing, their bond strengthened"
      ]
    },
    noir: {
      opening: ["The case file lands on your desk with a thud", "A dame with trouble written all over her walks in", "The city underbelly stirs with new activity"],
      rising: ["The pieces do not quite fit together", "Your gut says there is more to this", "Danger lurks in every shadow"],
      climax: ["The truth hits you like a bullet", "Betrayal cuts deeper than any knife", "The final confrontation in a rain-soaked alley"],
      resolution: ["Justice is served, but at what cost?", "The case is closed, but you cannot forget", "Another bottle, another unsolved mystery"]
    }
  },
  themes: {
    fantasy: {
      tags: ["@setting=medieval", "@tone=epic", "@character_role=hero", "@twist_trigger=magic"],
      components: {
        locations: ["castle", "forest", "dungeon"],
        items: ["sword", "potion", "amulet"],
        events: ["quest", "prophecy", "battle"]
      }
    },
    superhero: {
      tags: ["@setting=modern", "@tone=action", "@character_role=hero", "@twist_trigger=betrayal"],
      components: {
        locations: ["city", "hideout", "space"],
        items: ["gadget", "armor", "artifact"],
        events: ["rescue", "fight", "heist"]
      }
    },
    noir: {
      tags: ["@setting=1940s", "@tone=mystery", "@character_role=detective", "@twist_trigger=secret"],
      components: {
        locations: ["office", "alley", "club"],
        items: ["gun", "whiskey", "photo"],
        events: ["investigation", "ambush", "revelation"]
      }
    }
  },

  characters: {
    // Character templates by archetype
    archetypes: {
      hero: {
        traits: ["brave", "determined", "selfless"],
        motivations: ["justice", "protection", "redemption"]
      },
      villain: {
        traits: ["ambitious", "ruthless", "charismatic"],
        motivations: ["power", "revenge", "destruction"]
      },
      mentor: {
        traits: ["wise", "patient", "mysterious"],
        motivations: ["guidance", "balance", "prophecy"]
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
        voice: "terse, direct"
      },
      passionate: {
        emotionalRange: {
          trust: [0, 10],
          tension: [0, 8],
          humor: [0, 6]
        },
        voice: "expressive, dramatic"
      },
      quirky: {
        emotionalRange: {
          trust: [0, 7],
          tension: [0, 5],
          humor: [3, 9]
        },
        voice: "playful, unconventional"
      }
    }
  },

  // Reusable choice logic
  choiceSystem: {
    quickActions: {
      fantasy: ["Attack", "Cast Spell", "Negotiate", "Investigate"],
      superhero: [
        "Engage Enemies",
        "Use Signature Ability",
        "Coordinate Team",
        "Protect Civilians",
        "Target Weak Point",
        "Call for Backup",
        "Deploy Special Weapon",
        "Secure Perimeter"
      ],
      noir: ["Question", "Threaten", "Bribe", "Follow"]
    },

    intentClusters: {
      // Maps freeform input to standardized intents
      mapToIntent: (input, theme) => {
        const inputLower = input.toLowerCase();

        if (theme === "fantasy") {
          if (inputLower.includes("attack") || inputLower.includes("fight")) return "combat";
          if (inputLower.includes("cast") || inputLower.includes("magic")) return "magic";
          if (inputLower.includes("talk") || inputLower.includes("negotiate")) return "diplomacy";
        }
        else if (theme === "superhero") {
          // Combat intents
          if (inputLower.includes("attack") || inputLower.includes("fight") ||
              inputLower.includes("engage") || inputLower.includes("battle"))
            return "combat";

          // Power usage intents
          if (inputLower.includes("power") || inputLower.includes("ability") ||
              inputLower.includes("shield") || inputLower.includes("hammer") ||
              inputLower.includes("repulsor") || inputLower.includes("smash") ||
              inputLower.includes("lightning"))
            return "power-usage";

          // Tactical intents
          if (inputLower.includes("plan") || inputLower.includes("coordinate") ||
              inputLower.includes("strategy") || inputLower.includes("position") ||
              inputLower.includes("tactical"))
            return "tactical";

          // Protection intents
          if (inputLower.includes("protect") || inputLower.includes("save") ||
              inputLower.includes("civilian") || inputLower.includes("rescue") ||
              inputLower.includes("evacuate"))
            return "protection";

          // Analysis intents
          if (inputLower.includes("scan") || inputLower.includes("analyze") ||
              inputLower.includes("weakness") || inputLower.includes("target") ||
              inputLower.includes("intel"))
            return "analysis";
        }
        else if (theme === "noir") {
          if (inputLower.includes("question") || inputLower.includes("interrogate")) return "investigation";
          if (inputLower.includes("threaten") || inputLower.includes("intimidate")) return "intimidation";
          if (inputLower.includes("follow") || inputLower.includes("track")) return "surveillance";
        }

        return "default";
      }
    }
  }
};

export class ModularStoryManager {
  constructor(initialTheme = 'fantasy') {
    this.currentTheme = initialTheme;
    this.activeCharacters = {};
    this.currentPlotlines = [];
  }

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
        const hasTension = Object.values(this.activeCharacters).some(c => c.emotionalState?.tension > 5);

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
      if (emotionalState?.tension > 5) emotionalModifier = 'nervously';
      else if (emotionalState?.trust > 5) emotionalModifier = 'confidently';
      else if (emotionalState?.humor > 5) emotionalModifier = 'playfully';

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