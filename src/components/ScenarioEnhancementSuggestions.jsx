import { useState } from "react";
import {
  Lightbulb,
  ChevronDown,
  ChevronUp,
  Plus,
  X,
  HelpCircle,
} from "lucide-react";

/**
 * Component that displays suggestions to enhance a scenario description
 *
 * @param {Object} props - Component props
 * @param {Array} props.suggestions - Array of suggestion objects
 * @param {Array} props.guidingQuestions - Array of guiding questions
 * @param {Function} props.onApplySuggestion - Function to call when a suggestion is applied
 * @param {Function} props.onClose - Function to call when the suggestions panel is closed
 * @returns {JSX.Element} - The rendered component
 */
const ScenarioEnhancementSuggestions = ({
  suggestions = [],
  guidingQuestions = [],
  onApplySuggestion,
  onClose,
}) => {
  const [expanded, setExpanded] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState("suggestions");

  // If there are no suggestions or questions, don't render anything
  if (suggestions.length === 0 && guidingQuestions.length === 0) {
    return null;
  }

  return (
    <div className="mt-2 border border-primary/20 rounded-md overflow-hidden bg-primary/5 transition-all animate-fadeIn">
      {/* Header */}
      <div
        className="flex items-center justify-between p-3 bg-primary/10 cursor-pointer"
        onClick={() => setExpanded(!expanded)}
      >
        <div className="flex items-center gap-2">
          <Lightbulb className="h-4 w-4 text-primary animate-pulse" />
          <h3 className="text-sm font-medium">Enhance Your Scenario</h3>
          <span className="text-xs bg-primary/20 text-primary px-2 py-0.5 rounded-full">
            Make it immersive
          </span>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onClose();
            }}
            className="p-1 rounded-full hover:bg-primary/20"
            title="Dismiss suggestions"
          >
            <X className="h-3.5 w-3.5" />
          </button>
          {expanded ? (
            <ChevronUp className="h-4 w-4" />
          ) : (
            <ChevronDown className="h-4 w-4" />
          )}
        </div>
      </div>

      {/* Content */}
      {expanded && (
        <div className="p-3">
          <p className="text-xs text-muted-foreground mb-3">
            Your scenario could be more immersive with additional details. Here
            are some suggestions:
          </p>

          {/* Tab navigation */}
          <div className="flex border-b mb-3">
            <button
              onClick={() => setSelectedCategory("suggestions")}
              className={`px-3 py-1 text-xs ${
                selectedCategory === "suggestions"
                  ? "border-b-2 border-primary text-primary font-medium"
                  : "text-muted-foreground"
              }`}
            >
              Suggestions
            </button>
            <button
              onClick={() => setSelectedCategory("questions")}
              className={`px-3 py-1 text-xs ${
                selectedCategory === "questions"
                  ? "border-b-2 border-primary text-primary font-medium"
                  : "text-muted-foreground"
              }`}
            >
              Guiding Questions
            </button>
          </div>

          {/* Suggestions */}
          {selectedCategory === "suggestions" && (
            <div className="space-y-3">
              {suggestions.map((suggestion, index) => (
                <div
                  key={index}
                  className="bg-background rounded-md p-3 border border-border"
                >
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="text-sm font-medium">{suggestion.title}</h4>
                    <button
                      onClick={() => onApplySuggestion(suggestion.examples[0])}
                      className="text-xs flex items-center gap-1 text-primary hover:text-primary/80 p-1 rounded-full hover:bg-primary/10"
                      title="Add this suggestion"
                    >
                      <Plus className="h-3 w-3" />
                      <span>Add</span>
                    </button>
                  </div>
                  <p className="text-xs text-muted-foreground mb-2">
                    {suggestion.description}
                  </p>
                  <div className="text-xs italic bg-secondary/30 p-2 rounded-sm">
                    Example: "{suggestion.examples[0]}"
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Guiding Questions */}
          {selectedCategory === "questions" && (
            <div className="space-y-3">
              {guidingQuestions.map((question, index) => (
                <div
                  key={index}
                  className="flex items-start gap-2 p-2 border-b border-border last:border-0"
                >
                  <HelpCircle className="h-4 w-4 text-primary flex-shrink-0 mt-0.5" />
                  <p className="text-sm">{question}</p>
                </div>
              ))}
              <p className="text-xs text-muted-foreground pt-2">
                Consider these questions to add depth to your scenario. They can
                help you think about aspects you might not have considered.
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ScenarioEnhancementSuggestions;
