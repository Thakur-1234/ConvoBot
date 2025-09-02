import React, { useState, useEffect } from 'react';
import { Text } from 'react-native';

const TypingEffect = ({ text, style }) => {
  const [displayedText, setDisplayedText] = useState('');

  useEffect(() => {
    // Start from the first character and clear previous content
    let index = 0;
    setDisplayedText('');

    // Add one character on each tick to create typing effect
    const interval = setInterval(() => {
      setDisplayedText(prev => prev + text.charAt(index)); // append next char
      index += 1; // move to next character

      // Stop when all characters are shown
      if (index >= text.length) {
        clearInterval(interval);
      }
    }, 20); // typing speed in milliseconds 

    // Cleanup: stop interval if text changes or component unmounts
    return () => clearInterval(interval);
  }, [text]);

  // Render the progressively built string
  return <Text style={style}>{displayedText}</Text>;
};

export default TypingEffect;
