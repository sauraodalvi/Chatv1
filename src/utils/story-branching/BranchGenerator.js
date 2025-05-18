/**
 * Branch Generator
 * 
 * Generates contextually relevant story branch options based on
 * scenario type, topics, emotional tone, and narrative phase.
 */

export class BranchGenerator {
  constructor() {
    // Initialize branch templates for different scenario types
    this.branchTemplates = {
      adventure: this.getAdventureBranchTemplates(),
      mystery: this.getMysteryBranchTemplates(),
      fantasy: this.getFantasyBranchTemplates(),
      scifi: this.getSciFiBranchTemplates(),
      horror: this.getHorrorBranchTemplates(),
      romance: this.getRomanceBranchTemplates(),
      modern: this.getModernBranchTemplates()
    };
    
    // Templates for different narrative phases
    this.phaseTemplates = {
      introduction: this.getIntroductionTemplates(),
      rising_action: this.getRisingActionTemplates(),
      conflict: this.getConflictTemplates(),
      climax: this.getClimaxTemplates(),
      resolution: this.getResolutionTemplates()
    };
    
    // Templates for different emotional tones
    this.toneTemplates = {
      tense: this.getTenseTemplates(),
      excited: this.getExcitedTemplates(),
      sad: this.getSadTemplates(),
      happy: this.getHappyTemplates(),
      angry: this.getAngryTemplates(),
      fearful: this.getFearfulTemplates(),
      neutral: this.getNeutralTemplates()
    };
  }
  
  /**
   * Generate branch options based on context
   * @param {string} scenarioType - Type of scenario (adventure, mystery, etc.)
   * @param {Array} topics - Topics extracted from recent messages
   * @param {string} emotionalTone - Current emotional tone
   * @param {string} narrativePhase - Current narrative phase
   * @param {Object} characterRelationships - Character relationship data
   * @param {Array} branchHistory - Previously generated branches
   * @returns {Array} - Array of branch options
   */
  generateBranches(
    scenarioType = 'adventure',
    topics = [],
    emotionalTone = 'neutral',
    narrativePhase = 'introduction',
    characterRelationships = {},
    branchHistory = []
  ) {
    // Get templates for this scenario type
    const scenarioTemplates = this.branchTemplates[scenarioType] || this.branchTemplates.adventure;
    
    // Get templates for this narrative phase
    const phaseTemplates = this.phaseTemplates[narrativePhase] || this.phaseTemplates.introduction;
    
    // Get templates for this emotional tone
    const toneTemplates = this.toneTemplates[emotionalTone] || this.toneTemplates.neutral;
    
    // Combine all templates
    let allTemplates = [
      ...scenarioTemplates,
      ...phaseTemplates,
      ...toneTemplates
    ];
    
    // Filter out recently used branches
    allTemplates = allTemplates.filter(template => 
      !branchHistory.some(branch => branch.includes(template))
    );
    
    // If we have topics, create topic-specific branches
    const topicBranches = this.generateTopicSpecificBranches(
      topics,
      scenarioType,
      narrativePhase,
      emotionalTone
    );
    
    // If we have character relationships, create relationship-based branches
    const relationshipBranches = this.generateRelationshipBranches(
      characterRelationships,
      scenarioType,
      narrativePhase
    );
    
    // Combine all branches
    const allBranches = [
      ...topicBranches,
      ...relationshipBranches,
      ...this.fillTemplates(allTemplates, topics)
    ];
    
    // Shuffle and select 3-4 branches
    return this.shuffleArray(allBranches)
      .slice(0, Math.floor(Math.random() * 2) + 3); // 3-4 branches
  }
  
  /**
   * Generate topic-specific branches
   * @param {Array} topics - Topics extracted from recent messages
   * @param {string} scenarioType - Type of scenario
   * @param {string} narrativePhase - Current narrative phase
   * @param {string} emotionalTone - Current emotional tone
   * @returns {Array} - Array of topic-specific branches
   */
  generateTopicSpecificBranches(topics, scenarioType, narrativePhase, emotionalTone) {
    if (!topics || topics.length === 0) return [];
    
    const branches = [];
    const relevantTopics = topics.slice(0, 3); // Use top 3 topics
    
    // Topic templates by scenario type
    const topicTemplates = {
      adventure: [
        "A local inhabitant recognizes the group and shares crucial information about {{topic}}.",
        "An unexpected obstacle related to {{topic}} blocks the path forward, requiring a creative solution.",
        "A mysterious map is discovered, showing the location of a legendary {{topic}}."
      ],
      mystery: [
        "A journal is found with entries about {{topic}}, providing new insights.",
        "Security footage reveals unexpected activity related to {{topic}}.",
        "An anonymous informant leaves a message warning about {{topic}}."
      ],
      fantasy: [
        "An enchanted object related to {{topic}} reveals its true nature.",
        "A magical transformation occurs, changing something ordinary about {{topic}} into something extraordinary.",
        "Ancient runes begin to glow, revealing secrets about {{topic}}."
      ],
      scifi: [
        "A scan reveals unusual properties about {{topic}} that weren't apparent before.",
        "A holographic projection appears, displaying information about {{topic}}.",
        "An AI analysis suggests an unexpected connection between current events and {{topic}}."
      ],
      horror: [
        "A disturbing discovery related to {{topic}} raises new fears.",
        "Whispers can be heard mentioning {{topic}} when no one is around.",
        "An old photograph is found showing something impossible involving {{topic}}."
      ],
      romance: [
        "A conversation about {{topic}} leads to a surprising revelation about shared values.",
        "A disagreement about {{topic}} tests the relationship but offers growth.",
        "A special event related to {{topic}} creates an opportunity for a meaningful moment."
      ],
      modern: [
        "Breaking news about {{topic}} interrupts the conversation.",
        "A social media post about {{topic}} goes viral, affecting everyone present.",
        "A chance encounter with someone connected to {{topic}} changes perspectives."
      ]
    };
    
    // Get templates for this scenario type
    const templates = topicTemplates[scenarioType] || topicTemplates.adventure;
    
    // Create branches for each relevant topic
    relevantTopics.forEach(topic => {
      // Select a random template
      const template = templates[Math.floor(Math.random() * templates.length)];
      
      // Replace {{topic}} with the actual topic
      const branch = template.replace('{{topic}}', topic);
      
      branches.push(branch);
    });
    
    // Add phase-specific topic branches
    if (narrativePhase === 'conflict' && emotionalTone === 'tense') {
      const conflictTopic = relevantTopics[0];
      branches.push(`A confrontation about ${conflictTopic} can no longer be avoided.`);
    } else if (narrativePhase === 'climax') {
      const climaxTopic = relevantTopics[0];
      branches.push(`The truth about ${climaxTopic} is finally revealed, changing everything.`);
    }
    
    return branches;
  }
  
  /**
   * Generate relationship-based branches
   * @param {Object} relationships - Character relationship data
   * @param {string} scenarioType - Type of scenario
   * @param {string} narrativePhase - Current narrative phase
   * @returns {Array} - Array of relationship-based branches
   */
  generateRelationshipBranches(relationships, scenarioType, narrativePhase) {
    if (!relationships || Object.keys(relationships).length === 0) return [];
    
    const branches = [];
    
    // Find relationships with significant affinity (very positive or negative)
    const significantRelationships = Object.values(relationships).filter(rel => 
      Math.abs(rel.affinity) > 5
    );
    
    if (significantRelationships.length === 0) return [];
    
    // Select a significant relationship
    const relationship = significantRelationships[
      Math.floor(Math.random() * significantRelationships.length)
    ];
    
    // Get the character names
    const [char1, char2] = relationship.characters;
    
    // Generate branches based on relationship affinity
    if (relationship.affinity > 5) {
      // Positive relationship
      branches.push(`${char1} and ${char2}'s strong bond is tested when a secret from the past emerges.`);
      
      if (scenarioType === 'adventure' || scenarioType === 'fantasy') {
        branches.push(`${char1} must make a difficult choice that could save ${char2} but at great personal cost.`);
      } else if (scenarioType === 'romance') {
        branches.push(`A moment of vulnerability between ${char1} and ${char2} deepens their connection.`);
      }
    } else if (relationship.affinity < -5) {
      // Negative relationship
      branches.push(`The tension between ${char1} and ${char2} reaches a breaking point, forcing a confrontation.`);
      
      if (narrativePhase === 'conflict' || narrativePhase === 'climax') {
        branches.push(`${char1} and ${char2} must set aside their differences to face a common threat.`);
      }
    }
    
    return branches;
  }
  
  /**
   * Fill templates with topics
   * @param {Array} templates - Branch templates
   * @param {Array} topics - Topics to insert
   * @returns {Array} - Filled templates
   */
  fillTemplates(templates, topics) {
    return templates.map(template => {
      // If template contains {{topic}} placeholder and we have topics
      if (template.includes('{{topic}}') && topics.length > 0) {
        // Select a random topic
        const topic = topics[Math.floor(Math.random() * topics.length)];
        // Replace placeholder with topic
        return template.replace('{{topic}}', topic);
      }
      return template;
    });
  }
  
  /**
   * Shuffle an array
   * @param {Array} array - Array to shuffle
   * @returns {Array} - Shuffled array
   */
  shuffleArray(array) {
    const newArray = [...array];
    for (let i = newArray.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
    }
    return newArray;
  }
  
  /**
   * Get adventure branch templates
   * @returns {Array} - Adventure branch templates
   */
  getAdventureBranchTemplates() {
    return [
      "A sudden storm forces the group to seek shelter in a mysterious structure.",
      "Tracks are discovered leading to what appears to be a hidden encampment.",
      "A wounded traveler stumbles into view, desperately seeking help.",
      "The sound of distant drums echoes through the area, growing steadily louder.",
      "A valuable item goes missing, with signs pointing to theft rather than loss.",
      "A local guide offers to show a shortcut, but something about their manner seems off.",
      "An old map is discovered with markings that correspond to the current location.",
      "Strange lights appear in the distance, moving in patterns that seem deliberate.",
      "A bridge that should provide safe passage appears damaged and unstable.",
      "Wildlife in the area begins behaving strangely, as if fleeing from something unseen."
    ];
  }
  
  /**
   * Get mystery branch templates
   * @returns {Array} - Mystery branch templates
   */
  getMysteryBranchTemplates() {
    return [
      "A previously overlooked clue is discovered, changing the understanding of the case.",
      "A witness comes forward with new information that contradicts earlier testimony.",
      "A suspect's alibi suddenly falls apart when new evidence emerges.",
      "A mysterious phone call provides cryptic information about the case.",
      "Someone attempts to destroy evidence, suggesting they have something to hide.",
      "A seemingly unrelated event is revealed to be connected to the main mystery.",
      "An expert analysis reveals something unexpected about a key piece of evidence.",
      "A person of interest suddenly changes their behavior in a suspicious way.",
      "Access is gained to a location that was previously off-limits.",
      "A pattern emerges when comparing multiple witness accounts that was missed before."
    ];
  }
  
  /**
   * Get fantasy branch templates
   * @returns {Array} - Fantasy branch templates
   */
  getFantasyBranchTemplates() {
    return [
      "A magical portal opens unexpectedly, offering passage to an unknown realm.",
      "An ancient prophecy is recalled that seems to describe the current situation.",
      "A mythical creature appears, either as a guide or a challenge to overcome.",
      "A character discovers latent magical abilities triggered by the current circumstances.",
      "A magical item changes properties, revealing new powers or purposes.",
      "The laws of magic suddenly shift in the area, causing unpredictable effects.",
      "A vision reveals glimpses of possible futures, one of which appears particularly dire.",
      "A magical curse or blessing is activated by recent actions.",
      "An ancient guardian awakens, demanding that ancient traditions be respected.",
      "The boundary between the mortal world and a magical realm grows thin."
    ];
  }
  
  /**
   * Get sci-fi branch templates
   * @returns {Array} - Sci-fi branch templates
   */
  getSciFiBranchTemplates() {
    return [
      "A system malfunction reveals hidden data that changes the mission parameters.",
      "Unusual energy readings are detected, suggesting advanced technology nearby.",
      "A distress signal is received from a location that should be uninhabited.",
      "The AI system begins making decisions that weren't part of its programming.",
      "A temporal anomaly causes disorienting effects on perception and memory.",
      "Contact is established with an entity that challenges current understanding.",
      "A piece of technology begins adapting itself in ways that weren't designed.",
      "Scans reveal that what appeared to be natural is actually artificial.",
      "A security breach exposes vulnerabilities that were thought to be impossible.",
      "A previously unknown faction reveals itself, with unclear intentions."
    ];
  }
  
  /**
   * Get horror branch templates
   * @returns {Array} - Horror branch templates
   */
  getHorrorBranchTemplates() {
    return [
      "Strange noises begin emanating from a location everyone had assumed was empty.",
      "Personal items are found arranged in a disturbing pattern with no explanation.",
      "Someone reports seeing a figure that shouldn't be possible in this location.",
      "Electronic devices begin malfunctioning in ways that create unease.",
      "A door that was definitely locked is found standing open.",
      "Inexplicable cold spots develop in specific areas, defying normal temperature patterns.",
      "Writing appears on a surface that no one has approached.",
      "A character experiences lost time, unable to account for their actions during a period.",
      "Something that was dead shows signs of life or movement.",
      "A character begins behaving in a way that suggests they are no longer themselves."
    ];
  }
  
  /**
   * Get romance branch templates
   * @returns {Array} - Romance branch templates
   */
  getRomanceBranchTemplates() {
    return [
      "A misunderstanding leads to hurt feelings that need to be addressed.",
      "An unexpected gesture reveals deeper feelings than previously expressed.",
      "A mutual friend shares insights that cast the relationship in a new light.",
      "A moment of crisis reveals true priorities and feelings.",
      "A chance encounter with someone from the past stirs up complicated emotions.",
      "An opportunity arises that would separate the characters geographically.",
      "A shared experience creates a powerful bonding moment.",
      "Cultural or family expectations create pressure on the relationship.",
      "A secret is revealed that tests trust between the characters.",
      "A moment of vulnerability allows for deeper emotional connection."
    ];
  }
  
  /**
   * Get modern branch templates
   * @returns {Array} - Modern branch templates
   */
  getModernBranchTemplates() {
    return [
      "Breaking news interrupts with information relevant to the current situation.",
      "A social media post goes viral, affecting the reputation of someone present.",
      "An unexpected job offer creates both opportunity and difficult choices.",
      "A health concern emerges that requires immediate attention.",
      "A legal issue arises that threatens plans or stability.",
      "A technological breakthrough changes the landscape of possibilities.",
      "Economic factors shift, creating new pressures or opportunities.",
      "A political development has personal implications for those involved.",
      "Environmental conditions create unexpected challenges.",
      "A community crisis requires a response from those present."
    ];
  }
  
  /**
   * Get introduction phase templates
   * @returns {Array} - Introduction phase templates
   */
  getIntroductionTemplates() {
    return [
      "Someone new arrives, bringing fresh perspective and information.",
      "A challenge is presented that will require cooperation to overcome.",
      "An invitation arrives to an event that promises to be significant.",
      "A discovery reveals that there is more to the situation than initially apparent.",
      "A minor incident hints at larger issues beneath the surface."
    ];
  }
  
  /**
   * Get rising action templates
   * @returns {Array} - Rising action templates
   */
  getRisingActionTemplates() {
    return [
      "Tensions increase as competing interests become more apparent.",
      "A deadline is imposed, creating pressure to act quickly.",
      "A small success reveals a path forward, but with greater challenges ahead.",
      "An ally reveals unexpected skills or knowledge that could be crucial.",
      "A warning is received about dangers that lie ahead."
    ];
  }
  
  /**
   * Get conflict templates
   * @returns {Array} - Conflict templates
   */
  getConflictTemplates() {
    return [
      "A confrontation can no longer be avoided, forcing difficult choices.",
      "Betrayal is revealed, casting doubt on who can be trusted.",
      "Resources become scarce, creating competition where there was cooperation.",
      "A mistake has serious consequences that must be addressed.",
      "External forces intervene, complicating an already difficult situation."
    ];
  }
  
  /**
   * Get climax templates
   * @returns {Array} - Climax templates
   */
  getClimaxTemplates() {
    return [
      "The moment of truth arrives, requiring courage and decisive action.",
      "All the pieces fall into place, revealing the full picture at last.",
      "A sacrifice becomes necessary to achieve the greater goal.",
      "The true villain is revealed, changing understanding of past events.",
      "A final test challenges the core values and abilities of those involved."
    ];
  }
  
  /**
   * Get resolution templates
   * @returns {Array} - Resolution templates
   */
  getResolutionTemplates() {
    return [
      "An opportunity for reconciliation presents itself after the conflict.",
      "The aftermath of recent events requires healing and rebuilding.",
      "Recognition or rewards are offered for actions taken.",
      "A new normal begins to establish itself, incorporating recent changes.",
      "Seeds of future challenges appear even as current ones are resolved."
    ];
  }
  
  /**
   * Get tense emotional tone templates
   * @returns {Array} - Tense templates
   */
  getTenseTemplates() {
    return [
      "The air feels electric with unspoken tension as a critical moment approaches.",
      "Time seems to slow as a decision point with significant consequences arrives.",
      "Nerves fray as pressure mounts to resolve the situation quickly.",
      "The weight of responsibility creates a palpable heaviness in the atmosphere."
    ];
  }
  
  /**
   * Get excited emotional tone templates
   * @returns {Array} - Excited templates
   */
  getExcitedTemplates() {
    return [
      "An unexpected opportunity creates a surge of hopeful energy.",
      "A breakthrough moment generates enthusiasm and renewed determination.",
      "Success seems within reach, inspiring bold and creative approaches.",
      "The thrill of discovery energizes everyone involved."
    ];
  }
  
  /**
   * Get sad emotional tone templates
   * @returns {Array} - Sad templates
   */
  getSadTemplates() {
    return [
      "A moment of reflection reveals the cost of recent events.",
      "Loss creates a space for meaningful connection through shared grief.",
      "Memories resurface, bringing both comfort and pain.",
      "What might have been contrasts sharply with current reality."
    ];
  }
  
  /**
   * Get happy emotional tone templates
   * @returns {Array} - Happy templates
   */
  getHappyTemplates() {
    return [
      "A celebration brings people together in a moment of joy.",
      "Good fortune arrives unexpectedly, lifting spirits.",
      "A perfect moment of peace offers respite from ongoing challenges.",
      "Shared laughter creates bonds that strengthen the group."
    ];
  }
  
  /**
   * Get angry emotional tone templates
   * @returns {Array} - Angry templates
   */
  getAngryTemplates() {
    return [
      "Righteous fury provides the strength needed to confront injustice.",
      "Frustration boils over, forcing issues that have been simmering to the surface.",
      "A provocation tests self-control and strategic thinking.",
      "The desire for retribution clouds judgment at a critical moment."
    ];
  }
  
  /**
   * Get fearful emotional tone templates
   * @returns {Array} - Fearful templates
   */
  getFearfulTemplates() {
    return [
      "Shadows seem to move in ways that defy explanation, raising alarm.",
      "A primal instinct warns of danger before it becomes visible.",
      "What was once familiar becomes threatening as circumstances change.",
      "The unknown looms large, feeding imagination with worst-case scenarios."
    ];
  }
  
  /**
   * Get neutral emotional tone templates
   * @returns {Array} - Neutral templates
   */
  getNeutralTemplates() {
    return [
      "A change in circumstances requires adaptation and reassessment.",
      "New information becomes available that could inform next steps.",
      "A moment of calm provides space for thoughtful consideration.",
      "Different perspectives on the situation emerge, each with merit."
    ];
  }
}
