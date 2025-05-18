import { useState, useEffect, useRef } from "react";
import { useTheme } from "./ThemeProvider";
import {
  ArrowLeft,
  Download,
  Send,
  Smile,
  Settings,
  RefreshCw,
  UserPlus,
  Sparkles,
  BookOpen,
  PenTool,
  Lightbulb,
  ChevronRight,
  Pencil,
  Zap,
  Type,
  Sliders,
  X,
  Search,
  Check,
  HelpCircle,
  User,
  Wand2,
  Compass,
  Flame,
  Wind,
  Droplets,
  Leaf,
  Sparkle,
  Target,
  Users,
  ArrowRight,
  ChevronLeft,
  Sun,
  Moon,
  UserCircle,
  Plus,
} from "lucide-react";
import Chip from "./ui/Chip";
import CharacterAvatar from "./CharacterAvatar";
import ScrollableQuickActions from "./ScrollableQuickActions";
import StoryDriver from "./StoryDriver";
import { detectBattleScenario } from "../utils/autoResponseUtils";
import { generateCharacterFallback } from "../utils/characterFallbackUtils";
import EmojiIcon, { emojiMap } from "./ui/EmojiIcon";
import {
  getCharacterQuickActions,
  getNarrativePhaseActions,
  detectBattleContext,
} from "../utils/quickActionUtils";
import {
  generateCharacterResponse,
  generateCharacterInteraction,
} from "../utils/chatUtils";
import { characterLibrary } from "../data/characters";
import {
  getRelationship,
  updateRelationship,
  analyzeInteraction,
} from "../utils/relationshipUtils";
import {
  getMoodState,
  updateMood,
  shouldAnnounceMoodChange,
  getMoodChangeDescription,
} from "../utils/moodUtils";
import { getUserCharacters } from "../utils/userCharacterUtils";
import UserCharacterManager from "./UserCharacterManager";
import { NarrativeDirector } from "../utils/story-branching/NarrativeDirector";
import StoryBranchSelector from "./StoryBranchSelector";
import { RelationshipMatrix } from "../utils/character-relationships/RelationshipMatrix";
import { RelationshipAnalyzer } from "../utils/character-relationships/RelationshipAnalyzer";
import RelationshipGraph from "./RelationshipGraph";
import { MemoryManager } from "../utils/memory-system/MemoryManager";
import MemoryPanel from "./MemoryPanel";
import { generateBattleOptions } from "../utils/enhancedStoryBranchingUtils";
import {
  updateStoryArc,
  generateWritingInstructions,
  getScenarioData,
} from "../utils/storyArcUtils";
import {
  determineNextSpeaker,
  determineResponders,
} from "../utils/characterTurnUtils";
import {
  shouldTriggerEnvironmentalEvent,
  generateEnvironmentalEvent,
} from "../utils/sceneUtils";
import { generateCharacterFromDescription } from "../utils/aiGenerationUtils";
import { ModularStoryManager } from "../utils/modularStoryUtils";
import { NarrativeStateManager } from "../utils/narrativeStateManager";
import { CharacterTurnTracker } from "../utils/characterTurnTracker";
import {
  generateSceneDescription,
  generateSensoryDetails,
} from "../utils/dynamicSceneUtils";
import MoodIndicator from "./MoodIndicator";

const ChatRoom = ({
  chatRoom,
  chatHistory,
  setChatHistory,
  storyArc,
  setStoryArc,
  onSaveChat,
  onLeaveChat,
  onHowToUse,
}) => {
  const { theme, setTheme } = useTheme();
  const [message, setMessage] = useState("");
  const [activeCharacter, setActiveCharacter] = useState(null);
  const [isTyping, setIsTyping] = useState(false);
  const [typingCharacter, setTypingCharacter] = useState(null);
  const [showSettings, setShowSettings] = useState(false);
  const [showActionMenu, setShowActionMenu] = useState(false);
  const [autoRespond, setAutoRespond] = useState(true);
  const [chatBackground, setChatBackground] = useState("");
  const [currentAction, setCurrentAction] = useState("");
  const [showNarrationInput, setShowNarrationInput] = useState(false);
  const [waitingForUserInput, setWaitingForUserInput] = useState(false);
  const [moodStates, setMoodStates] = useState([]);
  const [narrationText, setNarrationText] = useState("");
  const [showWritingInstructions, setShowWritingInstructions] = useState(false);
  const [showNextOptions, setShowNextOptions] = useState(false);
  const [showAddCharacter, setShowAddCharacter] = useState(false);
  const [availableCharacters, setAvailableCharacters] = useState([]);
  const [selectedNewCharacter, setSelectedNewCharacter] = useState(null);
  const [showCustomCharacterForm, setShowCustomCharacterForm] = useState(false);
  const [characterDescription, setCharacterDescription] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [editingMessage, setEditingMessage] = useState(null);
  const [editMessageText, setEditMessageText] = useState("");
  const [customCharacter, setCustomCharacter] = useState({
    name: "",
    description: "",
    type: "modern",
    mood: "neutral",
    avatar: "",
    opening_line: "",
    personality: {
      analytical: 5,
      emotional: 5,
      philosophical: 5,
      humor: 5,
      confidence: 5,
    },
    voiceStyle: "",
    talkativeness: 5,
    thinkingSpeed: 1.0,
  });

  // Writing instructions state
  const [writingInstructions, setWritingInstructions] = useState({
    storyArc: "",
    writingStyle: "balanced",
    emojiUsage: "minimal",
    responseLength: "medium",
    characterReminders: "",
    generalNotes: "",
  });

  // What happens next options
  const [nextOptions, setNextOptions] = useState([]);
  const [customNextOption, setCustomNextOption] = useState("");

  // New narrative management systems
  const [storyManager, setStoryManager] = useState(null);
  const [narrativeManager, setNarrativeManager] = useState(null);
  const [turnTracker, setTurnTracker] = useState(new CharacterTurnTracker());
  const [showSensoryPanel, setShowSensoryPanel] = useState(false);

  // Enhanced story branching system
  const [narrativeDirector, setNarrativeDirector] = useState(null);
  const [storyBranches, setStoryBranches] = useState([]);
  const [showStoryBranches, setShowStoryBranches] = useState(false);

  // Character relationship system
  const [relationshipMatrix, setRelationshipMatrix] = useState(null);
  const [relationshipAnalyzer, setRelationshipAnalyzer] = useState(null);
  const [relationships, setRelationships] = useState([]);
  const [showRelationshipGraph, setShowRelationshipGraph] = useState(false);
  const [relationshipSuggestions, setRelationshipSuggestions] = useState([]);
  const [showRelationshipSuggestion, setShowRelationshipSuggestion] =
    useState(false);

  // Contextual memory system
  const [memoryManager, setMemoryManager] = useState(null);
  const [memories, setMemories] = useState([]);
  const [showMemoryPanel, setShowMemoryPanel] = useState(false);
  const [memoryContext, setMemoryContext] = useState("");
  const [showMemoryRecall, setShowMemoryRecall] = useState(false);
  const [recalledMemory, setRecalledMemory] = useState(null);
  const [sensoryDescriptions, setSensoryDescriptions] = useState({
    sight: "",
    sound: "",
    smell: "",
    touch: "",
    taste: "",
  });
  const [storyTension, setStoryTension] = useState(0);
  const [narrativePhase, setNarrativePhase] = useState("introduction");

  // Enhanced scene description tracking
  const [previousSceneDescriptions, setPreviousSceneDescriptions] = useState(
    []
  );
  const [currentLocation, setCurrentLocation] = useState("new_york");
  const [environmentalConditions, setEnvironmentalConditions] = useState({
    time: "midday",
    weather: "clear",
    progression: 0,
  });

  // Enhanced battle state tracking
  const [battleState, setBattleState] = useState({
    inProgress: false,
    intensity: 5,
    focusCharacter: null,
    threatLevel: "medium",
    civilianDanger: 3,
    enemyClusters: [],
  });

  // Track previous story branch choices
  const [previousChoices, setPreviousChoices] = useState([]);

  // User character management
  const [userCharacters, setUserCharacters] = useState([]);
  const [showUserCharacterManager, setShowUserCharacterManager] =
    useState(false);

  // Store full option objects for battle scenarios
  const [fullNextOptions, setFullNextOptions] = useState([]);

  // State for ScrollableQuickActions component
  const [categories, setCategories] = useState([]);
  const [categorizedChildren, setCategorizedChildren] = useState({});
  const [prioritizedActions, setPrioritizedActions] = useState({});

  const messagesEndRef = useRef(null);
  const chatContainerRef = useRef(null);

  // Create a "yourself" character object
  const yourselfCharacter = {
    name: "Yourself",
    type: "user",
    mood: "neutral",
    description: "This is you, speaking as yourself in the conversation.",
    avatar: "", // Will use initials
    personality: {
      analytical: 5,
      emotional: 5,
      philosophical: 5,
      humor: 5,
      confidence: 5,
    },
  };

  // Load user characters
  const loadUserCharacters = () => {
    const characters = getUserCharacters();
    setUserCharacters(characters);
  };

  useEffect(() => {
    console.log("ChatRoom useEffect - chatRoom changed:", chatRoom?.name);

    // Add defensive check for chatRoom
    if (!chatRoom) {
      console.error("ChatRoom component received null/undefined chatRoom");
      alert(
        "Error: Chat room data is missing. Please try again or contact support."
      );
      onLeaveChat(); // Return to landing page if chatRoom is missing
      return; // Exit early if chatRoom is not available
    }

    // Add defensive check for characters array
    if (!chatRoom.characters || !Array.isArray(chatRoom.characters)) {
      console.error(
        "ChatRoom received invalid characters array:",
        chatRoom.characters
      );
      alert("Error: Character data is invalid. Returning to main menu.");
      onLeaveChat(); // Return to landing page if characters are invalid
      return;
    }

    // Log the number of characters for debugging
    console.log(
      `Chat room initialized with ${chatRoom.characters.length} characters:`,
      chatRoom.characters.map((c) => c.name).join(", ")
    );

    // Load user characters
    loadUserCharacters();

    // Set the first character as active by default
    if (chatRoom.characters.length > 0 && !activeCharacter) {
      setActiveCharacter(chatRoom.characters[0]);
    }

    // Set chat background if available in chatRoom
    if (chatRoom.background) {
      setChatBackground(chatRoom.background);
    }

    // Reset state for ScrollableQuickActions when chatRoom changes
    setCategories([]);
    setCategorizedChildren({});
    setPrioritizedActions({});

    // Initialize available characters for adding to chat
    if (chatRoom) {
      // Filter out characters already in the chat
      const existingCharacterNames = chatRoom.characters.map(
        (char) => char.name
      );
      const filteredCharacters = characterLibrary.filter(
        (char) => !existingCharacterNames.includes(char.name)
      );
      setAvailableCharacters(filteredCharacters);

      // Initialize relationships between all characters
      if (chatRoom.characters.length > 1) {
        const initialRelationships = [];

        // Create relationships between all pairs of characters
        for (let i = 0; i < chatRoom.characters.length; i++) {
          for (let j = i + 1; j < chatRoom.characters.length; j++) {
            const char1 = chatRoom.characters[i];
            const char2 = chatRoom.characters[j];

            // Initialize relationship
            const relationship = getRelationship(
              initialRelationships,
              char1.name,
              char2.name
            );
            initialRelationships.push(relationship);
          }
        }

        setRelationships(initialRelationships);
      }

      // Initialize mood states for all characters
      const initialMoodStates = [];
      chatRoom.characters.forEach((character) => {
        const moodState = getMoodState(
          initialMoodStates,
          character.name,
          character
        );
        initialMoodStates.push(moodState);
      });

      setMoodStates(initialMoodStates);

      // Initialize the ModularStoryManager with the appropriate theme
      const theme =
        chatRoom.theme ||
        detectThemeFromPrompt(chatRoom.openingPrompt) ||
        "fantasy";
      const newStoryManager = new ModularStoryManager(theme);
      setStoryManager(newStoryManager);

      // Add characters to the story manager
      chatRoom.characters.forEach((character) => {
        // Determine character archetype and personality
        const archetype = determineArchetype(character);
        const personality = determinePersonality(character);

        newStoryManager.addCharacter(character.name, archetype, personality);
      });

      // Initialize the NarrativeStateManager
      const newNarrativeManager = new NarrativeStateManager();
      setNarrativeManager(newNarrativeManager);

      // Initialize the NarrativeDirector for enhanced story branching
      const scenarioType =
        theme === "superhero"
          ? "adventure"
          : theme === "noir"
          ? "mystery"
          : theme;
      const newNarrativeDirector = new NarrativeDirector(scenarioType);
      setNarrativeDirector(newNarrativeDirector);

      // Initialize the RelationshipMatrix and RelationshipAnalyzer
      const newRelationshipMatrix = new RelationshipMatrix();
      setRelationshipMatrix(newRelationshipMatrix);

      const newRelationshipAnalyzer = new RelationshipAnalyzer(
        newRelationshipMatrix
      );
      setRelationshipAnalyzer(newRelationshipAnalyzer);

      // Initialize relationships between all character pairs with defensive checks
      try {
        const characters = chatRoom.characters;
        if (characters && characters.length > 1) {
          for (let i = 0; i < characters.length; i++) {
            for (let j = i + 1; j < characters.length; j++) {
              const char1 = characters[i]?.name;
              const char2 = characters[j]?.name;

              if (char1 && char2) {
                // Initialize with default values
                newRelationshipMatrix.initializeRelationship(char1, char2);
              } else {
                console.warn(
                  "Skipping relationship initialization for undefined character names",
                  {
                    char1Index: i,
                    char2Index: j,
                    char1Name: char1,
                    char2Name: char2,
                  }
                );
              }
            }
          }

          // Update relationships state
          const allRelationships = newRelationshipMatrix.getAllRelationships();
          console.log("Initialized relationships:", allRelationships);
          setRelationships(allRelationships);
        } else {
          console.log("Not enough characters to initialize relationships");
        }
      } catch (error) {
        console.error("Error initializing relationship matrix:", error);
      }

      // Initialize the MemoryManager for contextual memory
      const storageKey = `velora-memories-${chatRoom.name
        .replace(/\s+/g, "-")
        .toLowerCase()}`;
      const newMemoryManager = new MemoryManager({
        maxMemories: 200,
        recentMessageCount: 15,
        summaryInterval: 20,
        storageKey: storageKey,
      });
      setMemoryManager(newMemoryManager);

      // Load initial memories
      setMemories(newMemoryManager.getAllMemories());

      // Set relationships in the narrative director
      if (relationships.length > 0) {
        newNarrativeDirector.setCharacterRelationships(relationships);
      }

      // Initialize sensory descriptions based on theme
      updateSensoryDescriptions(newStoryManager);

      // Set initial narrative phase based on story arc
      if (storyArc) {
        setNarrativePhase(storyArc.currentPhase || "introduction");
        setStoryTension(
          convertTensionToNumeric(storyArc.currentTension || "medium")
        );

        // Initialize the turn tracker with the appropriate context
        const isBattleScenario = detectBattleScenario(chatRoom, chatHistory);
        const battleIntensity = isBattleScenario
          ? 8
          : convertTensionToNumeric(storyArc.currentTension || "medium");

        turnTracker.setContext(
          isBattleScenario ? "battle" : storyArc.currentPhase || "conversation",
          {
            intensity: battleIntensity,
            threatLevel: storyArc.currentTension || "medium",
          }
        );

        // For Avengers scenario, set up special battle tracking
        if (chatRoom.name && chatRoom.name.includes("Avengers")) {
          console.log("Initializing Avengers battle scenario");
          try {
            // Determine location based on chat history or default to New York
            let detectedLocation = "new_york";
            if (
              chatHistory &&
              Array.isArray(chatHistory) &&
              chatHistory.length > 0
            ) {
              const locationKeywords = {
                "times square": "times_square",
                "central park": "central_park",
                "brooklyn bridge": "brooklyn_bridge",
                manhattan: "new_york",
                downtown: "new_york",
              };

              // Check last 10 messages for location references
              const recentMessages = chatHistory.slice(-10);
              for (const msg of recentMessages) {
                if (msg && msg.message) {
                  const msgLower = msg.message.toLowerCase();
                  for (const [keyword, location] of Object.entries(
                    locationKeywords
                  )) {
                    if (msgLower.includes(keyword)) {
                      detectedLocation = location;
                      break;
                    }
                  }
                }
              }
            }

            console.log(
              "Detected location for Avengers scenario:",
              detectedLocation
            );

            // Set current location
            setCurrentLocation(detectedLocation);

            // Update battle state with defensive checks
            const newBattleState = {
              inProgress: isBattleScenario,
              intensity: battleIntensity || 5, // Default to 5 if undefined
              focusCharacter: null, // Will be determined dynamically
              threatLevel: storyArc?.currentTension || "medium",
              civilianDanger: isBattleScenario ? 7 : 3,
              enemyClusters: [],
            };

            console.log("Setting battle state:", newBattleState);
            setBattleState(newBattleState);

            if (turnTracker) {
              turnTracker.updateBattleState(newBattleState);
            } else {
              console.warn(
                "turnTracker is undefined, cannot update battle state"
              );
            }
          } catch (error) {
            console.error(
              "Error initializing Avengers battle scenario:",
              error
            );
          }

          try {
            // Generate initial scene description with defensive checks
            console.log(
              "Generating scene description for location:",
              detectedLocation
            );
            const sceneDescription = generateSceneDescription(
              detectedLocation || "new_york",
              battleIntensity || 5,
              previousSceneDescriptions || []
            );

            if (sceneDescription) {
              console.log(
                "Generated scene description:",
                sceneDescription.substring(0, 50) + "..."
              );
              // Add to previous descriptions to avoid repetition
              setPreviousSceneDescriptions([sceneDescription]);
            } else {
              console.warn("Failed to generate scene description");
            }

            // Generate sensory details with defensive checks
            const sensorySuite = generateSensoryDetails(
              detectedLocation || "new_york",
              narrativePhase || "introduction",
              environmentalConditions || {
                time: "midday",
                weather: "clear",
                progression: 0,
              }
            );

            if (sensorySuite) {
              console.log("Generated sensory details");
            } else {
              console.warn("Failed to generate sensory details");
            }
          } catch (error) {
            console.error(
              "Error generating scene description or sensory details:",
              error
            );
          }

          // Update sensory descriptions with defensive check
          if (sensorySuite) {
            setSensoryDescriptions(sensorySuite);
          } else {
            // Set default sensory descriptions if sensorySuite is undefined
            setSensoryDescriptions({
              sight: "The battle rages around you in the streets of New York.",
              sound:
                "Explosions and the sounds of combat echo through the city.",
              smell: "The air is filled with dust and smoke.",
              touch: "The ground trembles beneath your feet.",
              taste: "There's a metallic taste in the air.",
            });
          }

          console.log(
            "Initialized Avengers battle scenario tracking in " +
              detectedLocation
          );

          // Generate initial "What Happens Next" options
          const initialOptions = generateBattleOptions(
            newBattleState,
            chatRoom.characters,
            previousChoices,
            detectedLocation
          );

          setNextOptions(initialOptions);
        }
      }
    }
  }, [chatRoom, activeCharacter]);

  // Helper function to detect theme from prompt
  const detectThemeFromPrompt = (prompt) => {
    if (!prompt) return "fantasy";

    const promptLower = prompt.toLowerCase();

    if (
      promptLower.includes("superhero") ||
      promptLower.includes("hero") ||
      promptLower.includes("power") ||
      promptLower.includes("villain")
    ) {
      return "superhero";
    }

    if (
      promptLower.includes("detective") ||
      promptLower.includes("mystery") ||
      promptLower.includes("crime") ||
      promptLower.includes("case")
    ) {
      return "noir";
    }

    return "fantasy"; // Default theme
  };

  // Helper function to determine character archetype
  const determineArchetype = (character) => {
    const description = (character.description || "").toLowerCase();

    if (
      description.includes("hero") ||
      description.includes("protagonist") ||
      description.includes("brave") ||
      description.includes("noble")
    ) {
      return "hero";
    }

    if (
      description.includes("villain") ||
      description.includes("antagonist") ||
      description.includes("evil") ||
      description.includes("dark")
    ) {
      return "villain";
    }

    if (
      description.includes("wise") ||
      description.includes("mentor") ||
      description.includes("guide") ||
      description.includes("teacher")
    ) {
      return "mentor";
    }

    return "hero"; // Default archetype
  };

  // Helper function to determine character personality
  const determinePersonality = (character) => {
    if (!character.personality) return "balanced";

    const { analytical, emotional, humor } = character.personality;

    if (analytical > 7) return "stoic";
    if (emotional > 7) return "passionate";
    if (humor > 7) return "quirky";

    return "balanced";
  };

  // Helper function to update sensory descriptions
  const updateSensoryDescriptions = (manager) => {
    if (!manager) return;

    const newDescriptions = {
      sight: manager.getSensoryDescription("sight"),
      sound: manager.getSensoryDescription("sound"),
      smell: manager.getSensoryDescription("smell"),
      touch: manager.getSensoryDescription("touch"),
      taste: manager.getSensoryDescription("taste"),
    };

    setSensoryDescriptions(newDescriptions);
  };

  // Helper function to convert tension string to numeric value
  const convertTensionToNumeric = (tension) => {
    const tensionMap = {
      "very low": 1,
      low: 3,
      medium: 5,
      high: 7,
      "very high": 9,
    };

    return tensionMap[tension] || 5;
  };

  // Helper function to detect if the current scenario is a battle
  const detectBattleScenario = (chatRoom, history) => {
    if (!chatRoom) return false;

    // Check chat room name and opening prompt
    const roomNameLower = chatRoom.name ? chatRoom.name.toLowerCase() : "";
    const openingPromptLower = chatRoom.openingPrompt
      ? chatRoom.openingPrompt.toLowerCase()
      : "";

    const battleKeywords = [
      "battle",
      "fight",
      "combat",
      "war",
      "invasion",
      "attack",
      "defend",
      "enemy",
      "enemies",
      "threat",
      "danger",
      "weapon",
      "alien",
    ];

    // Check if room name or opening prompt contains battle keywords
    for (const keyword of battleKeywords) {
      if (
        roomNameLower.includes(keyword) ||
        openingPromptLower.includes(keyword)
      ) {
        return true;
      }
    }

    // Check recent chat history for battle indicators
    if (history && history.length > 0) {
      // Look at the last 10 messages
      const recentMessages = history.slice(-10);
      let battleKeywordCount = 0;

      for (const msg of recentMessages) {
        if (msg.message) {
          const msgLower = msg.message.toLowerCase();

          for (const keyword of battleKeywords) {
            if (msgLower.includes(keyword)) {
              battleKeywordCount++;
              // If we find multiple battle keywords, it's likely a battle
              if (battleKeywordCount >= 3) {
                return true;
              }
            }
          }
        }
      }
    }

    return false;
  };

  // Toggle add character modal
  const toggleAddCharacter = () => {
    setShowAddCharacter(!showAddCharacter);

    // Reset selection when opening
    if (!showAddCharacter) {
      setSelectedNewCharacter(null);
    }
  };

  // Handle character selection in the add character modal
  const handleSelectCharacter = (character) => {
    setSelectedNewCharacter(character);
  };

  // Reset custom character form
  const resetCustomCharacterForm = () => {
    setCustomCharacter({
      name: "",
      description: "",
      type: "modern",
      mood: "neutral",
      avatar: "",
      opening_line: "",
      personality: {
        analytical: 5,
        emotional: 5,
        philosophical: 5,
        humor: 5,
        confidence: 5,
      },
      voiceStyle: "",
      talkativeness: 5,
      thinkingSpeed: 1.0,
    });

    // Hide character selection
    setSelectedNewCharacter(null);
  };

  // Handle custom character form input changes
  const handleCustomCharacterChange = (field, value) => {
    if (field.startsWith("personality.")) {
      const personalityField = field.split(".")[1];
      setCustomCharacter((prev) => ({
        ...prev,
        personality: {
          ...prev.personality,
          [personalityField]: value,
        },
      }));
    } else {
      setCustomCharacter((prev) => ({
        ...prev,
        [field]: value,
      }));
    }
  };

  // Generate character from description
  const handleGenerateCharacter = () => {
    if (!characterDescription || characterDescription.trim() === "") {
      return;
    }

    setIsGenerating(true);

    // Simulate a brief delay to mimic AI processing
    setTimeout(() => {
      // Generate character using our utility function
      const generatedCharacter =
        generateCharacterFromDescription(characterDescription);

      if (generatedCharacter) {
        // Update the form with the generated character
        setCustomCharacter({
          ...generatedCharacter,
          // Ensure all required properties are set
          personality: {
            analytical: generatedCharacter.personality?.analytical || 5,
            emotional: generatedCharacter.personality?.emotional || 5,
            philosophical: generatedCharacter.personality?.philosophical || 5,
            humor: generatedCharacter.personality?.humor || 5,
            confidence: generatedCharacter.personality?.confidence || 5,
          },
        });
      }

      setIsGenerating(false);
    }, 1000);
  };

  // Create and add custom character
  const handleCreateCustomCharacter = () => {
    // Validate required fields
    if (
      !customCharacter.name ||
      !customCharacter.description ||
      !customCharacter.mood
    ) {
      return;
    }

    // Create the new character with all required properties
    const newCharacter = {
      ...customCharacter,
      // Add any missing required fields
      background: customCharacter.description,
      catchphrases: [],
      // Ensure these properties are properly set
      talkativeness: customCharacter.talkativeness || 5,
      thinkingSpeed: customCharacter.thinkingSpeed || 1.0,
      personality: {
        analytical: customCharacter.personality?.analytical || 5,
        emotional: customCharacter.personality?.emotional || 5,
        philosophical: customCharacter.personality?.philosophical || 5,
        humor: customCharacter.personality?.humor || 5,
        confidence: customCharacter.personality?.confidence || 5,
        // Add any other personality traits that might be expected
        creativity: 5,
        sociability: 5,
      },
      // Ensure opening line is set
      opening_line:
        customCharacter.opening_line || `Hello, I'm ${customCharacter.name}.`,
    };

    // Add the character to the chat
    const updatedCharacters = [...chatRoom.characters, newCharacter];
    chatRoom.characters = updatedCharacters;

    // Add a system message announcing the new character
    const systemMessage = {
      id: Date.now(),
      message: `${newCharacter.name} has joined the conversation.`,
      system: true,
      timestamp: new Date().toISOString(),
    };

    setChatHistory([...chatHistory, systemMessage]);

    // If the character has an opening line, add it as a message
    if (newCharacter.opening_line) {
      setTimeout(() => {
        // Show typing indicator
        setIsTyping(true);
        setTypingCharacter(newCharacter);

        // Add the opening line after a delay
        setTimeout(() => {
          const openingMessage = {
            id: Date.now() + Math.random(),
            speaker: newCharacter.name,
            character: newCharacter,
            message: newCharacter.opening_line,
            isUser: false,
            timestamp: new Date().toISOString(),
          };

          setChatHistory((prev) => [...prev, openingMessage]);
          setIsTyping(false);
          setTypingCharacter(null);
        }, 1500);
      }, 500);
    }

    // Reset character description
    setCharacterDescription("");

    // Close the modals
    setShowCustomCharacterForm(false);
    setShowAddCharacter(false);
  };

  // Add the selected character to the chat
  const handleAddCharacter = () => {
    if (!selectedNewCharacter || !chatRoom) return;

    // Ensure the character has all required properties
    const characterToAdd = {
      ...selectedNewCharacter,
      // Ensure these properties are properly set
      talkativeness: selectedNewCharacter.talkativeness || 5,
      thinkingSpeed: selectedNewCharacter.thinkingSpeed || 1.0,
      personality: {
        analytical: selectedNewCharacter.personality?.analytical || 5,
        emotional: selectedNewCharacter.personality?.emotional || 5,
        philosophical: selectedNewCharacter.personality?.philosophical || 5,
        humor: selectedNewCharacter.personality?.humor || 5,
        confidence: selectedNewCharacter.personality?.confidence || 5,
        // Add any other personality traits that might be expected
        creativity: 5,
        sociability: 5,
      },
      // Ensure background is set
      background:
        selectedNewCharacter.background || selectedNewCharacter.description,
      // Ensure catchphrases is set
      catchphrases: selectedNewCharacter.catchphrases || [],
    };

    // Create a copy of the chat room with the new character
    const updatedCharacters = [...chatRoom.characters, characterToAdd];

    // Update the chatRoom object
    chatRoom.characters = updatedCharacters;

    // Add a system message announcing the new character
    const systemMessage = {
      id: Date.now(),
      message: `${characterToAdd.name} has joined the conversation.`,
      system: true,
      timestamp: new Date().toISOString(),
    };

    setChatHistory([...chatHistory, systemMessage]);

    // If the character has an opening line, add it as a message
    if (characterToAdd.opening_line) {
      setTimeout(() => {
        // Show typing indicator
        setIsTyping(true);
        setTypingCharacter(characterToAdd);

        // Add the opening line after a delay
        setTimeout(() => {
          const openingMessage = {
            id: Date.now() + Math.random(),
            speaker: characterToAdd.name,
            character: characterToAdd,
            message: characterToAdd.opening_line,
            isUser: false,
            timestamp: new Date().toISOString(),
          };

          setChatHistory((prev) => [...prev, openingMessage]);
          setIsTyping(false);
          setTypingCharacter(null);
        }, 1500);
      }, 500);
    }

    // Update available characters
    const updatedAvailableCharacters = availableCharacters.filter(
      (char) => char.name !== characterToAdd.name
    );
    setAvailableCharacters(updatedAvailableCharacters);

    // Close the modal
    setShowAddCharacter(false);
    setSelectedNewCharacter(null);
  };

  useEffect(() => {
    // Scroll to bottom when chat history changes
    scrollToBottom();

    // Update story arc based on recent messages
    if (chatHistory.length > 0 && storyArc) {
      const updatedStoryArc = updateStoryArc(storyArc, chatHistory, 10);

      // Only update if there are actual changes to avoid infinite loops
      if (JSON.stringify(updatedStoryArc) !== JSON.stringify(storyArc)) {
        setStoryArc(updatedStoryArc);

        // Update writing instructions based on the new story arc
        setWritingInstructions((prev) => ({
          ...prev,
          storyArc: updatedStoryArc.currentContext,
        }));
      }
    }

    // Check if we should suggest a story branch using the enhanced NarrativeDirector
    if (
      narrativeDirector &&
      chatHistory.length > 0 &&
      !isTyping &&
      !showStoryBranches
    ) {
      // Only check if enough messages have passed since the last branch
      if (narrativeDirector.shouldSuggestBranch(chatHistory)) {
        // Generate branch options
        const scenarioType =
          chatRoom?.theme ||
          (chatRoom?.openingPrompt?.toLowerCase().includes("mystery")
            ? "mystery"
            : chatRoom?.openingPrompt?.toLowerCase().includes("horror")
            ? "horror"
            : chatRoom?.openingPrompt?.toLowerCase().includes("sci-fi")
            ? "scifi"
            : "adventure");

        // Update the scenario type in the narrative director
        narrativeDirector.setScenarioType(scenarioType);

        // Update relationships in the narrative director
        if (relationships.length > 0) {
          narrativeDirector.setCharacterRelationships(relationships);
        }

        // Generate branch options
        const branchOptions = narrativeDirector.generateBranchOptions(
          chatHistory,
          chatRoom
        );

        // Set the branches and show them
        setStoryBranches(branchOptions);
        setShowStoryBranches(true);
      }
    }

    // Manage narrative flow and trigger character interactions
    if (chatHistory.length > 0 && autoRespond) {
      const lastMessage = chatHistory[chatHistory.length - 1];

      // If the last message was from a character (not the user) and not a system message
      if (!lastMessage.isUser && !lastMessage.system) {
        // Check if we should pause for user input
        const shouldPauseForInput = checkIfShouldPauseForUserInput(lastMessage);

        if (shouldPauseForInput) {
          // Set waiting for user input state to true
          setWaitingForUserInput(true);
          return; // Don't proceed with auto-responses
        }

        // If we have at least 2 characters, trigger a possible interaction
        if (chatRoom.characters.length >= 2 && Math.random() > 0.7) {
          // 30% chance of character interaction
          triggerCharacterInteraction(lastMessage);
        }
      }

      // Check if we should trigger an environmental event
      if (
        !lastMessage.system &&
        !lastMessage.isEnvironmentalEvent &&
        !isTyping
      ) {
        // Count messages since last environmental event
        const lastEventIndex = chatHistory.findIndex(
          (msg) => msg.isEnvironmentalEvent
        );
        const messagesSinceLastEvent =
          lastEventIndex === -1
            ? chatHistory.length
            : chatHistory.length - lastEventIndex - 1;

        // Check if we should trigger an event based on story arc and message count
        if (shouldTriggerEnvironmentalEvent(storyArc, messagesSinceLastEvent)) {
          // Check if the last message was very recent (less than 3 seconds ago)
          const lastMessageTime = new Date(lastMessage.timestamp).getTime();
          const currentTime = new Date().getTime();
          const timeSinceLastMessage = currentTime - lastMessageTime;

          // If the last message was too recent, delay the event for better pacing
          const eventDelay =
            timeSinceLastMessage < 3000 ? 3000 - timeSinceLastMessage : 1000;

          // Generate an environmental event description
          const eventDescription = generateEnvironmentalEvent(
            storyArc,
            chatRoom.characters
          );

          // Add the event as a system message after a delay for better pacing
          setTimeout(() => {
            // Check again if typing is happening - don't interrupt
            if (isTyping) return;

            setChatHistory((prev) => [
              ...prev,
              {
                id: Date.now() + Math.random(),
                message: eventDescription,
                system: true,
                isNarration: true,
                isEnvironmentalEvent: true,
                timestamp: new Date().toISOString(),
              },
            ]);

            // Determine if a character should respond to the event
            // Higher chance during high tension phases, but not guaranteed
            const tensionFactor =
              storyArc?.currentTension === "high"
                ? 0.7
                : storyArc?.currentTension === "very high"
                ? 0.8
                : 0.5;

            // Adjust response chance based on number of characters (more characters = lower individual chance)
            const characterCountFactor = Math.min(
              1,
              2 / chatRoom.characters.length
            );
            const shouldRespond =
              Math.random() < tensionFactor * characterCountFactor;

            // If a character should respond and there are characters available
            if (shouldRespond && chatRoom.characters.length > 0 && !isTyping) {
              // Choose the most appropriate character to respond based on the event
              // For events, we want characters with high emotional or analytical traits
              const sortedCharacters = [...chatRoom.characters].sort((a, b) => {
                const aRelevance =
                  (a.personality?.emotional || 5) +
                  (a.personality?.analytical || 5);
                const bRelevance =
                  (b.personality?.emotional || 5) +
                  (b.personality?.analytical || 5);
                return bRelevance - aRelevance;
              });

              // Select from the top half of relevant characters, with some randomness
              const topHalfIndex = Math.floor(sortedCharacters.length / 2) || 0;
              const respondingCharacter =
                sortedCharacters[
                  Math.floor(Math.random() * Math.max(1, topHalfIndex + 1))
                ];

              // Generate character-specific writing instructions based on story arc
              const eventInstructions = storyArc
                ? generateWritingInstructions(storyArc, respondingCharacter)
                : writingInstructions;

              // Show typing indicator after a natural delay
              setTimeout(() => {
                // Check again if typing is happening - don't interrupt
                if (isTyping) return;

                setIsTyping(true);
                setTypingCharacter(respondingCharacter);

                // Calculate typing delay based on character's "thinking speed"
                const thinkingSpeed = respondingCharacter.thinkingSpeed || 1;
                const baseDelay = 1500 / thinkingSpeed;
                const randomVariation = Math.floor(Math.random() * 1000); // 0-1 second variation
                const typingDelay = baseDelay + randomVariation;

                // Set a safety timeout to prevent the system from getting stuck
                const responseTimeoutId = setTimeout(() => {
                  console.error(
                    `Response generation for ${respondingCharacter.name} timed out after 20 seconds`
                  );
                  setIsTyping(false);
                  setTypingCharacter(null);
                }, 20000); // 20 second timeout

                // Generate response after a delay
                setTimeout(() => {
                  // Clear the safety timeout
                  clearTimeout(responseTimeoutId);

                  // Limit context to 5-6 turns for more focused responses
                  const limitedContext = chatHistory.slice(-6);

                  // Generate the response
                  let response;
                  try {
                    // Record this character's turn in the tracker
                    turnTracker.recordTurn(
                      respondingCharacter.name,
                      "event_response",
                      {
                        eventType: "environmental",
                        isBattle: detectBattleScenario(chatRoom, chatHistory),
                      }
                    );

                    response = generateCharacterResponse(
                      respondingCharacter,
                      eventDescription,
                      limitedContext,
                      eventInstructions,
                      chatRoom,
                      relationships
                    );

                    if (!response || response.trim() === "") {
                      console.error(
                        `Empty response generated for ${respondingCharacter.name}`
                      );
                      // Use character-specific fallback
                      const isBattleScenario = detectBattleScenario(
                        chatRoom,
                        chatHistory
                      );
                      const context = isBattleScenario
                        ? "battle"
                        : "conversation";
                      response = generateCharacterFallback(
                        respondingCharacter,
                        context,
                        eventDescription
                      );
                    }
                  } catch (error) {
                    console.error(
                      `Error generating response for ${respondingCharacter.name}:`,
                      error
                    );
                    // Use character-specific fallback for errors
                    const isBattleScenario = detectBattleScenario(
                      chatRoom,
                      chatHistory
                    );
                    const context = isBattleScenario
                      ? "battle"
                      : "conversation";
                    response = generateCharacterFallback(
                      respondingCharacter,
                      context,
                      eventDescription
                    );
                  }

                  setChatHistory((prev) => [
                    ...prev,
                    {
                      id: Date.now() + Math.random(),
                      speaker: respondingCharacter.name,
                      character: respondingCharacter,
                      message: response,
                      isUser: false,
                      timestamp: new Date().toISOString(),
                      writingInstructions: eventInstructions,
                    },
                  ]);

                  setIsTyping(false);
                  setTypingCharacter(null);
                }, typingDelay);
              }, 1000);
            }
          }, eventDelay);
        }
      }
    }
  }, [chatHistory, storyArc]);

  // Add click outside handler for character turn dropdown
  useEffect(() => {
    function handleClickOutside(event) {
      const dropdown = document.getElementById("character-turn-dropdown");
      if (
        dropdown &&
        !dropdown.contains(event.target) &&
        !event.target.closest("button[data-character-turn-toggle]")
      ) {
        dropdown.classList.add("hidden");
        console.log("Hiding character turn dropdown (clicked outside)");
      }
    }

    // Add event listener
    document.addEventListener("mousedown", handleClickOutside);
    console.log("Added click outside handler for character turn dropdown");

    // Clean up
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      console.log("Removed click outside handler for character turn dropdown");
    };
  }, []);

  // Update memory context based on recent messages
  useEffect(() => {
    // Scroll to bottom when chat history changes
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop =
        chatContainerRef.current.scrollHeight;
    }

    // Update memory context based on recent messages
    if (chatHistory.length > 0 && memoryManager) {
      // Get the last 5 messages
      const recentMessages = chatHistory.slice(-5);

      // Create a context string from recent messages
      const contextString = recentMessages
        .map((msg) => {
          if (msg.system) {
            return msg.message;
          } else {
            return `${msg.speaker || "Unknown"}: ${msg.message}`;
          }
        })
        .join("\n");

      // Update memory context
      setMemoryContext(contextString);
    }
  }, [chatHistory]);

  // Handle global keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e) => {
      // Close panels with Escape key
      if (e.key === "Escape") {
        if (showNextOptions) {
          setShowNextOptions(false);
          return;
        }
        if (showSensoryPanel) {
          setShowSensoryPanel(false);
          return;
        }
      }

      // Toggle "What Next?" panel with Alt+W
      if (e.altKey && e.key === "w") {
        generateNextOptions();
        return;
      }

      // Toggle Scene Details panel with Alt+S
      if (e.altKey && e.key === "s") {
        setShowSensoryPanel(!showSensoryPanel);
        return;
      }
    };

    // Add event listener
    document.addEventListener("keydown", handleKeyDown);

    // Clean up
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [showNextOptions, showSensoryPanel]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  // Check if we should pause for user input based on narrative context
  const checkIfShouldPauseForUserInput = (lastMessage) => {
    // Don't pause if we're already waiting for input
    if (waitingForUserInput) return false;

    // Check if we've reached a key narrative point
    if (storyArc) {
      // Key narrative points where we want user input
      const keyPoints = [
        // End of a narrative sequence (3-4 AI messages in a row)
        isEndOfNarrativeSequence(),

        // High tension moments
        storyArc.currentTension >= 8,

        // Phase transitions
        lastMessage.message &&
          lastMessage.message.includes("phase") &&
          lastMessage.message.includes("transition"),

        // Explicit questions to the user
        lastMessage.message &&
          (lastMessage.message.includes("?") ||
            lastMessage.message.toLowerCase().includes("what do you do") ||
            lastMessage.message.toLowerCase().includes("what will you do") ||
            lastMessage.message
              .toLowerCase()
              .includes("what's your next move")),
      ];

      // If any key point is true, pause for user input
      return keyPoints.some((point) => point === true);
    }

    return false;
  };

  // Check if we've reached the end of a narrative sequence
  const isEndOfNarrativeSequence = () => {
    // Look at the last 4 messages
    const recentMessages = chatHistory.slice(-4);

    // Count consecutive AI messages
    let consecutiveAIMessages = 0;

    // Start from the most recent message and go backwards
    for (let i = recentMessages.length - 1; i >= 0; i--) {
      const msg = recentMessages[i];

      if (!msg.isUser && !msg.system) {
        consecutiveAIMessages++;
      } else {
        break; // Stop counting when we hit a user or system message
      }
    }

    // If we have 3 or more consecutive AI messages, it's the end of a sequence
    return consecutiveAIMessages >= 3;
  };

  const triggerCharacterInteraction = (lastMessage) => {
    // Check if a character is already typing - prevent multiple responses at once
    if (isTyping) {
      return; // Don't allow multiple characters to speak at once
    }

    // Check if the last message was very recent (less than 2 seconds ago)
    const lastMessageTime = new Date(lastMessage.timestamp).getTime();
    const currentTime = new Date().getTime();
    const timeSinceLastMessage = currentTime - lastMessageTime;

    // If the last message was too recent, delay the response for better pacing
    if (timeSinceLastMessage < 2000) {
      setTimeout(
        () => triggerCharacterInteraction(lastMessage),
        2000 - timeSinceLastMessage
      );
      return;
    }

    // Find characters who haven't spoken recently (excluding the last speaker)
    // Limit to 5-6 turns for more focused responses
    const recentSpeakers = chatHistory
      .slice(Math.max(0, chatHistory.length - 5))
      .map((msg) => msg.speaker);

    const availableCharacters = chatRoom.characters.filter(
      (char) =>
        char.name !== lastMessage.speaker && !recentSpeakers.includes(char.name)
    );

    // If there are available characters, use our utility to determine who should respond
    if (availableCharacters.length > 0) {
      // Use the determineNextSpeaker utility to select the most appropriate character to respond
      const respondingCharacter = determineNextSpeaker(
        availableCharacters,
        lastMessage,
        lastMessage.speaker
      );

      // Determine if this character should actually respond based on their talkativeness
      const talkativeness = respondingCharacter.talkativeness || 5; // Default to medium
      const responseThreshold = 11 - talkativeness; // Invert scale (1-10) to get threshold

      // More talkative characters respond more often
      // Less talkative characters may choose not to respond
      if (Math.random() * 10 > responseThreshold) {
        // Show typing indicator for this specific character
        setIsTyping(true);
        setTypingCharacter(respondingCharacter);

        // Generate response with a delay to simulate thinking
        // Adjust delay based on character's thinking speed
        const thinkingSpeed = respondingCharacter.thinkingSpeed || 1;
        const baseDelay = 1500 / thinkingSpeed;
        const randomVariation = Math.floor(Math.random() * 1000); // 0-1 second variation
        const typingDelay = baseDelay + randomVariation;

        // Set a safety timeout to prevent the system from getting stuck
        const responseTimeoutId = setTimeout(() => {
          console.error(
            `Response generation for ${respondingCharacter.name} timed out after 20 seconds`
          );
          setIsTyping(false);
          setTypingCharacter(null);
        }, 20000); // 20 second timeout

        setTimeout(() => {
          try {
            // Clear the safety timeout
            clearTimeout(responseTimeoutId);

            // Analyze the interaction to update relationship
            const analysis = analyzeInteraction(lastMessage.message);

            // Update relationship between the responding character and the last speaker
            setRelationships((prevRelationships) => {
              const updatedRelationships = [...prevRelationships];
              const relationship = getRelationship(
                updatedRelationships,
                respondingCharacter.name,
                lastMessage.speaker
              );
              const updatedRelationship = updateRelationship(
                relationship,
                lastMessage.speaker,
                lastMessage.message,
                analysis.affinityChange,
                analysis.interactionType
              );

              // Replace the old relationship with the updated one
              const index = updatedRelationships.findIndex(
                (rel) =>
                  rel.characters.includes(respondingCharacter.name) &&
                  rel.characters.includes(lastMessage.speaker)
              );

              if (index !== -1) {
                updatedRelationships[index] = updatedRelationship;
              }

              return updatedRelationships;
            });

            // Get the character's current mood
            const characterMood = getMoodState(
              moodStates,
              respondingCharacter.name,
              respondingCharacter
            );

            // Create a copy of the character with the current mood
            const characterWithCurrentMood = {
              ...respondingCharacter,
              mood: characterMood?.currentMood || respondingCharacter.mood,
            };

            // Limit context to 5-6 turns for more focused responses
            const limitedContext = chatHistory.slice(-6);

            // Generate the response using the character with current mood
            let response;
            try {
              // Record this character's turn in the tracker
              const isBattleScenario = detectBattleScenario(
                chatRoom,
                chatHistory
              );
              turnTracker.recordTurn(respondingCharacter.name, "interaction", {
                targetCharacter: lastMessage.speaker,
                isBattle: isBattleScenario,
              });

              response = generateCharacterInteraction(
                characterWithCurrentMood,
                lastMessage.speaker,
                lastMessage.message,
                limitedContext,
                relationships
              );

              // Check if the response indicates the AI is unsure or off-topic
              const offTopicIndicators = [
                "I'm not sure how to respond to that",
                "Let's try a different topic",
                "I don't know what to say about that",
                "I'm not sure I understand",
                "Let's talk about something else",
                "This requires careful analysis",
                "I need to consider the facts",
                "There are several factors to consider",
                "I'm processing the information",
                "Let me think through this logically",
                "I'm examining the different angles",
                "I need a moment to process",
                "I'm not certain how to interpret",
                "This is a complex matter",
                "I need to analyze this further",
              ];

              const isOffTopic = offTopicIndicators.some((indicator) =>
                response.toLowerCase().includes(indicator.toLowerCase())
              );

              // If the response seems off-topic, use a character-specific fallback
              if (isOffTopic) {
                console.log(
                  `Detected off-topic response from ${respondingCharacter.name}, using character-specific fallback`
                );
                const context = isBattleScenario ? "battle" : "conversation";

                // Check for romantic/inappropriate context in the last message
                const lastMessageLower = lastMessage.message.toLowerCase();
                const hasRomanticContext =
                  lastMessageLower.includes("love") ||
                  lastMessageLower.includes("kiss") ||
                  lastMessageLower.includes("hug") ||
                  lastMessageLower.includes("beautiful") ||
                  lastMessageLower.includes("marry") ||
                  lastMessageLower.includes("date") ||
                  lastMessageLower.includes("come here") ||
                  lastMessageLower.includes("touch") ||
                  lastMessageLower.includes("hold") ||
                  lastMessageLower.includes("feel") ||
                  lastMessageLower.includes("heart") ||
                  lastMessageLower.includes("together") ||
                  lastMessageLower.includes("want you");

                // Use romantic context if detected
                const effectiveContext =
                  hasRomanticContext &&
                  characterWithCurrentMood.type === "fantasy"
                    ? "romantic"
                    : context;

                response = generateCharacterFallback(
                  characterWithCurrentMood,
                  effectiveContext,
                  lastMessage.message
                );
              }

              if (!response || response.trim() === "") {
                console.error(
                  `Empty interaction response generated for ${respondingCharacter.name}`
                );
                // Use character-specific fallback
                const context = isBattleScenario ? "battle" : "conversation";
                response = generateCharacterFallback(
                  respondingCharacter,
                  context,
                  lastMessage.message
                );
              }
            } catch (error) {
              console.error(
                `Error generating interaction response for ${respondingCharacter.name}:`,
                error
              );
              // Use character-specific fallback for errors
              const isBattleScenario = detectBattleScenario(
                chatRoom,
                chatHistory
              );
              const context = isBattleScenario ? "battle" : "conversation";
              response = generateCharacterFallback(
                respondingCharacter,
                context,
                lastMessage.message
              );
            }

            setChatHistory((prev) => [
              ...prev,
              {
                id: Date.now() + Math.random(),
                speaker: respondingCharacter.name,
                character: respondingCharacter,
                message: response,
                isUser: false,
                timestamp: new Date().toISOString(),
              },
            ]);

            setIsTyping(false);
            setTypingCharacter(null);
          } catch (error) {
            console.error("Error in character interaction:", error);
            // Use a character-specific fallback response instead of failing silently
            const context = isBattleScenario ? "battle" : "conversation";
            const fallbackResponse = generateCharacterFallback(
              respondingCharacter,
              context,
              lastMessage.message
            );

            // Add the fallback response to chat history
            setChatHistory((prev) => [
              ...prev,
              {
                id: Date.now() + Math.random(),
                speaker: respondingCharacter.name,
                character: respondingCharacter,
                message: fallbackResponse,
                isUser: false,
                timestamp: new Date().toISOString(),
              },
            ]);

            setIsTyping(false);
            setTypingCharacter(null);
          }
        }, typingDelay);
      }
    }
  };

  // Function to handle message regeneration
  const handleRegenerateMessage = (messageId) => {
    const messageIndex = chatHistory.findIndex((msg) => msg.id === messageId);
    if (messageIndex === -1) return;

    const message = chatHistory[messageIndex];
    if (message.isUser) return; // Can't regenerate user messages

    // Check if this is the most recent AI message
    const isLatestAIMessage = !chatHistory
      .slice(messageIndex + 1)
      .some((msg) => !msg.isUser && !msg.system);

    // Only allow regeneration of the most recent AI message
    if (!isLatestAIMessage) {
      console.log("Can only regenerate the most recent AI message");
      return;
    }

    // Find the message this was responding to
    const previousMessages = chatHistory.slice(0, messageIndex);
    const lastUserMessage = [...previousMessages]
      .reverse()
      .find((msg) => msg.isUser || msg.speaker !== message.speaker);

    // Generate a new response
    const character = chatRoom.characters.find(
      (char) => char.name === message.speaker
    );
    if (!character) return;

    setIsTyping(true);
    setTypingCharacter(character);

    setTimeout(() => {
      // Generate character-specific writing instructions based on story arc
      let regenerateInstructions = { ...writingInstructions };

      // If we have a story arc, use it to generate character-specific instructions
      if (storyArc) {
        regenerateInstructions = generateWritingInstructions(
          storyArc,
          character
        );

        // Preserve any user-defined writing instructions
        if (writingInstructions.writingStyle !== "balanced") {
          regenerateInstructions.writingStyle =
            writingInstructions.writingStyle;
        }
        if (writingInstructions.responseLength !== "medium") {
          regenerateInstructions.responseLength =
            writingInstructions.responseLength;
        }
        if (writingInstructions.characterReminders) {
          regenerateInstructions.characterReminders +=
            "\n" + writingInstructions.characterReminders;
        }
        if (writingInstructions.generalNotes) {
          regenerateInstructions.generalNotes +=
            "\n" + writingInstructions.generalNotes;
        }
      }

      // Limit context to 5-6 turns for more focused responses
      const limitedContext = previousMessages.slice(-6);

      const newResponse = lastUserMessage
        ? generateCharacterResponse(
            character,
            lastUserMessage.message,
            limitedContext,
            regenerateInstructions,
            chatRoom
          )
        : generateCharacterResponse(
            character,
            "Let's chat",
            limitedContext,
            regenerateInstructions,
            chatRoom
          );

      // Replace the original message with the regenerated one
      const updatedHistory = [...chatHistory];
      updatedHistory[messageIndex] = {
        ...message,
        message: newResponse,
        regenerated: true,
        edited: true,
        editedAt: new Date().toISOString(),
        writingInstructions: regenerateInstructions,
      };

      setChatHistory(updatedHistory);
      setIsTyping(false);
      setTypingCharacter(null);
    }, 1000);
  };

  // Function to handle message editing - now works for all message types
  const handleEditMessage = (messageId) => {
    const messageIndex = chatHistory.findIndex((msg) => msg.id === messageId);
    if (messageIndex === -1) return;

    const message = chatHistory[messageIndex];

    // Allow editing of all message types
    setEditingMessage(messageId);
    setEditMessageText(message.message);
  };

  // Function to save edited message
  const handleSaveEditedMessage = (messageId) => {
    if (!editMessageText.trim()) return;

    const messageIndex = chatHistory.findIndex((msg) => msg.id === messageId);
    if (messageIndex === -1) return;

    const message = chatHistory[messageIndex];

    const updatedHistory = [...chatHistory];
    updatedHistory[messageIndex] = {
      ...message,
      message: editMessageText,
      edited: true,
      editedAt: new Date().toISOString(),
    };

    setChatHistory(updatedHistory);
    setEditingMessage(null);
    setEditMessageText("");
  };

  // Function to cancel message editing
  const handleCancelEditMessage = () => {
    setEditingMessage(null);
    setEditMessageText("");
  };

  // Toggle action menu
  const toggleActionMenu = () => {
    // Toggle the panel if it's already open
    if (showActionMenu) {
      setShowActionMenu(false);
      return;
    }

    // Close other panels
    setShowNarrationInput(false);
    setShowWritingInstructions(false);
    setShowNextOptions(false);

    // Open this panel
    setShowActionMenu(true);
  };

  // Handle character turn - make a character speak without user input
  const handleCharacterTurn = (character) => {
    console.log("handleCharacterTurn called with character:", character);

    // Reset waiting for user input state
    if (waitingForUserInput) {
      setWaitingForUserInput(false);
    }

    // Handle auto-selection for the best character to speak next
    if (character === "auto") {
      console.log("Auto-selecting best character to speak next");

      // Get the last message from the chat history
      const lastMessage =
        chatHistory.length > 0 ? chatHistory[chatHistory.length - 1] : null;

      // Determine if we're in a one-on-one chat (only one AI character)
      const isOneOnOneChat = chatRoom.characters.length === 1;

      if (isOneOnOneChat) {
        // In one-on-one chats, always select the only AI character
        character = chatRoom.characters[0];
        console.log(
          "One-on-one chat detected, selected character:",
          character.name
        );
      } else {
        // In group chats, use the turn tracker to determine who should speak next
        if (lastMessage) {
          // Check if we're in a battle scenario
          const isBattleScenario = detectBattleScenario(chatRoom, chatHistory);

          // Update battle state if needed
          if (isBattleScenario) {
            // Count battle keywords in recent messages to determine intensity
            const recentMessages = chatHistory.slice(-10);
            let battleKeywordCount = 0;
            const battleKeywords = [
              "battle",
              "fight",
              "attack",
              "defend",
              "enemy",
              "weapon",
              "combat",
              "shield",
              "sword",
              "gun",
              "blast",
              "explosion",
              "danger",
              "threat",
            ];

            recentMessages.forEach((msg) => {
              if (msg.message) {
                battleKeywords.forEach((keyword) => {
                  if (msg.message.toLowerCase().includes(keyword)) {
                    battleKeywordCount++;
                  }
                });
              }
            });

            // Update battle intensity (0-10 scale)
            const newIntensity = Math.min(
              10,
              Math.max(5, battleKeywordCount / 2)
            );
            turnTracker.updateBattleState({
              intensity: newIntensity,
              inProgress: true,
            });

            console.log(`Battle intensity updated to ${newIntensity}`);
          }

          // Use our improved turn tracker to determine who should speak next
          character = turnTracker.determineNextSpeaker(
            chatRoom.characters,
            lastMessage,
            chatRoom
          );
          console.log("Selected character to speak:", character?.name);

          // If no character was determined, pick a random one
          if (!character) {
            character =
              chatRoom.characters[
                Math.floor(Math.random() * chatRoom.characters.length)
              ];
            console.log("Fallback to random character:", character?.name);
          }
        } else {
          // If there's no last message, pick a random character
          character =
            chatRoom.characters[
              Math.floor(Math.random() * chatRoom.characters.length)
            ];
          console.log(
            "No last message, selected random character:",
            character?.name
          );
        }
      }
    }

    if (!character) {
      console.error("No character provided to handleCharacterTurn");
      return;
    }

    // Check if a character is already typing - prevent multiple responses at once
    if (isTyping) {
      console.log("Character already typing, ignoring request");

      // If typing has been happening for too long (more than 15 seconds), it might be stuck
      // Check when typing started
      const typingStartTime = typingCharacter?.typingStartTime || 0;
      const currentTime = new Date().getTime();
      const typingDuration = currentTime - typingStartTime;

      if (typingDuration > 15000) {
        // 15 seconds timeout
        console.warn(
          "Typing indicator has been active for too long, resetting state"
        );
        // Reset the typing state to allow new responses
        setIsTyping(false);
        setTypingCharacter(null);

        // Try again after a short delay
        setTimeout(() => handleCharacterTurn(character), 500);
        return;
      }

      return; // Don't allow multiple characters to speak at once if not stuck
    }

    // If no specific character is provided, determine who should speak next
    if (character === "auto" && chatRoom && chatRoom.characters.length > 0) {
      console.log("Auto-selecting character to speak");

      // Get the last message to provide context
      const lastMessage =
        chatHistory.length > 0 ? chatHistory[chatHistory.length - 1] : null;

      // Check if the last message was very recent (less than 2 seconds ago)
      const lastMessageTime = lastMessage
        ? new Date(lastMessage.timestamp).getTime()
        : 0;
      const currentTime = new Date().getTime();
      const timeSinceLastMessage = currentTime - lastMessageTime;

      // If the last message was too recent, delay the response for better pacing
      if (timeSinceLastMessage < 2000) {
        console.log("Last message too recent, delaying response");
        setTimeout(
          () => handleCharacterTurn(character),
          2000 - timeSinceLastMessage
        );
        return;
      }

      // Update battle state if needed
      const isBattleScenario = detectBattleScenario(chatRoom, chatHistory);
      if (isBattleScenario) {
        // Update battle intensity based on recent messages
        const recentMessages = chatHistory.slice(-10);
        const battleKeywords = [
          "attack",
          "fight",
          "battle",
          "enemy",
          "combat",
          "defend",
          "shield",
          "weapon",
          "explosion",
          "danger",
          "threat",
          "alien",
        ];

        // Count battle keywords in recent messages
        let battleKeywordCount = 0;
        recentMessages.forEach((msg) => {
          battleKeywords.forEach((keyword) => {
            if (msg.message && msg.message.toLowerCase().includes(keyword))
              battleKeywordCount++;
          });
        });

        // Update battle intensity (0-10 scale)
        const newIntensity = Math.min(10, Math.max(5, battleKeywordCount / 2));
        turnTracker.updateBattleState({
          intensity: newIntensity,
          inProgress: true,
        });

        console.log(`Battle intensity updated to ${newIntensity}`);
      }

      // Use our improved turn tracker to determine who should speak next
      character = turnTracker.determineNextSpeaker(
        chatRoom.characters,
        lastMessage,
        chatRoom
      );
      console.log("Selected character to speak:", character?.name);

      // If no character was determined, pick a random one
      if (!character) {
        character =
          chatRoom.characters[
            Math.floor(Math.random() * chatRoom.characters.length)
          ];
        console.log("Fallback to random character:", character?.name);
      }
    }

    // Show typing indicator for this character with a timestamp to track how long it's been active
    setIsTyping(true);
    setTypingCharacter({
      ...character,
      typingStartTime: new Date().getTime(), // Add timestamp to track when typing started
    });

    // Calculate typing delay based on character's "thinking speed"
    const thinkingSpeed = character.thinkingSpeed || 1;
    const baseDelay = 1000 / thinkingSpeed;
    const messageLength = Math.max(20, Math.floor(Math.random() * 80)); // Simulate message length
    const typingDelay = baseDelay + messageLength * 30;

    // Set a safety timeout to prevent the system from getting stuck
    const responseTimeoutId = setTimeout(() => {
      console.error(
        `Response generation for ${character.name} timed out after 20 seconds`
      );
      setIsTyping(false);
      setTypingCharacter(null);

      // Add a system message indicating the timeout
      setChatHistory((prev) => [
        ...prev,
        {
          id: Date.now() + Math.random(),
          message: `${character.name} was going to respond, but something went wrong. Please try again.`,
          system: true,
          timestamp: new Date().toISOString(),
        },
      ]);
    }, 20000); // 20 second timeout

    setTimeout(() => {
      try {
        console.log("Generating response for character:", character.name);

        // Generate character-specific writing instructions based on story arc
        let turnInstructions = { ...writingInstructions };

        // If we have a story arc, use it to generate character-specific instructions
        if (storyArc) {
          console.log("Using story arc to generate instructions");
          turnInstructions = generateWritingInstructions(storyArc, character);

          // Preserve any user-defined writing instructions
          if (writingInstructions.writingStyle !== "balanced") {
            turnInstructions.writingStyle = writingInstructions.writingStyle;
          }
          if (writingInstructions.responseLength !== "medium") {
            turnInstructions.responseLength =
              writingInstructions.responseLength;
          }
          if (writingInstructions.characterReminders) {
            turnInstructions.characterReminders +=
              "\n" + writingInstructions.characterReminders;
          }
          if (writingInstructions.generalNotes) {
            turnInstructions.generalNotes +=
              "\n" + writingInstructions.generalNotes;
          }
        } else {
          // If no story arc, create basic instructions based on character type and personality
          console.log("No story arc, creating basic instructions");

          // Ensure we have the basic structure
          turnInstructions = {
            writingStyle: writingInstructions.writingStyle || "balanced",
            responseLength: writingInstructions.responseLength || "medium",
            characterReminders: writingInstructions.characterReminders || "",
            generalNotes: writingInstructions.generalNotes || "",
          };

          // Add character-specific instructions based on type
          if (character.type === "superhero") {
            turnInstructions.characterReminders +=
              "\nYou are a superhero with extraordinary abilities. Your responses should reflect confidence and heroism.";
          } else if (character.type === "fantasy") {
            turnInstructions.characterReminders +=
              "\nYou are a fantasy character in a world of magic and adventure. Your dialogue should reflect your background and abilities.";
          } else if (character.type === "noir") {
            turnInstructions.characterReminders +=
              "\nYou are a character in a noir setting. Your dialogue should be gritty, cynical, and atmospheric.";
          } else if (character.type === "scifi") {
            turnInstructions.characterReminders +=
              "\nYou are in a science fiction setting. Reference technology and scientific concepts in your responses.";
          }

          // Add personality-based instructions
          if (character.personality) {
            if (character.personality.analytical > 7) {
              turnInstructions.characterReminders +=
                "\nYou tend to analyze situations logically and methodically.";
            }
            if (character.personality.emotional > 7) {
              turnInstructions.characterReminders +=
                "\nYou are emotionally expressive and sensitive to the feelings of others.";
            }
            if (character.personality.humor > 7) {
              turnInstructions.characterReminders +=
                "\nYou often use humor and wit in your responses.";
            }
          }
        }

        // Detect if we're in a battle scenario
        const isBattleScenario = detectBattleScenario(chatRoom, chatHistory);

        // Add battle-specific context to the instructions if needed
        if (isBattleScenario) {
          if (!turnInstructions.generalNotes) {
            turnInstructions.generalNotes = "";
          }

          turnInstructions.generalNotes +=
            "\nThis is an intense battle scene. Character responses should reflect urgency, tactical awareness, and their unique combat abilities. Include dynamic actions and reactions to the environment.";

          // Add character-specific battle instructions
          if (
            character.name.includes("Captain") ||
            character.name.includes("America")
          ) {
            turnInstructions.characterReminders =
              "You are a tactical leader. Give orders, protect civilians, and coordinate the team.\n" +
              (turnInstructions.characterReminders || "");
          } else if (
            character.name.includes("Iron") ||
            character.name.includes("Stark")
          ) {
            turnInstructions.characterReminders =
              "Use your advanced technology and aerial advantage. Make quips even in danger.\n" +
              (turnInstructions.characterReminders || "");
          } else if (character.name.includes("Thor")) {
            turnInstructions.characterReminders =
              "You wield lightning and your hammer. Speak with Asgardian confidence and power.\n" +
              (turnInstructions.characterReminders || "");
          } else if (character.name.includes("Hulk")) {
            turnInstructions.characterReminders =
              "You are incredibly strong but speak simply. Show anger and power.\n" +
              (turnInstructions.characterReminders || "");
          } else if (
            character.name.includes("Black Widow") ||
            character.name.includes("Natasha")
          ) {
            turnInstructions.characterReminders =
              "You are agile, tactical, and precise. Focus on stealth and critical targets.\n" +
              (turnInstructions.characterReminders || "");
          } else if (
            character.name.includes("Hawkeye") ||
            character.name.includes("Barton")
          ) {
            turnInstructions.characterReminders =
              "You have exceptional aim and tactical awareness. Spot weaknesses and vulnerabilities.\n" +
              (turnInstructions.characterReminders || "");
          }
        }

        // Check if we should update the character's mood based on conversation context
        if (chatHistory.length > 0) {
          // Get the last few messages to establish context (limit to 5-6 for better focus)
          const recentMessages = chatHistory.slice(-5);

          // Update the character's mood based on recent messages
          setMoodStates((prevMoodStates) => {
            const updatedMoodStates = [...prevMoodStates];
            const characterMood = getMoodState(
              updatedMoodStates,
              character.name,
              character
            );

            // Determine if mood should change based on conversation
            const shouldChange = Math.random() < 0.3; // 30% chance to change mood

            if (shouldChange) {
              // Analyze recent messages to determine appropriate mood
              const messageText = recentMessages
                .map((msg) => msg.message)
                .join(" ");
              const isPositive = messageText
                .toLowerCase()
                .match(
                  /happy|joy|excited|wonderful|great|good|love|like|enjoy/g
                );
              const isNegative = messageText
                .toLowerCase()
                .match(/sad|angry|upset|terrible|bad|hate|dislike|worry|fear/g);
              const isIntense = messageText
                .toLowerCase()
                .match(
                  /urgent|emergency|danger|attack|fight|run|hide|critical|important/g
                );

              let newMood = characterMood.currentMood;

              if (isIntense && isIntense.length > 0) {
                newMood = "Intense";
              } else if (
                isPositive &&
                isPositive.length > (isNegative ? isNegative.length : 0)
              ) {
                newMood = "Happy";
              } else if (
                isNegative &&
                isNegative.length > (isPositive ? isPositive.length : 0)
              ) {
                newMood = "Sad";
              }

              // In battle scenarios, characters should be more intense
              if (isBattleScenario && Math.random() > 0.3) {
                newMood = "Intense";
              }

              // Only update if mood is different
              if (newMood !== characterMood.currentMood) {
                const updatedMood = updateMood(characterMood, newMood);

                // Find and replace the mood state
                const index = updatedMoodStates.findIndex(
                  (state) => state.characterName === character.name
                );

                if (index !== -1) {
                  updatedMoodStates[index] = updatedMood;
                }
              }
            }

            return updatedMoodStates;
          });
        }

        // Get the character's current mood
        const characterMood = getMoodState(
          moodStates,
          character.name,
          character
        );

        // Create a copy of the character with the current mood
        const characterWithCurrentMood = {
          ...character,
          mood: characterMood?.currentMood || character.mood,
        };

        // Limit context to 5-6 turns for more focused responses
        const limitedContext = chatHistory.slice(-6);

        // Determine the prompt based on context and character type
        let prompt = "Continue the conversation";
        const currentTime = new Date().getTime();

        // Get scenario-specific prompts based on character type
        if (character.type) {
          console.log(`Generating ${character.type}-specific prompt`);

          // Check if we're in a battle scenario
          if (isBattleScenario) {
            const battlePrompts = [
              "React to the battle situation",
              "Engage with the enemy forces",
              "Coordinate with your teammates",
              "Protect civilians while fighting",
              "Use your abilities in this combat situation",
            ];
            prompt =
              battlePrompts[Math.floor(Math.random() * battlePrompts.length)];
          }
          // Superhero-specific prompts
          else if (character.type === "superhero") {
            const superheroPrompts = [
              "Share your perspective on the current situation",
              "Demonstrate your heroic nature",
              "Express your concern for civilians",
              "Show your unique abilities or perspective",
              "Respond to the team's current plan",
            ];
            prompt =
              superheroPrompts[
                Math.floor(Math.random() * superheroPrompts.length)
              ];
          }
          // Fantasy-specific prompts
          else if (character.type === "fantasy") {
            const fantasyPrompts = [
              "Share wisdom from your background or experiences",
              "React to the magical or mysterious elements present",
              "Offer insight based on your unique perspective",
              "Suggest a course of action based on your knowledge",
              "Express your feelings about the current quest or situation",
            ];
            prompt =
              fantasyPrompts[Math.floor(Math.random() * fantasyPrompts.length)];
          }
          // Noir-specific prompts
          else if (character.type === "noir") {
            const noirPrompts = [
              "Share your cynical perspective on the situation",
              "Notice a detail others might have missed",
              "Express suspicion about someone's motives",
              "Reflect on the darker implications of recent events",
              "Cut through pretense with a direct observation",
            ];
            prompt =
              noirPrompts[Math.floor(Math.random() * noirPrompts.length)];
          }
          // Sci-fi specific prompts
          else if (character.type === "scifi") {
            const scifiPrompts = [
              "Analyze the technological implications",
              "Share insight from your scientific perspective",
              "Suggest an innovative solution to the problem",
              "Point out logical considerations others missed",
              "Reference advanced concepts relevant to the situation",
            ];
            prompt =
              scifiPrompts[Math.floor(Math.random() * scifiPrompts.length)];
          }
        }

        // Check if there's a recent environmental event to respond to
        const recentEvents = limitedContext.filter(
          (msg) => msg.isNarration || msg.system
        );
        if (
          recentEvents.length > 0 &&
          recentEvents[recentEvents.length - 1].timestamp
        ) {
          const lastEventTime = new Date(
            recentEvents[recentEvents.length - 1].timestamp
          ).getTime();
          const timeSinceEvent = currentTime - lastEventTime;

          // If there was a recent environmental event (within last 3 messages and 30 seconds)
          if (
            timeSinceEvent < 30000 &&
            limitedContext.indexOf(recentEvents[recentEvents.length - 1]) >=
              limitedContext.length - 3
          ) {
            prompt = `React to: ${
              recentEvents[recentEvents.length - 1].message
            }`;
            console.log("Responding to recent environmental event");
          }
        }

        // Check if character was directly addressed in recent messages
        const recentMessages = limitedContext.slice(-3);
        for (const msg of recentMessages) {
          if (
            msg.isUser &&
            msg.message.toLowerCase().includes(character.name.toLowerCase())
          ) {
            prompt = `Respond to being directly addressed: ${msg.message}`;
            console.log("Responding to direct address");
            break;
          }
        }

        console.log("Using prompt:", prompt);

        // Generate the character's response with relationships and story arc context
        let response;
        try {
          console.log(
            `Generating response for ${character.name} with prompt: "${prompt}"`
          );

          // Determine if we're in a battle context for better response generation
          const isBattleScenario = detectBattleScenario(chatRoom, chatHistory);
          const battleState = turnTracker.getBattleState();

          // Record this character's turn in the tracker
          turnTracker.recordTurn(character.name, "dialogue", {
            isBattle: isBattleScenario,
            battleIntensity: battleState.intensity,
          });

          // Generate the response
          response = generateCharacterResponse(
            characterWithCurrentMood,
            prompt,
            limitedContext,
            turnInstructions,
            chatRoom,
            relationships
          );

          // Check if the response indicates the AI is unsure or off-topic
          const offTopicIndicators = [
            "I'm not sure how to respond to that",
            "Let's try a different topic",
            "I don't know what to say about that",
            "I'm not sure I understand",
            "Let's talk about something else",
            "This requires careful analysis",
            "I need to consider the facts",
            "There are several factors to consider",
            "I'm processing the information",
            "Let me think through this logically",
            "I'm examining the different angles",
            "I need a moment to process",
            "I'm not certain how to interpret",
            "This is a complex matter",
            "I need to analyze this further",
          ];

          const isOffTopic = offTopicIndicators.some((indicator) =>
            response.toLowerCase().includes(indicator.toLowerCase())
          );

          // If the response seems off-topic, use a character-specific fallback
          if (isOffTopic) {
            console.log(
              `Detected off-topic response from ${character.name}, using character-specific fallback`
            );
            const context = isBattleScenario ? "battle" : "conversation";

            // Check for romantic/inappropriate context in the prompt
            const promptLower = prompt.toLowerCase();
            const hasRomanticContext =
              promptLower.includes("love") ||
              promptLower.includes("kiss") ||
              promptLower.includes("hug") ||
              promptLower.includes("beautiful") ||
              promptLower.includes("marry") ||
              promptLower.includes("date") ||
              promptLower.includes("come here") ||
              promptLower.includes("touch") ||
              promptLower.includes("hold") ||
              promptLower.includes("feel") ||
              promptLower.includes("heart") ||
              promptLower.includes("together") ||
              promptLower.includes("want you");

            // Use romantic context if detected for fantasy characters
            const effectiveContext =
              hasRomanticContext && characterWithCurrentMood.type === "fantasy"
                ? "romantic"
                : context;

            response = generateCharacterFallback(
              characterWithCurrentMood,
              effectiveContext,
              prompt
            );
          }

          if (!response || response.trim() === "") {
            console.error(`Empty response generated for ${character.name}`);
            // Use character-specific fallback instead of generic message
            const context = isBattleScenario ? "battle" : "conversation";
            const lastMsg =
              limitedContext.length > 0
                ? limitedContext[limitedContext.length - 1].message
                : "";
            response = generateCharacterFallback(character, context, lastMsg);
          }
        } catch (error) {
          console.error(
            `Error generating response for ${character.name}:`,
            error
          );
          // Use character-specific fallback for errors too
          const context = detectBattleScenario(chatRoom, chatHistory)
            ? "battle"
            : "conversation";
          const lastMsg =
            limitedContext.length > 0
              ? limitedContext[limitedContext.length - 1].message
              : "";
          response = generateCharacterFallback(character, context, lastMsg);
        }

        // Add the response to chat history
        setChatHistory((prev) => [
          ...prev,
          {
            id: Date.now() + Math.random(),
            speaker: character.name,
            character: character,
            message: response,
            isUser: false,
            timestamp: new Date().toISOString(),
            writingInstructions: turnInstructions,
          },
        ]);

        // Add an action after the message with frequency based on scenario type
        let actionChance = 0.2; // Default 20% chance

        // Adjust chance based on scenario
        if (isBattleScenario) {
          actionChance = 0.6; // 60% in battle scenarios
        } else if (character.type === "superhero") {
          actionChance = 0.4; // 40% for superhero scenarios
        } else if (character.type === "fantasy") {
          actionChance = 0.35; // 35% for fantasy scenarios
        } else if (character.type === "noir") {
          actionChance = 0.3; // 30% for noir scenarios
        }

        console.log(
          `Action chance for ${character.name}: ${actionChance * 100}%`
        );

        if (Math.random() < actionChance) {
          setTimeout(() => {
            try {
              console.log(`Generating action for ${character.name}`);

              // Default generic actions for any character type
              let actions = [
                `*${character.name} nods thoughtfully*`,
                `*${character.name} gestures expressively*`,
                `*${character.name} raises an eyebrow*`,
                `*${character.name} glances around*`,
                `*${character.name} shifts position slightly*`,
                `*${character.name} considers for a moment*`,
              ];

              // Add battle-specific actions if in a battle scenario
              if (isBattleScenario) {
                console.log("Generating battle-specific actions");
                // Generic battle actions
                const battleActions = [
                  `*${character.name} takes cover behind debris*`,
                  `*${character.name} scans the battlefield for threats*`,
                  `*${character.name} moves to a better tactical position*`,
                  `*${character.name} helps a civilian to safety*`,
                  `*${character.name} dodges an incoming attack*`,
                  `*${character.name} assesses the tactical situation*`,
                  `*${character.name} signals to teammates*`,
                  `*${character.name} braces for impact*`,
                ];

                // Character-specific battle actions
                if (
                  character.name.includes("Captain") ||
                  character.name.includes("America")
                ) {
                  battleActions.push(
                    `*${character.name} throws his shield, taking out multiple enemies*`,
                    `*${character.name} blocks an attack with his shield*`,
                    `*${character.name} performs an acrobatic combat maneuver*`,
                    `*${character.name} gives hand signals to coordinate the team*`
                  );
                } else if (
                  character.name.includes("Iron") ||
                  character.name.includes("Stark")
                ) {
                  battleActions.push(
                    `*${character.name} fires repulsor blasts at incoming enemies*`,
                    `*${character.name} activates a new suit function*`,
                    `*${character.name} flies overhead for a better view*`,
                    `*${character.name} has JARVIS analyze enemy weaknesses*`
                  );
                } else if (character.name.includes("Thor")) {
                  battleActions.push(
                    `*${character.name} summons lightning, striking multiple enemies*`,
                    `*${character.name} throws Mjolnir, smashing through the enemy line*`,
                    `*${character.name} spins his hammer, creating a powerful vortex*`,
                    `*${character.name} lands with a thunderous impact*`
                  );
                } else if (character.name.includes("Hulk")) {
                  battleActions.push(
                    `*${character.name} smashes several enemies with a single blow*`,
                    `*${character.name} roars with rage, intimidating nearby foes*`,
                    `*${character.name} leaps an incredible distance across the battlefield*`,
                    `*${character.name} uses a car as an improvised weapon*`
                  );
                } else if (
                  character.name.includes("Black Widow") ||
                  character.name.includes("Natasha")
                ) {
                  battleActions.push(
                    `*${character.name} takes down an enemy with her Widow's Bite*`,
                    `*${character.name} performs an acrobatic flip over an attacker*`,
                    `*${character.name} uses an enemy's momentum against them*`,
                    `*${character.name} fires precisely at a critical target*`
                  );
                } else if (
                  character.name.includes("Hawkeye") ||
                  character.name.includes("Barton")
                ) {
                  battleActions.push(
                    `*${character.name} fires a specialized arrow with perfect accuracy*`,
                    `*${character.name} spots a weakness in the enemy formation*`,
                    `*${character.name} takes a high vantage point for better shots*`,
                    `*${character.name} quickly switches to a different arrow type*`
                  );
                }

                // Use battle actions instead of generic ones
                actions = battleActions;
              } else {
                console.log(`Generating ${character.type}-specific actions`);

                // Add character-specific actions based on type for non-battle scenarios
                if (character.type === "fantasy") {
                  const fantasyActions = [
                    `*${character.name} traces a mystical symbol in the air*`,
                    `*${character.name} adjusts their magical artifacts*`,
                    `*${character.name} whispers an ancient incantation*`,
                    `*${character.name} studies an ancient text or rune*`,
                    `*${character.name} senses magical energies in the vicinity*`,
                    `*${character.name} adjusts their ceremonial garments*`,
                    `*${character.name} touches a mystical amulet thoughtfully*`,
                    `*${character.name} recites a brief verse in an ancient tongue*`,
                  ];
                  actions = fantasyActions;
                } else if (character.type === "superhero") {
                  const superheroActions = [
                    `*${character.name} checks a communication device*`,
                    `*${character.name} adjusts their costume slightly*`,
                    `*${character.name} scans the environment for threats*`,
                    `*${character.name} demonstrates a small use of their powers*`,
                    `*${character.name} strikes a confident pose*`,
                    `*${character.name} looks out toward the city skyline*`,
                    `*${character.name} checks on nearby civilians*`,
                    `*${character.name} tests their equipment briefly*`,
                  ];
                  actions = superheroActions;
                } else if (character.type === "scifi") {
                  const scifiActions = [
                    `*${character.name} checks a holographic display*`,
                    `*${character.name} adjusts their tech gear*`,
                    `*${character.name} scans the environment with a device*`,
                    `*${character.name} interfaces with nearby technology*`,
                    `*${character.name} runs a quick diagnostic on their equipment*`,
                    `*${character.name} makes a minor adjustment to their exosuit*`,
                    `*${character.name} reviews data on a transparent screen*`,
                    `*${character.name} activates a small technological gadget*`,
                  ];
                  actions = scifiActions;
                } else if (character.type === "noir") {
                  const noirActions = [
                    `*${character.name} adjusts their hat slightly*`,
                    `*${character.name} takes a thoughtful drag from a cigarette*`,
                    `*${character.name} glances suspiciously at the shadows*`,
                    `*${character.name} straightens their tie with a practiced motion*`,
                    `*${character.name} swirls the liquid in their glass*`,
                    `*${character.name} checks their watch with a frown*`,
                    `*${character.name} studies a small detail others missed*`,
                    `*${character.name} runs a hand through their hair with a sigh*`,
                  ];
                  actions = noirActions;
                }
              }

              // Select a random action
              const action =
                actions[Math.floor(Math.random() * actions.length)];

              // Add the action to chat history
              setChatHistory((prev) => [
                ...prev,
                {
                  id: Date.now() + Math.random(),
                  speaker: character.name,
                  character: character,
                  message: action,
                  isUser: false,
                  isAction: true,
                  timestamp: new Date().toISOString(),
                },
              ]);
            } catch (error) {
              console.error("Error generating character action:", error);
            }
          }, 1000 + Math.random() * 2000); // Add action 1-3 seconds after the message
        }
      } catch (error) {
        console.error("Error in character turn generation:", error);
      }

      // Clear the safety timeout since we successfully generated a response
      clearTimeout(responseTimeoutId);

      setIsTyping(false);
      setTypingCharacter(null);
    }, typingDelay);
  };

  // Note: detectBattleScenario is defined elsewhere in the file

  // Helper function to get scenario-specific quick actions based on type
  const getScenarioQuickActionsByType = (scenarioTitle, scenarioType) => {
    // Default actions for any scenario
    const defaultActions = [
      "Look around carefully",
      "Listen for any unusual sounds",
      "Check for potential threats",
    ];

    // Avengers/battle specific actions
    if (scenarioTitle && scenarioTitle.toLowerCase().includes("avengers")) {
      return [
        "Take cover behind debris",
        "Signal to teammates",
        "Scan for civilian casualties",
        "Analyze enemy weaknesses",
        "Coordinate tactical positions",
      ];
    }

    // Scenario type specific actions
    switch (scenarioType?.toLowerCase()) {
      case "battle":
      case "combat":
        return [
          "Take a defensive stance",
          "Look for tactical advantages",
          "Check weapons and equipment",
          "Scan for enemy positions",
          "Signal to allies",
        ];

      case "mystery":
        return [
          "Search for clues",
          "Examine the surroundings carefully",
          "Take notes on suspicious details",
          "Recall relevant information",
          "Consider possible motives",
        ];

      case "adventure":
        return [
          "Check the map",
          "Assess the terrain ahead",
          "Look for hidden paths",
          "Check supplies and equipment",
          "Listen for environmental dangers",
        ];

      case "fantasy":
        return [
          "Sense magical energies",
          "Check for mystical signs",
          "Recall ancient knowledge",
          "Examine arcane symbols",
          "Prepare magical defenses",
        ];

      case "scifi":
        return [
          "Check environmental readings",
          "Scan for technological anomalies",
          "Adjust equipment settings",
          "Monitor communication channels",
          "Analyze unusual phenomena",
        ];

      default:
        return defaultActions;
    }
  };

  // Generate dynamic scene description based on location and battle intensity
  const generateSceneDescription = (
    location,
    intensity,
    previousDescriptions = []
  ) => {
    // Default to a generic location if none provided
    const currentLocation = location || "the area";

    // Base descriptions for different intensity levels
    const lowIntensityDescriptions = [
      `${currentLocation} shows signs of the recent conflict, with minor damage visible.`,
      `A tense atmosphere hangs over ${currentLocation} as the situation threatens to escalate.`,
      `${currentLocation} remains relatively intact, though the signs of battle are beginning to show.`,
    ];

    const mediumIntensityDescriptions = [
      `Debris litters ${currentLocation} as the battle continues to intensify.`,
      `Smoke rises from several points around ${currentLocation} as the conflict escalates.`,
      `${currentLocation} has sustained significant damage, with structures partially collapsed.`,
    ];

    const highIntensityDescriptions = [
      `${currentLocation} has become a war zone, with destruction visible in every direction.`,
      `Massive explosions rock ${currentLocation} as the battle reaches its peak intensity.`,
      `${currentLocation} is barely recognizable amid the chaos and devastation of the raging battle.`,
    ];

    // Select appropriate descriptions based on intensity
    let possibleDescriptions;
    if (intensity <= 4) {
      possibleDescriptions = lowIntensityDescriptions;
    } else if (intensity <= 7) {
      possibleDescriptions = mediumIntensityDescriptions;
    } else {
      possibleDescriptions = highIntensityDescriptions;
    }

    // Filter out descriptions that have been used recently
    const availableDescriptions = possibleDescriptions.filter(
      (desc) => !previousDescriptions.includes(desc)
    );

    // If all descriptions have been used, reset and use any of them
    if (availableDescriptions.length === 0) {
      return possibleDescriptions[
        Math.floor(Math.random() * possibleDescriptions.length)
      ];
    }

    // Return a random description from the available ones
    return availableDescriptions[
      Math.floor(Math.random() * availableDescriptions.length)
    ];
  };

  // Generate sensory details for the current scene
  const generateSensoryDetails = (location, phase, conditions = {}) => {
    // Default location
    const currentLocation = location || "the area";

    // Sensory details based on narrative phase and location
    const sensorySuites = {
      introduction: {
        sight: `The environment around ${currentLocation} appears relatively normal, though there's a subtle tension in the air.`,
        sound:
          "Distant sounds of commotion can be heard, growing gradually closer.",
        smell: "The air carries a faint trace of smoke and dust.",
        touch: "The ground occasionally trembles slightly beneath your feet.",
      },
      rising: {
        sight: `${currentLocation} shows increasing signs of damage, with debris scattered across the ground.`,
        sound:
          "The clash of combat grows louder, punctuated by shouts and occasional explosions.",
        smell:
          "Acrid smoke fills the air, making it slightly difficult to breathe.",
        touch:
          "Heat radiates from nearby damaged structures and the ground shakes more frequently.",
      },
      climax: {
        sight: `${currentLocation} has transformed into a battlefield, with destruction visible everywhere.`,
        sound:
          "Deafening explosions and the constant sounds of battle make it hard to hear anything else.",
        smell:
          "The overwhelming scent of smoke, dust, and destruction fills your nostrils.",
        touch:
          "The ground shakes violently with each impact, and the air itself seems to pulse with energy.",
      },
      resolution: {
        sight: `The battle at ${currentLocation} appears to be subsiding, though the aftermath of destruction remains.`,
        sound:
          "The sounds of combat are fading, replaced by the crackle of fires and distant voices.",
        smell:
          "The air still carries the scent of battle, but it's beginning to clear.",
        touch:
          "Dust settles on your skin as the ground finally stops trembling.",
      },
    };

    // Get the appropriate sensory suite based on the current phase
    const currentSuite = sensorySuites[phase] || sensorySuites.rising;

    // Modify based on environmental conditions if provided
    if (conditions.weather === "rain") {
      currentSuite.sight +=
        " Rain pours down, reducing visibility and turning dust to mud.";
      currentSuite.sound += " Raindrops drum loudly on surfaces all around.";
      currentSuite.touch +=
        " You're soaked to the skin, cold water running down your face.";
    } else if (conditions.timeOfDay === "night") {
      currentSuite.sight +=
        " Darkness makes it difficult to see clearly, with fires and explosions providing brief illumination.";
      currentSuite.sound +=
        " The darkness seems to amplify every sound, making them more disorienting.";
    }

    return currentSuite;
  };

  // Generate battle-specific options for "What happens next?"
  const generateBattleOptions = (
    battleState,
    characters,
    previousChoices = [],
    location = "the area"
  ) => {
    // Default options if we can't generate specific ones
    const defaultOptions = [
      {
        id: "default_1",
        text: "The battle intensifies as enemy forces press their attack.",
        type: "escalation",
      },
      {
        id: "default_2",
        text: "A momentary lull in the fighting provides a chance to regroup.",
        type: "tactical",
      },
      {
        id: "default_3",
        text: "Civilians are caught in the crossfire and need immediate help.",
        type: "rescue",
        urgency: "high",
      },
    ];

    // If no characters or battle state, return defaults
    if (!characters || characters.length === 0 || !battleState) {
      return defaultOptions;
    }

    // Create a pool of possible options based on the current battle state
    const optionPool = [];

    // 1. Escalation options - increase the battle intensity
    const escalationOptions = [
      {
        id: "escalation_1",
        text: `Enemy reinforcements arrive at ${location}, making the situation more dire.`,
        type: "escalation",
      },
      {
        id: "escalation_2",
        text: "A massive explosion rocks the battlefield, forcing everyone to take cover.",
        type: "escalation",
      },
      {
        id: "escalation_3",
        text: "The enemy reveals a powerful new weapon that threatens to turn the tide of battle.",
        type: "escalation",
      },
    ];

    // 2. Character-focused options - highlight specific characters
    const characterOptions = characters.map((character) => ({
      id: `character_${character.name.toLowerCase().replace(/\s/g, "_")}`,
      text: `${character.name} finds an opportunity to use their unique abilities to change the course of battle.`,
      type: "character_action",
      focusCharacter: character.name,
    }));

    // 3. Tactical options - provide strategic opportunities
    const tacticalOptions = [
      {
        id: "tactical_1",
        text: `A weakness in the enemy's formation becomes apparent, offering a tactical advantage.`,
        type: "tactical",
      },
      {
        id: "tactical_2",
        text: "Communication systems briefly come back online, allowing for better coordination.",
        type: "tactical",
      },
      {
        id: "tactical_3",
        text: "A nearby structure could provide a strategic vantage point if secured quickly.",
        type: "tactical",
      },
    ];

    // 4. Rescue options - focus on civilians or allies in danger
    const rescueOptions = [
      {
        id: "rescue_1",
        text: "A group of civilians is trapped in a damaged building that's threatening to collapse.",
        type: "rescue",
        urgency: "high",
      },
      {
        id: "rescue_2",
        text: "An injured ally calls for help from a dangerous position on the battlefield.",
        type: "rescue",
        urgency: "medium",
      },
    ];

    // 5. Team combo options - opportunities for characters to work together
    const teamComboOptions = [];
    if (characters.length >= 2) {
      // Get two random characters
      const char1 = characters[Math.floor(Math.random() * characters.length)];
      let char2 = characters[Math.floor(Math.random() * characters.length)];
      // Make sure we have two different characters
      while (char2.name === char1.name && characters.length > 1) {
        char2 = characters[Math.floor(Math.random() * characters.length)];
      }

      teamComboOptions.push({
        id: `team_${char1.name.toLowerCase()}_${char2.name.toLowerCase()}`.replace(
          /\s/g,
          "_"
        ),
        text: `${char1.name} and ${char2.name} have a chance to combine their abilities for a powerful joint attack.`,
        type: "team_combo",
        focusCharacter: `${char1.name} & ${char2.name}`,
      });
    }

    // 6. Environmental options - use the environment in interesting ways
    const environmentalOptions = [
      {
        id: "environment_1",
        text: `Part of a structure at ${location} collapses, changing the battlefield layout.`,
        type: "environment",
      },
      {
        id: "environment_2",
        text: "Electrical systems in the area short out, causing a chain reaction of smaller explosions.",
        type: "environment",
      },
      {
        id: "environment_3",
        text: "A sudden change in weather conditions affects visibility and movement on the battlefield.",
        type: "environment",
      },
    ];

    // Add options to the pool based on battle state

    // Always include at least one character-focused option
    optionPool.push(...characterOptions);

    // Add escalation options if battle intensity isn't already at maximum
    if (battleState.intensity < 10) {
      optionPool.push(...escalationOptions);
    }

    // Add tactical options
    optionPool.push(...tacticalOptions);

    // Add rescue options if civilian danger is high
    if (battleState.civilianDanger > 5) {
      optionPool.push(...rescueOptions);
    }

    // Add team combo options if available
    if (teamComboOptions.length > 0) {
      optionPool.push(...teamComboOptions);
    }

    // Add environmental options
    optionPool.push(...environmentalOptions);

    // Filter out options that have been used recently
    const filteredOptions = optionPool.filter(
      (option) => !previousChoices.includes(option.id)
    );

    // If we have enough options after filtering, use those
    if (filteredOptions.length >= 3) {
      // Shuffle and take 3 options
      return filteredOptions.sort(() => 0.5 - Math.random()).slice(0, 3);
    }

    // Otherwise, use all filtered options and add some defaults to reach 3
    const selectedOptions = [...filteredOptions];

    // Add default options until we have 3
    while (selectedOptions.length < 3) {
      const defaultOption =
        defaultOptions[selectedOptions.length % defaultOptions.length];
      // Make sure we're not adding duplicates
      if (!selectedOptions.some((opt) => opt.id === defaultOption.id)) {
        selectedOptions.push(defaultOption);
      } else {
        // If we would add a duplicate, create a slightly modified version
        const modifiedOption = {
          ...defaultOption,
          id: `${defaultOption.id}_modified`,
          text: defaultOption.text
            .replace("the battle", "the conflict")
            .replace("enemy forces", "opponents"),
        };
        selectedOptions.push(modifiedOption);
      }
    }

    return selectedOptions;
  };

  // Toggle narration input
  const toggleNarrationInput = () => {
    // Toggle the panel if it's already open
    if (showNarrationInput) {
      setShowNarrationInput(false);
      return;
    }

    // Close other panels
    setShowActionMenu(false);
    setShowWritingInstructions(false);
    setShowNextOptions(false);

    // Open this panel
    setShowNarrationInput(true);
  };

  // Toggle writing instructions
  const toggleWritingInstructions = () => {
    // Toggle the panel if it's already open
    if (showWritingInstructions) {
      setShowWritingInstructions(false);
      return;
    }

    // Close other panels
    setShowActionMenu(false);
    setShowNarrationInput(false);
    setShowNextOptions(false);

    // Open this panel
    setShowWritingInstructions(true);
  };

  // Handle character actions (emotes, physical actions, etc.)
  const handleCharacterAction = (actionType) => {
    if (!activeCharacter) return;

    let actionText = "";

    switch (actionType) {
      case "smile":
        actionText = `*${activeCharacter.name} smiles warmly*`;
        break;
      case "laugh":
        actionText = `*${activeCharacter.name} laughs heartily*`;
        break;
      case "frown":
        actionText = `*${activeCharacter.name} frowns with concern*`;
        break;
      case "nod":
        actionText = `*${activeCharacter.name} nods thoughtfully*`;
        break;
      case "sigh":
        actionText = `*${activeCharacter.name} sighs deeply*`;
        break;
      case "custom":
        setCurrentAction("custom");
        return;
      default:
        return;
    }

    // Add action to chat history
    const actionMessage = {
      id: Date.now(),
      speaker: activeCharacter.name,
      character: activeCharacter,
      message: actionText,
      isUser: true,
      isAction: true,
      timestamp: new Date().toISOString(),
    };

    setChatHistory([...chatHistory, actionMessage]);
    setShowActionMenu(false);
  };

  // Handle custom action submission
  const handleCustomAction = () => {
    if (!currentAction.trim() || !activeCharacter) return;

    const actionText = `*${activeCharacter.name} ${currentAction}*`;

    // Add action to chat history
    const actionMessage = {
      id: Date.now(),
      speaker: activeCharacter.name,
      character: activeCharacter,
      message: actionText,
      isUser: true,
      isAction: true,
      timestamp: new Date().toISOString(),
    };

    setChatHistory([...chatHistory, actionMessage]);
    setCurrentAction("");
  };

  // Handle narration submission
  const handleNarrationSubmit = () => {
    if (!narrationText.trim()) return;

    // Add narration to chat history
    const narrationMessage = {
      id: Date.now(),
      message: narrationText,
      system: true,
      isNarration: true,
      timestamp: new Date().toISOString(),
    };

    setChatHistory([...chatHistory, narrationMessage]);
    setNarrationText("");
    setShowNarrationInput(false);
  };

  // Handle writing instructions update
  const handleWritingInstructionsChange = (field, value) => {
    setWritingInstructions({
      ...writingInstructions,
      [field]: value,
    });
  };

  // Generate "What happens next?" options
  const generateNextOptions = () => {
    // Toggle the panel if it's already open
    if (showNextOptions) {
      setShowNextOptions(false);
      return;
    }

    // Close other panels
    setShowActionMenu(false);
    setShowNarrationInput(false);
    setShowWritingInstructions(false);
    setShowSensoryPanel(false);

    // Check if we're in a battle scenario
    const isBattleScenario = detectBattleScenario(chatRoom, chatHistory);

    // Determine if this is an Avengers scenario
    const isAvengersScenario =
      chatRoom?.name && chatRoom.name.includes("Avengers");

    if (isBattleScenario || isAvengersScenario) {
      // Use our enhanced battle options for Avengers or battle scenarios
      console.log("Generating battle options for battle scenario");

      // Update battle state based on recent messages
      const recentMessages = chatHistory.slice(-10);
      const battleKeywords = [
        "attack",
        "fight",
        "battle",
        "enemy",
        "combat",
        "defend",
        "shield",
        "weapon",
        "explosion",
        "danger",
        "threat",
        "alien",
      ];

      // Count battle keywords in recent messages
      let battleKeywordCount = 0;
      recentMessages.forEach((msg) => {
        if (msg.message) {
          battleKeywords.forEach((keyword) => {
            if (msg.message.toLowerCase().includes(keyword))
              battleKeywordCount++;
          });
        }
      });

      // Update battle intensity (0-10 scale)
      const newIntensity = Math.min(10, Math.max(5, battleKeywordCount / 2));

      // Update battle state
      const newBattleState = {
        ...battleState,
        inProgress: true,
        intensity: newIntensity,
      };

      setBattleState(newBattleState);

      // Generate dynamic scene description
      const sceneDescription = generateSceneDescription(
        currentLocation,
        newIntensity,
        previousSceneDescriptions
      );

      // Add to previous descriptions to avoid repetition
      setPreviousSceneDescriptions((prev) => [...prev, sceneDescription]);

      // Generate sensory details
      const sensorySuite = generateSensoryDetails(
        currentLocation,
        narrativePhase,
        environmentalConditions
      );

      // Update sensory descriptions
      setSensoryDescriptions(sensorySuite);

      // Generate battle-specific options
      const battleOptions = generateBattleOptions(
        newBattleState,
        chatRoom.characters,
        previousChoices,
        currentLocation
      );

      // Store the full option objects for use when selected
      setFullNextOptions(battleOptions);

      // Convert option objects to strings for display
      const displayOptions = battleOptions.map((option) => option.text);
      setNextOptions(displayOptions);
      setShowNextOptions(true);
    } else {
      // For non-battle scenarios, use the original approach

      // Determine the scenario type from the chatRoom
      const scenarioType =
        chatRoom?.theme ||
        (chatRoom?.openingPrompt?.toLowerCase().includes("adventure")
          ? "adventure"
          : chatRoom?.openingPrompt?.toLowerCase().includes("mystery")
          ? "mystery"
          : chatRoom?.openingPrompt?.toLowerCase().includes("fantasy")
          ? "fantasy"
          : chatRoom?.openingPrompt?.toLowerCase().includes("sci-fi") ||
            chatRoom?.openingPrompt?.toLowerCase().includes("scifi")
          ? "scifi"
          : chatRoom?.openingPrompt?.toLowerCase().includes("horror")
          ? "horror"
          : "adventure");

      // Generate options using multiple sources for variety
      let allOptions = [];

      // 1. Use the storyBranchingUtils for context-aware options
      const branchOptions = generateStoryBranches(
        chatHistory,
        chatRoom,
        scenarioType
      );
      allOptions = [...branchOptions];

      // 2. Use the ModularStoryManager for theme-specific options
      if (storyManager) {
        // Get quick actions based on the current theme
        const quickActions = storyManager.getQuickActions();

        // Convert quick actions to narrative options
        const actionOptions = quickActions.map((action) => {
          // Extract recent topics from chat history
          const recentMessages = chatHistory.slice(-5);
          const topics =
            recentMessages
              .map((msg) => msg.message)
              .join(" ")
              .match(/\b\w{4,}\b/g) || [];

          // Pick a random topic if available
          const randomTopic =
            topics.length > 0
              ? topics[Math.floor(Math.random() * topics.length)]
              : "";

          // Create narrative option based on action and theme
          switch (action.toLowerCase()) {
            case "attack":
            case "fight":
              return `A sudden threat appears, forcing everyone to prepare for combat.`;
            case "cast spell":
            case "use power":
              return `Magical energy begins to manifest, drawing everyone's attention.`;
            case "negotiate":
            case "plan":
              return `An opportunity for a strategic discussion presents itself.`;
            case "investigate":
            case "question":
              return `A mysterious clue about ${
                randomTopic || "recent events"
              } is discovered.`;
            case "protect":
              return `Someone or something needs protection from an imminent danger.`;
            default:
              return `An opportunity to ${action.toLowerCase()} presents itself.`;
          }
        });

        allOptions = [...allOptions, ...actionOptions];

        // Add a sensory-based environmental option
        const sense = ["sight", "sound", "smell"][
          Math.floor(Math.random() * 3)
        ];
        const sensoryDesc = storyManager.getSensoryDescription(sense);
        if (sensoryDesc) {
          allOptions.push(
            `${sensoryDesc}, changing the atmosphere of the scene.`
          );
        }

        // Add a narration based on current narrative phase
        const narration = storyManager.getNarration(narrativePhase);
        if (narration) {
          allOptions.push(`${narration}.`);
        }
      }

      // 3. Add an environmental event option
      const environmentalEvent = generateEnvironmentalEvent(
        storyArc,
        chatRoom.characters
      );
      allOptions.push(environmentalEvent);

      // 4. Use the NarrativeStateManager for character-specific options
      if (narrativeManager && chatRoom.characters.length > 0) {
        // Get a random character
        const randomChar =
          chatRoom.characters[
            Math.floor(Math.random() * chatRoom.characters.length)
          ];

        // Create a character-driven option
        const characterOptions = [
          `${randomChar.name} reveals an unexpected secret about their past.`,
          `${randomChar.name} notices something the others have missed.`,
          `${randomChar.name} suggests a new course of action.`,
          `${randomChar.name} experiences a sudden change in mood or perspective.`,
        ];

        const randomCharOption =
          characterOptions[Math.floor(Math.random() * characterOptions.length)];
        allOptions.push(randomCharOption);

        // Record this as a potential branch point
        const branchId = `branch_${Date.now()}`;
        narrativeManager.createBranch(branchId);
      }

      // Shuffle all options and select 3 unique ones
      const shuffledOptions = allOptions
        .sort(() => 0.5 - Math.random())
        .filter((option, index, self) => self.indexOf(option) === index);

      // Select final options, ensuring we have exactly 3
      let selectedOptions = shuffledOptions.slice(0, 3);

      // If we still have fewer than 3, add generic options
      const genericOptions = [
        "A moment of quiet reflection falls over the group.",
        "The conversation takes an unexpected turn.",
        "Someone changes the subject to a new topic.",
      ];

      while (selectedOptions.length < 3) {
        const randomOption =
          genericOptions[Math.floor(Math.random() * genericOptions.length)];
        if (!selectedOptions.includes(randomOption)) {
          selectedOptions.push(randomOption);
        }
      }

      // Update sensory descriptions when showing options
      if (storyManager) {
        updateSensoryDescriptions(storyManager);
      }

      // For non-battle scenarios, we don't have full option objects
      setFullNextOptions([]);
      setNextOptions(selectedOptions);
      setShowNextOptions(true);
    }
  };

  // Apply a "What happens next?" option
  const applyNextOption = (option) => {
    // Find if this option is one of our enhanced battle options
    let selectedOptionObj = null;
    if (fullNextOptions && fullNextOptions.length > 0) {
      selectedOptionObj = fullNextOptions.find((opt) => opt.text === option);
    }

    // Record the choice in the narrative state manager
    if (narrativeManager) {
      const choiceId = `choice_${Date.now()}`;
      const intent = determineChoiceIntent(option);
      narrativeManager.recordChoice(choiceId, option, intent);

      // Update story tension based on the choice
      if (intent === "attack" || intent === "danger") {
        setStoryTension((prev) => Math.min(10, prev + 2));
      } else if (intent === "resolve" || intent === "calm") {
        setStoryTension((prev) => Math.max(1, prev - 1));
      }

      // Update narrative phase if appropriate
      if (storyTension > 7 && narrativePhase === "introduction") {
        setNarrativePhase("rising");
      } else if (storyTension > 8 && narrativePhase === "rising") {
        setNarrativePhase("climax");
      } else if (storyTension < 4 && narrativePhase === "climax") {
        setNarrativePhase("resolution");
      }
    }

    // If this is a battle option, update battle state and track the choice
    if (selectedOptionObj) {
      console.log("Applying enhanced battle option:", selectedOptionObj);

      // Update battle state based on the option
      const newBattleState = { ...battleState };

      // Adjust battle intensity based on option type
      if (selectedOptionObj.type === "escalation") {
        newBattleState.intensity = Math.min(10, newBattleState.intensity + 1);
      } else if (
        selectedOptionObj.type === "rescue" &&
        selectedOptionObj.urgency === "high"
      ) {
        newBattleState.civilianDanger = Math.min(
          10,
          newBattleState.civilianDanger + 2
        );
      } else if (selectedOptionObj.type === "tactical") {
        // Tactical options don't change intensity but might be tracked for other purposes
      }

      // If the option has a focus character, update that in the battle state
      if (selectedOptionObj.focusCharacter) {
        newBattleState.focusCharacter = selectedOptionObj.focusCharacter;
      }

      // Update battle state
      setBattleState(newBattleState);

      // Track this choice to avoid repetition
      if (selectedOptionObj.id) {
        setPreviousChoices((prev) => [...prev, selectedOptionObj.id]);
      }

      // Generate a new scene description based on the updated battle state
      const sceneDescription = generateSceneDescription(
        currentLocation,
        newBattleState.intensity,
        previousSceneDescriptions
      );

      // Add to previous descriptions to avoid repetition
      setPreviousSceneDescriptions((prev) => [...prev, sceneDescription]);

      // Generate new sensory details
      const sensorySuite = generateSensoryDetails(
        currentLocation,
        narrativePhase,
        environmentalConditions
      );

      // Update sensory descriptions
      setSensoryDescriptions(sensorySuite);
    }

    // Add the selected option as a narration
    const nextOptionMessage = {
      id: Date.now(),
      message: option,
      system: true,
      isNarration: true,
      timestamp: new Date().toISOString(),
    };

    // If this is a battle scenario, add a dynamic scene description
    if (selectedOptionObj) {
      // Add the option first
      setChatHistory((prev) => [...prev, nextOptionMessage]);

      // Then add the scene description after a short delay for better pacing
      setTimeout(() => {
        // Get the most recent scene description
        const sceneDesc =
          previousSceneDescriptions[previousSceneDescriptions.length - 1];

        if (sceneDesc) {
          const sceneDescMessage = {
            id: Date.now() + 1,
            message: sceneDesc,
            system: true,
            isNarration: true,
            isSceneDescription: true,
            timestamp: new Date().toISOString(),
          };

          setChatHistory((prev) => [...prev, sceneDescMessage]);

          // Also add a sensory detail for more immersion
          const senseKeys = Object.keys(sensoryDescriptions);
          if (senseKeys.length > 0) {
            // Pick a random sense to highlight
            const randomSense =
              senseKeys[Math.floor(Math.random() * senseKeys.length)];
            const sensoryDetail = sensoryDescriptions[randomSense];

            if (sensoryDetail) {
              setTimeout(() => {
                const sensoryMessage = {
                  id: Date.now() + 2,
                  message: sensoryDetail,
                  system: true,
                  isNarration: true,
                  isSensoryDetail: true,
                  timestamp: new Date().toISOString(),
                };

                setChatHistory((prev) => [...prev, sensoryMessage]);
              }, 1500); // Add sensory detail 1.5 seconds after scene description
            }
          }
        }
      }, 1000); // Add scene description 1 second after option
    } else {
      // For non-battle scenarios, just add the option
      setChatHistory([...chatHistory, nextOptionMessage]);
    }

    setShowNextOptions(false);

    // Update sensory descriptions based on the new development
    if (storyManager) {
      // Update character emotions in the story manager based on the option
      chatRoom.characters.forEach((character) => {
        const emotionChange = determineEmotionChange(option, character);
        if (emotionChange.emotion && emotionChange.value) {
          storyManager.updateCharacterEmotion(
            character.name,
            emotionChange.emotion,
            emotionChange.value
          );
        }
      });

      // Update sensory descriptions
      updateSensoryDescriptions(storyManager);
    }

    // Trigger character responses to this new development
    if (autoRespond && chatRoom.characters.length > 0) {
      // Choose the most appropriate character to respond based on the option
      const respondingCharacter = determineRespondingCharacter(
        option,
        chatRoom.characters
      );

      setIsTyping(true);
      setTypingCharacter(respondingCharacter);

      setTimeout(() => {
        // Generate a response that acknowledges the new development
        let response;

        // Use the story manager to generate a character action if available
        if (storyManager) {
          const action = storyManager.generateCharacterAction(
            respondingCharacter.name,
            "reacts to the new development"
          );

          if (action) {
            response = `*${action}*\n\n`;
          } else {
            response = `*${respondingCharacter.name} reacts to the new development*\n\n`;
          }
        } else {
          response = `*${respondingCharacter.name} reacts to the new development*\n\n`;
        }

        // Generate the character's verbal response
        response += generateCharacterResponse(
          respondingCharacter,
          option,
          chatHistory,
          writingInstructions,
          chatRoom,
          relationships
        );

        // Add the response to chat history
        setChatHistory((prev) => [
          ...prev,
          {
            id: Date.now() + Math.random(),
            speaker: respondingCharacter.name,
            character: respondingCharacter,
            message: response,
            isUser: false,
            timestamp: new Date().toISOString(),
          },
        ]);

        setIsTyping(false);
        setTypingCharacter(null);
      }, 1500);
    }
  };

  // Helper function to determine the intent of a choice
  const determineChoiceIntent = (option) => {
    const optionLower = option.toLowerCase();

    if (
      optionLower.includes("attack") ||
      optionLower.includes("fight") ||
      optionLower.includes("threat") ||
      optionLower.includes("danger") ||
      optionLower.includes("combat")
    ) {
      return "attack";
    }

    if (
      optionLower.includes("magic") ||
      optionLower.includes("spell") ||
      optionLower.includes("power") ||
      optionLower.includes("energy")
    ) {
      return "magic";
    }

    if (
      optionLower.includes("talk") ||
      optionLower.includes("negotiate") ||
      optionLower.includes("discuss") ||
      optionLower.includes("conversation")
    ) {
      return "negotiate";
    }

    if (
      optionLower.includes("investigate") ||
      optionLower.includes("search") ||
      optionLower.includes("discover") ||
      optionLower.includes("find")
    ) {
      return "explore";
    }

    if (
      optionLower.includes("protect") ||
      optionLower.includes("defend") ||
      optionLower.includes("shield") ||
      optionLower.includes("guard")
    ) {
      return "defend";
    }

    return "neutral";
  };

  // Handle story branch selection from the enhanced branching system
  const handleStoryBranchSelection = (branch) => {
    // Record the selection in the narrative director
    if (narrativeDirector) {
      narrativeDirector.recordBranchSelection(branch);
    }

    // Add the branch as a system message in the chat
    setChatHistory([
      ...chatHistory,
      {
        id: Date.now(),
        message: branch,
        system: true,
        isNarration: true,
        timestamp: new Date().toISOString(),
      },
    ]);

    // Record the choice in the narrative state manager
    if (narrativeManager) {
      const choiceId = `choice_${Date.now()}`;
      const intent = determineChoiceIntent(branch);
      narrativeManager.recordChoice(choiceId, branch, intent);

      // Update story tension based on the choice
      if (intent === "attack" || intent === "danger") {
        setStoryTension((prev) => Math.min(10, prev + 2));
      } else if (intent === "resolve" || intent === "calm") {
        setStoryTension((prev) => Math.max(1, prev - 1));
      }
    }

    // Hide the story branches
    setShowStoryBranches(false);

    // Trigger a character response after a short delay
    setTimeout(() => {
      if (chatRoom.characters.length > 0) {
        handleCharacterTurn("auto");
      }
    }, 1000);
  };
};

// Handle story branch selection from the enhanced branching system
const handleStoryBranchSelection = (branch) => {
  // Record the selection in the narrative director
  if (narrativeDirector) {
    narrativeDirector.recordBranchSelection(branch);
  }

  // Add the branch as a system message in the chat
  setChatHistory([
    ...chatHistory,
    {
      id: Date.now(),
      message: branch,
      system: true,
      isNarration: true,
      timestamp: new Date().toISOString(),
    },
  ]);

  // Record the choice in the narrative state manager
  if (narrativeManager) {
    const choiceId = `choice_${Date.now()}`;
    const intent = determineChoiceIntent(branch);
    narrativeManager.recordChoice(choiceId, branch, intent);

    // Update story tension based on the choice
    if (intent === "attack" || intent === "danger") {
      setStoryTension((prev) => Math.min(10, prev + 2));
    } else if (intent === "resolve" || intent === "calm") {
      setStoryTension((prev) => Math.max(1, prev - 1));
    }
  }

  // Hide the story branches
  setShowStoryBranches(false);

  // Trigger a character response after a short delay
  setTimeout(() => {
    if (chatRoom.characters.length > 0) {
      handleCharacterTurn("auto");
    }
  }, 1000);
};

// Helper function to determine emotion changes based on an option
const determineEmotionChange = (option, character) => {
  const optionLower = option.toLowerCase();
  const characterNameLower = character.name.toLowerCase();

  // Check if the option specifically mentions this character
  const isAboutCharacter = optionLower.includes(characterNameLower);

  // Default emotion change
  const result = { emotion: null, value: 0 };

  // Determine emotion change based on option content
  if (
    optionLower.includes("danger") ||
    optionLower.includes("threat") ||
    optionLower.includes("attack") ||
    optionLower.includes("fear")
  ) {
    result.emotion = "tension";
    result.value = isAboutCharacter ? 3 : 1;
  } else if (
    optionLower.includes("reveal") ||
    optionLower.includes("secret") ||
    optionLower.includes("discover") ||
    optionLower.includes("learn")
  ) {
    result.emotion = "trust";
    result.value = isAboutCharacter ? 2 : 1;
  } else if (
    optionLower.includes("joke") ||
    optionLower.includes("laugh") ||
    optionLower.includes("funny") ||
    optionLower.includes("amuse")
  ) {
    result.emotion = "humor";
    result.value = 2;
  }

  return result;
};

// Helper function to handle character response generation
const handleCharacterResponse = (character, userMessage) => {
  if (!character || !userMessage) return;

  try {
    // Get character with current mood
    const characterWithCurrentMood = {
      ...character,
      mood:
        getMoodState(moodStates, character.name, character)?.currentMood ||
        character.mood,
    };

    // Generate character-specific writing instructions based on story arc
    let responseInstructions = { ...writingInstructions };
    if (storyArc) {
      responseInstructions = generateWritingInstructions(storyArc, character);
    }

    // Limit context to recent messages for more focused responses
    const limitedContext = chatHistory.slice(-6);

    // Generate the response
    let response;
    try {
      // Record this character's turn in the tracker
      const isBattleScenario = detectBattleScenario(chatRoom, chatHistory);
      turnTracker.recordTurn(character.name, "dialogue", {
        isBattle: isBattleScenario,
      });

      // Pass writing instructions, chatRoom, and relationships to the response generator
      response = generateCharacterResponse(
        characterWithCurrentMood,
        userMessage.message,
        limitedContext,
        responseInstructions,
        chatRoom,
        relationships
      );
    } catch (error) {
      console.error("Error generating character response:", error);

      // Use character-specific fallback instead of generic message
      const isBattleScenario = detectBattleScenario(chatRoom, chatHistory);
      const context = isBattleScenario ? "battle" : "conversation";

      // Check for romantic/inappropriate context in the user message
      const userMessageLower = userMessage.message.toLowerCase();
      const hasRomanticContext =
        userMessageLower.includes("love") ||
        userMessageLower.includes("kiss") ||
        userMessageLower.includes("hug") ||
        userMessageLower.includes("beautiful") ||
        userMessageLower.includes("marry") ||
        userMessageLower.includes("date") ||
        userMessageLower.includes("come here") ||
        userMessageLower.includes("touch") ||
        userMessageLower.includes("hold") ||
        userMessageLower.includes("feel") ||
        userMessageLower.includes("heart") ||
        userMessageLower.includes("together") ||
        userMessageLower.includes("want you");

      // Use romantic context if detected for fantasy characters
      const effectiveContext =
        hasRomanticContext && character.type === "fantasy"
          ? "romantic"
          : context;

      response = generateCharacterFallback(
        character,
        effectiveContext,
        userMessage.message
      );
    }

    // Add the response to chat history
    setChatHistory((prev) => [
      ...prev,
      {
        id: Date.now() + Math.random(),
        speaker: character.name,
        character: character,
        message: response,
        isUser: false,
        timestamp: new Date().toISOString(),
        replyTo: userMessage.id,
        writingInstructions: responseInstructions,
      },
    ]);

    // Add a follow-up action with some probability
    const actionChance = 0.3; // 30% chance of adding an action
    if (Math.random() < actionChance) {
      setTimeout(() => {
        try {
          // Default generic actions for any character type
          let actions = [
            `*${character.name} nods thoughtfully*`,
            `*${character.name} gestures expressively*`,
            `*${character.name} raises an eyebrow*`,
            `*${character.name} glances around*`,
            `*${character.name} shifts position slightly*`,
            `*${character.name} considers for a moment*`,
          ];

          // Add character-type specific actions if available
          if (character.type === "fantasy") {
            actions = [
              `*${character.name} traces a mystical symbol in the air*`,
              `*${character.name} adjusts their magical artifacts*`,
              `*${character.name} whispers an ancient incantation*`,
              `*${character.name} studies an ancient text or rune*`,
              `*${character.name} senses magical energies in the vicinity*`,
            ];
          } else if (character.type === "superhero") {
            actions = [
              `*${character.name} checks a communication device*`,
              `*${character.name} adjusts their costume slightly*`,
              `*${character.name} scans the environment for threats*`,
              `*${character.name} demonstrates a small use of their powers*`,
              `*${character.name} strikes a confident pose*`,
            ];
          }

          // Select a random action
          const action = actions[Math.floor(Math.random() * actions.length)];

          // Add the action to chat history
          setChatHistory((prev) => [
            ...prev,
            {
              id: Date.now() + Math.random(),
              speaker: character.name,
              character: character,
              message: action,
              isUser: false,
              isAction: true,
              timestamp: new Date().toISOString(),
            },
          ]);
        } catch (error) {
          console.error("Error generating character action:", error);
        }
      }, 1000 + Math.random() * 2000); // Add action 1-3 seconds after the message
    }

    // In one-on-one chats, sometimes have the character continue the conversation
    const isOneOnOneChat = chatRoom.characters.length === 1;
    if (isOneOnOneChat && Math.random() < 0.4) {
      // 40% chance of follow-up
      setTimeout(() => {
        handleCharacterTurn(character);
      }, 3000 + Math.random() * 3000); // 3-6 second delay before follow-up
    }

    setIsTyping(false);
    setTypingCharacter(null);
  } catch (error) {
    console.error("Error in handleCharacterResponse:", error);
    setIsTyping(false);
    setTypingCharacter(null);
  }
};

// Helper function to determine the most appropriate character to respond
const determineRespondingCharacter = (option, characters) => {
  if (!characters || characters.length === 0) {
    return null;
  }

  const optionLower = option.toLowerCase();

  // Check if the option specifically mentions a character
  for (const character of characters) {
    if (optionLower.includes(character.name.toLowerCase())) {
      return character;
    }
  }

  // Otherwise, choose based on the type of option
  if (
    optionLower.includes("danger") ||
    optionLower.includes("threat") ||
    optionLower.includes("attack") ||
    optionLower.includes("combat")
  ) {
    // Find the most combat-oriented character
    return characters.sort((a, b) => {
      const aRelevance =
        (a.personality?.confidence || 5) + (a.personality?.analytical || 5);
      const bRelevance =
        (b.personality?.confidence || 5) + (b.personality?.analytical || 5);
      return bRelevance - aRelevance;
    })[0];
  }

  if (
    optionLower.includes("magic") ||
    optionLower.includes("spell") ||
    optionLower.includes("mystical") ||
    optionLower.includes("energy")
  ) {
    // Find the most magical character
    const magicalCharacter = characters.find(
      (c) =>
        c.type === "fantasy" ||
        (c.description && c.description.toLowerCase().includes("magic"))
    );

    return (
      magicalCharacter ||
      characters[Math.floor(Math.random() * characters.length)]
    );
  }

  if (
    optionLower.includes("clue") ||
    optionLower.includes("mystery") ||
    optionLower.includes("investigate") ||
    optionLower.includes("discover")
  ) {
    // Find the most analytical character
    return characters.sort((a, b) => {
      return (
        (b.personality?.analytical || 5) - (a.personality?.analytical || 5)
      );
    })[0];
  }

  // Default to random selection
  return characters[Math.floor(Math.random() * characters.length)];
};

// Apply custom "What happens next?" option
const applyCustomNextOption = () => {
  if (!customNextOption.trim()) return;

  applyNextOption(customNextOption);
  setCustomNextOption("");
};

// Handle key press in the message input
const handleKeyPress = (e) => {
  // Send message on Enter (without Shift)
  if (e.key === "Enter" && !e.shiftKey) {
    e.preventDefault();
    handleSendMessage();
  }
};

const handleSendMessage = () => {
  if (!message.trim() || !activeCharacter) return;

  // Reset waiting for user input state
  if (waitingForUserInput) {
    setWaitingForUserInput(false);
  }

  // Check if message contains action markers (* at beginning and end)
  if (message.startsWith("*") && message.endsWith("*")) {
    // This is an action, not a regular message
    const actionMessage = {
      id: Date.now(),
      speaker: activeCharacter.name,
      character: activeCharacter,
      message: message,
      isUser: true,
      isAction: true,
      timestamp: new Date().toISOString(),
    };

    setChatHistory([...chatHistory, actionMessage]);
    setMessage("");

    // If auto-respond is enabled, trigger character responses to the action
    if (autoRespond) {
      // Determine if we're in a one-on-one chat
      const isOneOnOneChat = chatRoom.characters.length === 1;

      if (isOneOnOneChat) {
        // In one-on-one chats, have the AI character respond to the action
        setTimeout(() => {
          handleCharacterTurn(chatRoom.characters[0]);
        }, 1000); // Short delay before response
      } else {
        // In group chats, determine if any character should respond to the action
        // based on the action content and character relationships
        const actionLower = message.toLowerCase();

        // Check if the action mentions any character by name
        const mentionedCharacters = chatRoom.characters.filter((char) =>
          actionLower.includes(char.name.toLowerCase())
        );

        if (mentionedCharacters.length > 0) {
          // If characters are mentioned, have one of them respond
          setTimeout(() => {
            handleCharacterTurn(mentionedCharacters[0]);
          }, 1000);
        } else if (Math.random() < 0.7) {
          // 70% chance of response to an action
          // Auto-select a character to respond
          setTimeout(() => {
            handleCharacterTurn("auto");
          }, 1000);
        }
      }
    }

    return;
  }

  // Add user message to chat
  const userMessage = {
    id: Date.now(),
    speaker: activeCharacter.name,
    character: activeCharacter,
    message: message,
    isUser: true,
    timestamp: new Date().toISOString(),
  };

  setChatHistory([...chatHistory, userMessage]);
  setMessage("");

  // Update character relationships based on the message
  if (relationshipAnalyzer && chatRoom.characters.length > 1) {
    const updatedRelationships = relationshipAnalyzer.processMessage(
      {
        sender: activeCharacter.name,
        message: message,
        timestamp: new Date().toISOString(),
      },
      chatRoom.characters
    );

    if (updatedRelationships) {
      setRelationships(updatedRelationships);

      // Check for relationship suggestions
      const suggestions = relationshipAnalyzer.getRelationshipSuggestions(
        chatRoom.characters
      );
      if (suggestions && suggestions.length > 0) {
        setRelationshipSuggestions(suggestions);

        // Show a relationship suggestion with some probability
        if (Math.random() < 0.3) {
          // 30% chance
          setShowRelationshipSuggestion(true);

          // Hide suggestion after 10 seconds
          setTimeout(() => {
            setShowRelationshipSuggestion(false);
          }, 10000);
        }
      }
    }
  }

  // Process message for memory extraction
  if (memoryManager) {
    // Extract memories from the message
    const extractedMemories = memoryManager.processMessage(
      userMessage,
      chatHistory.slice(-15) // Process with recent context
    );

    // Update memories state if new memories were extracted
    if (extractedMemories && extractedMemories.length > 0) {
      setMemories(memoryManager.getAllMemories());

      // Show memory recall notification with some probability
      if (Math.random() < 0.2 && extractedMemories[0].importance >= 7) {
        // 20% chance for important memories
        setRecalledMemory(extractedMemories[0]);
        setShowMemoryRecall(true);

        // Hide recall notification after 8 seconds
        setTimeout(() => {
          setShowMemoryRecall(false);
        }, 8000);
      }
    }
  }

  if (!autoRespond) return;

  // Determine if we're in a one-on-one chat
  const isOneOnOneChat = chatRoom.characters.length === 1;

  if (isOneOnOneChat) {
    // In one-on-one chats, always have the AI character respond
    setIsTyping(true);
    setTypingCharacter(chatRoom.characters[0]);

    // Calculate a natural typing delay based on message length
    const character = chatRoom.characters[0];
    const thinkingSpeed = character.thinkingSpeed || 1;
    const baseDelay = 1000 / thinkingSpeed;
    const messageLength = Math.min(100, message.length);
    const typingDelay = baseDelay + messageLength * 30;

    setTimeout(() => {
      handleCharacterResponse(character, userMessage);
    }, typingDelay);

    return;
  }

  // For group chats, continue with the existing logic
  setIsTyping(true);

  // Determine which characters will respond using our new utility
  // When speaking as "Yourself", all characters can respond
  const otherCharacters =
    activeCharacter.name === "Yourself"
      ? chatRoom.characters
      : chatRoom.characters.filter(
          (char) => char.name !== activeCharacter.name
        );

  // If there are no other characters, don't try to generate responses
  if (otherCharacters.length === 0) {
    setIsTyping(false);
    return;
  }

  // Check if we're in a battle scenario
  const isBattleContext = detectBattleScenario(chatRoom, chatHistory);

  // Determine the maximum number of responders based on message length
  // Longer messages are more likely to get more responses
  const maxResponders = Math.min(
    3,
    Math.max(1, Math.floor(1 + message.length / 100))
  );

  // Use our utility to determine which characters should respond and in what order
  const responders = determineResponders(
    otherCharacters,
    userMessage,
    activeCharacter.name,
    maxResponders
  );

  // If no responders were determined, pick at least one character
  if (responders.length === 0) {
    responders.push(
      otherCharacters[Math.floor(Math.random() * otherCharacters.length)]
    );
  }

  // Generate responses with realistic typing delays
  let delay = 800; // Initial delay

  responders.forEach((character, index) => {
    // Calculate typing delay based on message length and character's "thinking speed"
    const thinkingSpeed = character.thinkingSpeed || 1;
    const baseDelay = 1000 / thinkingSpeed;
    const messageLength = Math.max(20, Math.floor(Math.random() * 80)); // Simulate message length
    const typingDelay = baseDelay + messageLength * 30;

    setTimeout(() => {
      setTypingCharacter(character);

      setTimeout(() => {
        try {
          // Determine if this should be an action or a regular response
          const shouldIncludeAction = Math.random() > 0.7; // 30% chance of including an action

          // Generate the character's response with error handling
          let response;
          try {
            // Analyze the interaction to update relationship
            const analysis = analyzeInteraction(userMessage.message);

            // Update relationship between the responding character and the user's active character
            if (activeCharacter) {
              setRelationships((prevRelationships) => {
                const updatedRelationships = [...prevRelationships];
                const relationship = getRelationship(
                  updatedRelationships,
                  character.name,
                  activeCharacter.name
                );
                const updatedRelationship = updateRelationship(
                  relationship,
                  activeCharacter.name,
                  userMessage.message,
                  analysis.affinityChange,
                  analysis.interactionType
                );

                // Replace the old relationship with the updated one
                const index = updatedRelationships.findIndex(
                  (rel) =>
                    rel.characters.includes(character.name) &&
                    rel.characters.includes(activeCharacter.name)
                );

                if (index !== -1) {
                  updatedRelationships[index] = updatedRelationship;
                }

                return updatedRelationships;
              });

              // Update the character's mood based on the interaction
              setMoodStates((prevMoodStates) => {
                const updatedMoodStates = [...prevMoodStates];

                // Get the current mood state
                const currentMoodState = getMoodState(
                  updatedMoodStates,
                  character.name,
                  character
                );

                // Create a copy to check if we should announce the change
                const previousMoodState = { ...currentMoodState };

                // Update the mood
                const updatedMoodState = updateMood(
                  currentMoodState,
                  `interaction with ${activeCharacter.name}`,
                  analysis.affinityChange,
                  analysis.interactionType
                );

                // Replace the old mood state with the updated one
                const index = updatedMoodStates.findIndex(
                  (state) => state.characterId === character.name
                );

                if (index !== -1) {
                  updatedMoodStates[index] = updatedMoodState;
                }

                // Check if we should announce the mood change
                if (
                  shouldAnnounceMoodChange(previousMoodState, updatedMoodState)
                ) {
                  // Add a system message announcing the mood change
                  const moodChangeMessage = getMoodChangeDescription(
                    previousMoodState,
                    updatedMoodState
                  );

                  setTimeout(() => {
                    setChatHistory((prev) => [
                      ...prev,
                      {
                        id: Date.now() + Math.random(),
                        message: moodChangeMessage,
                        system: true,
                        timestamp: new Date().toISOString(),
                      },
                    ]);
                  }, 1000);
                }

                return updatedMoodStates;
              });
            }

            // Generate character-specific writing instructions based on story arc
            let responseInstructions = { ...writingInstructions };

            // If we have a story arc, use it to generate character-specific instructions
            if (storyArc) {
              responseInstructions = generateWritingInstructions(
                storyArc,
                character
              );

              // Preserve any user-defined writing instructions
              if (writingInstructions.writingStyle !== "balanced") {
                responseInstructions.writingStyle =
                  writingInstructions.writingStyle;
              }
              if (writingInstructions.responseLength !== "medium") {
                responseInstructions.responseLength =
                  writingInstructions.responseLength;
              }
              if (writingInstructions.characterReminders) {
                responseInstructions.characterReminders +=
                  "\n" + writingInstructions.characterReminders;
              }
              if (writingInstructions.generalNotes) {
                responseInstructions.generalNotes +=
                  "\n" + writingInstructions.generalNotes;
              }
            }

            // Get the character's current mood
            const characterMood = getMoodState(
              moodStates,
              character.name,
              character
            );

            // Create a copy of the character with the current mood
            const characterWithCurrentMood = {
              ...character,
              mood: characterMood?.currentMood || character.mood,
            };

            // Pass writing instructions, chatRoom, and relationships to the response generator
            response = generateCharacterResponse(
              characterWithCurrentMood,
              userMessage.message,
              chatHistory,
              responseInstructions,
              chatRoom,
              relationships
            );

            // Check if the response indicates the AI is unsure or off-topic
            const offTopicIndicators = [
              "I'm not sure how to respond to that",
              "Let's try a different topic",
              "I don't know what to say about that",
              "I'm not sure I understand",
              "Let's talk about something else",
              "This requires careful analysis",
              "I need to consider the facts",
              "There are several factors to consider",
              "I'm processing the information",
              "Let me think through this logically",
              "I'm examining the different angles",
              "I need a moment to process",
              "I'm not certain how to interpret",
              "This is a complex matter",
              "I need to analyze this further",
            ];

            const isOffTopic = offTopicIndicators.some((indicator) =>
              response.toLowerCase().includes(indicator.toLowerCase())
            );

            // If the response seems off-topic, use a character-specific fallback
            if (isOffTopic) {
              console.log(
                `Detected off-topic response from ${characterWithCurrentMood.name}, using character-specific fallback`
              );
              const context = isBattleContext ? "battle" : "conversation";

              // Check for romantic/inappropriate context in the user message
              const userMessageLower = userMessage.message.toLowerCase();
              const hasRomanticContext =
                userMessageLower.includes("love") ||
                userMessageLower.includes("kiss") ||
                userMessageLower.includes("hug") ||
                userMessageLower.includes("beautiful") ||
                userMessageLower.includes("marry") ||
                userMessageLower.includes("date") ||
                userMessageLower.includes("come here") ||
                userMessageLower.includes("touch") ||
                userMessageLower.includes("hold") ||
                userMessageLower.includes("feel") ||
                userMessageLower.includes("heart") ||
                userMessageLower.includes("together") ||
                userMessageLower.includes("want you");

              // Use romantic context if detected for fantasy characters
              const effectiveContext =
                hasRomanticContext &&
                characterWithCurrentMood.type === "fantasy"
                  ? "romantic"
                  : context;

              response = generateCharacterFallback(
                characterWithCurrentMood,
                effectiveContext,
                userMessage.message
              );
            }
          } catch (error) {
            console.error("Error generating character response:", error);
            // Use a character-specific fallback response instead of a generic one
            const context = isBattleContext ? "battle" : "conversation";
            response = generateCharacterFallback(
              characterWithCurrentMood,
              context,
              userMessage.message
            );
          }

          // Sanitize any template placeholders in the response
          let sanitizedResponse = response;
          if (sanitizedResponse.includes("}")) {
            sanitizedResponse = sanitizedResponse.replace(/\{[^}]*\}/g, "");
          }

          // Create a clean copy of the character to avoid reference issues
          const characterCopy = { ...character };

          // Add the response to chat history
          setChatHistory((prev) => [
            ...prev,
            {
              id: Date.now() + Math.random(),
              speaker: characterCopy.name,
              character: characterCopy,
              message: sanitizedResponse,
              isUser: false,
              timestamp: new Date().toISOString(),
              replyTo: userMessage.id,
              writingInstructions: storyArc
                ? generateWritingInstructions(storyArc, characterCopy)
                : writingInstructions,
            },
          ]);

          // If we should include an action, add it after a short delay
          if (shouldIncludeAction) {
            setTimeout(() => {
              try {
                // Generate a random action based on character type and personality
                const actions = [
                  `*${character.name} nods thoughtfully*`,
                  `*${character.name} gestures expressively*`,
                  `*${character.name} leans forward with interest*`,
                  `*${character.name} raises an eyebrow*`,
                  `*${character.name} smiles slightly*`,
                  `*${character.name} crosses arms*`,
                  `*${character.name} glances around the room*`,
                  `*${character.name} adjusts posture*`,
                ];

                // Add character-specific actions based on type
                if (character.type === "fantasy") {
                  actions.push(
                    `*${character.name} traces a mystical symbol in the air*`,
                    `*${character.name} adjusts their magical artifacts*`,
                    `*${character.name} whispers an ancient incantation*`
                  );
                } else if (character.type === "scifi") {
                  actions.push(
                    `*${character.name} checks a holographic display*`,
                    `*${character.name} adjusts their tech gear*`,
                    `*${character.name} scans the environment with a device*`
                  );
                }

                // Select a random action
                const action =
                  actions[Math.floor(Math.random() * actions.length)];

                // Create a clean copy of the character to avoid reference issues
                const characterCopy = { ...character };

                // Sanitize any template placeholders in the action
                let sanitizedAction = action;
                if (sanitizedAction.includes("}")) {
                  sanitizedAction = sanitizedAction.replace(/\{[^}]*\}/g, "");
                }

                // Add the action to chat history
                setChatHistory((prev) => [
                  ...prev,
                  {
                    id: Date.now() + Math.random(),
                    speaker: characterCopy.name,
                    character: characterCopy,
                    message: sanitizedAction,
                    isUser: false,
                    isAction: true,
                    timestamp: new Date().toISOString(),
                  },
                ]);
              } catch (error) {
                console.error("Error generating character action:", error);
              }
            }, 1000 + Math.random() * 2000); // Add action 1-3 seconds after the message
          }
        } catch (error) {
          console.error("Error in character response generation:", error);
          if (index === responders.length - 1) {
            setIsTyping(false);
            setTypingCharacter(null);
          }
        }

        if (index === responders.length - 1) {
          setIsTyping(false);
          setTypingCharacter(null);
        }
      }, typingDelay);
    }, delay);

    // Add delay for next character (varies based on message complexity)
    delay += typingDelay + Math.floor(Math.random() * 2000);
  });
};

// Get character avatar component
const getCharacterAvatar = (character) => {
  if (!character) return null;

  // Special case for "Yourself" character
  if (character && character.name === "Yourself") {
    return (
      <div className="bg-blue-600 rounded-full w-10 h-10 flex items-center justify-center text-white font-bold border-2 border-background shadow-sm">
        YOU
      </div>
    );
  }

  // Use the CharacterAvatar component for all other characters
  return <CharacterAvatar character={character} />;
};

// Format timestamp
const formatTime = (timestamp) => {
  if (!timestamp) return "";
  const date = new Date(timestamp);
  return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
};

// Get quick actions for the current scenario from repository or defaults
const getScenarioQuickActionsFromRepo = (scenarioTitle, scenarioTheme) => {
  // Get scenario data from the repository
  const scenarioData = getScenarioData(scenarioTitle, scenarioTheme);

  // If we have scenario data with quick actions, return them
  if (
    scenarioData &&
    scenarioData.quickActions &&
    scenarioData.quickActions.length > 0
  ) {
    return scenarioData.quickActions;
  }

  // Default quick actions based on theme
  const defaultActions = {
    superhero: [
      "Shield civilians",
      "Attack enemy",
      "Coordinate team",
      "Use powers",
    ],
    fantasy: [
      "Cast spell",
      "Draw weapon",
      "Check surroundings",
      "Speak to ally",
    ],
    scifi: ["Scan area", "Check systems", "Draw weapon", "Access terminal"],
    default: [
      "Look around",
      "Check inventory",
      "Approach character",
      "Take cover",
    ],
  };

  return defaultActions[scenarioTheme] || defaultActions.default;
};

// Render the chat room
const renderChatRoom = () => {
  return (
    <div className="flex flex-col h-screen">
      {/* Story branch selector */}
      {showStoryBranches && (
        <StoryBranchSelector
          branches={storyBranches}
          onSelectBranch={handleStoryBranchSelection}
          onDismiss={() => setShowStoryBranches(false)}
          scenarioType={chatRoom?.theme || "adventure"}
        />
      )}

      {/* Relationship graph modal */}
      {showRelationshipGraph && (
        <RelationshipGraph
          relationships={relationships}
          characters={chatRoom.characters}
          onClose={() => setShowRelationshipGraph(false)}
          onSelectRelationship={(relationship) => {
            // Handle relationship selection if needed
            console.log("Selected relationship:", relationship);
          }}
        />
      )}

      {/* Relationship suggestion notification */}
      {showRelationshipSuggestion && relationshipSuggestions.length > 0 && (
        <div className="fixed bottom-24 right-4 max-w-xs bg-card border rounded-lg shadow-lg p-3 z-40 animate-fade-in">
          <div className="flex items-start justify-between">
            <div className="flex items-center">
              <Users className="h-4 w-4 text-primary mr-2" />
              <span className="text-sm font-medium">Relationship Insight</span>
            </div>
            <button
              onClick={() => setShowRelationshipSuggestion(false)}
              className="text-muted-foreground hover:text-foreground"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
          <p className="text-sm mt-2 text-muted-foreground">
            {relationshipSuggestions[0].suggestion}
          </p>
          <div className="mt-2 flex justify-end">
            <button
              onClick={() => {
                setShowRelationshipSuggestion(false);
                setShowRelationshipGraph(true);
              }}
              className="text-xs text-primary hover:text-primary/80"
            >
              View Relationships
            </button>
          </div>
        </div>
      )}

      {/* Memory recall notification */}
      {showMemoryRecall && recalledMemory && (
        <div className="fixed bottom-24 left-4 max-w-xs bg-card border rounded-lg shadow-lg p-3 z-40 animate-fade-in">
          <div className="flex items-start justify-between">
            <div className="flex items-center">
              <Brain className="h-4 w-4 text-primary mr-2" />
              <span className="text-sm font-medium">Memory Recalled</span>
            </div>
            <button
              onClick={() => setShowMemoryRecall(false)}
              className="text-muted-foreground hover:text-foreground"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
          <p className="text-sm mt-2 text-muted-foreground">
            {recalledMemory.content}
          </p>
          <div className="mt-2 flex justify-end">
            <button
              onClick={() => {
                setShowMemoryRecall(false);
                setShowMemoryPanel(true);
              }}
              className="text-xs text-primary hover:text-primary/80"
            >
              View Memories
            </button>
          </div>
        </div>
      )}

      {/* Memory panel */}
      {showMemoryPanel && (
        <MemoryPanel
          memories={memories}
          onCreateMemory={(content, speaker, type, importance) => {
            if (memoryManager) {
              const newMemory = memoryManager.createMemory(
                content,
                speaker,
                type,
                importance
              );
              if (newMemory) {
                setMemories(memoryManager.getAllMemories());
              }
            }
          }}
          onDeleteMemory={(memoryId) => {
            if (memoryManager) {
              const deleted = memoryManager.deleteMemory(memoryId);
              if (deleted) {
                setMemories(memoryManager.getAllMemories());
              }
            }
          }}
          onUpdateMemory={(memoryId, importance) => {
            if (memoryManager) {
              const updated = memoryManager.updateMemoryImportance(
                memoryId,
                importance
              );
              if (updated) {
                setMemories(memoryManager.getAllMemories());
              }
            }
          }}
          onImportMemories={(json) => {
            if (memoryManager) {
              const imported = memoryManager.importMemories(json);
              if (imported) {
                setMemories(memoryManager.getAllMemories());
              }
            }
          }}
          onExportMemories={() => {
            if (memoryManager) {
              const json = memoryManager.exportMemories();

              // Create a blob and download it
              const blob = new Blob([json], { type: "application/json" });
              const url = URL.createObjectURL(blob);
              const a = document.createElement("a");
              a.href = url;
              a.download = `velora-memories-${chatRoom.name
                .replace(/\s+/g, "-")
                .toLowerCase()}-${new Date().toISOString().split("T")[0]}.json`;
              document.body.appendChild(a);
              a.click();
              document.body.removeChild(a);
              URL.revokeObjectURL(url);
            }
          }}
          onClearMemories={() => {
            if (memoryManager) {
              memoryManager.clearMemories();
              setMemories([]);
            }
          }}
          onClose={() => setShowMemoryPanel(false)}
          onUseMemory={(memory) => {
            // Add the memory as a system message in the chat
            setChatHistory([
              ...chatHistory,
              {
                id: Date.now(),
                message: `Memory: ${memory.content}`,
                system: true,
                isNarration: true,
                timestamp: new Date().toISOString(),
              },
            ]);
            setShowMemoryPanel(false);
          }}
          currentContext={memoryContext}
        />
      )}

      {/* Chat header - Improved for mobile */}
      <header className="border-b py-2 px-3 md:py-3 md:px-4 sticky top-0 bg-background/95 backdrop-blur-sm z-10 shadow-sm">
        <div className="container mx-auto flex justify-between items-center">
          <div className="flex items-center gap-2">
            <button
              onClick={onLeaveChat}
              className="p-2 rounded-full hover:bg-secondary touch-action-manipulation"
              aria-label="Leave Chat"
            >
              <ArrowLeft className="h-5 w-5" />
              <span className="sr-only">Leave Chat</span>
            </button>
            <h1 className="text-base md:text-xl font-bold truncate max-w-[150px] sm:max-w-[250px] md:max-w-none">
              {chatRoom?.name || "Chat Room"}
            </h1>
          </div>

          {/* Mobile-optimized action buttons */}
          <div className="flex gap-1 md:gap-2">
            {/* Primary actions always visible */}
            <button
              onClick={() => setShowSettings(!showSettings)}
              className="inline-flex items-center justify-center rounded-full p-2 text-sm font-medium hover:bg-secondary active:bg-secondary/70 touch-action-manipulation"
              aria-label="Chat Settings"
            >
              <Settings className="h-5 w-5" />
            </button>

            {/* Secondary actions in dropdown on mobile, visible on desktop */}
            <div className="relative">
              <button
                onClick={() => {
                  const dropdown = document.getElementById(
                    "header-actions-dropdown"
                  );
                  if (dropdown) {
                    dropdown.classList.toggle("hidden");
                  }
                }}
                className="inline-flex items-center justify-center rounded-full p-2 text-sm font-medium hover:bg-secondary active:bg-secondary/70 md:hidden touch-action-manipulation"
                aria-label="More Actions"
              >
                <MoreVertical className="h-5 w-5" />
              </button>

              {/* Dropdown menu for mobile */}
              <div
                id="header-actions-dropdown"
                className="absolute right-0 top-full mt-1 bg-background/95 backdrop-blur-sm border rounded-lg shadow-lg p-2 hidden z-20 w-[180px]"
              >
                <div className="grid grid-cols-2 gap-1">
                  <button
                    onClick={() => {
                      setTheme(theme === "dark" ? "light" : "dark");
                      document
                        .getElementById("header-actions-dropdown")
                        .classList.add("hidden");
                    }}
                    className="flex flex-col items-center justify-center p-2 rounded-lg hover:bg-secondary/50 text-xs"
                  >
                    {theme === "dark" ? (
                      <>
                        <Sun className="h-5 w-5 mb-1" />
                        <span>Light Mode</span>
                      </>
                    ) : (
                      <>
                        <Moon className="h-5 w-5 mb-1" />
                        <span>Dark Mode</span>
                      </>
                    )}
                  </button>

                  <button
                    onClick={() => {
                      onHowToUse();
                      document
                        .getElementById("header-actions-dropdown")
                        .classList.add("hidden");
                    }}
                    className="flex flex-col items-center justify-center p-2 rounded-lg hover:bg-secondary/50 text-xs"
                  >
                    <HelpCircle className="h-5 w-5 mb-1" />
                    <span>Help</span>
                  </button>

                  <button
                    onClick={() => {
                      toggleAddCharacter();
                      document
                        .getElementById("header-actions-dropdown")
                        .classList.add("hidden");
                    }}
                    className="flex flex-col items-center justify-center p-2 rounded-lg hover:bg-secondary/50 text-xs"
                  >
                    <UserPlus className="h-5 w-5 mb-1" />
                    <span>Add Character</span>
                  </button>

                  <button
                    onClick={() => {
                      onSaveChat();
                      document
                        .getElementById("header-actions-dropdown")
                        .classList.add("hidden");
                    }}
                    className="flex flex-col items-center justify-center p-2 rounded-lg hover:bg-secondary/50 text-xs"
                  >
                    <Download className="h-5 w-5 mb-1" />
                    <span>Save Chat</span>
                  </button>

                  {chatRoom.characters.length > 1 && (
                    <button
                      onClick={() => {
                        setShowRelationshipGraph(true);
                        document
                          .getElementById("header-actions-dropdown")
                          .classList.add("hidden");
                      }}
                      className="flex flex-col items-center justify-center p-2 rounded-lg hover:bg-secondary/50 text-xs"
                    >
                      <Users className="h-5 w-5 mb-1" />
                      <span>Relationships</span>
                    </button>
                  )}

                  <button
                    onClick={() => {
                      setShowMemoryPanel(true);
                      document
                        .getElementById("header-actions-dropdown")
                        .classList.add("hidden");
                    }}
                    className="flex flex-col items-center justify-center p-2 rounded-lg hover:bg-secondary/50 text-xs"
                  >
                    <Brain className="h-5 w-5 mb-1" />
                    <span>Memories</span>
                  </button>
                </div>
              </div>

              {/* Desktop buttons - hidden on mobile */}
              <div className="hidden md:flex gap-1">
                <button
                  onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                  className="inline-flex items-center justify-center rounded-md p-1.5 text-sm font-medium hover:bg-secondary"
                  title={
                    theme === "dark"
                      ? "Switch to Light Mode"
                      : "Switch to Dark Mode"
                  }
                >
                  {theme === "dark" ? (
                    <Sun className="h-5 w-5" />
                  ) : (
                    <Moon className="h-5 w-5" />
                  )}
                </button>
                <button
                  onClick={onHowToUse}
                  className="inline-flex items-center justify-center rounded-md p-1.5 text-sm font-medium hover:bg-secondary"
                  title="How to Use Velora"
                >
                  <HelpCircle className="h-5 w-5" />
                </button>
                <button
                  onClick={toggleAddCharacter}
                  className="inline-flex items-center justify-center rounded-md p-1.5 text-sm font-medium hover:bg-secondary"
                  title="Add Character"
                >
                  <UserPlus className="h-5 w-5" />
                </button>
                <button
                  onClick={onSaveChat}
                  className="inline-flex items-center justify-center rounded-md p-1.5 text-sm font-medium hover:bg-secondary"
                  title="Save Chat"
                >
                  <Download className="h-5 w-5" />
                </button>
                {chatRoom.characters.length > 1 && (
                  <button
                    onClick={() => setShowRelationshipGraph(true)}
                    className="inline-flex items-center justify-center rounded-md p-1.5 text-sm font-medium hover:bg-secondary"
                    title="Character Relationships"
                  >
                    <Users className="h-5 w-5" />
                  </button>
                )}
                <button
                  onClick={() => setShowMemoryPanel(true)}
                  className="inline-flex items-center justify-center rounded-md p-1.5 text-sm font-medium hover:bg-secondary"
                  title="Memory System"
                >
                  <Brain className="h-5 w-5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Chat settings panel (conditionally rendered) */}
      {showSettings && (
        <div className="border-b p-4 bg-secondary/20">
          <div className="container mx-auto max-w-4xl">
            <h2 className="text-lg font-medium mb-3">Chat Settings</h2>

            {/* Basic Settings */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={autoRespond}
                    onChange={() => setAutoRespond(!autoRespond)}
                    className="rounded border-gray-300"
                  />
                  <span>Auto character responses</span>
                </label>
                <p className="text-sm text-muted-foreground ml-6 mt-1">
                  Characters will automatically respond to messages
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">
                  Chat Background
                </label>
                <input
                  type="text"
                  value={chatBackground}
                  onChange={(e) => setChatBackground(e.target.value)}
                  placeholder="Enter image URL for background"
                  className="w-full px-3 py-2 rounded-md border border-input bg-background"
                />
              </div>
            </div>

            {/* Story Arc Context */}
            {storyArc && (
              <div className="mb-4">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-md font-medium flex items-center">
                    <Sparkles className="h-4 w-4 mr-2" />
                    Story Context
                  </h3>
                </div>
                <div className="bg-primary/10 rounded-md p-3 border border-primary/20">
                  <div className="flex justify-between items-center mb-2">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-medium bg-primary/20 px-2 py-0.5 rounded-full">
                        {storyArc.currentPhase.charAt(0).toUpperCase() +
                          storyArc.currentPhase.slice(1)}{" "}
                        Phase
                      </span>
                      <span className="text-xs font-medium bg-secondary/30 px-2 py-0.5 rounded-full">
                        {storyArc.theme.charAt(0).toUpperCase() +
                          storyArc.theme.slice(1)}
                      </span>
                    </div>
                    <div className="text-xs text-muted-foreground">
                      Tension:{" "}
                      {storyArc.currentTension.charAt(0).toUpperCase() +
                        storyArc.currentTension.slice(1)}
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground italic">
                    {storyArc.currentContext}
                  </p>
                  {storyArc.currentGoal && (
                    <div className="mt-2 text-xs">
                      <span className="font-medium">Current Goal:</span>{" "}
                      {storyArc.currentGoal}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Writing Instructions */}
            <div className="mb-4">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-md font-medium flex items-center">
                  <PenTool className="h-4 w-4 mr-2" />
                  Writing Instructions
                </h3>
                <button
                  onClick={() =>
                    setShowWritingInstructions(!showWritingInstructions)
                  }
                  className="text-xs text-muted-foreground hover:text-foreground flex items-center"
                >
                  {showWritingInstructions ? "Hide" : "Show"}
                  <ChevronRight
                    className={`h-4 w-4 ml-1 transition-transform ${
                      showWritingInstructions ? "rotate-90" : ""
                    }`}
                  />
                </button>
              </div>

              {showWritingInstructions && (
                <div className="bg-background/80 rounded-md p-4 border border-input">
                  <p className="text-sm text-muted-foreground mb-4">
                    These instructions help guide the AI in generating
                    responses. They affect how characters respond and how the
                    story develops.
                  </p>

                  <div className="space-y-4">
                    {/* Story Arc */}
                    <div>
                      <label className="text-sm font-medium mb-1 flex items-center">
                        <Zap className="h-4 w-4 mr-1" />
                        Story Arc / Current Direction
                      </label>
                      <textarea
                        value={writingInstructions.storyArc}
                        onChange={(e) =>
                          handleWritingInstructionsChange(
                            "storyArc",
                            e.target.value
                          )
                        }
                        placeholder="Where is the story heading? What themes or plot points should be developed?"
                        className="w-full px-3 py-2 rounded-md border border-input bg-background min-h-[80px] text-sm"
                        rows={3}
                      />
                    </div>

                    {/* Writing Style */}
                    <div>
                      <label className="text-sm font-medium mb-1 flex items-center">
                        <Type className="h-4 w-4 mr-1" />
                        Writing Style
                      </label>
                      <select
                        value={writingInstructions.writingStyle}
                        onChange={(e) =>
                          handleWritingInstructionsChange(
                            "writingStyle",
                            e.target.value
                          )
                        }
                        className="w-full px-3 py-2 rounded-md border border-input bg-background text-sm"
                      >
                        <option value="formal">Formal and Eloquent</option>
                        <option value="casual">
                          Casual and Conversational
                        </option>
                        <option value="poetic">Poetic and Descriptive</option>
                        <option value="humorous">Humorous and Witty</option>
                        <option value="dramatic">Dramatic and Intense</option>
                        <option value="balanced">Balanced (Default)</option>
                      </select>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {/* Emoji Usage */}
                      <div>
                        <label className="text-sm font-medium mb-1 flex items-center">
                          <Smile className="h-4 w-4 mr-1" />
                          Emoji Usage
                        </label>
                        <select
                          value={writingInstructions.emojiUsage}
                          onChange={(e) =>
                            handleWritingInstructionsChange(
                              "emojiUsage",
                              e.target.value
                            )
                          }
                          className="w-full px-3 py-2 rounded-md border border-input bg-background text-sm"
                        >
                          <option value="none">None</option>
                          <option value="minimal">Minimal</option>
                          <option value="moderate">Moderate</option>
                          <option value="frequent">Frequent</option>
                        </select>
                      </div>

                      {/* Response Length */}
                      <div>
                        <label className="text-sm font-medium mb-1 flex items-center">
                          <Sliders className="h-4 w-4 mr-1" />
                          Response Length
                        </label>
                        <select
                          value={writingInstructions.responseLength}
                          onChange={(e) =>
                            handleWritingInstructionsChange(
                              "responseLength",
                              e.target.value
                            )
                          }
                          className="w-full px-3 py-2 rounded-md border border-input bg-background text-sm"
                        >
                          <option value="brief">Brief</option>
                          <option value="medium">Medium</option>
                          <option value="detailed">Detailed</option>
                          <option value="verbose">Verbose</option>
                        </select>
                      </div>
                    </div>

                    {/* Character Reminders */}
                    <div>
                      <label className="text-sm font-medium mb-1 flex items-center">
                        <UserPlus className="h-4 w-4 mr-1" />
                        Character Reminders
                      </label>
                      <textarea
                        value={writingInstructions.characterReminders}
                        onChange={(e) =>
                          handleWritingInstructionsChange(
                            "characterReminders",
                            e.target.value
                          )
                        }
                        placeholder="Specific traits, backstory elements, or relationships to emphasize"
                        className="w-full px-3 py-2 rounded-md border border-input bg-background min-h-[80px] text-sm"
                        rows={2}
                      />
                    </div>

                    {/* General Notes */}
                    <div>
                      <label className="text-sm font-medium mb-1 flex items-center">
                        <Pencil className="h-4 w-4 mr-1" />
                        General Notes
                      </label>
                      <textarea
                        value={writingInstructions.generalNotes}
                        onChange={(e) =>
                          handleWritingInstructionsChange(
                            "generalNotes",
                            e.target.value
                          )
                        }
                        placeholder="Any other instructions or notes for the AI"
                        className="w-full px-3 py-2 rounded-md border border-input bg-background min-h-[80px] text-sm"
                        rows={2}
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Chat messages - Improved for mobile */}
      <div
        ref={chatContainerRef}
        className="flex-1 overflow-y-auto py-2 px-1 sm:py-4 sm:px-2 md:py-5 md:px-0 pb-20"
        style={
          chatBackground
            ? chatBackground.startsWith("linear-gradient")
              ? {
                  background: chatBackground,
                }
              : {
                  backgroundImage: `url(${chatBackground})`,
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                }
            : {}
        }
      >
        <div className="container mx-auto max-w-full sm:max-w-[95%] md:max-w-[90%] lg:max-w-[85%] xl:max-w-[80%] 2xl:max-w-[75%]">
          {/* Always show the opening prompt at the top */}
          {chatRoom?.openingPrompt && chatRoom.openingPrompt.trim() && (
            <div className="bg-background/80 backdrop-blur-sm rounded-lg p-3 md:p-4 mb-4 text-center border border-primary/30 shadow-md relative">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary/50 to-purple-500/50"></div>
              <h3 className="text-xs md:text-sm uppercase tracking-wider text-muted-foreground mb-1">
                Scenario
              </h3>
              <p className="text-sm md:text-base italic">
                {chatRoom.openingPrompt}
              </p>
            </div>
          )}

          {chatHistory.map((msg) => (
            <div
              key={msg.id}
              className={`mb-4 flex ${
                msg.isUser ? "justify-end" : "justify-start"
              }`}
            >
              {/* Avatar for non-user messages - optimized for mobile */}
              {!msg.isUser && (
                <div className="mr-2 md:mr-3 flex-shrink-0 self-end">
                  <div className="w-8 h-8 md:w-10 md:h-10">
                    {getCharacterAvatar(msg.character)}
                  </div>
                </div>
              )}

              <div className="flex flex-col max-w-[85%] sm:max-w-[80%] md:max-w-[75%] lg:max-w-[70%]">
                {/* Message bubble */}
                {editingMessage === msg.id ? (
                  <div className="rounded-lg p-2.5 sm:p-3 md:p-4 bg-background border border-primary/30 shadow-md">
                    <div className="mb-2 text-xs text-muted-foreground flex items-center">
                      <Pencil className="h-3 w-3 mr-1" />
                      <span>Editing message</span>
                      {msg.isAction && (
                        <span className="ml-2 text-amber-500">
                          Use *asterisks* for actions
                        </span>
                      )}
                    </div>
                    <textarea
                      value={editMessageText}
                      onChange={(e) => setEditMessageText(e.target.value)}
                      className="w-full min-h-[100px] p-2 rounded border border-input bg-background resize-none focus:outline-none focus:ring-1 focus:ring-primary"
                      autoFocus
                      placeholder={
                        msg.isAction
                          ? "Describe the action using *asterisks*..."
                          : "Edit your message..."
                      }
                    />
                    <div className="flex justify-between items-center mt-2">
                      <div className="text-xs text-muted-foreground">
                        {msg.edited ? "Previously edited" : ""}
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={handleCancelEditMessage}
                          className="px-3 py-1.5 text-xs rounded-md border border-input hover:bg-secondary/50 text-foreground transition-colors"
                        >
                          Cancel
                        </button>
                        <button
                          onClick={() => handleSaveEditedMessage(msg.id)}
                          className="px-3 py-1.5 text-xs rounded-md bg-primary hover:bg-primary/90 text-primary-foreground transition-colors"
                        >
                          Save Changes
                        </button>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div
                    className={`rounded-lg p-2 sm:p-2.5 md:p-3 text-sm md:text-base ${
                      msg.isUser && !msg.isAction && msg.speaker !== "Yourself"
                        ? "bg-primary text-primary-foreground rounded-br-none shadow-md"
                        : msg.isUser &&
                          !msg.isAction &&
                          msg.speaker === "Yourself"
                        ? "bg-blue-500 text-white rounded-br-none shadow-md"
                        : !msg.isUser && !msg.isAction
                        ? "bg-secondary/90 backdrop-blur-sm rounded-bl-none shadow-md"
                        : msg.isAction
                        ? "bg-background/60 backdrop-blur-sm text-foreground italic"
                        : ""
                    } ${
                      msg.system
                        ? "bg-background/80 backdrop-blur-sm text-center italic border border-muted shadow-sm w-full mx-auto text-xs sm:text-sm"
                        : ""
                    }
                    ${
                      msg.isNarration
                        ? "bg-secondary/50 backdrop-blur-sm text-center italic border border-secondary/50 font-medium shadow-sm w-full mx-auto text-xs sm:text-sm"
                        : ""
                    } ${
                      msg.edited ? "border-l-2 border-amber-500 relative" : ""
                    }`}
                  >
                    {/* Show speaker name and mood indicator - optimized for mobile */}
                    {!msg.system && !msg.isAction && (
                      <div className="mb-1 flex justify-between items-center">
                        <div className="flex items-center gap-1">
                          <span className="font-bold text-xs sm:text-sm truncate max-w-[100px] sm:max-w-[150px] md:max-w-none">
                            {msg.isUser && msg.speaker !== "Yourself"
                              ? "YOU"
                              : msg.speaker}
                          </span>
                          {msg.character && (
                            <MoodIndicator
                              mood={
                                getMoodState(
                                  moodStates,
                                  msg.speaker,
                                  msg.character
                                )?.currentMood || msg.character.mood
                              }
                              intensity={
                                getMoodState(
                                  moodStates,
                                  msg.speaker,
                                  msg.character
                                )?.intensity || 5
                              }
                              size="sm"
                            />
                          )}
                        </div>
                        <div className="flex items-center gap-1 sm:gap-2">
                          {msg.edited && (
                            <span className="text-[10px] sm:text-xs text-amber-500 italic">
                              (edited)
                            </span>
                          )}
                          <span className="text-[10px] sm:text-xs text-muted-foreground">
                            {formatTime(msg.timestamp)}
                          </span>
                        </div>
                      </div>
                    )}
                    <div className="whitespace-pre-wrap">
                      {/* Parse message for scene descriptions (text between asterisks) */}
                      {msg.message.includes("*") ? (
                        <>
                          {msg.message
                            .split(/(\*[^*]+\*)/)
                            .map((part, index) => {
                              if (part.startsWith("*") && part.endsWith("*")) {
                                // Scene description or action
                                return (
                                  <span
                                    key={index}
                                    className="italic text-muted-foreground"
                                  >
                                    {part}
                                  </span>
                                );
                              } else if (part.trim()) {
                                // Regular dialogue
                                return <span key={index}>{part}</span>;
                              }
                              return null;
                            })}
                        </>
                      ) : (
                        // Regular message without scene descriptions
                        msg.message
                      )}

                      {/* Edited indicator */}
                      {msg.edited && (
                        <div className="mt-1 text-xs text-muted-foreground flex items-center">
                          <Pencil className="h-2.5 w-2.5 mr-1" />
                          <span>edited</span>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Message actions - optimized for mobile */}
                {!msg.system && !editingMessage && (
                  <div
                    className={`flex gap-1 sm:gap-2 mt-1 text-[10px] sm:text-xs ${
                      msg.isUser ? "justify-end" : "justify-start"
                    }`}
                  >
                    {!msg.isUser &&
                      // Check if this is the most recent AI message
                      chatHistory.indexOf(msg) ===
                        chatHistory.findLastIndex(
                          (m) => !m.isUser && !m.system
                        ) && (
                        <button
                          onClick={() => handleRegenerateMessage(msg.id)}
                          className="text-muted-foreground hover:text-foreground flex items-center gap-0.5 sm:gap-1 p-1 rounded-md active:bg-secondary/30 touch-action-manipulation"
                          aria-label="Regenerate message"
                        >
                          <RefreshCw className="h-2.5 w-2.5 sm:h-3 sm:w-3" />
                          <span className="hidden sm:inline">Regenerate</span>
                          <span className="sm:hidden">Retry</span>
                        </button>
                      )}
                    <button
                      onClick={() => handleEditMessage(msg.id)}
                      className="text-muted-foreground hover:text-foreground flex items-center gap-0.5 sm:gap-1 p-1 rounded-md active:bg-secondary/30 touch-action-manipulation"
                      aria-label="Edit message"
                    >
                      <Pencil className="h-2.5 w-2.5 sm:h-3 sm:w-3" />
                      <span>Edit</span>
                    </button>
                  </div>
                )}
              </div>

              {/* Avatar for user messages - optimized for mobile */}
              {msg.isUser && (
                <div className="ml-2 md:ml-3 flex-shrink-0 self-end">
                  <div className="w-8 h-8 md:w-10 md:h-10">
                    {getCharacterAvatar(msg.character)}
                  </div>
                </div>
              )}
            </div>
          ))}

          {/* Typing indicator - optimized for mobile */}
          {isTyping && (
            <div className="flex justify-start mb-4">
              {typingCharacter && (
                <div className="mr-2 md:mr-3 flex-shrink-0 self-end">
                  <div className="w-8 h-8 md:w-10 md:h-10">
                    {getCharacterAvatar(typingCharacter)}
                  </div>
                </div>
              )}
              <div className="flex flex-col max-w-[85%] sm:max-w-[80%] md:max-w-[75%] lg:max-w-[70%]">
                {typingCharacter && (
                  <div className="mb-1 flex justify-between items-center">
                    <div className="flex items-center gap-1">
                      <span className="font-bold text-xs sm:text-sm truncate max-w-[100px] sm:max-w-[150px] md:max-w-none">
                        {typingCharacter.name}
                      </span>
                      <MoodIndicator
                        mood={typingCharacter.mood || "neutral"}
                        intensity={5}
                        size="sm"
                      />
                    </div>
                  </div>
                )}
                <div className="bg-secondary/90 backdrop-blur-sm rounded-lg rounded-bl-none p-2 sm:p-2.5 md:p-3 shadow-md">
                  <div className="flex gap-1 sm:gap-2">
                    <span className="animate-bounce text-base sm:text-lg">
                      •
                    </span>
                    <span
                      className="animate-bounce text-base sm:text-lg"
                      style={{ animationDelay: "0.2s" }}
                    >
                      •
                    </span>
                    <span
                      className="animate-bounce text-base sm:text-lg"
                      style={{ animationDelay: "0.4s" }}
                    >
                      •
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Story Driver - shows when waiting for user input */}
          {!isTyping && (
            <StoryDriver
              storyArc={storyArc}
              waitingForInput={waitingForUserInput}
              onAdvance={() => {
                // Advance the story automatically
                setWaitingForUserInput(false);

                // Generate a narrative transition
                const transition = storyArc
                  ? `The story continues as ${
                      storyArc.currentPhase === "climax"
                        ? "the tension reaches its peak"
                        : "events unfold"
                    }...`
                  : "The story continues...";

                // Add transition to chat
                setChatHistory([
                  ...chatHistory,
                  {
                    id: Date.now(),
                    message: transition,
                    system: true,
                    isNarration: true,
                    timestamp: new Date().toISOString(),
                  },
                ]);

                // Trigger character response
                setTimeout(() => {
                  if (chatRoom.characters.length > 0) {
                    handleCharacterTurn("auto");
                  }
                }, 1000);
              }}
              onWhatNext={() => {
                // Show "What happens next?" options
                setWaitingForUserInput(false);
                generateNextOptions();
              }}
            />
          )}

          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* User Character Manager Modal */}
      {showUserCharacterManager && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-background rounded-lg shadow-lg w-full max-w-3xl max-h-[80vh] flex flex-col overflow-hidden">
            <UserCharacterManager
              onSelectCharacter={(character) => {
                setActiveCharacter(character);
                setShowUserCharacterManager(false);
                loadUserCharacters();
              }}
              onClose={() => setShowUserCharacterManager(false)}
            />
          </div>
        </div>
      )}

      {/* Add Character Modal */}
      {showAddCharacter && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-background rounded-lg shadow-lg w-full max-w-3xl max-h-[80vh] flex flex-col">
            <div className="flex justify-between items-center p-4 border-b">
              <h2 className="text-xl font-bold">Add Character to Chat</h2>
              <button
                onClick={toggleAddCharacter}
                className="p-1 rounded-full hover:bg-secondary"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {!showCustomCharacterForm ? (
              <>
                <div className="p-4 border-b">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <input
                      type="text"
                      placeholder="Search characters..."
                      className="w-full pl-10 pr-4 py-2 rounded-md border border-input bg-background"
                      onChange={(e) => {
                        const searchTerm = e.target.value.toLowerCase();
                        if (searchTerm) {
                          const filtered = characterLibrary.filter(
                            (char) =>
                              !chatRoom.characters.some(
                                (c) => c.name === char.name
                              ) &&
                              (char.name.toLowerCase().includes(searchTerm) ||
                                char.description
                                  .toLowerCase()
                                  .includes(searchTerm))
                          );
                          setAvailableCharacters(filtered);
                        } else {
                          const existingCharacterNames =
                            chatRoom.characters.map((char) => char.name);
                          const filtered = characterLibrary.filter(
                            (char) =>
                              !existingCharacterNames.includes(char.name)
                          );
                          setAvailableCharacters(filtered);
                        }
                      }}
                    />
                  </div>
                </div>

                <div className="px-4 py-2 border-b">
                  <button
                    onClick={() => {
                      resetCustomCharacterForm();
                      setShowCustomCharacterForm(true);
                    }}
                    className="w-full p-3 rounded-lg border border-dashed border-primary/50 hover:border-primary hover:bg-primary/5 flex items-center justify-center gap-2 transition-all"
                  >
                    <UserPlus className="h-5 w-5 text-primary" />
                    <span className="font-medium text-primary">
                      Create Custom Character
                    </span>
                  </button>
                </div>
              </>
            ) : (
              <div className="flex-1 overflow-y-auto p-4">
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    handleCreateCustomCharacter();
                  }}
                >
                  <div className="space-y-4">
                    {/* Character Description Generator */}
                    <div className="p-4 border border-primary/20 rounded-md bg-primary/5 mb-6">
                      <h3 className="text-sm font-medium mb-2 flex items-center gap-1">
                        <Wand2 className="h-4 w-4" />
                        <span>AI Character Generator</span>
                      </h3>
                      <p className="text-xs text-muted-foreground mb-3">
                        Describe your character in a few words, and we'll create
                        a complete profile with personality, background, and
                        more.
                      </p>
                      <div className="flex flex-col gap-3">
                        <div className="flex gap-2">
                          <textarea
                            value={characterDescription}
                            onChange={(e) =>
                              setCharacterDescription(e.target.value)
                            }
                            placeholder="Examples: A sarcastic hacker fighting corporate corruption | A wise old wizard with amnesia | A cheerful alien trying to understand humans"
                            className="flex-1 px-3 py-2 rounded-md border border-input bg-background text-sm"
                            rows={3}
                          />
                          <button
                            type="button"
                            onClick={handleGenerateCharacter}
                            disabled={
                              !characterDescription.trim() || isGenerating
                            }
                            className={`px-3 py-2 h-fit rounded-md ${
                              !characterDescription.trim() || isGenerating
                                ? "bg-primary/50 text-primary-foreground/50 cursor-not-allowed"
                                : "bg-primary text-primary-foreground hover:bg-primary/90"
                            } whitespace-nowrap flex items-center gap-1`}
                          >
                            {isGenerating ? (
                              <>
                                <span className="animate-spin">⟳</span>
                                <span>Creating...</span>
                              </>
                            ) : (
                              <>
                                <Wand2 className="h-4 w-4" />
                                <span>Generate Character</span>
                              </>
                            )}
                          </button>
                        </div>

                        {/* Character preview - show when a character has been generated */}
                        {customCharacter.name &&
                          customCharacter.description && (
                            <div className="mt-2 p-3 bg-background rounded-md border border-input">
                              <div className="flex items-center gap-2 mb-2">
                                <CharacterAvatar
                                  character={customCharacter}
                                  size="md"
                                />
                                <div>
                                  <h4 className="font-medium text-sm">
                                    {customCharacter.name}
                                  </h4>
                                  <div className="flex items-center gap-1">
                                    <span
                                      className={`text-xs px-1.5 py-0.5 rounded-full text-white ${
                                        customCharacter.type === "fantasy"
                                          ? "bg-purple-500"
                                          : customCharacter.type === "scifi"
                                          ? "bg-blue-500"
                                          : customCharacter.type ===
                                            "historical"
                                          ? "bg-amber-500"
                                          : customCharacter.type === "romance"
                                          ? "bg-pink-500"
                                          : customCharacter.type === "adventure"
                                          ? "bg-orange-500"
                                          : "bg-green-500"
                                      }`}
                                    >
                                      {customCharacter.type}
                                    </span>
                                    <span className="text-xs px-1.5 py-0.5 bg-secondary/50 rounded-full">
                                      {customCharacter.mood}
                                    </span>
                                  </div>
                                </div>
                              </div>
                              <div className="relative">
                                <p className="text-xs text-muted-foreground mb-2 line-clamp-3 pr-16">
                                  {customCharacter.description}
                                </p>
                                <button
                                  type="button"
                                  onClick={() =>
                                    window.alert(customCharacter.description)
                                  }
                                  className="absolute top-0 right-0 text-xs text-primary hover:text-primary/80 underline"
                                >
                                  Read more
                                </button>
                              </div>

                              <div className="flex flex-wrap gap-1 mb-2">
                                {Object.entries(customCharacter.personality)
                                  .sort((a, b) => b[1] - a[1])
                                  .slice(0, 3)
                                  .map(([trait, value]) => (
                                    <span
                                      key={trait}
                                      className={`text-xs px-1.5 py-0.5 rounded-sm ${
                                        value >= 8
                                          ? "bg-primary/20 text-primary font-medium"
                                          : "bg-secondary/30"
                                      }`}
                                      title={`${trait}: ${value}/10`}
                                    >
                                      {trait} {value >= 8 ? "★" : ""}
                                    </span>
                                  ))}
                              </div>

                              <div className="flex items-center gap-2 text-xs text-muted-foreground mb-2">
                                <div className="flex items-center gap-1">
                                  <span>Talk:</span>
                                  <div className="w-10 h-1.5 bg-secondary/30 rounded-full overflow-hidden">
                                    <div
                                      className="h-full bg-primary/60 rounded-full"
                                      style={{
                                        width: `${
                                          (customCharacter.talkativeness / 10) *
                                          100
                                        }%`,
                                      }}
                                    ></div>
                                  </div>
                                </div>
                                <div className="flex items-center gap-1">
                                  <span>Think:</span>
                                  <div className="w-10 h-1.5 bg-secondary/30 rounded-full overflow-hidden">
                                    <div
                                      className="h-full bg-primary/60 rounded-full"
                                      style={{
                                        width: `${
                                          (customCharacter.thinkingSpeed / 2) *
                                          100
                                        }%`,
                                      }}
                                    ></div>
                                  </div>
                                </div>
                              </div>

                              <div className="text-xs italic text-muted-foreground mt-2 border-t border-border/50 pt-1">
                                "{customCharacter.opening_line}"
                              </div>
                            </div>
                          )}
                      </div>
                    </div>

                    {/* Basic Info */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium mb-1">
                          Name
                        </label>
                        <input
                          type="text"
                          value={customCharacter.name}
                          onChange={(e) =>
                            handleCustomCharacterChange("name", e.target.value)
                          }
                          placeholder="Character name"
                          className="w-full px-3 py-2 rounded-md border border-input bg-background"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-1">
                          Type
                        </label>
                        <select
                          value={customCharacter.type}
                          onChange={(e) =>
                            handleCustomCharacterChange("type", e.target.value)
                          }
                          className="w-full px-3 py-2 rounded-md border border-input bg-background"
                        >
                          <option value="modern">Modern</option>
                          <option value="fantasy">Fantasy</option>
                          <option value="scifi">Sci-Fi</option>
                          <option value="historical">Historical</option>
                          <option value="superhero">Superhero</option>
                          <option value="adventure">Adventure</option>
                          <option value="romance">Romance</option>
                        </select>
                      </div>
                    </div>

                    {/* Description */}
                    <div>
                      <label className="block text-sm font-medium mb-1">
                        Description
                      </label>
                      <textarea
                        value={customCharacter.description}
                        onChange={(e) =>
                          handleCustomCharacterChange(
                            "description",
                            e.target.value
                          )
                        }
                        placeholder="Describe the character's appearance, background, and personality"
                        className="w-full px-3 py-2 rounded-md border border-input bg-background min-h-[80px]"
                        rows={3}
                        required
                      />
                    </div>

                    {/* Mood and Avatar */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium mb-1">
                          Current Mood
                        </label>
                        <input
                          type="text"
                          value={customCharacter.mood}
                          onChange={(e) =>
                            handleCustomCharacterChange("mood", e.target.value)
                          }
                          placeholder="e.g., Happy, Mysterious, Angry"
                          className="w-full px-3 py-2 rounded-md border border-input bg-background"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-1">
                          Avatar URL (optional)
                        </label>
                        <input
                          type="text"
                          value={customCharacter.avatar}
                          onChange={(e) =>
                            handleCustomCharacterChange(
                              "avatar",
                              e.target.value
                            )
                          }
                          placeholder="https://example.com/image.jpg"
                          className="w-full px-3 py-2 rounded-md border border-input bg-background"
                        />
                      </div>
                    </div>

                    {/* Opening Line */}
                    <div>
                      <label className="block text-sm font-medium mb-1">
                        Opening Line
                      </label>
                      <textarea
                        value={customCharacter.opening_line}
                        onChange={(e) =>
                          handleCustomCharacterChange(
                            "opening_line",
                            e.target.value
                          )
                        }
                        placeholder="The first thing the character will say when joining the chat"
                        className="w-full px-3 py-2 rounded-md border border-input bg-background"
                        rows={2}
                      />
                    </div>

                    {/* Voice Style */}
                    <div>
                      <label className="block text-sm font-medium mb-1">
                        Voice Style
                      </label>
                      <input
                        type="text"
                        value={customCharacter.voiceStyle}
                        onChange={(e) =>
                          handleCustomCharacterChange(
                            "voiceStyle",
                            e.target.value
                          )
                        }
                        placeholder="e.g., Formal and eloquent, Casual with slang, Technical jargon"
                        className="w-full px-3 py-2 rounded-md border border-input bg-background"
                      />
                    </div>

                    {/* Personality Traits */}
                    <div>
                      <h3 className="text-sm font-medium mb-2">
                        Personality Traits
                      </h3>
                      <div className="space-y-3">
                        <div>
                          <div className="flex justify-between mb-1">
                            <label className="text-xs">Analytical</label>
                            <span className="text-xs">
                              {customCharacter.personality.analytical}/10
                            </span>
                          </div>
                          <input
                            type="range"
                            min="1"
                            max="10"
                            value={customCharacter.personality.analytical}
                            onChange={(e) =>
                              handleCustomCharacterChange(
                                "personality.analytical",
                                parseInt(e.target.value)
                              )
                            }
                            className="w-full"
                          />
                        </div>
                        <div>
                          <div className="flex justify-between mb-1">
                            <label className="text-xs">Emotional</label>
                            <span className="text-xs">
                              {customCharacter.personality.emotional}/10
                            </span>
                          </div>
                          <input
                            type="range"
                            min="1"
                            max="10"
                            value={customCharacter.personality.emotional}
                            onChange={(e) =>
                              handleCustomCharacterChange(
                                "personality.emotional",
                                parseInt(e.target.value)
                              )
                            }
                            className="w-full"
                          />
                        </div>
                        <div>
                          <div className="flex justify-between mb-1">
                            <label className="text-xs">Philosophical</label>
                            <span className="text-xs">
                              {customCharacter.personality.philosophical}/10
                            </span>
                          </div>
                          <input
                            type="range"
                            min="1"
                            max="10"
                            value={customCharacter.personality.philosophical}
                            onChange={(e) =>
                              handleCustomCharacterChange(
                                "personality.philosophical",
                                parseInt(e.target.value)
                              )
                            }
                            className="w-full"
                          />
                        </div>
                        <div>
                          <div className="flex justify-between mb-1">
                            <label className="text-xs">Humor</label>
                            <span className="text-xs">
                              {customCharacter.personality.humor}/10
                            </span>
                          </div>
                          <input
                            type="range"
                            min="1"
                            max="10"
                            value={customCharacter.personality.humor}
                            onChange={(e) =>
                              handleCustomCharacterChange(
                                "personality.humor",
                                parseInt(e.target.value)
                              )
                            }
                            className="w-full"
                          />
                        </div>
                        <div>
                          <div className="flex justify-between mb-1">
                            <label className="text-xs">Confidence</label>
                            <span className="text-xs">
                              {customCharacter.personality.confidence}/10
                            </span>
                          </div>
                          <input
                            type="range"
                            min="1"
                            max="10"
                            value={customCharacter.personality.confidence}
                            onChange={(e) =>
                              handleCustomCharacterChange(
                                "personality.confidence",
                                parseInt(e.target.value)
                              )
                            }
                            className="w-full"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Talkativeness and Thinking Speed */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <div className="flex justify-between mb-1">
                          <label className="text-xs font-medium">
                            Talkativeness
                          </label>
                          <span className="text-xs">
                            {customCharacter.talkativeness}/10
                          </span>
                        </div>
                        <input
                          type="range"
                          min="1"
                          max="10"
                          value={customCharacter.talkativeness}
                          onChange={(e) =>
                            handleCustomCharacterChange(
                              "talkativeness",
                              parseInt(e.target.value)
                            )
                          }
                          className="w-full"
                        />
                      </div>
                      <div>
                        <div className="flex justify-between mb-1">
                          <label className="text-xs font-medium">
                            Thinking Speed
                          </label>
                          <span className="text-xs">
                            {customCharacter.thinkingSpeed.toFixed(1)}x
                          </span>
                        </div>
                        <input
                          type="range"
                          min="0.5"
                          max="2"
                          step="0.1"
                          value={customCharacter.thinkingSpeed}
                          onChange={(e) =>
                            handleCustomCharacterChange(
                              "thinkingSpeed",
                              parseFloat(e.target.value)
                            )
                          }
                          className="w-full"
                        />
                      </div>
                    </div>
                  </div>
                </form>
              </div>
            )}

            {!showCustomCharacterForm ? (
              <div className="flex-1 overflow-y-auto p-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {availableCharacters.map((character) => (
                    <div
                      key={character.name}
                      onClick={() => handleSelectCharacter(character)}
                      className={`p-3 rounded-lg border cursor-pointer transition-all ${
                        selectedNewCharacter?.name === character.name
                          ? "border-primary bg-primary/10"
                          : "border-border hover:border-primary/50"
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <div className="flex-shrink-0">
                          {character.avatar ? (
                            <img
                              src={character.avatar}
                              alt={character.name}
                              className="w-12 h-12 rounded-full object-cover"
                            />
                          ) : (
                            <div
                              className={`w-12 h-12 rounded-full flex items-center justify-center ${
                                character.type === "fantasy"
                                  ? "bg-purple-500"
                                  : character.type === "scifi"
                                  ? "bg-blue-500"
                                  : character.type === "historical"
                                  ? "bg-amber-500"
                                  : "bg-green-500"
                              } text-white font-bold`}
                            >
                              {character.name
                                .split(" ")
                                .map((n) => n[0])
                                .join("")
                                .toUpperCase()}
                            </div>
                          )}
                        </div>

                        <div className="flex-1">
                          <div className="flex justify-between items-start">
                            <h3 className="font-bold">{character.name}</h3>
                            {selectedNewCharacter?.name === character.name && (
                              <div className="bg-primary text-primary-foreground p-1 rounded-full">
                                <Check className="h-3 w-3" />
                              </div>
                            )}
                          </div>
                          <p className="text-sm text-muted-foreground line-clamp-2">
                            {character.description}
                          </p>
                          <div className="flex justify-between items-center mt-1">
                            <span className="text-xs px-2 py-0.5 bg-secondary rounded-full">
                              {character.mood}
                            </span>
                            <span className="text-xs text-muted-foreground">
                              {character.type}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : null}

            <div className="p-4 border-t flex justify-end">
              {!showCustomCharacterForm ? (
                <>
                  <button
                    onClick={toggleAddCharacter}
                    className="px-4 py-2 rounded-md border border-input mr-2"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleAddCharacter}
                    disabled={!selectedNewCharacter}
                    className={`px-4 py-2 rounded-md ${
                      selectedNewCharacter
                        ? "bg-primary text-primary-foreground hover:bg-primary/90"
                        : "bg-primary/50 text-primary-foreground/50 cursor-not-allowed"
                    }`}
                  >
                    Add to Chat
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick={() => {
                      resetCustomCharacterForm();
                      setShowCustomCharacterForm(false);
                    }}
                    className="px-4 py-2 rounded-md border border-input mr-2"
                  >
                    Back
                  </button>
                  <button
                    onClick={handleCreateCustomCharacter}
                    disabled={
                      !customCharacter.name ||
                      !customCharacter.description ||
                      !customCharacter.mood
                    }
                    className={`px-4 py-2 rounded-md ${
                      customCharacter.name &&
                      customCharacter.description &&
                      customCharacter.mood
                        ? "bg-primary text-primary-foreground hover:bg-primary/90"
                        : "bg-primary/50 text-primary-foreground/50 cursor-not-allowed"
                    }`}
                  >
                    Create & Add to Chat
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Character selector and input - Instagram style */}
      <div className="border-t pt-2 pb-2 px-2 md:pt-3 md:pb-3 md:px-3 bg-background/95 backdrop-blur-sm shadow-md">
        <div className="container mx-auto max-w-full sm:max-w-[95%] md:max-w-[90%] lg:max-w-[85%] xl:max-w-[80%] 2xl:max-w-[75%]">
          {/* Status indicators and additional controls */}
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              {activeCharacter && (
                <div className="text-xs text-muted-foreground">
                  <span className="font-medium text-foreground">
                    {activeCharacter.name}
                  </span>{" "}
                  is ready
                </div>
              )}

              {/* Auto-respond toggle */}
              <label className="inline-flex items-center justify-center rounded-full px-2 py-1 text-xs bg-secondary/10 hover:bg-secondary/20 text-muted-foreground transition-colors cursor-pointer">
                <input
                  type="checkbox"
                  checked={autoRespond}
                  onChange={() => setAutoRespond(!autoRespond)}
                  className="rounded border-gray-300 h-3 w-3 mr-1"
                />
                <span>Auto-respond</span>
              </label>
            </div>

            {/* AI Style button - moved here as it's less frequently used */}
            <button
              onClick={toggleWritingInstructions}
              className={`inline-flex items-center justify-center rounded-full px-2 py-1 text-xs ${
                showWritingInstructions
                  ? "bg-primary/20 text-primary"
                  : "bg-secondary/10 hover:bg-secondary/20 text-muted-foreground"
              } transition-colors`}
            >
              <PenTool className="h-3.5 w-3.5 mr-1" />
              <span>AI Style</span>
            </button>
          </div>

          {/* Action menu (conditionally rendered) */}
          {showActionMenu && (
            <div className="mb-4 p-3 border rounded-md bg-background/80">
              <h3 className="text-sm font-medium mb-2">Character Actions</h3>
              <div className="flex flex-wrap gap-2 mb-3">
                <button
                  onClick={() => handleCharacterAction("smile")}
                  className="px-3 py-1 text-sm rounded-full bg-secondary hover:bg-secondary/80"
                >
                  Smile
                </button>
                <button
                  onClick={() => handleCharacterAction("laugh")}
                  className="px-3 py-1 text-sm rounded-full bg-secondary hover:bg-secondary/80"
                >
                  Laugh
                </button>
                <button
                  onClick={() => handleCharacterAction("frown")}
                  className="px-3 py-1 text-sm rounded-full bg-secondary hover:bg-secondary/80"
                >
                  Frown
                </button>
                <button
                  onClick={() => handleCharacterAction("nod")}
                  className="px-3 py-1 text-sm rounded-full bg-secondary hover:bg-secondary/80"
                >
                  Nod
                </button>
                <button
                  onClick={() => handleCharacterAction("sigh")}
                  className="px-3 py-1 text-sm rounded-full bg-secondary hover:bg-secondary/80"
                >
                  Sigh
                </button>
                <button
                  onClick={() => handleCharacterAction("custom")}
                  className="px-3 py-1 text-sm rounded-full bg-primary/20 hover:bg-primary/30"
                >
                  Custom Action...
                </button>
              </div>

              {currentAction === "custom" && (
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={currentAction === "custom" ? "" : currentAction}
                    onChange={(e) => setCurrentAction(e.target.value)}
                    placeholder="Describe the action (e.g., draws sword)"
                    className="flex-1 px-3 py-1 text-sm rounded-md border border-input bg-background"
                  />
                  <button
                    onClick={handleCustomAction}
                    className="px-3 py-1 text-sm rounded-md bg-primary text-primary-foreground"
                  >
                    Add
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Narration input (conditionally rendered) */}
          {showNarrationInput && (
            <div className="mb-4 p-3 border rounded-md bg-background/80">
              <h3 className="text-sm font-medium mb-2">Add Narration</h3>
              <div className="flex gap-2">
                <textarea
                  value={narrationText}
                  onChange={(e) => setNarrationText(e.target.value)}
                  placeholder="Describe what's happening in the scene..."
                  className="flex-1 px-3 py-2 text-sm rounded-md border border-input bg-background min-h-[80px]"
                  rows={3}
                />
              </div>
              <div className="flex justify-end mt-2">
                <button
                  onClick={handleNarrationSubmit}
                  disabled={!narrationText.trim()}
                  className="px-3 py-1 text-sm rounded-md bg-primary text-primary-foreground disabled:opacity-50"
                >
                  Add Narration
                </button>
              </div>
            </div>
          )}

          {/* AI Writing Instructions (conditionally rendered) */}
          {showWritingInstructions && (
            <div className="mb-4 p-3 border rounded-md bg-background/80">
              <h3 className="text-sm font-medium mb-2 flex items-center">
                <PenTool className="h-4 w-4 mr-1 text-primary" />
                AI Writing Instructions
              </h3>

              <div className="space-y-3">
                {/* Story Arc */}
                <div>
                  <label className="block text-xs font-medium mb-1">
                    Story Arc / Theme
                  </label>
                  <input
                    type="text"
                    value={writingInstructions.storyArc}
                    onChange={(e) =>
                      handleWritingInstructionsChange(
                        "storyArc",
                        e.target.value
                      )
                    }
                    placeholder="e.g., 'Mystery with a twist ending' or 'Romantic comedy'"
                    className="w-full px-3 py-2 text-sm rounded-md border border-input bg-background"
                  />
                </div>

                {/* Writing Style */}
                <div>
                  <label className="block text-xs font-medium mb-1">
                    Writing Style
                  </label>
                  <select
                    value={writingInstructions.writingStyle}
                    onChange={(e) =>
                      handleWritingInstructionsChange(
                        "writingStyle",
                        e.target.value
                      )
                    }
                    className="w-full px-3 py-2 text-sm rounded-md border border-input bg-background"
                  >
                    <option value="formal">Formal & Literary</option>
                    <option value="balanced">Balanced & Natural</option>
                    <option value="casual">Casual & Conversational</option>
                    <option value="poetic">Poetic & Descriptive</option>
                    <option value="humorous">Humorous & Witty</option>
                    <option value="dramatic">Dramatic & Intense</option>
                  </select>
                </div>

                {/* Response Length */}
                <div>
                  <label className="block text-xs font-medium mb-1">
                    Response Length
                  </label>
                  <div className="flex gap-2">
                    <button
                      onClick={() =>
                        handleWritingInstructionsChange(
                          "responseLength",
                          "short"
                        )
                      }
                      className={`flex-1 px-3 py-1 text-sm rounded-md border ${
                        writingInstructions.responseLength === "short"
                          ? "bg-primary text-primary-foreground"
                          : "bg-background"
                      }`}
                    >
                      Short
                    </button>
                    <button
                      onClick={() =>
                        handleWritingInstructionsChange(
                          "responseLength",
                          "medium"
                        )
                      }
                      className={`flex-1 px-3 py-1 text-sm rounded-md border ${
                        writingInstructions.responseLength === "medium"
                          ? "bg-primary text-primary-foreground"
                          : "bg-background"
                      }`}
                    >
                      Medium
                    </button>
                    <button
                      onClick={() =>
                        handleWritingInstructionsChange(
                          "responseLength",
                          "long"
                        )
                      }
                      className={`flex-1 px-3 py-1 text-sm rounded-md border ${
                        writingInstructions.responseLength === "long"
                          ? "bg-primary text-primary-foreground"
                          : "bg-background"
                      }`}
                    >
                      Long
                    </button>
                  </div>
                </div>

                {/* Character Reminders */}
                <div>
                  <label className="block text-xs font-medium mb-1">
                    Character Reminders
                  </label>
                  <textarea
                    value={writingInstructions.characterReminders}
                    onChange={(e) =>
                      handleWritingInstructionsChange(
                        "characterReminders",
                        e.target.value
                      )
                    }
                    placeholder="e.g., 'Remember that Nova is hiding a secret' or 'Thaddeus should mention his time machine'"
                    className="w-full px-3 py-2 text-sm rounded-md border border-input bg-background min-h-[60px]"
                    rows={2}
                  />
                </div>

                {/* General Notes */}
                <div>
                  <label className="block text-xs font-medium mb-1">
                    General Notes
                  </label>
                  <textarea
                    value={writingInstructions.generalNotes}
                    onChange={(e) =>
                      handleWritingInstructionsChange(
                        "generalNotes",
                        e.target.value
                      )
                    }
                    placeholder="Any other instructions for the AI..."
                    className="w-full px-3 py-2 text-sm rounded-md border border-input bg-background min-h-[60px]"
                    rows={2}
                  />
                </div>

                <div className="flex justify-end mt-2">
                  <button
                    onClick={() => setShowWritingInstructions(false)}
                    className="px-3 py-1 text-sm rounded-md bg-primary text-primary-foreground"
                  >
                    Save Instructions
                  </button>
                </div>
              </div>

              <div className="mt-2 text-xs text-muted-foreground">
                These instructions will guide how AI characters respond in the
                conversation.
              </div>
            </div>
          )}

          {/* Sensory Panel (conditionally rendered) */}
          {showSensoryPanel && (
            <div className="mb-4 p-3 border rounded-md bg-background/80 backdrop-blur-sm shadow-md transition-all duration-300 ease-in-out">
              <div className="flex justify-between items-center mb-3">
                <h3 className="text-sm font-medium flex items-center">
                  <Sparkle className="h-4 w-4 mr-1 text-purple-500" />
                  Scene Sensory Details
                </h3>
                <button
                  onClick={() => setShowSensoryPanel(false)}
                  className="p-1 rounded-full hover:bg-secondary/50 transition-colors"
                  title="Close panel"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              {/* Sensory details as chips */}
              <div className="flex flex-wrap gap-2 mb-3">
                {/* Narrative phase and tension chips */}
                <Chip
                  variant="default"
                  size="sm"
                  icon={<Zap className="h-3.5 w-3.5" />}
                >
                  <span className="capitalize">{narrativePhase}</span>
                </Chip>

                <Chip
                  variant="default"
                  size="sm"
                  icon={<Flame className="h-3.5 w-3.5" />}
                >
                  Tension: {storyTension}/10
                </Chip>
              </div>

              {/* Sensory details */}
              <div className="space-y-3">
                {sensoryDescriptions.sight && (
                  <div className="space-y-1">
                    <Chip
                      variant="sight"
                      size="sm"
                      icon={<Sparkles className="h-3.5 w-3.5" />}
                    >
                      Sight
                    </Chip>
                    <p className="text-sm pl-2 border-l-2 border-amber-500/30">
                      {sensoryDescriptions.sight}
                    </p>
                  </div>
                )}

                {sensoryDescriptions.sound && (
                  <div className="space-y-1">
                    <Chip
                      variant="sound"
                      size="sm"
                      icon={<Wind className="h-3.5 w-3.5" />}
                    >
                      Sound
                    </Chip>
                    <p className="text-sm pl-2 border-l-2 border-blue-500/30">
                      {sensoryDescriptions.sound}
                    </p>
                  </div>
                )}

                {sensoryDescriptions.smell && (
                  <div className="space-y-1">
                    <Chip
                      variant="smell"
                      size="sm"
                      icon={<Leaf className="h-3.5 w-3.5" />}
                    >
                      Smell
                    </Chip>
                    <p className="text-sm pl-2 border-l-2 border-green-500/30">
                      {sensoryDescriptions.smell}
                    </p>
                  </div>
                )}

                {sensoryDescriptions.touch && (
                  <div className="space-y-1">
                    <Chip
                      variant="touch"
                      size="sm"
                      icon={<Flame className="h-3.5 w-3.5" />}
                    >
                      Touch
                    </Chip>
                    <p className="text-sm pl-2 border-l-2 border-red-500/30">
                      {sensoryDescriptions.touch}
                    </p>
                  </div>
                )}
              </div>

              <div className="mt-3">
                <div className="flex justify-end mb-2">
                  <Chip
                    variant="default"
                    size="sm"
                    onClick={() => setShowSensoryPanel(false)}
                  >
                    Close
                  </Chip>
                </div>
                <div className="text-xs text-muted-foreground flex items-center gap-1 flex-wrap justify-center">
                  <kbd className="px-1.5 py-0.5 bg-secondary/50 rounded text-[10px] font-mono">
                    Alt+S
                  </kbd>
                  <span>to toggle this panel •</span>
                  <kbd className="px-1.5 py-0.5 bg-secondary/50 rounded text-[10px] font-mono">
                    Esc
                  </kbd>
                  <span>to close</span>
                </div>
              </div>
            </div>
          )}

          {/* What happens next options (conditionally rendered) */}
          {showNextOptions && (
            <div className="mb-4 p-3 border rounded-md bg-background/80 backdrop-blur-sm shadow-md transition-all duration-300 ease-in-out">
              <div className="flex justify-between items-center mb-2">
                <h3 className="text-sm font-medium flex items-center">
                  <Lightbulb className="h-4 w-4 mr-1 text-amber-500" />
                  What happens next?
                </h3>
                <button
                  onClick={() => setShowNextOptions(false)}
                  className="p-1 rounded-full hover:bg-secondary/50 transition-colors"
                  title="Close panel"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
              <div className="space-y-2 mb-3">
                {nextOptions.map((option, index) => {
                  // Check if this is a battle option
                  const isBattleOption =
                    fullNextOptions && fullNextOptions.length > 0;
                  const battleOption = isBattleOption
                    ? fullNextOptions[index]
                    : null;

                  // Determine icon based on option type
                  let OptionIcon = ChevronRight;
                  let iconColor = "text-primary";

                  if (battleOption) {
                    switch (battleOption.type) {
                      case "escalation":
                        OptionIcon = Flame;
                        iconColor = "text-red-500";
                        break;
                      case "rescue":
                        OptionIcon = Users;
                        iconColor = "text-blue-500";
                        break;
                      case "tactical":
                        OptionIcon = Target;
                        iconColor = "text-purple-500";
                        break;
                      case "character_focus":
                      case "character_action":
                        OptionIcon = User;
                        iconColor = "text-green-500";
                        break;
                      case "team_combo":
                        OptionIcon = Zap;
                        iconColor = "text-amber-500";
                        break;
                      case "environment":
                        OptionIcon = Wind;
                        iconColor = "text-cyan-500";
                        break;
                      default:
                        OptionIcon = ArrowRight;
                        iconColor = "text-primary";
                    }
                  }

                  return (
                    <Chip
                      key={index}
                      onClick={() => applyNextOption(option)}
                      variant={
                        battleOption
                          ? battleOption.type || "default"
                          : "default"
                      }
                      size="md"
                      icon={<OptionIcon className={`h-4 w-4 ${iconColor}`} />}
                      endIcon={
                        battleOption && battleOption.focusCharacter ? (
                          <span className="text-xs px-2 py-0.5 bg-secondary/50 rounded-full">
                            {battleOption.focusCharacter}
                          </span>
                        ) : null
                      }
                      className="w-full justify-start mb-2"
                    >
                      <span className="text-left">{option}</span>
                    </Chip>
                  );
                })}
              </div>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={customNextOption}
                  onChange={(e) => setCustomNextOption(e.target.value)}
                  placeholder="Or write your own plot development..."
                  className="flex-1 px-3 py-2 text-sm rounded-md border border-input bg-background"
                />
                <button
                  onClick={applyCustomNextOption}
                  disabled={!customNextOption.trim()}
                  className="px-3 py-1 text-sm rounded-md bg-primary text-primary-foreground disabled:opacity-50"
                >
                  Apply
                </button>
              </div>
              <div className="mt-2 text-xs text-muted-foreground">
                <div>
                  These suggestions will be added as narration and characters
                  will respond to them.
                </div>
                <div className="mt-1 flex items-center gap-1 flex-wrap">
                  <kbd className="px-1.5 py-0.5 bg-secondary/50 rounded text-[10px] font-mono">
                    Alt+W
                  </kbd>
                  <span>to toggle this panel •</span>
                  <kbd className="px-1.5 py-0.5 bg-secondary/50 rounded text-[10px] font-mono">
                    Esc
                  </kbd>
                  <span>to close</span>
                </div>
              </div>
            </div>
          )}

          {/* Instagram-style input area - optimized for mobile */}
          <div className="flex items-center gap-1 sm:gap-2 mt-2 pb-2 fixed bottom-0 left-0 right-0 px-2 sm:px-4 bg-background/95 backdrop-blur-sm border-t z-10">
            {/* Enhanced Character selector button with label - optimized for mobile */}
            <div className="relative">
              <button
                onClick={() => {
                  const dropdown = document.getElementById(
                    "character-select-dropdown"
                  );
                  dropdown.classList.toggle("hidden");
                }}
                className="flex items-center gap-1 sm:gap-2 px-2 py-1 rounded-md bg-secondary/30 hover:bg-secondary/50 transition-colors touch-action-manipulation"
                title={
                  activeCharacter
                    ? `Change character (currently ${activeCharacter.name})`
                    : "Select a character to play"
                }
                aria-label="Select character"
              >
                <div
                  className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full overflow-hidden border-2 ${
                    activeCharacter ? "border-primary" : "border-muted"
                  } flex-shrink-0 transition-all`}
                >
                  {activeCharacter ? (
                    typeof getCharacterAvatar(activeCharacter) === "string" ? (
                      <img
                        src={getCharacterAvatar(activeCharacter)}
                        alt={activeCharacter.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      getCharacterAvatar(activeCharacter)
                    )
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-secondary/30">
                      <User className="h-4 w-4 sm:h-5 sm:w-5 text-muted-foreground" />
                    </div>
                  )}
                </div>
                <div className="flex-col items-start hidden sm:flex">
                  <span className="text-xs text-muted-foreground">
                    Playing as:
                  </span>
                  <span className="text-sm font-medium truncate max-w-[100px]">
                    {activeCharacter
                      ? activeCharacter.name
                      : "Select Character"}
                  </span>
                </div>
                <span className="text-xs font-medium sm:hidden truncate max-w-[60px]">
                  {activeCharacter ? activeCharacter.name : "Select"}
                </span>
                <ChevronRight className="h-3 w-3 sm:h-4 sm:w-4 ml-0.5 text-muted-foreground" />
              </button>

              <div
                id="character-select-dropdown"
                className="absolute left-0 bottom-full mb-2 w-[280px] bg-background/95 backdrop-blur-sm border border-input rounded-lg shadow-lg z-10 hidden"
              >
                <div className="p-3 max-h-[400px] overflow-y-auto">
                  <div className="flex justify-between items-center mb-2">
                    <h4 className="text-sm font-medium">
                      Choose Your Character
                    </h4>
                    <button
                      onClick={() => {
                        document
                          .getElementById("character-select-dropdown")
                          .classList.add("hidden");
                      }}
                      className="p-1 rounded-full hover:bg-secondary/50"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>

                  <p className="text-xs text-muted-foreground mb-3">
                    Select which character you want to play in this
                    conversation. You can switch characters at any time.
                  </p>

                  <div className="mb-3">
                    <button
                      onClick={() => {
                        setActiveCharacter(yourselfCharacter);
                        document
                          .getElementById("character-select-dropdown")
                          .classList.add("hidden");
                      }}
                      className={`w-full flex items-center gap-3 px-3 py-2.5 text-left hover:bg-accent rounded-md ${
                        activeCharacter?.name === "Yourself"
                          ? "bg-primary/10 border border-primary/30"
                          : "border border-border"
                      }`}
                    >
                      <div className="w-10 h-10 rounded-full bg-secondary/30 flex items-center justify-center flex-shrink-0">
                        <User className="h-5 w-5" />
                      </div>
                      <div className="flex flex-col">
                        <span className="font-medium">Yourself</span>
                        <span className="text-xs text-muted-foreground">
                          Play as yourself in the conversation
                        </span>
                      </div>
                    </button>
                  </div>

                  {/* User Characters Section */}
                  {userCharacters.length > 0 && (
                    <>
                      <div className="flex justify-between items-center mb-2">
                        <h4 className="text-xs font-medium text-muted-foreground px-1 py-1">
                          Your Characters
                        </h4>
                        <button
                          onClick={() => {
                            document
                              .getElementById("character-select-dropdown")
                              .classList.add("hidden");
                            setShowUserCharacterManager(true);
                          }}
                          className="text-xs text-primary hover:text-primary/80 flex items-center gap-1"
                        >
                          <Plus className="h-3 w-3" />
                          <span>Manage</span>
                        </button>
                      </div>

                      <div className="space-y-2 mb-3">
                        {userCharacters.map((char) => (
                          <button
                            key={char.id}
                            onClick={() => {
                              setActiveCharacter(char);
                              document
                                .getElementById("character-select-dropdown")
                                .classList.add("hidden");
                            }}
                            className={`w-full flex items-center gap-3 px-3 py-2 text-left hover:bg-accent rounded-md ${
                              activeCharacter?.id === char.id
                                ? "bg-primary/10 border border-primary/30"
                                : "border border-border"
                            }`}
                          >
                            {char.avatar ? (
                              <div className="w-10 h-10 rounded-full overflow-hidden border border-background flex-shrink-0 shadow-sm">
                                <img
                                  src={char.avatar}
                                  alt={char.name}
                                  className="w-full h-full object-cover"
                                />
                              </div>
                            ) : (
                              <div
                                className={`w-10 h-10 rounded-full flex items-center justify-center ${
                                  char.type === "fantasy"
                                    ? "bg-purple-500"
                                    : char.type === "scifi"
                                    ? "bg-blue-500"
                                    : char.type === "historical"
                                    ? "bg-amber-500"
                                    : char.type === "superhero"
                                    ? "bg-red-500"
                                    : char.type === "adventure"
                                    ? "bg-orange-500"
                                    : "bg-green-500"
                                } text-white flex-shrink-0`}
                              >
                                <UserCircle className="h-6 w-6" />
                              </div>
                            )}
                            <div className="flex flex-col items-start">
                              <div className="flex items-center gap-1.5">
                                <span className="font-medium">{char.name}</span>
                                <MoodIndicator
                                  mood={char.mood || "neutral"}
                                  intensity={5}
                                  size="sm"
                                />
                              </div>
                              <span className="text-xs text-muted-foreground line-clamp-1">
                                {char.description
                                  ? char.description.substring(0, 60) +
                                    (char.description.length > 60 ? "..." : "")
                                  : char.type}
                              </span>
                            </div>
                          </button>
                        ))}
                      </div>
                    </>
                  )}

                  {/* Create New Character Button */}
                  <div className="mb-3">
                    <button
                      onClick={() => {
                        document
                          .getElementById("character-select-dropdown")
                          .classList.add("hidden");
                        setShowUserCharacterManager(true);
                      }}
                      className="w-full flex items-center justify-center gap-2 p-2 rounded-md border border-dashed border-primary/50 hover:border-primary hover:bg-primary/5 transition-all"
                    >
                      <Plus className="h-4 w-4 text-primary" />
                      <span className="text-sm text-primary">
                        Create Your Character
                      </span>
                    </button>
                  </div>

                  <h4 className="text-xs font-medium text-muted-foreground px-1 py-1 mb-2">
                    Story Characters
                  </h4>

                  <div className="space-y-2">
                    {chatRoom?.characters.map((char) => (
                      <button
                        key={char.name}
                        onClick={() => {
                          setActiveCharacter(char);
                          document
                            .getElementById("character-select-dropdown")
                            .classList.add("hidden");
                        }}
                        className={`w-full flex items-center gap-3 px-3 py-2 text-left hover:bg-accent rounded-md ${
                          activeCharacter?.name === char.name
                            ? "bg-primary/10 border border-primary/30"
                            : "border border-border"
                        }`}
                      >
                        {typeof getCharacterAvatar(char) === "string" ? (
                          <div className="w-10 h-10 rounded-full overflow-hidden border border-background flex-shrink-0 shadow-sm">
                            <img
                              src={getCharacterAvatar(char)}
                              alt={char.name}
                              className="w-full h-full object-cover"
                            />
                          </div>
                        ) : (
                          <div className="w-10 h-10 flex-shrink-0">
                            {getCharacterAvatar(char)}
                          </div>
                        )}
                        <div className="flex flex-col items-start">
                          <div className="flex items-center gap-1.5">
                            <span className="font-medium">{char.name}</span>
                            <MoodIndicator
                              mood={
                                getMoodState(moodStates, char.name, char)
                                  ?.currentMood || char.mood
                              }
                              intensity={
                                getMoodState(moodStates, char.name, char)
                                  ?.intensity || 5
                              }
                              size="sm"
                            />
                          </div>
                          <span className="text-xs text-muted-foreground line-clamp-1">
                            {char.description
                              ? char.description.substring(0, 60) +
                                (char.description.length > 60 ? "..." : "")
                              : char.type}
                          </span>
                        </div>
                      </button>
                    ))}
                  </div>

                  <div className="mt-3 pt-2 border-t border-border">
                    <p className="text-xs text-muted-foreground">
                      Tip: You can also use the lightning bolt button to make
                      any character speak without changing your active
                      character.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Main message input - Instagram style - optimized for mobile */}
            <div className="flex-1 flex items-center bg-secondary/20 rounded-full border border-transparent focus-within:border-primary/30 focus-within:bg-background transition-all">
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyDown={handleKeyPress}
                placeholder={
                  activeCharacter
                    ? `Message as ${activeCharacter.name}...`
                    : "Select a character..."
                }
                className="flex-1 min-h-[36px] sm:min-h-[40px] max-h-[80px] sm:max-h-[120px] px-3 sm:px-4 py-1.5 sm:py-2 bg-transparent border-none resize-none focus:outline-none text-sm"
                style={{ overflow: "auto" }}
              />

              {/* Quick action buttons inside input area - optimized for mobile */}
              <div className="flex items-center pr-1 sm:pr-2 gap-0.5 sm:gap-1">
                <button
                  onClick={toggleActionMenu}
                  className="p-1 sm:p-1.5 rounded-full hover:bg-secondary/50 active:bg-secondary/70 text-muted-foreground transition-colors touch-action-manipulation"
                  title="Character actions"
                  aria-label="Character actions"
                >
                  <Sparkles className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                </button>

                <button
                  onClick={toggleNarrationInput}
                  className="p-1 sm:p-1.5 rounded-full hover:bg-secondary/50 active:bg-secondary/70 text-muted-foreground transition-colors touch-action-manipulation"
                  title="Add narration"
                  aria-label="Add narration"
                >
                  <BookOpen className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                </button>

                {/* Enhanced Character Turn Button - Let an AI character speak without typing a message */}
                <div className="relative">
                  <button
                    className="p-1 sm:p-1.5 rounded-full hover:bg-primary/20 active:bg-primary/30 text-primary transition-colors touch-action-manipulation"
                    data-character-turn-toggle="true"
                    onClick={() => {
                      // Show character selection dropdown
                      const dropdown = document.getElementById(
                        "character-turn-dropdown"
                      );
                      if (dropdown) {
                        dropdown.classList.toggle("hidden");
                        console.log("Character turn dropdown toggled");
                      } else {
                        console.error(
                          "Character turn dropdown element not found"
                        );
                      }
                    }}
                    title="Let AI character speak (auto-response)"
                    aria-label="Let AI character speak"
                  >
                    <Zap className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                  </button>

                  {/* Character selection dropdown - optimized for mobile */}
                  <div
                    id="character-turn-dropdown"
                    className="absolute bottom-full right-0 mb-2 bg-background/95 backdrop-blur-sm border border-input rounded-md shadow-lg p-2 sm:p-3 hidden z-10 min-w-[200px] sm:min-w-[250px] max-h-[300px] overflow-y-auto"
                  >
                    <div className="flex justify-between items-center mb-2">
                      <h4 className="text-sm font-medium">AI Auto-Response</h4>
                      <button
                        onClick={() => {
                          document
                            .getElementById("character-turn-dropdown")
                            .classList.add("hidden");
                        }}
                        className="p-1 rounded-full hover:bg-secondary/50"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>

                    <p className="text-xs text-muted-foreground mb-3">
                      Let an AI character respond without you typing a message.
                      Useful for advancing the conversation.
                    </p>

                    {/* Auto-select option */}
                    <button
                      className="w-full text-left px-3 py-2.5 text-sm rounded-md hover:bg-primary/20 flex items-center gap-3 transition-colors bg-secondary/20 border border-primary/20 mb-3"
                      onClick={(e) => {
                        e.stopPropagation(); // Prevent event bubbling

                        // Hide dropdown
                        const dropdown = document.getElementById(
                          "character-turn-dropdown"
                        );
                        if (dropdown) {
                          dropdown.classList.add("hidden");
                          console.log(
                            "Hiding dropdown, auto-selecting character"
                          );
                        }

                        // Auto-select the next character to speak
                        handleCharacterTurn("auto");
                      }}
                    >
                      <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
                        <Sparkles className="h-4 w-4 text-primary" />
                      </div>
                      <div className="flex flex-col">
                        <span className="font-medium">
                          Auto-select best character
                        </span>
                        <span className="text-xs text-muted-foreground">
                          Let the AI choose who should speak next
                        </span>
                      </div>
                    </button>

                    <h4 className="text-xs font-medium text-muted-foreground px-1 py-1 mb-2">
                      Choose Specific Character
                    </h4>

                    <div className="space-y-2 max-h-[200px] overflow-y-auto">
                      {chatRoom?.characters &&
                      chatRoom.characters.length > 0 ? (
                        chatRoom.characters.map((char) => (
                          <button
                            key={`turn-${char.name}`}
                            className="w-full text-left px-3 py-2 text-xs rounded-md hover:bg-secondary/30 flex items-center gap-3 transition-colors border border-border"
                            onClick={(e) => {
                              e.stopPropagation(); // Prevent event bubbling

                              // Hide dropdown
                              const dropdown = document.getElementById(
                                "character-turn-dropdown"
                              );
                              if (dropdown) {
                                dropdown.classList.add("hidden");
                                console.log(`Selected character: ${char.name}`);
                              }

                              // Make the character speak
                              handleCharacterTurn(char);
                            }}
                          >
                            <div className="flex-shrink-0">
                              <CharacterAvatar character={char} size="sm" />
                            </div>
                            <div className="flex flex-col">
                              <span className="font-medium">{char.name}</span>
                              <span className="text-xs text-muted-foreground">
                                {char.mood} • {char.type}
                              </span>
                            </div>
                          </button>
                        ))
                      ) : (
                        <div className="px-2.5 py-2 text-xs text-muted-foreground">
                          No characters available
                        </div>
                      )}
                    </div>

                    <div className="mt-3 pt-2 border-t border-border">
                      <p className="text-xs text-muted-foreground">
                        Tip: This feature works best when auto-respond is
                        enabled in settings.
                      </p>
                    </div>
                  </div>
                </div>

                {message.trim() && activeCharacter ? (
                  <button
                    onClick={handleSendMessage}
                    className="p-1 sm:p-1.5 rounded-full bg-primary text-primary-foreground hover:bg-primary/90 active:bg-primary/80 transition-colors touch-action-manipulation"
                    aria-label="Send message"
                  >
                    <Send className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                  </button>
                ) : (
                  <button
                    onClick={generateNextOptions}
                    className="p-1 sm:p-1.5 rounded-full hover:bg-secondary/50 active:bg-secondary/70 text-muted-foreground transition-colors touch-action-manipulation"
                    title="What happens next?"
                    aria-label="What happens next?"
                  >
                    <Lightbulb className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Quick action buttons - optimized for mobile */}
          {/* Narrative-driven quick actions with categories */}
          <ScrollableQuickActions
            className="mt-2 mb-16 sm:mb-20" /* Added bottom margin to account for fixed input area */
            enableCategories={true}
            activeCharacter={activeCharacter}
            narrativePhase={narrativePhase}
            key={`quick-actions-${chatRoom?.name || "default"}`}
          >
            {/* Narrative phase indicator */}
            <Chip
              variant="info"
              size="md"
              icon={<Zap className="h-4 w-4" />}
              className="w-full justify-center"
            >
              <span className="capitalize font-medium">{narrativePhase}</span>
              <span className="mx-1">•</span>
              <span>Tension: {storyTension}/10</span>
            </Chip>

            {/* Character-specific quick actions based on active character and context */}
            {activeCharacter &&
              getCharacterQuickActions(
                activeCharacter,
                narrativePhase,
                detectBattleContext(chatHistory.slice(-10))
              ).map((action, index) => {
                // Determine action category based on content
                const actionLower = action.toLowerCase();
                let category = "character";
                let priority = 0;

                // Categorize and prioritize actions based on content
                if (
                  actionLower.includes("attack") ||
                  actionLower.includes("fight") ||
                  actionLower.includes("defend") ||
                  actionLower.includes("shield") ||
                  actionLower.includes("smash") ||
                  actionLower.includes("throw")
                ) {
                  category = "combat";
                  // Higher priority for combat actions during climax
                  priority = narrativePhase === "climax" ? 3 : 1;
                } else if (
                  actionLower.includes("scan") ||
                  actionLower.includes("analyze") ||
                  actionLower.includes("check") ||
                  actionLower.includes("search")
                ) {
                  category = "exploration";
                  // Higher priority for exploration during rising action
                  priority = narrativePhase === "rising" ? 3 : 1;
                } else if (
                  actionLower.includes("speak") ||
                  actionLower.includes("tell") ||
                  actionLower.includes("share") ||
                  actionLower.includes("ask")
                ) {
                  category = "social";
                  // Higher priority for social actions during introduction/resolution
                  priority =
                    narrativePhase === "introduction" ||
                    narrativePhase === "resolution"
                      ? 3
                      : 1;
                } else if (
                  actionLower.includes("spell") ||
                  actionLower.includes("cast") ||
                  actionLower.includes("magic") ||
                  actionLower.includes("enchant")
                ) {
                  category = "magic";
                  priority = 2;
                } else if (
                  actionLower.includes("block") ||
                  actionLower.includes("dodge") ||
                  actionLower.includes("evade") ||
                  actionLower.includes("protect")
                ) {
                  category = "defense";
                  priority = 2;
                }

                // Determine button style based on category
                const getButtonStyle = () => {
                  switch (category) {
                    case "combat":
                      return "bg-red-500/20 hover:bg-red-500/30 text-red-600 dark:text-red-400";
                    case "social":
                      return "bg-blue-500/20 hover:bg-blue-500/30 text-blue-600 dark:text-blue-400";
                    case "exploration":
                      return "bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-600 dark:text-emerald-400";
                    case "magic":
                      return "bg-fuchsia-500/20 hover:bg-fuchsia-500/30 text-fuchsia-600 dark:text-fuchsia-400";
                    case "defense":
                      return "bg-sky-500/20 hover:bg-sky-500/30 text-sky-600 dark:text-sky-400";
                    default:
                      return "bg-purple-500/20 hover:bg-purple-500/30 text-purple-600 dark:text-purple-400";
                  }
                };

                return (
                  <Chip
                    key={`char-action-${index}`}
                    variant={category}
                    size="md"
                    onClick={() => {
                      // Set the message to the action text
                      setMessage(`*${action}*`);
                    }}
                    className="w-full justify-center"
                  >
                    {action}
                  </Chip>
                );
              })}

            {/* Get quick actions from scenario data if available */}
            {storyArc &&
              storyArc.theme &&
              getScenarioQuickActionsFromRepo(
                storyArc.title,
                storyArc.theme
              ).map((action, index) => (
                <Chip
                  key={`scenario-action-${index}`}
                  variant="scenario"
                  size="md"
                  onClick={() => {
                    // Set the message to the action text
                    setMessage(`*${action}*`);
                  }}
                  className="w-full justify-center"
                >
                  {action}
                </Chip>
              ))}

            {/* Add narrative-driven actions based on current phase */}
            {storyManager &&
              getNarrativePhaseActions(narrativePhase, storyTension).map(
                (actionObj, index) => {
                  // Get the appropriate icon component
                  const IconComponent =
                    actionObj.icon === "Compass"
                      ? Compass
                      : actionObj.icon === "Wind"
                      ? Wind
                      : actionObj.icon === "Flame"
                      ? Flame
                      : actionObj.icon === "Sparkle"
                      ? Sparkle
                      : actionObj.icon === "Zap"
                      ? Zap
                      : actionObj.icon === "Sparkles"
                      ? Sparkles
                      : actionObj.icon === "Leaf"
                      ? Leaf
                      : actionObj.icon === "Droplets"
                      ? Droplets
                      : Sparkle;

                  // Determine button color based on phase
                  const buttonColorClass =
                    narrativePhase === "introduction"
                      ? "bg-blue-500/20 hover:bg-blue-500/30 text-blue-600 dark:text-blue-400"
                      : narrativePhase === "rising"
                      ? "bg-purple-500/20 hover:bg-purple-500/30 text-purple-600 dark:text-purple-400"
                      : narrativePhase === "climax"
                      ? "bg-red-600/20 hover:bg-red-600/30 text-red-700 dark:text-red-400"
                      : narrativePhase === "resolution"
                      ? "bg-green-500/20 hover:bg-green-500/30 text-green-600 dark:text-green-400"
                      : "bg-secondary/50 hover:bg-secondary/70 text-foreground";

                  return (
                    <Chip
                      key={`narrative-action-${index}`}
                      variant={narrativePhase}
                      size="md"
                      icon={<IconComponent className="h-4 w-4 flex-shrink-0" />}
                      onClick={() => {
                        applyNextOption(actionObj.action);
                      }}
                      className="w-full justify-center"
                    >
                      {actionObj.text}
                    </Chip>
                  );
                }
              )}

            {/* Always show the scene details button */}
            <Chip
              variant="default"
              size="md"
              icon={<Sparkle className="h-4 w-4 flex-shrink-0" />}
              onClick={() => setShowSensoryPanel(!showSensoryPanel)}
              className="w-full justify-center"
            >
              Scene Details
            </Chip>
          </ScrollableQuickActions>

          {/* Tips and scene transition - optimized for mobile */}
          <div className="flex justify-between items-center mt-1 mb-16 sm:mb-20">
            <div className="text-[10px] sm:text-xs text-muted-foreground">
              Tip: Use <span className="font-medium">*asterisks*</span> for
              actions
            </div>

            <div className="flex justify-end">
              <Chip
                variant="default"
                size="sm"
                icon={<Lightbulb className="h-3 w-3 sm:h-3.5 sm:w-3.5" />}
                onClick={() => generateNextOptions()}
                title="What happens next?"
                className="text-[10px] sm:text-xs py-0.5 px-2 sm:py-1 sm:px-2.5"
              >
                What Next?
              </Chip>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatRoom;
