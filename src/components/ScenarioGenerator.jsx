import { useState } from 'react';
import { generateScenarioFromKeywords, generateCharactersForScenario, generateCharacterFromKeywords } from '../utils/aiGenerationUtils';
import { Wand2, Loader2, Plus, X, RefreshCw, UserPlus, Edit, Check } from 'lucide-react';
import { characterLibrary } from '../data/characters';

const ScenarioGenerator = ({ onCreateScenario }) => {
  const [keywords, setKeywords] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedScenario, setGeneratedScenario] = useState(null);
  const [generatedCharacters, setGeneratedCharacters] = useState([]);
  const [selectedCharacters, setSelectedCharacters] = useState([]);
  const [isCharacterModalOpen, setIsCharacterModalOpen] = useState(false);
  const [isCustomCharacterModalOpen, setIsCustomCharacterModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [customCharacterKeywords, setCustomCharacterKeywords] = useState('');
  const [isGeneratingCustom, setIsGeneratingCustom] = useState(false);

  // Custom character form state
  const [customCharacter, setCustomCharacter] = useState({
    name: '',
    description: '',
    mood: '',
    opening_line: '',
    type: 'modern',
    avatar: ''
  });

  const handleGenerate = () => {
    if (!keywords.trim()) return;

    setIsGenerating(true);

    // Simulate API delay
    setTimeout(() => {
      const scenario = generateScenarioFromKeywords(keywords);
      const characters = generateCharactersForScenario(keywords, 3);

      setGeneratedScenario(scenario);
      setGeneratedCharacters(characters);
      // Auto-select the generated characters
      setSelectedCharacters(characters);
      setIsGenerating(false);
    }, 1500);
  };

  const handleCreateChat = () => {
    if (generatedScenario && selectedCharacters.length > 0) {
      onCreateScenario(
        generatedScenario.title,
        selectedCharacters,
        generatedScenario.prompt,
        '',
        generatedScenario.background
      );
    }
  };

  // Toggle character selection
  const toggleCharacterSelection = (character) => {
    if (selectedCharacters.some(c => c.name === character.name)) {
      setSelectedCharacters(selectedCharacters.filter(c => c.name !== character.name));
    } else {
      setSelectedCharacters([...selectedCharacters, character]);
    }
  };

  // Generate a custom character from keywords
  const handleGenerateCustomCharacter = () => {
    if (!customCharacterKeywords.trim()) return;

    setIsGeneratingCustom(true);

    // Simulate API delay
    setTimeout(() => {
      const newCharacter = generateCharacterFromKeywords(customCharacterKeywords);
      setSelectedCharacters([...selectedCharacters, newCharacter]);
      setCustomCharacterKeywords('');
      setIsGeneratingCustom(false);
      setIsCharacterModalOpen(false);
    }, 1000);
  };

  // Add a custom character from form
  const handleAddCustomCharacter = (e) => {
    e.preventDefault();

    // Validate form
    if (!customCharacter.name || !customCharacter.description || !customCharacter.mood) {
      return;
    }

    // Add personality and other required fields
    const newCharacter = {
      ...customCharacter,
      personality: {
        analytical: 5,
        emotional: 5,
        philosophical: 5,
        humor: 5,
        confidence: 5,
        creativity: 5,
        sociability: 5
      },
      talkativeness: 5,
      thinkingSpeed: 1.0,
      background: customCharacter.description
    };

    setSelectedCharacters([...selectedCharacters, newCharacter]);

    // Reset form
    setCustomCharacter({
      name: '',
      description: '',
      mood: '',
      opening_line: '',
      type: 'modern',
      avatar: ''
    });

    setIsCustomCharacterModalOpen(false);
  };

  // Filter existing characters for selection
  const filteredCharacters = characterLibrary.filter(char =>
    char.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    char.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    char.type.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleRegenerateCharacter = (index) => {
    setIsGenerating(true);

    // Simulate API delay
    setTimeout(() => {
      const newCharacter = generateCharacterFromKeywords(keywords);
      const updatedCharacters = [...generatedCharacters];
      updatedCharacters[index] = newCharacter;

      setGeneratedCharacters(updatedCharacters);

      // Update the selected characters if this character was selected
      if (selectedCharacters.some(c => c.name === generatedCharacters[index].name)) {
        setSelectedCharacters(selectedCharacters.map(c =>
          c.name === generatedCharacters[index].name ? newCharacter : c
        ));
      }

      setIsGenerating(false);
    }, 800);
  };

  return (
    <div className="w-full max-w-4xl mx-auto p-6">
      <div className="mb-8">
        <h2 className="text-2xl font-bold mb-4">Generate a Scenario</h2>
        <p className="text-muted-foreground mb-4">
          Enter a few keywords/ideas and the AI will use them to generate characters and a scenario.
        </p>

        <div className="flex gap-2">
          <input
            type="text"
            value={keywords}
            onChange={(e) => setKeywords(e.target.value)}
            placeholder="e.g., space adventure, medieval fantasy, detective mystery"
            className="flex-1 px-4 py-2 rounded-md border border-input bg-background"
          />
          <button
            onClick={handleGenerate}
            disabled={!keywords.trim() || isGenerating}
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow hover:bg-primary/90 disabled:opacity-50"
          >
            {isGenerating ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Generating...
              </>
            ) : (
              <>
                <Wand2 className="h-4 w-4 mr-2" />
                Generate
              </>
            )}
          </button>
        </div>
      </div>

      {generatedScenario && (
        <div className="mb-8">
          <h3 className="text-xl font-bold mb-2">{generatedScenario.title}</h3>
          <p className="text-muted-foreground mb-4">{generatedScenario.description}</p>

          <div className="bg-secondary/30 rounded-lg p-4 mb-4 italic">
            {generatedScenario.prompt}
          </div>

          {generatedScenario.background && (
            <div className="mb-4">
              {generatedScenario.background.startsWith('linear-gradient') ? (
                <div
                  className="w-full h-40 rounded-lg"
                  style={{ background: generatedScenario.background }}
                ></div>
              ) : (
                <img
                  src={generatedScenario.background}
                  alt="Scenario background"
                  className="w-full h-40 object-cover rounded-lg"
                />
              )}
            </div>
          )}
        </div>
      )}

      {generatedCharacters.length > 0 && (
        <div className="mb-8">
          <h3 className="text-xl font-bold mb-4">Generated Characters</h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            {generatedCharacters.map((character, index) => (
              <div
                key={index}
                className={`border rounded-lg p-4 bg-background/50 cursor-pointer transition-all ${
                  selectedCharacters.some(c => c.name === character.name)
                    ? 'border-primary/70 bg-primary/5'
                    : 'hover:border-primary/30'
                }`}
                onClick={() => toggleCharacterSelection(character)}
              >
                <div className="flex items-center gap-3 mb-2">
                  {character.avatar && (
                    <img
                      src={character.avatar}
                      alt={character.name}
                      className="w-12 h-12 rounded-full object-cover"
                    />
                  )}
                  <div className="flex-1">
                    <h4 className="font-bold">{character.name}</h4>
                    <div className="text-xs text-muted-foreground">{character.type} • {character.mood}</div>
                  </div>
                  {selectedCharacters.some(c => c.name === character.name) && (
                    <div className="bg-primary text-primary-foreground p-1 rounded-full">
                      <Check className="h-4 w-4" />
                    </div>
                  )}
                </div>

                <p className="text-sm mb-2">{character.description}</p>
                <p className="text-sm italic mb-3">"{character.opening_line}"</p>

                <div className="flex justify-between">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleRegenerateCharacter(index);
                    }}
                    className="text-xs text-muted-foreground hover:text-foreground flex items-center gap-1"
                  >
                    <RefreshCw className="h-3 w-3" />
                    Regenerate
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Character Management Section */}
          <div className="mb-8 border-t border-b py-4">
            <h3 className="text-lg font-medium mb-3">Selected Characters ({selectedCharacters.length})</h3>

            {selectedCharacters.length > 0 ? (
              <div className="flex flex-wrap gap-2 mb-4">
                {selectedCharacters.map(char => (
                  <div
                    key={char.name}
                    className="bg-secondary rounded-full px-3 py-1 text-sm flex items-center gap-1"
                  >
                    {char.avatar && (
                      <img
                        src={char.avatar}
                        alt={char.name}
                        className="w-5 h-5 rounded-full object-cover mr-1"
                      />
                    )}
                    {char.name}
                    <button
                      onClick={() => toggleCharacterSelection(char)}
                      className="ml-1 hover:text-destructive"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-muted-foreground mb-4 text-sm">
                No characters selected. Select at least one character to create a chat.
              </p>
            )}

            <div className="flex gap-2">
              <button
                onClick={() => setIsCharacterModalOpen(true)}
                className="inline-flex items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium shadow-sm hover:bg-accent hover:text-accent-foreground"
              >
                <UserPlus className="h-4 w-4 mr-2" />
                Add Character
              </button>

              <button
                onClick={() => setIsCustomCharacterModalOpen(true)}
                className="inline-flex items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium shadow-sm hover:bg-accent hover:text-accent-foreground"
              >
                <Edit className="h-4 w-4 mr-2" />
                Create Custom Character
              </button>
            </div>
          </div>

          <button
            onClick={handleCreateChat}
            disabled={selectedCharacters.length === 0}
            className="w-full inline-flex items-center justify-center rounded-md bg-primary px-4 py-3 font-medium text-primary-foreground shadow hover:bg-primary/90 disabled:opacity-50"
          >
            Create Chat with Selected Characters
          </button>
        </div>
      )}

      {/* Character Selection Modal */}
      {isCharacterModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-background rounded-lg shadow-lg max-w-2xl w-full p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold">Add Characters</h2>
              <button
                onClick={() => setIsCharacterModalOpen(false)}
                className="p-1 rounded-full hover:bg-secondary"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="mb-6">
              <h3 className="text-lg font-medium mb-2">Generate from Keywords</h3>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={customCharacterKeywords}
                  onChange={(e) => setCustomCharacterKeywords(e.target.value)}
                  placeholder="e.g., angry ninja, wise wizard, space pirate"
                  className="flex-1 px-3 py-2 rounded-md border border-input bg-background"
                />
                <button
                  onClick={handleGenerateCustomCharacter}
                  disabled={!customCharacterKeywords.trim() || isGeneratingCustom}
                  className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow hover:bg-primary/90 disabled:opacity-50"
                >
                  {isGeneratingCustom ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Wand2 className="h-4 w-4 mr-2" />
                  )}
                  Generate
                </button>
              </div>
            </div>

            <div className="mb-4">
              <h3 className="text-lg font-medium mb-2">Select Existing Character</h3>
              <input
                type="text"
                placeholder="Search characters..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-3 py-2 rounded-md border border-input bg-background mb-4"
              />
            </div>

            <div className="max-h-[40vh] overflow-y-auto">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {filteredCharacters.map(character => (
                  <div
                    key={character.name}
                    onClick={() => toggleCharacterSelection(character)}
                    className={`p-3 rounded-lg border cursor-pointer transition-all ${
                      selectedCharacters.some(c => c.name === character.name)
                        ? 'border-primary bg-primary/10'
                        : 'border-border hover:border-primary/50'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      {character.avatar ? (
                        <img
                          src={character.avatar}
                          alt={character.name}
                          className="w-10 h-10 rounded-full object-cover"
                        />
                      ) : (
                        <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center">
                          {character.name.charAt(0)}
                        </div>
                      )}
                      <div>
                        <h4 className="font-bold">{character.name}</h4>
                        <div className="text-xs text-muted-foreground">{character.type} • {character.mood}</div>
                      </div>
                      {selectedCharacters.some(c => c.name === character.name) && (
                        <div className="ml-auto bg-primary text-primary-foreground p-1 rounded-full">
                          <Check className="h-3 w-3" />
                        </div>
                      )}
                    </div>
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
                Done
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Custom Character Creation Modal */}
      {isCustomCharacterModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-background rounded-lg shadow-lg max-w-xl w-full p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold">Create Custom Character</h2>
              <button
                onClick={() => setIsCustomCharacterModalOpen(false)}
                className="p-1 rounded-full hover:bg-secondary"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleAddCustomCharacter}>
              <div className="space-y-4">
                <div>
                  <label htmlFor="character-name" className="block text-sm font-medium mb-1">
                    Name
                  </label>
                  <input
                    id="character-name"
                    type="text"
                    value={customCharacter.name}
                    onChange={(e) => setCustomCharacter({...customCharacter, name: e.target.value})}
                    required
                    className="w-full px-3 py-2 rounded-md border border-input bg-background"
                  />
                </div>

                <div>
                  <label htmlFor="character-description" className="block text-sm font-medium mb-1">
                    Description
                  </label>
                  <textarea
                    id="character-description"
                    value={customCharacter.description}
                    onChange={(e) => setCustomCharacter({...customCharacter, description: e.target.value})}
                    required
                    className="w-full px-3 py-2 rounded-md border border-input bg-background min-h-[80px]"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="character-mood" className="block text-sm font-medium mb-1">
                      Mood
                    </label>
                    <input
                      id="character-mood"
                      type="text"
                      value={customCharacter.mood}
                      onChange={(e) => setCustomCharacter({...customCharacter, mood: e.target.value})}
                      required
                      className="w-full px-3 py-2 rounded-md border border-input bg-background"
                    />
                  </div>

                  <div>
                    <label htmlFor="character-type" className="block text-sm font-medium mb-1">
                      Type
                    </label>
                    <select
                      id="character-type"
                      value={customCharacter.type}
                      onChange={(e) => setCustomCharacter({...customCharacter, type: e.target.value})}
                      className="w-full px-3 py-2 rounded-md border border-input bg-background"
                    >
                      <option value="fantasy">Fantasy</option>
                      <option value="scifi">Sci-Fi</option>
                      <option value="historical">Historical</option>
                      <option value="modern">Modern</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label htmlFor="character-opening-line" className="block text-sm font-medium mb-1">
                    Opening Line
                  </label>
                  <textarea
                    id="character-opening-line"
                    value={customCharacter.opening_line}
                    onChange={(e) => setCustomCharacter({...customCharacter, opening_line: e.target.value})}
                    className="w-full px-3 py-2 rounded-md border border-input bg-background min-h-[80px]"
                  />
                </div>

                <div>
                  <label htmlFor="character-avatar" className="block text-sm font-medium mb-1">
                    Avatar URL (Optional)
                  </label>
                  <input
                    id="character-avatar"
                    type="url"
                    value={customCharacter.avatar}
                    onChange={(e) => setCustomCharacter({...customCharacter, avatar: e.target.value})}
                    className="w-full px-3 py-2 rounded-md border border-input bg-background"
                  />

                  {customCharacter.avatar && (
                    <div className="mt-2">
                      <img
                        src={customCharacter.avatar}
                        alt="Avatar preview"
                        className="w-16 h-16 rounded-full object-cover"
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = 'https://placehold.co/200x200?text=Invalid+URL';
                        }}
                      />
                    </div>
                  )}
                </div>
              </div>

              <div className="flex justify-end gap-2 mt-6">
                <button
                  type="button"
                  onClick={() => setIsCustomCharacterModalOpen(false)}
                  className="inline-flex items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium shadow-sm hover:bg-accent hover:text-accent-foreground"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow hover:bg-primary/90"
                >
                  Add Character
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ScenarioGenerator;
