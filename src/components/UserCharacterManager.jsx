import { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, User, X } from 'lucide-react';
import { getUserCharacters, deleteUserCharacter } from '../utils/userCharacterUtils';
import UserCharacterForm from './UserCharacterForm';

const UserCharacterManager = ({ onSelectCharacter, onClose }) => {
  const [userCharacters, setUserCharacters] = useState([]);
  const [isCreating, setIsCreating] = useState(false);
  const [editingCharacter, setEditingCharacter] = useState(null);
  const [showConfirmDelete, setShowConfirmDelete] = useState(null);

  // Load user characters on mount
  useEffect(() => {
    loadUserCharacters();
  }, []);

  // Load user characters from localStorage
  const loadUserCharacters = () => {
    const characters = getUserCharacters();
    setUserCharacters(characters);
  };

  // Handle character selection
  const handleSelectCharacter = (character) => {
    if (onSelectCharacter) {
      onSelectCharacter(character);
    }
  };

  // Handle character save (create or update)
  const handleSaveCharacter = () => {
    // Reload characters from localStorage
    loadUserCharacters();
    
    // Reset form state
    setIsCreating(false);
    setEditingCharacter(null);
  };

  // Handle character delete
  const handleDeleteCharacter = (characterId) => {
    const success = deleteUserCharacter(characterId);
    if (success) {
      loadUserCharacters();
      setShowConfirmDelete(null);
      setEditingCharacter(null);
    }
  };

  // Confirm delete dialog
  const ConfirmDeleteDialog = ({ character, onConfirm, onCancel }) => (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-background rounded-lg p-6 max-w-md w-full mx-4">
        <h3 className="text-lg font-semibold mb-2">Delete Character</h3>
        <p className="mb-4">
          Are you sure you want to delete <strong>{character.name}</strong>? This action cannot be undone.
        </p>
        <div className="flex justify-end gap-2">
          <button
            onClick={onCancel}
            className="px-4 py-2 rounded-md bg-secondary/50 hover:bg-secondary transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={() => onConfirm(character.id)}
            className="px-4 py-2 rounded-md bg-red-500 text-white hover:bg-red-600 transition-colors"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );

  // If creating or editing, show the form
  if (isCreating || editingCharacter) {
    return (
      <div className="p-4">
        <UserCharacterForm
          initialCharacter={editingCharacter}
          onSave={handleSaveCharacter}
          onCancel={() => {
            setIsCreating(false);
            setEditingCharacter(null);
          }}
          onDelete={(characterId) => setShowConfirmDelete(
            userCharacters.find(c => c.id === characterId)
          )}
        />
      </div>
    );
  }

  return (
    <div className="p-4">
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Your Characters</h2>
        <button 
          onClick={onClose}
          className="p-1.5 rounded-full hover:bg-secondary/50 transition-colors"
        >
          <X className="h-5 w-5" />
        </button>
      </div>

      {/* Create new character button */}
      <button
        onClick={() => setIsCreating(true)}
        className="w-full flex items-center justify-center gap-2 p-3 mb-4 rounded-md border border-dashed border-primary/50 hover:border-primary hover:bg-primary/5 transition-all"
      >
        <Plus className="h-5 w-5" />
        <span>Create New Character</span>
      </button>

      {/* Character list */}
      {userCharacters.length > 0 ? (
        <div className="space-y-3">
          {userCharacters.map(character => (
            <div
              key={character.id}
              className="p-3 rounded-lg border border-border hover:border-primary/30 hover:bg-primary/5 transition-all"
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
                      character.type === 'superhero' ? 'bg-red-500' :
                      character.type === 'adventure' ? 'bg-orange-500' :
                      'bg-green-500'
                    } text-white`}>
                      <User className="h-6 w-6" />
                    </div>
                  )}
                </div>
                <div className="flex-1">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-medium">{character.name}</h3>
                      <p className="text-xs text-muted-foreground capitalize">{character.type} • {character.mood}</p>
                    </div>
                    <div className="flex gap-1">
                      <button
                        onClick={() => setEditingCharacter(character)}
                        className="p-1.5 rounded-full hover:bg-secondary/50 transition-colors"
                        title="Edit character"
                      >
                        <Edit className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => setShowConfirmDelete(character)}
                        className="p-1.5 rounded-full hover:bg-red-100 text-red-500 transition-colors"
                        title="Delete character"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                  <p className="text-sm mt-1 line-clamp-2">{character.description}</p>
                  <button
                    onClick={() => handleSelectCharacter(character)}
                    className="mt-2 px-3 py-1 text-xs rounded-md bg-primary/10 hover:bg-primary/20 text-primary transition-colors"
                  >
                    Play as this character
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-8 text-muted-foreground">
          <p>You haven't created any characters yet.</p>
          <p className="text-sm mt-1">Create your first character to start playing as them in conversations!</p>
        </div>
      )}

      {/* Confirm delete dialog */}
      {showConfirmDelete && (
        <ConfirmDeleteDialog
          character={showConfirmDelete}
          onConfirm={handleDeleteCharacter}
          onCancel={() => setShowConfirmDelete(null)}
        />
      )}
    </div>
  );
};

export default UserCharacterManager;
