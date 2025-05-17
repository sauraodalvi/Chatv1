/**
 * Utility functions for generating scene descriptions and environmental cues
 */

// Track the last scene description type to ensure rotation
let lastSceneDescriptionType = 'action'; // Start with action so first one will be environment

/**
 * Generate a scene description or action cue based on the current context
 *
 * @param {Object} character - The character who will be speaking
 * @param {Object} storyArc - The current story arc
 * @param {Array} recentMessages - Recent messages for context
 * @param {string} messageType - Type of message (response, action, etc.)
 * @returns {string} - A scene description or action cue
 */
export const generateSceneDescription = (character, storyArc, recentMessages = [], messageType = 'response') => {
  if (!character || !storyArc) return '';

  const { theme, currentPhase, currentTension } = storyArc;
  const characterName = character.name;
  const characterType = character.type || 'general';

  // Get the most recent non-user message for context
  const lastMessage = recentMessages.filter(msg => !msg.isUser).slice(-1)[0];

  // Rotate between different types of scene descriptions
  // This ensures variety and prevents stacking multiple descriptions
  let descriptionType;

  if (messageType === 'action') {
    // For explicit action messages, always use character actions
    descriptionType = 'action';
  } else {
    // Otherwise rotate between environment, plot beat, and character action
    if (lastSceneDescriptionType === 'action') {
      descriptionType = 'environment';
    } else if (lastSceneDescriptionType === 'environment') {
      descriptionType = 'plot';
    } else {
      descriptionType = 'action';
    }

    // Override for high tension situations - prefer action descriptions
    if (currentTension === 'high' || currentTension === 'very high') {
      // 70% chance to use action during high tension
      if (Math.random() < 0.7) {
        descriptionType = 'action';
      }
    }

    // Save for next rotation
    lastSceneDescriptionType = descriptionType;
  }

  // Environmental descriptions based on theme
  const environmentalCues = {
    superhero: {
      introduction: [
        "Sirens wail in the distance as police evacuate civilians from the area.",
        "Civilians watch nervously from behind police barriers, phones recording the scene.",
        "News helicopters circle overhead, broadcasting the developing situation live.",
        "The New York skyline looms against darkening clouds, a storm brewing.",
        "Emergency services rush to evacuate the area as S.H.I.E.L.D. agents establish a perimeter.",
        "The Avengers Quinjet hovers above, its engines humming with power.",
        "Tactical teams set up defensive positions as civilians point to the sky.",
        "The air crackles with tension as the first signs of the alien threat appear."
      ],
      conflict: [
        "Explosions rock the ground, shattering windows in nearby skyscrapers.",
        "Debris rains down from damaged buildings as civilians run for cover.",
        "Smoke billows across the battlefield, obscuring visibility in all directions.",
        "Energy blasts illuminate the chaos, casting eerie blue light across the scene.",
        "The sound of combat echoes through the streets as car alarms blare in unison.",
        "Alien technology tears through concrete and steel like paper.",
        "The distinctive whine of repulsor technology cuts through the chaos.",
        "Lightning arcs across the sky, striking multiple targets with devastating precision.",
        "The ground trembles as Hulk's massive form crashes through enemy lines.",
        "Shield ricochets can be heard bouncing between multiple targets.",
        "Civilians trapped in a bus scream for help as alien forces approach.",
        "The distinctive twang of a bow firing specialized arrows in rapid succession."
      ],
      planning: [
        "Holographic displays show enemy positions, highlighting weak points in their formation.",
        "Maps and tactical data cover the table as team members point out strategic locations.",
        "Communication devices buzz with urgent updates from S.H.I.E.L.D. headquarters.",
        "The team gathers in a momentary lull, catching their breath before the next assault.",
        "Surveillance footage reveals enemy movements toward the city center.",
        "Tony's AI displays 3D projections of alien tech, identifying vulnerabilities.",
        "Captain America sketches a quick battle plan as the team gathers around.",
        "Thor describes Asgardian battle tactics that might be effective against the threat."
      ],
      climax: [
        "The final confrontation looms as the alien mothership descends from the clouds.",
        "Time is running out as the enemy's portal device begins to activate.",
        "The fate of New York—perhaps the world—hangs in the balance.",
        "The enemy's ultimate weapon powers up, distorting the air around it.",
        "This is the moment everything has led to—the Avengers stand as Earth's last defense.",
        "Civilians watch from buildings and shelters, their hopes pinned on the heroes.",
        "The sky tears open as dimensional energies reach critical levels.",
        "The team exchanges determined looks, knowing what must be done."
      ],
      resolution: [
        "Dust settles over the battlefield as the last enemy forces retreat or fall.",
        "The first rays of sunlight break through the smoke, illuminating the victorious heroes.",
        "Civilians emerge from shelter, looking hopeful as they cheer for the Avengers.",
        "Emergency crews begin the cleanup as S.H.I.E.L.D. secures alien technology.",
        "The city stands, battered but unbroken, saved once again by its protectors.",
        "News crews swarm the area, cameras focused on the exhausted but triumphant team.",
        "Medical teams tend to the injured as the heroes help with rescue operations.",
        "Children wave and point excitedly as their heroes stand amid the aftermath."
      ]
    },
    fantasy: {
      introduction: [
        "Torches flicker in the ancient hall.",
        "The forest whispers with unseen movement.",
        "Mist curls around gnarled tree roots.",
        "The tavern hums with hushed conversations.",
        "Ancient runes glow faintly on stone walls."
      ],
      discovery: [
        "A hidden doorway reveals itself.",
        "Ancient texts hold forgotten secrets.",
        "Magic tingles in the air.",
        "Mysterious tracks lead deeper into the unknown.",
        "Artifacts pulse with dormant power."
      ],
      conflict: [
        "Dark magic crackles through the air.",
        "Shadows move with unnatural purpose.",
        "The ground trembles beneath an unseen force.",
        "Weapons gleam in the dim light.",
        "The scent of fear and magic mingles."
      ],
      climax: [
        "The ancient prophecy unfolds.",
        "Magical energies reach their peak.",
        "The veil between worlds thins.",
        "Destiny's moment arrives.",
        "The final ritual begins."
      ],
      resolution: [
        "Magic settles like dust in sunlight.",
        "The natural order returns to balance.",
        "Ancient powers return to slumber.",
        "The realm breathes a collective sigh.",
        "New growth emerges from magical soil."
      ]
    },
    scifi: {
      introduction: [
        "Ship systems hum with quiet efficiency.",
        "Stars streak past the viewport.",
        "Holographic displays flicker with data.",
        "The alien atmosphere shimmers with strange colors.",
        "Scanners detect unusual energy signatures."
      ],
      discovery: [
        "Sensors detect an anomalous reading.",
        "The alien artifact pulses with unknown energy.",
        "Encrypted data begins to decode itself.",
        "A previously hidden doorway slides open.",
        "The ship's AI flags a critical discovery."
      ],
      conflict: [
        "Warning lights bathe the corridor in red.",
        "The ship shudders under enemy fire.",
        "Artificial gravity fluctuates momentarily.",
        "Emergency containment fields activate.",
        "Life support systems switch to backup power."
      ],
      climax: [
        "The countdown reaches critical levels.",
        "System failures cascade across all decks.",
        "The alien technology reaches full power.",
        "The fabric of space-time begins to warp.",
        "All escape routes are cut off."
      ],
      resolution: [
        "Systems return to normal operation.",
        "The ship's damage control teams begin repairs.",
        "New star charts are plotted.",
        "The alien technology is safely contained.",
        "Communication channels open with home base."
      ]
    },
    general: {
      introduction: [
        "The conversation begins in earnest.",
        "Attention focuses on the matter at hand.",
        "The atmosphere is charged with possibility.",
        "First impressions form quickly.",
        "The stage is set for what comes next."
      ],
      conflict: [
        "Tension fills the air.",
        "Opposing viewpoints clash.",
        "The stakes suddenly seem higher.",
        "A challenge has been issued.",
        "The easy rapport gives way to friction."
      ],
      resolution: [
        "Understanding dawns gradually.",
        "Common ground is finally found.",
        "The atmosphere lightens noticeably.",
        "A new perspective emerges.",
        "The path forward becomes clear."
      ]
    }
  };

  // Character-specific action cues
  const characterActions = {
    superhero: {
      "Captain America": [
        "*adjusts shield on arm, standing tall with unwavering determination*",
        "*scans the battlefield with tactical precision, identifying priority threats*",
        "*helps a civilian to safety before turning back to face the enemy*",
        "*communicates quickly through team comms, coordinating the Avengers' movements*",
        "*takes a defensive stance, shield ready to protect both himself and nearby civilians*",
        "*throws his shield with perfect accuracy, hitting multiple targets before catching it*",
        "*performs an acrobatic leap over debris to reach endangered civilians*",
        "*gives hand signals to coordinate the team's tactical formation*",
        "*plants his feet firmly, becoming an immovable barrier between civilians and danger*",
        "*his expression shows the weight of leadership and determination to protect*"
      ],
      "Iron Man": [
        "*HUD displays light up with tactical data, JARVIS highlighting priority targets*",
        "*repulsors glow blue as systems power up for the next attack*",
        "*helmet retracts to reveal a determined expression with a hint of trademark snark*",
        "*hovers slightly above ground, surveying the scene with advanced sensors*",
        "*runs diagnostics while speaking, armor showing battle damage but still functional*",
        "*redirects power to critical systems as armor sparks from a recent hit*",
        "*stabilizers adjust mid-flight, compensating for damaged components*",
        "*fires precision repulsor blasts while maintaining conversation*",
        "*nanites reconfigure armor to adapt to the current threat*",
        "*gestures with armored hands, bringing up holographic battle data*"
      ],
      "Thor": [
        "*lightning crackles around Mjolnir, responding to his emotions*",
        "*cape billows in the wind as he lands with godly impact*",
        "*looks to the skies, sensing a change in the atmospheric conditions*",
        "*twirls hammer with practiced ease, building momentum for an attack*",
        "*voice carries with godly authority that demands attention*",
        "*summons a focused lightning bolt that strikes his hammer*",
        "*stands tall among the team, his Asgardian armor gleaming despite the battle*",
        "*eyes glow with electric blue energy as he channels his power*",
        "*raises Mjolnir to the sky, storm clouds gathering in response*",
        "*speaks with the formal cadence of Asgard, even in the heat of battle*"
      ],
      "Hulk": [
        "*muscles tense, barely containing rage that fuels his strength*",
        "*fists clench, creating small tremors in the ground beneath*",
        "*growls low, eyes scanning for threats to smash*",
        "*towers over others, protective stance shielding teammates*",
        "*smashes fist into palm for emphasis, the impact echoing*",
        "*roars with primal fury that makes nearby enemies hesitate*",
        "*tears a chunk of concrete from the ground to use as a weapon*",
        "*chest heaves with barely controlled anger, eyes flashing green*",
        "*stomps the ground, creating a shockwave that staggers approaching enemies*",
        "*snorts dismissively at enemy weapons pointed in his direction*"
      ],
      "Black Widow": [
        "*checks Widow's Bite gauntlets with practiced efficiency*",
        "*moves with fluid grace that masks lethal combat readiness*",
        "*scans for tactical advantages others might miss*",
        "*reloads weapons with swift, economical movements*",
        "*expression reveals nothing while assessing the situation*",
        "*performs a subtle combat stance adjustment, ready to move in any direction*",
        "*touches comm device, sharing intelligence with the team*",
        "*eyes narrow slightly, spotting a vulnerability in enemy formations*",
        "*fingers flex near holstered weapons, ready to draw in milliseconds*",
        "*moves silently into an optimal position for the next engagement*"
      ],
      "Hawkeye": [
        "*nocks an arrow with lightning speed, eyes never leaving the target*",
        "*adjusts bow sight for wind and distance calculations*",
        "*fingers tap quiver, selecting specialized arrow types*",
        "*scans high vantage points for optimal positioning*",
        "*draws bowstring back with perfect form despite the chaos*",
        "*counts remaining arrows while assessing priority targets*",
        "*makes minute adjustments to aim that account for multiple variables*",
        "*moves to higher ground with the agility of a seasoned operative*",
        "*communicates target information through hand signals to the team*",
        "*eyes track multiple moving targets simultaneously with uncanny precision*"
      ],
      "default": [
        "*powers flare momentarily, ready for deployment*",
        "*stands ready for action, superhuman abilities evident*",
        "*watches the surroundings with heightened awareness of the battlefield*",
        "*moves with superhuman grace through the chaotic environment*",
        "*demonstrates abilities briefly, preparing for the next engagement*",
        "*adjusts tactical position to maximize effectiveness*",
        "*communicates with teammates through Avengers comm systems*",
        "*eyes track enemy movements with professional assessment*",
        "*body language shifts to combat readiness as threats approach*",
        "*powers activate in response to changing battle conditions*"
      ]
    },
    fantasy: {
      "Elara Moonwhisper": [
        "*silver eyes gleam with ancient wisdom*",
        "*traces magical symbols in the air*",
        "*commune with nature spirits briefly*",
        "*robes shimmer with arcane energy*",
        "*staff glows in response to emotions*"
      ],
      "default": [
        "*ancient power stirs at the words*",
        "*gestures with practiced mystical movements*",
        "*senses shift in magical energies*",
        "*incantation forms on lips*",
        "*connects to the elements around*"
      ]
    },
    scifi: {
      "Commander Zax": [
        "*checks tactical display on wrist computer*",
        "*adjusts environmental suit settings*",
        "*scans surroundings with enhanced vision*",
        "*communicates briefly through neural link*",
        "*weapon systems remain on standby*"
      ],
      "default": [
        "*tech interfaces respond to neural commands*",
        "*scans environment with advanced sensors*",
        "*adjusts to changing atmospheric conditions*",
        "*holographic data appears with a gesture*",
        "*cybernetic enhancements whir quietly*"
      ]
    },
    general: {
      "default": [
        "*expression shifts thoughtfully*",
        "*gestures to emphasize the point*",
        "*pauses to consider the implications*",
        "*moves with deliberate purpose*",
        "*voice carries emotional weight*"
      ]
    }
  };

  // Select appropriate descriptions based on context
  let descriptions;
  let actions;

  // Get environmental cues based on theme and phase
  if (environmentalCues[theme] && environmentalCues[theme][currentPhase]) {
    descriptions = environmentalCues[theme][currentPhase];
  } else if (environmentalCues[theme]) {
    // Fallback to any available phase for this theme
    const availablePhases = Object.keys(environmentalCues[theme]);
    const fallbackPhase = availablePhases[0];
    descriptions = environmentalCues[theme][fallbackPhase];
  } else {
    // Ultimate fallback to general descriptions
    descriptions = environmentalCues.general.introduction;
  }

  // Get character actions based on type and name
  if (characterActions[characterType] && characterActions[characterType][characterName]) {
    actions = characterActions[characterType][characterName];
  } else if (characterActions[characterType]) {
    // Fallback to default actions for this character type
    actions = characterActions[characterType].default;
  } else {
    // Ultimate fallback to general actions
    actions = characterActions.general.default;
  }

  // Select a random description and action
  const description = descriptions[Math.floor(Math.random() * descriptions.length)];
  const action = actions[Math.floor(Math.random() * actions.length)];

  // Plot beat descriptions based on theme and phase
  const plotBeats = {
    superhero: {
      introduction: [
        "The Avengers assemble, each bringing unique abilities to the fight ahead.",
        "S.H.I.E.L.D. provides a mission briefing with satellite imagery of the alien incursion.",
        "Stark's AI analyzes the alien technology, identifying potential weaknesses.",
        "Secure communications channels open between team members as they spread out.",
        "Captain America outlines the tactical approach, assigning roles to each Avenger.",
        "Thor shares knowledge of similar threats he's encountered across the Nine Realms.",
        "Banner reluctantly prepares for Hulk's emergence as the situation escalates.",
        "Black Widow and Hawkeye check their equipment, exchanging knowing glances."
      ],
      conflict: [
        "The alien forces are advancing rapidly toward civilian population centers.",
        "Civilian evacuation is only 60% complete as the perimeter is breached.",
        "A secondary alien force has been detected approaching from the harbor.",
        "Iron Man's armor sustains damage, forcing tactical adjustments.",
        "Thor's lightning strikes become more focused as the battle intensifies.",
        "Captain America's shield becomes the rallying point for the team's defense.",
        "Hulk's rage builds with each wave of enemies, becoming harder to direct.",
        "Black Widow infiltrates enemy lines to gather critical intelligence.",
        "Hawkeye calls out patterns and strays from his elevated position.",
        "The team's coordination improves as they adapt to the alien fighting style."
      ],
      planning: [
        "Multiple strategies are debated as the team regroups behind cover.",
        "Intelligence from Black Widow reveals a weakness in the alien command structure.",
        "A countdown appears on Iron Man's HUD, showing time until the mothership arrives.",
        "Captain America quickly assigns resources and positions for the next engagement.",
        "Thor describes an Asgardian battle tactic that might work against the alien forces.",
        "Banner analyzes alien tech while struggling to maintain control over Hulk.",
        "Hawkeye identifies key strategic positions for the team to target.",
        "The team prepares for a coordinated assault on the alien command center."
      ],
      climax: [
        "This is the moment everything has led to—the final stand against the invasion.",
        "The alien mothership descends through the clouds above Manhattan.",
        "Iron Man's systems reach maximum capacity as he prepares for a critical attack.",
        "Captain America rallies the team with a speech about what they're fighting for.",
        "Thor channels unprecedented lightning power, the sky darkening in response.",
        "Hulk roars a challenge that echoes between skyscrapers, drawing enemy attention.",
        "Black Widow prepares to infiltrate the alien command structure.",
        "Hawkeye nocks his last specialized arrow, designed for this exact moment.",
        "The Avengers move in perfect coordination, each playing their crucial role."
      ],
      resolution: [
        "The alien threat is neutralized, the invasion repelled by Earth's mightiest heroes.",
        "Recovery efforts begin as the Avengers help search for survivors in damaged buildings.",
        "The cost of victory becomes apparent in the damaged city and exhausted heroes.",
        "A sense of relief spreads through New York as citizens emerge to thank their protectors.",
        "S.H.I.E.L.D. teams move in to contain alien technology scattered across the battlefield.",
        "The team gathers for a moment of quiet reflection before dispersing.",
        "News reports already debate the Avengers' actions and their impact on the city.",
        "Seeds of the next challenge appear as government officials arrive to assess the situation."
      ]
    },
    fantasy: {
      introduction: [
        "Ancient prophecies begin to unfold.",
        "Magic stirs in the forgotten places.",
        "Whispers of a coming change spread.",
        "The balance of power shifts subtly.",
        "Signs and portents appear to those who can read them."
      ],
      discovery: [
        "A hidden truth comes to light.",
        "The pieces of the puzzle start to fit together.",
        "An ancient secret reveals itself.",
        "The true nature of the threat becomes clear.",
        "Knowledge long forgotten returns to the world."
      ],
      conflict: [
        "Dark forces gather strength with each passing moment.",
        "The corruption spreads further into the realm.",
        "Allies become harder to distinguish from enemies.",
        "The cost of inaction grows with each passing hour.",
        "The enemy's plan advances despite resistance."
      ],
      climax: [
        "The fate of the realm hangs in the balance.",
        "Ancient powers awaken fully.",
        "The final trial cannot be avoided.",
        "Destiny and choice converge at this moment.",
        "The world holds its breath."
      ],
      resolution: [
        "A new age begins to dawn.",
        "The balance is restored, though changed forever.",
        "Wounds begin to heal, leaving scars as reminders.",
        "Stories of what transpired spread across the land.",
        "Seeds of future conflicts lie dormant in victory."
      ]
    },
    general: {
      introduction: [
        "The situation unfolds gradually.",
        "Initial impressions prove important.",
        "The stage is set for what comes next.",
        "First moves are made carefully.",
        "Opening positions are established."
      ],
      conflict: [
        "Tensions rise as positions harden.",
        "The stakes become increasingly clear.",
        "Pressure builds on all sides.",
        "The point of no return approaches.",
        "Choices narrow as consequences loom."
      ],
      resolution: [
        "A new understanding begins to form.",
        "The aftermath reveals what truly matters.",
        "Lessons emerge from the experience.",
        "The path forward becomes visible.",
        "What was lost and gained becomes clear."
      ]
    }
  };

  // Get plot beats based on theme and phase
  let beats;
  if (plotBeats[theme] && plotBeats[theme][currentPhase]) {
    beats = plotBeats[theme][currentPhase];
  } else if (plotBeats[theme]) {
    // Fallback to any available phase for this theme
    const availablePhases = Object.keys(plotBeats[theme]);
    const fallbackPhase = availablePhases[0];
    beats = plotBeats[theme][fallbackPhase];
  } else {
    // Ultimate fallback to general beats
    beats = plotBeats.general.introduction;
  }

  // Select a random plot beat
  const plotBeat = beats[Math.floor(Math.random() * beats.length)];

  // Return the appropriate description based on the rotation type
  switch (descriptionType) {
    case 'environment':
      return description;
    case 'plot':
      return plotBeat;
    case 'action':
    default:
      return action;
  }
};

/**
 * Generate an environmental event description
 *
 * @param {Object} storyArc - The current story arc
 * @param {Array} characters - The characters in the scene
 * @returns {string} - An environmental event description
 */
export const generateEnvironmentalEvent = (storyArc, characters = []) => {
  if (!storyArc) return '';

  const { theme, currentPhase, currentTension } = storyArc;

  // Environmental events based on theme and phase
  const environmentalEvents = {
    superhero: {
      introduction: [
        "A news helicopter flies overhead, broadcasting the scene live as the Avengers arrive.",
        "Civilians rush to evacuate the area as police set up barriers and point to the sky.",
        "The ground trembles as something massive approaches in the distance, causing car alarms to trigger.",
        "S.H.I.E.L.D. agents arrive, setting up a command center and advanced scanning equipment.",
        "A government official arrives, demanding a briefing from Captain America on the situation.",
        "The Avengers Quinjet descends rapidly, landing in a cleared area as civilians cheer.",
        "Stark Industries security teams deploy advanced containment technology around the perimeter.",
        "Thor's arrival creates a sudden atmospheric disturbance, clouds swirling above the city."
      ],
      conflict: [
        "A building's support structure fails, sending debris crashing down toward trapped civilians.",
        "A school bus full of children is trapped between alien forces, their faces pressed against windows.",
        "Enemy reinforcements arrive, dropping from a portal that tears open in the sky above Manhattan.",
        "A power line snaps, sending dangerous electrical arcs across the battlefield toward a fuel truck.",
        "The alien forces deploy a new weapon that distorts gravity in a three-block radius.",
        "A massive alien creature bursts through the street, sending cars flying in all directions.",
        "Civilians trapped in a subway station scream for help as water begins flooding in.",
        "The Hulk's impact creates a shockwave that shatters windows for blocks around.",
        "Iron Man's targeting systems identify a critical weakness in the alien mothership.",
        "Captain America's shield ricochets between multiple targets before returning to his hand.",
        "Black Widow's Widow's Bite short-circuits an alien energy shield, creating an opening.",
        "Hawkeye fires an explosive arrow that detonates precisely at a strategic junction point."
      ],
      planning: [
        "Satellite imagery from Stark satellites reveals enemy movement toward Grand Central Station.",
        "A wounded S.H.I.E.L.D. agent arrives with critical intelligence about the alien invasion plan.",
        "Communications are briefly jammed by alien technology, cutting off contact with headquarters.",
        "Dr. Banner points out a pattern in the alien attack formation that suggests a vulnerability.",
        "A sudden thunderstorm forms as Thor channels his power, complicating aerial operations.",
        "Tony's AI assistant provides real-time analysis of the alien technology's power source.",
        "Captain America quickly sketches a tactical plan using debris on the ground.",
        "Natasha translates intercepted enemy communications, revealing their next target."
      ],
      climax: [
        "The alien mothership begins charging its main weapon, creating distortions in the air above the city.",
        "A forcefield surrounds Times Square, trapping civilians and heroes inside the final battleground.",
        "The ground splits open along Fifth Avenue, revealing an underground alien facility beneath.",
        "Temporal distortions from the alien technology cause localized time anomalies across the battlefield.",
        "Civilian evacuations are only half-complete as the final countdown to the portal's expansion begins.",
        "The Avengers form a defensive circle, standing together against overwhelming odds.",
        "Iron Man's armor shows critical damage as he prepares for one final decisive attack.",
        "Thor summons the largest lightning storm ever seen over New York, the air charged with power."
      ],
      resolution: [
        "Cheers erupt from watching civilians as the Avengers neutralize the alien threat.",
        "Emergency services move in to treat the wounded as the heroes help clear debris.",
        "The first rays of sunrise break through the smoke, illuminating the team standing together.",
        "S.H.I.E.L.D. containment teams arrive to secure alien technology scattered across the battlefield.",
        "News crews swarm the area, cameras focused on the exhausted but triumphant Avengers.",
        "Captain America helps rescue workers free trapped civilians from a collapsed structure.",
        "Iron Man's damaged armor powers down as medical teams rush to check on him.",
        "Children cheer and wave homemade Avengers signs from windows of nearby buildings."
      ]
    },
    fantasy: {
      introduction: [
        "Ancient runes on the walls begin to glow with mysterious energy.",
        "A messenger arrives with an urgent scroll bearing the royal seal.",
        "Wildlife flees through the area, sensing danger before humans can.",
        "The tavern falls silent as a hooded stranger enters and surveys the room.",
        "A mystical fog rolls in, bringing with it whispers of ancient times."
      ],
      discovery: [
        "The ground shifts, revealing a hidden entrance to forgotten catacombs.",
        "A magical barrier flickers and fails, allowing access to a forbidden area.",
        "Ancient texts begin to translate themselves in swirling magical script.",
        "A spectral figure appears briefly, pointing toward an unmarked path.",
        "Artifacts in the room resonate with each other, creating a map of energy."
      ],
      conflict: [
        "Dark energy corrupts the surrounding plant life, turning it twisted and hostile.",
        "The sky darkens unnaturally as magical forces gather strength.",
        "Protective wards flare and strain against an unseen magical assault.",
        "The ground trembles as ancient guardians awaken from their slumber.",
        "Rifts to other planes begin to open, allowing glimpses of other worlds."
      ],
      climax: [
        "The convergence of ley lines reaches its peak, flooding the area with raw magic.",
        "Ancient prophecy manifests in physical signs and portents all around.",
        "The barrier between worlds thins to transparency as realms begin to merge.",
        "Magical artifacts activate simultaneously, their powers combining unpredictably.",
        "Time flows strangely as past, present and future briefly overlap."
      ],
      resolution: [
        "Natural balance returns to the land as corrupted magic dissipates.",
        "Magical creatures emerge from hiding, sensing the return of harmony.",
        "Ancient guardians return to their slumber, their purpose fulfilled.",
        "The first new growth appears in previously blighted areas.",
        "Celestial alignments shift, marking the end of one age and the beginning of another."
      ]
    },
    scifi: {
      introduction: [
        "Ship sensors detect an anomalous energy signature approaching.",
        "Artificial gravity fluctuates momentarily as systems calibrate.",
        "A transmission from command arrives, updating mission parameters.",
        "The ship's AI announces completion of a deep scan of the sector.",
        "Environmental systems adjust to compensate for external radiation."
      ],
      discovery: [
        "Scanners detect life signs where none should exist.",
        "The ship's computer decodes part of an alien transmission.",
        "A previously dormant alien artifact begins to power up.",
        "Sensors map a hidden structure beneath the planet's surface.",
        "Quantum fluctuations reveal glimpses of parallel timelines."
      ],
      conflict: [
        "Hull breach alerts sound as enemy weapons find their mark.",
        "Critical systems switch to backup power after a direct hit.",
        "Artificial intelligence subroutines show signs of external tampering.",
        "Hostile boarding parties are detected in multiple sectors.",
        "Radiation from damaged systems reaches dangerous levels."
      ],
      climax: [
        "The ship's self-destruct sequence is activated with a countdown.",
        "Quantum singularity readings spike to unprecedented levels.",
        "All escape pods automatically prepare for emergency launch.",
        "The alien mothership begins charging its main weapon array.",
        "Space-time distortions threaten to tear the ship apart."
      ],
      resolution: [
        "Damage control teams report successful containment of critical failures.",
        "Long-range sensors confirm the retreat of enemy forces.",
        "The ship's AI completes diagnostics and begins self-repair protocols.",
        "Communication channels reopen with allied forces in the sector.",
        "New stellar phenomena emerge in the aftermath of the conflict."
      ]
    },
    general: {
      introduction: [
        "The atmosphere in the room shifts as new information comes to light.",
        "External events interrupt, demanding immediate attention.",
        "A message arrives that changes the context of the discussion.",
        "Environmental conditions change, affecting everyone present.",
        "Unexpected evidence appears, altering the course of conversation."
      ],
      conflict: [
        "External pressures escalate the tension in the room.",
        "A deadline is suddenly moved up, creating urgency.",
        "New stakeholders enter the situation with their own agendas.",
        "Resources become more limited than previously thought.",
        "Conflicting information arrives, causing confusion and disagreement."
      ],
      resolution: [
        "External validation arrives for the chosen course of action.",
        "New resources become available, easing previous constraints.",
        "The environment becomes more conducive to cooperation.",
        "Time pressure eases, allowing for more thoughtful consideration.",
        "A shared external challenge unites previously opposing viewpoints."
      ]
    }
  };

  // Select appropriate events based on context
  let events;

  // Get environmental events based on theme and phase
  if (environmentalEvents[theme] && environmentalEvents[theme][currentPhase]) {
    events = environmentalEvents[theme][currentPhase];
  } else if (environmentalEvents[theme]) {
    // Fallback to any available phase for this theme
    const availablePhases = Object.keys(environmentalEvents[theme]);
    const fallbackPhase = availablePhases[0];
    events = environmentalEvents[theme][fallbackPhase];
  } else {
    // Ultimate fallback to general events
    events = environmentalEvents.general.introduction;
  }

  // Select a random event
  const event = events[Math.floor(Math.random() * events.length)];

  return event;
};

/**
 * Determine if an environmental event should occur
 *
 * @param {Object} storyArc - The current story arc
 * @param {number} messageCount - Number of messages since last event
 * @returns {boolean} - Whether an environmental event should occur
 */
export const shouldTriggerEnvironmentalEvent = (storyArc, messageCount) => {
  if (!storyArc) return false;

  const { currentPhase, currentTension } = storyArc;

  // Enforce minimum spacing between events (5-8 turns)
  if (messageCount < 5) {
    return false; // Too soon for another event
  }

  // Base chance increases with message count, maxing out at 8 messages
  // This creates a window of opportunity between 5-8 messages
  let eventChance = 0;

  if (messageCount >= 8) {
    // After 8 messages, higher chance to trigger
    eventChance = 0.35; // 35% chance
  } else if (messageCount >= 7) {
    eventChance = 0.25; // 25% chance
  } else if (messageCount >= 6) {
    eventChance = 0.15; // 15% chance
  } else if (messageCount >= 5) {
    eventChance = 0.05; // 5% chance
  }

  // Adjust chance based on story phase and tension
  if (currentPhase === 'climax') {
    eventChance += 0.1; // +10% during climax
  } else if (currentPhase === 'conflict') {
    eventChance += 0.05; // +5% during conflict
  } else if (currentPhase === 'resolution') {
    eventChance -= 0.05; // -5% during resolution
  }

  if (currentTension === 'very high') {
    eventChance += 0.1; // +10% during very high tension
  } else if (currentTension === 'high') {
    eventChance += 0.05; // +5% during high tension
  } else if (currentTension === 'low') {
    eventChance -= 0.05; // -5% during low tension
  }

  // Random check
  return Math.random() < eventChance;
};
