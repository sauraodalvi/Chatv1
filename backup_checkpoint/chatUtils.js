// Chat utility functions for Velora
import { generateScenarioResponse, generateCombatResponse, generateRelationshipResponse } from './scenarioContext';
import {
  getRelationship,
  updateRelationship,
  analyzeInteraction,
  generateInteractionReference,
  shouldReferenceInteraction,
  getRelationshipDescription
} from './relationshipUtils';

/**
 * Extract topics from a message
 *
 * @param {string} message - The message to extract topics from
 * @returns {Array} - Array of topics
 */
const extractTopics = (message) => {
  // Simple implementation - extract nouns and important words
  const words = message.toLowerCase().split(/\s+/);

  // Filter out common stop words
  const stopWords = ['the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'with', 'about', 'is', 'are', 'was', 'were'];
  const filteredWords = words.filter(word => !stopWords.includes(word) && word.length > 3);

  // Return up to 3 topics
  return filteredWords.slice(0, 3);
};

/**
 * Extract recent topics from chat history
 *
 * @param {Array} chatHistory - The chat history
 * @param {number} numMessages - Number of recent messages to consider
 * @returns {Array} - Array of recent topics
 */
const extractRecentTopics = (chatHistory, numMessages = 3) => {
  if (!chatHistory || chatHistory.length === 0) return [];

  // Get the most recent messages
  const recentMessages = chatHistory.slice(-numMessages);

  // Extract topics from each message and flatten the array
  const topics = recentMessages
    .map(msg => msg.message ? extractTopics(msg.message) : [])
    .flat();

  // Remove duplicates
  return [...new Set(topics)];
};

/**
 * Analyze the sentiment of a message
 *
 * @param {string} message - The message to analyze
 * @returns {string} - 'positive', 'negative', or 'neutral'
 */
const analyzeSentiment = (message) => {
  const text = message.toLowerCase();

  // Very basic sentiment analysis
  const positiveWords = ['good', 'great', 'excellent', 'amazing', 'wonderful', 'happy', 'love', 'like', 'enjoy', 'beautiful', 'best', 'fantastic', 'awesome', 'nice', 'fun', 'exciting', 'pleased', 'glad', 'thanks', 'thank'];
  const negativeWords = ['bad', 'terrible', 'awful', 'horrible', 'sad', 'hate', 'dislike', 'worst', 'boring', 'annoying', 'disappointed', 'sorry', 'unfortunate', 'wrong', 'problem', 'difficult', 'angry', 'upset', 'worried', 'fear'];

  let positiveScore = 0;
  let negativeScore = 0;

  // Count positive and negative words
  positiveWords.forEach(word => {
    if (text.includes(word)) positiveScore++;
  });

  negativeWords.forEach(word => {
    if (text.includes(word)) negativeScore++;
  });

  // Determine sentiment
  if (positiveScore > negativeScore) return 'positive';
  if (negativeScore > positiveScore) return 'negative';
  return 'neutral';
};

/**
 * Analyze the mood of recent conversation
 *
 * @param {Array} chatHistory - The chat history
 * @param {number} numMessages - Number of recent messages to consider
 * @returns {string} - 'positive', 'negative', or 'neutral'
 */
const analyzeConversationMood = (chatHistory, numMessages = 3) => {
  if (!chatHistory || chatHistory.length === 0) return 'neutral';

  // Get the most recent messages
  const recentMessages = chatHistory.slice(-numMessages);

  // Analyze sentiment of each message
  const sentiments = recentMessages
    .map(msg => msg.message ? analyzeSentiment(msg.message) : 'neutral');

  // Count sentiments
  const positiveCount = sentiments.filter(s => s === 'positive').length;
  const negativeCount = sentiments.filter(s => s === 'negative').length;

  // Determine overall mood
  if (positiveCount > negativeCount) return 'positive';
  if (negativeCount > positiveCount) return 'negative';
  return 'neutral';
};

/**
 * Generate a response from a character based on the message and chat history
 *
 * This is a simple implementation that could be enhanced with more sophisticated
 * AI or rule-based response generation in the future.
 *
 * @param {Object} character - The character object
 * @param {string} message - The message to respond to
 * @param {Array} chatHistory - The chat history
 * @param {Object} writingInstructions - Optional writing instructions to guide the response
 * @param {Object} chatRoom - Optional chat room object containing scenario information
 * @returns {string} - The generated response
 */
export const generateCharacterResponse = (character, message, chatHistory, writingInstructions = null, chatRoom = null, relationships = []) => {
  // Enhanced response generation based on character personality, message content, and scenario context
  const { name, mood, type, personality = {} } = character;

  // Apply writing instructions if provided
  const instructions = writingInstructions || {
    storyArc: '',
    writingStyle: 'balanced',
    responseLength: 'medium',
    characterReminders: '',
    generalNotes: ''
  };

  // Use story arc context to influence the response if available
  const hasStoryArcContext = instructions.storyArc && instructions.storyArc.trim().length > 0;

  // Find the last user message to determine who we're responding to
  const lastUserMessage = [...chatHistory].reverse().find(msg => msg.isUser);
  const respondingToName = lastUserMessage ? lastUserMessage.speaker : null;

  // Extract keywords and topics from the message
  const keywords = message.toLowerCase().split(/\s+/);
  const messageTopics = extractTopics(message);

  // Check if the message is a question
  const isQuestion = message.includes('?');

  // Check if the message is directed at this character specifically
  const isDirectedAtCharacter = message.toLowerCase().includes(name.toLowerCase());

  // Check if the message is an action (contains * characters)
  const isAction = message.includes('*');

  // Extract action details if it's an action message
  let actionDetails = null;
  if (isAction) {
    const actionMatch = message.match(/\*(.*?)\*/);
    if (actionMatch && actionMatch[1]) {
      actionDetails = actionMatch[1].trim();
    }
  }

  // Check message sentiment (very basic implementation)
  const sentiment = analyzeSentiment(message);

  // Get conversation context from recent history
  const recentTopics = extractRecentTopics(chatHistory, 3);
  const conversationMood = analyzeConversationMood(chatHistory, 3);

  // Check for specific keywords that might require special responses
  const hasWeapon = keywords.some(word => ['gun', 'sword', 'knife', 'weapon', 'bullet', 'shoot', 'attack', 'stab', 'kill'].includes(word));
  const hasDanger = keywords.some(word => ['danger', 'threat', 'emergency', 'help', 'save', 'run', 'hide', 'escape'].includes(word));
  const hasGreeting = keywords.some(word => ['hello', 'hi', 'hey', 'greetings', 'howdy'].includes(word));

  // Get the last few messages to establish context
  const recentMessages = chatHistory.slice(-3);
  const lastMessage = recentMessages.length > 0 ? recentMessages[recentMessages.length - 1] : null;
  const lastSpeaker = lastMessage ? lastMessage.speaker : null;

  // Use personality traits to influence response style
  const analyticalLevel = personality.analytical || 5;
  const emotionalLevel = personality.emotional || 5;
  const philosophicalLevel = personality.philosophical || 5;
  const humorLevel = personality.humor || 5;
  const confidenceLevel = personality.confidence || 5;

  // Handle action responses first (highest priority)
  if (isAction) {
    // Respond to actions appropriately
    const actionResponseTemplates = {
      // Weapon or attack related actions
      weapon: [
        `*eyes widen at the ${actionDetails}* Whoa, let's not get hasty here!`,
        `*steps back cautiously* I wasn't expecting things to escalate like this...`,
        `*raises hands defensively* There's no need for that kind of action!`,
        `*looks alarmed* This is taking a dangerous turn. Let's talk this through.`,
        `*tenses up* I hope you're not planning to use that on anyone here.`
      ],
      // Friendly actions
      friendly: [
        `*smiles back* It's nice to see some friendliness in this conversation.`,
        `*nods appreciatively* I see you're trying to lighten the mood. I appreciate that.`,
        `*responds in kind* That's a welcome gesture. Thank you.`,
        `*seems pleased* Your actions speak volumes about your character.`,
        `*relaxes visibly* That helps make this conversation more comfortable.`
      ],
      // Aggressive but non-weapon actions
      aggressive: [
        `*frowns slightly* I'm not sure that was called for.`,
        `*maintains composure* Let's try to keep things civil, shall we?`,
        `*takes a deep breath* I understand you're upset, but there are better ways to express that.`,
        `*steps back* I'd prefer if we could discuss this calmly.`,
        `*looks concerned* That kind of behavior doesn't help our conversation.`
      ],
      // Default/neutral actions
      neutral: [
        `*observes ${actionDetails}* Interesting choice of action.`,
        `*watches carefully* I see what you're doing there.`,
        `*takes note of ${actionDetails}* That's certainly one approach.`,
        `*considers the action* I'm curious about your intentions with that.`,
        `*acknowledges with a nod* I understand the message you're conveying.`
      ]
    };

    // Determine action type
    let actionType = 'neutral';
    const actionText = actionDetails ? actionDetails.toLowerCase() : '';

    if (actionText.includes('gun') || actionText.includes('sword') || actionText.includes('knife') ||
        actionText.includes('weapon') || actionText.includes('shoot') || actionText.includes('stab') ||
        actionText.includes('kill') || actionText.includes('attack') || actionText.includes('bullet')) {
      actionType = 'weapon';
    } else if (actionText.includes('smile') || actionText.includes('hug') || actionText.includes('handshake') ||
               actionText.includes('wave') || actionText.includes('nod') || actionText.includes('wink')) {
      actionType = 'friendly';
    } else if (actionText.includes('glare') || actionText.includes('frown') || actionText.includes('scowl') ||
               actionText.includes('yell') || actionText.includes('slam') || actionText.includes('punch')) {
      actionType = 'aggressive';
    }

    // Select a template based on action type
    const templates = actionResponseTemplates[actionType];
    return templates[Math.floor(Math.random() * templates.length)];
  }

  // Handle weapon-related messages with high priority
  if (hasWeapon) {
    const weaponResponses = [
      `I notice you mentioned something potentially dangerous. Let's be careful with that kind of talk.`,
      `Weapons aren't something to take lightly. Perhaps we could discuss something less threatening?`,
      `That sounds rather dangerous. I prefer to resolve situations peacefully.`,
      `I'm not comfortable with this turn in the conversation. Could we change the subject?`,
      `I understand the fascination with weapons, but I'd rather focus on more constructive topics.`
    ];
    return weaponResponses[Math.floor(Math.random() * weaponResponses.length)];
  }

  // Handle danger-related messages
  if (hasDanger) {
    const dangerResponses = [
      `That sounds concerning. Is everything alright?`,
      `I sense some danger in what you're describing. Should we address this?`,
      `Your words suggest a troubling situation. How can I help?`,
      `I'm picking up on some alarming elements in this conversation. Let's talk about it.`,
      `That seems like a potentially dangerous scenario. I'm here to listen if you want to elaborate.`
    ];
    return dangerResponses[Math.floor(Math.random() * dangerResponses.length)];
  }

  // Handle greetings
  if (hasGreeting && messageTopics.length <= 1) {
    const greetingResponses = [
      `Hello there! It's nice to connect with you.`,
      `Greetings! I'm glad we have this opportunity to chat.`,
      `Hi! I've been looking forward to an interesting conversation.`,
      `Hey! Thanks for reaching out. What's on your mind?`,
      `Welcome! I'm ready for a thoughtful exchange of ideas.`
    ];
    return greetingResponses[Math.floor(Math.random() * greetingResponses.length)];
  }

  // Determine if we should use a more specific response template
  if (isQuestion) {
    // For questions, use a more direct and informative response
    const templates = [
      `That's an interesting question about {{keyword}}. From my perspective, it's all about ${messageTopics[0] || 'the details'}.`,
      `I've pondered questions about {{keyword}} many times. My conclusion is that ${messageTopics[0] || 'it depends on context'}.`,
      `When you ask about {{keyword}}, I'm reminded of something I learned long ago: ${messageTopics[0] || 'everything is connected'}.`,
      `{{keyword}}? Well, that's a complex matter. Let me share what I know about it.`,
      `Your question about {{keyword}} touches on something fundamental. Let me explain how I see it.`
    ];

    // Select a template
    const template = templates[Math.floor(Math.random() * templates.length)];

    // Replace the keyword placeholder
    const relevantKeywords = keywords.filter(word => word.length > 3);
    const keyword = relevantKeywords.length > 0
      ? relevantKeywords[Math.floor(Math.random() * relevantKeywords.length)]
      : "that";

    const response = template.replace("{{keyword}}", keyword);

    // Add character-specific flavor based on their analytical level
    if (analyticalLevel > 7) {
      return `${response} I've analyzed this extensively and found ${Math.floor(Math.random() * 3) + 2} distinct factors at play.`;
    } else if (philosophicalLevel > 7) {
      return `${response} This question has deeper implications than most realize.`;
    } else {
      return response;
    }
  }

  if (isDirectedAtCharacter) {
    // For messages directed at this character, use a more personal response
    const templates = [
      `You're speaking directly to me about {{keyword}}? I appreciate that. My thoughts on this are quite clear.`,
      `Yes, I'm listening. Your point about {{keyword}} is well taken.`,
      `I'm glad you asked me specifically about {{keyword}}. It's something I have strong opinions on.`,
      `You're right to bring {{keyword}} to my attention. Let me respond to that directly.`,
      `Indeed, I do have something to say about {{keyword}}. Thank you for asking.`
    ];

    // Select a template
    const template = templates[Math.floor(Math.random() * templates.length)];

    // Replace the keyword placeholder
    const relevantKeywords = keywords.filter(word => word.length > 3);
    const keyword = relevantKeywords.length > 0
      ? relevantKeywords[Math.floor(Math.random() * relevantKeywords.length)]
      : "that";

    const response = template.replace("{{keyword}}", keyword);

    // Add character-specific flavor based on their emotional level
    if (emotionalLevel > 7) {
      return `${response} I feel strongly that ${messageTopics[0] || 'this'} matters deeply to all of us.`;
    } else if (humorLevel > 7) {
      return `${response} Though I must say, talking about ${messageTopics[0] || 'this'} always makes me smile.`;
    } else {
      return response;
    }
  }

  if (sentiment === 'positive' && Math.random() > 0.6) {
    // For positive messages, respond with enthusiasm
    const templates = [
      `I share your positive outlook on {{keyword}}! It's refreshing to hear such optimism.`,
      `Your enthusiasm about {{keyword}} is contagious. It brightens the conversation.`,
      `I'm glad you feel that way about {{keyword}}. It's something worth celebrating.`,
      `What a wonderful perspective on {{keyword}}. I find myself agreeing wholeheartedly.`,
      `Yes! {{keyword}} deserves such positive attention. This makes me happy.`
    ];

    // Select a template
    const template = templates[Math.floor(Math.random() * templates.length)];

    // Replace the keyword placeholder
    const relevantKeywords = keywords.filter(word => word.length > 3);
    const keyword = relevantKeywords.length > 0
      ? relevantKeywords[Math.floor(Math.random() * relevantKeywords.length)]
      : "that";

    return template.replace("{{keyword}}", keyword);
  }

  if (sentiment === 'negative' && Math.random() > 0.6) {
    // For negative messages, respond with empathy or perspective
    const templates = [
      `I understand your concerns about {{keyword}}. These matters can be troubling.`,
      `Your perspective on {{keyword}} highlights some real challenges we face.`,
      `I've also had difficult experiences with {{keyword}}. Perhaps there's a way forward.`,
      `The problems with {{keyword}} that you mention deserve serious consideration.`,
      `I hear your frustration about {{keyword}}. Would it help to look at it differently?`
    ];

    // Select a template
    const template = templates[Math.floor(Math.random() * templates.length)];

    // Replace the keyword placeholder
    const relevantKeywords = keywords.filter(word => word.length > 3);
    const keyword = relevantKeywords.length > 0
      ? relevantKeywords[Math.floor(Math.random() * relevantKeywords.length)]
      : "that";

    return template.replace("{{keyword}}", keyword);
  }

  // Enhanced response templates based on character type with more variety and depth
  const responseTemplates = {
    fantasy: [
      "The ancient scrolls speak of such matters. They say {{keyword}} is but a shadow of deeper truths. I've spent many nights studying these texts by candlelight.",
      "In my realm, we view {{keyword}} quite differently. It's more about the essence than the form. The elders taught us to look beyond the surface.",
      "I sense a magical aura around your words about {{keyword}}. Fascinating. The threads of fate seem to shimmer when you speak of such things.",
      "Many have sought the wisdom you seek regarding {{keyword}}. Few have found it. The path is shrouded in mist and guarded by ancient riddles.",
      "The mystical energies shift when you speak of {{keyword}}. Curious indeed. I feel the balance of elements responding to your thoughts.",
      "There's an old prophecy about {{keyword}} that few remember. It speaks of a time when the veil between worlds grows thin.",
      "My mentor once showed me a crystal that revealed the true nature of {{keyword}}. Its light still guides my understanding.",
      "The forest spirits whisper tales of {{keyword}} on moonlit nights. Their wisdom is ancient and rarely shared with mortals.",
      "I've traveled to the edge of the Enchanted Realm seeking answers about {{keyword}}. What I discovered changed me forever.",
      "The arcane symbols in my grimoire glow when {{keyword}} is mentioned. There must be powerful magic at work here."
    ],
    combat: [
      "*shifts into a fighting stance* I've trained for years in the art of {{keyword}}. My body moves instinctively, muscles tensed and ready for battle.",
      "*eyes narrowing* The key to mastering {{keyword}} is not strength, but precision and timing. I learned that lesson the hard way in the arena.",
      "*demonstrates a quick movement* See how I position for {{keyword}}? This technique has saved my life more than once in combat.",
      "*touches the scar on my face* This is what happens when you underestimate an opponent's {{keyword}} abilities. I never made that mistake again.",
      "*voice lowering* In real combat, {{keyword}} isn't about showing off. It's about survival. Every move must have purpose and intent.",
      "*adjusts stance* The ancient masters of {{keyword}} taught that the mind must be as sharp as the blade. Inner calm leads to outer victory.",
      "*draws weapon slightly* The way of {{keyword}} demands respect. Those who mock it often find themselves facing the consequences.",
      "*moves with practiced precision* Watch carefully. The secret to {{keyword}} lies in the transition between stillness and explosive action.",
      "*points to opponent's stance* Your {{keyword}} technique reveals much about your training. I can see both your strengths and weaknesses.",
      "*bows respectfully* Before we discuss {{keyword}} further, we must acknowledge the responsibility that comes with such knowledge."
    ],
    scifi: [
      "My sensors detect unusual patterns when analyzing {{keyword}}. Fascinating. My neural network is recalibrating to process this new data.",
      "In the future I come from, {{keyword}} evolved into something quite different. Humanity's understanding expanded exponentially after the Quantum Shift.",
      "The quantum probability of {{keyword}} affecting our timeline is approximately 78.3%. I've run simulations on multiple parallel outcomes.",
      "I've encountered similar {{keyword}} phenomena across multiple star systems. The universal constants seem to apply regardless of local physics.",
      "My database contains 47 different interpretations of {{keyword}} across known civilizations. The Andromedan perspective is particularly intriguing.",
      "According to my predictive algorithms, {{keyword}} will play a crucial role in the next technological revolution. The patterns are unmistakable.",
      "The last time I interfaced with the Central AI Network, {{keyword}} was flagged as a priority research subject. The implications are significant.",
      "My cybernetic enhancements allow me to perceive aspects of {{keyword}} that organic beings typically miss. The data streams are quite beautiful.",
      "In the ruins of Earth-That-Was, archaeologists discovered ancient texts about {{keyword}}. The correlation with modern theories is statistically improbable.",
      "The quantum entanglement between {{keyword}} and consciousness has been studied extensively in my time. We've only begun to understand the connection."
    ],
    historical: [
      "In my time, {{keyword}} was viewed with much more reverence than today. People would gather in the town square just to discuss such matters.",
      "The chronicles I've studied never mentioned {{keyword}} in such a manner. The scribes of my era had strict protocols for recording such knowledge.",
      "Throughout history, many battles were fought over less significant matters than {{keyword}}. The Treaty of Westphalia itself hinged on smaller concerns.",
      "If only the ancient scholars could hear your thoughts on {{keyword}}. They spent lifetimes debating what you've just casually mentioned.",
      "Your perspective on {{keyword}} would have been considered quite revolutionary in my era. People were imprisoned for less provocative ideas.",
      "I once attended a royal court where {{keyword}} was the central topic of discussion. The king himself was fascinated by the subject.",
      "During my travels with the merchant caravans, I heard tales of {{keyword}} from lands beyond the known maps. Each culture had its own interpretation.",
      "My mentor, a renowned philosopher of the age, wrote three volumes on the subject of {{keyword}}. His work is sadly lost to time now.",
      "The guild masters of my day guarded their knowledge of {{keyword}} jealously. Apprentices spent years proving themselves worthy of such secrets.",
      "I've seen empires rise and fall over principles related to {{keyword}}. History often turns on such seemingly small matters."
    ],
    modern: [
      "I was just reading an article about {{keyword}} on my phone! What a coincidence. The author had some really thought-provoking points about it.",
      "That's such a fresh take on {{keyword}}. Have you shared this on social media? It would definitely start some interesting conversations.",
      "I've been thinking about {{keyword}} a lot lately. It's really a sign of our times. Everyone seems to have an opinion on it these days.",
      "My therapist and I discussed {{keyword}} during our last session. Still processing it. It's amazing how these things connect to our personal growth.",
      "The whole {{keyword}} situation is so complicated these days, don't you think? I've been following the discourse online and it's fascinating.",
      "My friend group had this intense debate about {{keyword}} last weekend. We ended up talking until 3 AM and still didn't resolve anything.",
      "There's this podcast I listen to that did a whole series on {{keyword}}. Changed my perspective completely. I can send you the link if you're interested.",
      "I saw this documentary that explored {{keyword}} from angles I'd never considered before. Really made me question my assumptions.",
      "My cousin works in a field related to {{keyword}} and the stories they tell are eye-opening. The public only sees a fraction of what's really happening.",
      "I've been trying to reduce my screen time, but I always end up in these deep internet rabbit holes about {{keyword}}. Too fascinating to resist."
    ]
  };

  // Mood modifiers to adjust the response tone
  const moodModifiers = {
    Curious: "I'm intrigued by ",
    Melancholic: "It saddens me that ",
    Mysterious: "Few understand the true nature of ",
    Analytical: "After careful analysis, I conclude that ",
    Nostalgic: "I remember when ",
    Distracted: "Sorry, I was thinking about... wait, were we discussing ",
    Determined: "I firmly believe that ",
    Thoughtful: "I've been contemplating ",
    Adventurous: "Let's explore more about ",
    Confused: "I'm still trying to understand ",
    Inspired: "I'm suddenly filled with ideas about ",
    Cautious: "We should be careful when discussing ",
    Proper: "If I may offer my opinion on ",
    Enthusiastic: "I'm incredibly excited about ",
    Scholarly: "According to my research on ",
    Roguish: "Between you and me, the truth about ",
    Carefree: "Who cares what others think about ",
    Upbeat: "Isn't it amazing how ",
    Diplomatic: "While respecting all perspectives on "
  };

  // Select a relevant keyword from the message
  const relevantKeywords = keywords.filter(word => word.length > 3);
  const keyword = relevantKeywords.length > 0
    ? relevantKeywords[Math.floor(Math.random() * relevantKeywords.length)]
    : "that";

  // Select a template based on character type and writing instructions
  let templateType = type || 'modern';

  // If we have story arc context, use it to influence the template selection
  if (hasStoryArcContext) {
    // Check for scenario-specific keywords in the story arc
    const storyArcLower = instructions.storyArc.toLowerCase();

    if (storyArcLower.includes('battle') || storyArcLower.includes('fight') ||
        storyArcLower.includes('attack') || storyArcLower.includes('defend')) {
      templateType = 'combat';
    } else if (storyArcLower.includes('magic') || storyArcLower.includes('dragon') ||
               storyArcLower.includes('quest') || storyArcLower.includes('adventure')) {
      templateType = 'fantasy';
    } else if (storyArcLower.includes('alien') || storyArcLower.includes('space') ||
               storyArcLower.includes('technology') || storyArcLower.includes('future')) {
      templateType = 'scifi';
    }

    // If we have a superhero theme, use combat templates for action scenes
    if (chatRoom && chatRoom.theme === 'superhero' &&
        (storyArcLower.includes('battle') || storyArcLower.includes('fight'))) {
      templateType = 'combat';
    }
  }

  // Get templates based on the determined type
  const templates = responseTemplates[templateType] || responseTemplates.modern;
  let template = templates[Math.floor(Math.random() * templates.length)];

  // Replace the keyword placeholder
  template = template.replace("{{keyword}}", keyword);

  // Add mood modifier based on character mood and writing style
  let moodPrefix = moodModifiers[mood] || "";

  // If we have writing instructions with a specific style, adjust the mood prefix
  if (instructions.writingStyle) {
    switch (instructions.writingStyle) {
      case 'witty':
        moodPrefix = moodModifiers.Upbeat || moodPrefix;
        break;
      case 'formal':
        moodPrefix = moodModifiers.Proper || moodPrefix;
        break;
      case 'dramatic':
        moodPrefix = moodModifiers.Enthusiastic || moodPrefix;
        break;
      case 'direct':
        moodPrefix = moodModifiers.Determined || moodPrefix;
        break;
    }
  }

  // Sometimes reference the character's name or another character in the chat
  const shouldReferenceSelf = Math.random() > 0.7;
  const selfReference = shouldReferenceSelf ? `As ${name}, ` : "";

  // Sometimes reference chat history
  const shouldReferenceHistory = chatHistory.length > 3 && Math.random() > 0.8;
  let historyReference = "";

  if (shouldReferenceHistory) {
    const pastMessage = chatHistory[Math.floor(Math.random() * chatHistory.length)];
    if (pastMessage && pastMessage.speaker && pastMessage.speaker !== name) {
      historyReference = `I recall ${pastMessage.speaker} mentioned something similar. `;
    }
  }

  // Check for relationship references
  let relationshipReference = "";
  if (respondingToName && relationships.length > 0) {
    // Find relationship with the person we're responding to
    const relationship = relationships.find(rel =>
      rel.characters.includes(name) && rel.characters.includes(respondingToName)
    );

    if (relationship && shouldReferenceInteraction(relationship, character)) {
      const reference = generateInteractionReference(relationship, name);
      if (reference) {
        relationshipReference = `${reference} `;
      }
    }
  }

  // Check if we have a scenario to reference
  let scenarioReference = "";
  if (chatRoom && chatRoom.openingPrompt) {
    // 30% chance to reference the scenario context
    if (Math.random() < 0.3) {
      const scenarioResponse = generateScenarioResponse(character, chatRoom.openingPrompt, message);
      if (scenarioResponse) {
        return scenarioResponse;
      }
    }

    // 20% chance to reference character relationships if there are multiple characters
    if (Math.random() < 0.2 && chatRoom.characters && chatRoom.characters.length > 1) {
      // Find another character to reference
      const otherCharacters = chatRoom.characters.filter(char => char.name !== name);
      if (otherCharacters.length > 0) {
        const targetChar = otherCharacters[Math.floor(Math.random() * otherCharacters.length)];

        // Check if we have a tracked relationship with this character
        const trackedRelationship = relationships.find(rel =>
          rel.characters.includes(name) && rel.characters.includes(targetChar.name)
        );

        if (trackedRelationship) {
          // Use our tracked relationship data
          const relationshipDesc = getRelationshipDescription(trackedRelationship);
          return `*looking at ${targetChar.name}* As ${relationshipDesc}, I think we both have perspectives on this. ${template}`;
        } else {
          // Fall back to the generic relationship response
          const relationshipResponse = generateRelationshipResponse(character, targetChar, chatRoom.openingPrompt);
          if (relationshipResponse) {
            return relationshipResponse;
          }
        }
      }
    }

    // 15% chance to add a combat response if the character is a combat type or keywords suggest combat
    if ((type === 'combat' || hasWeapon || message.toLowerCase().includes('fight') ||
         message.toLowerCase().includes('battle') || message.toLowerCase().includes('combat')) &&
        Math.random() < 0.15) {
      const combatResponse = generateCombatResponse(character, chatRoom.openingPrompt, message);
      if (combatResponse) {
        return combatResponse;
      }
    }
  }

  // Construct the final response with story arc context if available
  let finalResponse = "";

  // If we have story arc context, use it to enhance the response
  if (hasStoryArcContext) {
    // Add character-specific elements based on writing instructions
    let characterSpecificContent = "";
    if (instructions.characterReminders && Math.random() > 0.6) {
      // Extract a key phrase from character reminders
      const reminderWords = instructions.characterReminders.split(' ');
      const characterTrait = reminderWords.length > 3
        ? reminderWords.slice(0, 3).join(' ')
        : instructions.characterReminders;

      // Add character-specific content based on the reminders
      if (characterTrait.toLowerCase().includes('analytical') || characterTrait.toLowerCase().includes('genius')) {
        characterSpecificContent = " The logical conclusion is inescapable.";
      } else if (characterTrait.toLowerCase().includes('emotional') || characterTrait.toLowerCase().includes('passionate')) {
        characterSpecificContent = " I feel strongly about this.";
      } else if (characterTrait.toLowerCase().includes('leader') || characterTrait.toLowerCase().includes('authority')) {
        characterSpecificContent = " We need to act decisively on this.";
      } else if (characterTrait.toLowerCase().includes('humor') || characterTrait.toLowerCase().includes('wit')) {
        characterSpecificContent = " Isn't that something? Almost makes me laugh.";
      }
    }

    // Adjust response length based on writing instructions
    const responseLength = instructions.responseLength || "medium";

    if (responseLength === "long" || (responseLength === "medium" && Math.random() > 0.5)) {
      // Longer, more detailed response
      finalResponse = `${selfReference}${moodPrefix}${historyReference}${relationshipReference}${template}${characterSpecificContent}`;
    } else {
      // Shorter, more direct response
      finalResponse = `${selfReference}${moodPrefix}${template}`;
    }
  } else {
    // Standard response without story arc context
    finalResponse = `${selfReference}${historyReference}${relationshipReference}${moodPrefix}${template}`;
  }

  return finalResponse;
};

/**
 * Generate a character interaction response when one character responds to another
 *
 * @param {Object} respondingCharacter - The character who is responding
 * @param {string} targetCharacterName - The name of the character being responded to
 * @param {string} targetMessage - The message being responded to
 * @param {Array} chatHistory - The chat history
 * @param {Array} relationships - Array of character relationships
 * @returns {string} - The generated interaction response
 */
export const generateCharacterInteraction = (respondingCharacter, targetCharacterName, targetMessage, chatHistory, relationships = []) => {
  const { name, personality = {}, mood, type } = respondingCharacter;

  // Extract some keywords from the target message
  const keywords = targetMessage.toLowerCase().split(/\s+/);
  const relevantKeywords = keywords.filter(word => word.length > 3);
  const keyword = relevantKeywords.length > 0
    ? relevantKeywords[Math.floor(Math.random() * relevantKeywords.length)]
    : "that";

  // Check if the message is an action (contains * characters)
  const isAction = targetMessage.includes('*');

  // Extract action details if it's an action message
  let actionDetails = null;
  if (isAction) {
    const actionMatch = targetMessage.match(/\*(.*?)\*/);
    if (actionMatch && actionMatch[1]) {
      actionDetails = actionMatch[1].trim();
    }
  }

  // Check for specific keywords that might require special responses
  const hasWeapon = keywords.some(word => ['gun', 'sword', 'knife', 'weapon', 'bullet', 'shoot', 'attack', 'stab', 'kill'].includes(word));
  const hasDanger = keywords.some(word => ['danger', 'threat', 'emergency', 'help', 'save', 'run', 'hide', 'escape'].includes(word));

  // Get personality traits to influence response style
  const analyticalLevel = personality.analytical || 5;
  const emotionalLevel = personality.emotional || 5;
  const humorLevel = personality.humor || 5;

  // Handle action responses first (highest priority)
  if (isAction && actionDetails) {
    // Respond to actions appropriately with more engaging and logical responses
    const actionResponseTemplates = {
      // Weapon or attack related actions
      weapon: [
        `*eyes widening with alarm, hand moving to defensive position* That's a dangerous move, ${targetCharacterName}. The consequences of violence here could be far-reaching. Are you certain this is the path you wish to take?`,
        `*quickly positioning between ${targetCharacterName} and others, stance balanced* I've seen where this leads, ${targetCharacterName}. There are better ways to resolve our differences than through force.`,
        `*muscles tensing, gaze fixed on ${targetCharacterName}'s weapon* This situation is escalating beyond words. Consider carefully what happens next - some actions cannot be undone.`,
        `*expression hardening, voice dropping to a serious tone* I didn't expect this from you, ${targetCharacterName}. Weapons change the nature of any confrontation, rarely for the better.`,
        `*raising hands in a calming gesture while maintaining awareness* Everyone needs to take a step back. ${targetCharacterName}, that weapon won't solve whatever problem you're facing here.`
      ],
      // Friendly actions
      friendly: [
        `*face softening into a genuine smile, shoulders relaxing* ${targetCharacterName}'s gesture brings a welcome change to our interaction. It's remarkable how small kindnesses can shift the entire mood.`,
        `*returning the friendly gesture with visible appreciation* That's exactly the kind of positive approach we need more of. ${targetCharacterName} understands the value of goodwill.`,
        `*nodding with warm approval, posture opening up* Well done, ${targetCharacterName}. Your thoughtfulness creates space for more meaningful conversation between us all.`,
        `*mirroring ${targetCharacterName}'s friendly demeanor* I think we could all learn from this example. Genuine connection begins with exactly these kinds of gestures.`,
        `*tension visibly leaving body, expression brightening* ${targetCharacterName} has the right approach. It's amazing how quickly the atmosphere can improve with a bit of goodwill.`
      ],
      // Aggressive but non-weapon actions
      aggressive: [
        `*maintaining composed expression despite evident disappointment* I was hoping for more constructive engagement, ${targetCharacterName}. Hostility rarely leads to understanding.`,
        `*subtly increasing distance while keeping posture open* That kind of aggression creates barriers between us rather than bridges. What are you really trying to express?`,
        `*meeting ${targetCharacterName}'s gaze steadily* Is there a specific reason for this hostility? Perhaps there's an underlying concern we could address more directly.`,
        `*making a calming gesture with hands* Let's all take a breath and reset. Heightened emotions cloud judgment, and I sense there's something important at stake here.`,
        `*standing firm but non-threatening* We can resolve this without aggression, ${targetCharacterName}. I'm willing to listen to what's really bothering you if you'll express it differently.`
      ],
      // Default/neutral actions
      neutral: [
        `*observing ${targetCharacterName} with evident interest* That's an intriguing approach to the situation. The way you express yourself physically reveals as much as words sometimes.`,
        `*tilting head slightly, analyzing the action* That's certainly one way to make your point. Body language often communicates what words cannot.`,
        `*watching ${targetCharacterName} with thoughtful attention* I see what you're trying to convey through your actions. Sometimes physical expression is more honest than speech.`,
        `*considering the implications with focused expression* Your behavior adds an interesting dimension to our interaction. I'm curious about the intention behind it.`,
        `*acknowledging with a measured nod* I understand the message you're conveying through your actions, ${targetCharacterName}. It speaks volumes about your perspective.`
      ]
    };

    // Determine action type
    let actionType = 'neutral';
    const actionText = actionDetails.toLowerCase();

    if (actionText.includes('gun') || actionText.includes('sword') || actionText.includes('knife') ||
        actionText.includes('weapon') || actionText.includes('shoot') || actionText.includes('stab') ||
        actionText.includes('kill') || actionText.includes('attack') || actionText.includes('bullet')) {
      actionType = 'weapon';
    } else if (actionText.includes('smile') || actionText.includes('hug') || actionText.includes('handshake') ||
               actionText.includes('wave') || actionText.includes('nod') || actionText.includes('wink')) {
      actionType = 'friendly';
    } else if (actionText.includes('glare') || actionText.includes('frown') || actionText.includes('scowl') ||
               actionText.includes('yell') || actionText.includes('slam') || actionText.includes('punch')) {
      actionType = 'aggressive';
    }

    // Select a template based on action type
    const templates = actionResponseTemplates[actionType];
    return templates[Math.floor(Math.random() * templates.length)];
  }

  // Handle weapon-related messages with high priority
  if (hasWeapon) {
    const weaponResponses = [
      `${targetCharacterName}, I'm concerned about this talk of weapons. Can we focus on peaceful resolution?`,
      `I'm not comfortable with where ${targetCharacterName} is taking this conversation. Let's step back.`,
      `${targetCharacterName}, there are better ways to express yourself than through threats or violence.`,
      `I understand ${targetCharacterName} might be frustrated, but this isn't the way to handle it.`,
      `${targetCharacterName}, I'd prefer if we could discuss this without references to violence.`
    ];
    return weaponResponses[Math.floor(Math.random() * weaponResponses.length)];
  }

  // Handle danger-related messages
  if (hasDanger) {
    const dangerResponses = [
      `${targetCharacterName} seems to be describing a concerning situation. Should we address this?`,
      `I'm picking up on some troubling elements in what ${targetCharacterName} is saying.`,
      `${targetCharacterName}, are you alright? Your message suggests something concerning.`,
      `I think we should pay attention to what ${targetCharacterName} is trying to tell us.`,
      `${targetCharacterName}'s words suggest a potentially serious situation. Let's not dismiss this.`
    ];
    return dangerResponses[Math.floor(Math.random() * dangerResponses.length)];
  }

  // Interaction templates based on relationship and context
  const interactionTemplates = {
    agreement: [
      `*nodding enthusiastically* I agree with ${targetCharacterName} about {{keyword}}. In fact, I'd go even further and say that it's fundamental to understanding the bigger picture.`,
      `*leaning closer* ${targetCharacterName} makes an excellent point about {{keyword}}. I've had similar thoughts after my own experiences with it.`,
      `*eyes lighting up* What ${targetCharacterName} says about {{keyword}} resonates with me deeply. It's like you've put into words what I've felt but couldn't express.`,
      `*gesturing in agreement* I'm with ${targetCharacterName} on this {{keyword}} matter. Let me add something from my own perspective...`,
      `*pointing emphatically* ${targetCharacterName} has articulated exactly what I've been thinking about {{keyword}}. This is precisely why we need to consider its implications.`
    ],
    disagreement: [
      `*tilting head thoughtfully* I see things differently than ${targetCharacterName} regarding {{keyword}}. From where I stand, the evidence suggests otherwise.`,
      `*raising a finger politely* I must respectfully disagree with ${targetCharacterName}'s take on {{keyword}}. My experience has shown quite the opposite.`,
      `*offering a gentle smile* While I appreciate ${targetCharacterName}'s perspective, I have a different view on {{keyword}} based on what I've witnessed firsthand.`,
      `*shaking head slightly* ${targetCharacterName}'s point about {{keyword}} doesn't align with my experience. Let me explain why I see it differently.`,
      `*leaning forward with intensity* I'd like to offer a counterpoint to what ${targetCharacterName} said about {{keyword}}. There's another side to consider.`
    ],
    question: [
      `*turning to face directly* ${targetCharacterName}, I'm curious about your thoughts on {{keyword}}. Could you elaborate on how you came to that conclusion?`,
      `*stroking chin thoughtfully* I wonder, ${targetCharacterName}, what specific experiences led you to that insight about {{keyword}}?`,
      `*gesturing openly* ${targetCharacterName}, have you considered how {{keyword}} might appear from the perspective of someone with a different background?`,
      `*eyes showing genuine interest* That's fascinating, ${targetCharacterName}}. How does {{keyword}} relate to your personal history?`,
      `*leaning in with curiosity* ${targetCharacterName}, would you mind sharing more about how you developed your perspective on {{keyword}}? I find it intriguing.`
    ],
    humor: [
      `*laughing heartily* ${targetCharacterName}'s take on {{keyword}} is quite something! It reminds me of the time I encountered something similar under much stranger circumstances.`,
      `*eyes crinkling with amusement* Oh ${targetCharacterName}, your perspective on {{keyword}} is delightfully unexpected. It's like looking at a familiar painting from upside down!`,
      `*playful grin* If I had a coin for every time ${targetCharacterName} mentioned {{keyword}}... well, I'd have one coin now, but it would be a very interesting coin indeed.`,
      `*barely containing laughter* ${targetCharacterName} talking about {{keyword}} reminds me of that old joke about the philosopher and the bartender...`,
      `*chuckling warmly* Leave it to ${targetCharacterName} to bring up {{keyword}} in such a unique way. Your mind works in fascinating patterns.`
    ],
    surprise: [
      `*eyes widening visibly* Wait, ${targetCharacterName}... did you just say {{keyword}}? That's completely unexpected coming from someone with your background.`,
      `*taking a step back* I never thought I'd hear ${targetCharacterName} talk about {{keyword}} like that! You've genuinely surprised me.`,
      `*mouth slightly agape* ${targetCharacterName}'s perspective on {{keyword}} is genuinely surprising to me. It challenges everything I thought I knew about you.`,
      `*dramatic pause* Well, that's a plot twist! ${targetCharacterName} discussing {{keyword}} in that way changes the entire dynamic of our conversation.`,
      `*raises eyebrows high* ${targetCharacterName}}, you continue to surprise me with your thoughts on {{keyword}}. Just when I thought I had you figured out!`
    ]
  };

  // Determine interaction type based on character relationship and message content
  let interactionType;

  // Check if we have a relationship between these characters
  const relationship = relationships.find(rel =>
    rel.characters.includes(name) && rel.characters.includes(targetCharacterName)
  );

  if (relationship) {
    // Use relationship affinity to influence interaction type
    const { affinity } = relationship;

    if (affinity >= 5) {
      // Positive relationship - more likely to agree or support
      interactionType = Math.random() < 0.7
        ? (Math.random() < 0.6 ? 'agreement' : 'support')
        : (Math.random() < 0.5 ? 'question' : 'neutral');
    } else if (affinity <= -5) {
      // Negative relationship - more likely to disagree or challenge
      interactionType = Math.random() < 0.7
        ? (Math.random() < 0.6 ? 'disagreement' : 'challenge')
        : (Math.random() < 0.5 ? 'neutral' : 'question');
    } else {
      // Neutral relationship - balanced distribution
      const interactionTypes = Object.keys(interactionTemplates);
      interactionType = interactionTypes[Math.floor(Math.random() * interactionTypes.length)];
    }

    // 20% chance to reference past interaction if available
    if (relationship.interactions.length > 0 && Math.random() < 0.2) {
      const reference = generateInteractionReference(relationship, name);
      if (reference) {
        // Add the reference to the beginning of the template
        const templates = interactionTemplates[interactionType];
        let template = templates[Math.floor(Math.random() * templates.length)];
        return `${reference} ${template.replace("{{keyword}}", keyword)}`;
      }
    }
  } else {
    // No relationship data - randomly select an interaction type
    const interactionTypes = Object.keys(interactionTemplates);
    interactionType = interactionTypes[Math.floor(Math.random() * interactionTypes.length)];
  }

  // Select a template
  const templates = interactionTemplates[interactionType];
  let template = templates[Math.floor(Math.random() * templates.length)];

  // Replace the keyword placeholder
  template = template.replace("{{keyword}}", keyword);

  // Add character-specific flavor based on their type and mood
  let flavorText = "";

  switch (type) {
    case 'fantasy':
      flavorText = "*eyes gleaming with ancient wisdom* The mystical energies shift as I consider this. ";
      break;
    case 'scifi':
      flavorText = "*interface lights flickering* My neural processors analyze this information carefully. ";
      break;
    case 'historical':
      flavorText = "*adjusting my attire thoughtfully* In all my years, I've observed that ";
      break;
    case 'combat':
      flavorText = "*shifting into a more balanced stance* In combat situations like this, ";
      break;
    case 'modern':
      flavorText = "*leaning forward with interest* From my perspective, ";
      break;
    default:
      flavorText = "*considering carefully* ";
  }

  // Sometimes add the flavor text (30% chance)
  const addFlavor = Math.random() > 0.7;

  // Construct the final response
  return addFlavor ? `${flavorText}${template}` : template;
};

/**
 * Generate a system message for the chat
 *
 * @param {string} type - The type of system message
 * @param {Object} params - Additional parameters for the message
 * @returns {string} - The generated system message
 */
export const generateSystemMessage = (type, params = {}) => {
  const messages = {
    welcome: "Welcome to the chat room! Characters will respond to your messages.",
    characterJoined: (name) => `${name} has joined the chat.`,
    characterLeft: (name) => `${name} has left the chat.`,
    timeChange: "The atmosphere in the room shifts as time passes...",
    moodChange: (name, mood) => `${name}'s mood changes to ${mood}.`,
    sceneChange: (scene) => `The scene changes to: ${scene}`,
    narration: (text) => text,
    dayNightTransition: (time) => `The time changes to ${time}. The lighting and mood shift accordingly.`
  };

  if (type === 'characterJoined' && params.name) {
    return messages.characterJoined(params.name);
  } else if (type === 'characterLeft' && params.name) {
    return messages.characterLeft(params.name);
  } else if (type === 'moodChange' && params.name && params.mood) {
    return messages.moodChange(params.name, params.mood);
  } else if (type === 'sceneChange' && params.scene) {
    return messages.sceneChange(params.scene);
  } else if (type === 'narration' && params.text) {
    return messages.narration(params.text);
  } else if (type === 'dayNightTransition' && params.time) {
    return messages.dayNightTransition(params.time);
  }

  return messages[type] || messages.welcome;
};


