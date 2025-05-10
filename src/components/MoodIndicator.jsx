import { useState, useEffect } from 'react';
import { Heart, AlertTriangle, Smile, Frown, Meh, ThumbsUp, ThumbsDown, Zap } from 'lucide-react';

/**
 * MoodIndicator component displays a visual indicator of a character's mood
 * 
 * @param {Object} props - Component props
 * @param {string} props.mood - The current mood of the character
 * @param {number} props.intensity - The intensity of the mood (1-10)
 * @param {string} props.size - Size of the indicator ('sm', 'md', 'lg')
 * @param {boolean} props.showLabel - Whether to show the mood label
 * @returns {JSX.Element} - The mood indicator component
 */
const MoodIndicator = ({ mood, intensity = 5, size = 'md', showLabel = false }) => {
  const [icon, setIcon] = useState(null);
  const [color, setColor] = useState('text-muted-foreground');
  const [label, setLabel] = useState(mood || 'Neutral');

  // Determine the appropriate icon and color based on the mood
  useEffect(() => {
    const moodLower = (mood || '').toLowerCase();
    
    // Map mood to icon and color
    if (moodLower.includes('happy') || moodLower.includes('joyful') || moodLower.includes('excited') || moodLower.includes('pleased')) {
      setIcon(<Smile />);
      setColor('text-green-500');
      setLabel('Happy');
    } else if (moodLower.includes('angry') || moodLower.includes('furious') || moodLower.includes('enraged')) {
      setIcon(<AlertTriangle />);
      setColor('text-red-500');
      setLabel('Angry');
    } else if (moodLower.includes('sad') || moodLower.includes('depressed') || moodLower.includes('gloomy')) {
      setIcon(<Frown />);
      setColor('text-blue-500');
      setLabel('Sad');
    } else if (moodLower.includes('loving') || moodLower.includes('affectionate') || moodLower.includes('caring')) {
      setIcon(<Heart />);
      setColor('text-pink-500');
      setLabel('Loving');
    } else if (moodLower.includes('neutral') || moodLower.includes('calm')) {
      setIcon(<Meh />);
      setColor('text-gray-500');
      setLabel('Neutral');
    } else if (moodLower.includes('positive') || moodLower.includes('agreeable') || moodLower.includes('supportive')) {
      setIcon(<ThumbsUp />);
      setColor('text-emerald-500');
      setLabel('Positive');
    } else if (moodLower.includes('negative') || moodLower.includes('disagreeable') || moodLower.includes('critical')) {
      setIcon(<ThumbsDown />);
      setColor('text-amber-500');
      setLabel('Negative');
    } else if (moodLower.includes('intense') || moodLower.includes('passionate') || moodLower.includes('energetic')) {
      setIcon(<Zap />);
      setColor('text-purple-500');
      setLabel('Intense');
    } else {
      // Default for unknown moods
      setIcon(<Meh />);
      setColor('text-gray-500');
      setLabel(mood || 'Neutral');
    }
  }, [mood]);

  // Determine size classes
  const sizeClasses = {
    sm: 'h-3 w-3',
    md: 'h-4 w-4',
    lg: 'h-5 w-5'
  };
  
  // Determine intensity styles (opacity based on intensity)
  const intensityStyle = {
    opacity: 0.5 + (intensity / 20) // Range from 0.5 to 1.0
  };

  return (
    <div className="flex items-center gap-1" style={intensityStyle}>
      <div className={`${color} ${sizeClasses[size] || sizeClasses.md}`}>
        {icon}
      </div>
      {showLabel && (
        <span className={`text-xs ${color}`}>{label}</span>
      )}
    </div>
  );
};

export default MoodIndicator;
