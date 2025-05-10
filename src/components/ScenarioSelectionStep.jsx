import { useState } from 'react';
import { Sparkles, ArrowLeft, RefreshCw, ArrowRight, Wand2, X, Search, Edit, Zap } from 'lucide-react';
import { generateScenarioFromKeywords, generateCharactersForScenario } from '../utils/aiGenerationUtils';

const ScenarioSelectionStep = ({ selectedCharacters, onBack, onContinue }) => {
  const [keywords, setKeywords] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedScenarios, setGeneratedScenarios] = useState([]);
  const [customPrompt, setCustomPrompt] = useState('');
  const [selectedScenario, setSelectedScenario] = useState(null);
  const [step, setStep] = useState('select'); // 'select', 'custom', 'preview'

  // Predefined scenario categories
  const scenarioCategories = [
    {
      name: "Fantasy Adventure",
      keywords: "fantasy, magic, quest, adventure",
      icon: "🧙‍♂️",
      description: "Magical quests and epic journeys in fantastical worlds"
    },
    {
      name: "Sci-Fi Exploration",
      keywords: "sci-fi, space, technology, future",
      icon: "🚀",
      description: "Futuristic technology and space exploration"
    },
    {
      name: "Mystery",
      keywords: "mystery, detective, investigation, clues",
      icon: "🔍",
      description: "Solve puzzles and uncover secrets"
    },
    {
      name: "Romance",
      keywords: "romance, relationship, love, emotion",
      icon: "❤️",
      description: "Emotional connections and relationships"
    },
    {
      name: "Historical",
      keywords: "historical, past, era, period",
      icon: "📜",
      description: "Adventures set in different time periods"
    },
    {
      name: "Comedy",
      keywords: "comedy, humor, funny, jokes",
      icon: "😂",
      description: "Light-hearted and humorous interactions"
    },
    {
      name: "Horror",
      keywords: "horror, scary, suspense, supernatural",
      icon: "👻",
      description: "Frightening and suspenseful situations"
    },
    {
      name: "Everyday Life",
      keywords: "modern, casual, everyday, slice of life",
      icon: "🏙️",
      description: "Casual conversations in modern settings"
    }
  ];

  // Generate a random scenario from a random category
  const generateRandomScenario = () => {
    const randomCategory = scenarioCategories[Math.floor(Math.random() * scenarioCategories.length)];
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
      scenario.prompt = scenario.prompt + "\n\n" + generateAdditionalScenarioDetails(keywordString);

      // Add the selected characters to the scenario
      scenario.characters = selectedCharacters;

      // Set as the only scenario and automatically select it
      setGeneratedScenarios([scenario]);
      setSelectedScenario(scenario);
      setIsGenerating(false);
    }, 1000);
  };

  // Helper function to generate additional scenario details
  const generateAdditionalScenarioDetails = (keywords) => {
    const keywordList = keywords.toLowerCase().split(/[,\s]+/).filter(k => k.length > 2);

    // Generate additional setting details
    const timeOfDay = ['morning', 'afternoon', 'evening', 'night', 'dawn', 'dusk'][Math.floor(Math.random() * 6)];
    const weather = ['clear', 'cloudy', 'rainy', 'stormy', 'foggy', 'snowy'][Math.floor(Math.random() * 6)];
    const mood = ['tense', 'peaceful', 'mysterious', 'exciting', 'melancholic', 'joyful'][Math.floor(Math.random() * 6)];

    // Generate character relationships if there are multiple characters
    let relationshipText = "";
    if (selectedCharacters.length > 1) {
      const relationshipTypes = [
        'are old friends', 'have just met', 'are rivals', 'are family members',
        'are colleagues', 'have a complicated history', 'are allies by necessity'
      ];
      const relationship = relationshipTypes[Math.floor(Math.random() * relationshipTypes.length)];
      relationshipText = `The characters ${relationship}. `;
    }

    // Generate a goal or challenge
    const challenges = [
      'They must work together to overcome an unexpected obstacle.',
      'A secret threatens to be revealed that could change everything.',
      'An important decision must be made that will affect everyone involved.',
      'A mysterious stranger has information they desperately need.',
      'Time is running out to accomplish their shared goal.',
      'Trust is fragile as motivations remain unclear.'
    ];
    const challenge = challenges[Math.floor(Math.random() * challenges.length)];

    return `It's ${timeOfDay} and the weather is ${weather}, creating a ${mood} atmosphere. ${relationshipText}${challenge} As the scene unfolds, tensions rise and the characters must navigate their way through this situation.`;
  };

  // Start chat with the selected scenario
  const handleContinue = () => {
    if (step === 'custom') {
      // Create a simple scenario with the custom prompt
      const customScenario = {
        title: "Custom Scenario",
        prompt: customPrompt,
        description: "A custom scenario created by you",
        characters: selectedCharacters,
        background: "linear-gradient(to right, #4568dc, #b06ab3)"
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
                  char.type === 'fantasy' ? 'bg-purple-500/30' :
                  char.type === 'scifi' ? 'bg-blue-500/30' :
                  char.type === 'historical' ? 'bg-amber-500/30' :
                  char.type === 'romance' ? 'bg-pink-500/30' :
                  char.type === 'adventure' ? 'bg-orange-500/30' :
                  'bg-green-500/30'
                }`}
              >
                {char.name.charAt(0)}
              </div>
            ))}
          </div>
          <span>{selectedCharacters.length} character{selectedCharacters.length !== 1 ? 's' : ''}</span>
        </div>
      </div>

      {/* Step selection tabs */}
      <div className="flex border-b mb-4">
        <button
          onClick={() => setStep('select')}
          className={`px-4 py-2 text-sm font-medium flex items-center ${step === 'select' ? 'border-b-2 border-primary text-primary' : 'text-muted-foreground'}`}
        >
          <Sparkles className="h-4 w-4 mr-2" />
          AI-Generated
        </button>
        <button
          onClick={() => setStep('custom')}
          className={`px-4 py-2 text-sm font-medium flex items-center ${step === 'custom' ? 'border-b-2 border-primary text-primary' : 'text-muted-foreground'}`}
        >
          <Edit className="h-4 w-4 mr-2" />
          Custom
        </button>
      </div>

      {step === 'select' && (
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
                    onClick={() => setKeywords('')}
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
                  <p className="text-xs text-muted-foreground text-center line-clamp-1">{category.description}</p>
                </button>
              ))}
            </div>

            {/* Quick suggestions */}
            <div className="mb-4">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-xs font-medium text-muted-foreground">Popular combinations:</h3>
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
                  'Cyberpunk heist',
                  'Magical academy',
                  'Desert treasure hunt',
                  'Space station mystery',
                  'Underwater civilization',
                  'Time travel adventure'
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
                  style={generatedScenarios[0].background.startsWith('linear-gradient') ?
                    { background: generatedScenarios[0].background } :
                    { backgroundImage: `url(${generatedScenarios[0].background})` }}
                >
                  {/* Overlay gradient */}
                  <div className="absolute inset-0 bg-gradient-to-t from-background/90 to-transparent sm:bg-gradient-to-r sm:from-transparent sm:to-background/70"></div>

                  {/* Title - only on mobile */}
                  <div className="absolute bottom-0 left-0 right-0 p-4 sm:hidden">
                    <h3 className="text-xl font-bold text-white drop-shadow-md">{generatedScenarios[0].title}</h3>
                  </div>
                </div>

                {/* Content section */}
                <div className="p-4 flex-1 flex flex-col">
                  {/* Title - only on desktop */}
                  <h3 className="hidden sm:block text-xl font-bold mb-2">{generatedScenarios[0].title}</h3>

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
                    <h4 className="text-xs font-medium text-muted-foreground mb-1">Setting</h4>
                    <p className="text-sm">{generatedScenarios[0].description}</p>
                  </div>

                  {/* Scenario preview - shortened */}
                  {generatedScenarios[0].prompt && (
                    <div className="mb-3">
                      <h4 className="text-xs font-medium text-muted-foreground mb-1">Scenario Preview</h4>
                      <div className="bg-secondary/20 p-3 rounded-md text-sm italic line-clamp-3">
                        {generatedScenarios[0].prompt.split('\n')[0]}
                      </div>
                      <button className="text-xs text-primary mt-1 hover:underline">Read more</button>
                    </div>
                  )}

                  {/* Characters */}
                  <div className="mt-auto">
                    <h4 className="text-xs font-medium text-muted-foreground mb-1.5">Characters</h4>
                    <div className="flex flex-wrap gap-1.5">
                      {generatedScenarios[0].characters.map((char, i) => (
                        <div
                          key={i}
                          className="px-2 py-0.5 bg-secondary/30 rounded-md text-xs flex items-center gap-1"
                        >
                          <div
                            className={`w-2 h-2 rounded-full ${
                              char.type === 'fantasy' ? 'bg-purple-500' :
                              char.type === 'scifi' ? 'bg-blue-500' :
                              char.type === 'historical' ? 'bg-amber-500' :
                              char.type === 'romance' ? 'bg-pink-500' :
                              char.type === 'adventure' ? 'bg-orange-500' :
                              'bg-green-500'
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

      {step === 'custom' && (
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
                  placeholder="Describe your scenario here. Include details about:
• Setting: Where and when does this take place?
• Atmosphere: What's the mood? (tense, peaceful, mysterious)
• Character Relationships: How do they know each other?
• Situation: What's happening right now?
• Goal or Conflict: What needs to be resolved?"
                  className="w-full px-3 py-2 rounded-md border border-input bg-background min-h-[200px] text-sm"
                />
              </div>

              {/* Characters */}
              <div className="mb-4">
                <h4 className="text-xs font-medium text-muted-foreground mb-1.5">Characters in this scenario:</h4>
                <div className="flex flex-wrap gap-1.5">
                  {selectedCharacters.map((char, i) => (
                    <div
                      key={i}
                      className="px-2 py-0.5 bg-secondary/30 rounded-md text-xs flex items-center gap-1"
                    >
                      <div
                        className={`w-2 h-2 rounded-full ${
                          char.type === 'fantasy' ? 'bg-purple-500' :
                          char.type === 'scifi' ? 'bg-blue-500' :
                          char.type === 'historical' ? 'bg-amber-500' :
                          char.type === 'romance' ? 'bg-pink-500' :
                          char.type === 'adventure' ? 'bg-orange-500' :
                          'bg-green-500'
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
                    <span>Be specific about sensory details</span>
                  </li>
                  <li className="flex items-start gap-1.5">
                    <span className="text-primary">•</span>
                    <span>Establish character relationships</span>
                  </li>
                  <li className="flex items-start gap-1.5">
                    <span className="text-primary">•</span>
                    <span>Include a central conflict or goal</span>
                  </li>
                  <li className="flex items-start gap-1.5">
                    <span className="text-primary">•</span>
                    <span>Add environmental factors (weather, time)</span>
                  </li>
                  <li className="flex items-start gap-1.5">
                    <span className="text-primary">•</span>
                    <span>Consider emotions you want to explore</span>
                  </li>
                </ul>

                <div className="mt-3 pt-3 border-t border-border/30">
                  <h4 className="text-xs font-medium mb-1.5">Example starter:</h4>
                  <p className="text-xs text-muted-foreground italic">
                    "It's a rainy evening at the old lighthouse. The characters have gathered after receiving a mysterious letter. Tensions are high as each person seems to be hiding something..."
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
          {step === 'select' && selectedScenario && (
            <span className="text-xs text-muted-foreground">
              Ready to start: <span className="font-medium text-foreground">{selectedScenario.title}</span>
            </span>
          )}
          {step === 'custom' && customPrompt.trim() && (
            <span className="text-xs text-muted-foreground">
              Custom scenario ready
            </span>
          )}
          {((step === 'select' && !selectedScenario) || (step === 'custom' && !customPrompt.trim())) && (
            <span className="text-xs text-muted-foreground">
              {step === 'select' ? 'Generate a scenario to continue' : 'Enter scenario details to continue'}
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
            disabled={(step === 'select' && !selectedScenario) || (step === 'custom' && !customPrompt.trim())}
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
