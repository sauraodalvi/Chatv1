// Video utility functions for Velora

/**
 * Extract video ID from various video platform URLs
 * 
 * @param {string} url - The video URL
 * @returns {Object} - Object containing platform and videoId
 */
export const extractVideoInfo = (url) => {
  // YouTube
  const youtubeRegex = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/;
  const youtubeMatch = url.match(youtubeRegex);
  
  if (youtubeMatch && youtubeMatch[1]) {
    return {
      platform: 'youtube',
      videoId: youtubeMatch[1]
    };
  }
  
  // Vimeo
  const vimeoRegex = /(?:vimeo\.com\/(?:channels\/(?:\w+\/)?|groups\/[^\/]*\/videos\/|album\/\d+\/video\/|)(\d+)(?:$|\/|\?))/;
  const vimeoMatch = url.match(vimeoRegex);
  
  if (vimeoMatch && vimeoMatch[1]) {
    return {
      platform: 'vimeo',
      videoId: vimeoMatch[1]
    };
  }
  
  // TikTok
  const tiktokRegex = /tiktok\.com\/@[\w.-]+\/video\/(\d+)/;
  const tiktokMatch = url.match(tiktokRegex);
  
  if (tiktokMatch && tiktokMatch[1]) {
    return {
      platform: 'tiktok',
      videoId: tiktokMatch[1]
    };
  }
  
  return {
    platform: 'unknown',
    videoId: null
  };
};

/**
 * Generate a chat theme based on a video URL
 * 
 * In a real implementation, this would use AI or an API to analyze the video
 * and generate a theme. For this demo, we'll use some predefined themes based
 * on the video platform and simple patterns.
 * 
 * @param {string} url - The video URL
 * @returns {Object} - Theme object with title, description, and prompt
 */
export const generateThemeFromVideo = async (url) => {
  // In a real implementation, this would call an API to analyze the video
  // For now, we'll simulate a delay and return a predefined theme
  
  return new Promise((resolve) => {
    setTimeout(() => {
      const { platform, videoId } = extractVideoInfo(url);
      
      // Predefined themes based on platform
      const themes = {
        youtube: [
          {
            title: "Epic Adventure",
            description: "A journey through unknown lands with unexpected allies.",
            prompt: "You find yourselves on the edge of a vast, uncharted wilderness. The map shows a path, but legends speak of dangers and wonders alike. What secrets will you uncover together?"
          },
          {
            title: "Modern Mystery",
            description: "Strange events in an ordinary town lead to extraordinary discoveries.",
            prompt: "The small cafe on Main Street has become the center of unusual occurrences. Patrons report lost time, strange conversations with people who were never there, and a sense that reality itself is thin here."
          },
          {
            title: "Cosmic Encounter",
            description: "When different worlds collide, nothing is as it seems.",
            prompt: "The night sky lit up with colors never before seen on Earth. Now, visitors from beyond the stars walk among us, each with their own agenda and perspective on humanity."
          }
        ],
        vimeo: [
          {
            title: "Artistic Revelation",
            description: "Creativity and expression reveal deeper truths.",
            prompt: "In a world where art has become the primary language of communication, a new masterpiece has appeared overnight in the central gallery. Its creator is unknown, but its effect on viewers is profound and sometimes disturbing."
          },
          {
            title: "Historical Crossroads",
            description: "Past meets present in unexpected ways.",
            prompt: "An archaeological dig has uncovered an artifact that defies historical understanding. Those who touch it report vivid visions of the past—or perhaps an alternate timeline altogether."
          }
        ],
        tiktok: [
          {
            title: "Viral Phenomenon",
            description: "When something captures everyone's attention, what lies beneath?",
            prompt: "A simple dance challenge has swept across the globe, but those who perform it begin to report strange dreams and newfound abilities. Is it mass hysteria, or something more intentional?"
          },
          {
            title: "Quick Connections",
            description: "Strangers brought together by chance or fate.",
            prompt: "Five people from different walks of life all received the same mysterious message at exactly 3:33 AM. Now they've found each other, but don't know why they've been brought together."
          }
        ],
        unknown: [
          {
            title: "Mysterious Gathering",
            description: "When strangers meet, new stories begin.",
            prompt: "You've all received an invitation to a gathering at an address none of you recognize. Upon arrival, you find a beautifully prepared space, but no host in sight. Only a note that reads: 'When everyone is here, the truth will reveal itself.'"
          }
        ]
      };
      
      // Select a random theme based on the platform
      const platformThemes = themes[platform] || themes.unknown;
      const selectedTheme = platformThemes[Math.floor(Math.random() * platformThemes.length)];
      
      resolve(selectedTheme);
    }, 1500); // Simulate API delay
  });
};
