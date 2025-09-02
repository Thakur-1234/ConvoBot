import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import { s, vs } from 'react-native-size-matters';
import * as Clipboard from 'expo-clipboard';
import { MaterialIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

const TypingEffect = ({ text, style, selectable, onTypingComplete }) => {
  const [displayedText, setDisplayedText] = useState('');

  useEffect(() => {
    // Reset displayed text and start character-by-character typing
    let i = -2;
    setDisplayedText('');

    const intervalId = setInterval(() => {
      // Append next character on each tick
      setDisplayedText((prev) => prev + text.charAt(i));
      i++;

      // When all characters typed, stop interval and notify parent
      if (i >= text.length) {
        clearInterval(intervalId);
        if (onTypingComplete) onTypingComplete();
      }
    }, 2); // Typing speed in ms (lower = faster)

    // Cleanup on unmount or when 'text' changes
    return () => clearInterval(intervalId);
  }, [text]);

  return (
    <Text selectable={selectable} style={style}>
      {displayedText}
    </Text>
  );
};

const Responsemessagecard = ({ message }) => {
  const [typingDone, setTypingDone] = useState(false);
  const [copied, setCopied] = useState(false);

  // Copy message to clipboard and show a temporary check icon
  const copyMessage = async () => {
    await Clipboard.setStringAsync(message); // Write text to clipboard
    setCopied(true);                         // Switch icon to check
    setTimeout(() => setCopied(false), 2000); // Revert icon after 2s
  };

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#6a11cb', '#2575fc']}
        start={[0, 0]}
        end={[1, 1]}
        style={styles.messageContainer}
      >
        {/* Run typing effect; when finished, enable the copy button */}
        <TypingEffect
          style={styles.textMessage}
          text={message}
          selectable={true}
          onTypingComplete={() => setTypingDone(true)} // Reveal copy icon
        />
        <Text></Text>

        {/* Show copy icon only after typing animation completes */}
        {typingDone && (
          <TouchableOpacity onPress={copyMessage} style={styles.copyIconWrapper} activeOpacity={0.7}>
            <View style={styles.copyIconBackground}>
              {copied ? (
                <MaterialIcons name="check" size={12} color="white" />
              ) : (
                <MaterialIcons name="content-copy" size={12} color="white" />
              )}
            </View>
          </TouchableOpacity>
        )}
      </LinearGradient>
    </View>
  );
};

export default Responsemessagecard;

const styles = StyleSheet.create({
  container: {
    marginVertical: vs(8),
    alignSelf: 'flex-start',
    maxWidth: '90%',
  },
  messageContainer: {
    borderRadius: s(18),
    padding: s(14),
    paddingRight: s(40),
    shadowColor: '#5850ec',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.4,
    shadowRadius: 6,
    elevation: 6,
    position: 'relative',
  },
  textMessage: {
    fontSize: s(16),
    color: '#ffffff',
    lineHeight: s(22),
  },
  copyIconWrapper: {
    position: 'absolute',
    right: s(10),
    bottom: s(10),
  },
  copyIconBackground: {
    width: s(30),
    height: s(30),
    borderRadius: s(12),
    justifyContent: 'center',
    alignItems: 'center',
    
  },
});
