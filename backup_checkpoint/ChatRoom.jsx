import { useState, useEffect, useRef } from 'react';
import {
  ArrowLeft, Download, Send, Smile, Settings, RefreshCw, UserPlus,
  Sparkles, BookOpen, PenTool, Lightbulb, ChevronRight,
  Pencil, Zap, Type, Sliders, X, Search, Check, HelpCircle, User
} from 'lucide-react';
import { generateCharacterResponse, generateCharacterInteraction } from '../utils/chatUtils';
import { characterLibrary } from '../data/characters';
import { getRelationship, updateRelationship, analyzeInteraction } from '../utils/relationshipUtils';
import { getMoodState, updateMood, shouldAnnounceMoodChange, getMoodChangeDescription } from '../utils/moodUtils';
import { generateStoryBranches, generateEnvironmentalEvent } from '../utils/storyBranchingUtils';
import { updateStoryArc, generateWritingInstructions } from '../utils/storyArcUtils';
import MoodIndicator from './MoodIndicator';

const ChatRoom = ({ chatRoom, chatHistory, setChatHistory, storyArc, setStoryArc, onSaveChat, onLeaveChat, onHowToUse }) => {
  const [message, setMessage] = useState('');
  const [activeCharacter, setActiveCharacter] = useState(null);
  const [isTyping, setIsTyping] = useState(false);
  const [typingCharacter, setTypingCharacter] = useState(null);
  const [showReactions, setShowReactions] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [showActionMenu, setShowActionMenu] = useState(false);
  const [autoRespond, setAutoRespond] = useState(true);
  const [chatBackground, setChatBackground] = useState('');
  const [currentAction, setCurrentAction] = useState('');
  const [showNarrationInput, setShowNarrationInput] = useState(false);
  const [relationships, setRelationships] = useState([]);
  const [moodStates, setMoodStates] = useState([]);
  const [narrationText, setNarrationText] = useState('');
  const [showWritingInstructions, setShowWritingInstructions] = useState(false);
  const [showNextOptions, setShowNextOptions] = useState(false);
  const [showAddCharacter, setShowAddCharacter] = useState(false);
  const [availableCharacters, setAvailableCharacters] = useState([]);
  const [selectedNewCharacter, setSelectedNewCharacter] = useState(null);

  // Writing instructions state
  const [writingInstructions, setWritingInstructions] = useState({
    storyArc: '',
    writingStyle: 'balanced',
    emojiUsage: 'minimal',
    responseLength: 'medium',
    characterReminders: '',
    generalNotes: ''
  });

  // What happens next options
  const [nextOptions, setNextOptions] = useState([]);
  const [customNextOption, setCustomNextOption] = useState('');

  const messagesEndRef = useRef(null);

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
      confidence: 5
    }
  };

  useEffect(() => {
    // Set the first character as active by default
    if (chatRoom && chatRoom.characters.length > 0 && !activeCharacter) {
      setActiveCharacter(chatRoom.characters[0]);
    }

    // Set chat background if available in chatRoom
    if (chatRoom && chatRoom.background) {
      setChatBackground(chatRoom.background);
    }

    // Initialize available characters for adding to chat
    if (chatRoom) {
      // Filter out characters already in the chat
      const existingCharacterNames = chatRoom.characters.map(char => char.name);
      const filteredCharacters = characterLibrary.filter(
        char => !existingCharacterNames.includes(char.name)
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
            const relationship = getRelationship(initialRelationships, char1.name, char2.name);
            initialRelationships.push(relationship);
          }
        }

        setRelationships(initialRelationships);
      }

      // Initialize mood states for all characters
      const initialMoodStates = [];
      chatRoom.characters.forEach(character => {
        const moodState = getMoodState(initialMoodStates, character.name, character);
        initialMoodStates.push(moodState);
      });

      setMoodStates(initialMoodStates);
    }
  }, [chatRoom, activeCharacter]);

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

  // Add the selected character to the chat
  const handleAddCharacter = () => {
    if (!selectedNewCharacter || !chatRoom) return;

    // Create a copy of the chat room with the new character
    const updatedCharacters = [...chatRoom.characters, selectedNewCharacter];

    // Update the chatRoom object
    chatRoom.characters = updatedCharacters;

    // Add a system message announcing the new character
    const systemMessage = {
      id: Date.now(),
      message: `${selectedNewCharacter.name} has joined the conversation.`,
      system: true,
      timestamp: new Date().toISOString()
    };

    setChatHistory([...chatHistory, systemMessage]);

    // Update available characters
    const updatedAvailableCharacters = availableCharacters.filter(
      char => char.name !== selectedNewCharacter.name
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
        setWritingInstructions(prev => ({
          ...prev,
          storyArc: updatedStoryArc.currentContext
        }));
      }
    }

    // Trigger character interactions
    if (chatHistory.length > 0 && autoRespond) {
      const lastMessage = chatHistory[chatHistory.length - 1];

      // If the last message was from a character (not the user) and not a system message
      // and there are at least 2 characters in the room, trigger a possible interaction
      if (!lastMessage.isUser && !lastMessage.system &&
          chatRoom.characters.length >= 2 &&
          Math.random() > 0.7) { // 30% chance of character interaction
        triggerCharacterInteraction(lastMessage);
      }

      // Occasionally trigger environmental events (5% chance after each message)
      if (Math.random() < 0.05 && !lastMessage.system) {
        // Determine the scenario type from the story arc or fallback to theme
        const scenarioType = storyArc?.theme || chatRoom?.theme ||
                          (chatRoom?.openingPrompt?.toLowerCase().includes('adventure') ? 'adventure' :
                           chatRoom?.openingPrompt?.toLowerCase().includes('mystery') ? 'mystery' :
                           chatRoom?.openingPrompt?.toLowerCase().includes('fantasy') ? 'fantasy' :
                           chatRoom?.openingPrompt?.toLowerCase().includes('sci-fi') || chatRoom?.openingPrompt?.toLowerCase().includes('scifi') ? 'scifi' :
                           chatRoom?.openingPrompt?.toLowerCase().includes('horror') ? 'horror' : 'adventure');

        // Adjust event probability based on story arc phase
        let majorEventChance = 0.1; // Default 10% chance
        if (storyArc) {
          if (storyArc.currentPhase === 'climax') {
            majorEventChance = 0.3; // 30% chance during climax
          } else if (storyArc.currentPhase === 'planning') {
            majorEventChance = 0.05; // 5% chance during planning
          }
        }

        // Determine if it's a major event
        const isMajorEvent = Math.random() < majorEventChance;

        // Generate the environmental event
        const environmentalEvent = generateEnvironmentalEvent(chatHistory, chatRoom, scenarioType, isMajorEvent);

        // Add the event as a system message
        setTimeout(() => {
          setChatHistory(prev => [...prev, {
            id: Date.now() + Math.random(),
            message: environmentalEvent,
            system: true,
            isNarration: true,
            timestamp: new Date().toISOString()
          }]);

          // If it's a major event, have a character respond to it
          if (isMajorEvent && chatRoom.characters.length > 0) {
            // Choose a random character to respond
            const respondingCharacter = chatRoom.characters[Math.floor(Math.random() * chatRoom.characters.length)];

            // Generate character-specific writing instructions based on story arc
            const eventInstructions = storyArc ?
              generateWritingInstructions(storyArc, respondingCharacter) :
              writingInstructions;

            // Show typing indicator
            setIsTyping(true);
            setTypingCharacter(respondingCharacter);

            // Generate response after a delay
            setTimeout(() => {
              const response = `*${respondingCharacter.name} reacts to the sudden change*\n\n${generateCharacterResponse(
                respondingCharacter,
                environmentalEvent,
                chatHistory,
                eventInstructions,
                chatRoom,
                relationships
              )}`;

              setChatHistory(prev => [...prev, {
                id: Date.now() + Math.random(),
                speaker: respondingCharacter.name,
                character: respondingCharacter,
                message: response,
                isUser: false,
                timestamp: new Date().toISOString(),
                writingInstructions: eventInstructions
              }]);

              setIsTyping(false);
              setTypingCharacter(null);
            }, 1500);
          }
        }, 1000);
      }
    }
  }, [chatHistory, storyArc]);

  // Add click outside handler for character turn dropdown
  useEffect(() => {
    function handleClickOutside(event) {
      const dropdown = document.getElementById('character-turn-dropdown');
      if (dropdown && !dropdown.contains(event.target) &&
          !event.target.closest('button[data-character-turn-toggle]')) {
        dropdown.classList.add('hidden');
      }
    }

    // Add event listener
    document.addEventListener('mousedown', handleClickOutside);

    // Clean up
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const triggerCharacterInteraction = (lastMessage) => {
    // Find characters who haven't spoken recently (excluding the last speaker)
    const recentSpeakers = chatHistory
      .slice(Math.max(0, chatHistory.length - 3))
      .map(msg => msg.speaker);

    const availableCharacters = chatRoom.characters.filter(char =>
      char.name !== lastMessage.speaker &&
      !recentSpeakers.includes(char.name)
    );

    // If there are available characters, randomly select one to respond
    if (availableCharacters.length > 0) {
      const respondingCharacter = availableCharacters[Math.floor(Math.random() * availableCharacters.length)];

      // Show typing indicator for this specific character
      setIsTyping(true);
      setTypingCharacter(respondingCharacter);

      // Generate response with a delay to simulate thinking
      const typingDelay = 1000 + Math.floor(Math.random() * 2000); // 1-3 seconds

      setTimeout(() => {
        // Analyze the interaction to update relationship
        const analysis = analyzeInteraction(lastMessage.message);

        // Update relationship between the responding character and the last speaker
        setRelationships(prevRelationships => {
          const updatedRelationships = [...prevRelationships];
          const relationship = getRelationship(updatedRelationships, respondingCharacter.name, lastMessage.speaker);
          const updatedRelationship = updateRelationship(
            relationship,
            lastMessage.speaker,
            lastMessage.message,
            analysis.affinityChange,
            analysis.interactionType
          );

          // Replace the old relationship with the updated one
          const index = updatedRelationships.findIndex(rel =>
            rel.characters.includes(respondingCharacter.name) && rel.characters.includes(lastMessage.speaker)
          );

          if (index !== -1) {
            updatedRelationships[index] = updatedRelationship;
          }

          return updatedRelationships;
        });

        const response = generateCharacterInteraction(
          respondingCharacter,
          lastMessage.speaker,
          lastMessage.message,
          chatHistory,
          relationships
        );

        setChatHistory(prev => [...prev, {
          id: Date.now() + Math.random(),
          speaker: respondingCharacter.name,
          character: respondingCharacter,
          message: response,
          isUser: false,
          timestamp: new Date().toISOString()
        }]);

        setIsTyping(false);
        setTypingCharacter(null);
      }, typingDelay);
    }
  };

  // Function to handle message regeneration
  const handleRegenerateMessage = (messageId) => {
    const messageIndex = chatHistory.findIndex(msg => msg.id === messageId);
    if (messageIndex === -1) return;

    const message = chatHistory[messageIndex];
    if (message.isUser) return; // Can't regenerate user messages

    // Find the message this was responding to
    const previousMessages = chatHistory.slice(0, messageIndex);
    const lastUserMessage = [...previousMessages].reverse()
      .find(msg => msg.isUser || msg.speaker !== message.speaker);

    // Generate a new response
    const character = chatRoom.characters.find(char => char.name === message.speaker);
    if (!character) return;

    setIsTyping(true);
    setTypingCharacter(character);

    setTimeout(() => {
      // Generate character-specific writing instructions based on story arc
      let regenerateInstructions = {...writingInstructions};

      // If we have a story arc, use it to generate character-specific instructions
      if (storyArc) {
        regenerateInstructions = generateWritingInstructions(storyArc, character);

        // Preserve any user-defined writing instructions
        if (writingInstructions.writingStyle !== 'balanced') {
          regenerateInstructions.writingStyle = writingInstructions.writingStyle;
        }
        if (writingInstructions.responseLength !== 'medium') {
          regenerateInstructions.responseLength = writingInstructions.responseLength;
        }
        if (writingInstructions.characterReminders) {
          regenerateInstructions.characterReminders += "\n" + writingInstructions.characterReminders;
        }
        if (writingInstructions.generalNotes) {
          regenerateInstructions.generalNotes += "\n" + writingInstructions.generalNotes;
        }
      }

      const newResponse = lastUserMessage
        ? generateCharacterResponse(character, lastUserMessage.message, previousMessages, regenerateInstructions, chatRoom)
        : generateCharacterResponse(character, "Let's chat", previousMessages, regenerateInstructions, chatRoom);

      const updatedHistory = [...chatHistory];
      updatedHistory[messageIndex] = {
        ...message,
        message: newResponse,
        regenerated: true,
        writingInstructions: regenerateInstructions
      };

      setChatHistory(updatedHistory);
      setIsTyping(false);
      setTypingCharacter(null);
    }, 1000);
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
    if (!character) return;

    // Show typing indicator for this character
    setIsTyping(true);
    setTypingCharacter(character);

    // Calculate typing delay based on character's "thinking speed"
    const thinkingSpeed = character.thinkingSpeed || 1;
    const baseDelay = 1000 / thinkingSpeed;
    const messageLength = Math.max(20, Math.floor(Math.random() * 80)); // Simulate message length
    const typingDelay = baseDelay + (messageLength * 30);

    setTimeout(() => {
      try {
        // Generate character-specific writing instructions based on story arc
        let turnInstructions = {...writingInstructions};

        // If we have a story arc, use it to generate character-specific instructions
        if (storyArc) {
          turnInstructions = generateWritingInstructions(storyArc, character);

          // Preserve any user-defined writing instructions
          if (writingInstructions.writingStyle !== 'balanced') {
            turnInstructions.writingStyle = writingInstructions.writingStyle;
          }
          if (writingInstructions.responseLength !== 'medium') {
            turnInstructions.responseLength = writingInstructions.responseLength;
          }
          if (writingInstructions.characterReminders) {
            turnInstructions.characterReminders += "\n" + writingInstructions.characterReminders;
          }
          if (writingInstructions.generalNotes) {
            turnInstructions.generalNotes += "\n" + writingInstructions.generalNotes;
          }
        }

        // Generate the character's response with relationships and story arc context
        const response = generateCharacterResponse(
          character,
          "Continue the conversation",
          chatHistory,
          turnInstructions,
          chatRoom,
          relationships
        );

        // Add the response to chat history
        setChatHistory(prev => [...prev, {
          id: Date.now() + Math.random(),
          speaker: character.name,
          character: character,
          message: response,
          isUser: false,
          timestamp: new Date().toISOString(),
          writingInstructions: turnInstructions
        }]);

        // Randomly add an action after the message
        if (Math.random() > 0.7) { // 30% chance of including an action
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
                `*${character.name} adjusts posture*`
              ];

              // Add character-specific actions based on type
              if (character.type === 'fantasy') {
                actions.push(
                  `*${character.name} traces a mystical symbol in the air*`,
                  `*${character.name} adjusts their magical artifacts*`,
                  `*${character.name} whispers an ancient incantation*`
                );
              } else if (character.type === 'scifi') {
                actions.push(
                  `*${character.name} checks a holographic display*`,
                  `*${character.name} adjusts their tech gear*`,
                  `*${character.name} scans the environment with a device*`
                );
              }

              // Select a random action
              const action = actions[Math.floor(Math.random() * actions.length)];

              // Add the action to chat history
              setChatHistory(prev => [...prev, {
                id: Date.now() + Math.random(),
                speaker: character.name,
                character: character,
                message: action,
                isUser: false,
                isAction: true,
                timestamp: new Date().toISOString()
              }]);
            } catch (error) {
              console.error("Error generating character action:", error);
            }
          }, 1000 + Math.random() * 2000); // Add action 1-3 seconds after the message
        }
      } catch (error) {
        console.error("Error in character turn generation:", error);
      }

      setIsTyping(false);
      setTypingCharacter(null);
    }, typingDelay);
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

    let actionText = '';

    switch (actionType) {
      case 'smile':
        actionText = `*${activeCharacter.name} smiles warmly*`;
        break;
      case 'laugh':
        actionText = `*${activeCharacter.name} laughs heartily*`;
        break;
      case 'frown':
        actionText = `*${activeCharacter.name} frowns with concern*`;
        break;
      case 'nod':
        actionText = `*${activeCharacter.name} nods thoughtfully*`;
        break;
      case 'sigh':
        actionText = `*${activeCharacter.name} sighs deeply*`;
        break;
      case 'custom':
        setCurrentAction('custom');
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
      timestamp: new Date().toISOString()
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
      timestamp: new Date().toISOString()
    };

    setChatHistory([...chatHistory, actionMessage]);
    setCurrentAction('');
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
      timestamp: new Date().toISOString()
    };

    setChatHistory([...chatHistory, narrationMessage]);
    setNarrationText('');
    setShowNarrationInput(false);
  };

  // Handle writing instructions update
  const handleWritingInstructionsChange = (field, value) => {
    setWritingInstructions({
      ...writingInstructions,
      [field]: value
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

    // Determine the scenario type from the chatRoom
    const scenarioType = chatRoom?.theme ||
                        (chatRoom?.openingPrompt?.toLowerCase().includes('adventure') ? 'adventure' :
                         chatRoom?.openingPrompt?.toLowerCase().includes('mystery') ? 'mystery' :
                         chatRoom?.openingPrompt?.toLowerCase().includes('fantasy') ? 'fantasy' :
                         chatRoom?.openingPrompt?.toLowerCase().includes('sci-fi') || chatRoom?.openingPrompt?.toLowerCase().includes('scifi') ? 'scifi' :
                         chatRoom?.openingPrompt?.toLowerCase().includes('horror') ? 'horror' : 'adventure');

    // Generate story branches based on the current conversation context
    const branchOptions = generateStoryBranches(chatHistory, chatRoom, scenarioType);

    // Add an environmental event option (20% chance for major event)
    const isMajorEvent = Math.random() < 0.2;
    const environmentalEvent = generateEnvironmentalEvent(chatHistory, chatRoom, scenarioType, isMajorEvent);

    // Combine options, ensuring we have exactly 3
    let selectedOptions = [...branchOptions];

    // If we have more than 3 options, trim to 3
    if (selectedOptions.length > 3) {
      selectedOptions = selectedOptions.slice(0, 3);
    }

    // If we have fewer than 3 options, add the environmental event
    if (selectedOptions.length < 3) {
      selectedOptions.push(environmentalEvent);
    }

    // If we still have fewer than 3, add generic options
    const genericOptions = [
      "A moment of quiet reflection falls over the group.",
      "The conversation takes an unexpected turn.",
      "Someone changes the subject to a new topic."
    ];

    while (selectedOptions.length < 3) {
      const randomOption = genericOptions[Math.floor(Math.random() * genericOptions.length)];
      if (!selectedOptions.includes(randomOption)) {
        selectedOptions.push(randomOption);
      }
    }

    setNextOptions(selectedOptions);
    setShowNextOptions(true);
  };

  // Apply a "What happens next?" option
  const applyNextOption = (option) => {
    // Add the selected option as a narration
    const nextOptionMessage = {
      id: Date.now(),
      message: option,
      system: true,
      isNarration: true,
      timestamp: new Date().toISOString()
    };

    setChatHistory([...chatHistory, nextOptionMessage]);
    setShowNextOptions(false);

    // Trigger character responses to this new development
    if (autoRespond && chatRoom.characters.length > 0) {
      // Choose a random character to respond first
      const respondingCharacter = chatRoom.characters[Math.floor(Math.random() * chatRoom.characters.length)];

      setIsTyping(true);
      setTypingCharacter(respondingCharacter);

      setTimeout(() => {
        // Generate a response that acknowledges the new development
        const response = `*${respondingCharacter.name} reacts to the new development*\n\n${generateCharacterResponse(respondingCharacter, option, chatHistory, writingInstructions, chatRoom, relationships)}`;

        setChatHistory(prev => [...prev, {
          id: Date.now() + Math.random(),
          speaker: respondingCharacter.name,
          character: respondingCharacter,
          message: response,
          isUser: false,
          timestamp: new Date().toISOString()
        }]);

        setIsTyping(false);
        setTypingCharacter(null);
      }, 1500);
    }
  };

  // Apply custom "What happens next?" option
  const applyCustomNextOption = () => {
    if (!customNextOption.trim()) return;

    applyNextOption(customNextOption);
    setCustomNextOption('');
  };

  // Handle key press in the message input
  const handleKeyPress = (e) => {
    // Send message on Enter (without Shift)
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleSendMessage = () => {
    if (!message.trim() || !activeCharacter) return;

    // Check if message contains action markers (* at beginning and end)
    if (message.startsWith('*') && message.endsWith('*')) {
      // This is an action, not a regular message
      const actionMessage = {
        id: Date.now(),
        speaker: activeCharacter.name,
        character: activeCharacter,
        message: message,
        isUser: true,
        isAction: true,
        timestamp: new Date().toISOString()
      };

      setChatHistory([...chatHistory, actionMessage]);
      setMessage('');
      return;
    }

    // Add user message to chat
    const userMessage = {
      id: Date.now(),
      speaker: activeCharacter.name,
      character: activeCharacter,
      message: message,
      isUser: true,
      timestamp: new Date().toISOString()
    };

    setChatHistory([...chatHistory, userMessage]);
    setMessage('');

    if (!autoRespond) return;

    // Simulate other characters responding
    setIsTyping(true);

    // Determine which characters will respond (1-3 random characters)
    // When speaking as "Yourself", all characters can respond
    const otherCharacters = activeCharacter.name === "Yourself"
      ? chatRoom.characters
      : chatRoom.characters.filter(char => char.name !== activeCharacter.name);

    // If there are no other characters, don't try to generate responses
    if (otherCharacters.length === 0) {
      setIsTyping(false);
      return;
    }

    // Determine how many characters will respond (more likely to respond to longer messages)
    const responseChance = Math.min(0.8, 0.3 + (message.length / 100));
    const respondingCharacters = otherCharacters.filter(() => Math.random() < responseChance);

    // If no one wants to respond, pick at least one character
    const responders = respondingCharacters.length > 0
      ? respondingCharacters
      : [otherCharacters[Math.floor(Math.random() * otherCharacters.length)]];

    // Sort responders by personality - more talkative characters respond first
    responders.sort((a, b) => {
      const aTalkativeness = a.talkativeness || 5;
      const bTalkativeness = b.talkativeness || 5;
      return bTalkativeness - aTalkativeness;
    });

    // Generate responses with realistic typing delays
    let delay = 800; // Initial delay

    responders.forEach((character, index) => {
      // Calculate typing delay based on message length and character's "thinking speed"
      const thinkingSpeed = character.thinkingSpeed || 1;
      const baseDelay = 1000 / thinkingSpeed;
      const messageLength = Math.max(20, Math.floor(Math.random() * 80)); // Simulate message length
      const typingDelay = baseDelay + (messageLength * 30);

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
                setRelationships(prevRelationships => {
                  const updatedRelationships = [...prevRelationships];
                  const relationship = getRelationship(updatedRelationships, character.name, activeCharacter.name);
                  const updatedRelationship = updateRelationship(
                    relationship,
                    activeCharacter.name,
                    userMessage.message,
                    analysis.affinityChange,
                    analysis.interactionType
                  );

                  // Replace the old relationship with the updated one
                  const index = updatedRelationships.findIndex(rel =>
                    rel.characters.includes(character.name) && rel.characters.includes(activeCharacter.name)
                  );

                  if (index !== -1) {
                    updatedRelationships[index] = updatedRelationship;
                  }

                  return updatedRelationships;
                });

                // Update the character's mood based on the interaction
                setMoodStates(prevMoodStates => {
                  const updatedMoodStates = [...prevMoodStates];

                  // Get the current mood state
                  const currentMoodState = getMoodState(updatedMoodStates, character.name, character);

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
                  const index = updatedMoodStates.findIndex(state => state.characterId === character.name);

                  if (index !== -1) {
                    updatedMoodStates[index] = updatedMoodState;
                  }

                  // Check if we should announce the mood change
                  if (shouldAnnounceMoodChange(previousMoodState, updatedMoodState)) {
                    // Add a system message announcing the mood change
                    const moodChangeMessage = getMoodChangeDescription(previousMoodState, updatedMoodState);

                    setTimeout(() => {
                      setChatHistory(prev => [...prev, {
                        id: Date.now() + Math.random(),
                        message: moodChangeMessage,
                        system: true,
                        timestamp: new Date().toISOString()
                      }]);
                    }, 1000);
                  }

                  return updatedMoodStates;
                });
              }

              // Generate character-specific writing instructions based on story arc
              let responseInstructions = {...writingInstructions};

              // If we have a story arc, use it to generate character-specific instructions
              if (storyArc) {
                responseInstructions = generateWritingInstructions(storyArc, character);

                // Preserve any user-defined writing instructions
                if (writingInstructions.writingStyle !== 'balanced') {
                  responseInstructions.writingStyle = writingInstructions.writingStyle;
                }
                if (writingInstructions.responseLength !== 'medium') {
                  responseInstructions.responseLength = writingInstructions.responseLength;
                }
                if (writingInstructions.characterReminders) {
                  responseInstructions.characterReminders += "\n" + writingInstructions.characterReminders;
                }
                if (writingInstructions.generalNotes) {
                  responseInstructions.generalNotes += "\n" + writingInstructions.generalNotes;
                }
              }

              // Pass writing instructions, chatRoom, and relationships to the response generator
              response = generateCharacterResponse(
                character,
                userMessage.message,
                chatHistory,
                responseInstructions,
                chatRoom,
                relationships
              );
            } catch (error) {
              console.error("Error generating character response:", error);
              response = "I'm not sure how to respond to that. Let's try a different topic.";
            }

            // Add the response to chat history
            setChatHistory(prev => [...prev, {
              id: Date.now() + Math.random(),
              speaker: character.name,
              character: character,
              message: response,
              isUser: false,
              timestamp: new Date().toISOString(),
              replyTo: userMessage.id,
              writingInstructions: storyArc ? generateWritingInstructions(storyArc, character) : writingInstructions
            }]);

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
                    `*${character.name} adjusts posture*`
                  ];

                  // Add character-specific actions based on type
                  if (character.type === 'fantasy') {
                    actions.push(
                      `*${character.name} traces a mystical symbol in the air*`,
                      `*${character.name} adjusts their magical artifacts*`,
                      `*${character.name} whispers an ancient incantation*`
                    );
                  } else if (character.type === 'scifi') {
                    actions.push(
                      `*${character.name} checks a holographic display*`,
                      `*${character.name} adjusts their tech gear*`,
                      `*${character.name} scans the environment with a device*`
                    );
                  }

                  // Select a random action
                  const action = actions[Math.floor(Math.random() * actions.length)];

                  // Add the action to chat history
                  setChatHistory(prev => [...prev, {
                    id: Date.now() + Math.random(),
                    speaker: character.name,
                    character: character,
                    message: action,
                    isUser: false,
                    isAction: true,
                    timestamp: new Date().toISOString()
                  }]);
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

  // Get default avatar for a character
  const getCharacterAvatar = (character) => {
    if (!character) return null;

    // If character has an avatar property, use it
    if (character.avatar) return character.avatar;

    // Special case for "Yourself" character
    if (character.name === "Yourself") {
      return (
        <div className="bg-blue-600 rounded-full w-8 h-8 flex items-center justify-center text-white font-bold">
          YOU
        </div>
      );
    }

    // Otherwise generate a placeholder based on character type
    const typeColors = {
      fantasy: 'bg-purple-500',
      scifi: 'bg-blue-500',
      historical: 'bg-amber-500',
      modern: 'bg-green-500'
    };

    const bgColor = typeColors[character.type] || 'bg-gray-500';
    const initials = character.name.split(' ').map(n => n[0]).join('').toUpperCase();

    return (
      <div className={`${bgColor} rounded-full w-8 h-8 flex items-center justify-center text-white font-bold`}>
        {initials}
      </div>
    );
  };

  // Format timestamp
  const formatTime = (timestamp) => {
    if (!timestamp) return '';
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="flex flex-col h-screen">
      {/* Chat header */}
      <header className="border-b py-2 px-3 md:py-3 md:px-4">
        <div className="container mx-auto flex justify-between items-center">
          <div className="flex items-center gap-2">
            <button
              onClick={onLeaveChat}
              className="p-1.5 rounded-full hover:bg-secondary"
            >
              <ArrowLeft className="h-5 w-5" />
              <span className="sr-only">Leave Chat</span>
            </button>
            <h1 className="text-lg md:text-xl font-bold">{chatRoom?.name || 'Chat Room'}</h1>
          </div>
          <div className="flex gap-1 md:gap-2">
            <button
              onClick={onHowToUse}
              className="inline-flex items-center justify-center rounded-md p-1.5 text-sm font-medium hover:bg-secondary"
              title="How to Use Velora"
            >
              <HelpCircle className="h-4 w-4 md:h-5 md:w-5" />
            </button>
            <button
              onClick={() => setShowSettings(!showSettings)}
              className="inline-flex items-center justify-center rounded-md p-1.5 text-sm font-medium hover:bg-secondary"
              title="Chat Settings"
            >
              <Settings className="h-4 w-4 md:h-5 md:w-5" />
            </button>
            <button
              onClick={toggleAddCharacter}
              className="inline-flex items-center justify-center rounded-md p-1.5 text-sm font-medium hover:bg-secondary"
              title="Add Character"
            >
              <UserPlus className="h-4 w-4 md:h-5 md:w-5" />
            </button>
            <button
              onClick={onSaveChat}
              className="inline-flex items-center justify-center rounded-md p-1.5 text-sm font-medium hover:bg-secondary"
              title="Save Chat"
            >
              <Download className="h-4 w-4 md:h-5 md:w-5" />
            </button>
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
                <label className="block text-sm font-medium mb-1">Chat Background</label>
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
                        {storyArc.currentPhase.charAt(0).toUpperCase() + storyArc.currentPhase.slice(1)} Phase
                      </span>
                      <span className="text-xs font-medium bg-secondary/30 px-2 py-0.5 rounded-full">
                        {storyArc.theme.charAt(0).toUpperCase() + storyArc.theme.slice(1)}
                      </span>
                    </div>
                    <div className="text-xs text-muted-foreground">
                      Tension: {storyArc.currentTension.charAt(0).toUpperCase() + storyArc.currentTension.slice(1)}
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground italic">
                    {storyArc.currentContext}
                  </p>
                  {storyArc.currentGoal && (
                    <div className="mt-2 text-xs">
                      <span className="font-medium">Current Goal:</span> {storyArc.currentGoal}
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
                  onClick={() => setShowWritingInstructions(!showWritingInstructions)}
                  className="text-xs text-muted-foreground hover:text-foreground flex items-center"
                >
                  {showWritingInstructions ? 'Hide' : 'Show'}
                  <ChevronRight className={`h-4 w-4 ml-1 transition-transform ${showWritingInstructions ? 'rotate-90' : ''}`} />
                </button>
              </div>

              {showWritingInstructions && (
                <div className="bg-background/80 rounded-md p-4 border border-input">
                  <p className="text-sm text-muted-foreground mb-4">
                    These instructions help guide the AI in generating responses. They affect how characters respond and how the story develops.
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
                        onChange={(e) => handleWritingInstructionsChange('storyArc', e.target.value)}
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
                        onChange={(e) => handleWritingInstructionsChange('writingStyle', e.target.value)}
                        className="w-full px-3 py-2 rounded-md border border-input bg-background text-sm"
                      >
                        <option value="formal">Formal and Eloquent</option>
                        <option value="casual">Casual and Conversational</option>
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
                          onChange={(e) => handleWritingInstructionsChange('emojiUsage', e.target.value)}
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
                          onChange={(e) => handleWritingInstructionsChange('responseLength', e.target.value)}
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
                        onChange={(e) => handleWritingInstructionsChange('characterReminders', e.target.value)}
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
                        onChange={(e) => handleWritingInstructionsChange('generalNotes', e.target.value)}
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

      {/* Chat messages */}
      <div
        className="flex-1 overflow-y-auto py-3 px-1 sm:py-4 sm:px-2 md:py-5 md:px-0"
        style={chatBackground ? (
          chatBackground.startsWith('linear-gradient') ? {
            background: chatBackground
          } : {
            backgroundImage: `url(${chatBackground})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center'
          }
        ) : {}}
      >
        <div className="container mx-auto max-w-full sm:max-w-[95%] md:max-w-[90%] lg:max-w-[85%] xl:max-w-[80%] 2xl:max-w-[75%]">
          {/* Always show the opening prompt at the top */}
          {chatRoom?.openingPrompt && chatRoom.openingPrompt.trim() && (
            <div className="bg-background/80 backdrop-blur-sm rounded-lg p-3 md:p-4 mb-5 text-center border border-primary/30 shadow-md relative">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary/50 to-purple-500/50"></div>
              <h3 className="text-xs md:text-sm uppercase tracking-wider text-muted-foreground mb-1">Scenario</h3>
              <p className="text-base md:text-lg italic">{chatRoom.openingPrompt}</p>
            </div>
          )}

          {chatHistory.map((msg) => (
            <div
              key={msg.id}
              className={`mb-6 flex ${msg.isUser ? 'justify-end' : 'justify-start'}`}
            >
              {/* Avatar for non-user messages */}
              {!msg.isUser && (
                <div className="mr-3 flex-shrink-0 self-end">
                  {typeof getCharacterAvatar(msg.character) === 'string' ? (
                    <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-background shadow-sm">
                      <img
                        src={getCharacterAvatar(msg.character)}
                        alt={msg.speaker}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ) : (
                    getCharacterAvatar(msg.character)
                  )}
                </div>
              )}

              <div className="flex flex-col max-w-[90%] sm:max-w-[85%] md:max-w-[80%] lg:max-w-[75%]">
                {/* Speaker name for non-user messages */}
                {!msg.isUser && !msg.system && !msg.isNarration && (
                  <div className="text-xs font-medium text-muted-foreground mb-1 ml-1">
                    {msg.speaker}
                  </div>
                )}

                {/* Message bubble */}
                <div
                  className={`rounded-lg p-2.5 sm:p-3 md:p-4 ${
                    msg.isUser && !msg.isAction && msg.speaker !== "Yourself"
                      ? 'bg-primary text-primary-foreground rounded-br-none shadow-md'
                      : msg.isUser && !msg.isAction && msg.speaker === "Yourself"
                        ? 'bg-blue-500 text-white rounded-br-none shadow-md'
                      : !msg.isUser && !msg.isAction
                        ? 'bg-secondary/90 backdrop-blur-sm rounded-bl-none shadow-md'
                        : msg.isAction
                          ? 'bg-background/60 backdrop-blur-sm text-foreground italic'
                          : ''
                  } ${msg.system ? 'bg-background/80 backdrop-blur-sm text-center italic border border-muted shadow-sm w-full mx-auto' : ''}
                  ${msg.isNarration ? 'bg-secondary/50 backdrop-blur-sm text-center italic border border-secondary/50 font-medium shadow-sm w-full mx-auto' : ''}`}
                >
                  {/* Show speaker name for non-user messages and for "Yourself" messages */}
                  {(!msg.isUser || (msg.isUser && msg.speaker === "Yourself")) && !msg.system && !msg.isAction && (
                    <div className="font-bold mb-1 flex justify-between items-center">
                      <div className="flex items-center gap-1.5">
                        <span>{msg.speaker}</span>
                        {msg.character && (
                          <MoodIndicator
                            mood={getMoodState(moodStates, msg.speaker, msg.character)?.currentMood || msg.character.mood}
                            intensity={getMoodState(moodStates, msg.speaker, msg.character)?.intensity || 5}
                            size="sm"
                          />
                        )}
                      </div>
                      <span className="text-xs text-muted-foreground">{formatTime(msg.timestamp)}</span>
                    </div>
                  )}
                  <div className="whitespace-pre-wrap">{msg.message}</div>
                </div>

                {/* Message actions */}
                {!msg.system && (
                  <div className={`flex gap-2 mt-1 text-xs ${msg.isUser ? 'justify-end' : 'justify-start'}`}>
                    {!msg.isUser && (
                      <button
                        onClick={() => handleRegenerateMessage(msg.id)}
                        className="text-muted-foreground hover:text-foreground flex items-center gap-1"
                      >
                        <RefreshCw className="h-3 w-3" />
                        <span>Regenerate</span>
                      </button>
                    )}
                    <button
                      className="text-muted-foreground hover:text-foreground flex items-center gap-1"
                      onClick={() => setShowReactions(msg.id)}
                    >
                      <Smile className="h-3 w-3" />
                      <span>React</span>
                    </button>
                  </div>
                )}

                {/* Reactions panel */}
                {showReactions === msg.id && (
                  <div className="bg-background rounded-md p-2 mt-1 flex gap-2 border border-input">
                    {['👍', '❤️', '😂', '😮', '🤔', '😢', '👏'].map(emoji => (
                      <button
                        key={emoji}
                        className="hover:bg-secondary rounded-full w-8 h-8 flex items-center justify-center text-lg"
                        onClick={() => {
                          // Add reaction logic here
                          setShowReactions(false);
                        }}
                      >
                        {emoji}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Avatar for user messages */}
              {msg.isUser && (
                <div className="ml-3 flex-shrink-0 self-end">
                  {typeof getCharacterAvatar(msg.character) === 'string' ? (
                    <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-background shadow-sm">
                      <img
                        src={getCharacterAvatar(msg.character)}
                        alt={msg.speaker}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ) : (
                    getCharacterAvatar(msg.character)
                  )}
                </div>
              )}
            </div>
          ))}

          {/* Typing indicator */}
          {isTyping && (
            <div className="flex justify-start mb-6">
              {typingCharacter && (
                <div className="mr-3 flex-shrink-0 self-end">
                  {typeof getCharacterAvatar(typingCharacter) === 'string' ? (
                    <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-background shadow-sm">
                      <img
                        src={getCharacterAvatar(typingCharacter)}
                        alt={typingCharacter.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ) : (
                    getCharacterAvatar(typingCharacter)
                  )}
                </div>
              )}
              <div className="flex flex-col max-w-[90%] sm:max-w-[85%] md:max-w-[80%] lg:max-w-[75%]">
                {typingCharacter && (
                  <div className="text-xs font-medium text-muted-foreground mb-1 ml-1">
                    {typingCharacter.name}
                  </div>
                )}
                <div className="bg-secondary/90 backdrop-blur-sm rounded-lg rounded-bl-none p-2.5 sm:p-3 md:p-4 shadow-md">
                  <div className="flex gap-2">
                    <span className="animate-bounce text-lg">•</span>
                    <span className="animate-bounce text-lg" style={{ animationDelay: '0.2s' }}>•</span>
                    <span className="animate-bounce text-lg" style={{ animationDelay: '0.4s' }}>•</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>
      </div>

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
                      const filtered = characterLibrary.filter(char =>
                        !chatRoom.characters.some(c => c.name === char.name) &&
                        (char.name.toLowerCase().includes(searchTerm) ||
                         char.description.toLowerCase().includes(searchTerm))
                      );
                      setAvailableCharacters(filtered);
                    } else {
                      const existingCharacterNames = chatRoom.characters.map(char => char.name);
                      const filtered = characterLibrary.filter(
                        char => !existingCharacterNames.includes(char.name)
                      );
                      setAvailableCharacters(filtered);
                    }
                  }}
                />
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {availableCharacters.map(character => (
                  <div
                    key={character.name}
                    onClick={() => handleSelectCharacter(character)}
                    className={`p-3 rounded-lg border cursor-pointer transition-all ${
                      selectedNewCharacter?.name === character.name
                        ? 'border-primary bg-primary/10'
                        : 'border-border hover:border-primary/50'
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
                          <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                            character.type === 'fantasy' ? 'bg-purple-500' :
                            character.type === 'scifi' ? 'bg-blue-500' :
                            character.type === 'historical' ? 'bg-amber-500' :
                            'bg-green-500'
                          } text-white font-bold`}>
                            {character.name.split(' ').map(n => n[0]).join('').toUpperCase()}
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
                        <p className="text-sm text-muted-foreground line-clamp-2">{character.description}</p>
                        <div className="flex justify-between items-center mt-1">
                          <span className="text-xs px-2 py-0.5 bg-secondary rounded-full">{character.mood}</span>
                          <span className="text-xs text-muted-foreground">{character.type}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="p-4 border-t flex justify-end">
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
                    ? 'bg-primary text-primary-foreground hover:bg-primary/90'
                    : 'bg-primary/50 text-primary-foreground/50 cursor-not-allowed'
                }`}
              >
                Add to Chat
              </button>
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
                  <span className="font-medium text-foreground">{activeCharacter.name}</span> is ready
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
              className={`inline-flex items-center justify-center rounded-full px-2 py-1 text-xs ${showWritingInstructions ? 'bg-primary/20 text-primary' : 'bg-secondary/10 hover:bg-secondary/20 text-muted-foreground'} transition-colors`}
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
                  onClick={() => handleCharacterAction('smile')}
                  className="px-3 py-1 text-sm rounded-full bg-secondary hover:bg-secondary/80"
                >
                  Smile
                </button>
                <button
                  onClick={() => handleCharacterAction('laugh')}
                  className="px-3 py-1 text-sm rounded-full bg-secondary hover:bg-secondary/80"
                >
                  Laugh
                </button>
                <button
                  onClick={() => handleCharacterAction('frown')}
                  className="px-3 py-1 text-sm rounded-full bg-secondary hover:bg-secondary/80"
                >
                  Frown
                </button>
                <button
                  onClick={() => handleCharacterAction('nod')}
                  className="px-3 py-1 text-sm rounded-full bg-secondary hover:bg-secondary/80"
                >
                  Nod
                </button>
                <button
                  onClick={() => handleCharacterAction('sigh')}
                  className="px-3 py-1 text-sm rounded-full bg-secondary hover:bg-secondary/80"
                >
                  Sigh
                </button>
                <button
                  onClick={() => handleCharacterAction('custom')}
                  className="px-3 py-1 text-sm rounded-full bg-primary/20 hover:bg-primary/30"
                >
                  Custom Action...
                </button>
              </div>

              {currentAction === 'custom' && (
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={currentAction === 'custom' ? '' : currentAction}
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
                  <label className="block text-xs font-medium mb-1">Story Arc / Theme</label>
                  <input
                    type="text"
                    value={writingInstructions.storyArc}
                    onChange={(e) => handleWritingInstructionsChange('storyArc', e.target.value)}
                    placeholder="e.g., 'Mystery with a twist ending' or 'Romantic comedy'"
                    className="w-full px-3 py-2 text-sm rounded-md border border-input bg-background"
                  />
                </div>

                {/* Writing Style */}
                <div>
                  <label className="block text-xs font-medium mb-1">Writing Style</label>
                  <select
                    value={writingInstructions.writingStyle}
                    onChange={(e) => handleWritingInstructionsChange('writingStyle', e.target.value)}
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
                  <label className="block text-xs font-medium mb-1">Response Length</label>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleWritingInstructionsChange('responseLength', 'short')}
                      className={`flex-1 px-3 py-1 text-sm rounded-md border ${
                        writingInstructions.responseLength === 'short'
                          ? 'bg-primary text-primary-foreground'
                          : 'bg-background'
                      }`}
                    >
                      Short
                    </button>
                    <button
                      onClick={() => handleWritingInstructionsChange('responseLength', 'medium')}
                      className={`flex-1 px-3 py-1 text-sm rounded-md border ${
                        writingInstructions.responseLength === 'medium'
                          ? 'bg-primary text-primary-foreground'
                          : 'bg-background'
                      }`}
                    >
                      Medium
                    </button>
                    <button
                      onClick={() => handleWritingInstructionsChange('responseLength', 'long')}
                      className={`flex-1 px-3 py-1 text-sm rounded-md border ${
                        writingInstructions.responseLength === 'long'
                          ? 'bg-primary text-primary-foreground'
                          : 'bg-background'
                      }`}
                    >
                      Long
                    </button>
                  </div>
                </div>

                {/* Character Reminders */}
                <div>
                  <label className="block text-xs font-medium mb-1">Character Reminders</label>
                  <textarea
                    value={writingInstructions.characterReminders}
                    onChange={(e) => handleWritingInstructionsChange('characterReminders', e.target.value)}
                    placeholder="e.g., 'Remember that Nova is hiding a secret' or 'Thaddeus should mention his time machine'"
                    className="w-full px-3 py-2 text-sm rounded-md border border-input bg-background min-h-[60px]"
                    rows={2}
                  />
                </div>

                {/* General Notes */}
                <div>
                  <label className="block text-xs font-medium mb-1">General Notes</label>
                  <textarea
                    value={writingInstructions.generalNotes}
                    onChange={(e) => handleWritingInstructionsChange('generalNotes', e.target.value)}
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
                These instructions will guide how AI characters respond in the conversation.
              </div>
            </div>
          )}

          {/* What happens next options (conditionally rendered) */}
          {showNextOptions && (
            <div className="mb-4 p-3 border rounded-md bg-background/80">
              <h3 className="text-sm font-medium mb-2 flex items-center">
                <Lightbulb className="h-4 w-4 mr-1 text-amber-500" />
                What happens next?
              </h3>
              <div className="space-y-2 mb-3">
                {nextOptions.map((option, index) => (
                  <button
                    key={index}
                    onClick={() => applyNextOption(option)}
                    className="w-full text-left p-2 rounded-md border border-input hover:bg-secondary/30 flex items-center"
                  >
                    <ChevronRight className="h-4 w-4 mr-2 text-primary" />
                    <span>{option}</span>
                  </button>
                ))}
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
                These suggestions will be added as narration and characters will respond to them.
              </div>
            </div>
          )}

          {/* Instagram-style input area */}
          <div className="flex items-center gap-2 mt-2">
            {/* Character selector button - now as an avatar button */}
            <div className="relative">
              <button
                onClick={() => {
                  const dropdown = document.getElementById('character-select-dropdown');
                  dropdown.classList.toggle('hidden');
                }}
                className="flex-shrink-0 relative group"
                title={activeCharacter ? `Speaking as ${activeCharacter.name}` : 'Select character'}
              >
                <div className={`w-9 h-9 rounded-full overflow-hidden border-2 ${activeCharacter ? 'border-primary' : 'border-muted'} flex-shrink-0 transition-all group-hover:border-primary/80`}>
                  {activeCharacter ? (
                    typeof getCharacterAvatar(activeCharacter) === 'string' ? (
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
                      <User className="h-5 w-5 text-muted-foreground" />
                    </div>
                  )}
                </div>
                <div className="absolute -top-1 -right-1 w-4 h-4 bg-primary rounded-full flex items-center justify-center text-[10px] text-white font-bold">
                  +
                </div>
              </button>

              <div id="character-select-dropdown" className="absolute left-0 bottom-full mb-2 w-[220px] bg-background border border-input rounded-lg shadow-lg z-10 hidden">
                <div className="p-2 max-h-[300px] overflow-y-auto">
                  <h4 className="text-xs font-medium text-muted-foreground px-2 py-1 mb-1">Speak as...</h4>

                  <button
                    onClick={() => {
                      setActiveCharacter(yourselfCharacter);
                      document.getElementById('character-select-dropdown').classList.add('hidden');
                    }}
                    className="w-full flex items-center gap-2 px-3 py-2 text-left hover:bg-accent rounded-md text-sm"
                  >
                    <User className="h-5 w-5 flex-shrink-0" />
                    <span className="font-medium">Yourself</span>
                  </button>

                  <div className="h-px bg-border my-1.5"></div>
                  <h4 className="text-xs font-medium text-muted-foreground px-2 py-1 mb-1">Characters</h4>

                  <div className="grid grid-cols-2 gap-1">
                    {chatRoom?.characters.map(char => (
                      <button
                        key={char.name}
                        onClick={() => {
                          setActiveCharacter(char);
                          document.getElementById('character-select-dropdown').classList.add('hidden');
                        }}
                        className={`flex flex-col items-center gap-1 p-2 text-center hover:bg-accent rounded-md text-xs ${activeCharacter?.name === char.name ? 'bg-primary/10 border border-primary/30' : ''}`}
                      >
                        {typeof getCharacterAvatar(char) === 'string' ? (
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
                        <div className="flex items-center gap-1.5 w-full">
                          <span className="truncate font-medium">{char.name}</span>
                          <MoodIndicator
                            mood={getMoodState(moodStates, char.name, char)?.currentMood || char.mood}
                            intensity={getMoodState(moodStates, char.name, char)?.intensity || 5}
                            size="sm"
                          />
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Main message input - Instagram style */}
            <div className="flex-1 flex items-center bg-secondary/20 rounded-full border border-transparent focus-within:border-primary/30 focus-within:bg-background transition-all">
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyDown={handleKeyPress}
                placeholder={activeCharacter
                  ? `Message as ${activeCharacter.name}...`
                  : "Select a character to start messaging..."}
                className="flex-1 min-h-[40px] max-h-[120px] px-4 py-2 bg-transparent border-none resize-none focus:outline-none text-sm"
                style={{ overflow: 'auto' }}
              />

              {/* Quick action buttons inside input area */}
              <div className="flex items-center pr-2 gap-1">
                <button
                  onClick={toggleActionMenu}
                  className="p-1.5 rounded-full hover:bg-secondary/50 text-muted-foreground transition-colors"
                  title="Character actions"
                >
                  <Sparkles className="h-4 w-4" />
                </button>

                <button
                  onClick={toggleNarrationInput}
                  className="p-1.5 rounded-full hover:bg-secondary/50 text-muted-foreground transition-colors"
                  title="Add narration"
                >
                  <BookOpen className="h-4 w-4" />
                </button>

                {/* Character Turn Button - Skip your turn and let a character speak */}
                <div className="relative">
                  <button
                    className="p-1.5 rounded-full hover:bg-secondary/50 text-muted-foreground transition-colors"
                    onClick={() => {
                      // Show character selection dropdown
                      const dropdown = document.getElementById('character-turn-dropdown');
                      if (dropdown) {
                        dropdown.classList.toggle('hidden');
                      }
                    }}
                    title="Let AI character speak"
                  >
                    <Zap className="h-4 w-4" />
                  </button>

                  {/* Character selection dropdown */}
                  <div
                    id="character-turn-dropdown"
                    className="absolute bottom-full right-0 mb-2 bg-background/95 backdrop-blur-sm border border-input rounded-md shadow-lg p-1.5 hidden z-10 min-w-[180px]"
                  >
                    <h4 className="text-xs font-medium text-muted-foreground px-2 py-1">Choose character to speak</h4>
                    <div className="h-px bg-border my-1"></div>
                    {chatRoom?.characters.map(char => (
                      <button
                        key={`turn-${char.name}`}
                        className="w-full text-left px-2.5 py-2 text-xs rounded-md hover:bg-secondary/30 flex items-center gap-2 transition-colors"
                        onClick={() => {
                          // Hide dropdown
                          const dropdown = document.getElementById('character-turn-dropdown');
                          if (dropdown) {
                            dropdown.classList.add('hidden');
                          }

                          // Make the character speak
                          handleCharacterTurn(char);
                        }}
                      >
                        {typeof getCharacterAvatar(char) === 'string' ? (
                          <div className="w-6 h-6 rounded-full overflow-hidden border border-background flex-shrink-0 shadow-sm">
                            <img
                              src={getCharacterAvatar(char)}
                              alt={char.name}
                              className="w-full h-full object-cover"
                            />
                          </div>
                        ) : (
                          <div className="w-6 h-6 flex-shrink-0">
                            {getCharacterAvatar(char)}
                          </div>
                        )}
                        <span className="truncate font-medium">{char.name}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {message.trim() && activeCharacter ? (
                  <button
                    onClick={handleSendMessage}
                    className="p-1.5 rounded-full bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
                  >
                    <Send className="h-4 w-4" />
                  </button>
                ) : (
                  <button
                    onClick={generateNextOptions}
                    className="p-1.5 rounded-full hover:bg-secondary/50 text-muted-foreground transition-colors"
                    title="What happens next?"
                  >
                    <Lightbulb className="h-4 w-4" />
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Tips and scene transition */}
          <div className="flex justify-between items-center mt-1">
            <div className="text-xs text-muted-foreground">
              Tip: Use <span className="font-medium">*asterisks*</span> for actions
            </div>

            <button
              className="inline-flex items-center justify-center rounded-full px-2 py-1 text-xs hover:bg-secondary/20 text-muted-foreground transition-colors"
              onClick={() => {
                // Add a random scene transition
                const transitions = [
                  "The sun begins to set, casting long shadows across the room.",
                  "A cool breeze blows through the open window, changing the mood.",
                  "The atmosphere shifts as time passes...",
                  "The conversation pauses briefly as everyone reflects on what's been said.",
                  "The lighting changes subtly, highlighting different aspects of the scene."
                ];
                const transition = transitions[Math.floor(Math.random() * transitions.length)];

                setChatHistory([...chatHistory, {
                  id: Date.now(),
                  message: transition,
                  system: true,
                  isNarration: true,
                  timestamp: new Date().toISOString()
                }]);
              }}
              title="Add scene transition"
            >
              <Sparkles className="h-3.5 w-3.5 mr-1" />
              <span>Scene Transition</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatRoom;


