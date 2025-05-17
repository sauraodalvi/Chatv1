import { useState, useEffect } from "react";
import LandingPage from "./components/LandingPage";
import CharacterSelection from "./components/CharacterSelection";
import ChatRoom from "./components/ChatRoom";
import CustomScenario from "./components/CustomScenario";
import QuickScenarioSelector from "./components/QuickScenarioSelector";
import ScenarioSelectionStep from "./components/ScenarioSelectionStep";
import Onboarding from "./components/Onboarding";
import HowToUse from "./components/HowToUse";

import { ThemeProvider } from "./components/ThemeProvider";
import {
  initializeStoryArc,
  generateWritingInstructions,
  getScenarioData,
} from "./utils/storyArcUtils";

function App() {
  // Check if it's the first visit
  const [currentPage, setCurrentPage] = useState(() => {
    const hasVisitedBefore = localStorage.getItem("velora-visited");
    return hasVisitedBefore ? "landing" : "onboarding";
  });
  const [selectedCharacters, setSelectedCharacters] = useState([]);
  const [chatRoom, setChatRoom] = useState(null);
  const [chatHistory, setChatHistory] = useState([]);
  const [storyArc, setStoryArc] = useState(null);

  // Navigation functions
  const navigateTo = (page) => {
    setCurrentPage(page);
  };

  // Start a chat with selected characters
  const startChat = (
    roomName,
    characters,
    openingPrompt = "",
    background = "",
    theme = ""
  ) => {
    console.log("startChat called with:", {
      roomName,
      charactersCount: characters?.length || 0,
      openingPrompt,
      background,
      theme,
    });

    // If no opening prompt is provided, generate a default one based on the room name
    const finalPrompt =
      openingPrompt && openingPrompt.trim()
        ? openingPrompt
        : `Welcome to "${roomName}". The scene is set and the characters are ready to interact. What happens next is up to you...`;

    // Create the chat room object
    const newChatRoom = {
      name: roomName || "Chat Room",
      characters: characters,
      openingPrompt: finalPrompt,
      background: background,
      theme: theme,
      createdAt: new Date().toISOString(),
    };

    console.log("Setting chatRoom:", newChatRoom);
    setChatRoom(newChatRoom);

    // Initialize the story arc
    const initialStoryArc = initializeStoryArc(roomName, finalPrompt, theme);
    console.log("Setting storyArc:", initialStoryArc);
    setStoryArc(initialStoryArc);

    // Initialize chat with a system message indicating the start of the conversation
    // and a first action message if it's the Avengers scenario
    const initialMessages = [
      {
        id: Date.now(),
        system: true,
        isNarration: true,
        message: "The conversation begins...",
        timestamp: new Date().toISOString(),
      },
    ];

    // Get scenario data to check for initial messages
    const scenarioData = getScenarioData(roomName, theme);

    console.log("Starting chat with scenario:", roomName);
    console.log(
      "Characters:",
      characters.map((c) => c.name)
    );

    // If we have scenario data with initial messages, add them
    if (
      scenarioData &&
      scenarioData.initialMessages &&
      scenarioData.initialMessages.length > 0
    ) {
      console.log(
        "Found scenario data with initial messages:",
        scenarioData.initialMessages.length
      );

      // Add a narration that sets the scene if provided
      if (scenarioData.initialNarration) {
        initialMessages.push({
          id: Date.now() + 1,
          system: true,
          isNarration: true,
          message: scenarioData.initialNarration,
          timestamp: new Date(new Date().getTime() + 500).toISOString(),
        });
      }

      // Add character messages/actions from the scenario data
      scenarioData.initialMessages.forEach((msgData, index) => {
        console.log(`Processing initial message from ${msgData.speaker}`);

        // Find the character - ensure we're using a clean copy to avoid reference issues
        const characterIndex = characters.findIndex(
          (char) => char.name === msgData.speaker
        );

        if (characterIndex !== -1) {
          console.log(
            `Found character ${msgData.speaker} at index ${characterIndex}`
          );
          const character = { ...characters[characterIndex] };

          // Sanitize any template placeholders in the message
          let sanitizedMessage = msgData.message;
          if (sanitizedMessage.includes("}")) {
            sanitizedMessage = sanitizedMessage.replace(/\{[^}]*\}/g, "");
          }

          // Generate appropriate writing instructions
          const instructions = generateWritingInstructions(
            initialStoryArc,
            character
          );

          initialMessages.push({
            id: Date.now() + index + 2,
            speaker: character.name,
            character: character,
            message: sanitizedMessage,
            isUser: false,
            isAction: msgData.isAction || false,
            timestamp: new Date(
              new Date().getTime() + 1000 * (index + 1)
            ).toISOString(),
            writingInstructions: instructions,
          });
        } else {
          console.warn(
            `Character ${msgData.speaker} not found in characters array!`
          );
          console.log(
            "Available characters:",
            characters.map((c) => c.name)
          );
        }
      });
    } else if (characters.length > 0) {
      // If no scenario-specific messages but we have characters, add a greeting from the first character
      const firstCharacter = characters[0];
      const greeting =
        firstCharacter.opening_line ||
        `Hello! I'm ${firstCharacter.name}. How can I help you today?`;

      // Generate appropriate writing instructions
      const instructions = generateWritingInstructions(
        initialStoryArc,
        firstCharacter
      );

      initialMessages.push({
        id: Date.now() + 1,
        speaker: firstCharacter.name,
        character: firstCharacter,
        message: greeting,
        isUser: false,
        timestamp: new Date(new Date().getTime() + 1000).toISOString(),
        writingInstructions: instructions,
      });
    }

    setChatHistory(initialMessages);
    navigateTo("chat");
  };

  // Load a saved chat
  const loadChat = (savedChat) => {
    const chatRoomData = {
      name: savedChat.room_name,
      characters: savedChat.characters,
      background: savedChat.background || "",
      theme: savedChat.theme || "",
      openingPrompt: savedChat.opening_prompt || "",
      createdAt: savedChat.created_at || new Date().toISOString(),
    };

    setChatRoom(chatRoomData);

    // Ensure all messages have required properties
    const processedHistory = savedChat.chat_history.map((msg) => ({
      ...msg,
      id: msg.id || Date.now() + Math.random(),
      timestamp: msg.timestamp || new Date().toISOString(),
      character:
        msg.character ||
        (msg.speaker
          ? savedChat.characters.find((c) => c.name === msg.speaker)
          : null),
    }));

    setChatHistory(processedHistory);

    // Initialize or load story arc
    if (savedChat.story_arc) {
      setStoryArc(savedChat.story_arc);
    } else {
      // Create a new story arc if none exists in the saved chat
      const newStoryArc = initializeStoryArc(
        chatRoomData.name,
        chatRoomData.openingPrompt,
        chatRoomData.theme
      );
      setStoryArc(newStoryArc);
    }

    navigateTo("chat");
  };

  // Save current chat
  const saveChat = () => {
    const chatData = {
      room_name: chatRoom.name,
      characters: chatRoom.characters,
      chat_history: chatHistory,
      background: chatRoom.background || "",
      theme: chatRoom.theme || "",
      opening_prompt: chatRoom.openingPrompt || "",
      created_at: chatRoom.createdAt || new Date().toISOString(),
      updated_at: new Date().toISOString(),
      story_arc:
        storyArc ||
        initializeStoryArc(
          chatRoom.name,
          chatRoom.openingPrompt,
          chatRoom.theme
        ),
      version: "1.2.0", // Updated version to reflect story arc addition
    };

    // Create a blob and download it
    const blob = new Blob([JSON.stringify(chatData, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `velora-chat-${chatRoom.name
      .replace(/\s+/g, "-")
      .toLowerCase()}-${new Date().toISOString().split("T")[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    return true;
  };

  // Mark as visited when navigating away from onboarding
  useEffect(() => {
    if (currentPage !== "onboarding") {
      localStorage.setItem("velora-visited", "true");
    }
  }, [currentPage]);

  return (
    <ThemeProvider defaultTheme="dark" storageKey="velora-theme">
      <div className="min-h-screen bg-background">
        {currentPage === "onboarding" && (
          <Onboarding
            onComplete={(selectedChars) => {
              if (selectedChars && selectedChars.length > 0) {
                setSelectedCharacters(selectedChars);
                startChat("Character Chat", selectedChars);
              } else {
                navigateTo("landing");
              }
            }}
            onSelectCharacter={() => navigateTo("character-selection")}
            onCreateScenario={() => navigateTo("custom-scenario")}
            onQuickStart={() => navigateTo("quick-scenario")}
          />
        )}

        {currentPage === "landing" && (
          <LandingPage
            onSelectCharacter={() => navigateTo("character-selection")}
            onCreateScenario={() => navigateTo("custom-scenario")}
            onQuickStart={() => navigateTo("quick-scenario")}
            onUploadChat={(savedChat) => loadChat(savedChat)}
            onHowToUse={() => navigateTo("how-to-use")}
            onStartChat={(name, characters, prompt, background, theme) =>
              startChat(name, characters, prompt, background, theme)
            }
          />
        )}

        {currentPage === "how-to-use" && (
          <HowToUse onBack={() => navigateTo("landing")} />
        )}

        {currentPage === "character-selection" && (
          <CharacterSelection
            selectedCharacters={selectedCharacters}
            setSelectedCharacters={setSelectedCharacters}
            onStartChat={() => navigateTo("scenario-selection")}
            onBack={() => navigateTo("landing")}
          />
        )}

        {currentPage === "scenario-selection" && (
          <ScenarioSelectionStep
            selectedCharacters={selectedCharacters}
            onBack={() => navigateTo("character-selection")}
            onContinue={(scenario) =>
              startChat(
                scenario.title,
                scenario.characters,
                scenario.prompt,
                scenario.background
              )
            }
          />
        )}

        {currentPage === "chat" && (
          <ChatRoom
            chatRoom={chatRoom}
            chatHistory={chatHistory}
            setChatHistory={setChatHistory}
            storyArc={storyArc}
            setStoryArc={setStoryArc}
            onSaveChat={saveChat}
            onLeaveChat={() => navigateTo("landing")}
            onHowToUse={() => navigateTo("how-to-use")}
          />
        )}

        {currentPage === "custom-scenario" && (
          <CustomScenario
            onCreateRoom={(
              name,
              characters,
              prompt,
              videoUrl,
              background,
              theme
            ) => startChat(name, characters, prompt, background, theme)}
            onBack={() => navigateTo("landing")}
          />
        )}

        {currentPage === "quick-scenario" && (
          <QuickScenarioSelector
            onStartChat={(
              name,
              characters,
              prompt,
              videoUrl,
              background,
              theme
            ) => startChat(name, characters, prompt, background, theme)}
            onBack={() => navigateTo("landing")}
          />
        )}
      </div>
    </ThemeProvider>
  );
}

export default App;
