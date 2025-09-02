import React, { useRef, useEffect } from 'react';
import { View, Animated } from 'react-native';
import { s, vs } from 'react-native-size-matters';

const TypingBubble = ({ isloading }) => {
  const dot1Y = useRef(new Animated.Value(0)).current;
  const dot2Y = useRef(new Animated.Value(0)).current;
  const dot3Y = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (isloading) {
      const animateDot = (anim, delay) => {
        return Animated.loop(
          Animated.sequence([
            Animated.delay(delay),
            Animated.timing(anim, {
              toValue: -8, // move up
              duration: 300,
              useNativeDriver: true,
            }),
            Animated.timing(anim, {
              toValue: 0, // move down
              duration: 300,
              useNativeDriver: true,
            }),
          ])
        );
      };

      const anim1 = animateDot(dot1Y, 0);
      const anim2 = animateDot(dot2Y, 150);
      const anim3 = animateDot(dot3Y, 300);

      anim1.start();
      anim2.start();
      anim3.start();

      return () => {
        anim1.stop();
        anim2.stop();
        anim3.stop();
      };
    }
  }, [isloading]);

  if (!isloading) return null;

  return (
    <Animated.View
      style={{
        backgroundColor: "#6c11ffff",
        height: vs(40),
        width: s(80),
        borderRadius: vs(20),
        margin: s(10),
        justifyContent: 'center',
        padding: s(10),
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 3,
        flexDirection: 'row',
        alignItems: 'center',
      }}
    >
      {[dot1Y, dot2Y, dot3Y].map((translateY, index) => (
        <Animated.View
          key={index}
          style={{
            width: s(8),
            height: s(8),
            borderRadius: s(4),
            backgroundColor: '#ffffffff',
            marginHorizontal: s(2),
            transform: [{ translateY }],
          }}
        />
      ))}
    </Animated.View>
  );
};

export default TypingBubble;
