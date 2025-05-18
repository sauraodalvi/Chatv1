import { useState, useEffect } from "react";
import {
  ArrowLeft,
  Check,
  Search,
  Grid,
  List,
  Sparkles,
  Filter,
  X,
  UserPlus,
  Edit,
  Wand2,
} from "lucide-react";
import { characterLibrary } from "../data/characters";
import { generateCharacterFromDescription } from "../utils/aiGenerationUtils";

const CharacterSelection = ({
  selectedCharacters,
  setSelectedCharacters,
  onStartChat,
  onBack,
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filter, setFilter] = useState("all");
  const [characters, setCharacters] = useState([]);
  const [viewMode, setViewMode] = useState("grid"); // 'grid' or 'list'
  const [showFilters, setShowFilters] = useState(false);
  const [activeTab, setActiveTab] = useState("popular"); // 'popular' or 'custom'
  const [characterDescription, setCharacterDescription] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
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

  useEffect(() => {
    // Filter characters based on search term and type filter
    let filteredCharacters = [...characterLibrary];

    if (searchTerm) {
      filteredCharacters = filteredCharacters.filter(
        (char) =>
          char.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          char.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (filter !== "all") {
      filteredCharacters = filteredCharacters.filter(
        (char) => char.type.toLowerCase() === filter.toLowerCase()
      );
    }

    setCharacters(filteredCharacters);
  }, [searchTerm, filter]);

  const toggleCharacterSelection = (character) => {
    if (selectedCharacters.some((char) => char.name === character.name)) {
      setSelectedCharacters(
        selectedCharacters.filter((char) => char.name !== character.name)
      );
    } else {
      setSelectedCharacters([...selectedCharacters, character]);
    }
  };

  const selectRandomCharacters = () => {
    // Select 2-4 random characters
    const numToSelect = Math.floor(Math.random() * 3) + 2; // 2-4 characters
    const shuffled = [...characterLibrary].sort(() => 0.5 - Math.random());
    setSelectedCharacters(shuffled.slice(0, numToSelect));
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

    // Add the character to the selected characters
    setSelectedCharacters([...selectedCharacters, newCharacter]);

    // Reset form
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
    setCharacterDescription("");

    // Switch back to popular tab
    setActiveTab("popular");
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
          <h1 className="text-2xl font-bold">Select Characters</h1>
        </div>

        {/* View mode toggle */}
        <div className="flex items-center gap-1 border rounded-md overflow-hidden">
          <button
            onClick={() => setViewMode("grid")}
            className={`p-2 ${
              viewMode === "grid"
                ? "bg-primary text-primary-foreground"
                : "hover:bg-secondary"
            }`}
            title="Grid view"
          >
            <Grid className="h-4 w-4" />
          </button>
          <button
            onClick={() => setViewMode("list")}
            className={`p-2 ${
              viewMode === "list"
                ? "bg-primary text-primary-foreground"
                : "hover:bg-secondary"
            }`}
            title="List view"
          >
            <List className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Tabs for Popular/Custom */}
      <div className="flex border-b mb-4">
        <button
          onClick={() => setActiveTab("popular")}
          className={`px-4 py-2 text-sm font-medium flex items-center ${
            activeTab === "popular"
              ? "border-b-2 border-primary text-primary"
              : "text-muted-foreground"
          }`}
        >
          <Sparkles className="h-4 w-4 mr-2" />
          Popular Characters
        </button>
        <button
          onClick={() => setActiveTab("custom")}
          className={`px-4 py-2 text-sm font-medium flex items-center ${
            activeTab === "custom"
              ? "border-b-2 border-primary text-primary"
              : "text-muted-foreground"
          }`}
        >
          <UserPlus className="h-4 w-4 mr-2" />
          Custom Character
        </button>
      </div>

      {activeTab === "popular" && (
        <>
          {/* Search and filter controls */}
          <div className="flex items-center gap-2 mb-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search characters..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 rounded-md border border-input bg-background"
              />
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm("")}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>

            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`p-2 rounded-md border ${
                showFilters ? "border-primary bg-primary/10" : "border-input"
              }`}
              title="Show filters"
            >
              <Filter className="h-4 w-4" />
            </button>

            <button
              onClick={selectRandomCharacters}
              className="p-2 rounded-md border border-input hover:bg-secondary"
              title="Random selection"
            >
              <Sparkles className="h-4 w-4" />
            </button>
          </div>

          {/* Expanded filters */}
          {showFilters && (
            <div className="mb-4 p-3 border rounded-md bg-background/50">
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => setFilter("all")}
                  className={`px-3 py-1 text-xs rounded-full ${
                    filter === "all"
                      ? "bg-primary text-primary-foreground"
                      : "bg-secondary/50 hover:bg-secondary"
                  }`}
                >
                  All Types
                </button>
                <button
                  onClick={() => setFilter("fantasy")}
                  className={`px-3 py-1 text-xs rounded-full ${
                    filter === "fantasy"
                      ? "bg-purple-500 text-white"
                      : "bg-purple-500/10 hover:bg-purple-500/20"
                  }`}
                >
                  Fantasy
                </button>
                <button
                  onClick={() => setFilter("scifi")}
                  className={`px-3 py-1 text-xs rounded-full ${
                    filter === "scifi"
                      ? "bg-blue-500 text-white"
                      : "bg-blue-500/10 hover:bg-blue-500/20"
                  }`}
                >
                  Sci-Fi
                </button>
                <button
                  onClick={() => setFilter("historical")}
                  className={`px-3 py-1 text-xs rounded-full ${
                    filter === "historical"
                      ? "bg-amber-500 text-white"
                      : "bg-amber-500/10 hover:bg-amber-500/20"
                  }`}
                >
                  Historical
                </button>
                <button
                  onClick={() => setFilter("modern")}
                  className={`px-3 py-1 text-xs rounded-full ${
                    filter === "modern"
                      ? "bg-green-500 text-white"
                      : "bg-green-500/10 hover:bg-green-500/20"
                  }`}
                >
                  Modern
                </button>
                <button
                  onClick={() => setFilter("romance")}
                  className={`px-3 py-1 text-xs rounded-full ${
                    filter === "romance"
                      ? "bg-pink-500 text-white"
                      : "bg-pink-500/10 hover:bg-pink-500/20"
                  }`}
                >
                  Romance
                </button>
                <button
                  onClick={() => setFilter("adventure")}
                  className={`px-3 py-1 text-xs rounded-full ${
                    filter === "adventure"
                      ? "bg-orange-500 text-white"
                      : "bg-orange-500/10 hover:bg-orange-500/20"
                  }`}
                >
                  Adventure
                </button>
              </div>
            </div>
          )}
        </>
      )}

      {/* Selected characters summary */}
      <div
        className={`mb-4 p-3 border rounded-md ${
          selectedCharacters.length === 0
            ? "border-muted-foreground/20 bg-secondary/10"
            : selectedCharacters.length === 1
            ? "border-red-500/30 bg-red-500/5"
            : "border-primary/20 bg-primary/5"
        }`}
      >
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <h2 className="text-sm font-medium">
              Selected Characters ({selectedCharacters.length})
            </h2>
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
          {selectedCharacters.length > 0 && (
            <button
              onClick={() => setSelectedCharacters([])}
              className="text-xs text-muted-foreground hover:text-foreground"
              title="Clear all"
            >
              Clear all
            </button>
          )}
        </div>

        {selectedCharacters.length === 0 ? (
          <div className="text-sm text-muted-foreground flex items-center gap-2">
            <span>
              Select at least 2 characters to create a meaningful conversation
            </span>
          </div>
        ) : (
          <div className="flex flex-wrap gap-1.5">
            {selectedCharacters.map((char) => (
              <div
                key={char.name}
                className="bg-primary/10 border border-primary/20 text-primary px-2 py-0.5 rounded-md text-xs flex items-center gap-1"
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
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleCharacterSelection(char);
                  }}
                  className="ml-1 hover:text-red-500"
                >
                  <X className="h-3 w-3" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {activeTab === "popular" && (
        /* Character grid/list view */
        <div
          className={
            viewMode === "grid"
              ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6"
              : "space-y-3 mb-6"
          }
        >
          {characters.map((character) => (
            <div
              key={character.name}
              onClick={() => toggleCharacterSelection(character)}
              className={`rounded-lg border overflow-hidden cursor-pointer transition-all hover:shadow-md ${
                selectedCharacters.some((char) => char.name === character.name)
                  ? "border-primary shadow-md"
                  : "border-border hover:border-primary/50"
              } ${viewMode === "list" ? "flex" : ""}`}
            >
              {/* Character avatar/header - smaller in list mode */}
              <div
                className={`relative ${
                  viewMode === "grid" ? "h-32" : "h-24 w-24 flex-shrink-0"
                } bg-gradient-to-r from-secondary/50 to-primary/30 flex items-center justify-center overflow-hidden`}
              >
                {character.avatar ? (
                  <img
                    src={character.avatar}
                    alt={character.name}
                    className="w-full h-full object-cover transition-transform hover:scale-105"
                  />
                ) : (
                  <div
                    className={`${
                      viewMode === "grid" ? "w-16 h-16" : "w-12 h-12"
                    } rounded-full flex items-center justify-center ${
                      character.type === "fantasy"
                        ? "bg-purple-500"
                        : character.type === "scifi"
                        ? "bg-blue-500"
                        : character.type === "historical"
                        ? "bg-amber-500"
                        : character.type === "romance"
                        ? "bg-pink-500"
                        : character.type === "adventure"
                        ? "bg-orange-500"
                        : "bg-green-500"
                    } text-white text-xl font-bold`}
                  >
                    {character.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </div>
                )}

                {/* Overlay gradient */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>

                {/* Selection indicator */}
                {selectedCharacters.some(
                  (char) => char.name === character.name
                ) && (
                  <div className="absolute top-2 right-2 bg-primary text-primary-foreground p-1 rounded-full shadow-md z-10">
                    <Check className="h-3 w-3" />
                  </div>
                )}

                {/* Character type badge */}
                <div className="absolute top-2 left-2 z-10">
                  <span
                    className={`text-xs px-1.5 py-0.5 rounded-full text-white shadow-sm ${
                      character.type === "fantasy"
                        ? "bg-purple-500"
                        : character.type === "scifi"
                        ? "bg-blue-500"
                        : character.type === "historical"
                        ? "bg-amber-500"
                        : character.type === "romance"
                        ? "bg-pink-500"
                        : character.type === "adventure"
                        ? "bg-orange-500"
                        : "bg-green-500"
                    }`}
                  >
                    {character.type}
                  </span>
                </div>

                {/* Character name overlay - only in grid mode */}
                {viewMode === "grid" && (
                  <div className="absolute bottom-0 left-0 right-0 p-2 z-10">
                    <h3 className="font-medium text-sm text-white drop-shadow-md">
                      {character.name}
                    </h3>
                  </div>
                )}
              </div>

              {/* Character info - more compact */}
              <div className={`p-3 ${viewMode === "list" ? "flex-1" : ""}`}>
                {/* Name in list mode */}
                {viewMode === "list" && (
                  <h3 className="font-medium text-sm mb-1">{character.name}</h3>
                )}

                {/* Mood badge - inline in list mode */}
                {viewMode === "list" && (
                  <div className="mb-1.5">
                    <span className="text-xs px-1.5 py-0.5 bg-secondary/50 rounded-full">
                      {character.mood}
                    </span>
                  </div>
                )}

                {/* Description - shorter */}
                <p className="text-xs text-muted-foreground mb-2 line-clamp-2">
                  {character.description}
                </p>

                {/* Top personality traits - only show top 3 */}
                {character.personality && (
                  <div className="flex flex-wrap gap-1 mb-2">
                    {Object.entries(character.personality)
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
                )}

                {/* Compact stats */}
                <div className="flex items-center gap-3 text-xs text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <span>Talk:</span>
                    <div className="w-10 h-1.5 bg-secondary/30 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-primary/60 rounded-full"
                        style={{
                          width: `${(character.talkativeness / 10) * 100}%`,
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
                          width: `${(character.thinkingSpeed / 2) * 100}%`,
                        }}
                      ></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {activeTab === "custom" && (
        <div className="max-w-3xl mx-auto mb-6">
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
                  Describe your character in a few words, and we'll create a
                  complete profile with personality, background, and more.
                </p>
                <div className="flex flex-col gap-3">
                  <div className="flex gap-2">
                    <textarea
                      value={characterDescription}
                      onChange={(e) => setCharacterDescription(e.target.value)}
                      placeholder="Examples: A sarcastic hacker fighting corporate corruption | A wise old wizard with amnesia | A cheerful alien trying to understand humans"
                      className="flex-1 px-3 py-2 rounded-md border border-input bg-background text-sm"
                      rows={3}
                    />
                    <button
                      type="button"
                      onClick={handleGenerateCharacter}
                      disabled={!characterDescription.trim() || isGenerating}
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
                  {customCharacter.name && customCharacter.description && (
                    <div className="mt-2 p-3 bg-background rounded-md border border-input">
                      <div className="flex items-center gap-2 mb-2">
                        <div
                          className={`w-10 h-10 rounded-full flex items-center justify-center ${
                            customCharacter.type === "fantasy"
                              ? "bg-purple-500"
                              : customCharacter.type === "scifi"
                              ? "bg-blue-500"
                              : customCharacter.type === "historical"
                              ? "bg-amber-500"
                              : customCharacter.type === "romance"
                              ? "bg-pink-500"
                              : customCharacter.type === "adventure"
                              ? "bg-orange-500"
                              : "bg-green-500"
                          } text-white text-lg font-bold`}
                        >
                          {customCharacter.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </div>
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
                                  : customCharacter.type === "historical"
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
                                  (customCharacter.talkativeness / 10) * 100
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
                                  (customCharacter.thinkingSpeed / 2) * 100
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
                  <label className="block text-sm font-medium mb-1">Name</label>
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
                  <label className="block text-sm font-medium mb-1">Type</label>
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
                    handleCustomCharacterChange("description", e.target.value)
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
                      handleCustomCharacterChange("avatar", e.target.value)
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
                    handleCustomCharacterChange("opening_line", e.target.value)
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
                    handleCustomCharacterChange("voiceStyle", e.target.value)
                  }
                  placeholder="e.g., Formal and eloquent, Casual with slang, Technical jargon"
                  className="w-full px-3 py-2 rounded-md border border-input bg-background"
                />
              </div>

              {/* Personality Traits */}
              <div>
                <h3 className="text-sm font-medium mb-2">Personality Traits</h3>
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
                    <label className="text-xs font-medium">Talkativeness</label>
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

              {/* Submit button */}
              <div className="mt-6">
                <button
                  type="submit"
                  disabled={
                    !customCharacter.name ||
                    !customCharacter.description ||
                    !customCharacter.mood
                  }
                  className={`w-full px-4 py-2 rounded-md ${
                    customCharacter.name &&
                    customCharacter.description &&
                    customCharacter.mood
                      ? "bg-primary text-primary-foreground hover:bg-primary/90"
                      : "bg-primary/50 text-primary-foreground/50 cursor-not-allowed"
                  }`}
                >
                  Create & Add to Selection
                </button>
              </div>
            </div>
          </form>
        </div>
      )}

      {/* Action buttons - fixed at bottom */}
      <div className="sticky bottom-0 left-0 right-0 bg-background/95 backdrop-blur-sm border-t p-3 flex justify-end gap-3">
        <div className="flex-1 flex items-center">
          {selectedCharacters.length > 0 ? (
            <span className="text-sm">
              <span
                className={`font-medium ${
                  selectedCharacters.length < 2 ? "text-red-500" : ""
                }`}
              >
                {selectedCharacters.length}
              </span>{" "}
              character{selectedCharacters.length !== 1 ? "s" : ""} selected
              {selectedCharacters.length < 2 && (
                <span className="text-red-500 ml-2">
                  At least 2 characters required for meaningful conversations
                </span>
              )}
            </span>
          ) : (
            <span className="text-sm text-muted-foreground">
              Select at least 2 characters to begin
            </span>
          )}
        </div>
        <button
          onClick={onStartChat}
          disabled={selectedCharacters.length < 2}
          className={`inline-flex items-center justify-center rounded-md px-4 py-2 text-sm font-medium shadow transition-colors ${
            selectedCharacters.length < 2
              ? "bg-primary/50 text-primary-foreground/50 cursor-not-allowed"
              : "bg-primary text-primary-foreground hover:bg-primary/90"
          }`}
        >
          Start Chat
        </button>
      </div>
    </div>
  );
};

export default CharacterSelection;
