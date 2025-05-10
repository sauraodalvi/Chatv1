/**
 * Utility functions for handling character turns in conversations
 */

/**
 * Determine which character should speak next based on various factors
 * 
 * Prioritizes:
 * 1. Characters mentioned in the last message
 * 2. Characters with mood "Intense"
 * 3. Otherwise, falls back to talkativeness score
 * 
 * @param {Array} characters - Array of available characters
 * @param {Object} lastMessage - The last message in the chat
 * @param {string} lastSpeakerName - Name of the last character who spoke
 * @returns {Object} - The character who should speak next
 */
export const determineNextSpeaker = (characters, lastMessage, lastSpeakerName) => {
  if (!characters || characters.length === 0) return null;
  
  // Filter out the last speaker to avoid the same character speaking twice in a row
  const availableCharacters = characters.filter(char => char.name !== lastSpeakerName);
  
  if (availableCharacters.length === 0) return null;
  
  // If there's only one character available, return that one
  if (availableCharacters.length === 1) return availableCharacters[0];
  
  // Check if any characters are mentioned in the last message
  if (lastMessage && lastMessage.message) {
    const messageLower = lastMessage.message.toLowerCase();
    
    // Find characters mentioned by name in the message
    const mentionedCharacters = availableCharacters.filter(char => 
      messageLower.includes(char.name.toLowerCase())
    );
    
    // If characters are mentioned, randomly select one of them
    if (mentionedCharacters.length > 0) {
      return mentionedCharacters[Math.floor(Math.random() * mentionedCharacters.length)];
    }
  }
  
  // Check for characters with mood "Intense"
  const intenseCharacters = availableCharacters.filter(char => 
    char.mood === "Intense"
  );
  
  // If there are intense characters, randomly select one of them (70% chance)
  if (intenseCharacters.length > 0 && Math.random() < 0.7) {
    return intenseCharacters[Math.floor(Math.random() * intenseCharacters.length)];
  }
  
  // Otherwise, sort by talkativeness and select with weighted probability
  const sortedByTalkativeness = [...availableCharacters].sort((a, b) => {
    const aTalkativeness = a.talkativeness || 5;
    const bTalkativeness = b.talkativeness || 5;
    return bTalkativeness - aTalkativeness;
  });
  
  // Create a weighted selection based on talkativeness
  const totalTalkativeness = sortedByTalkativeness.reduce(
    (sum, char) => sum + (char.talkativeness || 5), 
    0
  );
  
  // Select a character based on weighted probability
  let randomValue = Math.random() * totalTalkativeness;
  let cumulativeWeight = 0;
  
  for (const character of sortedByTalkativeness) {
    cumulativeWeight += (character.talkativeness || 5);
    if (randomValue <= cumulativeWeight) {
      return character;
    }
  }
  
  // Fallback to the most talkative character
  return sortedByTalkativeness[0];
};

/**
 * Determine multiple characters who should respond to a message
 * 
 * @param {Array} characters - Array of available characters
 * @param {Object} lastMessage - The last message in the chat
 * @param {string} lastSpeakerName - Name of the last character who spoke
 * @param {number} maxResponders - Maximum number of characters to respond
 * @returns {Array} - Array of characters who should respond, in order
 */
export const determineResponders = (characters, lastMessage, lastSpeakerName, maxResponders = 3) => {
  if (!characters || characters.length === 0) return [];
  
  // Filter out the last speaker to avoid the same character speaking twice in a row
  const availableCharacters = characters.filter(char => char.name !== lastSpeakerName);
  
  if (availableCharacters.length === 0) return [];
  
  // If there's only one character available, return that one
  if (availableCharacters.length === 1) return availableCharacters;
  
  // Check if any characters are mentioned in the last message
  const mentionedCharacters = [];
  if (lastMessage && lastMessage.message) {
    const messageLower = lastMessage.message.toLowerCase();
    
    // Find characters mentioned by name in the message
    availableCharacters.forEach(char => {
      if (messageLower.includes(char.name.toLowerCase())) {
        mentionedCharacters.push(char);
      }
    });
  }
  
  // Check for characters with mood "Intense"
  const intenseCharacters = availableCharacters.filter(char => 
    char.mood === "Intense" && !mentionedCharacters.includes(char)
  );
  
  // Combine mentioned characters and intense characters
  let priorityCharacters = [...mentionedCharacters];
  
  // Add intense characters with a 70% chance for each
  intenseCharacters.forEach(char => {
    if (Math.random() < 0.7) {
      priorityCharacters.push(char);
    }
  });
  
  // Limit to maxResponders
  if (priorityCharacters.length > maxResponders) {
    priorityCharacters = priorityCharacters.slice(0, maxResponders);
  }
  
  // If we don't have enough priority characters, add more based on talkativeness
  if (priorityCharacters.length < maxResponders) {
    // Filter out characters already selected
    const remainingCharacters = availableCharacters.filter(
      char => !priorityCharacters.includes(char)
    );
    
    if (remainingCharacters.length > 0) {
      // Sort remaining characters by talkativeness
      const sortedByTalkativeness = [...remainingCharacters].sort((a, b) => {
        const aTalkativeness = a.talkativeness || 5;
        const bTalkativeness = b.talkativeness || 5;
        return bTalkativeness - aTalkativeness;
      });
      
      // Add characters until we reach maxResponders or run out of characters
      const numToAdd = Math.min(maxResponders - priorityCharacters.length, sortedByTalkativeness.length);
      for (let i = 0; i < numToAdd; i++) {
        priorityCharacters.push(sortedByTalkativeness[i]);
      }
    }
  }
  
  return priorityCharacters;
};
