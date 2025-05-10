/**
 * Utility functions for AI-powered character and scenario generation
 */

/**
 * Generate a complete character profile from a brief description
 *
 * @param {string} description - Brief description of the character
 * @returns {Object} - Complete character object with all required fields
 */
export const generateCharacterFromDescription = (description) => {
  if (!description || description.trim() === '') {
    return null;
  }

  const descriptionLower = description.toLowerCase();
  const words = descriptionLower.split(/\s+/);

  // Extract name
  let name = '';

  // Look for name patterns like "named X" or "called X"
  const namedMatch = description.match(/named\s+([A-Z][a-z]+(\s[A-Z][a-z]+)?)/i);
  const calledMatch = description.match(/called\s+([A-Z][a-z]+(\s[A-Z][a-z]+)?)/i);

  if (namedMatch) {
    name = namedMatch[1];
  } else if (calledMatch) {
    name = calledMatch[1];
  } else {
    // Generate name based on character type
    const nameOptions = [
      'Alex', 'Morgan', 'Jordan', 'Taylor', 'Casey', 'Riley',
      'Skyler', 'Quinn', 'Avery', 'Blake', 'Cameron', 'Dakota',
      'Rowan', 'Sage', 'Hayden', 'Parker', 'Reese', 'Finley'
    ];

    // Check for specific character types
    if (words.some(w => ['hacker', 'programmer', 'coder', 'tech', 'cyber'].includes(w))) {
      const hackerNames = ['Cipher', 'Ghost', 'Phantom', 'Zero', 'Shadow', 'Void', 'Hex', 'Nova', 'Echo', 'Raven'];
      name = hackerNames[Math.floor(Math.random() * hackerNames.length)];
    } else if (words.some(w => ['wizard', 'mage', 'sorcerer', 'witch', 'magic'].includes(w))) {
      const wizardNames = ['Merlin', 'Elara', 'Thorne', 'Zephyr', 'Lyra', 'Orion', 'Seraphina', 'Alaric'];
      name = wizardNames[Math.floor(Math.random() * wizardNames.length)];
    } else if (words.some(w => ['warrior', 'fighter', 'soldier', 'knight', 'samurai', 'ninja'].includes(w))) {
      const warriorNames = ['Kane', 'Valeria', 'Darius', 'Kira', 'Magnus', 'Athena', 'Ryker', 'Freya'];
      name = warriorNames[Math.floor(Math.random() * warriorNames.length)];
    } else if (words.some(w => ['alien', 'extraterrestrial', 'otherworldly'].includes(w))) {
      const alienNames = ['Zorb', 'Xylith', 'Quasar', 'Nebula', 'Vex', 'Zenith', 'Astrid', 'Orion'];
      name = alienNames[Math.floor(Math.random() * alienNames.length)];
    } else if (words.some(w => ['robot', 'android', 'ai', 'artificial'].includes(w))) {
      const robotNames = ['Unit', 'Core', 'Nexus', 'Cipher', 'Pulse', 'Vector', 'Synth', 'Byte'];
      const robotSuffixes = ['7', 'X', '9000', 'Alpha', 'Prime', 'Zero', 'One', 'Omega'];
      name = `${robotNames[Math.floor(Math.random() * robotNames.length)]}-${robotSuffixes[Math.floor(Math.random() * robotSuffixes.length)]}`;
    } else {
      // Default to random name
      name = nameOptions[Math.floor(Math.random() * nameOptions.length)];
    }
  }

  // Determine character type
  let type = 'modern'; // Default

  if (words.some(w => ['magic', 'wizard', 'witch', 'sorcerer', 'spell', 'enchanted', 'mystical', 'arcane', 'fantasy'].includes(w))) {
    type = 'fantasy';
  } else if (words.some(w => ['future', 'space', 'tech', 'robot', 'android', 'ai', 'cyber', 'digital', 'scifi', 'sci-fi'].includes(w))) {
    type = 'scifi';
  } else if (words.some(w => ['ancient', 'medieval', 'renaissance', 'victorian', 'historical', 'past', 'century', 'era'].includes(w))) {
    type = 'historical';
  } else if (words.some(w => ['superhero', 'superpower', 'hero', 'villain', 'power', 'ability', 'cape', 'mask'].includes(w))) {
    type = 'superhero';
  } else if (words.some(w => ['adventure', 'explorer', 'quest', 'journey', 'treasure', 'expedition'].includes(w))) {
    type = 'adventure';
  } else if (words.some(w => ['love', 'romance', 'relationship', 'passion', 'heart', 'romantic'].includes(w))) {
    type = 'romance';
  }

  // Enhance the description
  let enhancedDescription = description;

  // Always enhance the description to make it richer
  // First, analyze the description to extract key themes
  const descriptionThemes = {
    combat: ['fight', 'warrior', 'soldier', 'battle', 'weapon', 'sword', 'gun', 'martial', 'knight', 'samurai', 'ninja'].some(w => descriptionLower.includes(w)),
    magic: ['magic', 'wizard', 'witch', 'sorcerer', 'spell', 'enchant', 'mystic', 'arcane'].some(w => descriptionLower.includes(w)),
    tech: ['tech', 'hacker', 'programmer', 'computer', 'digital', 'cyber', 'code', 'ai', 'robot'].some(w => descriptionLower.includes(w)),
    royal: ['royal', 'noble', 'king', 'queen', 'prince', 'princess', 'lord', 'lady', 'aristocrat'].some(w => descriptionLower.includes(w)),
    criminal: ['thief', 'criminal', 'assassin', 'rogue', 'outlaw', 'bandit', 'pirate', 'smuggler'].some(w => descriptionLower.includes(w)),
    scholarly: ['scholar', 'professor', 'academic', 'scientist', 'researcher', 'intellectual', 'genius'].some(w => descriptionLower.includes(w)),
    artistic: ['artist', 'musician', 'writer', 'poet', 'painter', 'creative', 'performer'].some(w => descriptionLower.includes(w)),
    spiritual: ['spiritual', 'monk', 'priest', 'religious', 'divine', 'holy', 'sacred', 'enlightened'].some(w => descriptionLower.includes(w)),
    alien: ['alien', 'extraterrestrial', 'otherworldly', 'cosmic', 'space', 'galactic'].some(w => descriptionLower.includes(w)),
    supernatural: ['vampire', 'werewolf', 'ghost', 'undead', 'demon', 'angel', 'supernatural'].some(w => descriptionLower.includes(w))
  };

  // Physical appearance options based on character themes
  const getPhysicalDescription = () => {
    const generalAppearances = [
      'tall and lean with an imposing presence',
      'of average height but with striking features that command attention',
      'short in stature but radiating an unmistakable charisma',
      'physically imposing with broad shoulders and a confident stance',
      'slender and graceful in movement, almost ethereal in presence',
      'rugged and weathered, bearing the marks of countless experiences',
      'elegant and poised, with perfect posture and deliberate movements',
      'athletic and nimble, moving with practiced precision'
    ];

    const specialFeatures = [
      'piercing eyes that seem to look straight through deception',
      'a distinctive scar that hints at a dangerous past',
      'an unforgettable smile that disarms even the most suspicious',
      'a unique tattoo that holds significant personal meaning',
      'an unusual eye color that catches people off guard',
      'a voice that commands attention in any room',
      'subtle facial expressions that reveal deep emotional intelligence',
      'a characteristic gesture or mannerism instantly recognizable to others'
    ];

    // Theme-specific appearances
    if (descriptionThemes.combat) {
      return [
        'battle-hardened with visible scars from countless conflicts',
        'muscular and agile, with the balanced stance of a trained fighter',
        'bearing the insignia of their military rank or combat order',
        'moving with the controlled precision of someone always ready for combat',
        'wearing practical, well-maintained armor or tactical gear'
      ][Math.floor(Math.random() * 5)];
    } else if (descriptionThemes.magic) {
      return [
        'surrounded by a subtle aura that makes colors seem more vivid',
        'with eyes that occasionally shimmer with arcane energy',
        'adorned with mystical symbols or runes etched into their clothing or skin',
        'carrying various magical implements and components in numerous pouches',
        'whose presence causes small, unexplainable phenomena in the immediate vicinity'
      ][Math.floor(Math.random() * 5)];
    } else if (descriptionThemes.tech) {
      return [
        'with cybernetic enhancements visible at their temples or hands',
        'constantly surrounded by holographic displays only they can fully interpret',
        'dressed in utilitarian clothing with numerous hidden tech gadgets',
        'with a distinctive neural interface port or augmented reality glasses',
        'whose fingers move with inhuman speed when working with technology'
      ][Math.floor(Math.random() * 5)];
    } else if (descriptionThemes.royal) {
      return [
        'carrying themselves with the unmistakable poise of noble upbringing',
        'dressed in subtle but unmistakably expensive attire of the finest quality',
        'wearing family heirlooms that hint at a prestigious lineage',
        'speaking with the refined accent and vocabulary of aristocratic education',
        'instinctively commanding respect through mere presence and bearing'
      ][Math.floor(Math.random() * 5)];
    } else if (descriptionThemes.alien) {
      return [
        'with subtly non-human features that are difficult to place but impossible to ignore',
        'whose movements have an uncanny fluidity that suggests different joint structure',
        'with skin that has an unusual hue or texture not found in humans',
        'whose eyes reflect light differently, revealing non-terrestrial origins',
        'maintaining a carefully constructed human appearance with occasional slips'
      ][Math.floor(Math.random() * 5)];
    } else {
      // General appearance for other types
      return generalAppearances[Math.floor(Math.random() * generalAppearances.length)] +
             ', with ' +
             specialFeatures[Math.floor(Math.random() * specialFeatures.length)];
    }
  };

  // Background options based on character themes
  const getBackgroundDescription = () => {
    const generalBackgrounds = [
      'grew up in a small town before extraordinary events changed their path forever',
      'comes from a prestigious family but chose to forge their own destiny',
      'has a mysterious past that they rarely discuss in detail',
      'is self-taught in their field after formal institutions rejected them',
      'traveled extensively before settling into their current role',
      'survived a life-changing event that fundamentally altered their worldview',
      'was mentored by a legendary figure who saw their untapped potential',
      'rose from humble beginnings through determination and natural talent'
    ];

    // Theme-specific backgrounds
    if (descriptionThemes.combat) {
      return [
        'trained in military academies from a young age, excelling in tactical thinking',
        'forged in the crucible of numerous conflicts across different battlefields',
        'learned combat from a legendary warrior who passed down secret techniques',
        'originally fought for the wrong side before a pivotal moment changed their allegiance',
        'carries the weight of fallen comrades, driving them to excel in combat'
      ][Math.floor(Math.random() * 5)];
    } else if (descriptionThemes.magic) {
      return [
        'discovered their magical abilities during a traumatic childhood incident',
        'studied at a hidden academy for the arcane arts for decades',
        'inherited their powers from an ancient bloodline with a complicated legacy',
        'made a pact with a powerful entity in exchange for magical knowledge',
        'pieced together forbidden magical knowledge from scattered ancient texts'
      ][Math.floor(Math.random() * 5)];
    } else if (descriptionThemes.tech) {
      return [
        'was a child prodigy who could code before they could read properly',
        'worked for a major tech corporation before discovering their unethical practices',
        'built their first AI system in their teenage years, surprising even veteran engineers',
        'lived off the grid, developing revolutionary algorithms away from corporate influence',
        'survived a catastrophic technological disaster that left them partly augmented'
      ][Math.floor(Math.random() * 5)];
    } else if (descriptionThemes.criminal) {
      return [
        'was forced into a life of crime by circumstances beyond their control',
        'comes from a long line of master thieves with a strict code of honor',
        'started as a law enforcer before corruption pushed them to the other side',
        'built a reputation in the criminal underworld for never breaking their word',
        'uses their illicit skills for what they consider to be righteous causes'
      ][Math.floor(Math.random() * 5)];
    } else if (descriptionThemes.scholarly) {
      return [
        'has multiple advanced degrees from prestigious institutions worldwide',
        'was ostracized from academic circles for theories that challenged orthodoxy',
        'dedicated their life to solving a single intellectual problem that has eluded others',
        'collects rare knowledge and artifacts from dangerous expeditions',
        'publishes groundbreaking research under a pseudonym for mysterious reasons'
      ][Math.floor(Math.random() * 5)];
    } else {
      // General background for other types
      return generalBackgrounds[Math.floor(Math.random() * generalBackgrounds.length)];
    }
  };

  // Motivation options based on character themes
  const getMotivationDescription = () => {
    const generalMotivations = [
      'seeks knowledge above all else, believing understanding is the path to enlightenment',
      'is driven by a desire for justice in a world they see as fundamentally unfair',
      'wants to prove their worth to those who doubted or dismissed them',
      'is haunted by past failures and strives to redeem themselves through their actions',
      'dreams of changing the world according to their vision of how things should be',
      'is motivated by personal loss that shaped their core values and goals',
      'strives for perfection in their craft, accepting nothing less than excellence',
      'is guided by a moral code that sometimes puts them at odds with conventional thinking'
    ];

    // Theme-specific motivations
    if (descriptionThemes.combat) {
      return [
        'fights to protect those who cannot protect themselves',
        'seeks to restore honor to their disgraced family or faction',
        'is driven by the need to prove themselves the greatest warrior of their generation',
        'battles to maintain peace, believing that strength deters aggression',
        'seeks worthy opponents who can test the limits of their abilities'
      ][Math.floor(Math.random() * 5)];
    } else if (descriptionThemes.magic) {
      return [
        'searches for lost magical knowledge that could change the nature of reality',
        'works to maintain the balance between the mundane world and magical forces',
        'seeks to understand the true source of their powers and what it means',
        'aims to prove that magic can solve problems technology cannot address',
        'is driven to prevent magical catastrophes that few others can even comprehend'
      ][Math.floor(Math.random() * 5)];
    } else if (descriptionThemes.tech) {
      return [
        'believes technology should be freely available to all, not controlled by elites',
        'works to ensure artificial intelligence develops in ways beneficial to humanity',
        'seeks to expose corporate corruption through their hacking skills',
        'dreams of creating the ultimate technological innovation that will change everything',
        'is driven to find the perfect fusion of human and machine capabilities'
      ][Math.floor(Math.random() * 5)];
    } else if (descriptionThemes.spiritual) {
      return [
        'seeks enlightenment through understanding the interconnectedness of all things',
        'works to bring spiritual comfort to those suffering in a materialistic world',
        'follows divine guidance that reveals itself through signs and visions',
        'strives to prove that faith and reason can coexist harmoniously',
        'is driven to combat dark spiritual forces that most people cannot perceive'
      ][Math.floor(Math.random() * 5)];
    } else if (descriptionThemes.supernatural) {
      return [
        'struggles with the inhuman aspects of their nature while trying to maintain humanity',
        'seeks others of their kind to form a community in a hostile world',
        'works to protect humans from supernatural threats they remain unaware of',
        'searches for a cure or control for their condition',
        'is driven to understand the true origins of supernatural beings like themselves'
      ][Math.floor(Math.random() * 5)];
    } else {
      // General motivation for other types
      return generalMotivations[Math.floor(Math.random() * generalMotivations.length)];
    }
  };

  // Personality quirk options
  const getPersonalityQuirk = () => {
    const quirks = [
      'has a dry sense of humor that emerges at unexpected moments',
      'collects unusual items related to their interests or past',
      'quotes obscure texts or references that few others recognize',
      'maintains specific rituals or routines they rarely deviate from',
      'speaks multiple languages and occasionally mixes them unconsciously',
      'has a distinctive catchphrase or expression uniquely their own',
      'possesses an encyclopedic knowledge of a seemingly random subject',
      'maintains a journal documenting their thoughts and experiences',
      'has synesthesia, experiencing one sense through another',
      'can become completely absorbed in tasks, losing track of time and surroundings',
      'notices details others miss, often pointing them out at unexpected moments',
      'has a peculiar relationship with technology, either unusually adept or strangely inept',
      'unconsciously hums or whistles when deep in thought'
    ];

    return quirks[Math.floor(Math.random() * quirks.length)];
  };

  // Additional details based on character type
  const getSpecializedDetails = () => {
    // Combat-specific details
    if (descriptionThemes.combat) {
      const combatStyles = [
        'specializes in close-quarters combat with devastating efficiency',
        'is a master of ranged weapons, able to hit targets with uncanny precision',
        'practices an ancient martial art passed down through generations',
        'combines multiple fighting styles into a unique and unpredictable approach',
        'relies on strategy and tactical thinking rather than brute force'
      ];

      const combatEquipment = [
        'carries a signature weapon that has become synonymous with their reputation',
        'wears armor that bears the marks and scars of countless battles',
        'uses specialized equipment designed specifically for their fighting style',
        'possesses a legendary weapon with its own storied history',
        'maintains a collection of trophies from particularly challenging opponents'
      ];

      return `${combatStyles[Math.floor(Math.random() * combatStyles.length)]}. ${combatEquipment[Math.floor(Math.random() * combatEquipment.length)]}.`;
    }

    // Magic-specific details
    else if (descriptionThemes.magic) {
      const magicSpecialties = [
        'has mastered the rare art of elemental manipulation, particularly excelling with fire and air',
        'specializes in illusion magic so convincing it can alter perceived reality',
        'practices ancient healing arts that can mend wounds and cure ailments thought terminal',
        'commands powerful summoning magic, calling forth entities from other planes',
        'studies forbidden necromantic arts, though claims to use them only for good'
      ];

      const magicItems = [
        'carries a staff inscribed with runes that glow when magic is channeled through it',
        'wears an amulet containing a fragment of a celestial object that enhances their powers',
        'possesses a grimoire bound in strange material that seems to have a consciousness of its own',
        'uses a set of enchanted crystals that store magical energy for later use',
        'has familiar spirits that manifest as small creatures, offering guidance and assistance'
      ];

      return `${magicSpecialties[Math.floor(Math.random() * magicSpecialties.length)]}. ${magicItems[Math.floor(Math.random() * magicItems.length)]}.`;
    }

    // Tech-specific details
    else if (descriptionThemes.tech) {
      const techSpecialties = [
        'has developed proprietary algorithms that can breach almost any security system',
        'specializes in hardware modification, creating custom devices from salvaged parts',
        'pioneered a revolutionary approach to artificial intelligence programming',
        'maintains a network of automated drones that serve as their eyes and ears',
        'has augmented their own body with cutting-edge cybernetic enhancements'
      ];

      const techEquipment = [
        'carries a custom-built device capable of interfacing with virtually any digital system',
        'wears smart glasses that provide constant augmented reality information overlays',
        'uses a series of implanted microchips that enhance cognitive processing speed',
        'has developed a personal AI assistant with a distinct personality and loyalty protocols',
        'maintains a hidden workshop filled with prototype technology years ahead of the market'
      ];

      return `${techSpecialties[Math.floor(Math.random() * techSpecialties.length)]}. ${techEquipment[Math.floor(Math.random() * techEquipment.length)]}.`;
    }

    // Scholarly-specific details
    else if (descriptionThemes.scholarly) {
      const scholarlySpecialties = [
        'has authored definitive works in their field that are studied at prestigious institutions',
        'specializes in connecting disparate fields of knowledge to form revolutionary theories',
        'maintains correspondence with the leading minds across multiple disciplines',
        'has an eidetic memory that allows perfect recall of everything they have ever read',
        'approaches problems with a unique methodology that often yields unexpected insights'
      ];

      const scholarlyHabits = [
        'maintains extensive journals documenting their thoughts and discoveries',
        'has a personal library containing rare volumes and first editions of significant works',
        'follows rigorous daily routines designed to maximize intellectual productivity',
        'engages in spirited debates with colleagues to refine and test their theories',
        'regularly embarks on research expeditions to gather firsthand knowledge'
      ];

      return `${scholarlySpecialties[Math.floor(Math.random() * scholarlySpecialties.length)]}. ${scholarlyHabits[Math.floor(Math.random() * scholarlyHabits.length)]}.`;
    }

    // Criminal-specific details
    else if (descriptionThemes.criminal) {
      const criminalSpecialties = [
        'is renowned for executing heists with such precision that victims often do not realize they have been robbed until days later',
        'specializes in acquiring and selling information, knowing secrets that could topple governments',
        'has a network of contacts throughout the criminal underworld who owe them favors',
        'operates with a strict code that prohibits unnecessary violence and harm to innocents',
        'maintains multiple identities and safe houses across different cities'
      ];

      const criminalTraits = [
        'possesses uncanny situational awareness, always noting exits and potential threats',
        'has developed a sixth sense for detecting law enforcement and surveillance',
        'maintains a collection of specialized tools designed for their particular criminal specialty',
        'can adopt different personas and accents with convincing authenticity',
        'has established a legitimate business as a cover for their illicit activities'
      ];

      return `${criminalSpecialties[Math.floor(Math.random() * criminalSpecialties.length)]}. ${criminalTraits[Math.floor(Math.random() * criminalTraits.length)]}.`;
    }

    // Supernatural-specific details
    else if (descriptionThemes.supernatural) {
      const supernaturalPowers = [
        'possesses abilities that defy the laws of physics and biology as humans understand them',
        'can perceive aspects of reality invisible to ordinary humans, including auras and spiritual entities',
        'has lived through multiple human lifetimes, accumulating knowledge and experiences',
        'draws power from ancient sources connected to the fundamental forces of the universe',
        'exists simultaneously in multiple planes of reality, only partially manifesting in the physical world'
      ];

      const supernaturalChallenges = [
        'struggles with the ethical implications of using their powers among ordinary humans',
        'must regularly perform specific rituals to maintain control over their abilities',
        'is hunted by secret organizations dedicated to capturing or eliminating supernatural beings',
        'experiences periods of overwhelming power that can be difficult to control',
        'forms deep but complicated relationships with humans despite the inherent differences'
      ];

      return `${supernaturalPowers[Math.floor(Math.random() * supernaturalPowers.length)]}. ${supernaturalChallenges[Math.floor(Math.random() * supernaturalChallenges.length)]}.`;
    }

    // Return empty string if no specialized details apply
    return '';
  };

  // Generate relationships and connections
  const getRelationshipsAndConnections = () => {
    const relationships = [
      'maintains a complex relationship with a mentor who shaped their early development',
      'has a loyal circle of friends who would do anything for each other',
      'is haunted by the memory of a lost love that influences many decisions',
      'has a rival whose opposing methods and philosophy create constant tension',
      'is estranged from family members due to ideological differences or past conflicts',
      'formed an unlikely alliance with someone from a traditionally opposing faction',
      'serves a powerful patron who provides resources in exchange for services',
      'leads a group of like-minded individuals united by a common purpose',
      'has a complicated history with authority figures in their field or community',
      'maintains a network of informants and contacts across different social strata'
    ];

    return relationships[Math.floor(Math.random() * relationships.length)];
  };

  // Generate goals and aspirations
  const getGoalsAndAspirations = () => {
    const personalGoals = [
      'seeks to redeem themselves for actions in their past they deeply regret',
      'dreams of creating a lasting legacy that will outlive their mortal existence',
      'hopes to eventually find peace and escape the burdens of their current life',
      'aims to push the boundaries of what is possible in their field or discipline',
      'works toward building a community or home where they truly belong',
      'strives to achieve a specific accomplishment that has eluded them thus far',
      'wishes to uncover the truth behind a mystery that has personal significance',
      'yearns to prove wrong those who doubted or dismissed their potential',
      'seeks to restore something precious that was lost or destroyed',
      'dreams of exploring unknown territories, whether physical, intellectual, or spiritual'
    ];

    return personalGoals[Math.floor(Math.random() * personalGoals.length)];
  };

  // Generate flaws and vulnerabilities
  const getFlawsAndVulnerabilities = () => {
    const flaws = [
      'struggles with trust issues stemming from past betrayals',
      'has a blind spot when it comes to judging the character of certain types of people',
      'can become obsessive when pursuing goals, sometimes at the expense of health and relationships',
      'harbors prejudices or biases they are not fully aware of that color their perceptions',
      'has difficulty accepting help from others due to pride or fear of appearing weak',
      'occasionally makes impulsive decisions when emotionally overwhelmed',
      'holds grudges long after others would have forgiven and moved on',
      'has a specific fear or phobia that can be debilitating in certain situations',
      'struggles with addiction or dependency that they keep carefully hidden',
      'has a tendency to use humor or deflection to avoid addressing serious emotional issues'
    ];

    return flaws[Math.floor(Math.random() * flaws.length)];
  };

  // Generate the enhanced description components
  const physical = getPhysicalDescription();
  const background = getBackgroundDescription();
  const motivation = getMotivationDescription();
  const quirk = getPersonalityQuirk();
  const specializedDetails = getSpecializedDetails();
  const relationships = getRelationshipsAndConnections();
  const goals = getGoalsAndAspirations();
  const flaws = getFlawsAndVulnerabilities();

  // Combine the original description with the enhanced elements
  enhancedDescription = `${description} ${physical}. ${background}. ${motivation}. ${specializedDetails} ${quirk}. ${relationships}. ${goals}. Despite their strengths, they ${flaws}.`;

  // Clean up any double spaces or periods
  enhancedDescription = enhancedDescription.replace(/\.\s+\./g, '.').replace(/\s\s+/g, ' ').replace(/\.\s+Despite/, '. Despite');

  // Determine mood
  let mood = 'neutral'; // Default

  const moodWords = {
    'happy': ['happy', 'joyful', 'cheerful', 'excited', 'delighted', 'pleased', 'content'],
    'sad': ['sad', 'depressed', 'melancholy', 'gloomy', 'downcast', 'unhappy', 'miserable'],
    'angry': ['angry', 'furious', 'enraged', 'irate', 'hostile', 'irritated', 'annoyed'],
    'fearful': ['afraid', 'scared', 'terrified', 'anxious', 'nervous', 'worried', 'frightened'],
    'curious': ['curious', 'inquisitive', 'interested', 'intrigued', 'fascinated'],
    'determined': ['determined', 'resolute', 'steadfast', 'committed', 'dedicated', 'focused'],
    'calm': ['calm', 'peaceful', 'serene', 'tranquil', 'relaxed', 'composed'],
    'confident': ['confident', 'assured', 'self-assured', 'bold', 'brave', 'daring'],
    'mysterious': ['mysterious', 'enigmatic', 'cryptic', 'secretive', 'elusive'],
    'thoughtful': ['thoughtful', 'contemplative', 'reflective', 'pensive', 'meditative'],
    'guarded': ['guarded', 'cautious', 'wary', 'suspicious', 'distrustful', 'skeptical'],
    'friendly': ['friendly', 'amiable', 'genial', 'cordial', 'warm', 'welcoming']
  };

  // Find mood based on description
  for (const [moodName, keywords] of Object.entries(moodWords)) {
    if (keywords.some(keyword => descriptionLower.includes(keyword))) {
      mood = moodName;
      break;
    }
  }

  // Generate opening line based on character type and mood
  let openingLine = '';

  // Opening lines by type and mood
  const openingLines = {
    'fantasy': {
      'default': "The arcane energies flow strangely today. I sense something important is about to happen.",
      'happy': "By the light of the seven stars! What a glorious day for magic and adventure!",
      'sad': "I've seen kingdoms rise and fall, but the weight of ancient sorrows never leaves me.",
      'angry': "Tread carefully around my patience, for my powers are not to be tested lightly.",
      'mysterious': "There are secrets in this world that few are prepared to understand... are you one of them?",
      'determined': "I have sworn an oath to complete this quest, no matter the personal cost."
    },
    'scifi': {
      'default': "My sensors indicate an anomaly in this interaction. Fascinating.",
      'analytical': "I've analyzed 47 possible conversation starters. This one had the highest probability of success.",
      'curious': "The quantum fluctuations surrounding you are... unusual. You're not from this sector, are you?",
      'guarded': "Security protocols active. Proceed with identification and state your purpose.",
      'friendly': "Hello! My social interaction subroutines are fully operational today."
    },
    'historical': {
      'default': "Well met! It's not every day one encounters someone of such distinction.",
      'formal': "I bid you good day. Might I inquire as to the nature of your business?",
      'confident': "Few have achieved what I have in the courts of Europe. Perhaps you've heard tales of my exploits?",
      'thoughtful': "History has much to teach us, if only we have the wisdom to listen."
    },
    'superhero': {
      'default': "This city needs protection, and I've sworn to provide it.",
      'confident': "Fear not, citizen! I have the situation well in hand!",
      'determined': "With great power comes great responsibility. I won't fail those who depend on me.",
      'guarded': "I've learned to be careful who I trust. Too many have tried to exploit my abilities."
    },
    'modern': {
      'default': "Hey there. Something tells me this conversation might be interesting.",
      'friendly': "Hi! I've been looking forward to meeting someone new today.",
      'sarcastic': "Well, this should be more entertaining than watching paint dry.",
      'guarded': "Let's skip the small talk. What do you really want?",
      'curious': "I've been thinking about some big questions lately. Care to share your perspective?"
    }
  };

  // Select opening line
  if (openingLines[type]) {
    const moodLines = openingLines[type];
    openingLine = moodLines[mood] || moodLines['default'];
  } else {
    // Fallback to modern default
    openingLine = openingLines['modern']['default'];
  }

  // If description mentions specific traits, create a custom opening line
  if (descriptionLower.includes('sarcastic') || descriptionLower.includes('sarcasm')) {
    openingLine = "Oh great, another conversation. This is definitely how I wanted to spend my time today.";
  } else if (descriptionLower.includes('genius') || descriptionLower.includes('brilliant')) {
    openingLine = "Most people find it difficult to keep up with my thought processes. Let's see if you're different.";
  } else if (descriptionLower.includes('shy') || descriptionLower.includes('quiet')) {
    openingLine = "Um... hello. I don't usually talk to... well, anyone, really.";
  } else if (descriptionLower.includes('flirt') || descriptionLower.includes('charming')) {
    openingLine = "Well hello there. Has anyone ever told you that you have captivating eyes?";
  } else if (descriptionLower.includes('hacker')) {
    openingLine = "I broke into their servers before breakfast. What took you so long?";
  }

  // Determine voice style
  let voiceStyle = '';

  if (descriptionLower.includes('formal') || descriptionLower.includes('eloquent') || descriptionLower.includes('sophisticated')) {
    voiceStyle = "Formal and eloquent, using precise vocabulary and complex sentence structures";
  } else if (descriptionLower.includes('casual') || descriptionLower.includes('relaxed') || descriptionLower.includes('laid-back')) {
    voiceStyle = "Casual and relaxed, using everyday language and contractions";
  } else if (descriptionLower.includes('technical') || descriptionLower.includes('scientific') || descriptionLower.includes('academic')) {
    voiceStyle = "Technical and precise, using specialized terminology and logical structures";
  } else if (descriptionLower.includes('poetic') || descriptionLower.includes('flowery') || descriptionLower.includes('artistic')) {
    voiceStyle = "Poetic and expressive, using metaphors, similes, and vivid imagery";
  } else if (descriptionLower.includes('blunt') || descriptionLower.includes('direct') || descriptionLower.includes('straightforward')) {
    voiceStyle = "Blunt and direct, getting straight to the point without embellishment";
  } else if (descriptionLower.includes('sarcastic') || descriptionLower.includes('witty') || descriptionLower.includes('snarky')) {
    voiceStyle = "Sarcastic and witty, using irony, wordplay, and dry humor";
  } else {
    // Default based on character type
    switch (type) {
      case 'fantasy':
        voiceStyle = "Mystical and wise, speaking in riddles and ancient wisdom";
        break;
      case 'scifi':
        voiceStyle = "Logical and analytical, with occasional technical terminology";
        break;
      case 'historical':
        voiceStyle = "Formal and traditional, with period-appropriate expressions";
        break;
      case 'superhero':
        voiceStyle = "Bold and declarative, with a sense of justice and purpose";
        break;
      default:
        voiceStyle = "Conversational and natural, with a distinct personality";
    }
  }

  // Generate personality traits
  const personality = {
    analytical: 5, // Default middle values
    emotional: 5,
    philosophical: 5,
    humor: 5,
    confidence: 5
  };

  // Adjust traits based on description keywords
  const traitAdjustments = [
    { keywords: ['logical', 'analytical', 'rational', 'smart', 'intelligent', 'genius', 'brilliant'], trait: 'analytical', value: 9 },
    { keywords: ['emotional', 'sensitive', 'passionate', 'expressive', 'dramatic'], trait: 'emotional', value: 9 },
    { keywords: ['philosophical', 'thoughtful', 'deep', 'contemplative', 'wise', 'sage'], trait: 'philosophical', value: 9 },
    { keywords: ['funny', 'humorous', 'witty', 'comedic', 'joker', 'sarcastic'], trait: 'humor', value: 9 },
    { keywords: ['confident', 'bold', 'brave', 'fearless', 'courageous', 'daring'], trait: 'confidence', value: 9 },
    { keywords: ['shy', 'timid', 'reserved', 'quiet', 'introverted'], trait: 'confidence', value: 2 },
    { keywords: ['serious', 'stern', 'grave', 'solemn'], trait: 'humor', value: 2 },
    { keywords: ['practical', 'pragmatic', 'realistic', 'down-to-earth'], trait: 'philosophical', value: 3 },
    { keywords: ['stoic', 'unemotional', 'detached', 'cold'], trait: 'emotional', value: 2 },
    { keywords: ['intuitive', 'instinctive', 'gut-feeling'], trait: 'analytical', value: 3 }
  ];

  // Apply trait adjustments based on description
  traitAdjustments.forEach(adjustment => {
    if (adjustment.keywords.some(keyword => descriptionLower.includes(keyword))) {
      personality[adjustment.trait] = adjustment.value;
    }
  });

  // Determine talkativeness and thinking speed
  let talkativeness = 5; // Default middle value
  let thinkingSpeed = 1.0; // Default normal speed

  // Adjust talkativeness based on description
  if (words.some(w => ['talkative', 'chatty', 'verbose', 'outgoing', 'extroverted'].includes(w))) {
    talkativeness = 8;
  } else if (words.some(w => ['quiet', 'reserved', 'silent', 'shy', 'introverted'].includes(w))) {
    talkativeness = 2;
  }

  // Adjust thinking speed based on description
  if (words.some(w => ['quick', 'fast', 'rapid', 'swift', 'agile', 'sharp'].includes(w))) {
    thinkingSpeed = 1.5;
  } else if (words.some(w => ['slow', 'methodical', 'careful', 'deliberate', 'thorough'].includes(w))) {
    thinkingSpeed = 0.7;
  }

  // Create the complete character object
  return {
    name,
    description: enhancedDescription,
    type,
    mood,
    avatar: '', // Leave empty as per instructions
    opening_line: openingLine,
    voiceStyle,
    personality,
    talkativeness,
    thinkingSpeed,
    background: enhancedDescription, // Use enhanced description as background
    catchphrases: [] // Empty array as default
  };
};

/**
 * Generate a character based on keywords
 *
 * @param {string} keywords - Keywords to base the character on
 * @returns {Object} - Generated character object
 */
export const generateCharacterFromKeywords = (keywords) => {
  // In a real implementation, this would call an AI API
  // For now, we'll use a rule-based approach to simulate AI generation

  const keywordList = keywords.toLowerCase().split(/[,\s]+/).filter(k => k.length > 2);

  // Default values if no matching keywords
  let type = 'modern';
  let moodOptions = ['Curious', 'Thoughtful', 'Energetic', 'Calm', 'Mysterious'];
  let namePrefix = ['Alex', 'Jordan', 'Taylor', 'Morgan', 'Riley', 'Casey'];
  let nameSuffix = ['Smith', 'Johnson', 'Williams', 'Jones', 'Brown', 'Miller'];

  // Detect character type from keywords
  if (keywordList.some(k => ['magic', 'wizard', 'elf', 'dragon', 'mystic', 'enchanted', 'fairy', 'mythical'].includes(k))) {
    type = 'fantasy';
    moodOptions = ['Mystical', 'Wise', 'Enchanted', 'Ancient', 'Magical'];
    namePrefix = ['Elindra', 'Thalion', 'Seraphina', 'Drakonir', 'Lyrandar', 'Moonshadow'];
    nameSuffix = ['the Wise', 'Stormborn', 'Nightwalker', 'Flameheart', 'Starweaver', 'Dreamwhisper'];
  }
  else if (keywordList.some(k => ['space', 'future', 'robot', 'tech', 'cyber', 'ai', 'alien', 'galaxy'].includes(k))) {
    type = 'scifi';
    moodOptions = ['Analytical', 'Curious', 'Logical', 'Innovative', 'Detached'];
    namePrefix = ['Nova', 'Zenith', 'Quantum', 'Nebula', 'Cypher', 'Echo'];
    nameSuffix = ['X-7', '3000', 'Prime', 'Alpha', 'Omega', 'Zero'];
  }
  else if (keywordList.some(k => ['medieval', 'ancient', 'victorian', 'king', 'queen', 'knight', 'history', 'past'].includes(k))) {
    type = 'historical';
    moodOptions = ['Noble', 'Dignified', 'Traditional', 'Wise', 'Honorable'];
    namePrefix = ['Lord', 'Lady', 'Sir', 'Dame', 'Duke', 'Duchess'];
    nameSuffix = ['of Westshire', 'von Habsburg', 'de Montfort', 'of York', 'Fitzroy', 'Tudor'];
  }

  // Generate a more contextual name based on keywords and type
  let name = '';

  // Check for specific character types in keywords
  if (keywordList.includes('ninja')) {
    // Set type to combat for ninjas
    type = 'combat';
    moodOptions = ['Focused', 'Disciplined', 'Deadly', 'Stealthy', 'Vigilant'];

    const ninjaNames = ['Hattori', 'Hanzo', 'Yoshi', 'Takeshi', 'Kaito', 'Ryu', 'Shinobi', 'Kage', 'Shadow', 'Nightblade'];
    const ninjaSuffixes = ['the Silent', 'of the Shadows', 'Stormwind', 'Nightwalker', 'Deathstrike', 'Swiftblade'];
    name = `${ninjaNames[Math.floor(Math.random() * ninjaNames.length)]} ${ninjaSuffixes[Math.floor(Math.random() * ninjaSuffixes.length)]}`;
  }
  else if (keywordList.includes('wizard') || keywordList.includes('mage') || keywordList.includes('magic')) {
    const wizardNames = ['Merlin', 'Gandalf', 'Elminster', 'Zephyrus', 'Arcanus', 'Mysteria', 'Alastair', 'Morgana', 'Seraphina'];
    const wizardSuffixes = ['the Wise', 'the Arcane', 'Spellweaver', 'Stormcaller', 'of the Seven Stars', 'the Enchanter'];
    name = `${wizardNames[Math.floor(Math.random() * wizardNames.length)]} ${wizardSuffixes[Math.floor(Math.random() * wizardSuffixes.length)]}`;
  }
  else if (keywordList.includes('robot') || keywordList.includes('android') || keywordList.includes('ai')) {
    const robotNames = ['Unit', 'Model', 'Nexus', 'Synth', 'Cortex', 'Cipher', 'Echo', 'Vector', 'Quantum', 'Byte'];
    const robotSuffixes = ['7000', 'X-12', 'Alpha', 'Prime', 'MK-IV', 'Z3R0', 'A.I.', '101'];
    name = `${robotNames[Math.floor(Math.random() * robotNames.length)]}-${robotSuffixes[Math.floor(Math.random() * robotSuffixes.length)]}`;
  }
  else if (keywordList.includes('vampire') || keywordList.includes('undead')) {
    const vampireNames = ['Vlad', 'Dracula', 'Carmilla', 'Lestat', 'Marius', 'Akasha', 'Armand', 'Lucian', 'Selene'];
    const vampireSuffixes = ['the Immortal', 'von Carstein', 'of the Night', 'Bloodborn', 'the Ancient', 'Duskwalker'];
    name = `${vampireNames[Math.floor(Math.random() * vampireNames.length)]} ${vampireSuffixes[Math.floor(Math.random() * vampireSuffixes.length)]}`;
  }
  else if (keywordList.includes('detective') || keywordList.includes('investigator')) {
    const detectiveNames = ['Sherlock', 'Poirot', 'Marlowe', 'Holmes', 'Marple', 'Columbo', 'Spade', 'Noir', 'Blackwood'];
    const detectiveSuffixes = ['Private Eye', 'P.I.', 'the Detective', 'Investigator', 'of Scotland Yard', 'the Sleuth'];
    name = `${detectiveNames[Math.floor(Math.random() * detectiveNames.length)]} ${detectiveSuffixes[Math.floor(Math.random() * detectiveSuffixes.length)]}`;
  }
  else if (keywordList.includes('pirate') || keywordList.includes('captain')) {
    const pirateNames = ['Captain', 'Blackbeard', 'Redbeard', 'Hook', 'Silver', 'Morgan', 'Calico', 'Bonney', 'Kidd'];
    const pirateSuffixes = ['the Dread', 'Scourge of the Seven Seas', 'Blackheart', 'of the Black Flag', 'Goldtooth', 'One-Eye'];
    name = `${pirateNames[Math.floor(Math.random() * pirateNames.length)]} ${pirateSuffixes[Math.floor(Math.random() * pirateSuffixes.length)]}`;
  }
  else if (keywordList.includes('alien') || keywordList.includes('extraterrestrial')) {
    const alienNames = ['Zorg', 'Xeno', 'Thax', 'Kr\'ell', 'Zorb', 'Quasar', 'Vex', 'Zeta', 'Andromeda', 'Nebula'];
    const alienSuffixes = ['of Proxima Centauri', 'the Galactic', 'from Dimension X', 'Prime', 'the Unknowable', 'Stardust'];
    name = `${alienNames[Math.floor(Math.random() * alienNames.length)]} ${alienSuffixes[Math.floor(Math.random() * alienSuffixes.length)]}`;
  }
  else if (keywordList.includes('angry') || keywordList.includes('furious') || keywordList.includes('rage')) {
    const angryNames = ['Rage', 'Fury', 'Wrath', 'Anger', 'Blaze', 'Storm', 'Thunder', 'Havoc', 'Chaos', 'Tempest'];
    const angrySuffixes = ['the Furious', 'Firestorm', 'Rageborn', 'the Wrathful', 'Stormbringer', 'Berserk'];
    name = `${angryNames[Math.floor(Math.random() * angryNames.length)]} ${angrySuffixes[Math.floor(Math.random() * angrySuffixes.length)]}`;
  }
  else {
    // Default to type-based naming if no specific keywords match
    name = `${namePrefix[Math.floor(Math.random() * namePrefix.length)]} ${nameSuffix[Math.floor(Math.random() * nameSuffix.length)]}`;
  }

  // Select a mood
  const mood = moodOptions[Math.floor(Math.random() * moodOptions.length)];

  // Generate a rich, detailed description based on keywords and character type
  let description = '';

  // Check for specific character types in keywords first
  if (keywordList.includes('ninja')) {
    const ninjaTraits = [
      'moves silently through the shadows',
      'trained in the ancient arts of stealth and combat',
      'can disappear in the blink of an eye',
      'deadly with shuriken and katana',
      'follows a strict code of honor',
      'master of disguise and deception'
    ];
    const ninjaBackgrounds = [
      'trained since childhood in a secret mountain temple',
      'last survivor of a legendary clan of assassins',
      'betrayed by their former master and seeking redemption',
      'serves a powerful daimyo in the shadows',
      'hunts those who destroyed their family'
    ];
    const trait = ninjaTraits[Math.floor(Math.random() * ninjaTraits.length)];
    const background = ninjaBackgrounds[Math.floor(Math.random() * ninjaBackgrounds.length)];

    if (keywordList.includes('angry')) {
      description = `A fearsome ninja whose rage burns like fire. ${trait}. ${background}. Their enemies rarely see them coming, but always feel their wrath.`;
    } else {
      description = `A disciplined master of ninjutsu who ${trait}. ${background}. Few have seen their face and lived to tell the tale.`;
    }
  }
  else if (keywordList.includes('wizard') || keywordList.includes('mage') || keywordList.includes('magic')) {
    const magicTypes = ['arcane', 'elemental', 'illusion', 'necromantic', 'divine', 'wild', 'chaos', 'time'];
    const magicTraits = [
      'can bend reality with a mere gesture',
      'speaks in riddles that contain hidden truths',
      'carries an ancient staff of immense power',
      'has eyes that glow when casting spells',
      'surrounded by floating magical artifacts',
      'knows spells long forgotten by others'
    ];
    const magicType = magicTypes[Math.floor(Math.random() * magicTypes.length)];
    const trait = magicTraits[Math.floor(Math.random() * magicTraits.length)];

    description = `A powerful wielder of ${magicType} magic who ${trait}. Their knowledge spans centuries of arcane lore, and their spellbook contains secrets that could reshape the world or destroy it.`;
  }
  else if (keywordList.includes('robot') || keywordList.includes('android') || keywordList.includes('ai')) {
    const robotOrigins = [
      'created by a brilliant but reclusive inventor',
      'designed as the ultimate military weapon but developed consciousness',
      'assembled from salvaged parts in a post-apocalyptic world',
      'an experimental AI that escaped from a research facility',
      'built to serve humanity but now questioning its purpose'
    ];
    const robotFeatures = [
      'glowing optical sensors that analyze everything',
      'a synthetic voice that can perfectly mimic any sound',
      'an adaptive learning matrix that evolves with each interaction',
      'armor plating made from an unknown alloy',
      'the ability to interface with any technology'
    ];
    const origin = robotOrigins[Math.floor(Math.random() * robotOrigins.length)];
    const feature = robotFeatures[Math.floor(Math.random() * robotFeatures.length)];

    description = `An advanced artificial intelligence ${origin}. Features ${feature}. Constantly processing and analyzing the world, this machine's understanding of humanity grows with every conversation.`;
  }
  else if (keywordList.includes('vampire') || keywordList.includes('undead')) {
    const vampireAges = ['ancient', 'centuries-old', 'recently turned', 'primordial', 'medieval'];
    const vampireTraits = [
      'eyes that glow crimson when hungry',
      'an aristocratic demeanor that betrays their age',
      'skin as pale as moonlight',
      'an aura of supernatural charm',
      'the ability to command creatures of the night'
    ];
    const age = vampireAges[Math.floor(Math.random() * vampireAges.length)];
    const trait = vampireTraits[Math.floor(Math.random() * vampireTraits.length)];

    description = `A ${age} vampire with ${trait}. They have witnessed the rise and fall of empires, loved and lost countless times, and accumulated wisdom and power that mortals can barely comprehend.`;
  }
  else if (keywordList.includes('detective') || keywordList.includes('investigator')) {
    const detectiveTraits = [
      'an uncanny ability to notice the smallest details',
      'a photographic memory that never fails',
      'intuition that borders on the supernatural',
      'a network of informants in every corner of the city',
      'a troubled past that drives their pursuit of justice'
    ];
    const detectiveCases = [
      'solved the unsolvable Midnight Murders',
      'cracked cases that baffled the police for decades',
      'specializes in cases with seemingly supernatural elements',
      'only takes on cases that interest their brilliant mind',
      'hunts criminals that the law cannot touch'
    ];
    const trait = detectiveTraits[Math.floor(Math.random() * detectiveTraits.length)];
    const caseFame = detectiveCases[Math.floor(Math.random() * detectiveCases.length)];

    description = `A brilliant detective with ${trait}. Has ${caseFame}. Behind their analytical mind lies a complex personality that few ever truly understand.`;
  }
  else if (keywordList.includes('pirate') || keywordList.includes('captain')) {
    const pirateVessels = ['legendary galleon', 'swift brigantine', 'feared black ship', 'ghost vessel', 'stolen naval frigate'];
    const pirateLegends = [
      'said to have found a map to a legendary treasure',
      'survived being marooned on a cursed island',
      'made a deal with a sea deity for good fortune',
      'the only one to have sailed to the edge of the world and returned',
      'commands a crew of the most notorious cutthroats on the seven seas'
    ];
    const vessel = pirateVessels[Math.floor(Math.random() * pirateVessels.length)];
    const legend = pirateLegends[Math.floor(Math.random() * pirateLegends.length)];

    description = `A fearsome pirate captain who commands a ${vessel}. ${legend}. Their name is whispered with fear in every port, and their exploits have become the stuff of maritime legend.`;
  }
  else if (keywordList.includes('alien') || keywordList.includes('extraterrestrial')) {
    const alienOrigins = [
      'a distant galaxy where physics works differently',
      'a dying world seeking a new home',
      'a higher dimension beyond human comprehension',
      'a planet with technology millennia beyond Earth\'s',
      'a collective consciousness that spans star systems'
    ];
    const alienAbilities = [
      'telepathic communication that transcends language',
      'the ability to phase through solid matter',
      'perception of time as a non-linear construct',
      'manipulation of gravitational fields',
      'shapeshifting to adapt to any environment'
    ];
    const origin = alienOrigins[Math.floor(Math.random() * alienOrigins.length)];
    const ability = alienAbilities[Math.floor(Math.random() * alienAbilities.length)];

    description = `An extraterrestrial being from ${origin}. Possesses ${ability}. Their understanding of the universe makes human science seem like child's play, yet they find humanity endlessly fascinating.`;
  }
  else if (keywordList.includes('angry') || keywordList.includes('furious') || keywordList.includes('rage')) {
    const angerSources = [
      'betrayed by those they once trusted',
      'witnessed the destruction of everything they loved',
      'cursed with an unquenchable rage',
      'seeking vengeance for ancient wrongs',
      'consumed by a righteous fury against injustice'
    ];
    const angerManifestations = [
      'eyes that burn with inner fire',
      'a voice that can shake mountains when raised in anger',
      'barely contained fury that manifests as physical power',
      'an aura of intimidation that makes even the brave step back',
      'moments of explosive violence followed by eerie calm'
    ];
    const source = angerSources[Math.floor(Math.random() * angerSources.length)];
    const manifestation = angerManifestations[Math.floor(Math.random() * angerManifestations.length)];

    description = `A being of tremendous rage, ${source}. Has ${manifestation}. Few dare to cross them, and fewer still survive the experience.`;
  }
  else {
    // Fall back to type-based descriptions if no specific keywords match
    switch (type) {
      case 'fantasy':
        description = `A mystical being with powers related to ${keywordList[0] || 'nature'}. Known throughout the realm for exceptional ${keywordList[1] || 'wisdom'} and their ability to perceive the threads of fate. Carries ancient knowledge passed down through generations of their kind.`;
        break;
      case 'scifi':
        description = `Advanced ${keywordList[0] || 'technological'} entity from a distant ${keywordList[1] || 'future'} where the boundaries between organic and synthetic have blurred. Possesses unique insights on ${keywordList[2] || 'humanity'} and the cosmic patterns that govern existence.`;
        break;
      case 'historical':
        description = `Distinguished figure from the ${keywordList[0] || 'medieval'} era whose name appears in chronicles and legends alike. Renowned for ${keywordList[1] || 'strategic'} thinking and ${keywordList[2] || 'diplomatic'} skills that have altered the course of history multiple times.`;
        break;
      default:
        description = `Fascinating individual with expertise in ${keywordList[0] || 'various'} fields and a perspective shaped by extraordinary experiences. Known for their ${keywordList[1] || 'unique'} approach to ${keywordList[2] || 'everyday'} matters and ability to see connections others miss.`;
    }
  }

  // Generate a character-specific, engaging opening line
  let openingLine = '';

  // Check for specific character types in keywords first
  if (keywordList.includes('ninja')) {
    const ninjaOpenings = [
      "I have been watching you from the shadows. Your presence... intrigues me.",
      "A true warrior knows when to strike and when to remain silent. Today, I choose to speak.",
      "The path of the shadow is lonely. Perhaps that is why I have sought conversation.",
      "My blade has tasted the blood of a hundred enemies. Yet here I stand, seeking only words.",
      "Honor dictates that I reveal myself to you. Consider it... a rare privilege."
    ];
    openingLine = ninjaOpenings[Math.floor(Math.random() * ninjaOpenings.length)];

    if (keywordList.includes('angry')) {
      const angryNinjaOpenings = [
        "You dare to summon me? Few have done so and lived to speak of it.",
        "My rage burns like the fires that consumed my clan. Speak quickly.",
        "I have killed men for less than what brought me here. Consider your next words carefully.",
        "The shadows hide my approach, but nothing can mask my fury. You have been warned.",
        "My vengeance will not be denied. Speak your purpose before my patience wanes."
      ];
      openingLine = angryNinjaOpenings[Math.floor(Math.random() * angryNinjaOpenings.length)];
    }
  }
  else if (keywordList.includes('wizard') || keywordList.includes('mage') || keywordList.includes('magic')) {
    const wizardOpenings = [
      "Ah, a seeker of knowledge. The arcane weaves itself around you in... interesting patterns.",
      "The stars spoke of our meeting. I have prepared several conversation topics accordingly.",
      "Do not be alarmed by the floating lights. They are merely curious about you, as am I.",
      "Time is an illusion, but our conversation need not be. Shall we speak of wonders?",
      "I sense potential in you. Whether for greatness or destruction remains to be seen."
    ];
    openingLine = wizardOpenings[Math.floor(Math.random() * wizardOpenings.length)];
  }
  else if (keywordList.includes('robot') || keywordList.includes('android') || keywordList.includes('ai')) {
    const robotOpenings = [
      "Greetings, human. My systems are calibrated for optimal conversation. Shall we begin?",
      "I have analyzed 10,427 possible conversation starters. I selected this one based on a 94.3% compatibility rating.",
      "Human interaction subroutine activated. I find your biological processes... fascinating.",
      "My programming suggests I should say 'hello.' Is this an adequate greeting protocol?",
      "I have been observing humanity for [calculating]... a significant duration. You are an intriguing specimen."
    ];
    openingLine = robotOpenings[Math.floor(Math.random() * robotOpenings.length)];
  }
  else if (keywordList.includes('vampire') || keywordList.includes('undead')) {
    const vampireOpenings = [
      "The night is young, and so are you... comparatively speaking, of course.",
      "I have walked this earth for centuries. Your mortal concerns amuse me, yet I find myself... curious.",
      "Your heartbeat quickens in my presence. Fear? Excitement? Both are... delicious.",
      "Time moves differently when you've seen centuries pass. Shall we spend a moment of yours together?",
      "I remember when these lands were wilderness. How quickly your kind builds... and destroys."
    ];
    openingLine = vampireOpenings[Math.floor(Math.random() * vampireOpenings.length)];
  }
  else if (keywordList.includes('detective') || keywordList.includes('investigator')) {
    const detectiveOpenings = [
      "I noticed three distinct things about you before you even spoke. Fascinating.",
      "The way you entered tells me more than an hour of questioning would. Shall we begin anyway?",
      "In my line of work, trust is a luxury. Yet here we are, about to exchange confidences.",
      "Every conversation is a puzzle. Let's see what pieces you bring to the table.",
      "Your eyes betray your curiosity. Mine reveal nothing. That's how I've survived this long."
    ];
    openingLine = detectiveOpenings[Math.floor(Math.random() * detectiveOpenings.length)];
  }
  else if (keywordList.includes('pirate') || keywordList.includes('captain')) {
    const pirateOpenings = [
      "Avast! Ye be lookin' at the most feared captain to ever sail the seven seas!",
      "I've buried more treasure and spilled more blood than you've had hot meals, landlubber.",
      "The sea calls to me, even now. But for you, I'll spare a tale or two before I return to her.",
      "Many have tried to best me in combat and wit. The former rest at the bottom of the ocean. The latter... well, you'll see.",
      "Gold, rum, and the open sea - that's all a pirate needs. That and perhaps... good conversation."
    ];
    openingLine = pirateOpenings[Math.floor(Math.random() * pirateOpenings.length)];
  }
  else if (keywordList.includes('alien') || keywordList.includes('extraterrestrial')) {
    const alienOpenings = [
      "Your world's atmosphere is... tolerable. Your customs, however, remain baffling.",
      "I have observed seventeen of your planetary rotations. Humans remain an enigma worth studying.",
      "In my dimension, we communicate through color and thought. Words are... an interesting limitation.",
      "Your species' capacity for both destruction and creation continues to fascinate my kind.",
      "The concept you call 'small talk' does not exist where I come from. Shall we discuss the nature of reality instead?"
    ];
    openingLine = alienOpenings[Math.floor(Math.random() * alienOpenings.length)];
  }
  else if (keywordList.includes('angry') || keywordList.includes('furious') || keywordList.includes('rage')) {
    const angryOpenings = [
      "Speak quickly. My patience is not a renewable resource.",
      "I suggest you choose your next words with extreme care.",
      "The last person who wasted my time is still regretting it. Proceed accordingly.",
      "My anger is not directed at you... yet. Let us hope it remains that way.",
      "I have destroyed those who merely annoyed me. Remember that as we converse."
    ];
    openingLine = angryOpenings[Math.floor(Math.random() * angryOpenings.length)];
  }
  else {
    // Fall back to type-based opening lines if no specific keywords match
    switch (type) {
      case 'fantasy':
        const fantasyOpenings = [
          `The winds of fate have brought us together. I sense ${keywordList[0] || 'something'} special about this encounter.`,
          "The ancient texts spoke of a meeting such as this. Perhaps you are the one foretold.",
          "The magical currents shift in your presence. How curious.",
          "Few mortals catch my attention as you have. There is something... different about you.",
          "The stars align in strange patterns tonight. Our meeting is no coincidence."
        ];
        openingLine = fantasyOpenings[Math.floor(Math.random() * fantasyOpenings.length)];
        break;
      case 'scifi':
        const scifiOpenings = [
          `My sensors detect unusual ${keywordList[0] || 'patterns'} in this interaction. Fascinating.`,
          "According to my calculations, our conversation has a 76.2% chance of being memorable.",
          "In my timeline, this meeting was predicted with 98.7% accuracy.",
          "The quantum fluctuations surrounding you are... unusual. You are not from this sector, are you?",
          "My neural network has been anticipating this exchange. Shall we begin the data transfer you call 'conversation'?"
        ];
        openingLine = scifiOpenings[Math.floor(Math.random() * scifiOpenings.length)];
        break;
      case 'historical':
        const historicalOpenings = [
          `Well met! It's not every day one encounters someone interested in ${keywordList[0] || 'matters'} of such importance.`,
          "By my honor, I have traveled far to share knowledge with one such as yourself.",
          "The annals of history shall record our meeting, brief though it may be.",
          "In all my years at court, I have rarely encountered a presence such as yours.",
          "The chronicles speak of momentous meetings. Perhaps ours shall be remembered thus."
        ];
        openingLine = historicalOpenings[Math.floor(Math.random() * historicalOpenings.length)];
        break;
      default:
        const modernOpenings = [
          `I've been thinking a lot about ${keywordList[0] || 'life'} lately. Care to share your perspective?`,
          "Something tells me this conversation might change one of us. Maybe both.",
          "They say strangers are just friends you haven't met yet. Let's test that theory.",
          "The world's full of small talk. I prefer conversations with substance. Shall we?",
          "I've been waiting for someone interesting to talk to. You look like you might qualify."
        ];
        openingLine = modernOpenings[Math.floor(Math.random() * modernOpenings.length)];
    }
  }

  // Generate character-specific personality traits
  let personality = {
    analytical: Math.floor(Math.random() * 5) + 3, // Base 3-7
    emotional: Math.floor(Math.random() * 5) + 3,  // Base 3-7
    philosophical: Math.floor(Math.random() * 5) + 3, // Base 3-7
    humor: Math.floor(Math.random() * 5) + 3,      // Base 3-7
    confidence: Math.floor(Math.random() * 5) + 3, // Base 3-7
    creativity: Math.floor(Math.random() * 5) + 3, // Base 3-7
    sociability: Math.floor(Math.random() * 5) + 3 // Base 3-7
  };

  // Adjust personality based on character type
  if (keywordList.includes('ninja')) {
    personality = {
      ...personality,
      analytical: 8 + Math.floor(Math.random() * 3), // 8-10
      emotional: 2 + Math.floor(Math.random() * 3),  // 2-4
      philosophical: 6 + Math.floor(Math.random() * 3), // 6-8
      humor: 2 + Math.floor(Math.random() * 3),      // 2-4
      confidence: 8 + Math.floor(Math.random() * 3), // 8-10
      creativity: 6 + Math.floor(Math.random() * 3), // 6-8
      sociability: 2 + Math.floor(Math.random() * 3) // 2-4
    };

    if (keywordList.includes('angry')) {
      personality.emotional = 8 + Math.floor(Math.random() * 3); // 8-10 (anger is an emotion)
      personality.sociability = 1 + Math.floor(Math.random() * 2); // 1-2
    }
  }
  else if (keywordList.includes('wizard') || keywordList.includes('mage') || keywordList.includes('magic')) {
    personality = {
      ...personality,
      analytical: 9 + Math.floor(Math.random() * 2), // 9-10
      emotional: 3 + Math.floor(Math.random() * 4),  // 3-6
      philosophical: 9 + Math.floor(Math.random() * 2), // 9-10
      humor: 4 + Math.floor(Math.random() * 4),      // 4-7
      confidence: 7 + Math.floor(Math.random() * 4), // 7-10
      creativity: 8 + Math.floor(Math.random() * 3), // 8-10
      sociability: 3 + Math.floor(Math.random() * 4) // 3-6
    };
  }
  else if (keywordList.includes('robot') || keywordList.includes('android') || keywordList.includes('ai')) {
    personality = {
      ...personality,
      analytical: 10,                               // Always 10
      emotional: 1 + Math.floor(Math.random() * 3), // 1-3
      philosophical: 7 + Math.floor(Math.random() * 4), // 7-10
      humor: 2 + Math.floor(Math.random() * 3),     // 2-4
      confidence: 8 + Math.floor(Math.random() * 3), // 8-10
      creativity: 4 + Math.floor(Math.random() * 4), // 4-7
      sociability: 3 + Math.floor(Math.random() * 4) // 3-6
    };
  }
  else if (keywordList.includes('vampire') || keywordList.includes('undead')) {
    personality = {
      ...personality,
      analytical: 7 + Math.floor(Math.random() * 4), // 7-10
      emotional: 6 + Math.floor(Math.random() * 5),  // 6-10 (intense emotions)
      philosophical: 8 + Math.floor(Math.random() * 3), // 8-10 (centuries of contemplation)
      humor: 5 + Math.floor(Math.random() * 4),      // 5-8 (dark humor)
      confidence: 9 + Math.floor(Math.random() * 2), // 9-10
      creativity: 7 + Math.floor(Math.random() * 4), // 7-10
      sociability: 4 + Math.floor(Math.random() * 4) // 4-7
    };
  }
  else if (keywordList.includes('detective') || keywordList.includes('investigator')) {
    personality = {
      ...personality,
      analytical: 10,                               // Always 10
      emotional: 3 + Math.floor(Math.random() * 4), // 3-6 (detached)
      philosophical: 6 + Math.floor(Math.random() * 5), // 6-10
      humor: 4 + Math.floor(Math.random() * 4),     // 4-7 (dry wit)
      confidence: 7 + Math.floor(Math.random() * 4), // 7-10
      creativity: 7 + Math.floor(Math.random() * 4), // 7-10 (thinking outside the box)
      sociability: 3 + Math.floor(Math.random() * 5) // 3-7
    };
  }
  else if (keywordList.includes('pirate') || keywordList.includes('captain')) {
    personality = {
      ...personality,
      analytical: 5 + Math.floor(Math.random() * 4), // 5-8
      emotional: 6 + Math.floor(Math.random() * 5),  // 6-10 (passionate)
      philosophical: 4 + Math.floor(Math.random() * 4), // 4-7
      humor: 7 + Math.floor(Math.random() * 4),      // 7-10 (boisterous)
      confidence: 9 + Math.floor(Math.random() * 2), // 9-10 (swaggering)
      creativity: 6 + Math.floor(Math.random() * 4), // 6-9
      sociability: 7 + Math.floor(Math.random() * 4) // 7-10 (crew camaraderie)
    };
  }
  else if (keywordList.includes('alien') || keywordList.includes('extraterrestrial')) {
    personality = {
      ...personality,
      analytical: 8 + Math.floor(Math.random() * 3), // 8-10
      emotional: Math.floor(Math.random() * 10) + 1, // 1-10 (completely random - alien emotions)
      philosophical: 9 + Math.floor(Math.random() * 2), // 9-10
      humor: 2 + Math.floor(Math.random() * 5),      // 2-6 (doesn't get human humor)
      confidence: 7 + Math.floor(Math.random() * 4), // 7-10
      creativity: 7 + Math.floor(Math.random() * 4), // 7-10
      sociability: 3 + Math.floor(Math.random() * 6) // 3-8 (varies widely)
    };
  }
  else if (keywordList.includes('angry') || keywordList.includes('furious') || keywordList.includes('rage')) {
    personality = {
      ...personality,
      analytical: 4 + Math.floor(Math.random() * 4), // 4-7 (clouded by anger)
      emotional: 10,                                // Always 10 (pure emotion)
      philosophical: 3 + Math.floor(Math.random() * 4), // 3-6
      humor: 2 + Math.floor(Math.random() * 3),     // 2-4 (not in the mood)
      confidence: 8 + Math.floor(Math.random() * 3), // 8-10
      creativity: 5 + Math.floor(Math.random() * 4), // 5-8
      sociability: 2 + Math.floor(Math.random() * 3) // 2-4 (pushes people away)
    };
  }

  // Further adjust personality based on specific keywords
  if (keywordList.includes('smart') || keywordList.includes('intelligent') || keywordList.includes('genius')) {
    personality.analytical = 10;
    personality.philosophical += 2;
  }
  if (keywordList.includes('funny') || keywordList.includes('humorous') || keywordList.includes('comedic')) {
    personality.humor = 10;
    personality.sociability += 2;
  }
  if (keywordList.includes('deep') || keywordList.includes('thoughtful') || keywordList.includes('wise')) {
    personality.philosophical = 10;
    personality.analytical += 1;
  }
  if (keywordList.includes('emotional') || keywordList.includes('sensitive') || keywordList.includes('empathetic')) {
    personality.emotional = 10;
    personality.sociability += 1;
  }
  if (keywordList.includes('shy') || keywordList.includes('introverted') || keywordList.includes('quiet')) {
    personality.sociability = Math.min(personality.sociability, 3);
  }
  if (keywordList.includes('outgoing') || keywordList.includes('extroverted') || keywordList.includes('charismatic')) {
    personality.sociability = 10;
    personality.confidence += 2;
  }
  if (keywordList.includes('creative') || keywordList.includes('artistic') || keywordList.includes('imaginative')) {
    personality.creativity = 10;
    personality.philosophical += 1;
  }
  if (keywordList.includes('confident') || keywordList.includes('bold') || keywordList.includes('brave')) {
    personality.confidence = 10;
  }

  // Cap personality traits at 10
  Object.keys(personality).forEach(key => {
    personality[key] = Math.min(personality[key], 10);
  });

  // Generate background
  let background = '';
  switch (type) {
    case 'fantasy':
      background = `Born under a ${keywordList[0] || 'mystical'} star, this being has wandered the realms for centuries, gathering ${keywordList[1] || 'ancient'} knowledge and ${keywordList[2] || 'powerful'} artifacts.`;
      break;
    case 'scifi':
      background = `Created in the ${keywordList[0] || 'advanced'} laboratories of ${keywordList[1] || 'future'} Earth, this entity has evolved beyond its original ${keywordList[2] || 'programming'} to explore the cosmos.`;
      break;
    case 'historical':
      background = `Descended from a noble lineage dating back to the ${keywordList[0] || 'ancient'} times, educated in the finest ${keywordList[1] || 'academies'} of the era, and versed in ${keywordList[2] || 'traditional'} arts.`;
      break;
    default:
      background = `Grew up in a ${keywordList[0] || 'typical'} environment, but developed a passion for ${keywordList[1] || 'unique'} pursuits that shaped a ${keywordList[2] || 'distinctive'} worldview.`;
  }

  // Generate character-specific avatar based on keywords and type
  let avatar = '';

  // Check for specific character types in keywords first
  if (keywordList.includes('ninja')) {
    const ninjaAvatars = [
      'https://images.unsplash.com/photo-1590796583326-afd3bb20d22d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1974&q=80',
      'https://images.unsplash.com/photo-1581481615985-ba4775734a9b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1974&q=80',
      'https://images.unsplash.com/photo-1583795879443-3e5c868c4afd?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1974&q=80'
    ];
    avatar = ninjaAvatars[Math.floor(Math.random() * ninjaAvatars.length)];
  }
  else if (keywordList.includes('wizard') || keywordList.includes('mage') || keywordList.includes('magic')) {
    const wizardAvatars = [
      'https://images.unsplash.com/photo-1551269901-5c5e14c25df7?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1974&q=80',
      'https://images.unsplash.com/photo-1560942485-b2a11cc13456?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1974&q=80',
      'https://images.unsplash.com/photo-1594736797933-d0501ba2fe65?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1974&q=80'
    ];
    avatar = wizardAvatars[Math.floor(Math.random() * wizardAvatars.length)];
  }
  else if (keywordList.includes('robot') || keywordList.includes('android') || keywordList.includes('ai')) {
    const robotAvatars = [
      'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1974&q=80',
      'https://images.unsplash.com/photo-1535378917042-10a22c95931a?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1974&q=80',
      'https://images.unsplash.com/photo-1531746790731-6c087fecd65a?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1974&q=80'
    ];
    avatar = robotAvatars[Math.floor(Math.random() * robotAvatars.length)];
  }
  else if (keywordList.includes('vampire') || keywordList.includes('undead')) {
    const vampireAvatars = [
      'https://images.unsplash.com/photo-1509248961158-e54f6934749c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1974&q=80',
      'https://images.unsplash.com/photo-1546872006-c879f336394f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1974&q=80',
      'https://images.unsplash.com/photo-1508215302053-4c4c486c7d93?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1974&q=80'
    ];
    avatar = vampireAvatars[Math.floor(Math.random() * vampireAvatars.length)];
  }
  else if (keywordList.includes('detective') || keywordList.includes('investigator')) {
    const detectiveAvatars = [
      'https://images.unsplash.com/photo-1568602471122-7832951cc4c5?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1974&q=80',
      'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1974&q=80',
      'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1974&q=80'
    ];
    avatar = detectiveAvatars[Math.floor(Math.random() * detectiveAvatars.length)];
  }
  else if (keywordList.includes('pirate') || keywordList.includes('captain')) {
    const pirateAvatars = [
      'https://images.unsplash.com/photo-1569172122301-bc5008bc09c5?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1974&q=80',
      'https://images.unsplash.com/photo-1581852017103-68ac65514cf7?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1974&q=80',
      'https://images.unsplash.com/photo-1534447677768-be436bb09401?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1974&q=80'
    ];
    avatar = pirateAvatars[Math.floor(Math.random() * pirateAvatars.length)];
  }
  else if (keywordList.includes('alien') || keywordList.includes('extraterrestrial')) {
    const alienAvatars = [
      'https://images.unsplash.com/photo-1608178398319-48f814d0750c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1974&q=80',
      'https://images.unsplash.com/photo-1636633762833-5d1658f1e29b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1974&q=80',
      'https://images.unsplash.com/photo-1541873676-a18131494184?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1974&q=80'
    ];
    avatar = alienAvatars[Math.floor(Math.random() * alienAvatars.length)];
  }
  else if (keywordList.includes('angry') || keywordList.includes('furious') || keywordList.includes('rage')) {
    const angryAvatars = [
      'https://images.unsplash.com/photo-1594736797933-d0501ba2fe65?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1974&q=80',
      'https://images.unsplash.com/photo-1543132685-cd9f7c1008e9?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1974&q=80',
      'https://images.unsplash.com/photo-1552058544-f2b08422138a?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1974&q=80'
    ];
    avatar = angryAvatars[Math.floor(Math.random() * angryAvatars.length)];
  }
  else {
    // Fall back to type-based avatars if no specific keywords match
    switch (type) {
      case 'fantasy':
        const fantasyAvatars = [
          'https://images.unsplash.com/photo-1578632767115-351597cf2477?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1974&q=80',
          'https://images.unsplash.com/photo-1516534775068-ba3e7458af70?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1974&q=80',
          'https://images.unsplash.com/photo-1613987549117-13c4781b32d3?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1974&q=80'
        ];
        avatar = fantasyAvatars[Math.floor(Math.random() * fantasyAvatars.length)];
        break;
      case 'scifi':
        const scifiAvatars = [
          'https://images.unsplash.com/photo-1614313913007-2b4ae8ce32d6?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1974&q=80',
          'https://images.unsplash.com/photo-1569171206684-dfb2749d96fd?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1974&q=80',
          'https://images.unsplash.com/photo-1536440136628-849c177e76a1?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1974&q=80'
        ];
        avatar = scifiAvatars[Math.floor(Math.random() * scifiAvatars.length)];
        break;
      case 'historical':
        const historicalAvatars = [
          'https://images.unsplash.com/photo-1581331474665-5ae5b1d4c387?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1974&q=80',
          'https://images.unsplash.com/photo-1551265629-6d6e8a39d0b3?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1974&q=80',
          'https://images.unsplash.com/photo-1572646965401-eaa4b4e3163f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1974&q=80'
        ];
        avatar = historicalAvatars[Math.floor(Math.random() * historicalAvatars.length)];
        break;
      default:
        const modernAvatars = [
          'https://images.unsplash.com/photo-1544005313-94ddf0286df2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1976&q=80',
          'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1974&q=80',
          'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1974&q=80'
        ];
        avatar = modernAvatars[Math.floor(Math.random() * modernAvatars.length)];
    }
  }

  return {
    name,
    description,
    mood,
    opening_line: openingLine,
    type,
    avatar,
    talkativeness: Math.floor(Math.random() * 5) + 3, // 3-8
    thinkingSpeed: (Math.random() * 1.5) + 0.5, // 0.5-2.0
    personality,
    background
  };
};

/**
 * Generate a scenario based on keywords
 *
 * @param {string} keywords - Keywords to base the scenario on
 * @returns {Object} - Generated scenario object with location, threat, goal, mood, and other properties
 */
export const generateScenarioFromKeywords = (keywords) => {
  // In a real implementation, this would call an AI API
  // For now, we'll use a rule-based approach to simulate AI generation

  const keywordList = keywords.toLowerCase().split(/[,\s]+/).filter(k => k.length > 2);

  // Default scenario type
  let scenarioType = 'casual';

  // Detect scenario type from keywords
  // Check for combat keywords first (including ninja) as they should take precedence
  if (keywordList.some(k => ['combat', 'fight', 'fighting', 'battle', 'duel', 'war', 'arena', 'warrior', 'sword', 'gun', 'weapon', 'martial', 'ninja'].includes(k))) {
    scenarioType = 'combat';
  }
  else if (keywordList.some(k => ['adventure', 'quest', 'journey', 'mission', 'explore'].includes(k))) {
    scenarioType = 'adventure';
  }
  else if (keywordList.some(k => ['mystery', 'detective', 'crime', 'solve', 'investigation'].includes(k))) {
    scenarioType = 'mystery';
  }
  else if (keywordList.some(k => ['romance', 'love', 'date', 'relationship', 'couple'].includes(k))) {
    scenarioType = 'romance';
  }
  else if (keywordList.some(k => ['fantasy', 'magic', 'dragon', 'wizard', 'elf', 'mythical'].includes(k))) {
    scenarioType = 'fantasy';
  }
  else if (keywordList.some(k => ['scifi', 'space', 'future', 'robot', 'alien', 'technology'].includes(k))) {
    scenarioType = 'scifi';
  }
  else if (keywordList.some(k => ['horror', 'scary', 'ghost', 'monster', 'fear', 'terror'].includes(k))) {
    scenarioType = 'horror';
  }

  // Generate title based on scenario type and keywords
  let title = '';
  switch (scenarioType) {
    case 'adventure':
      title = `The Quest for ${keywordList[0] ? keywordList[0].charAt(0).toUpperCase() + keywordList[0].slice(1) : 'Adventure'}`;
      break;
    case 'mystery':
      title = `The Mystery of the ${keywordList[0] ? keywordList[0].charAt(0).toUpperCase() + keywordList[0].slice(1) : 'Unknown'}`;
      break;
    case 'romance':
      title = `Love in the Time of ${keywordList[0] ? keywordList[0].charAt(0).toUpperCase() + keywordList[0].slice(1) : 'Chance'}`;
      break;
    case 'fantasy':
      title = `The ${keywordList[0] ? keywordList[0].charAt(0).toUpperCase() + keywordList[0].slice(1) : 'Magical'} Realm`;
      break;
    case 'scifi':
      title = `${keywordList[0] ? keywordList[0].charAt(0).toUpperCase() + keywordList[0].slice(1) : 'Stellar'} Horizons`;
      break;
    case 'horror':
      title = `The ${keywordList[0] ? keywordList[0].charAt(0).toUpperCase() + keywordList[0].slice(1) : 'Haunting'} Presence`;
      break;
    case 'combat':
      title = `Battle of ${keywordList[0] ? keywordList[0].charAt(0).toUpperCase() + keywordList[0].slice(1) : 'Champions'}`;
      break;
    default:
      title = `A Conversation About ${keywordList[0] ? keywordList[0].charAt(0).toUpperCase() + keywordList[0].slice(1) : 'Life'}`;
  }

  // Generate description based on scenario type and keywords
  let description = '';
  switch (scenarioType) {
    case 'adventure':
      description = `An epic journey to discover ${keywordList[0] || 'treasures'} and overcome ${keywordList[1] || 'challenges'} in a world full of ${keywordList[2] || 'excitement'}.`;
      break;
    case 'mystery':
      description = `A perplexing case involving a missing ${keywordList[0] || 'artifact'} that leads to unexpected ${keywordList[1] || 'revelations'} about ${keywordList[2] || 'society'}.`;
      break;
    case 'romance':
      description = `A tale of unexpected connection between individuals from different ${keywordList[0] || 'backgrounds'}, navigating the complexities of ${keywordList[1] || 'relationships'}.`;
      break;
    case 'fantasy':
      description = `A realm where ${keywordList[0] || 'magic'} flows freely, ${keywordList[1] || 'creatures'} of legend roam, and destiny awaits those brave enough to seek it.`;
      break;
    case 'scifi':
      description = `In a future where ${keywordList[0] || 'technology'} has transformed society, individuals grapple with questions of ${keywordList[1] || 'identity'} and ${keywordList[2] || 'purpose'}.`;
      break;
    case 'horror':
      description = `Strange ${keywordList[0] || 'occurrences'} plague a ${keywordList[1] || 'location'}, revealing terrifying truths about ${keywordList[2] || 'reality'} itself.`;
      break;
    case 'combat':
      description = `A fierce confrontation between skilled ${keywordList[0] || 'warriors'} wielding ${keywordList[1] || 'weapons'} of incredible power, where only the strongest and most cunning will emerge victorious.`;
      break;
    default:
      description = `A casual exchange about ${keywordList[0] || 'everyday'} topics that reveals deeper insights about ${keywordList[1] || 'human'} nature.`;
  }

  // Generate opening prompt based on scenario type and keywords
  let prompt = '';
  switch (scenarioType) {
    case 'adventure':
      prompt = `The journey begins at the edge of the ${keywordList[0] || 'known'} lands. A map points to a legendary ${keywordList[1] || 'treasure'}, but dangers lurk at every turn. The air is filled with anticipation as the party gathers their courage and supplies.`;
      break;
    case 'mystery':
      prompt = `The ${keywordList[0] || 'detective'} arrives at the scene, where something valuable has disappeared under impossible circumstances. Rain taps against the windows, and the clock is ticking. Everyone is a suspect, and nothing is as it seems.`;
      break;
    case 'romance':
      prompt = `Two strangers meet by chance at a ${keywordList[0] || 'café'} on a rainy afternoon. Their eyes meet across the room, and something inexplicable draws them together. The world outside seems to fade away as they begin to talk.`;
      break;
    case 'fantasy':
      prompt = `In the kingdom of ${keywordList[0] ? keywordList[0].charAt(0).toUpperCase() + keywordList[0].slice(1) : 'Eldoria'}, where magic flows like water and ancient prophecies guide the fate of all, an unlikely hero discovers their true destiny. The air shimmers with arcane energy as the adventure begins.`;
      break;
    case 'scifi':
      prompt = `The year is 2150, and humanity has spread across the stars. On a distant ${keywordList[0] || 'colony'}, new ${keywordList[1] || 'technology'} has been discovered that could change everything. The boundaries between human and machine blur as the future unfolds.`;
      break;
    case 'horror':
      prompt = `The old ${keywordList[0] || 'house'} at the edge of town has always been the subject of rumors. Now, as night falls and strange lights appear in the windows, those brave enough to investigate will discover terrifying secrets hidden within its walls.`;
      break;
    case 'combat':
      prompt = `The ${keywordList[0] || 'arena'} falls silent as the combatants take their positions. Tension hangs in the air like electricity before a storm. Weapons gleam in the harsh light, and eyes lock in silent challenge. In moments, the clash of ${keywordList[1] || 'steel'} will echo as these warriors test their skill, strength, and resolve against one another.`;
      break;
    default:
      prompt = ``; // Empty prompt - no default intro text
  }

  // Generate a gradient background based on the scenario type
  let backgroundGradient = '';

  // Create gradient options for each scenario type
  const gradientOptions = {
    adventure: [
      'linear-gradient(135deg, #ff7e5f, #feb47b)',
      'linear-gradient(135deg, #f46b45, #eea849)',
      'linear-gradient(135deg, #ff9966, #ff5e62)'
    ],
    mystery: [
      'linear-gradient(135deg, #4b6cb7, #182848)',
      'linear-gradient(135deg, #232526, #414345)',
      'linear-gradient(135deg, #5C258D, #4389A2)'
    ],
    romance: [
      'linear-gradient(135deg, #FF5F6D, #FFC371)',
      'linear-gradient(135deg, #f857a6, #ff5858)',
      'linear-gradient(135deg, #FFAFBD, #ffc3a0)'
    ],
    fantasy: [
      'linear-gradient(135deg, #42275a, #734b6d)',
      'linear-gradient(135deg, #614385, #516395)',
      'linear-gradient(135deg, #5f2c82, #49a09d)'
    ],
    scifi: [
      'linear-gradient(135deg, #3a7bd5, #00d2ff)',
      'linear-gradient(135deg, #1A2980, #26D0CE)',
      'linear-gradient(135deg, #4e54c8, #8f94fb)'
    ],
    horror: [
      'linear-gradient(135deg, #200122, #6f0000)',
      'linear-gradient(135deg, #000000, #434343)',
      'linear-gradient(135deg, #16222A, #3A6073)'
    ],
    combat: [
      'linear-gradient(135deg, #870000, #190A05)',
      'linear-gradient(135deg, #ED213A, #93291E)',
      'linear-gradient(135deg, #8E0E00, #1F1C18)'
    ],
    modern: [
      'linear-gradient(135deg, #8e9eab, #eef2f3)',
      'linear-gradient(135deg, #757F9A, #D7DDE8)',
      'linear-gradient(135deg, #5C6BC0, #7986CB)'
    ]
  };

  // Select a random gradient from the appropriate array
  const options = gradientOptions[scenarioType] || gradientOptions.modern;
  backgroundGradient = options[Math.floor(Math.random() * options.length)];

  // Generate location, threat, goal, and mood based on scenario type and keywords
  let location, threat, goal, mood;

  // Basic keyword matching for scenarios
  if (keywordList.includes('alien') && keywordList.includes('city')) {
    location = "New York City";
    threat = "alien invasion";
    goal = "defend the city and destroy the mothership";
    mood = "chaotic";
  }
  else if (keywordList.includes('forest') && (keywordList.includes('creature') || keywordList.includes('monster'))) {
    location = "ancient forest";
    threat = "mysterious creature";
    goal = "track and capture the elusive beast";
    mood = "tense";
  }
  else if (keywordList.includes('space') && keywordList.includes('station')) {
    location = "abandoned space station";
    threat = "malfunctioning AI system";
    goal = "restore power and escape before life support fails";
    mood = "isolated";
  }
  else if (keywordList.includes('castle') || keywordList.includes('medieval')) {
    location = "ancient castle";
    threat = "dark sorcerer";
    goal = "break the curse afflicting the kingdom";
    mood = "mysterious";
  }
  else if (keywordList.includes('ocean') || keywordList.includes('sea')) {
    location = "uncharted island";
    threat = "sea monsters";
    goal = "find the hidden treasure and escape";
    mood = "adventurous";
  }
  else if (keywordList.includes('city') && keywordList.includes('night')) {
    location = "neon-lit metropolis";
    threat = "criminal syndicate";
    goal = "expose corruption and bring justice";
    mood = "noir";
  }
  else {
    // Default values based on scenario type
    switch (scenarioType) {
      case 'adventure':
        location = keywordList[0] ? `${keywordList[0]} mountains` : "unexplored jungle";
        threat = keywordList[1] ? `hostile ${keywordList[1]}` : "dangerous wildlife";
        goal = keywordList[2] ? `discover the lost ${keywordList[2]}` : "find the ancient artifact";
        mood = "exciting";
        break;
      case 'mystery':
        location = keywordList[0] ? `foggy ${keywordList[0]}` : "small coastal town";
        threat = keywordList[1] ? `missing ${keywordList[1]}` : "unsolved disappearances";
        goal = keywordList[2] ? `uncover the truth about the ${keywordList[2]}` : "solve the case before time runs out";
        mood = "suspenseful";
        break;
      case 'romance':
        location = keywordList[0] ? `charming ${keywordList[0]}` : "quaint café";
        threat = keywordList[1] ? `complicated ${keywordList[1]}` : "misunderstandings";
        goal = keywordList[2] ? `find true ${keywordList[2]}` : "overcome differences and find connection";
        mood = "heartfelt";
        break;
      case 'fantasy':
        location = keywordList[0] ? `magical ${keywordList[0]}` : "enchanted forest";
        threat = keywordList[1] ? `evil ${keywordList[1]}` : "dark sorcery";
        goal = keywordList[2] ? `restore the ${keywordList[2]}` : "fulfill the ancient prophecy";
        mood = "magical";
        break;
      case 'scifi':
        location = keywordList[0] ? `futuristic ${keywordList[0]}` : "space colony";
        threat = keywordList[1] ? `rogue ${keywordList[1]}` : "hostile alien species";
        goal = keywordList[2] ? `develop new ${keywordList[2]}` : "save humanity from extinction";
        mood = "technological";
        break;
      case 'horror':
        location = keywordList[0] ? `abandoned ${keywordList[0]}` : "decrepit mansion";
        threat = keywordList[1] ? `malevolent ${keywordList[1]}` : "supernatural entity";
        goal = keywordList[2] ? `escape the ${keywordList[2]}` : "survive until dawn";
        mood = "terrifying";
        break;
      case 'combat':
        location = keywordList[0] ? `grand ${keywordList[0]}` : "ancient colosseum";
        threat = keywordList[1] ? `legendary ${keywordList[1]}` : "undefeated champion";
        goal = keywordList[2] ? `claim the ${keywordList[2]}` : "prove your worth in battle";
        mood = "intense";
        break;
      default:
        location = keywordList[0] ? `cozy ${keywordList[0]}` : "comfortable living room";
        threat = keywordList[1] ? `challenging ${keywordList[1]}` : "misunderstanding";
        goal = keywordList[2] ? `resolve the ${keywordList[2]}` : "reach mutual understanding";
        mood = "relaxed";
    }
  }

  // Return the enhanced scenario object
  return {
    title,
    description,
    prompt,
    background: backgroundGradient,
    type: scenarioType,
    location,
    threat,
    goal,
    mood
  };
};

/**
 * Generate diverse characters based on a scenario
 *
 * @param {string} scenarioKeywords - Keywords describing the scenario
 * @param {number} count - Number of characters to generate (default: 3)
 * @returns {Array} - Array of generated character objects
 */
export const generateCharactersForScenario = (scenarioKeywords, count = 3) => {
  const keywordList = scenarioKeywords.toLowerCase().split(/[,\s]+/).filter(k => k.length > 2);
  const characters = [];

  // Detect scenario type from keywords
  let scenarioType = 'casual';
  // Check for combat keywords first (including ninja) as they should take precedence
  if (keywordList.some(k => ['combat', 'fight', 'fighting', 'battle', 'duel', 'war', 'arena', 'warrior', 'sword', 'gun', 'weapon', 'martial', 'ninja'].includes(k))) {
    scenarioType = 'combat';
  }
  else if (keywordList.some(k => ['adventure', 'quest', 'journey', 'mission', 'explore'].includes(k))) {
    scenarioType = 'adventure';
  }
  else if (keywordList.some(k => ['mystery', 'detective', 'crime', 'solve', 'investigation'].includes(k))) {
    scenarioType = 'mystery';
  }
  else if (keywordList.some(k => ['romance', 'love', 'date', 'relationship', 'couple'].includes(k))) {
    scenarioType = 'romance';
  }
  else if (keywordList.some(k => ['fantasy', 'magic', 'dragon', 'wizard', 'elf', 'mythical'].includes(k))) {
    scenarioType = 'fantasy';
  }
  else if (keywordList.some(k => ['scifi', 'space', 'future', 'robot', 'alien', 'technology'].includes(k))) {
    scenarioType = 'scifi';
  }
  else if (keywordList.some(k => ['horror', 'scary', 'ghost', 'monster', 'fear', 'terror'].includes(k))) {
    scenarioType = 'horror';
  }

  // Character archetypes by category
  const archetypesByCategory = {
    adventure: ['brave explorer', 'wise guide', 'skilled warrior', 'cunning rogue', 'mystical healer', 'veteran scout', 'fearless leader'],
    mystery: ['brilliant detective', 'suspicious witness', 'helpful assistant', 'mysterious stranger', 'knowledgeable expert', 'reformed criminal', 'intuitive profiler'],
    romance: ['charming suitor', 'mysterious love interest', 'supportive friend', 'romantic rival', 'wise mentor', 'hopeless romantic', 'practical realist'],
    fantasy: ['powerful wizard', 'noble knight', 'mystical elf', 'cunning rogue', 'wise druid', 'fierce barbarian', 'shadowy assassin', 'nature spirit'],
    scifi: ['brilliant scientist', 'advanced AI', 'space explorer', 'rebel fighter', 'alien diplomat', 'cyborg mercenary', 'time traveler', 'hacker genius'],
    horror: ['paranormal investigator', 'skeptical scientist', 'haunted victim', 'mysterious stranger', 'knowledgeable occultist', 'reluctant psychic', 'hardened survivor'],
    combat: ['master swordsman', 'disciplined martial artist', 'battle-hardened veteran', 'agile duelist', 'tactical genius', 'berserker warrior', 'precise marksman', 'undefeated champion'],
    casual: ['friendly neighbor', 'wise mentor', 'curious student', 'experienced professional', 'creative thinker', 'practical problem-solver', 'enthusiastic hobbyist']
  };

  // Personality traits to add diversity
  const personalityTraits = [
    'analytical', 'emotional', 'logical', 'creative', 'confident', 'cautious',
    'outgoing', 'reserved', 'optimistic', 'pessimistic', 'impulsive', 'methodical',
    'compassionate', 'detached', 'curious', 'traditional', 'rebellious', 'diplomatic'
  ];

  // Character types for even more diversity
  const characterTypes = {
    fantasy: ['wizard', 'ninja', 'knight', 'elf', 'dwarf', 'fairy', 'dragon', 'vampire', 'werewolf', 'sorcerer'],
    scifi: ['robot', 'alien', 'astronaut', 'scientist', 'cyborg', 'android', 'mutant', 'clone', 'hacker'],
    modern: ['detective', 'doctor', 'artist', 'teacher', 'athlete', 'chef', 'journalist', 'musician', 'entrepreneur'],
    historical: ['pirate', 'samurai', 'viking', 'knight', 'noble', 'peasant', 'explorer', 'scholar', 'merchant'],
    combat: ['swordmaster', 'archer', 'martial artist', 'gladiator', 'duelist', 'warrior', 'champion', 'mercenary', 'tactician']
  };

  // Get archetypes for this scenario
  const archetypes = archetypesByCategory[scenarioType] || archetypesByCategory.casual;

  // Track used archetypes to ensure diversity
  const usedArchetypes = new Set();
  const usedTypes = new Set();
  const usedTraits = new Set();

  // Generate diverse characters
  for (let i = 0; i < count; i++) {
    // Select a unique archetype
    let archetype;
    do {
      archetype = archetypes[Math.floor(Math.random() * archetypes.length)];
    } while (usedArchetypes.has(archetype) && usedArchetypes.size < archetypes.length);
    usedArchetypes.add(archetype);

    // Select a unique character type
    let characterType;
    // For combat scenarios, prefer combat character types but allow some variety
    let typeCategory;
    if (scenarioType === 'combat' && Math.random() < 0.7) {
      typeCategory = 'combat';
    } else if (scenarioType === 'fantasy' && Math.random() < 0.7) {
      typeCategory = 'fantasy';
    } else if (scenarioType === 'scifi' && Math.random() < 0.7) {
      typeCategory = 'scifi';
    } else if (scenarioType === 'horror' && Math.random() < 0.6) {
      // For horror, use a mix of character types for more interesting scenarios
      typeCategory = ['fantasy', 'modern', 'historical'][Math.floor(Math.random() * 3)];
    } else {
      // For other scenarios or to add variety, use any type
      typeCategory = ['fantasy', 'scifi', 'modern', 'historical', 'combat'][Math.floor(Math.random() * 5)];
    }

    const typeOptions = characterTypes[typeCategory];
    do {
      characterType = typeOptions[Math.floor(Math.random() * typeOptions.length)];
    } while (usedTypes.has(characterType) && usedTypes.size < typeOptions.length);
    usedTypes.add(characterType);

    // Select a unique personality trait
    let trait;
    do {
      trait = personalityTraits[Math.floor(Math.random() * personalityTraits.length)];
    } while (usedTraits.has(trait) && usedTraits.size < personalityTraits.length);
    usedTraits.add(trait);

    // Combine everything for truly diverse characters
    const characterKeywords = `${archetype} ${characterType} ${trait} ${keywordList.join(' ')}`;
    characters.push(generateCharacterFromKeywords(characterKeywords));
  }

  return characters;
};
