// Utility functions for character avatars and fallback generation

/**
 * Generate a consistent color hash from a string
 * @param {string} str - The string to generate a color from (character name)
 * @returns {string} - A hex color code
 */
export const stringToColor = (str) => {
  if (!str) return '#6c757d'; // Default gray for empty strings
  
  // Pre-defined colors for specific characters to ensure visual distinction
  const characterColors = {
    'thor': '#3498db', // Blue
    'iron man': '#e74c3c', // Red
    'captain america': '#2980b9', // Darker blue
    'hulk': '#27ae60', // Green
    'black widow': '#8e44ad', // Purple
    'hawkeye': '#d35400', // Orange
    'spider-man': '#c0392b', // Darker red
    'doctor strange': '#16a085', // Teal
    'black panther': '#34495e', // Dark blue-gray
    'scarlet witch': '#c0392b', // Crimson
    'vision': '#9b59b6', // Violet
    'ant-man': '#7f8c8d', // Gray
    'wasp': '#f1c40f', // Yellow
    'captain marvel': '#e67e22', // Orange-red
    'star-lord': '#d35400', // Burnt orange
    'gamora': '#27ae60', // Green
    'rocket': '#7f8c8d', // Gray
    'groot': '#795548', // Brown
    'drax': '#95a5a6', // Light gray
    'mantis': '#2ecc71', // Light green
    'nebula': '#3498db', // Blue
    'loki': '#2ecc71', // Green
    'odin': '#e67e22', // Gold
    'heimdall': '#f39c12', // Amber
    'valkyrie': '#8e44ad', // Purple
  };
  
  // Check if we have a predefined color for this character
  const lowerName = str.toLowerCase();
  if (characterColors[lowerName]) {
    return characterColors[lowerName];
  }
  
  // Character type-based colors as fallback
  const typeColors = {
    'superhero': '#3498db', // Blue
    'villain': '#e74c3c', // Red
    'mentor': '#f39c12', // Amber
    'sidekick': '#2ecc71', // Green
    'civilian': '#95a5a6', // Light gray
    'fantasy': '#8e44ad', // Purple
    'scifi': '#16a085', // Teal
    'historical': '#d35400', // Orange
    'modern': '#7f8c8d', // Gray
    'noir': '#34495e', // Dark blue-gray
    'adventure': '#27ae60', // Green
  };
  
  // Check if the character has a type that matches our type colors
  if (str.type && typeColors[str.type.toLowerCase()]) {
    return typeColors[str.type.toLowerCase()];
  }
  
  // Generate a hash-based color if no predefined color exists
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  
  // Convert hash to hex color
  let color = '#';
  for (let i = 0; i < 3; i++) {
    const value = (hash >> (i * 8)) & 0xFF;
    color += ('00' + value.toString(16)).substr(-2);
  }
  
  // Ensure the color is visually distinct and not too light
  const r = parseInt(color.substr(1, 2), 16);
  const g = parseInt(color.substr(3, 2), 16);
  const b = parseInt(color.substr(5, 2), 16);
  
  // If the color is too light (high brightness), darken it
  if ((r * 0.299 + g * 0.587 + b * 0.114) > 186) {
    // Darken the color by reducing each component
    const darkenFactor = 0.7;
    const newR = Math.floor(r * darkenFactor);
    const newG = Math.floor(g * darkenFactor);
    const newB = Math.floor(b * darkenFactor);
    
    color = `#${newR.toString(16).padStart(2, '0')}${newG.toString(16).padStart(2, '0')}${newB.toString(16).padStart(2, '0')}`;
  }
  
  return color;
};

/**
 * Get initials from a name
 * @param {string} name - The name to get initials from
 * @returns {string} - The initials (up to 2 characters)
 */
export const getInitials = (name) => {
  if (!name) return '?';
  
  // Split the name and get initials (up to 2)
  const parts = name.split(' ').filter(part => part.length > 0);
  
  if (parts.length === 0) return '?';
  if (parts.length === 1) return parts[0].charAt(0).toUpperCase();
  
  // Get first letter of first and last parts
  return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase();
};

/**
 * Store character color in local storage for persistence
 * @param {string} characterId - Character name or ID
 * @param {string} color - Hex color code
 */
export const storeCharacterColor = (characterId, color) => {
  if (!characterId || !color) return;
  
  try {
    // Get existing colors from local storage
    const storedColors = JSON.parse(localStorage.getItem('veloraCharacterColors') || '{}');
    
    // Add/update this character's color
    storedColors[characterId] = color;
    
    // Save back to local storage
    localStorage.setItem('veloraCharacterColors', JSON.stringify(storedColors));
  } catch (error) {
    console.error('Error storing character color:', error);
  }
};

/**
 * Get character color from local storage
 * @param {string} characterId - Character name or ID
 * @returns {string|null} - Stored color or null if not found
 */
export const getStoredCharacterColor = (characterId) => {
  if (!characterId) return null;
  
  try {
    // Get colors from local storage
    const storedColors = JSON.parse(localStorage.getItem('veloraCharacterColors') || '{}');
    
    // Return this character's color if it exists
    return storedColors[characterId] || null;
  } catch (error) {
    console.error('Error retrieving character color:', error);
    return null;
  }
};

/**
 * Generate a fallback avatar with initials on a colored background
 * @param {Object} character - The character object
 * @returns {JSX.Element} - The fallback avatar element
 */
export const generateFallbackAvatar = (character) => {
  if (!character) return null;
  
  const name = character.name || 'Unknown';
  const initials = getInitials(name);
  
  // Try to get stored color first, then generate if not found
  let bgColor = getStoredCharacterColor(name);
  if (!bgColor) {
    bgColor = stringToColor(name);
    // Store for future use
    storeCharacterColor(name, bgColor);
  }
  
  return {
    initials,
    bgColor
  };
};
