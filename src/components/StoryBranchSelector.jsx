import { useState, useEffect } from "react";
import { ChevronRight, Sparkles, X } from "lucide-react";

/**
 * Story Branch Selector component
 * 
 * Displays story branch options and allows the user to select one
 */
const StoryBranchSelector = ({
  branches = [],
  onSelectBranch,
  onDismiss,
  scenarioType = "adventure",
}) => {
  const [selectedBranch, setSelectedBranch] = useState(null);
  const [isVisible, setIsVisible] = useState(false);
  
  // Animation effect when branches appear
  useEffect(() => {
    if (branches.length > 0) {
      // Short delay before showing the branches for a nice animation effect
      const timer = setTimeout(() => {
        setIsVisible(true);
      }, 300);
      
      return () => clearTimeout(timer);
    } else {
      setIsVisible(false);
    }
  }, [branches]);
  
  // Handle branch selection
  const handleSelectBranch = (branch) => {
    setSelectedBranch(branch);
    
    // Short delay before calling onSelectBranch for animation
    setTimeout(() => {
      onSelectBranch(branch);
    }, 300);
  };
  
  // Get theme-specific styles
  const getThemeStyles = () => {
    switch (scenarioType) {
      case "fantasy":
        return {
          bgColor: "bg-purple-500/10",
          borderColor: "border-purple-500/30",
          iconColor: "text-purple-500",
          hoverBg: "hover:bg-purple-500/20",
          selectedBg: "bg-purple-500/30",
          titleColor: "text-purple-600"
        };
      case "scifi":
        return {
          bgColor: "bg-blue-500/10",
          borderColor: "border-blue-500/30",
          iconColor: "text-blue-500",
          hoverBg: "hover:bg-blue-500/20",
          selectedBg: "bg-blue-500/30",
          titleColor: "text-blue-600"
        };
      case "horror":
        return {
          bgColor: "bg-red-500/10",
          borderColor: "border-red-500/30",
          iconColor: "text-red-500",
          hoverBg: "hover:bg-red-500/20",
          selectedBg: "bg-red-500/30",
          titleColor: "text-red-600"
        };
      case "mystery":
        return {
          bgColor: "bg-amber-500/10",
          borderColor: "border-amber-500/30",
          iconColor: "text-amber-500",
          hoverBg: "hover:bg-amber-500/20",
          selectedBg: "bg-amber-500/30",
          titleColor: "text-amber-600"
        };
      case "romance":
        return {
          bgColor: "bg-pink-500/10",
          borderColor: "border-pink-500/30",
          iconColor: "text-pink-500",
          hoverBg: "hover:bg-pink-500/20",
          selectedBg: "bg-pink-500/30",
          titleColor: "text-pink-600"
        };
      default:
        return {
          bgColor: "bg-primary/10",
          borderColor: "border-primary/30",
          iconColor: "text-primary",
          hoverBg: "hover:bg-primary/20",
          selectedBg: "bg-primary/30",
          titleColor: "text-primary"
        };
    }
  };
  
  const themeStyles = getThemeStyles();
  
  if (branches.length === 0) return null;
  
  return (
    <div
      className={`fixed bottom-20 left-0 right-0 flex justify-center items-center px-4 transition-opacity duration-300 ${
        isVisible ? "opacity-100" : "opacity-0"
      }`}
    >
      <div
        className={`w-full max-w-2xl rounded-lg border ${themeStyles.borderColor} ${themeStyles.bgColor} shadow-lg overflow-hidden transition-all duration-300 transform ${
          isVisible ? "translate-y-0" : "translate-y-10"
        }`}
      >
        <div className="p-4 flex items-center justify-between border-b border-primary/10">
          <div className="flex items-center">
            <Sparkles className={`h-5 w-5 ${themeStyles.iconColor} mr-2`} />
            <h3 className={`font-medium ${themeStyles.titleColor}`}>
              What happens next?
            </h3>
          </div>
          <button
            onClick={onDismiss}
            className="text-muted-foreground hover:text-foreground"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        
        <div className="p-4 space-y-2">
          {branches.map((branch, index) => (
            <button
              key={index}
              onClick={() => handleSelectBranch(branch)}
              disabled={selectedBranch !== null}
              className={`w-full p-3 rounded-md text-left transition-all flex items-center ${
                selectedBranch === branch
                  ? `${themeStyles.selectedBg} border border-primary`
                  : `${themeStyles.hoverBg} border border-transparent`
              } ${
                selectedBranch !== null && selectedBranch !== branch
                  ? "opacity-50"
                  : "opacity-100"
              }`}
            >
              <div className="flex-1">{branch}</div>
              <ChevronRight
                className={`h-5 w-5 ml-2 ${themeStyles.iconColor} ${
                  selectedBranch === branch ? "animate-pulse" : ""
                }`}
              />
            </button>
          ))}
        </div>
        
        <div className="px-4 py-3 bg-background/50 text-xs text-muted-foreground">
          Choose an option to influence the direction of the story
        </div>
      </div>
    </div>
  );
};

export default StoryBranchSelector;
