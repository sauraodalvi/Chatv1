import { useState } from "react";
import { useTheme } from "./ThemeProvider";
import {
  Moon,
  Sun,
  Upload,
  HelpCircle,
  Sparkles,
  MessageSquare,
  Users,
  Wand2,
  Zap,
  ArrowRight,
  ShieldCheck,
  Shield,
} from "lucide-react";
import { getScenarioData } from "../utils/storyArcUtils";

const LandingPage = ({
  onSelectCharacter,
  onCreateScenario,
  onQuickStart,
  onUploadChat,
  onHowToUse,
  onStartChat,
}) => {
  const { theme, setTheme } = useTheme();
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const chatData = JSON.parse(e.target.result);
          onUploadChat(chatData);
        } catch (error) {
          alert("Invalid chat file. Please upload a valid JSON file.");
          console.error("Error parsing chat file:", error);
        }
      };
      reader.readAsText(file);
    }
  };

  // Function to start a scenario based on its title
  const startScenario = (scenarioTitle) => {
    // Get scenario data from the repository
    const scenarioData = getScenarioData(scenarioTitle);

    if (!scenarioData) {
      console.error(`Scenario "${scenarioTitle}" not found`);
      return;
    }

    // Create the characters based on the scenario
    let characters = [];

    if (scenarioTitle === "Avengers: Alien Invasion") {
      // For the Avengers scenario, use predefined characters
      // IMPORTANT: These character names must match exactly with the names in the scenario data
      characters = [
        {
          name: "Captain America",
          type: "superhero",
          mood: "determined",
          description:
            "The first Avenger and a natural leader with unwavering moral principles.",
          avatar: "🛡️",
          personality: {
            analytical: 7,
            emotional: 6,
            philosophical: 8,
            humor: 4,
            confidence: 9,
          },
        },
        {
          name: "Iron Man",
          type: "superhero",
          mood: "confident",
          description:
            "Genius billionaire Tony Stark with advanced technology and quick wit.",
          avatar: "🔴",
          personality: {
            analytical: 10,
            emotional: 5,
            philosophical: 6,
            humor: 9,
            confidence: 10,
          },
        },
        {
          name: "Thor",
          type: "superhero",
          mood: "powerful",
          description:
            "The Asgardian God of Thunder with control over lightning and storms.",
          avatar: "⚡",
          personality: {
            analytical: 5,
            emotional: 7,
            philosophical: 6,
            humor: 7,
            confidence: 9,
          },
        },
        {
          name: "Hulk",
          type: "superhero",
          mood: "angry",
          description:
            "The strongest Avenger with incredible strength fueled by rage.",
          avatar: "💪",
          personality: {
            analytical: 8, // Banner's intelligence
            emotional: 10,
            philosophical: 4,
            humor: 5,
            confidence: 8,
          },
        },
      ];
    } else if (scenarioTitle === "The Lost Artifact") {
      // For the fantasy scenario, use appropriate characters
      characters = [
        {
          name: "Elara Moonwhisper",
          type: "fantasy",
          mood: "mysterious",
          description:
            "An elven sorceress with silver hair and eyes that shimmer like moonlight.",
          avatar: "🧝‍♀️",
          personality: {
            analytical: 7,
            emotional: 6,
            philosophical: 9,
            humor: 4,
            confidence: 8,
          },
        },
      ];
    } else if (scenarioTitle === "Space Station Omega") {
      // For the sci-fi scenario, use appropriate characters
      characters = [
        {
          name: "Commander Zax",
          type: "scifi",
          mood: "stern",
          description:
            "A battle-hardened space marine with cybernetic enhancements.",
          avatar: "🤖",
          personality: {
            analytical: 8,
            emotional: 3,
            philosophical: 5,
            humor: 2,
            confidence: 9,
          },
        },
      ];
    }

    // Create the scenario details
    const scenarioPrompt = scenarioData.initialContext || "";

    // Set background based on theme
    let scenarioBackground =
      "linear-gradient(to right, #3a1c71, #d76d77, #ffaf7b)"; // Default heroic gradient

    if (scenarioData.theme === "fantasy") {
      scenarioBackground = "linear-gradient(to right, #654ea3, #eaafc8)"; // Fantasy gradient
    } else if (scenarioData.theme === "scifi") {
      scenarioBackground = "linear-gradient(to right, #2b5876, #4e4376)"; // Sci-fi gradient
    }

    // Start the chat with this scenario and theme
    onStartChat(
      scenarioTitle,
      characters,
      scenarioPrompt,
      scenarioBackground,
      scenarioData.theme
    );
  };

  // Function to start the Avengers join battle scenario
  const startAvengersJoinBattleScenario = () => {
    try {
      console.log("Starting Avengers join battle scenario...");
      // Get the scenario data
      const scenarioData = getScenarioData("Avengers join battle");
      console.log("Scenario data:", scenarioData);

      if (!scenarioData) {
        console.error("Avengers join battle scenario data not found");
        // Fallback to the regular Avengers scenario if the join battle one isn't found
        console.log("Falling back to regular Avengers scenario");
        startAvengersScenario();
        return;
      }

      // Create the Avengers characters
      const characters = [
        {
          name: "Captain America",
          type: "superhero",
          mood: "determined",
          description:
            "The first Avenger and a natural leader with unwavering moral principles.",
          avatar: "🛡️",
          personality: {
            analytical: 7,
            emotional: 6,
            philosophical: 8,
            humor: 4,
            confidence: 9,
          },
        },
        {
          name: "Iron Man",
          type: "superhero",
          mood: "confident",
          description:
            "Genius billionaire Tony Stark with advanced technology and quick wit.",
          avatar: "🔴",
          personality: {
            analytical: 10,
            emotional: 5,
            philosophical: 6,
            humor: 9,
            confidence: 10,
          },
        },
        {
          name: "Thor",
          type: "superhero",
          mood: "powerful",
          description:
            "The Asgardian God of Thunder with control over lightning and storms.",
          avatar: "⚡",
          personality: {
            analytical: 5,
            emotional: 7,
            philosophical: 6,
            humor: 7,
            confidence: 9,
          },
        },
        {
          name: "Hulk",
          type: "superhero",
          mood: "angry",
          description:
            "The strongest Avenger with incredible strength fueled by rage.",
          avatar: "💪",
          personality: {
            analytical: 8,
            emotional: 10,
            philosophical: 4,
            humor: 5,
            confidence: 8,
          },
        },
      ];

      // Create the scenario details - use a default prompt if scenarioData.initialContext is undefined
      let scenarioPrompt =
        "The Avengers are facing an alien invasion in New York City. You join the team as they fight to protect civilians and defeat the alien threat.";

      // Only try to access scenarioData.initialContext if scenarioData exists
      if (scenarioData && scenarioData.initialContext) {
        scenarioPrompt = scenarioData.initialContext;
      }

      // Set background
      const scenarioBackground =
        "linear-gradient(to right, #3a1c71, #d76d77, #ffaf7b)"; // Heroic gradient

      // Start the chat with this scenario
      console.log("Calling onStartChat with:", {
        name: "Avengers join battle",
        charactersCount: characters.length,
        scenarioPrompt,
        scenarioBackground,
        theme: "superhero",
      });

      onStartChat(
        "Avengers join battle",
        characters,
        scenarioPrompt,
        scenarioBackground,
        "superhero"
      );
    } catch (error) {
      console.error("Error starting Avengers join battle scenario:", error);
      // Fallback to the regular Avengers scenario if there's an error
      console.log("Error occurred, falling back to regular Avengers scenario");
      startAvengersScenario();
    }
  };

  // Function to start the Avengers: Alien Invasion scenario
  const startAvengersScenario = () => {
    console.log("Starting Avengers scenario...");
    // Get the scenario data
    const scenarioData = getScenarioData("Avengers: Alien Invasion");
    console.log("Scenario data:", scenarioData);

    if (!scenarioData) {
      console.error("Avengers scenario data not found");
      return;
    }

    // Create the Avengers characters
    const characters = [
      {
        name: "Captain America",
        type: "superhero",
        mood: "determined",
        description:
          "The first Avenger and a natural leader with unwavering moral principles.",
        avatar: "🛡️",
        personality: {
          analytical: 7,
          emotional: 6,
          philosophical: 8,
          humor: 4,
          confidence: 9,
        },
      },
      {
        name: "Iron Man",
        type: "superhero",
        mood: "confident",
        description:
          "Genius billionaire Tony Stark with advanced technology and quick wit.",
        avatar: "🔴",
        personality: {
          analytical: 10,
          emotional: 5,
          philosophical: 6,
          humor: 9,
          confidence: 10,
        },
      },
      {
        name: "Thor",
        type: "superhero",
        mood: "powerful",
        description:
          "The Asgardian God of Thunder with control over lightning and storms.",
        avatar: "⚡",
        personality: {
          analytical: 5,
          emotional: 7,
          philosophical: 6,
          humor: 7,
          confidence: 9,
        },
      },
      {
        name: "Hulk",
        type: "superhero",
        mood: "angry",
        description:
          "The strongest Avenger with incredible strength fueled by rage.",
        avatar: "💪",
        personality: {
          analytical: 8,
          emotional: 10,
          philosophical: 4,
          humor: 5,
          confidence: 8,
        },
      },
    ];

    // Create the scenario details
    const scenarioPrompt =
      scenarioData.initialContext ||
      "The Avengers are facing an alien invasion in New York City. The team must work together to protect civilians and defeat the alien threat.";

    // Set background
    const scenarioBackground =
      "linear-gradient(to right, #3a1c71, #d76d77, #ffaf7b)"; // Heroic gradient

    // Start the chat with this scenario
    console.log("Calling onStartChat with:", {
      name: "Avengers: Alien Invasion",
      charactersCount: characters.length,
      scenarioPrompt,
      scenarioBackground,
      theme: "superhero",
    });

    onStartChat(
      "Avengers: Alien Invasion",
      characters,
      scenarioPrompt,
      scenarioBackground,
      "superhero"
    );
  };

  // Features are now defined directly in the JSX

  return (
    <div className="flex flex-col min-h-screen">
      {/* Comprehensive header with all key actions */}
      <header className="border-b sticky top-0 z-50 bg-background/95 backdrop-blur-sm shadow-sm">
        <div className="container mx-auto py-2 px-4">
          {/* Main header row */}
          <div className="flex justify-between items-center">
            {/* Logo */}
            <div className="flex items-center gap-2">
              <div className="bg-primary/10 p-1.5 rounded-md">
                <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-purple-600">
                  Velora
                </h1>
              </div>
            </div>

            {/* Main navigation - desktop only */}
            <nav className="hidden md:flex items-center space-x-4">
              <a
                href="#features"
                className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors"
              >
                Features
              </a>
              <a
                href="#how-it-works"
                className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors"
              >
                How It Works
              </a>
              <button
                onClick={onHowToUse}
                className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors"
              >
                Guide
              </button>
            </nav>

            {/* Action buttons and theme toggle */}
            <div className="flex items-center gap-2">
              {/* Mobile menu buttons */}
              <button
                onClick={onQuickStart}
                className="md:hidden p-2 rounded-full bg-primary/90 flex items-center justify-center"
                title="Quick Start"
              >
                <Sparkles className="h-4 w-4 text-primary-foreground" />
                <span className="sr-only">Quick Start</span>
              </button>

              <button
                onClick={() => setIsUploadModalOpen(true)}
                className="md:hidden p-2 rounded-full hover:bg-secondary/80 flex items-center justify-center"
                title="Upload Saved Chat"
              >
                <Upload className="h-4 w-4" />
                <span className="sr-only">Upload Saved Chat</span>
              </button>

              <button
                onClick={onHowToUse}
                className="p-2 rounded-full hover:bg-secondary/80 flex items-center justify-center md:hidden"
                title="How to Use Velora"
              >
                <HelpCircle className="h-4 w-4" />
                <span className="sr-only">How to Use</span>
              </button>

              {/* Theme toggle */}
              <button
                onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                className="p-2 rounded-full bg-secondary/80"
                title={
                  theme === "dark"
                    ? "Switch to Light Mode"
                    : "Switch to Dark Mode"
                }
              >
                {theme === "dark" ? (
                  <Sun className="h-4 w-4" />
                ) : (
                  <Moon className="h-4 w-4" />
                )}
                <span className="sr-only">Toggle theme</span>
              </button>
            </div>
          </div>

          {/* Action buttons row - desktop only */}
          <div className="hidden md:flex items-center justify-between mt-2 pb-1">
            <div className="text-xs text-muted-foreground">
              Create immersive AI adventures in seconds
            </div>

            <div className="flex items-center gap-2">
              {/* Quick start button */}
              <button
                onClick={onQuickStart}
                className="flex h-8 items-center justify-center rounded-lg bg-primary px-3 text-xs font-medium text-primary-foreground shadow-sm transition-all hover:bg-primary/90"
              >
                <Sparkles className="h-3.5 w-3.5 mr-1.5" />
                Quick Start
              </button>

              {/* Character selection */}
              <button
                onClick={onSelectCharacter}
                className="flex h-8 items-center justify-center rounded-lg border border-primary/30 bg-background/60 backdrop-blur-sm px-3 text-xs font-medium transition-all hover:bg-primary/5 hover:border-primary/50"
              >
                <Users className="h-3.5 w-3.5 mr-1.5 text-primary" />
                Characters
              </button>

              {/* Scenario selection */}
              <button
                onClick={onCreateScenario}
                className="flex h-8 items-center justify-center rounded-lg border border-primary/30 bg-background/60 backdrop-blur-sm px-3 text-xs font-medium transition-all hover:bg-primary/5 hover:border-primary/50"
              >
                <Wand2 className="h-3.5 w-3.5 mr-1.5 text-primary" />
                Scenarios
              </button>

              {/* Upload saved chat */}
              <button
                onClick={() => setIsUploadModalOpen(true)}
                className="flex h-8 items-center justify-center rounded-lg border border-primary/30 bg-background/60 backdrop-blur-sm px-3 text-xs font-medium transition-all hover:bg-primary/5 hover:border-primary/50"
              >
                <Upload className="h-3.5 w-3.5 mr-1.5 text-primary" />
                Resume Chat
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* High-impact hero section with clear value proposition */}
      <section className="relative overflow-hidden py-10 md:py-12">
        {/* Subtle background elements */}
        <div className="absolute inset-0 bg-gradient-to-b from-primary/10 via-primary/5 to-background pointer-events-none"></div>
        <div className="absolute top-0 right-0 w-1/3 h-1/3 bg-primary/5 rounded-full blur-3xl transform translate-x-1/4 -translate-y-1/4"></div>

        <div className="container px-4 md:px-6 relative z-10">
          <div className="flex flex-col lg:flex-row gap-8 items-center max-w-6xl mx-auto">
            {/* Left column: Value proposition and CTA */}
            <div className="lg:w-5/12 space-y-4 text-center lg:text-left">
              <div className="inline-flex items-center px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium">
                <Sparkles className="h-3.5 w-3.5 mr-2" />
                <span>No Login Required</span>
              </div>

              <h1 className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl">
                Immersive AI Characters in{" "}
                <span className="relative">
                  <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary to-purple-600">
                    Living Worlds
                  </span>
                  <span className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-primary/50 to-purple-600/50 rounded-full"></span>
                </span>
              </h1>

              <p className="text-muted-foreground max-w-[500px] mx-auto lg:mx-0">
                Create immersive adventures with AI characters that remember
                context and respond naturally to your actions.
              </p>

              {/* Primary CTA with social proof */}
              <div className="pt-2">
                <div className="flex flex-col sm:flex-row gap-3 justify-center lg:justify-start mb-4">
                  <button
                    onClick={onQuickStart}
                    className="inline-flex h-12 items-center justify-center rounded-lg bg-primary px-6 text-base font-medium text-primary-foreground shadow-lg transition-all hover:bg-primary/90 hover:scale-105"
                  >
                    <Sparkles className="h-5 w-5 mr-2" />
                    Start in 5 Seconds
                  </button>
                  <button
                    onClick={onSelectCharacter}
                    className="inline-flex h-12 items-center justify-center rounded-lg border border-primary/30 bg-background/60 backdrop-blur-sm px-6 text-base font-medium shadow-lg transition-all hover:bg-primary/10 hover:border-primary/50"
                  >
                    <Users className="h-5 w-5 mr-2 text-primary" />
                    Browse Characters
                  </button>
                </div>

                {/* Social proof */}
                <div className="flex items-center justify-center lg:justify-start gap-2 text-xs text-muted-foreground">
                  <div className="flex -space-x-1">
                    <div className="w-5 h-5 rounded-full bg-purple-500/30 border border-background"></div>
                    <div className="w-5 h-5 rounded-full bg-blue-500/30 border border-background"></div>
                    <div className="w-5 h-5 rounded-full bg-green-500/30 border border-background"></div>
                  </div>
                  <span>Join 1000+ users creating adventures daily</span>
                </div>
              </div>
            </div>

            {/* Right column: Interactive preview */}
            <div className="lg:w-7/12 relative">
              <div className="bg-background/40 backdrop-blur-sm rounded-xl border border-primary/20 shadow-xl overflow-hidden">
                {/* Chat header with character selection - Avengers theme */}
                <div className="p-3 border-b border-primary/10 flex items-center justify-between bg-background/60">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-red-500/30 flex items-center justify-center">
                      <Shield className="h-4 w-4 text-red-500" />
                    </div>
                    <div>
                      <span className="font-medium">
                        Avengers: Alien Invasion
                      </span>
                      <div className="flex items-center gap-1 text-xs text-muted-foreground">
                        <div className="flex -space-x-1">
                          <div className="w-4 h-4 rounded-full bg-red-500/30 border border-background"></div>
                          <div className="w-4 h-4 rounded-full bg-green-500/30 border border-background"></div>
                          <div className="w-4 h-4 rounded-full bg-blue-500/30 border border-background"></div>
                          <div className="w-4 h-4 rounded-full bg-yellow-500/30 border border-background"></div>
                        </div>
                        <span>4 characters • Battle in progress</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    <button className="w-7 h-7 rounded-full bg-background/80 flex items-center justify-center border border-primary/20">
                      <Users className="h-3.5 w-3.5 text-primary" />
                    </button>
                    <button className="w-7 h-7 rounded-full bg-background/80 flex items-center justify-center border border-primary/20">
                      <Sparkles className="h-3.5 w-3.5 text-primary" />
                    </button>
                  </div>
                </div>

                {/* Chat messages - Avengers battle scenario */}
                <div className="p-4 flex flex-col gap-3 max-h-[250px] overflow-hidden relative bg-gradient-to-br from-background/30 to-background/10">
                  <div className="flex gap-2 items-start max-w-[80%]">
                    <div className="w-8 h-8 rounded-full bg-red-500/30 flex-shrink-0 border border-red-500/20 shadow-sm flex items-center justify-center text-xs">
                      🛡️
                    </div>
                    <div className="bg-background/60 backdrop-blur-sm p-2.5 rounded-lg rounded-tl-none shadow-sm border border-primary/10">
                      <p className="text-xs text-primary/80 font-medium mb-0.5">
                        Captain America
                      </p>
                      <p className="text-sm">
                        Thor! We need your lightning on the east flank! These
                        aliens are breaking through our defenses!
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-2 items-start max-w-[80%] self-end">
                    <div className="bg-primary/90 p-2.5 rounded-lg rounded-tr-none text-primary-foreground shadow-md">
                      <p className="text-sm">
                        *raises Mjolnir* These creatures shall feel the wrath of
                        Asgard! *summons lightning* Stand back, my friends!
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-2 items-start max-w-[80%]">
                    <div className="w-8 h-8 rounded-full bg-green-500/30 flex-shrink-0 border border-green-500/20 shadow-sm flex items-center justify-center text-xs">
                      💪
                    </div>
                    <div className="bg-background/60 backdrop-blur-sm p-2.5 rounded-lg rounded-tl-none shadow-sm border border-primary/10">
                      <p className="text-xs text-primary/80 font-medium mb-0.5">
                        Hulk
                      </p>
                      <p className="text-sm">
                        HULK SMASH ALIENS! *leaps into a group of enemies,
                        creating a shockwave* PUNY SPACE MONSTERS!
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-2 items-start max-w-[80%]">
                    <div className="w-8 h-8 rounded-full bg-red-500/40 flex-shrink-0 border border-red-500/20 shadow-sm flex items-center justify-center text-xs">
                      🔴
                    </div>
                    <div className="bg-background/60 backdrop-blur-sm p-2.5 rounded-lg rounded-tl-none shadow-sm border border-primary/10">
                      <p className="text-xs text-primary/80 font-medium mb-0.5">
                        Iron Man
                      </p>
                      <p className="text-sm">
                        I'm detecting a mothership above the city. Thor, think
                        you can give me a boost with that lightning? Let's take
                        this fight to them!
                      </p>
                    </div>
                  </div>

                  <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-background/80 to-transparent pointer-events-none"></div>
                </div>

                {/* Chat input with action buttons */}
                <div className="p-3 border-t border-primary/10 bg-background/60">
                  <div className="flex gap-2 items-center">
                    <div
                      className="flex-1 bg-background/80 rounded-lg border border-primary/20 p-2 text-sm text-muted-foreground cursor-pointer hover:border-primary/50 transition-colors"
                      onClick={() => startAvengersJoinBattleScenario()}
                    >
                      Type your message as Thor...
                    </div>
                    <button
                      className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-primary-foreground shadow-md hover:bg-primary/90 transition-colors"
                      onClick={() => startAvengersJoinBattleScenario()}
                    >
                      <ArrowRight className="h-4 w-4" />
                    </button>
                  </div>
                  <div className="flex justify-between mt-2 px-1">
                    <div className="flex gap-2 text-xs text-muted-foreground">
                      <span className="flex items-center">
                        <ShieldCheck className="h-3 w-3 mr-1" /> Private
                      </span>
                      <span className="flex items-center">
                        <Sparkles className="h-3 w-3 mr-1" /> AI-Powered
                      </span>
                    </div>
                    <button
                      className="text-xs text-primary hover:underline font-medium"
                      onClick={() => {
                        console.log("Join the battle button clicked");
                        try {
                          startAvengersJoinBattleScenario();
                          console.log(
                            "startAvengersJoinBattleScenario completed successfully"
                          );
                        } catch (error) {
                          console.error(
                            "Error in startAvengersJoinBattleScenario:",
                            error
                          );
                        }
                      }}
                    >
                      Join the battle →
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Combined Get Started & How It Works section */}
      <section
        id="how-it-works"
        className="py-14 relative overflow-hidden bg-gradient-to-b from-background to-secondary/5"
      >
        <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-primary/20 to-transparent"></div>

        <div className="container px-4 md:px-6 relative z-10">
          <div className="text-center mb-8">
            <div className="inline-flex items-center px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium mb-2">
              <Zap className="h-3.5 w-3.5 mr-2" />
              <span>Start in Seconds</span>
            </div>
            <h2 className="text-2xl font-bold tracking-tight sm:text-3xl mb-2">
              How It Works
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Three simple steps to immersive AI adventures
            </p>
          </div>

          {/* Process steps with action buttons - Horizontal layout */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {/* Step 1 */}
            <div className="bg-background rounded-xl border border-primary/20 shadow-md p-4 transition-all duration-300 hover:shadow-lg hover:border-primary/30 group">
              <div className="flex items-center gap-3 mb-3">
                <div className="bg-primary/10 w-10 h-10 rounded-full flex items-center justify-center group-hover:bg-primary/20 transition-colors flex-shrink-0">
                  <span className="font-bold text-primary">1</span>
                </div>
                <h3 className="text-lg font-bold group-hover:text-primary transition-colors">
                  Choose Characters
                </h3>
              </div>
              <p className="text-sm text-muted-foreground mb-3">
                Select from our library of AI personalities or create custom
                characters with unique traits.
              </p>
              <div className="flex items-center justify-between">
                <div className="flex -space-x-2">
                  <div className="w-8 h-8 rounded-full bg-purple-500/30 border-2 border-background"></div>
                  <div className="w-8 h-8 rounded-full bg-blue-500/30 border-2 border-background"></div>
                  <div className="w-8 h-8 rounded-full bg-green-500/30 border-2 border-background"></div>
                </div>
                <button
                  onClick={onSelectCharacter}
                  className="text-xs font-medium text-primary hover:underline flex items-center"
                >
                  Browse Characters <ArrowRight className="h-3 w-3 ml-1" />
                </button>
              </div>
            </div>

            {/* Step 2 */}
            <div className="bg-background rounded-xl border border-primary/20 shadow-md p-4 transition-all duration-300 hover:shadow-lg hover:border-primary/30 group">
              <div className="flex items-center gap-3 mb-3">
                <div className="bg-primary/10 w-10 h-10 rounded-full flex items-center justify-center group-hover:bg-primary/20 transition-colors flex-shrink-0">
                  <span className="font-bold text-primary">2</span>
                </div>
                <h3 className="text-lg font-bold group-hover:text-primary transition-colors">
                  Select Scenario
                </h3>
              </div>
              <p className="text-sm text-muted-foreground mb-3">
                Choose a pre-made scenario or describe your own setting for AI
                to generate a rich world.
              </p>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => startScenario("The Lost Artifact")}
                    className="bg-primary/10 px-2 py-1 rounded text-xs text-primary hover:bg-primary/20"
                  >
                    Fantasy
                  </button>
                  <button
                    onClick={() => startScenario("Space Station Omega")}
                    className="bg-primary/10 px-2 py-1 rounded text-xs text-primary hover:bg-primary/20"
                  >
                    Sci-Fi
                  </button>
                </div>
                <button
                  onClick={onCreateScenario}
                  className="text-xs font-medium text-primary hover:underline flex items-center"
                >
                  Create Scenario <ArrowRight className="h-3 w-3 ml-1" />
                </button>
              </div>
            </div>

            {/* Step 3 */}
            <div className="bg-background rounded-xl border border-primary/20 shadow-md p-4 transition-all duration-300 hover:shadow-lg hover:border-primary/30 group">
              <div className="flex items-center gap-3 mb-3">
                <div className="bg-primary/10 w-10 h-10 rounded-full flex items-center justify-center group-hover:bg-primary/20 transition-colors flex-shrink-0">
                  <span className="font-bold text-primary">3</span>
                </div>
                <h3 className="text-lg font-bold group-hover:text-primary transition-colors">
                  Start Chatting
                </h3>
              </div>
              <p className="text-sm text-muted-foreground mb-3">
                Engage in dynamic conversations with AI characters that remember
                context and respond naturally.
              </p>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-purple-500/30 flex-shrink-0 border border-purple-500/20"></div>
                  <div className="bg-background/60 p-1.5 rounded-lg text-xs border border-primary/10">
                    Ready?
                  </div>
                </div>
                <button
                  onClick={onQuickStart}
                  className="text-xs font-medium text-primary hover:underline flex items-center"
                >
                  Quick Start <ArrowRight className="h-3 w-3 ml-1" />
                </button>
              </div>
            </div>
          </div>

          {/* Secondary actions - Horizontal layout */}
          <div className="flex justify-center gap-4 mt-8 max-w-xl mx-auto">
            <button
              onClick={() => setIsUploadModalOpen(true)}
              className="inline-flex h-9 items-center justify-center rounded-lg border border-primary/20 bg-background/60 backdrop-blur-sm px-4 text-xs font-medium transition-all hover:bg-primary/5 hover:border-primary/30"
            >
              <Upload className="h-3.5 w-3.5 mr-1.5 text-primary" />
              Upload Saved Chat
            </button>
            <button
              onClick={onHowToUse}
              className="inline-flex h-9 items-center justify-center rounded-lg border border-primary/20 bg-background/60 backdrop-blur-sm px-4 text-xs font-medium transition-all hover:bg-primary/5 hover:border-primary/30"
            >
              <HelpCircle className="h-3.5 w-3.5 mr-1.5 text-primary" />
              View Guide
            </button>
          </div>
        </div>
      </section>

      {/* Features section - Simplified and more compact */}
      <section id="features" className="py-16 relative overflow-hidden">
        {/* Simplified background */}
        <div className="absolute inset-0 bg-gradient-to-b from-primary/5 to-background/80 pointer-events-none"></div>
        <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-primary/20 to-transparent"></div>

        <div className="container px-4 md:px-6 relative z-10">
          <div className="text-center mb-10">
            <div className="inline-flex items-center px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium mb-2">
              <Zap className="h-3.5 w-3.5 mr-2" />
              <span>Designed for Immersion</span>
            </div>
            <h2 className="text-2xl font-bold tracking-tight sm:text-3xl mb-2">
              Key Features
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Everything you need for immersive AI character interactions
            </p>
          </div>

          {/* Feature cards - Horizontal layout for larger screens */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {/* Dynamic Conversations */}
            <div className="group relative bg-background rounded-xl border border-primary/20 shadow-md overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:border-primary/30">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary to-purple-600 transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left"></div>
              <div className="p-4">
                <div className="flex items-center gap-3 mb-3">
                  <div className="bg-primary/10 w-10 h-10 rounded-full flex items-center justify-center group-hover:bg-primary/20 transition-colors flex-shrink-0">
                    <MessageSquare className="h-5 w-5 text-primary" />
                  </div>
                  <h3 className="text-lg font-bold group-hover:text-primary transition-colors">
                    Dynamic Conversations
                  </h3>
                </div>
                <p className="text-sm text-muted-foreground mb-3">
                  Context-aware, memory-rich replies that evolve with your
                  interactions.
                </p>
              </div>
            </div>

            {/* AI-Generated Scenarios */}
            <div className="group relative bg-background rounded-xl border border-primary/20 shadow-md overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:border-primary/30">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary to-purple-600 transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left"></div>
              <div className="p-4">
                <div className="flex items-center gap-3 mb-3">
                  <div className="bg-primary/10 w-10 h-10 rounded-full flex items-center justify-center group-hover:bg-primary/20 transition-colors flex-shrink-0">
                    <Wand2 className="h-5 w-5 text-primary" />
                  </div>
                  <h3 className="text-lg font-bold group-hover:text-primary transition-colors">
                    AI-Generated Worlds
                  </h3>
                </div>
                <p className="text-sm text-muted-foreground mb-3">
                  Describe your ideal scenario in a few words and watch as AI
                  creates a rich, detailed world.
                </p>
              </div>
            </div>

            {/* No Login Needed */}
            <div className="group relative bg-background rounded-xl border border-primary/20 shadow-md overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:border-primary/30">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary to-purple-600 transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left"></div>
              <div className="p-4">
                <div className="flex items-center gap-3 mb-3">
                  <div className="bg-primary/10 w-10 h-10 rounded-full flex items-center justify-center group-hover:bg-primary/20 transition-colors flex-shrink-0">
                    <Sparkles className="h-5 w-5 text-primary" />
                  </div>
                  <h3 className="text-lg font-bold group-hover:text-primary transition-colors">
                    No Login Required
                  </h3>
                </div>
                <p className="text-sm text-muted-foreground mb-3">
                  Jump right in without creating an account. Your chats can be
                  saved locally for privacy.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* High-conversion CTA section */}
      <section className="py-12 relative overflow-hidden">
        {/* Simplified background */}
        <div className="absolute inset-0 bg-gradient-to-t from-primary/10 via-primary/5 to-background pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-primary/20 to-transparent"></div>

        <div className="container px-4 md:px-6 relative z-10">
          <div className="max-w-4xl mx-auto">
            <div className="bg-background/40 backdrop-blur-sm rounded-xl border border-primary/20 shadow-lg p-5 md:p-6">
              <div className="flex flex-col md:flex-row md:items-center gap-6">
                {/* Left side: CTA text */}
                <div className="md:w-7/12">
                  <div className="inline-flex items-center px-2 py-1 rounded-full bg-primary/10 text-primary text-xs font-medium mb-2">
                    <Sparkles className="h-3 w-3 mr-1.5" />
                    <span>Start in 5 Seconds</span>
                  </div>

                  <h2 className="text-xl md:text-2xl font-bold tracking-tight mb-2">
                    Ready to Create Your Own Adventure?
                  </h2>

                  <p className="text-sm text-muted-foreground mb-4">
                    Join thousands of users creating immersive AI adventures
                    with characters that remember context and respond naturally.
                  </p>

                  {/* Social proof */}
                  <div className="flex items-center gap-3 mb-4 md:mb-0">
                    <div className="flex -space-x-1.5">
                      <div className="w-6 h-6 rounded-full bg-purple-500/30 border-2 border-background"></div>
                      <div className="w-6 h-6 rounded-full bg-blue-500/30 border-2 border-background"></div>
                      <div className="w-6 h-6 rounded-full bg-green-500/30 border-2 border-background"></div>
                      <div className="w-6 h-6 rounded-full bg-amber-500/30 border-2 border-background"></div>
                    </div>
                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                      <ShieldCheck className="h-3 w-3 text-primary" />
                      <span>100% private • No login required</span>
                    </div>
                  </div>
                </div>

                {/* Right side: Action buttons */}
                <div className="md:w-5/12 flex flex-col gap-3">
                  <button
                    onClick={onQuickStart}
                    className="inline-flex h-11 items-center justify-center rounded-lg bg-primary px-5 text-sm font-medium text-primary-foreground shadow-md transition-all hover:bg-primary/90 hover:scale-105 w-full"
                  >
                    <Sparkles className="h-4 w-4 mr-2" />
                    Start Your Adventure Now
                  </button>

                  <div className="flex gap-3 w-full">
                    <button
                      onClick={onSelectCharacter}
                      className="inline-flex h-9 items-center justify-center rounded-lg border border-primary/30 bg-background/60 backdrop-blur-sm px-3 text-xs font-medium shadow-md transition-all hover:bg-primary/10 hover:border-primary/50 flex-1"
                    >
                      <Users className="h-3.5 w-3.5 mr-1.5 text-primary" />
                      Browse Characters
                    </button>

                    <button
                      onClick={onCreateScenario}
                      className="inline-flex h-9 items-center justify-center rounded-lg border border-primary/30 bg-background/60 backdrop-blur-sm px-3 text-xs font-medium shadow-md transition-all hover:bg-primary/10 hover:border-primary/50 flex-1"
                    >
                      <Wand2 className="h-3.5 w-3.5 mr-1.5 text-primary" />
                      Create Scenario
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Ultra-compact footer */}
      <footer className="py-6 bg-background/95 border-t border-primary/10">
        <div className="container px-4 md:px-6">
          <div className="flex flex-wrap justify-between items-center gap-4">
            {/* Logo and theme toggle */}
            <div className="flex items-center gap-2">
              <div className="bg-primary/10 p-1 rounded-md">
                <h2 className="text-base font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-purple-600">
                  Velora
                </h2>
              </div>
              <button
                onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                className="w-7 h-7 rounded-md bg-primary/10 flex items-center justify-center text-primary hover:bg-primary/20 transition-colors"
                title={
                  theme === "dark"
                    ? "Switch to Light Mode"
                    : "Switch to Dark Mode"
                }
              >
                {theme === "dark" ? (
                  <Sun className="h-3.5 w-3.5" />
                ) : (
                  <Moon className="h-3.5 w-3.5" />
                )}
              </button>
            </div>

            {/* Navigation links */}
            <div className="flex items-center gap-4">
              <a
                href="#features"
                className="text-xs text-muted-foreground hover:text-primary transition-colors"
              >
                Features
              </a>
              <a
                href="#how-it-works"
                className="text-xs text-muted-foreground hover:text-primary transition-colors"
              >
                How It Works
              </a>
              <button
                onClick={onHowToUse}
                className="text-xs text-muted-foreground hover:text-primary transition-colors"
              >
                Guide
              </button>
            </div>
          </div>

          {/* Footer text */}
          <div className="border-t border-primary/10 mt-4 pt-4 flex justify-center items-center">
            <p className="text-xs text-muted-foreground">
              Made with love, coffee and vibe coding by{" "}
              <a
                href="https://www.linkedin.com/in/saurao-dalvi/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:text-primary/80 transition-colors underline"
              >
                Saurao Dalvi
              </a>
            </p>
          </div>
        </div>
      </footer>

      {/* Upload Modal - Redesigned with improved visual appeal */}
      {isUploadModalOpen && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center p-4 z-50 backdrop-blur-md">
          <div className="bg-background/95 backdrop-blur-sm rounded-xl shadow-2xl max-w-md w-full p-8 border border-primary/20 relative">
            {/* Close button */}
            <button
              onClick={() => setIsUploadModalOpen(false)}
              className="absolute top-4 right-4 w-8 h-8 rounded-full bg-background/80 flex items-center justify-center border border-primary/20 text-muted-foreground hover:text-primary transition-colors"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M18 6 6 18" />
                <path d="m6 6 12 12" />
              </svg>
              <span className="sr-only">Close</span>
            </button>

            {/* Modal header */}
            <div className="mb-6">
              <div className="inline-flex items-center px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium mb-3">
                <Upload className="h-3.5 w-3.5 mr-2" />
                <span>Continue Your Adventure</span>
              </div>
              <h2 className="text-2xl font-bold mb-2">Upload Saved Chat</h2>
              <p className="text-muted-foreground">
                Select a previously saved chat file (JSON) to continue your
                conversation.
              </p>
            </div>

            {/* Upload area */}
            <div className="bg-primary/5 rounded-xl p-8 mb-6 border border-primary/10 flex flex-col items-center justify-center text-center">
              <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                <Upload className="h-6 w-6 text-primary" />
              </div>
              <p className="text-sm text-muted-foreground mb-4">
                Drag and drop your chat file here, or click to browse
              </p>
              <input
                type="file"
                accept=".json"
                onChange={handleFileUpload}
                className="block w-full text-sm file:mr-4 file:py-3 file:px-6 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-primary file:text-primary-foreground hover:file:bg-primary/90 file:shadow-md file:transition-colors"
              />
            </div>

            {/* Action buttons */}
            <div className="flex justify-between gap-4">
              <button
                onClick={() => setIsUploadModalOpen(false)}
                className="flex-1 inline-flex h-12 items-center justify-center rounded-lg border border-primary/20 bg-background px-6 text-sm font-medium transition-all hover:bg-primary/5 hover:border-primary/30"
              >
                Cancel
              </button>
              <button
                onClick={() => setIsUploadModalOpen(false)}
                className="flex-1 inline-flex h-12 items-center justify-center rounded-lg bg-primary px-6 text-sm font-medium text-primary-foreground shadow-lg transition-all hover:bg-primary/90"
                disabled
              >
                <Upload className="h-4 w-4 mr-2" />
                Upload Chat
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LandingPage;
