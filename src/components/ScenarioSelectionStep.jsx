import { useState } from "react";
import {
  Sparkles,
  ArrowLeft,
  RefreshCw,
  ArrowRight,
  Wand2,
  X,
  Search,
  Edit,
  Zap,
} from "lucide-react";
import {
  generateScenarioFromKeywords,
  generateCharactersForScenario,
} from "../utils/aiGenerationUtils";

const ScenarioSelectionStep = ({ selectedCharacters, onBack, onContinue }) => {
  const [keywords, setKeywords] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedScenarios, setGeneratedScenarios] = useState([]);
  const [customPrompt, setCustomPrompt] = useState("");
  const [selectedScenario, setSelectedScenario] = useState(null);
  const [step, setStep] = useState("select"); // 'select', 'custom', 'preview'

  // Predefined scenario categories
  const scenarioCategories = [
    {
      name: "Fantasy Adventure",
      keywords: "fantasy, magic, quest, adventure",
      icon: "🧙‍♂️",
      description: "Magical quests and epic journeys in fantastical worlds",
    },
    {
      name: "Sci-Fi Exploration",
      keywords: "sci-fi, space, technology, future",
      icon: "🚀",
      description: "Futuristic technology and space exploration",
    },
    {
      name: "Mystery",
      keywords: "mystery, detective, investigation, clues",
      icon: "🔍",
      description: "Solve puzzles and uncover secrets",
    },
    {
      name: "Romance",
      keywords: "romance, relationship, love, emotion",
      icon: "❤️",
      description: "Emotional connections and relationships",
    },
    {
      name: "Historical",
      keywords: "historical, past, era, period",
      icon: "📜",
      description: "Adventures set in different time periods",
    },
    {
      name: "Comedy",
      keywords: "comedy, humor, funny, jokes",
      icon: "😂",
      description: "Light-hearted and humorous interactions",
    },
    {
      name: "Horror",
      keywords: "horror, scary, suspense, supernatural",
      icon: "👻",
      description: "Frightening and suspenseful situations",
    },
    {
      name: "Everyday Life",
      keywords: "modern, casual, everyday, slice of life",
      icon: "🏙️",
      description: "Casual conversations in modern settings",
    },
  ];

  // Generate a random scenario from a random category
  const generateRandomScenario = () => {
    const randomCategory =
      scenarioCategories[Math.floor(Math.random() * scenarioCategories.length)];
    generateScenarios(randomCategory.keywords);
  };

  // Generate one extensive scenario based on keywords
  const generateScenarios = (keywordString) => {
    setIsGenerating(true);
    setKeywords(keywordString);

    // Generate a single, more detailed scenario
    setTimeout(() => {
      // Generate a more extensive scenario
      const scenario = generateScenarioFromKeywords(keywordString);

      // Make the scenario more detailed
      scenario.prompt =
        scenario.prompt +
        "\n\n" +
        generateAdditionalScenarioDetails(keywordString);

      // Add the selected characters to the scenario
      scenario.characters = selectedCharacters;

      // Set as the only scenario and automatically select it
      setGeneratedScenarios([scenario]);
      setSelectedScenario(scenario);
      setIsGenerating(false);
    }, 1000);
  };

  // Helper function to generate rich, immersive scenario details
  const generateAdditionalScenarioDetails = (keywords) => {
    const keywordList = keywords
      .toLowerCase()
      .split(/[,\s]+/)
      .filter((k) => k.length > 2);

    // Generate detailed environmental setting
    const timeOfDay = [
      "morning",
      "afternoon",
      "evening",
      "night",
      "dawn",
      "dusk",
    ][Math.floor(Math.random() * 6)];
    const weather = ["clear", "cloudy", "rainy", "stormy", "foggy", "snowy"][
      Math.floor(Math.random() * 6)
    ];
    const mood = [
      "tense",
      "peaceful",
      "mysterious",
      "exciting",
      "melancholic",
      "joyful",
    ][Math.floor(Math.random() * 6)];

    // Generate detailed sensory descriptions based on weather and time
    const visualDetails = {
      foggy: {
        evening:
          "A thick blanket of fog has settled over the area, reducing visibility to mere feet. Streetlights create eerie halos in the mist, and shadows seem to move with a life of their own.",
        night:
          "The night is shrouded in a dense fog that swallows all but the closest objects. Lights appear as distant, blurred orbs, and familiar shapes become unrecognizable.",
        morning:
          "Morning fog clings to the ground, transforming the landscape into a dreamlike scene. Sunlight struggles to penetrate the haze, casting everything in a soft, diffused glow.",
        afternoon:
          "An unusual afternoon fog has rolled in, turning the world gray and muffled. The sun is a pale disc barely visible through the thick mist.",
        dawn: "The first light of dawn struggles to pierce through the heavy fog, creating an otherworldly atmosphere where silhouettes emerge and fade like ghosts.",
        dusk: "As dusk falls, the fog thickens, blurring the line between day and night. The last remnants of daylight scatter through the mist, creating an amber glow that quickly fades to gray.",
      },
      rainy: {
        evening:
          "Rain falls steadily in the evening light, drumming on rooftops and forming puddles that reflect the glowing windows of nearby buildings.",
        night:
          "The night rain creates a symphony against windows and pavement, while water rushes through gutters and drains. Occasional lightning illuminates the scene in stark flashes.",
        morning:
          "Morning rain washes the world clean, droplets catching the early light like countless tiny prisms. The air smells fresh and renewed.",
        afternoon:
          "Afternoon showers create a constant patter against leaves and roofs, while gray clouds roll overhead, occasionally parting to let shafts of sunlight through.",
        dawn: "Rain at dawn creates a misty curtain across the horizon, where the rising sun turns water droplets into gold and copper.",
        dusk: "The rain intensifies as daylight fades, creating a shimmering veil through which lights begin to glow with haloed intensity.",
      },
      stormy: {
        evening:
          "The evening storm brings powerful gusts that bend trees and scatter debris. Lightning forks across the darkening sky, followed by the deep rumble of thunder.",
        night:
          "The night storm rages with fury, lightning transforming night to day in blinding flashes. Thunder shakes the very foundations, and rain lashes horizontally in the howling wind.",
        morning:
          "Morning thunderheads tower ominously, casting premature darkness. The air feels charged with electricity as the storm unleashes its power.",
        afternoon:
          "The afternoon storm turns day to twilight, with clouds black as ink boiling overhead. Wind-driven rain comes in sheets, and lightning strikes with terrifying proximity.",
        dawn: "Storm clouds at dawn create a canvas of violent purples and reds, as if the sky itself is bruised. Thunder rolls across the landscape like a warning.",
        dusk: "The storm intensifies with the coming night, transforming dusk into a chaotic battlefield of elements, with wind, rain, and lightning in constant competition.",
      },
      clear: {
        evening:
          "The clear evening sky transitions through a palette of oranges and purples as the sun sets. The air is still and sounds carry with unusual clarity.",
        night:
          "Stars punctuate the clear night sky in their thousands, the Milky Way a misty ribbon across the darkness. The moon casts sharp-edged shadows.",
        morning:
          "Morning sunlight streams unobstructed, casting long shadows and highlighting every detail with crystal clarity. The air feels fresh and full of possibility.",
        afternoon:
          "The clear afternoon sky is a perfect blue dome, with perhaps a few wispy clouds for contrast. Sunlight bathes everything in warm, golden light.",
        dawn: "The clear dawn sky is a masterpiece of color, from deep indigo to vibrant orange, with the landscape silhouetted against the brightening horizon.",
        dusk: "As dusk approaches on this clear day, the western sky becomes a canvas of warm colors, while the east already shows the first stars of evening.",
      },
      cloudy: {
        evening:
          "Clouds hang low in the evening sky, their undersides tinged with the last light of day. The diffused light creates a soft, shadowless landscape.",
        night:
          "The cloudy night creates a peculiar half-light as the clouds reflect the glow of distant lights. The moon appears and disappears behind the moving cloud cover.",
        morning:
          "Morning clouds create a patchwork of light and shadow as sunlight breaks through gaps, creating spotlights that move across the landscape.",
        afternoon:
          "The afternoon sky is a tapestry of clouds in various shades of gray and white, constantly shifting and reshaping in the high-altitude winds.",
        dawn: "Dawn breaks behind a bank of clouds, sending rays of light shooting upward and turning cloud edges to gold and pink.",
        dusk: "Clouds at dusk become a spectacular display as they catch the setting sun's rays, turning fiery orange and deep purple against the darkening sky.",
      },
      snowy: {
        evening:
          "Snow falls gently in the evening light, each flake catching the glow from windows and lamps. A hush falls over the world as sound is absorbed by the growing blanket of white.",
        night:
          "The night snowfall transforms the darkness, reflecting what little light there is and creating a luminous landscape of soft shapes and deep shadows.",
        morning:
          "Morning light sparkles off fresh snow with diamond brilliance. The world is transformed into a clean white canvas unmarked by footprints.",
        afternoon:
          "The afternoon snow creates a dreamlike quality as flakes swirl and dance in the wind, accumulating on every surface and softening every edge.",
        dawn: "Snow at dawn takes on the pink and gold hues of the rising sun, creating a magical landscape that seems to belong to another world.",
        dusk: "As dusk falls, the snow-covered landscape holds the fading light, glowing with an inner luminescence that defies the coming night.",
      },
    };

    // Generate emotional atmosphere based on mood
    const emotionalAtmosphere = {
      tense:
        "Tension hangs in the air like an electrical charge. Conversations are clipped, glances are wary, and everyone seems to be waiting for something to break the strained silence. The atmosphere is thick with unspoken words and suppressed emotions that threaten to erupt at any moment.",
      peaceful:
        "A sense of tranquility permeates the scene, allowing for open conversation and genuine connection. The atmosphere encourages reflection and honesty, with a gentle rhythm that soothes rather than excites.",
      mysterious:
        "Mystery shrouds the environment, with secrets seemingly hidden in every shadow. Questions outnumber answers, and each new revelation only deepens the enigma. Intuition becomes as valuable as logic in this atmosphere of uncertainty and intrigue.",
      exciting:
        "Excitement charges the air with a palpable energy. Possibilities seem endless, and even ordinary moments feel significant. There's a sense that anything could happen, and everyone is fully present in this heightened reality.",
      melancholic:
        "A bittersweet melancholy colors every interaction, bringing depth and poignancy to even simple exchanges. There's beauty in this sadness, a shared understanding of life's impermanence that makes connections more meaningful.",
      joyful:
        "Joy infuses the atmosphere with warmth and light. Laughter comes easily, barriers fall away, and there's a contagious quality to the happiness that spreads from person to person, making even strangers feel like friends.",
    };

    // Generate character relationships with emotional context
    let relationshipText = "";
    if (selectedCharacters.length > 1) {
      const relationshipTypes = [
        {
          type: "are old friends",
          context:
            "Their shared history provides both comfort and complications, with inside jokes and old wounds equally likely to surface.",
        },
        {
          type: "have just met",
          context:
            "The awkwardness of new acquaintance is mixed with the excitement of discovery, as they navigate the uncertain territory of first impressions.",
        },
        {
          type: "are rivals",
          context:
            "Competition colors every interaction, with each measuring themselves against the other. Respect and resentment exist in equal measure.",
        },
        {
          type: "are family members",
          context:
            "Family bonds bring both obligation and deep understanding. Patterns established years ago still influence their interactions, for better or worse.",
        },
        {
          type: "are colleagues",
          context:
            "Professional boundaries blur with personal feelings as their work relationship evolves beyond its formal constraints.",
        },
        {
          type: "have a complicated history",
          context:
            "Unresolved feelings and past events create an undercurrent of tension beneath every exchange, with much left unsaid but still felt.",
        },
        {
          type: "are allies by necessity",
          context:
            "Circumstance rather than choice has brought them together, creating an uneasy alliance where trust must be earned rather than assumed.",
        },
      ];

      const relationship =
        relationshipTypes[Math.floor(Math.random() * relationshipTypes.length)];
      relationshipText = `The characters ${relationship.type}. ${relationship.context} `;
    }

    // Generate character motivations and emotional states
    const characterMotivations = [
      "Each character harbors their own agenda, creating a complex web of motivations that sometimes align and sometimes conflict. Trust is a valuable currency that not everyone can afford.",
      "Beneath the surface, each person carries private hopes and fears that color their perspective and drive their actions, often in ways they themselves don't fully understand.",
      "Individual desires and goals create an intricate dance of cooperation and competition, with alliances forming and dissolving as circumstances change.",
      "Personal histories influence present actions, as past experiences shape how each character approaches the current situation, sometimes in surprising ways.",
      "Emotional wounds and unmet needs drive behavior more powerfully than logic, creating patterns that persist until they're consciously recognized and addressed.",
    ];

    const motivation =
      characterMotivations[
        Math.floor(Math.random() * characterMotivations.length)
      ];

    // Generate a specific conflict or challenge with stakes
    const challenges = [
      {
        challenge: "They must work together to overcome an unexpected obstacle",
        stakes:
          "Failure would mean not just personal disappointment, but consequences that would ripple outward to affect many others.",
      },
      {
        challenge:
          "A secret threatens to be revealed that could change everything",
        stakes:
          "The truth, once exposed, cannot be unknown, and relationships may be permanently altered by what comes to light.",
      },
      {
        challenge:
          "An important decision must be made that will affect everyone involved",
        stakes:
          "Every choice has consequences, and the responsibility of making the right one weighs heavily on those who must decide.",
      },
      {
        challenge:
          "A mysterious stranger has information they desperately need",
        stakes:
          "Obtaining this knowledge is essential, but the price demanded may be more than they're willing to pay.",
      },
      {
        challenge: "Time is running out to accomplish their shared goal",
        stakes:
          "The pressure of the deadline creates both urgency and tension, forcing difficult choices about priorities and sacrifices.",
      },
      {
        challenge: "Trust is fragile as motivations remain unclear",
        stakes:
          "Misplaced trust could lead to betrayal, while suspicion might damage genuine alliances.",
      },
    ];

    const challenge = challenges[Math.floor(Math.random() * challenges.length)];

    // Generate rising tension description
    const risingTensions = [
      "As the scene unfolds, tensions rise like a gathering storm, with small disagreements escalating into significant conflicts that threaten to shatter the fragile balance.",
      "The situation grows increasingly complex, with each new development adding another layer of tension to an already volatile atmosphere.",
      "What begins as a simple interaction gradually reveals deeper currents of conflict, as hidden agendas and suppressed emotions rise to the surface.",
      "The pressure builds steadily, creating hairline fractures in relationships that could either be repaired or expanded into permanent breaks.",
      "Beneath a veneer of civility, powerful emotions simmer and occasionally boil over, revealing the true nature of the connections between those present.",
    ];

    const tension =
      risingTensions[Math.floor(Math.random() * risingTensions.length)];

    // Combine all elements into a rich, detailed scenario description
    return `${visualDetails[weather][timeOfDay]} ${emotionalAtmosphere[mood]} ${relationshipText}${motivation} ${challenge.challenge}. ${challenge.stakes} ${tension} The characters must navigate their way through this situation, each bringing their own perspective and abilities to bear on the challenges ahead.`;
  };

  // Start chat with the selected scenario
  const handleContinue = () => {
    if (step === "custom") {
      // Create a simple scenario with the custom prompt
      const customScenario = {
        title: "Custom Scenario",
        prompt: customPrompt,
        description: "A custom scenario created by you",
        characters: selectedCharacters,
        background: "linear-gradient(to right, #4568dc, #b06ab3)",
      };
      onContinue(customScenario);
    } else if (selectedScenario) {
      onContinue(selectedScenario);
    }
  };

  return (
    <div className="container mx-auto py-4 px-4">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center">
          <button
            onClick={onBack}
            className="mr-3 p-2 rounded-full hover:bg-secondary"
          >
            <ArrowLeft className="h-5 w-5" />
            <span className="sr-only">Back</span>
          </button>
          <h1 className="text-2xl font-bold">Choose Scenario</h1>
        </div>

        {/* Character count indicator */}
        <div className="flex items-center gap-1 bg-secondary/30 px-3 py-1 rounded-full text-xs">
          <div className="flex -space-x-2 mr-1.5">
            {selectedCharacters.slice(0, 3).map((char, i) => (
              <div
                key={i}
                className={`w-5 h-5 rounded-full border border-background flex items-center justify-center text-xs ${
                  char.type === "fantasy"
                    ? "bg-purple-500/30"
                    : char.type === "scifi"
                    ? "bg-blue-500/30"
                    : char.type === "historical"
                    ? "bg-amber-500/30"
                    : char.type === "romance"
                    ? "bg-pink-500/30"
                    : char.type === "adventure"
                    ? "bg-orange-500/30"
                    : "bg-green-500/30"
                }`}
              >
                {char.name.charAt(0)}
              </div>
            ))}
          </div>
          <span>
            {selectedCharacters.length} character
            {selectedCharacters.length !== 1 ? "s" : ""}
          </span>
        </div>
      </div>

      {/* Step selection tabs */}
      <div className="flex border-b mb-4">
        <button
          onClick={() => setStep("select")}
          className={`px-4 py-2 text-sm font-medium flex items-center ${
            step === "select"
              ? "border-b-2 border-primary text-primary"
              : "text-muted-foreground"
          }`}
        >
          <Sparkles className="h-4 w-4 mr-2" />
          AI-Generated
        </button>
        <button
          onClick={() => setStep("custom")}
          className={`px-4 py-2 text-sm font-medium flex items-center ${
            step === "custom"
              ? "border-b-2 border-primary text-primary"
              : "text-muted-foreground"
          }`}
        >
          <Edit className="h-4 w-4 mr-2" />
          Custom
        </button>
      </div>

      {step === "select" && (
        <>
          <div className="max-w-4xl mx-auto">
            {/* Custom keywords input - moved to top for better visibility */}
            <div className="mb-6">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <input
                  type="text"
                  value={keywords}
                  onChange={(e) => setKeywords(e.target.value)}
                  placeholder="Enter keywords for your scenario (e.g., space pirates, medieval tavern)"
                  className="w-full pl-10 pr-4 py-3 rounded-md border border-input bg-background"
                  disabled={isGenerating}
                />
                {keywords && (
                  <button
                    onClick={() => setKeywords("")}
                    className="absolute right-14 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  >
                    <X className="h-4 w-4" />
                  </button>
                )}
                <button
                  onClick={() => generateScenarios(keywords)}
                  disabled={!keywords.trim() || isGenerating}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 inline-flex items-center justify-center rounded-md bg-primary px-3 py-1 text-xs font-medium text-primary-foreground shadow hover:bg-primary/90 disabled:opacity-50"
                >
                  {isGenerating ? (
                    <RefreshCw className="h-4 w-4 animate-spin" />
                  ) : (
                    <>
                      <Zap className="h-3.5 w-3.5 mr-1" />
                      Generate
                    </>
                  )}
                </button>
              </div>
              <p className="text-xs text-muted-foreground mt-2 ml-1">
                Choose a category below or enter your own keywords above
              </p>
            </div>

            {/* Category grid - more compact */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
              {scenarioCategories.map((category) => (
                <button
                  key={category.name}
                  onClick={() => generateScenarios(category.keywords)}
                  disabled={isGenerating}
                  className="flex flex-col items-center justify-center p-3 rounded-lg border border-border hover:border-primary/50 hover:bg-primary/5 transition-all"
                >
                  <span className="text-2xl mb-1">{category.icon}</span>
                  <span className="font-medium text-sm">{category.name}</span>
                  <p className="text-xs text-muted-foreground text-center line-clamp-1">
                    {category.description}
                  </p>
                </button>
              ))}
            </div>

            {/* Quick suggestions */}
            <div className="mb-4">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-xs font-medium text-muted-foreground">
                  Popular combinations:
                </h3>
                <button
                  onClick={generateRandomScenario}
                  disabled={isGenerating}
                  className="inline-flex items-center justify-center rounded-md border border-primary/20 px-2 py-1 text-xs font-medium hover:bg-primary/10 transition-colors"
                >
                  <Sparkles className="h-3 w-3 mr-1" />
                  Random
                </button>
              </div>
              <div className="flex flex-wrap gap-2">
                {[
                  "Cyberpunk heist",
                  "Magical academy",
                  "Desert treasure hunt",
                  "Space station mystery",
                  "Underwater civilization",
                  "Time travel adventure",
                ].map((theme) => (
                  <button
                    key={theme}
                    onClick={() => {
                      setKeywords(theme);
                      generateScenarios(theme);
                    }}
                    disabled={isGenerating}
                    className="px-3 py-1 text-xs rounded-full border border-primary/20 hover:bg-primary/10 transition-colors"
                  >
                    {theme}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Generated scenario - more compact version */}
          {generatedScenarios.length > 0 && (
            <div className="mt-6 max-w-3xl mx-auto">
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-lg font-bold">Your Adventure Scenario</h2>
                <button
                  onClick={() => generateScenarios(keywords)}
                  className="inline-flex items-center justify-center rounded-md border border-input bg-background px-3 py-1.5 text-xs font-medium shadow-sm hover:bg-accent hover:text-accent-foreground"
                >
                  <RefreshCw className="h-3.5 w-3.5 mr-1.5" />
                  Generate New
                </button>
              </div>

              <div className="border rounded-lg overflow-hidden border-primary/20 shadow-sm transition-all flex flex-col sm:flex-row">
                {/* Image section - smaller on desktop */}
                <div
                  className="h-40 sm:w-1/3 sm:h-auto bg-cover bg-center relative"
                  style={
                    generatedScenarios[0].background.startsWith(
                      "linear-gradient"
                    )
                      ? { background: generatedScenarios[0].background }
                      : {
                          backgroundImage: `url(${generatedScenarios[0].background})`,
                        }
                  }
                >
                  {/* Overlay gradient */}
                  <div className="absolute inset-0 bg-gradient-to-t from-background/90 to-transparent sm:bg-gradient-to-r sm:from-transparent sm:to-background/70"></div>

                  {/* Title - only on mobile */}
                  <div className="absolute bottom-0 left-0 right-0 p-4 sm:hidden">
                    <h3 className="text-xl font-bold text-white drop-shadow-md">
                      {generatedScenarios[0].title}
                    </h3>
                  </div>
                </div>

                {/* Content section */}
                <div className="p-4 flex-1 flex flex-col">
                  {/* Title - only on desktop */}
                  <h3 className="hidden sm:block text-xl font-bold mb-2">
                    {generatedScenarios[0].title}
                  </h3>

                  {/* Tabs for different sections */}
                  <div className="flex border-b mb-3">
                    <button
                      onClick={() => {}}
                      className="px-3 py-1.5 text-xs font-medium border-b-2 border-primary text-primary"
                    >
                      Overview
                    </button>
                    <button
                      onClick={() => {}}
                      className="px-3 py-1.5 text-xs font-medium text-muted-foreground"
                    >
                      Details
                    </button>
                  </div>

                  {/* Setting */}
                  <div className="mb-3">
                    <h4 className="text-xs font-medium text-muted-foreground mb-1">
                      Setting
                    </h4>
                    <p className="text-sm">
                      {generatedScenarios[0].description}
                    </p>
                  </div>

                  {/* Scenario preview - shortened */}
                  {generatedScenarios[0].prompt && (
                    <div className="mb-3">
                      <h4 className="text-xs font-medium text-muted-foreground mb-1">
                        Scenario Preview
                      </h4>
                      <div className="bg-secondary/20 p-3 rounded-md text-sm italic line-clamp-3">
                        {generatedScenarios[0].prompt.split("\n")[0]}
                      </div>
                      <button className="text-xs text-primary mt-1 hover:underline">
                        Read more
                      </button>
                    </div>
                  )}

                  {/* Characters */}
                  <div className="mt-auto">
                    <h4 className="text-xs font-medium text-muted-foreground mb-1.5">
                      Characters
                    </h4>
                    <div className="flex flex-wrap gap-1.5">
                      {generatedScenarios[0].characters.map((char, i) => (
                        <div
                          key={i}
                          className="px-2 py-0.5 bg-secondary/30 rounded-md text-xs flex items-center gap-1"
                        >
                          <div
                            className={`w-2 h-2 rounded-full ${
                              char.type === "fantasy"
                                ? "bg-purple-500"
                                : char.type === "scifi"
                                ? "bg-blue-500"
                                : char.type === "historical"
                                ? "bg-amber-500"
                                : char.type === "romance"
                                ? "bg-pink-500"
                                : char.type === "adventure"
                                ? "bg-orange-500"
                                : "bg-green-500"
                            }`}
                          ></div>
                          {char.name}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </>
      )}

      {step === "custom" && (
        <div className="max-w-3xl mx-auto">
          <div className="flex flex-col sm:flex-row gap-4">
            {/* Main content - textarea */}
            <div className="flex-1">
              <div className="mb-3">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-sm font-medium">Create Your Scenario</h3>
                  <div className="text-xs text-muted-foreground">
                    {customPrompt.length} characters
                  </div>
                </div>
                <textarea
                  value={customPrompt}
                  onChange={(e) => setCustomPrompt(e.target.value)}
                  placeholder="Describe your scenario in rich detail. Include:
• Environmental Details: Describe the weather, time of day, and sensory elements (sights, sounds, smells)
• Emotional Atmosphere: What's the mood? (tense, peaceful, mysterious) How does it feel to be there?
• Character Relationships: What's their history? What unspoken dynamics exist between them?
• Character Motivations: What does each character want? What are they hiding or afraid of?
• Rising Tensions: What conflicts are brewing? How are tensions escalating?
• Stakes: What will happen if they fail? Why does this matter to the characters?
• Sensory Details: What can they see, hear, smell, or feel in this environment?"
                  className="w-full px-3 py-2 rounded-md border border-input bg-background min-h-[200px] text-sm"
                />
              </div>

              {/* Characters */}
              <div className="mb-4">
                <h4 className="text-xs font-medium text-muted-foreground mb-1.5">
                  Characters in this scenario:
                </h4>
                <div className="flex flex-wrap gap-1.5">
                  {selectedCharacters.map((char, i) => (
                    <div
                      key={i}
                      className="px-2 py-0.5 bg-secondary/30 rounded-md text-xs flex items-center gap-1"
                    >
                      <div
                        className={`w-2 h-2 rounded-full ${
                          char.type === "fantasy"
                            ? "bg-purple-500"
                            : char.type === "scifi"
                            ? "bg-blue-500"
                            : char.type === "historical"
                            ? "bg-amber-500"
                            : char.type === "romance"
                            ? "bg-pink-500"
                            : char.type === "adventure"
                            ? "bg-orange-500"
                            : "bg-green-500"
                        }`}
                      ></div>
                      {char.name}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Sidebar - tips */}
            <div className="sm:w-64 flex-shrink-0">
              <div className="bg-secondary/10 rounded-md p-3 border border-border/30">
                <h3 className="text-xs font-medium mb-2 flex items-center">
                  <Sparkles className="h-3.5 w-3.5 mr-1.5 text-primary" />
                  Tips for great scenarios:
                </h3>
                <ul className="space-y-1.5 text-xs text-muted-foreground">
                  <li className="flex items-start gap-1.5">
                    <span className="text-primary">•</span>
                    <span>
                      <strong>Rich environmental details</strong> create
                      immersion and context for AI responses
                    </span>
                  </li>
                  <li className="flex items-start gap-1.5">
                    <span className="text-primary">•</span>
                    <span>
                      <strong>Sensory descriptions</strong> (sights, sounds,
                      smells) make the scene feel real
                    </span>
                  </li>
                  <li className="flex items-start gap-1.5">
                    <span className="text-primary">•</span>
                    <span>
                      <strong>Emotional undercurrents</strong> give AI
                      characters emotional context to respond from
                    </span>
                  </li>
                  <li className="flex items-start gap-1.5">
                    <span className="text-primary">•</span>
                    <span>
                      <strong>Character motivations</strong> create depth and
                      drive meaningful interactions
                    </span>
                  </li>
                  <li className="flex items-start gap-1.5">
                    <span className="text-primary">•</span>
                    <span>
                      <strong>Rising tensions</strong> provide narrative
                      momentum and emotional stakes
                    </span>
                  </li>
                  <li className="flex items-start gap-1.5">
                    <span className="text-primary">•</span>
                    <span>
                      <strong>Specific details</strong> are better than general
                      statements
                    </span>
                  </li>
                </ul>

                <div className="mt-3 pt-3 border-t border-border/30">
                  <h4 className="text-xs font-medium mb-1.5">
                    Example rich scenario:
                  </h4>
                  <p className="text-xs text-muted-foreground italic">
                    "A thick blanket of fog has settled over the area, reducing
                    visibility to mere feet. Streetlights create eerie halos in
                    the mist, and shadows seem to move with a life of their own.
                    Tension hangs in the air like an electrical charge.
                    Conversations are clipped, glances are wary, and everyone
                    seems to be waiting for something to break the strained
                    silence. The characters have a complicated history.
                    Unresolved feelings and past events create an undercurrent
                    of tension beneath every exchange, with much left unsaid but
                    still felt. Each character harbors their own agenda,
                    creating a complex web of motivations that sometimes align
                    and sometimes conflict. A secret threatens to be revealed
                    that could change everything. The truth, once exposed,
                    cannot be unknown, and relationships may be permanently
                    altered by what comes to light. As the scene unfolds,
                    tensions rise like a gathering storm, with small
                    disagreements escalating into significant conflicts that
                    threaten to shatter the fragile balance."
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Sticky footer with navigation buttons */}
      <div className="sticky bottom-0 left-0 right-0 bg-background/95 backdrop-blur-sm border-t p-3 flex justify-between items-center mt-6">
        <div className="flex-1">
          {step === "select" && selectedScenario && (
            <span className="text-xs text-muted-foreground">
              Ready to start:{" "}
              <span className="font-medium text-foreground">
                {selectedScenario.title}
              </span>
            </span>
          )}
          {step === "custom" && customPrompt.trim() && (
            <span className="text-xs text-muted-foreground">
              Custom scenario ready
            </span>
          )}
          {((step === "select" && !selectedScenario) ||
            (step === "custom" && !customPrompt.trim())) && (
            <span className="text-xs text-muted-foreground">
              {step === "select"
                ? "Generate a scenario to continue"
                : "Enter scenario details to continue"}
            </span>
          )}
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={onBack}
            className="inline-flex items-center justify-center rounded-md border border-input bg-background px-3 py-1.5 text-xs font-medium hover:bg-accent hover:text-accent-foreground"
          >
            <ArrowLeft className="h-3.5 w-3.5 mr-1.5" />
            Back
          </button>

          <button
            onClick={handleContinue}
            disabled={
              (step === "select" && !selectedScenario) ||
              (step === "custom" && !customPrompt.trim())
            }
            className="inline-flex items-center justify-center rounded-md bg-primary px-3 py-1.5 text-xs font-medium text-primary-foreground shadow hover:bg-primary/90 disabled:opacity-50"
          >
            Start Chat
            <ArrowRight className="h-3.5 w-3.5 ml-1.5" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ScenarioSelectionStep;
