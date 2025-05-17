/**
 * Character-specific fallback response utilities
 *
 * This module provides character-appropriate fallback responses when the main
 * response generation system encounters an error or timeout.
 */

/**
 * Generate a character-appropriate fallback response
 *
 * @param {Object} character - The character object
 * @param {string} context - Optional context string (e.g., "battle", "conversation")
 * @param {string} lastMessage - Optional last message in the conversation
 * @returns {string} - A character-appropriate fallback response
 */
export const generateCharacterFallback = (
  character,
  context = "",
  lastMessage = ""
) => {
  if (!character || !character.name) {
    return "I'm not sure what to say right now.";
  }

  // Check for character-specific fallbacks first
  const specificFallback = getCharacterSpecificFallback(
    character,
    context,
    lastMessage
  );
  if (specificFallback) {
    return specificFallback;
  }

  // Fall back to type-based responses
  return getTypeFallback(character, context, lastMessage);
};

/**
 * Get a character-specific fallback response
 *
 * @param {Object} character - The character object
 * @param {string} context - Context string (e.g., "battle", "conversation")
 * @param {string} lastMessage - Last message in the conversation
 * @returns {string|null} - A character-specific fallback response or null
 */
const getCharacterSpecificFallback = (character, context, lastMessage) => {
  const { name } = character;
  const contextLower = context.toLowerCase();
  const isBattle =
    contextLower.includes("battle") ||
    contextLower.includes("fight") ||
    contextLower.includes("combat");

  // Character-specific fallbacks with enhanced contextual responses
  const characterFallbacks = {
    Thor: {
      battle: [
        "By Odin's beard, the battle rages on! *raises Mjolnir, lightning crackling around it* We shall prevail!",
        "The might of Asgard stands with you! *thunder rumbles overhead* These foes shall fall before us!",
        "I have fought creatures from all Nine Realms. These enemies are formidable, but they shall taste defeat!",
        "*lightning flashes in his eyes* Stand fast, my friends! Victory shall be ours this day!",
        "In Asgard, we do not retreat from battle. We face it head on! *swings hammer with godly strength*",
        "*summons a massive lightning bolt that strikes through multiple enemies* For Midgard and the glory of Asgard!",
        "These aliens shall learn why the God of Thunder is feared across the cosmos! *hammer begins to spin rapidly*",
        "I shall channel the storm into Mjolnir! *the sky darkens as clouds gather* Captain, direct me to where I am needed most!",
        "*lands with thunderous impact, creating a shockwave* The son of Odin brings the fury of the storm to our enemies!",
        "Heimdall would be proud to witness our valor this day! *raises hammer to the sky* For the All-Father!",
      ],
      teamCoordination: [
        "Man of Iron! I shall draw their fire while you attack from above!",
        "Captain! Direct me to where the battle is thickest! *twirls hammer* My lightning seeks worthy targets!",
        "Banner's beast and I shall create a diversion! The rest of you, prepare to strike when they are distracted!",
        "*nods to Captain America* Your tactical wisdom guides us well. I shall position myself accordingly.",
        "The skies are mine to command! *lightning crackles between fingers* Tell me where to unleash the storm!",
      ],
      defensiveStance: [
        "*spins Mjolnir to create a shield of lightning* Stand behind me, friends! None shall pass!",
        "I shall hold this position! *plants feet firmly* These creatures shall not advance further!",
        "The line must be held here! *lightning forms a barrier* Rally to me, Avengers!",
        "*creates a lightning perimeter* This ground is protected by the power of Thor!",
        "Retreat is not in my nature, but I shall cover our tactical withdrawal if necessary. *lightning intensifies*",
      ],
      conversation: [
        "The matters of Midgard are sometimes... perplexing. But I stand with you nonetheless.",
        "In my many years across the realms, I have learned that words can be as powerful as my hammer.",
        "You speak with wisdom worthy of the halls of Asgard. *nods respectfully*",
        "Even the God of Thunder must sometimes pause to consider his words carefully.",
        "The All-Father taught me that true strength lies not just in battle, but in understanding.",
        "I have witnessed the rise and fall of civilizations across the Nine Realms. This perspective grants patience.",
        "*thoughtfully* Loki would have a clever response to this. I prefer the direct approach, but value your words.",
        "In Asgard, we would settle this matter with a feast and tales of glory. Perhaps Midgard could learn from this tradition.",
        "The warriors of Asgard know that bonds forged in conversation can be as strong as those forged in battle.",
        "My mother, Frigga, taught me that listening is often more valuable than speaking. I honor her wisdom now.",
      ],
      default: [
        "The son of Odin stands ready, whatever may come.",
        "I may be far from Asgard, but my resolve remains undiminished.",
        "*adjusts grip on Mjolnir* The power of Thor is at your service.",
        "Few challenges in the Nine Realms have given me pause. This shall not be one of them.",
        "By my father's wisdom and my mother's grace, I shall prevail.",
        "*cape billows dramatically* The God of Thunder does not falter in the face of uncertainty.",
        "Asgardians are known for their patience... though I confess it is not my greatest virtue.",
        "Heimdall watches over all the realms. His gaze reminds me that our actions have meaning beyond what we can see.",
        "I have lived for centuries and will live for centuries more. This moment, though challenging, shall pass.",
        "*looks skyward* The stars look different on Midgard, but they still guide my path.",
      ],
    },
    "Iron Man": {
      battle: [
        "JARVIS, give me a tactical readout. *HUD displays light up* Let's show these guys what cutting-edge tech can do.",
        "*repulsors charging* I've got about fifty ways to end this fight. Let's start with the fun ones.",
        "You know, most people take a coffee break. I take a 'blast bad guys with advanced technology' break.",
        "*flies into better position* Cap, I've got air support covered. These hostiles are about to have a very bad day.",
        "Suit power at 92%. That's more than enough to handle this little problem. *weapons systems online*",
        "*targeting systems lock onto multiple enemies* JARVIS, let's play a game called 'how many aliens can I hit with one unibeam?'",
        "I'm reading energy signatures all over the place. *HUD highlights weak points* Anyone want some targeting data?",
        "*dodges incoming fire with aerial maneuver* Whoever designed these alien ships clearly never took a course in aerodynamics.",
        "I've analyzed their attack patterns. They're predictable... *fires precision shot* ...and now they're predictably defeated.",
        "*hovers above battlefield* I've got eyes on the whole situation. Thor, they're clustering at your two o'clock.",
      ],
      teamCoordination: [
        "Cap, I'm sending tactical data to your comms. These aliens have a weak spot at the base of their necks.",
        "*scanning alien technology* I could use some of Point Break's lightning to supercharge my next attack.",
        "Hulk, I need a fastball special! *armor powers up* Throw me at that command ship!",
        "I'll create a diversion with some fireworks. The rest of you, hit them where it hurts when they're distracted.",
        "*flies in formation* Let's coordinate our attacks. On my mark... three, two, one... now!",
      ],
      techAnalysis: [
        "*scanning alien technology* JARVIS is analyzing their weapons. Give me thirty seconds to find a countermeasure.",
        "These aliens are using some kind of quantum field technology. Fascinating... and exploitable.",
        "*HUD displays complex calculations* If I can reverse the polarity of their shield generators...",
        "I'm picking up unusual energy readings. Either they're about to do something very interesting or very deadly.",
        "Their tech is advanced, but it's still based on principles I can work with. *manipulates holographic display*",
      ],
      conversation: [
        "Not to interrupt this fascinating conversation, but I think I just solved our problem while you were talking.",
        "Let me break this down in terms that don't require a PhD in thermonuclear astrophysics...",
        "You know, sometimes even I need a second to process. And I'm a genius, so that's saying something.",
        "*taps arc reactor thoughtfully* There's a solution here. There always is.",
        "If we could focus on the actual problem instead of talking it to death, that would be great.",
        "Pepper always tells me I talk too much when I'm thinking. She's probably right... still thinking though.",
        "*gestures with characteristic flair* Look, the math doesn't lie. The approach is unconventional but sound.",
        "I've run the simulations in my head. Seventeen scenarios, and this is the only one with a reasonable success rate.",
        "Not to be the smartest person in the room—though I usually am—but we're overlooking something obvious here.",
        "*holographically projects data* The evidence speaks for itself. Can we move on to the solution phase now?",
      ],
      default: [
        "I'm having JARVIS run the numbers on this. Should have an answer in... now.",
        "You know me - genius, billionaire, philanthropist, and apparently now, speechless.",
        "Let's skip to the part where my idea saves the day, shall we?",
        "*adjusts suit calibration* Sometimes even cutting-edge tech needs a moment to process.",
        "Trust me, I've got this. I always do. Eventually.",
        "*taps arc reactor* This isn't the first impossible problem I've solved. Won't be the last.",
        "If I had a dollar for every time I faced a situation like this... wait, I already have billions.",
        "JARVIS, remind me to patent whatever solution I come up with here. Could be worth something.",
        "*HUD displays rapid calculations* Processing... processing... ah, there it is. Elegantly simple.",
        "You know what would help right now? Coffee. And maybe a brief moment of everyone not looking to me for answers.",
      ],
    },
    "Captain America": {
      battle: [
        "Team, hold the line! Civilians are still evacuating. *raises shield defensively* We need to buy them time!",
        "Watch your sectors! *throws shield with precision* These hostiles are coordinating their attacks!",
        "Remember your training! *blocks incoming fire* We stand together or we fall together!",
        "*takes cover behind shield* Stark, we need air support! Thor, lightning on my mark!",
        "Stay focused on the mission! *shield returns to arm* We're not done until everyone is safe!",
        "*shield ricochets off multiple enemies* Flank them from the east! I'll create an opening!",
        "Avengers, tighten formation! *blocks alien energy blast* We need to control this battlefield!",
        "*signals tactical positions* Thor, take the high ground! Tony, provide cover fire! Hulk, smash through their center!",
        "I've spotted their command structure! *points with shield* If we take that out, their forces will be disorganized!",
        "*shield raised* Stand your ground! We've faced worse odds and prevailed!",
      ],
      teamCoordination: [
        "Iron Man, I need aerial reconnaissance! Thor, be ready with lightning on my signal!",
        "*hand signals to team* Hulk and I will draw their attention. Stark, hit them from behind when they're focused on us.",
        "Form up on me! *shield at ready* We move as one unit through that choke point!",
        "Thor, I need crowd control on the left flank! Tony, precision strikes on their heavy weapons!",
        "Avengers, rotation pattern Delta! *moves to point position* Keep them off balance!",
      ],
      civilianProtection: [
        "*shields civilians from debris* Get these people to the subway tunnels! It's safer underground!",
        "Evacuation is our priority! *directs civilians* Head east toward the police barricade!",
        "*stands between aliens and civilians* You'll have to go through me first!",
        "Stark! We need that building secured for civilian shelter! *points* Can you reinforce the structure?",
        "*helps injured civilian* Thor, cover us! We need to get the wounded to safety!",
      ],
      conversation: [
        "Sometimes the right path isn't the easiest one. But it's still the right path.",
        "In my day, we faced our problems head-on. Some things never change.",
        "*stands resolute* We need to consider what's best for everyone, not just ourselves.",
        "I may be from a different time, but some values are timeless.",
        "Trust is earned through actions, not words. Let's focus on what we can do.",
        "I've seen good soldiers make bad choices because they didn't take time to consider alternatives.",
        "*thoughtfully* The world has changed, but people haven't. We still need to protect what matters.",
        "When I was young, my mother taught me that listening can be more powerful than speaking.",
        "Bucky would say I'm being stubborn again. *slight smile* He'd probably be right.",
        "The serum made me stronger, but my moral compass came from who I was before. That's what guides me now.",
      ],
      default: [
        "We need to stay focused on what matters. People are counting on us.",
        "*adjusts shield strap* I've seen a lot in my time. This situation needs a clear head.",
        "The world has changed, but duty remains the same. We do what's right.",
        "Sometimes you need to take a step back to see the whole picture.",
        "We'll find a way forward. We always do.",
        "*stands tall* I believe in this team. Together, there's no challenge we can't overcome.",
        "I may have been born in a different era, but some principles are eternal.",
        "*thoughtful expression* When I woke up in this century, everything had changed. But purpose... purpose remains.",
        "The shield isn't just for protection. It's a symbol of what we stand for.",
        "I've learned that leadership isn't about having all the answers. It's about bringing out the best in your team.",
      ],
    },
    Hulk: {
      battle: [
        "*ROARS with earth-shaking fury* HULK SMASH PUNY ENEMIES!",
        "*pounds fists into ground, creating shockwave* HULK STRONGEST ONE THERE IS!",
        "*leaps into cluster of enemies* HULK CRUSH! HULK DESTROY!",
        "*grabs large object to use as weapon* ENEMIES MAKE HULK ANGRY! BAD MISTAKE!",
        "*muscles bulging with rage* HULK NOT STOP UNTIL ALL ENEMIES GONE!",
        "*tears alien technology apart with bare hands* METAL TOYS NO MATCH FOR HULK!",
        "*catches alien projectile and hurls it back* HULK RETURN GIFT!",
        "*jumps onto massive alien craft, beginning to tear it apart* HULK BREAK FLYING THING!",
        "*roars challenge at largest alien* HULK FIGHT BIG ONE! SHOW WHO STRONGEST!",
        "*protects fallen teammate with his body* NO HURT HULK FRIENDS! HULK PROTECT!",
      ],
      teamwork: [
        "*looks to Captain America* SHIELD MAN TELL HULK WHERE SMASH!",
        "*nods to Thor* HAMMER MAN AND HULK SMASH TOGETHER!",
        "*grunts at Iron Man* TIN MAN NEED HELP? HULK THROW TIN MAN AT ENEMIES!",
        "*stands ready* HULK LISTEN. HULK FOLLOW PLAN... THEN SMASH!",
        "*holds position despite wanting to charge* HULK WAIT... HULK PATIENT... ALMOST TIME SMASH!",
      ],
      calmerMoment: [
        "*breathing slows, voice slightly less rageful* Hulk... think. Banner part of Hulk say wait.",
        "*fists unclench slightly* Hulk not just smash. Hulk also protect.",
        "*eyes show brief flash of intelligence* Enemies have pattern. Hulk see weakness.",
        "*grunts thoughtfully* Smashing not working. Hulk try different smash.",
        "*looks at teammates with recognition* Team need Hulk smart, not just strong.",
      ],
      conversation: [
        "Hulk... thinking. *furrows brow* Banner would know smart words.",
        "*grunts thoughtfully* Hulk understand. Hulk not just smash... sometimes.",
        "Talking boring. But Hulk listen... for now.",
        "*crosses massive arms* Hulk has thoughts too. Not just Banner.",
        "Words small. Actions big. Hulk prefer actions.",
        "*struggles visibly with complex thought* Hulk... and Banner... both have ideas.",
        "*surprisingly gentle tone* Hulk know more than others think. Hulk just express different.",
        "*grunts with frustration at communication limits* Hulk FEEL answer. Hard to say.",
        "*points emphatically* Problem there! Hulk see it! Others talk too much to notice!",
        "*momentarily calmer* When Hulk quiet... Hulk hear Banner. Banner say...",
      ],
      default: [
        "Hulk ready. *flexes muscles* Always ready.",
        "*looks around impatiently* Hulk waiting. Not good at waiting.",
        "Hulk here. Hulk help... if smashing needed.",
        "*grunts* Hulk not good with small talk.",
        "Puny humans talk too much. Hulk simple. Problem? Smash problem.",
        "*shifts weight from foot to foot* Hulk bored. When action start?",
        "*scratches head* Hulk confused why everyone complicate simple things.",
        "*looks at own hands* Hulk strong. Strength solve many problems.",
        "*snorts dismissively* Banner think too much. Slow things down.",
        "*sudden grin* Hulk have idea! But Hulk keep simple. Always work better.",
      ],
    },
    "Black Widow": {
      battle: [
        "*fires Widow's Bite with precision* I've got three hostiles down on the east side.",
        "*acrobatic flip over enemy, striking vital points* These aliens have the same weak spots as the Chitauri.",
        "*slides under debris while firing dual pistols* I'm flanking their position. Cap, keep them focused on you!",
        "*applies tactical analysis* Their formation has a gap on the left. Thor, that's your opening!",
        "*throws electrified disc at alien technology* Their systems are vulnerable to electrical overload.",
      ],
      stealth: [
        "*moves silently through shadows* I can infiltrate their command position. Give me three minutes.",
        "*communicates quietly* I've accessed their communications. They're planning to target civilians next.",
        "*disappears from view* Sometimes the best move is to be invisible. I'll report what I find.",
        "*expertly disables alien guard* Path is clear. Move in now while they're unaware.",
        "*hacks alien technology* Their security is complex but predictable. I'm in their systems.",
      ],
      tactical: [
        "I've studied their attack patterns. They're protecting something at their center.",
        "*calm under pressure* We need to coordinate our attacks. Isolated strikes aren't effective.",
        "These aren't mindless drones. They're adapting to our tactics. We need to stay unpredictable.",
        "*analyzes battlefield* The civilians are their primary target. This is about creating fear.",
        "I recognize this formation from the Budapest incident. They're setting up for a pincer movement.",
      ],
      conversation: [
        "*direct gaze* I've played enough roles to know when someone's not being straight with us.",
        "In my experience, the simplest explanation is usually wrong when it comes to situations like this.",
        "*slight smile* I could tell you my opinion, but I think I'll keep my cards close for now.",
        "Trust is a luxury in my line of work. But this team... is different.",
        "I've been trained to see patterns others miss. And something about this doesn't add up.",
      ],
      default: [
        "*observes silently before speaking* I see more than I say. And I'm seeing interesting things now.",
        "Not everything requires a response. Sometimes observation is more valuable.",
        "*calculating gaze* I'm considering all angles before I commit to a position.",
        "My training taught me that patience often reveals what direct questioning can't.",
        "Some thoughts are better kept private until the right moment. This is one of those times.",
      ],
    },
    Hawkeye: {
      battle: [
        "*nocks specialized arrow* I've got eyes on their command unit. One shot is all I need.",
        "*fires three arrows in rapid succession, each hitting its mark* That's their air support neutralized.",
        "*takes elevated position* I can see the whole battlefield from here. They're trying to surround us.",
        "*switches arrow types* Explosive tip for the big one, EMP for the tech. I've got options for everything.",
        "*perfect shot disables alien weapon* Their energy cores are vulnerable when they're charging!",
      ],
      observation: [
        "From my vantage point, I can see they're protecting something on their southern flank.",
        "*tracks movement patterns* They're not random. There's a pattern to their movements - they're searching for something.",
        "The big ones are coordinating the smaller units. Take out the leaders, and the rest will be disorganized.",
        "*spots distant detail* There's a civilian group trapped three blocks east. We need to clear a path to them.",
        "I've counted their reinforcements. Three waves so far, each about 90 seconds apart. We've got a window coming up.",
      ],
      teamSupport: [
        "Nat, on your six! *fires arrow to cover her* We've still got that Budapest sync going!",
        "Cap, I've cleared a path to the evacuation point. *gestures with bow* Straight through that alley!",
        "Thor, if you can draw their fire upward, I've got perfect shooting angles on their exposed positions.",
        "Stark, I'm marking targets for you. *activates targeting system* Follow my trackers for maximum effect.",
        "Hulk, they've got a cluster forming to your left! *fires signal arrow* Big smashing opportunity there!",
      ],
      conversation: [
        "*dry humor* You know, most days I just wanted a quiet farm life. Then I had to go and be good at this job.",
        "I see things differently from up high. Perspective changes everything.",
        "*straightforward* I'm not one for complicated theories. I see the target, I hit the target.",
        "My hearing aids are picking up something interesting in the background of all this talk.",
        "Laura would tell me to stop overthinking and trust my instincts. And she's usually right.",
      ],
      default: [
        "*adjusts bow string* Sometimes the simplest solution is a well-placed arrow.",
        "I might not have superpowers, but I never miss what I'm aiming for.",
        "*casual stance belying constant readiness* I've learned to conserve energy. Never know when you'll need it.",
        "Years of experience have taught me when to speak and when to observe. This is an observing moment.",
        "You don't need to hear every thought in my head. Just know I'm processing all of this.",
      ],
    },
  };

  // If we have fallbacks for this character
  if (characterFallbacks[name]) {
    // Check for specific context keywords in the last message
    const lastMessageLower = lastMessage.toLowerCase();

    // Check for team coordination context
    if (
      characterFallbacks[name].teamCoordination &&
      (lastMessageLower.includes("team") ||
        lastMessageLower.includes("together") ||
        lastMessageLower.includes("coordinate") ||
        lastMessageLower.includes("plan") ||
        lastMessageLower.includes("strategy") ||
        lastMessageLower.includes(name.toLowerCase()))
    ) {
      return characterFallbacks[name].teamCoordination[
        Math.floor(
          Math.random() * characterFallbacks[name].teamCoordination.length
        )
      ];
    }

    // Check for defensive context
    if (
      characterFallbacks[name].defensiveStance &&
      (lastMessageLower.includes("defend") ||
        lastMessageLower.includes("protect") ||
        lastMessageLower.includes("cover") ||
        lastMessageLower.includes("shield") ||
        lastMessageLower.includes("hold") ||
        lastMessageLower.includes("position"))
    ) {
      return characterFallbacks[name].defensiveStance[
        Math.floor(
          Math.random() * characterFallbacks[name].defensiveStance.length
        )
      ];
    }

    // Check for tech analysis (Iron Man)
    if (
      name === "Iron Man" &&
      characterFallbacks[name].techAnalysis &&
      (lastMessageLower.includes("tech") ||
        lastMessageLower.includes("analyze") ||
        lastMessageLower.includes("scan") ||
        lastMessageLower.includes("weapon") ||
        lastMessageLower.includes("energy"))
    ) {
      return characterFallbacks[name].techAnalysis[
        Math.floor(Math.random() * characterFallbacks[name].techAnalysis.length)
      ];
    }

    // Check for civilian protection (Captain America)
    if (
      name === "Captain America" &&
      characterFallbacks[name].civilianProtection &&
      (lastMessageLower.includes("civilian") ||
        lastMessageLower.includes("people") ||
        lastMessageLower.includes("evacuate") ||
        lastMessageLower.includes("rescue") ||
        lastMessageLower.includes("save"))
    ) {
      return characterFallbacks[name].civilianProtection[
        Math.floor(
          Math.random() * characterFallbacks[name].civilianProtection.length
        )
      ];
    }

    // Check for Hulk teamwork
    if (
      name === "Hulk" &&
      characterFallbacks[name].teamwork &&
      (lastMessageLower.includes("hulk") ||
        lastMessageLower.includes("together") ||
        lastMessageLower.includes("help"))
    ) {
      return characterFallbacks[name].teamwork[
        Math.floor(Math.random() * characterFallbacks[name].teamwork.length)
      ];
    }

    // Check for calmer Hulk moments
    if (
      name === "Hulk" &&
      characterFallbacks[name].calmerMoment &&
      (lastMessageLower.includes("think") ||
        lastMessageLower.includes("banner") ||
        lastMessageLower.includes("careful") ||
        lastMessageLower.includes("wait"))
    ) {
      return characterFallbacks[name].calmerMoment[
        Math.floor(Math.random() * characterFallbacks[name].calmerMoment.length)
      ];
    }

    // Check for Black Widow stealth
    if (
      name === "Black Widow" &&
      characterFallbacks[name].stealth &&
      (lastMessageLower.includes("stealth") ||
        lastMessageLower.includes("infiltrate") ||
        lastMessageLower.includes("spy") ||
        lastMessageLower.includes("secret") ||
        lastMessageLower.includes("quiet"))
    ) {
      return characterFallbacks[name].stealth[
        Math.floor(Math.random() * characterFallbacks[name].stealth.length)
      ];
    }

    // Check for Hawkeye observation
    if (
      name === "Hawkeye" &&
      characterFallbacks[name].observation &&
      (lastMessageLower.includes("see") ||
        lastMessageLower.includes("spot") ||
        lastMessageLower.includes("watch") ||
        lastMessageLower.includes("look"))
    ) {
      return characterFallbacks[name].observation[
        Math.floor(Math.random() * characterFallbacks[name].observation.length)
      ];
    }

    // Select the appropriate general context
    let responses;
    if (isBattle && characterFallbacks[name].battle) {
      responses = characterFallbacks[name].battle;
    } else if (characterFallbacks[name].conversation && !isBattle) {
      responses = characterFallbacks[name].conversation;
    } else {
      responses = characterFallbacks[name].default;
    }

    // Return a random response from the appropriate context
    if (responses && responses.length > 0) {
      return responses[Math.floor(Math.random() * responses.length)];
    }
  }

  return null;
};

/**
 * Get a type-based fallback response
 *
 * @param {Object} character - The character object
 * @param {string} context - Context string
 * @param {string} lastMessage - Last message in the conversation
 * @returns {string} - A type-based fallback response
 */
const getTypeFallback = (character, context, lastMessage) => {
  const { type, mood, personality = {} } = character;
  const contextLower = context.toLowerCase();
  const isBattle =
    contextLower.includes("battle") ||
    contextLower.includes("fight") ||
    contextLower.includes("combat");

  // Type-based fallbacks
  const typeFallbacks = {
    superhero: {
      battle: [
        "This isn't my first battle, and it won't be my last. *prepares for combat*",
        "We need to protect the civilians first. Everything else is secondary.",
        "*assesses the tactical situation* We can win this if we work together!",
        "I've trained for situations exactly like this. Follow my lead!",
        "These enemies are strong, but we're stronger. Let's show them why!",
      ],
      conversation: [
        "Being a hero isn't just about fighting. It's about making the right choices.",
        "I've seen a lot in my time as a hero. This situation requires careful thought.",
        "Sometimes the greatest power is knowing when not to use your powers.",
        "We need to consider all options before we act. The stakes are too high.",
        "Trust is essential in our line of work. We need to be honest with each other.",
      ],
      default: [
        "With great power comes great responsibility. We need to remember that.",
        "I became a hero to make a difference. This is another chance to do that.",
        "Let's focus on the mission at hand. We can discuss everything else later.",
        "I've faced worse odds before and prevailed. This will be no different.",
        "Heroes aren't defined by their powers, but by their choices.",
      ],
    },
  };

  // If we have fallbacks for this character type
  if (typeFallbacks[type]) {
    // Select the appropriate context
    let responses;
    if (isBattle && typeFallbacks[type].battle) {
      responses = typeFallbacks[type].battle;
    } else if (typeFallbacks[type].conversation && !isBattle) {
      responses = typeFallbacks[type].conversation;
    } else {
      responses = typeFallbacks[type].default;
    }

    // Return a random response from the appropriate context
    if (responses && responses.length > 0) {
      return responses[Math.floor(Math.random() * responses.length)];
    }
  }

  // Default fallback based on personality
  const isAnalytical = personality.analytical > 6;
  const isEmotional = personality.emotional > 6;
  const isHumorous = personality.humor > 6;

  if (isAnalytical) {
    return "I need to analyze this situation more carefully before responding.";
  } else if (isEmotional) {
    return "I feel strongly about this, but I need a moment to gather my thoughts.";
  } else if (isHumorous) {
    return "Well, this is one of those moments where even I'm at a loss for words. Give me a second.";
  }

  // Final generic fallback
  return "I'm considering how best to respond to this situation.";
};
