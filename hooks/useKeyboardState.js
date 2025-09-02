import { useEffect, useState } from 'react';
import { Keyboard, Platform } from 'react-native';

// Platform check
const IS_IOS = Platform.OS === 'ios';

const keyboardShowEvent = IS_IOS ? 'keyboardWillShow' : 'keyboardDidShow';
const keyboardHideEvent = IS_IOS ? 'keyboardWillHide' : 'keyboardDidHide';

export const useKeyboardState = () => {
  const [isKeyboardVisible, setIsKeyboardVisible] = useState(false);
  const [keyboardHeight, setKeyboardHeight] = useState(0);

  useEffect(() => {
    // SHOW Keyboard Event
    const showSubscription = Keyboard.addListener(
      keyboardShowEvent,
      (event) => {
        setIsKeyboardVisible(true);
        setKeyboardHeight(event.endCoordinates.height);
      }
    );
    // HIDE Keyboard Event
    const hideSubscription = Keyboard.addListener(
      keyboardHideEvent,
      () => {
        setIsKeyboardVisible(false);
        setKeyboardHeight(0);
      }
    );

    return () => {
      showSubscription.remove();
      hideSubscription.remove();
    };
  }, []);

  return {
    isKeyboardVisible,
    keyboardHeight,
  };
};
