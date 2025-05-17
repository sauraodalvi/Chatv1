import { useState, useEffect } from "react";
import { generateFallbackAvatar } from "../utils/avatarUtils";
import EmojiIcon, { emojiMap } from "./ui/EmojiIcon";

/**
 * Character Avatar component with fallback to colored initials
 *
 * @param {Object} props - Component props
 * @param {Object} props.character - Character object with name and avatar properties
 * @param {string} props.size - Size of avatar ('sm', 'md', 'lg')
 * @param {string} props.className - Additional CSS classes
 * @returns {JSX.Element} - Avatar component
 */
const CharacterAvatar = ({ character, size = "md", className = "" }) => {
  const [imageError, setImageError] = useState(false);
  const [fallback, setFallback] = useState(null);

  // Size mapping
  const sizeClasses = {
    xs: "w-6 h-6 text-xs",
    sm: "w-8 h-8 text-sm",
    md: "w-10 h-10 text-base",
    lg: "w-12 h-12 text-lg",
    xl: "w-16 h-16 text-xl",
  };

  // Generate fallback on mount or when character changes
  useEffect(() => {
    if (character) {
      setFallback(generateFallbackAvatar(character));
    }
  }, [character]);

  // Reset error state if character changes
  useEffect(() => {
    setImageError(false);
  }, [character?.avatar]);

  // Handle image load error
  const handleImageError = () => {
    setImageError(true);
  };

  // If no character, return empty placeholder
  if (!character) {
    return (
      <div
        className={`rounded-full bg-gray-200 flex items-center justify-center ${sizeClasses[size]} ${className}`}
      >
        <span className="text-gray-400">?</span>
      </div>
    );
  }

  // If image is available and hasn't errored, show image
  if (character.avatar && !imageError) {
    return (
      <div
        className={`rounded-full overflow-hidden ${sizeClasses[size]} ${className} border-2 border-background shadow-sm`}
      >
        <img
          src={character.avatar}
          alt={character.name || "Character avatar"}
          className="w-full h-full object-cover"
          onError={handleImageError}
        />
      </div>
    );
  }

  // Get emoji for character type
  const getCharacterTypeEmoji = (character) => {
    if (!character || !character.type) return null;

    // Map character types to emoji
    const typeEmojiMap = {
      hero: emojiMap.hero,
      villain: emojiMap.villain,
      warrior: emojiMap.warrior,
      mage: emojiMap.mage,
      rogue: emojiMap.rogue,
      healer: emojiMap.healer,
      bard: emojiMap.bard,
      ranger: emojiMap.ranger,
      fantasy: emojiMap.magic,
      scifi: "🚀",
      historical: "📜",
      modern: "🏙️",
      superhero: "🦸",
      noir: "🕵️",
      western: "🤠",
      horror: "👻",
      comedy: "😂",
      romance: "❤️",
      mystery: "🔍",
      adventure: "🗺️",
    };

    return typeEmojiMap[character.type.toLowerCase()] || null;
  };

  // Get emoji based on character type
  const characterEmoji = getCharacterTypeEmoji(character);

  // Show emoji if available, otherwise fallback to initials
  return (
    <div
      className={`rounded-full flex items-center justify-center ${sizeClasses[size]} ${className} border-2 border-background shadow-sm`}
      style={{ backgroundColor: fallback?.bgColor || "#6c757d" }}
      title={character.name}
    >
      {characterEmoji ? (
        <EmojiIcon
          emoji={characterEmoji}
          size={
            size === "xs"
              ? "xs"
              : size === "sm"
              ? "sm"
              : size === "md"
              ? "md"
              : "lg"
          }
        />
      ) : (
        <span className="font-bold text-white">
          {fallback?.initials || "?"}
        </span>
      )}
    </div>
  );
};

export default CharacterAvatar;
