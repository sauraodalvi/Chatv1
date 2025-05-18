import { useState } from "react";
import { ArrowLeft, X } from "lucide-react";
import CharacterCreationPanel from "./character-creation/CharacterCreationPanel";

/**
 * Enhanced Character Creation component that serves as the entry point
 * for the new AI-powered character creation experience
 */
const EnhancedCharacterCreation = ({
  onSave,
  onCancel,
  initialCharacter = null,
}) => {
  return (
    <div className="fixed inset-0 bg-background z-50 flex flex-col">
      {/* Header */}
      <div className="border-b p-4 flex items-center justify-between">
        <div className="flex items-center">
          <button
            onClick={onCancel}
            className="mr-4 text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>
          <h2 className="text-xl font-bold">Create Character</h2>
        </div>
        <button
          onClick={onCancel}
          className="text-muted-foreground hover:text-foreground"
        >
          <X className="h-5 w-5" />
        </button>
      </div>
      
      {/* Main content */}
      <div className="flex-1 overflow-hidden">
        <CharacterCreationPanel
          onSave={onSave}
          onCancel={onCancel}
          initialCharacter={initialCharacter}
        />
      </div>
    </div>
  );
};

export default EnhancedCharacterCreation;
