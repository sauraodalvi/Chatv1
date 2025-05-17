import React from 'react';

/**
 * High-quality emoji reaction component
 * 
 * @param {Object} props - Component props
 * @param {string} props.type - Emoji type (smile, love, laugh, wow, think, sad, clap)
 * @param {string} props.size - Size of emoji (sm, md, lg)
 * @param {string} props.className - Additional CSS classes
 * @returns {JSX.Element} - Emoji reaction component
 */
const EmojiReaction = ({ type = 'smile', size = 'md', className = '' }) => {
  // Size mapping
  const sizeClasses = {
    'sm': 'h-3 w-3',
    'md': 'h-4 w-4',
    'lg': 'h-5 w-5',
    'xl': 'h-6 w-6'
  };
  
  // Emoji mapping to high-quality SVG representations
  const emojiMap = {
    smile: (
      <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={`${sizeClasses[size]} ${className}`}>
        <circle cx="12" cy="12" r="10" fill="#FFD764" />
        <path d="M8.5 9.5C8.5 10.0523 8.05228 10.5 7.5 10.5C6.94772 10.5 6.5 10.0523 6.5 9.5C6.5 8.94772 6.94772 8.5 7.5 8.5C8.05228 8.5 8.5 8.94772 8.5 9.5Z" fill="#402A32" />
        <path d="M17.5 9.5C17.5 10.0523 17.0523 10.5 16.5 10.5C15.9477 10.5 15.5 10.0523 15.5 9.5C15.5 8.94772 15.9477 8.5 16.5 8.5C17.0523 8.5 17.5 8.94772 17.5 9.5Z" fill="#402A32" />
        <path d="M12 17.5C14.5 17.5 16.5 15.5 16.5 13.5H7.5C7.5 15.5 9.5 17.5 12 17.5Z" fill="#402A32" />
      </svg>
    ),
    love: (
      <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={`${sizeClasses[size]} ${className}`}>
        <circle cx="12" cy="12" r="10" fill="#FF6B6B" />
        <path d="M8.5 9.5C8.5 10.0523 8.05228 10.5 7.5 10.5C6.94772 10.5 6.5 10.0523 6.5 9.5C6.5 8.94772 6.94772 8.5 7.5 8.5C8.05228 8.5 8.5 8.94772 8.5 9.5Z" fill="#402A32" />
        <path d="M17.5 9.5C17.5 10.0523 17.0523 10.5 16.5 10.5C15.9477 10.5 15.5 10.0523 15.5 9.5C15.5 8.94772 15.9477 8.5 16.5 8.5C17.0523 8.5 17.5 8.94772 17.5 9.5Z" fill="#402A32" />
        <path d="M12 17C9.5 14.5 7 16 7 16C7 16 9.5 19 12 17Z" fill="#402A32" />
        <path d="M12 17C14.5 14.5 17 16 17 16C17 16 14.5 19 12 17Z" fill="#402A32" />
      </svg>
    ),
    laugh: (
      <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={`${sizeClasses[size]} ${className}`}>
        <circle cx="12" cy="12" r="10" fill="#FFD764" />
        <path d="M7 9.5C7 9.5 7.5 8 8.5 8C9.5 8 10 9.5 10 9.5" stroke="#402A32" strokeWidth="1.5" strokeLinecap="round" />
        <path d="M14 9.5C14 9.5 14.5 8 15.5 8C16.5 8 17 9.5 17 9.5" stroke="#402A32" strokeWidth="1.5" strokeLinecap="round" />
        <path d="M7 13C7 13 9 17 12 17C15 17 17 13 17 13" fill="#402A32" />
        <path d="M7 13C7 13 9 17 12 17C15 17 17 13 17 13" stroke="#402A32" strokeWidth="1.5" strokeLinecap="round" />
      </svg>
    ),
    wow: (
      <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={`${sizeClasses[size]} ${className}`}>
        <circle cx="12" cy="12" r="10" fill="#FFD764" />
        <circle cx="8" cy="10" r="1.5" fill="#402A32" />
        <circle cx="16" cy="10" r="1.5" fill="#402A32" />
        <circle cx="12" cy="15" r="2" stroke="#402A32" strokeWidth="1.5" />
      </svg>
    ),
    think: (
      <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={`${sizeClasses[size]} ${className}`}>
        <circle cx="12" cy="12" r="10" fill="#FFD764" />
        <circle cx="8" cy="10" r="1.5" fill="#402A32" />
        <circle cx="16" cy="10" r="1.5" fill="#402A32" />
        <path d="M9 16C9 16 10 14.5 12 14.5C14 14.5 15 16 15 16" stroke="#402A32" strokeWidth="1.5" strokeLinecap="round" />
        <circle cx="18" cy="7" r="2" fill="#402A32" />
      </svg>
    ),
    sad: (
      <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={`${sizeClasses[size]} ${className}`}>
        <circle cx="12" cy="12" r="10" fill="#FFD764" />
        <circle cx="8" cy="10" r="1.5" fill="#402A32" />
        <circle cx="16" cy="10" r="1.5" fill="#402A32" />
        <path d="M9 16C9 16 10 17.5 12 17.5C14 17.5 15 16 15 16" stroke="#402A32" strokeWidth="1.5" strokeLinecap="round" />
      </svg>
    ),
    clap: (
      <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={`${sizeClasses[size]} ${className}`}>
        <circle cx="12" cy="12" r="10" fill="#FFD764" />
        <path d="M6.5 12.5L8.5 14.5L11.5 8.5L13.5 14.5L17.5 10.5" stroke="#402A32" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    )
  };
  
  // Return the appropriate emoji SVG
  return emojiMap[type] || emojiMap.smile;
};

/**
 * Emoji reaction button component
 * 
 * @param {Object} props - Component props
 * @param {string} props.type - Emoji type
 * @param {string} props.label - Button label
 * @param {function} props.onClick - Click handler
 * @param {string} props.className - Additional CSS classes
 * @returns {JSX.Element} - Emoji reaction button
 */
export const EmojiReactionButton = ({ type = 'smile', label, onClick, className = '' }) => {
  return (
    <button
      className={`text-muted-foreground hover:text-foreground flex items-center gap-1 ${className}`}
      onClick={onClick}
    >
      <EmojiReaction type={type} size="sm" />
      {label && <span>{label}</span>}
    </button>
  );
};

export default EmojiReaction;
