import React from "react";
import { cn } from "../../lib/utils";

/**
 * Consistent emoji icon component for use throughout the application
 * Uses native emoji characters with consistent styling
 *
 * @param {Object} props - Component props
 * @param {string} props.emoji - The emoji character to display
 * @param {string} props.size - Size of the emoji (xs, sm, md, lg, xl)
 * @param {string} props.className - Additional CSS classes
 * @returns {JSX.Element} - Emoji icon component
 */
const EmojiIcon = ({ emoji, size = "md", className }) => {
  // Size mapping
  const sizeClasses = {
    xs: "text-xs",
    sm: "text-sm",
    md: "text-base",
    lg: "text-lg",
    xl: "text-xl",
    "2xl": "text-2xl",
  };

  return (
    <span
      className={cn(
        "inline-flex items-center justify-center",
        sizeClasses[size] || sizeClasses.md,
        className
      )}
      role="img"
      aria-label={`${emoji} emoji`}
    >
      {emoji}
    </span>
  );
};

/**
 * Common emoji mappings for consistent usage throughout the app
 */
export const emojiMap = {
  // Character types
  hero: "🦸",
  villain: "🦹",
  warrior: "⚔️",
  mage: "🧙",
  rogue: "🥷",
  healer: "💉",
  bard: "🎭",
  ranger: "🏹",

  // Emotions
  happy: "😊",
  sad_emotion: "😢",
  angry: "😠",
  surprised: "😮",
  confused: "😕",
  thoughtful: "🤔",
  excited: "😃",
  nervous: "😬",

  // Actions
  attack: "⚔️",
  defend: "🛡️",
  magic: "✨",
  heal: "💖",
  search: "🔍",
  talk: "💬",
  listen: "👂",
  thinking: "💭",

  // Objects
  sword: "🗡️",
  shield: "🛡️",
  book: "📚",
  potion: "🧪",
  scroll: "📜",
  key: "🔑",
  treasure: "💰",

  // Environment
  forest: "🌲",
  mountain: "⛰️",
  castle: "🏰",
  cave: "🕳️",
  village: "🏘️",
  city: "🏙️",

  // UI elements
  next: "➡️",
  previous: "⬅️",
  add: "➕",
  remove: "➖",
  settings: "⚙️",
  star: "⭐",
  warning: "⚠️",
  info: "ℹ️",

  // Reactions
  like: "👍",
  love: "❤️",
  laugh: "😂",
  wow_reaction: "😮",
  think_reaction: "🤔",
  sad: "😢",
  clap: "👏",
};

export default EmojiIcon;
