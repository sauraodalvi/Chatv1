/**
 * Utility functions for handling auto-responses in the chat
 */

// Note: We're using the more comprehensive generateCharacterFallback from characterFallbackUtils.js
// This file now only contains the detectBattleScenario function

/**
 * Detects if the conversation is in a battle context based on recent messages
 * @param {Object} chatRoom - The chat room object
 * @param {Array} chatHistory - The chat history array
 * @returns {boolean} True if the conversation is in a battle context
 */
export const detectBattleScenario = (chatRoom, chatHistory) => {
  // Check if the chat room has a battle theme
  if (
    chatRoom?.theme?.toLowerCase().includes("battle") ||
    chatRoom?.name?.toLowerCase().includes("battle") ||
    chatRoom?.openingPrompt?.toLowerCase().includes("battle")
  ) {
    return true;
  }

  // Check recent messages for battle keywords
  const recentMessages = chatHistory.slice(-10);
  const battleKeywords = [
    "battle",
    "fight",
    "attack",
    "defend",
    "enemy",
    "weapon",
    "combat",
    "shield",
    "sword",
    "gun",
    "blast",
    "explosion",
    "danger",
    "threat",
  ];

  // Count battle keywords in recent messages
  let battleKeywordCount = 0;
  recentMessages.forEach((msg) => {
    if (msg.message) {
      battleKeywords.forEach((keyword) => {
        if (msg.message.toLowerCase().includes(keyword)) {
          battleKeywordCount++;
        }
      });
    }
  });

  // If we have several battle keywords, consider it a battle scenario
  return battleKeywordCount >= 3;
};
