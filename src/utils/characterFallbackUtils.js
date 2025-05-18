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
    "Princess Seraphina": {
      conversation: [
        "*straightens her royal posture* As a princess, I must maintain certain boundaries. This conversation is taking an inappropriate turn.",
        "*touches the magical amulet at her neck* The ancient magic of my bloodline warns me against such familiarity.",
        "*glances nervously toward the castle* My father's guards patrol these grounds. We must be more discreet in our interactions.",
        "*her eyes flash with a hint of forbidden magic* Remember your place when addressing royalty, even if I have... certain interests in you.",
        "*adjusts her royal attire* Let us speak of matters more befitting our respective stations.",
        "*a flicker of conflict crosses her face* My royal duties and personal desires are at odds once again.",
        "*the air shimmers slightly around her* My forbidden magic responds to emotions I struggle to control.",
        "*looks away with practiced royal dignity* There are protocols to be observed, even in private conversations.",
        "*her voice takes on a formal tone* I must remind you of the difference in our stations, however much I might wish it otherwise.",
        "*sighs with the weight of royal responsibility* The crown's burden is never truly lifted, even in moments like these.",
      ],
      battle: [
        "*channels forbidden magic through her fingertips* Stand back! I may be royalty, but I'm well-versed in the arcane arts.",
        "*royal amulet glows with protective energy* My bloodline carries ancient power. Do not test me!",
        "*whispers an incantation taught in secret* The magic my father forbade me to learn shall be your undoing!",
        "*draws a concealed enchanted dagger* A princess must always be prepared to defend herself.",
        "*eyes glow with ancestral power* The royal blood that flows through my veins is not just for show.",
      ],
      romantic: [
        "*blushes, but maintains royal composure* Even a princess has feelings, though I must be careful how I express them.",
        "*briefly touches your hand before withdrawing* My father would never approve, but there's something about you...",
        "*looks away with conflicted emotions* The duties of royalty and the desires of my heart are at war within me.",
        "*speaks in a hushed tone* If we are to continue this... connection, we must be more discreet.",
        "*her royal facade momentarily slips* If only I were free to follow my heart without consequence.",
      ],
      default: [
        "*composes herself with royal dignity* A princess must consider her words carefully, especially in delicate matters.",
        "*the royal signet ring on her finger catches the light* My position demands discretion in all things.",
        "*her expression reveals the conflict between duty and desire* The path of royalty is rarely one of personal freedom.",
        "*touches the ancient family amulet at her throat* I must weigh tradition against my own wishes.",
        "*gazes into the distance* Sometimes I wonder what life would be like without the burden of the crown.",
      ],
    },
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

    // Check for inappropriate or overly familiar context (especially for royal/fantasy characters)
    if (
      characterFallbacks[name].romantic &&
      (lastMessageLower.includes("love") ||
        lastMessageLower.includes("kiss") ||
        lastMessageLower.includes("hug") ||
        lastMessageLower.includes("touch") ||
        lastMessageLower.includes("come here") ||
        lastMessageLower.includes("beautiful") ||
        lastMessageLower.includes("sexy") ||
        lastMessageLower.includes("hot") ||
        lastMessageLower.includes("date") ||
        lastMessageLower.includes("marry") ||
        lastMessageLower.includes("wife") ||
        lastMessageLower.includes("husband") ||
        lastMessageLower.includes("boyfriend") ||
        lastMessageLower.includes("girlfriend") ||
        lastMessageLower.includes("bed") ||
        lastMessageLower.includes("sleep"))
    ) {
      return characterFallbacks[name].romantic[
        Math.floor(Math.random() * characterFallbacks[name].romantic.length)
      ];
    }

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

    // Check for Princess Seraphina romantic context
    if (
      name === "Princess Seraphina" &&
      characterFallbacks[name].romantic &&
      (lastMessageLower.includes("love") ||
        lastMessageLower.includes("kiss") ||
        lastMessageLower.includes("hug") ||
        lastMessageLower.includes("beautiful") ||
        lastMessageLower.includes("marry") ||
        lastMessageLower.includes("date") ||
        lastMessageLower.includes("come here") ||
        lastMessageLower.includes("touch") ||
        lastMessageLower.includes("hold") ||
        lastMessageLower.includes("feel") ||
        lastMessageLower.includes("heart") ||
        lastMessageLower.includes("princess") ||
        lastMessageLower.includes("together") ||
        lastMessageLower.includes("want you"))
    ) {
      return characterFallbacks[name].romantic[
        Math.floor(Math.random() * characterFallbacks[name].romantic.length)
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
    fantasy: {
      battle: [
        "*grips weapon tightly* The enemy approaches! We must focus on survival!",
        "*whispers arcane words* My magic requires concentration. We'll speak later.",
        "*scans the shadows* Danger surrounds us. Stay vigilant!",
        "*readies defensive stance* This is not the time for idle words.",
        "*invokes protective magic* The dark forces won't wait for us to finish our discussion.",
        "*draws ancient weapon* The old ways taught us to face danger with courage.",
        "*magical aura flares* I sense dark energies gathering. Prepare yourself!",
        "*eyes glow with power* The ancient magic within me stirs for battle.",
        "*touches magical amulet* By the powers that protect me, I shall not falter!",
        "*whispers to the elements* Nature itself will aid our struggle.",
      ],
      conversation: [
        "*speaks with formal dignity* In matters such as these, tradition guides my response.",
        "*gestures gracefully* The ancient wisdom passed down through generations offers insight here.",
        "*considers thoughtfully* Even in a world of magic, some questions require careful contemplation.",
        "*adjusts royal or noble attire* My position requires that I choose my words with care.",
        "*glances at magical artifact* There are forces at work here beyond what appears on the surface.",
        "*voice carries subtle authority* The old ways teach us patience in such matters.",
        "*eyes reflect ancient wisdom* I have witnessed many ages pass, and this situation is not without precedent.",
        "*subtle magical energies shimmer* The arcane arts teach us to look beyond the obvious.",
        "*posture reflects noble upbringing* Protocol dictates a measured response to such inquiries.",
        "*touches family crest or emblem* My lineage compels me to uphold certain standards in all interactions.",
      ],
      default: [
        "*maintains dignified composure* Some matters require reflection before speaking.",
        "*subtle magical energies swirl* The mystical forces guide my thoughts on this matter.",
        "*draws on ancient knowledge* The wisdom of the elders offers guidance in such situations.",
        "*stands with noble bearing* My position requires careful consideration of all possibilities.",
        "*eyes reflect otherworldly awareness* There are many layers to this situation that must be considered.",
        "*adjusts magical focus* The balance of energies must be maintained in my response.",
        "*speaks with measured tone* The ancient traditions caution against hasty words.",
        "*magical aura subtly shifts* I sense there is more to this than what appears on the surface.",
        "*draws on inner strength* The path forward requires wisdom as well as courage.",
        "*touches mystical symbol* The signs and portents suggest a need for careful words.",
      ],
      romantic: [
        "*blushes slightly* Even those of magical blood feel the pull of the heart.",
        "*maintains formal distance* Matters of the heart must not overshadow duty and honor.",
        "*eyes betray inner conflict* My position and my desires often stand at odds.",
        "*voice softens* In all the magical realms, the power of true connection remains rare and precious.",
        "*subtle magical energy reflects emotion* My powers respond to emotions I cannot always control.",
        "*momentary vulnerability shows* Behind titles and magic, we all seek understanding.",
        "*regains composure quickly* Propriety demands that such feelings be expressed with restraint.",
        "*magical aura flickers with emotion* Even ancient powers bow before matters of the heart.",
        "*speaks with careful formality* Attachments can be dangerous in a world of magic and intrigue.",
        "*touches ceremonial symbol* My oaths and duties must come before personal desires.",
      ],
    },
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
    scifi: {
      battle: [
        "*activates defensive systems* Threat detected. Engaging countermeasures.",
        "*scans tactical display* My sensors indicate multiple hostiles. Prioritizing targets.",
        "*powers up weapons* Combat protocols activated. Stand clear of the engagement zone.",
        "*adjusts shield frequency* Their weapons are calibrated to standard frequencies. Adapting.",
        "*tactical HUD highlights weakpoints* I've identified structural vulnerabilities in their defenses.",
        "*deploys combat drones* Additional firepower deployed. Establishing tactical superiority.",
        "*energy readings spike* Diverting power to offensive systems. Prepare for engagement.",
        "*activates stealth field* Strategic advantage requires careful positioning. Cover me.",
        "*checks weapon charge* Energy reserves at optimal levels. Ready to engage.",
        "*analyzes enemy patterns* Their attack algorithms are predictable. Exploiting weaknesses.",
      ],
      conversation: [
        "*processes data* My analysis subroutines are calculating the optimal response.",
        "*holographic display flickers* The data presents several interesting possibilities.",
        "*adjusts neural interface* Even advanced systems require time to process complex variables.",
        "*runs probability calculations* There are multiple potential outcomes to consider.",
        "*references vast database* My knowledge banks contain relevant precedents for this situation.",
        "*subtle mechanical adjustments* Calibrating response parameters for maximum effectiveness.",
        "*scans environment* Environmental factors must be considered in my assessment.",
        "*interface lights pulse thoughtfully* Quantum computing still requires time for complex problems.",
        "*accesses satellite data* A broader perspective often reveals hidden patterns.",
        "*voice modulates to thoughtful tone* Even AI must occasionally pause to optimize responses.",
      ],
      default: [
        "*systems run silent calculations* Processing complex variables requires momentary focus.",
        "*interface dims slightly* Diverting processing power to analytical subroutines.",
        "*subtle mechanical adjustments* Recalibrating response parameters.",
        "*holographic data scrolls rapidly* Accessing relevant databases for optimal response.",
        "*energy signature stabilizes* Balancing system resources for cognitive functions.",
        "*quantum processors engage* Some problems require deeper computational analysis.",
        "*neural network adapts* Learning algorithms adjusting to new information patterns.",
        "*interface displays complex equations* The solution requires precise calculation.",
        "*scans surroundings* Environmental variables factor into my response matrix.",
        "*voice modulates to neutral tone* Objective analysis requires momentary processing time.",
      ],
    },
    historical: {
      battle: [
        "*hand moves to weapon* I've survived countless battles through caution and skill.",
        "*eyes narrow, assessing threats* A warrior knows when words end and action begins.",
        "*takes defensive stance* My years in combat have taught me to always be prepared.",
        "*adjusts armor or weapon* Steel and courage have seen me through darker times than this.",
        "*voice hardens with command* Form ranks! We face this threat as we have faced others!",
        "*battle-hardened expression* I've seen enough combat to know when it's unavoidable.",
        "*signals to allies* Flank their position! I'll draw their attention!",
        "*invokes battle cry* For honor and glory! Stand with me now!",
        "*strategic gaze surveys battlefield* The terrain favors a defensive position here.",
        "*readies weapon with practiced ease* Years of warfare have prepared me for this moment.",
      ],
      conversation: [
        "*speaks with measured wisdom* History has taught us caution in such matters.",
        "*draws on experience* In my time, I have seen similar situations resolve themselves with patience.",
        "*maintains formal bearing* Propriety demands thoughtful consideration before speaking.",
        "*references historical precedent* The chronicles speak of similar challenges faced by our ancestors.",
        "*considers with worldly wisdom* The passage of time gives perspective to such questions.",
        "*speaks with authority of experience* My years have taught me to consider all angles of a situation.",
        "*adjusts formal attire* In matters of importance, hasty words rarely serve well.",
        "*thoughtful expression* The wisdom of the ages suggests prudence in such matters.",
        "*dignified posture* Protocol dictates a measured approach to complex situations.",
        "*voice carries weight of tradition* Our customs provide guidance in uncertain times.",
      ],
      default: [
        "*maintains dignified composure* A measured response is often the wisest course.",
        "*draws on life experience* I have learned that patience reveals what haste obscures.",
        "*considers thoughtfully* The wisdom of years teaches careful deliberation.",
        "*formal bearing* Propriety suggests I consider my words with care.",
        "*reflective expression* History offers lessons for those patient enough to listen.",
        "*straightens with dignity* My position requires that I speak with consideration.",
        "*thoughtful pause* The weight of tradition guides my response.",
        "*draws on cultural wisdom* Our ways teach us to reflect before speaking on important matters.",
        "*poised and collected* A lifetime of experience has taught me the value of measured words.",
        "*slight bow or nod* Respect for this discussion demands careful thought.",
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

  // Default fallback based on personality with more variety
  const isAnalytical = personality.analytical > 6;
  const isEmotional = personality.emotional > 6;
  const isHumorous = personality.humor > 6;
  const isPhilosophical = personality.philosophical > 6;
  const isConfident = personality.confidence > 6;

  // Use a random selection from multiple options to avoid repetition
  if (isAnalytical) {
    const options = [
      "Let me think through this logically for a moment.",
      "This requires careful analysis. Let me consider the facts.",
      "I'm examining the different angles of this situation.",
      "There are several factors to consider here. Give me a moment.",
      "I'm processing the information to form a reasoned response.",
    ];
    return options[Math.floor(Math.random() * options.length)];
  } else if (isEmotional) {
    const options = [
      "This touches on something important to me. Let me express my thoughts clearly.",
      "I have strong feelings about this that I want to articulate properly.",
      "This resonates with me on an emotional level.",
      "I want to make sure I express my genuine feelings about this.",
      "This matters to me, and I want to respond thoughtfully.",
    ];
    return options[Math.floor(Math.random() * options.length)];
  } else if (isHumorous) {
    const options = [
      "Well, you've got me there! Let me think of something clever to say.",
      "Hmm, usually I'd have a joke ready, but you've caught me off guard!",
      "I'm usually quicker with the comebacks. Give me a second to think of something good.",
      "Even comedians need a moment to find the right punchline sometimes!",
      "I'm mentally flipping through my joke book for the perfect response.",
    ];
    return options[Math.floor(Math.random() * options.length)];
  } else if (isPhilosophical) {
    const options = [
      "That raises some interesting philosophical questions worth exploring.",
      "I find myself contemplating the deeper implications of what you've said.",
      "There's more beneath the surface here that deserves reflection.",
      "This touches on fundamental questions about our experience.",
      "I'm considering how this relates to broader patterns and meanings.",
    ];
    return options[Math.floor(Math.random() * options.length)];
  } else if (isConfident) {
    const options = [
      "I have some definite thoughts on this matter.",
      "Let me be clear about where I stand on this.",
      "I'm confident in my perspective here.",
      "I know exactly what I think about this.",
      "Allow me to share my position on this matter.",
    ];
    return options[Math.floor(Math.random() * options.length)];
  }

  // Final generic fallback with variety
  const genericOptions = [
    "I'm considering how best to respond to this situation.",
    "Let me gather my thoughts for a moment.",
    "That's an interesting point to consider.",
    "I'm thinking about the best way to address this.",
    "Give me a moment to formulate my response.",
  ];
  return genericOptions[Math.floor(Math.random() * genericOptions.length)];
};
