import React, { useState, useEffect } from "react";
import { Lightbulb, ArrowRight, Sparkles, Zap } from "lucide-react";
import Chip from "./ui/Chip";
import EmojiIcon, { emojiMap } from "./ui/EmojiIcon";

/**
 * StoryDriver component that helps advance the narrative
 * Provides visual cues and prompts for user input at key narrative moments
 * 
 * @param {Object} props - Component props
 * @param {Object} props.storyArc - Current story arc state
 * @param {Function} props.onAdvance - Callback when user chooses to advance the story
 * @param {Function} props.onWhatNext - Callback when user asks "What next?"
 * @param {boolean} props.waitingForInput - Whether the system is waiting for user input
 * @param {string} props.className - Additional CSS classes
 * @returns {JSX.Element} - StoryDriver component
 */
const StoryDriver = ({ 
  storyArc, 
  onAdvance, 
  onWhatNext, 
  waitingForInput = false,
  className = "" 
}) => {
  const [showPrompt, setShowPrompt] = useState(false);
  const [narrativePrompt, setNarrativePrompt] = useState("");
  
  // Determine if we should show a narrative prompt based on story arc
  useEffect(() => {
    if (!storyArc) return;
    
    // Check if we're at a key narrative point
    const isKeyPoint = checkForKeyNarrativePoint(storyArc);
    
    if (isKeyPoint) {
      setShowPrompt(true);
      setNarrativePrompt(generateNarrativePrompt(storyArc));
    } else {
      setShowPrompt(waitingForInput);
      setNarrativePrompt(waitingForInput ? "What happens next?" : "");
    }
  }, [storyArc, waitingForInput]);
  
  // Check if we're at a key narrative point that requires user input
  const checkForKeyNarrativePoint = (storyArc) => {
    if (!storyArc) return false;
    
    // Key points where we want to prompt the user
    const keyPoints = [
      // End of introduction phase
      storyArc.currentPhase === "introduction" && storyArc.currentTension >= 5,
      
      // Middle of rising action
      storyArc.currentPhase === "rising" && storyArc.currentTension >= 7,
      
      // Before climax
      storyArc.currentPhase === "climax" && storyArc.currentTension >= 9,
      
      // Resolution phase
      storyArc.currentPhase === "resolution" && storyArc.currentTension <= 3,
    ];
    
    return keyPoints.some(point => point === true);
  };
  
  // Generate a narrative prompt based on the current story arc
  const generateNarrativePrompt = (storyArc) => {
    if (!storyArc) return "What happens next?";
    
    const { currentPhase, currentTension, theme } = storyArc;
    
    // Prompts based on narrative phase
    const phasePrompts = {
      introduction: [
        "The scene is set. How do you want to proceed?",
        "The characters are introduced. What happens next?",
        "The stage is ready. How do you want to advance the story?",
      ],
      rising: [
        "Tension is building. What action do you take?",
        "The plot thickens. How do you respond?",
        "Challenges emerge. What's your next move?",
      ],
      climax: [
        "The moment of truth approaches. What critical action do you take?",
        "Everything hangs in the balance. What do you do?",
        "This is the decisive moment. How do you face it?",
      ],
      resolution: [
        "The dust settles. How do you conclude this chapter?",
        "The aftermath unfolds. How do you reflect on what happened?",
        "The story reaches its end. How do you want to close it?",
      ],
    };
    
    // Get prompts for current phase
    const prompts = phasePrompts[currentPhase] || ["What happens next?"];
    
    // Select a random prompt
    return prompts[Math.floor(Math.random() * prompts.length)];
  };
  
  // If no prompt to show, return null
  if (!showPrompt) return null;
  
  return (
    <div className={`my-4 ${className}`}>
      {/* Narrative prompt with visual indicator */}
      <div className="flex flex-col items-center gap-3 animate-fadeIn">
        <div className="text-center text-sm font-medium text-muted-foreground">
          {narrativePrompt}
        </div>
        
        <div className="flex gap-2">
          <Chip
            variant="default"
            size="md"
            icon={<Lightbulb className="h-4 w-4" />}
            onClick={onWhatNext}
            className="animate-pulse"
          >
            What happens next?
          </Chip>
          
          <Chip
            variant="default"
            size="md"
            icon={<ArrowRight className="h-4 w-4" />}
            onClick={onAdvance}
          >
            Advance story
          </Chip>
        </div>
      </div>
    </div>
  );
};

export default StoryDriver;
