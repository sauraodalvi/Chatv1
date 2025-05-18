import { useState, useEffect } from "react";
import {
  ArrowLeft,
  Plus,
  Video,
  X,
  Sparkles,
  Wand2,
  Info,
  Eye,
  Settings,
  User,
  ChevronRight,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { characterLibrary } from "../data/characters";
import { generateThemeFromVideo } from "../utils/videoUtils";
import ScenarioGenerator from "./ScenarioGenerator";
import { generateCharacterFromKeywords } from "../utils/aiGenerationUtils";
import {
  isDescriptionTooShort,
  generateScenarioSuggestions,
  generateGuidingQuestions,
} from "../utils/scenarioEnhancementUtils";
import ScenarioEnhancementSuggestions from "./ScenarioEnhancementSuggestions";
import CharacterDetailsCard from "./CharacterDetailsCard";
import ScenarioDetailsPanel from "./ScenarioDetailsPanel";
import ScenarioPreview from "./ScenarioPreview";

const CustomScenario = ({ onCreateRoom, onBack }) => {
  const [roomName, setRoomName] = useState("");
  const [selectedCharacters, setSelectedCharacters] = useState([]);
  const [openingPrompt, setOpeningPrompt] = useState("");
  const [videoUrl, setVideoUrl] = useState("");
  const [themeSuggestion, setThemeSuggestion] = useState("");
  const [isCharacterModalOpen, setIsCharacterModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [creationMode, setCreationMode] = useState("manual"); // 'manual' or 'ai'
  const [isGeneratingCharacter, setIsGeneratingCharacter] = useState(false);
  const [characterKeywords, setCharacterKeywords] = useState("");
  const [backgroundImage, setBackgroundImage] = useState("");

  // Scenario enhancement state
  const [showEnhancementSuggestions, setShowEnhancementSuggestions] =
    useState(false);
  const [enhancementSuggestions, setEnhancementSuggestions] = useState([]);
  const [guidingQuestions, setGuidingQuestions] = useState([]);
  const [dismissedSuggestions, setDismissedSuggestions] = useState(false);

  // Character details state
  const [selectedCharacterForDetails, setSelectedCharacterForDetails] =
    useState(null);

  // Scenario details state
  const [showScenarioDetails, setShowScenarioDetails] = useState(false);

  // Preview state
  const [showPreview, setShowPreview] = useState(false);

  const handleGenerateTheme = async () => {
    if (!videoUrl) return;

    // Show loading state
    setThemeSuggestion("Generating theme...");

    try {
      const theme = await generateThemeFromVideo(videoUrl);
      setThemeSuggestion(theme);
      setOpeningPrompt(theme.prompt || openingPrompt);
    } catch (error) {
      setThemeSuggestion(
        "Could not generate theme. Please try a different video URL."
      );
      console.error("Error generating theme:", error);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Validate that we have at least 2 characters
    if (selectedCharacters.length < 2) {
      alert(
        "At least 2 characters are required for meaningful conversations. Please add more characters."
      );
      return;
    }

    if (roomName && selectedCharacters.length >= 2) {
      onCreateRoom(
        roomName,
        selectedCharacters,
        openingPrompt,
        videoUrl,
        backgroundImage
      );
    }
  };

  const handleGenerateCharacter = () => {
    if (!characterKeywords.trim()) return;

    setIsGeneratingCharacter(true);

    // Simulate API delay
    setTimeout(() => {
      const character = generateCharacterFromKeywords(characterKeywords);
      setSelectedCharacters([...selectedCharacters, character]);
      setCharacterKeywords("");
      setIsGeneratingCharacter(false);
    }, 1000);
  };

  const removeCharacter = (characterName) => {
    setSelectedCharacters(
      selectedCharacters.filter((char) => char.name !== characterName)
    );
  };

  const filteredCharacters = characterLibrary.filter(
    (char) =>
      char.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
      !selectedCharacters.some((selected) => selected.name === char.name)
  );

  // Handle applying a suggestion to the opening prompt
  const handleApplySuggestion = (suggestion) => {
    // If the opening prompt is empty, just set it to the suggestion
    if (!openingPrompt.trim()) {
      setOpeningPrompt(suggestion);
      return;
    }

    // Otherwise, append the suggestion to the existing prompt
    setOpeningPrompt((prev) => {
      // Check if the prompt ends with punctuation
      const endsWithPunctuation = /[.!?]$/.test(prev.trim());
      // Add appropriate spacing and punctuation
      return `${prev.trim()}${endsWithPunctuation ? " " : ". "}${suggestion}`;
    });
  };

  // Handle updating a character
  const handleUpdateCharacter = (updatedCharacter) => {
    setSelectedCharacters((prev) =>
      prev.map((char) =>
        char.name === updatedCharacter.name ? updatedCharacter : char
      )
    );
    setSelectedCharacterForDetails(null);
  };

  // Handle updating scenario details
  const handleUpdateScenarioDetails = (updatedDescription) => {
    setOpeningPrompt(updatedDescription);
    // Don't automatically hide the panel to allow for multiple edits
  };

  // Toggle character details panel
  const toggleCharacterDetails = (character) => {
    if (
      selectedCharacterForDetails &&
      selectedCharacterForDetails.name === character.name
    ) {
      setSelectedCharacterForDetails(null);
    } else {
      setSelectedCharacterForDetails(character);
    }
  };

  // Check for short descriptions and generate suggestions
  useEffect(() => {
    // Only show suggestions if:
    // 1. We have at least 2 characters selected
    // 2. The description is too short
    // 3. The user hasn't dismissed the suggestions
    if (
      selectedCharacters.length >= 2 &&
      isDescriptionTooShort(openingPrompt) &&
      !dismissedSuggestions
    ) {
      // Generate suggestions based on the current description and characters
      const suggestions = generateScenarioSuggestions(
        openingPrompt,
        selectedCharacters
      );
      const questions = generateGuidingQuestions(
        openingPrompt,
        selectedCharacters
      );

      setEnhancementSuggestions(suggestions);
      setGuidingQuestions(questions);
      setShowEnhancementSuggestions(
        suggestions.length > 0 || questions.length > 0
      );
    } else {
      setShowEnhancementSuggestions(false);
    }
  }, [openingPrompt, selectedCharacters, dismissedSuggestions]);

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="flex items-center mb-8">
        <button
          onClick={onBack}
          className="mr-4 p-2 rounded-full hover:bg-secondary"
        >
          <ArrowLeft className="h-5 w-5" />
          <span className="sr-only">Back</span>
        </button>
        <h1 className="text-3xl font-bold">Create Custom Scenario</h1>
      </div>

      {/* Creation Mode Tabs */}
      <div className="flex border-b mb-8">
        <button
          onClick={() => setCreationMode("manual")}
          className={`px-4 py-2 font-medium ${
            creationMode === "manual"
              ? "border-b-2 border-primary text-primary"
              : "text-muted-foreground"
          }`}
        >
          Manual Creation
        </button>
        <button
          onClick={() => setCreationMode("ai")}
          className={`px-4 py-2 font-medium flex items-center ${
            creationMode === "ai"
              ? "border-b-2 border-primary text-primary"
              : "text-muted-foreground"
          }`}
        >
          <Sparkles className="h-4 w-4 mr-2" />
          AI Generation
        </button>
      </div>

      {creationMode === "ai" ? (
        <ScenarioGenerator onCreateScenario={onCreateRoom} />
      ) : (
        <form onSubmit={handleSubmit} className="max-w-2xl mx-auto">
          <div className="space-y-6">
            {/* Room Name */}
            <div>
              <label
                htmlFor="room-name"
                className="block text-sm font-medium mb-2"
              >
                Room Name
              </label>
              <input
                id="room-name"
                type="text"
                value={roomName}
                onChange={(e) => setRoomName(e.target.value)}
                required
                placeholder="Enter a name for your chat room"
                className="w-full px-3 py-2 rounded-md border border-input bg-background"
              />
            </div>

            {/* Selected Characters */}
            <div>
              <label className="block text-sm font-medium mb-2">
                Characters
              </label>

              <div
                className={`p-3 mb-4 border rounded-md ${
                  selectedCharacters.length === 0
                    ? "border-muted-foreground/20 bg-secondary/10"
                    : selectedCharacters.length === 1
                    ? "border-red-500/30 bg-red-500/5"
                    : "border-primary/20 bg-primary/5"
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <h3 className="text-sm font-medium">
                      Selected Characters ({selectedCharacters.length})
                    </h3>
                    {selectedCharacters.length === 1 && (
                      <span className="text-xs text-red-500 px-2 py-0.5 bg-red-500/10 rounded-full">
                        Need 1 more
                      </span>
                    )}
                    {selectedCharacters.length >= 2 && (
                      <span className="text-xs text-green-600 px-2 py-0.5 bg-green-500/10 rounded-full">
                        Ready
                      </span>
                    )}
                  </div>
                </div>

                {selectedCharacters.length === 0 ? (
                  <p className="text-muted-foreground text-sm">
                    No characters selected. Add at least 2 characters to create
                    a meaningful conversation.
                  </p>
                ) : (
                  <div className="flex flex-wrap gap-2">
                    {selectedCharacters.map((char) => (
                      <div
                        key={char.name}
                        className="bg-secondary rounded-full px-3 py-1 text-sm flex items-center gap-1 cursor-pointer hover:bg-secondary/80 transition-colors group"
                        onClick={() => toggleCharacterDetails(char)}
                      >
                        {char.avatar ? (
                          <img
                            src={char.avatar}
                            alt={char.name}
                            className="w-5 h-5 rounded-full object-cover mr-1"
                            onError={(e) => {
                              e.target.onerror = null;
                              e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(
                                char.name
                              )}&background=random`;
                            }}
                          />
                        ) : (
                          <div className="w-5 h-5 rounded-full bg-primary/20 flex items-center justify-center mr-1">
                            <span className="text-xs font-bold">
                              {char.name.charAt(0)}
                            </span>
                          </div>
                        )}
                        {char.name}
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            removeCharacter(char.name);
                          }}
                          className="ml-1 hover:text-destructive"
                        >
                          <X className="h-3 w-3" />
                        </button>
                        <Info className="h-3 w-3 ml-1 text-primary opacity-0 group-hover:opacity-100 transition-opacity" />
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="flex flex-col sm:flex-row gap-2">
                <button
                  type="button"
                  onClick={() => setIsCharacterModalOpen(true)}
                  className="inline-flex items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium shadow-sm hover:bg-accent hover:text-accent-foreground"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Existing Character
                </button>

                <div className="flex-1 flex gap-2">
                  <input
                    type="text"
                    value={characterKeywords}
                    onChange={(e) => setCharacterKeywords(e.target.value)}
                    placeholder="Generate character from keywords..."
                    className="flex-1 px-3 py-2 rounded-md border border-input bg-background"
                  />
                  <button
                    type="button"
                    onClick={handleGenerateCharacter}
                    disabled={
                      !characterKeywords.trim() || isGeneratingCharacter
                    }
                    className="inline-flex items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium shadow-sm hover:bg-accent hover:text-accent-foreground disabled:opacity-50"
                  >
                    {isGeneratingCharacter ? (
                      <span className="animate-pulse">Generating...</span>
                    ) : (
                      <>
                        <Wand2 className="h-4 w-4 mr-2" />
                        Generate
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>

            {/* Opening Prompt */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label
                  htmlFor="opening-prompt"
                  className="block text-sm font-medium"
                >
                  Opening Prompt
                </label>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setShowScenarioDetails(!showScenarioDetails)}
                    className="text-xs flex items-center gap-1 text-primary hover:text-primary/80 p-1 rounded-full hover:bg-primary/10"
                    title="Edit scenario details"
                  >
                    <Settings className="h-3.5 w-3.5" />
                    <span>Details</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowPreview(!showPreview)}
                    className="text-xs flex items-center gap-1 text-primary hover:text-primary/80 p-1 rounded-full hover:bg-primary/10"
                    title="Preview scenario"
                  >
                    <Eye className="h-3.5 w-3.5" />
                    <span>Preview</span>
                  </button>
                </div>
              </div>

              <textarea
                id="opening-prompt"
                value={openingPrompt}
                onChange={(e) => setOpeningPrompt(e.target.value)}
                placeholder="Set the scene for your characters... Describe the setting, atmosphere, and relationships between characters."
                className="w-full px-3 py-2 rounded-md border border-input bg-background min-h-[100px]"
              />

              {/* Scenario Enhancement Suggestions */}
              {showEnhancementSuggestions && (
                <ScenarioEnhancementSuggestions
                  suggestions={enhancementSuggestions}
                  guidingQuestions={guidingQuestions}
                  onApplySuggestion={handleApplySuggestion}
                  onClose={() => setDismissedSuggestions(true)}
                />
              )}

              {/* Scenario Details Panel */}
              {showScenarioDetails && (
                <div className="mt-3">
                  <ScenarioDetailsPanel
                    scenarioDescription={openingPrompt}
                    characters={selectedCharacters}
                    onUpdate={handleUpdateScenarioDetails}
                  />
                </div>
              )}

              {/* Scenario Preview */}
              {showPreview && (
                <div className="mt-3">
                  <ScenarioPreview
                    scenarioDescription={openingPrompt}
                    characters={selectedCharacters}
                    backgroundImage={backgroundImage}
                  />
                </div>
              )}
            </div>

            {/* Video URL */}
            <div>
              <label
                htmlFor="video-url"
                className="block text-sm font-medium mb-2"
              >
                Video URL (Optional)
              </label>
              <div className="flex gap-2">
                <input
                  id="video-url"
                  type="url"
                  value={videoUrl}
                  onChange={(e) => setVideoUrl(e.target.value)}
                  placeholder="Paste a video link to theme your chat"
                  className="flex-1 px-3 py-2 rounded-md border border-input bg-background"
                />
                <button
                  type="button"
                  onClick={handleGenerateTheme}
                  disabled={!videoUrl}
                  className="inline-flex items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium shadow-sm hover:bg-accent hover:text-accent-foreground disabled:opacity-50"
                >
                  <Video className="h-4 w-4 mr-2" />
                  Generate Theme
                </button>
              </div>

              {themeSuggestion && (
                <div className="mt-2 p-3 bg-secondary/50 rounded-md text-sm">
                  <p className="font-medium mb-1">Theme Suggestion:</p>
                  <p>{themeSuggestion}</p>
                </div>
              )}
            </div>

            {/* Background Image */}
            <div>
              <label
                htmlFor="background-image"
                className="block text-sm font-medium mb-2"
              >
                Background Image URL (Optional)
              </label>
              <input
                id="background-image"
                type="url"
                value={backgroundImage}
                onChange={(e) => setBackgroundImage(e.target.value)}
                placeholder="Enter URL for chat background image"
                className="w-full px-3 py-2 rounded-md border border-input bg-background"
              />

              {backgroundImage && (
                <div className="mt-2">
                  <img
                    src={backgroundImage}
                    alt="Chat background preview"
                    className="w-full h-32 object-cover rounded-md"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src =
                        "https://placehold.co/600x400?text=Invalid+Image+URL";
                    }}
                  />
                </div>
              )}
            </div>

            {/* Submit Button */}
            <div className="flex justify-end gap-4 pt-4">
              <button
                type="button"
                onClick={onBack}
                className="inline-flex items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium shadow-sm hover:bg-accent hover:text-accent-foreground"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={!roomName || selectedCharacters.length < 2}
                className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow hover:bg-primary/90 disabled:opacity-50"
              >
                Create Chat Room
              </button>
            </div>
          </div>
        </form>
      )}

      {/* Character Details Card */}
      {selectedCharacterForDetails && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="max-w-md w-full">
            <CharacterDetailsCard
              character={selectedCharacterForDetails}
              onUpdate={handleUpdateCharacter}
              onClose={() => setSelectedCharacterForDetails(null)}
            />
          </div>
        </div>
      )}

      {/* Character Selection Modal */}
      {isCharacterModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-background rounded-lg shadow-lg max-w-2xl w-full p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold">Select Characters</h2>
              <button
                onClick={() => setIsCharacterModalOpen(false)}
                className="p-1 rounded-full hover:bg-secondary"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="mb-4">
              <input
                type="text"
                placeholder="Search characters..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-3 py-2 rounded-md border border-input bg-background"
              />
            </div>

            <div className="max-h-[60vh] overflow-y-auto">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {filteredCharacters.map((character) => (
                  <div
                    key={character.name}
                    onClick={() => {
                      setSelectedCharacters([...selectedCharacters, character]);
                      setIsCharacterModalOpen(false);
                    }}
                    className="p-4 rounded-lg border border-border hover:border-primary/50 cursor-pointer transition-all hover:bg-secondary/10"
                  >
                    <div className="flex items-center gap-3 mb-2">
                      {character.avatar ? (
                        <img
                          src={character.avatar}
                          alt={character.name}
                          className="w-12 h-12 rounded-full object-cover"
                        />
                      ) : (
                        <div
                          className={`bg-${
                            character.type === "fantasy"
                              ? "purple"
                              : character.type === "scifi"
                              ? "blue"
                              : character.type === "historical"
                              ? "amber"
                              : "green"
                          }-500 w-12 h-12 rounded-full flex items-center justify-center text-white font-bold`}
                        >
                          {character.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")
                            .toUpperCase()}
                        </div>
                      )}
                      <div>
                        <h3 className="font-bold">{character.name}</h3>
                        <div className="flex items-center gap-2">
                          <span className="text-xs px-2 py-0.5 bg-secondary rounded-full">
                            {character.mood}
                          </span>
                          <span className="text-xs text-muted-foreground">
                            {character.type}
                          </span>
                        </div>
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground mb-2">
                      {character.description}
                    </p>
                    {character.opening_line && (
                      <p className="text-xs italic border-l-2 border-primary/30 pl-2 mt-2">
                        "{character.opening_line}"
                      </p>
                    )}
                  </div>
                ))}
              </div>

              {filteredCharacters.length === 0 && (
                <p className="text-center py-4 text-muted-foreground">
                  No characters found. Try a different search term.
                </p>
              )}
            </div>

            <div className="flex justify-end mt-4">
              <button
                onClick={() => setIsCharacterModalOpen(false)}
                className="inline-flex items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium shadow-sm hover:bg-accent hover:text-accent-foreground"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CustomScenario;
