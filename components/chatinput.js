import React, { useState } from 'react';
import { StyleSheet, TextInput, TouchableOpacity, View, Animated } from 'react-native';
import { s, vs } from 'react-native-size-matters';
import Feather from '@expo/vector-icons/Feather';
import AntDesign from '@expo/vector-icons/AntDesign';
import { is_ios } from '../constants/allconstants';
import {useKeyboardState} from "../hooks/useKeyboardState"

const Chatinput = ({ messagevalue, setmessagevalue, onmessagesent, onNewChat }) => {
  // Track if input is focused for styling
  const [isFocused, setIsFocused] = useState(false);

  // Check if message has non-space characters to enable send button
  const canSend = messagevalue.trim().length > 0;

  // Animated opacity values for buttons for press feedback
  const [sendOpacity] = useState(new Animated.Value(1));
  const [newChatOpacity] = useState(new Animated.Value(1));

  // Animate button press opacity effect
  const animatePress = (animation) => {
    Animated.sequence([
      Animated.timing(animation, { toValue: 0.6, duration: 100, useNativeDriver: true }),
      Animated.timing(animation, { toValue: 1, duration: 100, useNativeDriver: true }),
    ]).start();
  };

  // Handler when send button is pressed
  const sentmessagehandler = () => {
    if (canSend) {
      onmessagesent(messagevalue.trim());
      setmessagevalue('');
      animatePress(sendOpacity);
    }
  };

  // Handler for new chat (+) button press
  const newChatHandler = () => {
    onNewChat();
    animatePress(newChatOpacity);
  };
  const {isKeyboardVisible} = useKeyboardState()

  
  return (
    <View style={[styles.container, { paddingBottom: isKeyboardVisible ? vs(42) : vs(15) }]}>
      
      {/* New Chat (+) Button with opacity animation */}
      <Animated.View style={[styles.buttonContainer, { opacity: newChatOpacity }]}>
        <TouchableOpacity
          onPress={newChatHandler}
          activeOpacity={0.7}
          style={[styles.button, styles.newChatButton]}
        >
          <AntDesign name="plus" size={26} color="#4A90E2" />
        </TouchableOpacity>
      </Animated.View>

      {/* Text input box with dynamic focus style */}
      <TextInput
        style={[styles.input, isFocused && styles.inputFocused]}
        value={messagevalue}
        onChangeText={setmessagevalue}
        placeholder="Ask me something..."
        placeholderTextColor="#999"
        multiline
        underlineColorAndroid="transparent"
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
      />

      {/* Send button with enable/disable and opacity animation */}
      <Animated.View style={[styles.buttonContainer, { opacity: sendOpacity }]}>
        <TouchableOpacity
          onPress={sentmessagehandler}
          disabled={!canSend}
          activeOpacity={0.7}
          style={[styles.button, canSend ? styles.sendButtonActive : styles.sendButtonDisabled]}
        >
          <Feather name="send" size={22} color={canSend ? 'white' : '#ccc'} />
        </TouchableOpacity>
      </Animated.View>
    </View>
  );
};

export default Chatinput;

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    paddingHorizontal: s(15),
    paddingTop: vs(12),
    backgroundColor: '#fffefe0f',
    borderTopWidth: 2,
    borderTopColor: '#000000',
    alignItems: 'center',
  },
  buttonContainer: {
    borderRadius: s(25),
  },
  button: {
    width: s(42),
    height: s(42),
    borderRadius: s(21),
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#bbb',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  newChatButton: {
    backgroundColor: '#d9e9ff',
    marginRight: s(8),
  },
  sendButtonActive: {
    backgroundColor: '#4A90E2',
  },
  sendButtonDisabled: {
    backgroundColor: '#e0e0e0',
  },
  input: {
    flex: 1,
    backgroundColor: '#fff',
    borderRadius: s(20),
    paddingVertical: vs(10),
    paddingHorizontal: s(12),
    fontSize: s(16),
    color: '#333',
    maxHeight: vs(120),
    borderWidth: 1,
    borderColor: '#ccc',
    marginRight: s(8),
  },
  inputFocused: {
    borderColor: '#4A90E2',
    shadowColor: '#4A90E2',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 4,
    elevation: 5,
  },
});
