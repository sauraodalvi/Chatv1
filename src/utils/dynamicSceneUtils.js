/**
 * Dynamic Scene Description Utilities
 * 
 * This module provides utilities for generating dynamic scene descriptions
 * that evolve with the battle or conversation, creating a more immersive
 * experience.
 */

/**
 * Generate a dynamic scene description based on location, battle intensity, and previous events
 * 
 * @param {string} location - The current location (e.g., "downtown", "times_square")
 * @param {number} battleIntensity - Battle intensity on a scale of 0-10
 * @param {Array} previousDescriptions - Previously used descriptions to avoid repetition
 * @returns {string} - A dynamic scene description
 */
export const generateSceneDescription = (location = "new_york", battleIntensity = 5, previousDescriptions = []) => {
  // Default to New York if no location specified
  const normalizedLocation = location.toLowerCase().replace(/\s+/g, '_');
  
  // Get scene elements for this location
  const sceneElements = getSceneElements(normalizedLocation);
  
  // Determine intensity level
  const intensityLevel = battleIntensity < 4 ? "lowIntensity" : 
                         battleIntensity < 7 ? "mediumIntensity" : "highIntensity";
  
  // Get possible descriptions for this intensity
  const possibleDescriptions = sceneElements[intensityLevel] || sceneElements.mediumIntensity;
  
  // Filter out recently used descriptions
  const filteredDescriptions = possibleDescriptions.filter(
    desc => !previousDescriptions.includes(desc)
  );
  
  // If all descriptions have been used, reset and use any of them
  const availableDescriptions = filteredDescriptions.length > 0 ? 
                               filteredDescriptions : possibleDescriptions;
  
  // Return a random description
  return availableDescriptions[Math.floor(Math.random() * availableDescriptions.length)];
};

/**
 * Generate sensory details for the current scene
 * 
 * @param {string} location - The current location
 * @param {string} battlePhase - The current battle phase (introduction, rising, climax, resolution)
 * @param {Object} conditions - Environmental conditions (weather, time of day, etc.)
 * @returns {Object} - Object containing sensory details (sight, sound, smell, feel)
 */
export const generateSensoryDetails = (location = "new_york", battlePhase = "rising", conditions = {}) => {
  return {
    sight: generateVisualDetail(location, battlePhase, conditions),
    sound: generateAudioDetail(location, battlePhase, conditions),
    smell: generateOlfactoryDetail(location, battlePhase, conditions),
    feel: generateTactileDetail(location, battlePhase, conditions)
  };
};

/**
 * Get scene elements for a specific location
 * 
 * @param {string} location - The location
 * @returns {Object} - Scene elements for different intensity levels
 */
const getSceneElements = (location) => {
  // Scene elements for different locations
  const sceneElements = {
    "new_york": {
      lowIntensity: [
        "Civilians rush for cover as alien ships appear overhead, their shadows racing across the streets of New York.",
        "The streets begin to clear as people flee from the approaching threat, leaving abandoned vehicles in their wake.",
        "Police barricades are hastily established as officers direct civilians away from the alien presence in the sky.",
        "Early warning sirens begin to wail across Manhattan, their haunting sound echoing between skyscrapers.",
        "Digital billboards in Times Square flicker and display emergency evacuation instructions as people look skyward in fear."
      ],
      mediumIntensity: [
        "Debris rains down as alien weapons fire impacts nearby buildings, shattering glass and concrete.",
        "Cars are overturned and small fires have broken out across several blocks as the battle intensifies.",
        "Civilians huddle in subway entrances and behind overturned buses as energy blasts scorch the streets.",
        "The air fills with dust and smoke as the first buildings take damage, reducing visibility across the battlefield.",
        "Emergency vehicles struggle to navigate the increasingly chaotic streets as the Avengers engage the alien forces."
      ],
      highIntensity: [
        "Buildings crumble under sustained alien fire, creating urban canyons of rubble and twisted metal.",
        "The air is thick with smoke and dust, visibility dropping to mere yards as fires rage unchecked.",
        "The skyline of Manhattan is transformed by destruction, with alien ships weaving between damaged skyscrapers.",
        "The ground shakes with each impact as Hulk engages the largest alien forces and Thor's lightning splits the sky.",
        "Civilians trapped in the battle zone make desperate runs for safety as the Avengers create temporary safe corridors."
      ]
    },
    "times_square": {
      lowIntensity: [
        "The normally bustling Times Square empties rapidly as civilians spot the approaching alien ships.",
        "Digital billboards continue to flash advertisements, creating a surreal backdrop to the unfolding crisis.",
        "Police officers direct evacuation efforts as the first alien scouts appear at the edges of the square.",
        "Tourists abandon their shopping bags and cameras, fleeing into nearby buildings and subway stations.",
        "The iconic screens of Times Square switch to emergency broadcasts, casting an eerie blue glow over the emptying plaza."
      ],
      mediumIntensity: [
        "The massive screens of Times Square flicker and die one by one as power systems are damaged in the battle.",
        "Alien forces take positions on rooftops surrounding the square, firing down as civilians scramble for cover.",
        "Iron Man weaves between buildings, drawing enemy fire away from evacuation routes as Captain America coordinates below.",
        "Abandoned vehicles become makeshift barricades as NYPD officers make a stand to protect fleeing civilians.",
        "The TKTS red steps become a triage area for the injured as medical personnel work under Hawkeye's protective cover."
      ],
      highIntensity: [
        "The iconic buildings of Times Square burn, their neon signs and digital screens exploding in showers of sparks.",
        "Thor summons a massive lightning strike that illuminates the square, momentarily turning night to day.",
        "Hulk uses a torn-off alien weapon as a club, clearing a path through the center of the square with devastating force.",
        "The ground is littered with alien tech and debris, creating a treacherous battlefield of sharp metal and broken concrete.",
        "Black Widow and Hawkeye coordinate precision strikes from elevated positions as Iron Man provides air support overhead."
      ]
    },
    "central_park": {
      lowIntensity: [
        "Joggers and families flee as alien scout ships appear over the tree line of Central Park.",
        "Park rangers and police officers direct evacuation efforts, pointing civilians toward the nearest exits.",
        "The contrast between the peaceful green space and approaching alien threat creates a surreal scene.",
        "Birds take flight in massive flocks as the alien engines disturb the tranquility of the park.",
        "The Great Lawn quickly empties as people abandon picnics and recreational activities at the first sign of danger."
      ],
      mediumIntensity: [
        "Trees splinter and fall as alien energy weapons cut through the park's landscape.",
        "The reflective surface of the reservoir ripples with impact shockwaves as battles rage nearby.",
        "Avengers use the varied terrain of the park to tactical advantage, with Hawkeye taking position in surviving trees.",
        "Sections of the park burn, creating a smoky haze that hangs between the remaining trees.",
        "Abandoned boats float empty on the lake as water geysers up from near-miss energy blasts."
      ],
      highIntensity: [
        "The once-green expanse of Central Park is transformed into a scarred battlefield of fallen trees and impact craters.",
        "Hulk uses uprooted trees as weapons, swinging them like baseball bats at approaching alien craft.",
        "Thor creates a defensive position near Belvedere Castle, the stone structure channeling his lightning attacks.",
        "The bridges and pathways of the park become strategic choke points in the battle against the alien forces.",
        "The park's terrain is reshaped by the battle, with new hills of debris and trenches carved by energy weapons."
      ]
    },
    "brooklyn_bridge": {
      lowIntensity: [
        "Traffic stops on the Brooklyn Bridge as drivers abandon their vehicles to flee the approaching alien ships.",
        "The iconic suspension cables of the bridge frame the alien vessels as they move into position over the East River.",
        "Police blockades form at both ends of the bridge, attempting to direct an orderly evacuation.",
        "Pedestrians on the walkway rush toward Brooklyn, looking back over their shoulders at Manhattan under threat.",
        "The first energy blasts from alien ships hit the water near the bridge, creating massive plumes of steam and spray."
      ],
      mediumIntensity: [
        "Vehicles burn on the Brooklyn Bridge as abandoned cars are hit by stray energy blasts.",
        "Captain America coordinates a defensive position at the Manhattan end of the bridge, his shield deflecting alien fire.",
        "The bridge shudders as an alien craft crashes into the water nearby, sending waves crashing against the supports.",
        "Iron Man uses the bridge's cables as slalom points, drawing enemy fire away from civilians still evacuating.",
        "The walkway partially collapses, leaving a dangerous gap that Thor helps stranded civilians to cross."
      ],
      highIntensity: [
        "Sections of the Brooklyn Bridge's roadway have collapsed, leaving gaps of twisted metal and exposed rebar.",
        "The bridge's iconic towers stand firm despite battle damage, serving as anchor points for Thor's lightning attacks.",
        "Hulk leaps from cable to cable, bringing down alien ships that fly too close to the damaged structure.",
        "The waters of the East River churn with debris and downed alien craft as the battle rages above.",
        "The Avengers make a strategic stand at the center of the bridge, using the confined space to funnel alien forces."
      ]
    }
  };
  
  // Return elements for the requested location, or default to New York
  return sceneElements[location] || sceneElements["new_york"];
};

/**
 * Generate a visual detail for the current scene
 * 
 * @param {string} location - The current location
 * @param {string} battlePhase - The current battle phase
 * @param {Object} conditions - Environmental conditions
 * @returns {string} - A visual detail description
 */
const generateVisualDetail = (location, battlePhase, conditions = {}) => {
  const visualDetails = {
    "new_york": {
      introduction: [
        "Sunlight glints off the alien ships as they descend through the clouds over Manhattan.",
        "People point skyward as the first alien vessels break through the cloud cover, their designs clearly non-terrestrial.",
        "Traffic stops as drivers exit their vehicles to stare at the approaching threat, phones raised to capture the moment.",
        "The sleek metal of the alien craft contrasts sharply with the glass and steel of New York's skyscrapers.",
        "Emergency lights begin to flash across the city as the first response protocols activate."
      ],
      rising: [
        "Energy weapons paint bright lines across the sky as aliens exchange fire with Iron Man.",
        "Dust and debris cloud the air, creating shafts of light where sunbeams break through.",
        "The Avengers form a defensive perimeter, their distinctive silhouettes recognizable through the chaos.",
        "Civilians watch from windows as Captain America's shield ricochets between alien attackers with precision.",
        "Thor's lightning illuminates the battlefield in strobing flashes, casting harsh shadows across building facades."
      ],
      climax: [
        "The sky is filled with alien ships and energy blasts, creating a chaotic light show above the damaged city.",
        "Hulk's green form is visible as he leaps between buildings, leaving impact craters where he lands.",
        "Buildings show significant damage, with exposed floors and structural elements visible through missing walls.",
        "Iron Man's repulsor blasts and Thor's lightning create a spectacular display against the darkening sky.",
        "The battle has transformed familiar streets into an alien landscape of debris, fire, and technological wreckage."
      ],
      resolution: [
        "Smoke rises from multiple locations across the city as the intensity of the battle begins to wane.",
        "The Avengers converge on the remaining alien forces, their coordinated attacks showing practiced precision.",
        "Sunlight breaks through the smoke clouds, illuminating the dust-filled air with golden rays.",
        "Emergency responders begin to move into secured areas, their vehicles' lights visible through the settling dust.",
        "The alien threat is contained, though the changed skyline of the city bears witness to the battle's intensity."
      ]
    }
  };
  
  // Get details for the requested location, or default to New York
  const locationDetails = visualDetails[location] || visualDetails["new_york"];
  
  // Get details for the requested phase, or default to rising
  const phaseDetails = locationDetails[battlePhase] || locationDetails["rising"];
  
  // Return a random detail
  return phaseDetails[Math.floor(Math.random() * phaseDetails.length)];
};

/**
 * Generate an audio detail for the current scene
 * 
 * @param {string} location - The current location
 * @param {string} battlePhase - The current battle phase
 * @param {Object} conditions - Environmental conditions
 * @returns {string} - An audio detail description
 */
const generateAudioDetail = (location, battlePhase, conditions = {}) => {
  const audioDetails = {
    "new_york": {
      introduction: [
        "Distant sirens wail as emergency services respond to the first signs of invasion.",
        "The normal bustle of city traffic is replaced by screeching tires and car horns as people flee.",
        "A low, alien hum fills the air as the invading ships approach, unlike any terrestrial aircraft.",
        "Emergency broadcast systems crackle to life, their automated warnings echoing between buildings.",
        "Confused shouts and cries of alarm rise from the streets as civilians first notice the alien presence."
      ],
      rising: [
        "The air fills with the high-pitched whine of alien weapons fire and the crash of falling debris.",
        "Explosions echo between skyscrapers, creating a disorienting cacophony of sound.",
        "Iron Man's repulsors emit their distinctive whine as he engages alien craft overhead.",
        "Captain America's shield makes a metallic ring as it connects with alien armor and returns to his grip.",
        "The Hulk's roars reverberate through the concrete canyons, instilling fear in enemies and hope in allies."
      ],
      climax: [
        "The deafening roar of collapsing buildings mixes with the thunder of Thor's lightning.",
        "Hulk's bellowing roars compete with the alien ships' engines for dominance in the soundscape.",
        "The battlefield is a symphony of destruction: energy weapons, explosions, and the Avengers' distinctive sounds.",
        "Communication devices crackle with urgent tactical exchanges between team members coordinating their attack.",
        "The alien language can be heard in harsh, electronic bursts as they attempt to coordinate against the Avengers."
      ],
      resolution: [
        "The battle sounds begin to fade, replaced by the crackle of fires and distant emergency vehicles.",
        "An eerie quiet falls over blocks that were bustling with life just hours ago.",
        "The ping of cooling metal and falling debris creates a strange percussion as the battle subsides.",
        "Relief workers call out as they search for survivors, their voices carrying in the newly quiet streets.",
        "The Avengers' communications become clearer as they coordinate the final phases of securing the area."
      ]
    }
  };
  
  // Get details for the requested location, or default to New York
  const locationDetails = audioDetails[location] || audioDetails["new_york"];
  
  // Get details for the requested phase, or default to rising
  const phaseDetails = locationDetails[battlePhase] || locationDetails["rising"];
  
  // Return a random detail
  return phaseDetails[Math.floor(Math.random() * phaseDetails.length)];
};

/**
 * Generate an olfactory (smell) detail for the current scene
 * 
 * @param {string} location - The current location
 * @param {string} battlePhase - The current battle phase
 * @param {Object} conditions - Environmental conditions
 * @returns {string} - An olfactory detail description
 */
const generateOlfactoryDetail = (location, battlePhase, conditions = {}) => {
  const olfactoryDetails = {
    "new_york": {
      introduction: [
        "The usual city smells are joined by an odd, metallic scent as alien ships enter the atmosphere.",
        "The air carries a strange ozone quality, like the atmosphere itself is responding to the alien presence.",
        "Vehicle exhaust becomes more pronounced as traffic jams form during the initial evacuation.",
        "The familiar scents of street food and urban life continue, creating a surreal normalcy before the battle.",
        "A subtle electrical smell, like overheating circuits, drifts down from the alien ships overhead."
      ],
      rising: [
        "Dust and concrete powder fill the air as the first buildings take damage, creating a choking, mineral smell.",
        "The acrid scent of electrical fires starts to dominate as vehicles and infrastructure are damaged.",
        "An alien, chemical odor emanates from damaged enemy craft, unlike anything from Earth.",
        "The smell of cordite and explosives mixes with the dust, creating a distinctive battlefield aroma.",
        "Broken gas lines add their distinctive warning scent to the complex mixture of battle smells."
      ],
      climax: [
        "The air is thick with the smell of smoke, dust, and the strange, electric scent of alien technology.",
        "Ozone from Thor's lightning gives the battlefield a sharp, clean scent that cuts through the smoke.",
        "The smell of superheated metal and concrete fills the area as buildings and alien craft alike are damaged.",
        "Fire and smoke dominate the sensory landscape, with undertones of chemicals from damaged structures.",
        "The distinctive smell of the Hudson River becomes noticeable as water mains break and flood lower areas."
      ],
      resolution: [
        "Smoke hangs in the air, but the sharp scents of active combat begin to dissipate.",
        "The smell of wet concrete and stone rises as firefighting efforts soak damaged buildings.",
        "A strange, alien scent lingers around downed enemy craft, acrid and slightly sweet.",
        "The distinct smell of medical supplies becomes noticeable as first responders treat the injured.",
        "Dust continues to dominate, coating throats and noses with the powdered remains of damaged structures."
      ]
    }
  };
  
  // Get details for the requested location, or default to New York
  const locationDetails = olfactoryDetails[location] || olfactoryDetails["new_york"];
  
  // Get details for the requested phase, or default to rising
  const phaseDetails = locationDetails[battlePhase] || locationDetails["rising"];
  
  // Return a random detail
  return phaseDetails[Math.floor(Math.random() * phaseDetails.length)];
};

/**
 * Generate a tactile (feel) detail for the current scene
 * 
 * @param {string} location - The current location
 * @param {string} battlePhase - The current battle phase
 * @param {Object} conditions - Environmental conditions
 * @returns {string} - A tactile detail description
 */
const generateTactileDetail = (location, battlePhase, conditions = {}) => {
  const tactileDetails = {
    "new_york": {
      introduction: [
        "A strange static electricity makes hair stand on end as the alien ships approach.",
        "The temperature seems to drop several degrees in the shadow of the massive alien vessels.",
        "The ground vibrates subtly underfoot as the larger ships move into position overhead.",
        "A pressure change is palpable, like the moment before a thunderstorm breaks.",
        "The air feels charged, heavy with anticipation and the unknown energy of the alien presence."
      ],
      rising: [
        "Shockwaves from explosions can be felt through the ground and in the pit of the stomach.",
        "Heat radiates from fires and damaged alien technology, creating pockets of intense warmth.",
        "Dust and small debris rain down constantly, coating skin and clothing with a fine layer of grit.",
        "The concussive force of Thor's hammer striking sends ripples of force that can be felt blocks away.",
        "The ground shakes with each impact as Hulk engages the enemy, making it difficult to maintain balance."
      ],
      climax: [
        "The air itself seems to pulse with energy as Thor summons massive lightning strikes.",
        "Heat from multiple fires creates a localized change in air pressure and temperature.",
        "The ground is unstable underfoot, with debris and damaged roadway creating a treacherous surface.",
        "Shockwaves from the battle are constant now, a physical pressure that pushes against the body.",
        "The vibration of alien ships and weapons creates a constant tremor that can be felt in bones and teeth."
      ],
      resolution: [
        "The air begins to cool as fires are contained, though hot spots remain throughout the battlefield.",
        "The ground is a hazardous mix of debris, water from firefighting efforts, and unstable surfaces.",
        "Dust continues to settle, coating the skin with a layer that turns muddy with sweat or water.",
        "The occasional tremor still passes through the ground as damaged structures settle.",
        "The air quality is poor, each breath feeling heavy with particulates from the battle."
      ]
    }
  };
  
  // Get details for the requested location, or default to New York
  const locationDetails = tactileDetails[location] || tactileDetails["new_york"];
  
  // Get details for the requested phase, or default to rising
  const phaseDetails = locationDetails[battlePhase] || locationDetails["rising"];
  
  // Return a random detail
  return phaseDetails[Math.floor(Math.random() * phaseDetails.length)];
};
