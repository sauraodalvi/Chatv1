/**
 * Utility functions for maintaining and using scenario context in chat responses
 */

/**
 * Extract key elements from a scenario prompt
 * @param {string} scenarioPrompt - The full scenario prompt
 * @returns {Object} - Extracted scenario elements
 */
export const extractScenarioElements = (scenarioPrompt) => {
  if (!scenarioPrompt) return {};

  // Default elements
  const elements = {
    setting: "",
    time: "",
    weather: "",
    mood: "",
    relationships: [],
    conflict: "",
    goals: [],
    sensoryDetails: [],
    characterMotivations: [],
    socialDynamics: [],
    emotionalUndercurrents: [],
  };

  // Extract setting (location) - expanded to include more location types
  const settingMatches = scenarioPrompt.match(
    /(?:in|at|near|inside|outside|within) (?:the |a |an )?([\w\s\-']+(?:castle|fortress|keep|tower|forest|woods|grove|city|town|village|hamlet|house|mansion|palace|temple|shrine|cave|cavern|dungeon|crypt|ship|vessel|space station|starship|laboratory|workshop|office|building|school|university|academy|hospital|clinic|cafe|restaurant|bar|tavern|inn|hotel|lodge|apartment|room|hall|chamber|kingdom|realm|dimension|world|planet|galaxy|universe|district|quarter|street|alley|market|bazaar|square|plaza|garden|park|battlefield|arena|stadium|theater|library|museum|ruins|beach|shore|coast|island|mountain|valley|desert|swamp|marsh|river|lake|ocean|sea))/gi
  );
  if (settingMatches && settingMatches.length > 0) {
    elements.setting = settingMatches[0].trim();
  }

  // Extract time of day - expanded with more specific times
  const timeMatches = scenarioPrompt.match(
    /(?:morning|dawn|daybreak|sunrise|early hours|midmorning|noon|midday|afternoon|late afternoon|evening|dusk|sunset|twilight|night|midnight|late night|small hours|dark hours|daylight|darkness|first light|golden hour)/gi
  );
  if (timeMatches && timeMatches.length > 0) {
    elements.time = timeMatches[0].trim();
  }

  // Extract weather - expanded with more weather conditions
  const weatherMatches = scenarioPrompt.match(
    /(?:sunny|bright|clear|cloudy|overcast|partly cloudy|rainy|drizzling|pouring|stormy|thunderous|lightning|foggy|misty|hazy|snowy|blizzard|sleet|hail|windy|breezy|gusty|calm|still|humid|dry|arid|cold|cool|chilly|warm|hot|scorching|freezing|icy|frosty)/gi
  );
  if (weatherMatches && weatherMatches.length > 0) {
    elements.weather = weatherMatches[0].trim();
  }

  // Extract mood/atmosphere - expanded with more emotional states
  const moodMatches = scenarioPrompt.match(
    /(?:tense|peaceful|mysterious|exciting|melancholic|joyful|anxious|fearful|hopeful|desperate|chaotic|serene|ominous|cheerful|gloomy|eerie|magical|dangerous|safe|hostile|friendly|welcoming|threatening|foreboding|suspenseful|romantic|nostalgic|whimsical|solemn|reverent|sacred|profane|oppressive|liberating|inspiring|depressing|uplifting|somber|celebratory|festive|mournful|tense|relaxed|frantic|calm|charged|electric|stifling|refreshing|intimidating|comforting)/gi
  );
  if (moodMatches && moodMatches.length > 0) {
    elements.mood = moodMatches[0].trim();
  }

  // Extract relationships - expanded with more relationship types
  const relationshipMatches = scenarioPrompt.match(
    /(?:friends|enemies|rivals|allies|family|colleagues|strangers|lovers|partners|teammates|classmates|neighbors|acquaintances|siblings|parent|child|mentor|student|teacher|boss|employee|leader|follower|comrades|adversaries|companions|confidants|conspirators|accomplices|subjects|rulers|servants|masters|disciples|guides|protectors|wards|betrothed|spouses|ex-lovers|nemeses|competitors|collaborators|co-conspirators|clan members|tribe members|guild members|crew members|squad members|team members|former friends|estranged family|long-lost relatives|new acquaintances|old flames)/gi
  );
  if (relationshipMatches) {
    elements.relationships = relationshipMatches;
  }

  // Extract conflict - expanded with more conflict types
  const conflictMatches = scenarioPrompt.match(
    /(?:conflict|problem|challenge|obstacle|threat|danger|crisis|dilemma|struggle|quest|mission|task|goal|objective|puzzle|mystery|secret|betrayal|deception|misunderstanding|disagreement|argument|fight|battle|war|competition|race|contest|rivalry|feud|vendetta|grudge|dispute|confrontation|standoff|showdown|duel|ambush|siege|rebellion|uprising|revolution|invasion|heist|theft|assassination|sabotage|conspiracy|investigation|manhunt|rescue|escape|survival|negotiation|diplomacy|reconciliation|redemption|vengeance|revenge|justice|injustice|oppression|resistance)/gi
  );
  if (conflictMatches && conflictMatches.length > 0) {
    elements.conflict = conflictMatches[0].trim();
  }

  // Extract sensory details
  const sensoryMatches = scenarioPrompt.match(
    /(?:smell|scent|aroma|fragrance|odor|taste|flavor|sound|noise|echo|whisper|roar|thunder|sight|view|vision|scene|landscape|texture|feel|touch|sensation|warmth|cold|breeze|vibration)/gi
  );
  if (sensoryMatches) {
    elements.sensoryDetails = sensoryMatches;
  }

  // Extract character motivations
  const motivationMatches = scenarioPrompt.match(
    /(?:desire|want|need|seek|crave|yearn|hope|wish|dream|ambition|goal|aspiration|motivation|drive|purpose|intention|objective|agenda|plan|scheme|plot|motive|reason|incentive|impulse|urge|compulsion|obsession|fixation|determination|resolve|commitment|dedication|passion|fear|anxiety|worry|concern|dread|terror|horror|panic|apprehension|trepidation|reluctance|hesitation|doubt|uncertainty|suspicion|mistrust|distrust|paranoia|skepticism|cynicism|pessimism|optimism|faith|trust|belief|confidence|assurance|certainty|conviction|loyalty|devotion|allegiance|fidelity|honor|duty|obligation|responsibility|guilt|shame|remorse|regret|sorrow|grief|mourning|loss|longing|nostalgia|melancholy|sadness|depression|despair|hopelessness|helplessness|powerlessness|vulnerability|weakness|fragility|insecurity|inadequacy|inferiority|superiority|pride|arrogance|hubris|vanity|ego|self-importance|self-confidence|self-esteem|self-worth|self-respect|self-image|self-perception|self-awareness|self-knowledge|self-discovery|self-realization|self-actualization|self-fulfillment|self-satisfaction|self-gratification|self-indulgence|self-denial|self-sacrifice|self-control|self-discipline|self-restraint|self-regulation|self-mastery|self-improvement|self-development|self-growth|self-transformation|self-transcendence)/gi
  );
  if (motivationMatches) {
    elements.characterMotivations = motivationMatches;
  }

  // Extract social dynamics
  const socialMatches = scenarioPrompt.match(
    /(?:hierarchy|status|rank|position|role|authority|power|influence|control|dominance|submission|obedience|compliance|resistance|rebellion|defiance|disobedience|cooperation|collaboration|teamwork|partnership|alliance|coalition|faction|group|community|society|culture|tradition|custom|ritual|ceremony|celebration|festival|gathering|meeting|assembly|council|court|tribunal|judgment|verdict|sentence|punishment|reward|recognition|acknowledgment|appreciation|gratitude|thanks|praise|compliment|flattery|criticism|condemnation|disapproval|rejection|acceptance|inclusion|exclusion|isolation|alienation|ostracism|banishment|exile|outcast|pariah|scapegoat|victim|perpetrator|bystander|witness|observer|participant|actor|agent|subject|object|target|recipient|beneficiary|benefactor|patron|client|customer|supplier|provider|producer|consumer|user|audience|spectator|viewer|listener|reader|writer|speaker|performer|entertainer|host|guest|visitor|stranger|foreigner|native|local|resident|citizen|immigrant|refugee|asylum seeker|expatriate|nomad|wanderer|traveler|explorer|adventurer|pioneer|settler|colonist|indigenous|aboriginal|tribal|clan|family|household|lineage|ancestry|heritage|legacy|inheritance|birthright|privilege|advantage|disadvantage|handicap|disability|ability|capability|competence|skill|talent|gift|aptitude|knack|flair|genius|prodigy|savant|expert|specialist|professional|amateur|novice|beginner|apprentice|student|pupil|disciple|follower|adherent|devotee|fan|enthusiast|aficionado|connoisseur|critic|judge|arbiter|mediator|negotiator|diplomat|ambassador|representative|delegate|proxy|agent|broker|middleman|intermediary|go-between|liaison|contact|connection|network|web|nexus|hub|center|periphery|margin|fringe|edge|boundary|border|frontier|threshold|limit|extent|scope|range|reach|influence|impact|effect|consequence|result|outcome|conclusion|end|beginning|start|origin|source|cause|reason|explanation|justification|excuse|alibi|pretext|pretense|facade|mask|disguise|camouflage|concealment|hiding|secrecy|privacy|confidentiality|disclosure|revelation|exposure|discovery|finding|realization|recognition|understanding|comprehension|knowledge|wisdom|insight|intuition|perception|awareness|consciousness|mindfulness|attention|focus|concentration|distraction|diversion|entertainment|amusement|pleasure|enjoyment|satisfaction|fulfillment|contentment|happiness|joy|delight|elation|ecstasy|euphoria|bliss|rapture|thrill|excitement|anticipation|expectation|hope|optimism|pessimism|cynicism|skepticism|doubt|uncertainty|confusion|bewilderment|perplexity|puzzlement|mystery|enigma|riddle|question|inquiry|investigation|exploration|search|quest|journey|path|way|road|route|direction|orientation|guidance|leadership|management|administration|governance|rule|reign|domain|territory|realm|kingdom|empire|nation|state|country|land|region|area|zone|space|place|location|position|situation|circumstance|condition|state|status|standing|reputation|fame|celebrity|notoriety|infamy|disgrace|shame|honor|glory|pride|dignity|respect|esteem|admiration|adoration|worship|reverence|veneration|awe|wonder|amazement|astonishment|surprise|shock|trauma|crisis|emergency|disaster|catastrophe|calamity|tragedy|comedy|drama|romance|adventure|thriller|horror|fantasy|science fiction|reality|truth|fact|fiction|fantasy|imagination|creativity|innovation|invention|discovery|breakthrough|revolution|evolution|progress|development|growth|expansion|increase|decrease|reduction|diminution|contraction|shrinkage|decline|fall|collapse|ruin|destruction|devastation|annihilation|extinction|death|life|birth|rebirth|renewal|regeneration|resurrection|revival|recovery|healing|cure|remedy|treatment|therapy|medicine|drug|poison|toxin|venom|antidote|vaccine|immunity|resistance|vulnerability|susceptibility|sensitivity|allergy|reaction|response|stimulus|trigger|catalyst|agent|cause|effect|result|consequence|outcome|conclusion|end|beginning)/gi
  );
  if (socialMatches) {
    elements.socialDynamics = socialMatches;
  }

  // Extract emotional undercurrents
  const emotionalMatches = scenarioPrompt.match(
    /(?:tension|anxiety|fear|dread|terror|horror|panic|alarm|shock|surprise|astonishment|amazement|wonder|awe|admiration|respect|esteem|regard|reverence|veneration|worship|adoration|love|affection|fondness|attachment|devotion|passion|desire|lust|yearning|longing|nostalgia|homesickness|melancholy|sadness|sorrow|grief|mourning|despair|despondency|depression|gloom|misery|woe|anguish|agony|pain|suffering|distress|discomfort|unease|disquiet|concern|worry|apprehension|foreboding|presentiment|premonition|anticipation|expectation|hope|optimism|confidence|assurance|certainty|conviction|belief|faith|trust|doubt|uncertainty|hesitation|reluctance|resistance|opposition|defiance|rebellion|revolt|anger|rage|fury|wrath|indignation|outrage|resentment|bitterness|rancor|spite|malice|hatred|loathing|disgust|revulsion|abhorrence|contempt|disdain|scorn|derision|mockery|ridicule|sarcasm|irony|cynicism|skepticism|suspicion|mistrust|distrust|paranoia|jealousy|envy|covetousness|greed|avarice|gluttony|lust|sloth|laziness|indolence|apathy|indifference|boredom|ennui|weariness|fatigue|exhaustion|depletion|emptiness|hollowness|void|vacuum|nothingness|meaninglessness|purposelessness|futility|vanity|triviality|insignificance|unimportance|irrelevance|redundancy|superfluity|excess|abundance|plenty|sufficiency|adequacy|satisfaction|contentment|fulfillment|completion|wholeness|integrity|unity|harmony|balance|equilibrium|stability|security|safety|comfort|ease|relaxation|peace|tranquility|serenity|calm|stillness|quiet|silence|solitude|isolation|loneliness|alienation|estrangement|separation|division|discord|conflict|struggle|strife|hostility|antagonism|enmity|animosity|antipathy|aversion|dislike|displeasure|dissatisfaction|disappointment|frustration|exasperation|irritation|annoyance|vexation|provocation|aggravation|agitation|perturbation|disturbance|disruption|disorder|chaos|confusion|bewilderment|perplexity|puzzlement|mystery|enigma|riddle|question|inquiry|curiosity|interest|fascination|captivation|enchantment|enthrallment|rapture|ecstasy|euphoria|elation|exhilaration|excitement|thrill|stimulation|arousal|activation|animation|vitality|vigor|energy|dynamism|force|power|strength|might|potency|capability|competence|skill|ability|talent|gift|aptitude|genius|brilliance|intelligence|wisdom|knowledge|understanding|comprehension|insight|intuition|perception|awareness|consciousness|mindfulness|attention|focus|concentration|absorption|immersion|engagement|involvement|participation|inclusion|belonging|acceptance|approval|validation|confirmation|affirmation|recognition|acknowledgment|appreciation|gratitude|thankfulness|indebtedness|obligation|duty|responsibility|burden|weight|pressure|stress|strain|tension)/gi
  );
  if (emotionalMatches) {
    elements.emotionalUndercurrents = emotionalMatches;
  }

  return elements;
};

/**
 * Generate a response that references the scenario context
 * @param {Object} character - The character object
 * @param {string} scenarioPrompt - The scenario prompt
 * @param {string} message - The message to respond to
 * @returns {string} - A scenario-relevant response
 */
export const generateScenarioResponse = (
  character,
  scenarioPrompt,
  message
) => {
  if (!scenarioPrompt) return null;

  const elements = extractScenarioElements(scenarioPrompt);
  const { type, mood, name } = character;

  // Create scenario-specific templates based on character type and scenario elements
  const templates = [];

  // Setting-based templates
  if (elements.setting) {
    templates.push(
      `*glancing around ${
        elements.setting
      }* This place reminds me of something important. ${
        message.length > 20
          ? "But regarding what you said about " +
            message.substring(0, 20) +
            "..."
          : "What were you saying?"
      }`,
      `*taking in the surroundings of ${
        elements.setting
      }* Being here changes how I see things. ${
        message.length > 20
          ? "Especially concerning " + message.substring(0, 20) + "..."
          : ""
      }`,
      `The atmosphere of ${elements.setting} makes me think differently about what you're saying.`
    );
  }

  // Time-based templates
  if (elements.time) {
    templates.push(
      `*noticing the ${elements.time} light* At this hour, everything feels different. Your words carry more weight.`,
      `There's something about ${elements.time} that makes conversations like this more meaningful.`,
      `*gesturing to the ${
        elements.time
      } sky* This time of day always makes me more ${
        mood.toLowerCase() || "thoughtful"
      } about such matters.`
    );
  }

  // Weather-based templates
  if (elements.weather) {
    templates.push(
      `*feeling the ${elements.weather} conditions* Weather like this always affects my thoughts on such matters.`,
      `The ${elements.weather} weather seems fitting for this conversation, doesn't it?`,
      `*adjusting to the ${elements.weather} conditions* In weather like this, I tend to be more direct. So let me tell you what I really think...`
    );
  }

  // Mood/atmosphere-based templates
  if (elements.mood) {
    templates.push(
      `The ${elements.mood} atmosphere makes me consider your words more carefully.`,
      `*sensing the ${elements.mood} mood* In moments like this, I find myself being more honest than usual.`,
      `There's a ${elements.mood} feeling in the air that's influencing how I respond to you.`
    );
  }

  // Conflict-based templates
  if (elements.conflict) {
    templates.push(
      `With this ${elements.conflict} looming over us, I find your perspective particularly interesting.`,
      `*thinking about the ${elements.conflict}* This situation forces us to reconsider everything, including what you just said.`,
      `Given the ${elements.conflict} we're facing, I think we need to approach this conversation differently.`
    );
  }

  // Relationship-based templates
  if (elements.relationships.length > 0) {
    const relationship = elements.relationships[0];
    templates.push(
      `As ${relationship}, we should be honest with each other about these matters.`,
      `Our relationship as ${relationship} gives me a unique perspective on what you're saying.`,
      `*considering our status as ${relationship}* This dynamic between us colors everything we discuss.`
    );
  }

  // Character type-specific scenario templates
  switch (type) {
    case "fantasy":
      templates.push(
        `*eyes glowing faintly* The magical energies in this scenario are affecting my perception of your words.`,
        `*gesturing mystically* In a world of magic and wonder, conversations like this take on new meaning.`,
        `*whispering ancient words* The arcane forces at play here influence how I must respond to you.`
      );
      break;
    case "scifi":
      templates.push(
        `*checking wrist device* My sensors are detecting unusual patterns in this scenario that relate to our conversation.`,
        `*eyes flickering with data* The technological implications of this situation affect my analysis of your statement.`,
        `*adjusting neural interface* In this advanced setting, your words carry additional significance.`
      );
      break;
    case "historical":
      templates.push(
        `*adjusting period attire* In times like these, one must consider tradition when responding to such matters.`,
        `*referencing historical context* The customs of this era influence how I must address your statement.`,
        `*speaking with period-appropriate formality* The historical significance of our situation colors my response.`
      );
      break;
    case "combat":
      templates.push(
        `*shifting into a tactical stance* In battle conditions like these, your words take on strategic importance.`,
        `*assessing tactical advantages* This combat situation requires me to be direct about your statement.`,
        `*hand resting on weapon* The threat of conflict makes me consider your words more carefully.`
      );
      break;
    default:
      templates.push(
        `*considering the unique circumstances* This situation gives me a new perspective on what you're saying.`,
        `*taking in the environment* The context of our meeting influences my thoughts on this matter.`,
        `*reflecting thoughtfully* Given where we are and what we're facing, I see your point differently.`
      );
  }

  // Select a random template
  const template = templates[Math.floor(Math.random() * templates.length)];

  return template;
};

/**
 * Generate a combat-specific response that references the scenario
 * @param {Object} character - The character object
 * @param {string} scenarioPrompt - The scenario prompt
 * @param {string} message - The message to respond to
 * @returns {string} - A combat-relevant response
 */
export const generateCombatResponse = (character, scenarioPrompt, message) => {
  const { name, type } = character;

  const combatTemplates = [
    `*shifting into a fighting stance, eyes narrowing* If it's a fight you want, I'm more than ready. *${
      type === "fantasy"
        ? "magical energy crackles around my hands"
        : type === "scifi"
        ? "activates combat systems"
        : "muscles tense, ready to strike"
    }*`,

    `*moving with practiced precision, ${
      type === "fantasy"
        ? "drawing a glowing rune in the air"
        : type === "scifi"
        ? "calibrating targeting systems"
        : "reaching for my weapon"
    }* I've faced worse threats than this. Let's see what you're capable of.`,

    `*analyzing the tactical situation, ${
      type === "fantasy"
        ? "channeling arcane power"
        : type === "scifi"
        ? "scanning for weaknesses"
        : "looking for environmental advantages"
    }* A direct confrontation isn't always the wisest choice, but I'm prepared if necessary.`,

    `*${
      type === "fantasy"
        ? "muttering an ancient incantation"
        : type === "scifi"
        ? "activating defensive shields"
        : "adopting a defensive posture"
    }* Violence should be the last resort, but I won't hesitate to defend myself if pushed.`,

    `*eyes flashing with ${
      type === "fantasy"
        ? "magical energy"
        : type === "scifi"
        ? "targeting data"
        : "determination"
    }* I've been in countless battles before. This one won't end any differently for my opponents.`,
  ];

  return combatTemplates[Math.floor(Math.random() * combatTemplates.length)];
};

/**
 * Generate a response that references character relationships in the scenario
 * @param {Object} character - The character object
 * @param {Object} targetCharacter - The character being responded to
 * @param {string} scenarioPrompt - The scenario prompt
 * @returns {string} - A relationship-focused response
 */
export const generateRelationshipResponse = (
  character,
  targetCharacter,
  scenarioPrompt
) => {
  const { name: charName, type: charType } = character;
  const { name: targetName, type: targetType } = targetCharacter;

  // Extract relationship hints from scenario
  const elements = extractScenarioElements(scenarioPrompt);
  const relationship =
    elements.relationships.length > 0 ? elements.relationships[0] : null;

  const relationshipTemplates = [
    `*looking directly at ${targetName}, ${
      charType === "fantasy"
        ? "a faint aura connecting us"
        : charType === "scifi"
        ? "biometric readings spiking"
        : "expression softening slightly"
    }* Our history together gives me a unique perspective on what you're saying.`,

    `*${
      charType === "fantasy"
        ? "sensing the magical bond between us"
        : charType === "scifi"
        ? "accessing relationship protocols"
        : "recalling our shared experiences"
    }* ${targetName}, you and I have been through enough together that I can speak frankly about this.`,

    `*${
      relationship
        ? `acknowledging our status as ${relationship}`
        : "considering our complex relationship"
    }* ${targetName}, the dynamic between us colors everything we discuss.`,

    `*${
      charType === "fantasy"
        ? "feeling the threads of fate that bind us"
        : charType === "scifi"
        ? "analyzing our interaction patterns"
        : "reflecting on our connection"
    }* There's a reason our paths keep crossing, ${targetName}. Perhaps it relates to this very conversation.`,

    `*${
      charType === "fantasy"
        ? "mystical energies swirling between us"
        : charType === "scifi"
        ? "relationship algorithms processing"
        : "expression revealing deeper emotions"
    }* ${targetName}, given our history, I think we both know what needs to be said here.`,
  ];

  return relationshipTemplates[
    Math.floor(Math.random() * relationshipTemplates.length)
  ];
};
