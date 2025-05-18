import { useState } from "react";
import {
  Sparkles,
  ArrowRight,
  RefreshCw,
  ArrowLeft,
  Search,
  Wand2,
  ChevronRight,
  X,
} from "lucide-react";
import {
  generateScenarioFromKeywords,
  generateCharactersForScenario,
} from "../utils/aiGenerationUtils";

const QuickScenarioSelector = ({ onStartChat, onBack }) => {
  const [keywords, setKeywords] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedScenarios, setGeneratedScenarios] = useState([]);
  const [activeTab, setActiveTab] = useState("categories"); // 'categories' or 'custom'

  // Predefined scenario categories - kept the same but will display differently
  const scenarioCategories = [
    {
      name: "Fantasy",
      keywords: "fantasy adventure magic quest",
      icon: "🧙‍♂️",
      description: "Magical journeys",
    },
    {
      name: "Sci-Fi",
      keywords: "space scifi future technology",
      icon: "🚀",
      description: "Cosmic wonders",
    },
    {
      name: "Mystery",
      keywords: "mystery detective crime investigation",
      icon: "🔍",
      description: "Perplexing cases",
    },
    {
      name: "Historical",
      keywords: "historical medieval renaissance ancient",
      icon: "📜",
      description: "Bygone eras",
    },
    {
      name: "Romance",
      keywords: "romance love relationship modern",
      icon: "❤️",
      description: "Love stories",
    },
    {
      name: "Horror",
      keywords: "horror scary supernatural survival",
      icon: "👻",
      description: "Terrifying scenarios",
    },
    {
      name: "Combat",
      keywords: "combat battle arena warrior sword duel",
      icon: "⚔️",
      description: "Fierce battles",
    },
    {
      name: "Superhero",
      keywords: "superhero powers hero villain",
      icon: "🦸‍♀️",
      description: "Extraordinary heroes",
    },
  ];

  // Generate three diverse scenarios based on keywords
  const generateScenarios = (keywordString) => {
    setIsGenerating(true);
    setKeywords(keywordString);

    // Popular franchises and their associated themes/elements
    const franchiseThemes = {
      "star wars": {
        universe: "Star Wars universe",
        settings: [
          "Tatooine desert",
          "Death Star",
          "Rebel base",
          "Imperial fleet",
          "Jedi temple",
          "Coruscant",
          "Endor moon",
          "Hoth ice planet",
        ],
        characters: [
          "Jedi Knight",
          "Sith Lord",
          "smuggler",
          "rebel pilot",
          "Imperial officer",
          "bounty hunter",
          "droid",
          "Wookiee",
        ],
        items: [
          "lightsaber",
          "blaster",
          "starship",
          "the Force",
          "hyperdrive",
          "droid",
          "Millennium Falcon",
        ],
        conflicts: [
          "Rebellion against Empire",
          "Jedi vs Sith",
          "smuggling operation",
          "space battle",
          "lightsaber duel",
          "Imperial invasion",
        ],
        themes: [
          "the Force",
          "good vs evil",
          "rebellion",
          "destiny",
          "redemption",
          "legacy",
        ],
      },
      "lord of the rings": {
        universe: "Middle-earth",
        settings: [
          "Shire",
          "Mordor",
          "Rivendell",
          "Gondor",
          "Rohan",
          "Moria mines",
          "Lothlorien forest",
        ],
        characters: [
          "hobbit",
          "wizard",
          "elf",
          "dwarf",
          "ranger",
          "orc",
          "Ringwraith",
        ],
        items: [
          "the One Ring",
          "Elvish blade",
          "mithril armor",
          "wizard staff",
          "palantir",
        ],
        conflicts: [
          "quest to destroy the Ring",
          "battle for Middle-earth",
          "siege of Gondor",
          "corruption by the Ring",
        ],
        themes: [
          "power and corruption",
          "fellowship",
          "heroism",
          "sacrifice",
          "journey",
        ],
      },
      "harry potter": {
        universe: "Wizarding World",
        settings: [
          "Hogwarts School",
          "Diagon Alley",
          "Ministry of Magic",
          "Forbidden Forest",
          "Hogsmeade village",
        ],
        characters: [
          "wizard student",
          "professor",
          "magical creature",
          "Auror",
          "Death Eater",
          "house-elf",
        ],
        items: [
          "wand",
          "broomstick",
          "potion",
          "magical artifact",
          "Marauder's Map",
          "invisibility cloak",
        ],
        conflicts: [
          "wizard duel",
          "magical tournament",
          "fight against dark magic",
          "Quidditch match",
        ],
        themes: [
          "magic",
          "friendship",
          "coming of age",
          "prejudice",
          "sacrifice",
        ],
      },
      "game of thrones": {
        universe: "Westeros",
        settings: [
          "King's Landing",
          "Winterfell",
          "The Wall",
          "Iron Islands",
          "Dorne",
          "Braavos",
        ],
        characters: [
          "noble lord",
          "knight",
          "sellsword",
          "wildling",
          "maester",
          "assassin",
        ],
        items: [
          "Valyrian steel",
          "dragon egg",
          "wildfire",
          "poison",
          "direwolf",
        ],
        conflicts: [
          "battle for the throne",
          "political intrigue",
          "house rivalry",
          "White Walker invasion",
        ],
        themes: ["power", "betrayal", "honor", "survival", "family legacy"],
      },
      marvel: {
        universe: "Marvel Universe",
        settings: [
          "New York City",
          "Avengers Tower",
          "secret lab",
          "alien planet",
          "Wakanda",
          "alternate dimension",
        ],
        characters: [
          "superhero",
          "supervillain",
          "S.H.I.E.L.D. agent",
          "mutant",
          "scientist",
          "cosmic entity",
        ],
        items: [
          "super serum",
          "Infinity Stone",
          "advanced tech",
          "magical artifact",
          "vibranium shield",
        ],
        conflicts: [
          "alien invasion",
          "superhero civil war",
          "stopping a villain's plan",
          "saving the universe",
        ],
        themes: [
          "responsibility",
          "heroism",
          "teamwork",
          "identity",
          "sacrifice",
        ],
      },
    };

    // Helper function to detect if keywords match a known franchise
    const detectFranchise = (keywords) => {
      const lowerKeywords = keywords.toLowerCase();

      // Check for exact matches first
      for (const [franchise, themes] of Object.entries(franchiseThemes)) {
        if (lowerKeywords.includes(franchise)) {
          return { franchise, themes };
        }
      }

      // Check for partial matches
      if (lowerKeywords.includes("star") && lowerKeywords.includes("wars")) {
        return { franchise: "star wars", themes: franchiseThemes["star wars"] };
      }
      if (lowerKeywords.includes("lord") && lowerKeywords.includes("rings")) {
        return {
          franchise: "lord of the rings",
          themes: franchiseThemes["lord of the rings"],
        };
      }
      if (lowerKeywords.includes("harry") && lowerKeywords.includes("potter")) {
        return {
          franchise: "harry potter",
          themes: franchiseThemes["harry potter"],
        };
      }
      if (lowerKeywords.includes("game") && lowerKeywords.includes("thrones")) {
        return {
          franchise: "game of thrones",
          themes: franchiseThemes["game of thrones"],
        };
      }
      if (
        lowerKeywords.includes("marvel") ||
        lowerKeywords.includes("avengers")
      ) {
        return { franchise: "marvel", themes: franchiseThemes["marvel"] };
      }

      return null;
    };

    // Helper function to create franchise-specific scenario
    const createFranchiseScenario = (franchise, themes, focus) => {
      // Base elements that will be in all scenarios
      const baseElements = {
        universe: themes.universe,
        setting:
          themes.settings[Math.floor(Math.random() * themes.settings.length)],
        character:
          themes.characters[
            Math.floor(Math.random() * themes.characters.length)
          ],
        item: themes.items[Math.floor(Math.random() * themes.items.length)],
        theme: themes.themes[Math.floor(Math.random() * themes.themes.length)],
      };

      // Focus-specific elements
      let focusElements = {};

      if (focus === "action") {
        const conflict =
          themes.conflicts[Math.floor(Math.random() * themes.conflicts.length)];
        focusElements = {
          title: `Battle in the ${baseElements.setting}`,
          description: `An epic ${conflict} unfolds in the ${baseElements.setting}. As a ${baseElements.character} wielding ${baseElements.item}, you must face overwhelming odds in this tale of ${baseElements.theme}.`,
          prompt: `The ${baseElements.setting} is a battlefield. You are a skilled ${baseElements.character} in the ${baseElements.universe}, and your ${baseElements.item} may be the key to victory. The enemy forces are closing in, and the fate of many depends on your courage and skill.`,
          type: "combat",
        };
      } else if (focus === "mystery") {
        focusElements = {
          title: `Mystery of the ${baseElements.setting}`,
          description: `A perplexing mystery has emerged in the ${baseElements.setting}. As a clever ${baseElements.character}, you must uncover secrets involving ${baseElements.item} in this intriguing tale of ${baseElements.theme}.`,
          prompt: `Something valuable has disappeared from the ${baseElements.setting}. As a ${baseElements.character} in the ${baseElements.universe}, your knowledge of ${baseElements.item} makes you uniquely qualified to investigate. Strange clues point to a conspiracy that could change everything.`,
          type: "mystery",
        };
      } else {
        focusElements = {
          title: `Journey Through the ${baseElements.setting}`,
          description: `A personal journey unfolds in the ${baseElements.setting}. As a ${baseElements.character} with a connection to ${baseElements.item}, you navigate relationships and discover the true meaning of ${baseElements.theme}.`,
          prompt: `The ${baseElements.setting} is where your story begins. As a ${baseElements.character} in the ${baseElements.universe}, your relationship with ${baseElements.item} has shaped who you are. Now you face choices that will test your values and reveal your true character.`,
          type: "adventure",
        };
      }

      // Franchise-specific backgrounds
      const franchiseBackgrounds = {
        "star wars": [
          "https://images.unsplash.com/photo-1579566346927-c68383817a25?q=80&w=2070&auto=format&fit=crop",
          "https://images.unsplash.com/photo-1608346128025-1896b97a6fa7?q=80&w=2070&auto=format&fit=crop",
          "https://images.unsplash.com/photo-1601814933824-fd0b574dd592?q=80&w=2012&auto=format&fit=crop",
        ],
        "lord of the rings": [
          "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?q=80&w=2069&auto=format&fit=crop",
          "https://images.unsplash.com/photo-1542273917363-3b1817f69a2d?q=80&w=2074&auto=format&fit=crop",
          "https://images.unsplash.com/photo-1536300007881-7e482242baa5?q=80&w=2070&auto=format&fit=crop",
        ],
        "harry potter": [
          "https://images.unsplash.com/photo-1551269901-5c5e14c25df7?q=80&w=2069&auto=format&fit=crop",
          "https://images.unsplash.com/photo-1551022372-0bdac482a9c7?q=80&w=2070&auto=format&fit=crop",
          "https://images.unsplash.com/photo-1618944847828-82e943c3bdb7?q=80&w=2070&auto=format&fit=crop",
        ],
        "game of thrones": [
          "https://images.unsplash.com/photo-1572742482459-e04d6cfdd6f3?q=80&w=2070&auto=format&fit=crop",
          "https://images.unsplash.com/photo-1596636478939-59fed7a083f2?q=80&w=2071&auto=format&fit=crop",
          "https://images.unsplash.com/photo-1504788363733-507549153474?q=80&w=2070&auto=format&fit=crop",
        ],
        marvel: [
          "https://images.unsplash.com/photo-1612036782180-6f0822045d55?q=80&w=2070&auto=format&fit=crop",
          "https://images.unsplash.com/photo-1560343776-97e7d202ff0e?q=80&w=2069&auto=format&fit=crop",
          "https://images.unsplash.com/photo-1569003339405-ea396a5a8a90?q=80&w=2070&auto=format&fit=crop",
        ],
      };

      // Select a background based on franchise and focus
      let background;
      if (franchiseBackgrounds[franchise]) {
        // Use a specific background based on focus (action=0, mystery=1, character=2)
        const focusIndex = focus === "action" ? 0 : focus === "mystery" ? 1 : 2;
        background = franchiseBackgrounds[franchise][focusIndex];
      } else {
        // Fallback to gradient
        background = `linear-gradient(135deg, rgba(30,30,30,0.8), rgba(10,10,10,0.9))`;
      }

      // Create a complete scenario object
      return {
        title: focusElements.title,
        description: focusElements.description,
        prompt: focusElements.prompt,
        type: focusElements.type,
        background: background,
        franchise: franchise,
      };
    };

    // Helper function to add variety to keywords for non-franchise scenarios
    const createVariation = (baseKeywords, focus) => {
      const keywords = baseKeywords
        .toLowerCase()
        .split(/[,\s]+/)
        .filter((k) => k.length > 2);

      // Add scenario-specific variations
      const variations = {
        action: [
          "battle",
          "combat",
          "fight",
          "action",
          "conflict",
          "challenge",
        ],
        mystery: [
          "mystery",
          "investigation",
          "secret",
          "puzzle",
          "intrigue",
          "conspiracy",
        ],
        character: [
          "character",
          "personal",
          "emotional",
          "relationship",
          "development",
          "backstory",
        ],
        setting: [
          "world",
          "environment",
          "location",
          "atmosphere",
          "landscape",
          "setting",
        ],
      };

      // Add 2-3 variation keywords based on focus
      const focusWords = variations[focus] || variations.action;
      const selectedWords = [];
      for (let i = 0; i < 2; i++) {
        const word = focusWords[Math.floor(Math.random() * focusWords.length)];
        if (!selectedWords.includes(word)) selectedWords.push(word);
      }

      // Create a new keyword string with the original keywords plus variations
      return [...keywords, ...selectedWords].join(" ");
    };

    // Generate 3 different scenarios with different focuses
    setTimeout(() => {
      // Check if keywords match a known franchise
      const franchiseMatch = detectFranchise(keywordString);

      let scenarios = [];

      if (franchiseMatch) {
        // Generate franchise-specific scenarios
        const { franchise, themes } = franchiseMatch;

        // Create three scenarios with different focuses but consistent franchise theming
        scenarios = [
          createFranchiseScenario(franchise, themes, "action"),
          createFranchiseScenario(franchise, themes, "mystery"),
          createFranchiseScenario(franchise, themes, "character"),
        ];

        // Generate franchise-appropriate characters
        const franchiseKeywords = `${franchise} ${themes.characters.join(" ")}`;
        scenarios.forEach((scenario) => {
          scenario.characters = generateCharactersForScenario(
            franchiseKeywords,
            3
          );
        });
      } else {
        // For non-franchise keywords, use the original approach
        const actionKeywords = createVariation(keywordString, "action");
        const mysteryKeywords = createVariation(keywordString, "mystery");
        const characterKeywords = createVariation(keywordString, "character");

        // Generate scenarios with different focuses
        scenarios = [
          generateScenarioFromKeywords(actionKeywords),
          generateScenarioFromKeywords(mysteryKeywords),
          generateScenarioFromKeywords(characterKeywords),
        ];

        // Ensure scenarios have different types
        const types = new Set(scenarios.map((s) => s.type));
        if (types.size < 3) {
          // If we have duplicate types, regenerate one of them with a setting focus
          const settingKeywords = createVariation(keywordString, "setting");
          scenarios[2] = generateScenarioFromKeywords(settingKeywords);
        }

        // Generate characters for each scenario with their specific keywords
        scenarios[0].characters = generateCharactersForScenario(
          actionKeywords,
          3
        );
        scenarios[1].characters = generateCharactersForScenario(
          mysteryKeywords,
          3
        );
        scenarios[2].characters = generateCharactersForScenario(
          characterKeywords,
          3
        );
      }

      // Add a unique feature to each scenario to make them more distinct
      scenarios[0].actionFocus = true; // First scenario focuses on action/conflict
      scenarios[1].mysteryFocus = true; // Second scenario focuses on mystery/intrigue
      scenarios[2].characterFocus = true; // Third scenario focuses on character development

      setGeneratedScenarios(scenarios);
      setIsGenerating(false);
    }, 1000);
  };

  // Start chat with the selected scenario
  const startChat = (scenario) => {
    // Special case for Avengers scenario
    if (
      scenario.title === "Avengers join battle" ||
      (scenario.title &&
        scenario.title.toLowerCase().includes("avengers") &&
        scenario.title.toLowerCase().includes("battle"))
    ) {
      console.log("Starting special Avengers battle scenario");

      // Create predefined Avengers characters
      const avengersCharacters = [
        {
          name: "Iron Man",
          description:
            "Genius billionaire Tony Stark in his advanced armor suit",
          personality: "Brilliant, sarcastic, and heroic",
          appearance: "Red and gold armor suit with glowing arc reactor",
          background:
            "Weapons manufacturer turned superhero after being captured by terrorists",
          abilities:
            "Advanced technology, flight, repulsor beams, genius intellect",
          weaknesses: "Arrogance, PTSD, reliance on technology",
          speech_style: "Witty, technical, often makes pop culture references",
          opening_line:
            "Let's get this party started. JARVIS, give me a tactical assessment.",
        },
        {
          name: "Captain America",
          description: "Super-soldier Steve Rogers, the first Avenger",
          personality: "Honorable, brave, and principled leader",
          appearance:
            "Muscular man in blue, red and white uniform with a shield",
          background: "World War II soldier enhanced by super-soldier serum",
          abilities:
            "Enhanced strength, speed, endurance, expert tactician, vibranium shield",
          weaknesses: "Old-fashioned worldview, sometimes too self-sacrificing",
          speech_style:
            "Direct, inspirational, occasionally uses outdated expressions",
          opening_line:
            "Avengers, we need to establish a perimeter and protect civilians. What's our status?",
        },
        {
          name: "Thor",
          description: "Asgardian god of thunder and lightning",
          personality: "Noble, powerful, sometimes arrogant but good-hearted",
          appearance:
            "Muscular with long blonde hair, armor, and Mjolnir hammer",
          background:
            "Prince of Asgard, son of Odin, protector of the Nine Realms",
          abilities:
            "Superhuman strength, control of lightning, flight with Mjolnir",
          weaknesses: "Pride, attachment to Earth and Asgard",
          speech_style:
            "Formal, sometimes archaic, speaks of battle with enthusiasm",
          opening_line:
            "These foes shall feel the wrath of Mjolnir! I'll take to the skies and thin their numbers.",
        },
        {
          name: "Hulk",
          description: "Enormous green rage monster, alter ego of Bruce Banner",
          personality: "Angry, powerful, protective, simple speech",
          appearance: "Massive green humanoid with incredible muscles",
          background: "Scientist transformed by gamma radiation experiment",
          abilities:
            "Unlimited strength, regeneration, immunity to most weapons",
          weaknesses:
            "Rage can make him unpredictable, potential harm to allies",
          speech_style:
            "Simple, direct, often in third person, roars when angry",
          opening_line: "HULK SMASH PUNY ALIENS!",
        },
      ];

      // Use predefined prompt and background for consistency
      const avengersBattlePrompt =
        "The Avengers are in the midst of battle against alien forces in downtown New York. Civilians are being evacuated while the team fights to push back the invasion. The alien mothership looms overhead, continuously sending down reinforcements. You join the team as they coordinate their defense while looking for a way to stop the invasion at its source.";

      const avengersBackground =
        "https://images.unsplash.com/photo-1612036782180-6f0822045d55?q=80&w=2070&auto=format&fit=crop";

      console.log(
        "Starting Avengers battle with predefined characters:",
        avengersCharacters.map((c) => c.name).join(", ")
      );

      // Start the chat with our predefined Avengers setup
      // Correct parameter order: name, characters, prompt, background, theme
      onStartChat(
        "Avengers join battle",
        avengersCharacters,
        avengersBattlePrompt,
        avengersBackground,
        "superhero"
      );

      console.log("Avengers chat started with background:", avengersBackground);

      return;
    }

    // Normal scenario handling
    // Correct parameter order: name, characters, prompt, background, theme
    console.log("Starting normal scenario:", scenario.title);
    console.log(
      "Characters:",
      scenario.characters.map((c) => c.name).join(", ")
    );

    onStartChat(
      scenario.title,
      scenario.characters,
      scenario.prompt,
      scenario.background,
      scenario.type || "custom"
    );
  };

  // Generate new scenarios with the same keywords
  const regenerateScenarios = () => {
    generateScenarios(keywords);
  };

  // Clear generated scenarios and go back to selection
  const clearScenarios = () => {
    setGeneratedScenarios([]);
    setKeywords("");
  };

  return (
    <div className="container mx-auto py-6 px-4">
      {/* Header with back button */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center">
          <button
            onClick={onBack}
            className="mr-3 p-2 rounded-full hover:bg-secondary"
          >
            <ArrowLeft className="h-5 w-5" />
            <span className="sr-only">Back</span>
          </button>
          <h1 className="text-2xl font-bold">Choose Adventure</h1>
        </div>

        {/* Show clear button when scenarios are generated */}
        {generatedScenarios.length > 0 && (
          <button
            onClick={clearScenarios}
            className="p-2 rounded-full hover:bg-secondary"
            title="Clear and start over"
          >
            <X className="h-5 w-5" />
          </button>
        )}
      </div>

      {/* Main content */}
      {!generatedScenarios.length ? (
        <div className="max-w-4xl mx-auto">
          {/* Tabs for selection method */}
          <div className="flex border-b mb-4">
            <button
              onClick={() => setActiveTab("categories")}
              className={`px-4 py-2 text-sm font-medium flex items-center ${
                activeTab === "categories"
                  ? "border-b-2 border-primary text-primary"
                  : "text-muted-foreground"
              }`}
            >
              <Sparkles className="h-4 w-4 mr-2" />
              Popular Categories
            </button>
            <button
              onClick={() => setActiveTab("custom")}
              className={`px-4 py-2 text-sm font-medium flex items-center ${
                activeTab === "custom"
                  ? "border-b-2 border-primary text-primary"
                  : "text-muted-foreground"
              }`}
            >
              <Wand2 className="h-4 w-4 mr-2" />
              Custom Keywords
            </button>
          </div>

          {/* Category selection - efficient grid layout */}
          {activeTab === "categories" && (
            <>
              {/* Featured Scenario - Avengers Battle */}
              <div className="mb-4">
                <h3 className="text-sm font-medium mb-3">Featured Scenario:</h3>
                <button
                  onClick={() => startChat({ title: "Avengers join battle" })}
                  className="w-full p-3 rounded-lg border border-primary/30 bg-primary/5 hover:bg-primary/10 transition-all flex items-center justify-between"
                >
                  <div className="flex items-center">
                    <span className="text-2xl mr-3">🦸‍♂️</span>
                    <div className="text-left">
                      <div className="font-medium text-sm">
                        Avengers: Join the Battle
                      </div>
                      <div className="text-xs text-muted-foreground">
                        Fight alongside Iron Man, Captain America, Thor and Hulk
                      </div>
                    </div>
                  </div>
                  <ChevronRight className="h-5 w-5 text-primary/70" />
                </button>
              </div>

              {/* Category grid - 2x4 on desktop, 2x2 on mobile */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-4">
                {scenarioCategories.map((category) => (
                  <button
                    key={category.name}
                    onClick={() => generateScenarios(category.keywords)}
                    disabled={isGenerating}
                    className="flex items-center p-3 rounded-lg border border-border hover:border-primary/50 hover:bg-primary/5 transition-all"
                  >
                    <span className="text-2xl mr-3">{category.icon}</span>
                    <div className="text-left">
                      <div className="font-medium text-sm">{category.name}</div>
                      <div className="text-xs text-muted-foreground">
                        {category.description}
                      </div>
                    </div>
                  </button>
                ))}
              </div>

              {/* Enhanced popular themes based on media */}
              <div className="mb-6">
                <h3 className="text-sm font-medium mb-3">
                  Inspired by Popular Media:
                </h3>

                {/* Movies section */}
                <div className="mb-3">
                  <h4 className="text-xs text-muted-foreground mb-1.5 flex items-center">
                    <span className="mr-1.5">🎬</span> Movies
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {[
                      "Star Wars cantina",
                      "Jurassic Park adventure",
                      "Matrix digital world",
                      "Lord of the Rings quest",
                      "Harry Potter wizardry",
                      "Mad Max wasteland",
                    ].map((theme) => (
                      <button
                        key={theme}
                        onClick={() => generateScenarios(theme)}
                        disabled={isGenerating}
                        className="px-3 py-1 text-xs rounded-full border border-primary/20 hover:bg-primary/10 transition-colors"
                      >
                        {theme}
                      </button>
                    ))}
                  </div>
                </div>

                {/* TV Shows section */}
                <div className="mb-3">
                  <h4 className="text-xs text-muted-foreground mb-1.5 flex items-center">
                    <span className="mr-1.5">📺</span> TV Shows
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {[
                      "Game of Thrones intrigue",
                      "Stranger Things mystery",
                      "Breaking Bad tension",
                      "The Witcher monster hunt",
                      "Star Trek exploration",
                      "Walking Dead survival",
                    ].map((theme) => (
                      <button
                        key={theme}
                        onClick={() => generateScenarios(theme)}
                        disabled={isGenerating}
                        className="px-3 py-1 text-xs rounded-full border border-primary/20 hover:bg-primary/10 transition-colors"
                      >
                        {theme}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Video Games section */}
                <div>
                  <h4 className="text-xs text-muted-foreground mb-1.5 flex items-center">
                    <span className="mr-1.5">🎮</span> Video Games
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {[
                      "Skyrim adventure",
                      "Cyberpunk 2077 heist",
                      "Mass Effect alien diplomacy",
                      "Fallout wasteland",
                      "Zelda dungeon",
                      "Minecraft exploration",
                    ].map((theme) => (
                      <button
                        key={theme}
                        onClick={() => generateScenarios(theme)}
                        disabled={isGenerating}
                        className="px-3 py-1 text-xs rounded-full border border-primary/20 hover:bg-primary/10 transition-colors"
                      >
                        {theme}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </>
          )}

          {/* Custom keywords input */}
          {activeTab === "custom" && (
            <div className="space-y-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <input
                  type="text"
                  value={keywords}
                  onChange={(e) => setKeywords(e.target.value)}
                  placeholder="Enter keywords (e.g., underwater city, time travel)"
                  className="w-full pl-10 pr-4 py-3 rounded-md border border-input bg-background"
                  disabled={isGenerating}
                />
              </div>

              <div className="text-xs text-muted-foreground mb-4">
                <p>
                  Try to be specific about the setting, time period, and mood.
                  For example:
                </p>
                <ul className="list-disc pl-5 mt-1 space-y-1">
                  <li>
                    "Post-apocalyptic desert with mutants and scarce resources"
                  </li>
                  <li>"Victorian London mystery with supernatural elements"</li>
                  <li>
                    "Space station diplomatic mission with alien delegates"
                  </li>
                </ul>
              </div>

              <button
                onClick={() => generateScenarios(keywords)}
                disabled={!keywords.trim() || isGenerating}
                className="w-full inline-flex items-center justify-center rounded-md bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground shadow hover:bg-primary/90 disabled:opacity-50"
              >
                {isGenerating ? (
                  <RefreshCw className="h-5 w-5 animate-spin" />
                ) : (
                  <>
                    <Sparkles className="h-5 w-5 mr-2" />
                    Generate Adventures
                  </>
                )}
              </button>
            </div>
          )}
        </div>
      ) : (
        <div className="max-w-5xl mx-auto">
          {/* Scenario selection header */}
          <div className="flex justify-between items-center mb-4">
            <div>
              <h2 className="text-lg font-medium">Choose your adventure</h2>
              <p className="text-xs text-muted-foreground">
                Based on: "{keywords}"
              </p>
            </div>
            <button
              onClick={regenerateScenarios}
              disabled={isGenerating}
              className="inline-flex items-center justify-center rounded-md border border-input bg-background px-3 py-1.5 text-xs font-medium shadow-sm hover:bg-accent hover:text-accent-foreground disabled:opacity-50"
            >
              {isGenerating ? (
                <RefreshCw className="h-3.5 w-3.5 animate-spin" />
              ) : (
                <>
                  <RefreshCw className="h-3.5 w-3.5 mr-1.5" />
                  Regenerate
                </>
              )}
            </button>
          </div>

          {/* Even more compact scenario cards - horizontal layout on desktop */}
          <div className="space-y-3">
            {generatedScenarios.map((scenario, index) => (
              <div
                key={index}
                className="border rounded-lg overflow-hidden hover:border-primary/50 hover:shadow-md transition-all flex flex-col sm:flex-row"
              >
                {/* Background image - smaller on desktop */}
                <div
                  className="h-24 sm:w-1/4 sm:h-auto bg-cover bg-center relative"
                  style={
                    scenario.background.startsWith("linear-gradient")
                      ? { background: scenario.background }
                      : { backgroundImage: `url(${scenario.background})` }
                  }
                >
                  {/* Overlay gradient */}
                  <div className="absolute inset-0 bg-gradient-to-t from-background/90 to-transparent sm:bg-gradient-to-r"></div>

                  {/* Type badge and focus badges */}
                  <div className="absolute top-2 right-2 flex flex-col gap-1 items-end">
                    {scenario.franchise ? (
                      <div className="bg-yellow-500/20 text-yellow-500 backdrop-blur-sm px-2 py-0.5 rounded-full text-xs font-medium">
                        {scenario.franchise
                          .split(" ")
                          .map(
                            (word) =>
                              word.charAt(0).toUpperCase() + word.slice(1)
                          )
                          .join(" ")}
                      </div>
                    ) : (
                      <div className="bg-background/80 backdrop-blur-sm px-2 py-0.5 rounded-full text-xs font-medium">
                        {scenario.type.charAt(0).toUpperCase() +
                          scenario.type.slice(1)}
                      </div>
                    )}

                    {/* Show focus badge if applicable */}
                    {scenario.actionFocus && (
                      <div className="bg-red-500/20 text-red-500 backdrop-blur-sm px-2 py-0.5 rounded-full text-xs font-medium">
                        Action
                      </div>
                    )}
                    {scenario.mysteryFocus && (
                      <div className="bg-purple-500/20 text-purple-500 backdrop-blur-sm px-2 py-0.5 rounded-full text-xs font-medium">
                        Mystery
                      </div>
                    )}
                    {scenario.characterFocus && (
                      <div className="bg-blue-500/20 text-blue-500 backdrop-blur-sm px-2 py-0.5 rounded-full text-xs font-medium">
                        Character
                      </div>
                    )}
                  </div>

                  {/* Title - only visible on mobile */}
                  <div className="absolute bottom-0 left-0 right-0 p-3 sm:hidden">
                    <h3 className="text-base font-bold text-foreground drop-shadow-sm line-clamp-1">
                      {scenario.title}
                    </h3>
                  </div>
                </div>

                {/* Content section */}
                <div className="p-3 flex-1 flex flex-col sm:flex-row sm:items-center sm:gap-4">
                  {/* Info section */}
                  <div className="flex-1">
                    {/* Title - only visible on desktop */}
                    <h3 className="hidden sm:block text-base font-bold mb-1">
                      {scenario.title}
                    </h3>

                    {/* Description with focus highlight */}
                    <div className="mb-2">
                      <p className="text-xs text-muted-foreground line-clamp-2">
                        {scenario.description}
                      </p>

                      {/* Focus-specific highlight */}
                      <div className="mt-1 text-xs">
                        {scenario.actionFocus && (
                          <span className="text-red-500 font-medium">
                            Focus on combat and challenges
                          </span>
                        )}
                        {scenario.mysteryFocus && (
                          <span className="text-purple-500 font-medium">
                            Uncover secrets and solve puzzles
                          </span>
                        )}
                        {scenario.characterFocus && (
                          <span className="text-blue-500 font-medium">
                            Deep character interactions
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Characters */}
                    <div className="flex items-center gap-2">
                      <div className="flex -space-x-1">
                        {scenario.characters.slice(0, 3).map((char, i) => (
                          <div
                            key={i}
                            className="w-5 h-5 rounded-full bg-secondary/50 border border-background flex items-center justify-center text-xs"
                          >
                            {char.type === "fantasy" && "✨"}
                            {char.type === "scifi" && "🔭"}
                            {char.type === "historical" && "📜"}
                            {char.type === "horror" && "👻"}
                            {char.type === "combat" && "⚔️"}
                          </div>
                        ))}
                      </div>
                      <p className="text-xs text-muted-foreground line-clamp-1">
                        {scenario.characters.map((c) => c.name).join(", ")}
                      </p>
                    </div>
                  </div>

                  {/* Start button */}
                  <button
                    onClick={() => startChat(scenario)}
                    className="w-full sm:w-auto inline-flex items-center justify-center rounded-md bg-primary px-3 py-1.5 text-xs font-medium text-primary-foreground shadow hover:bg-primary/90 mt-2 sm:mt-0"
                  >
                    Begin Adventure
                    <ArrowRight className="h-3.5 w-3.5 ml-1.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default QuickScenarioSelector;
