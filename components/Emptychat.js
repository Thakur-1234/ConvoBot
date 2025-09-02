import React, { useEffect, useRef } from 'react';
import { StyleSheet, Text, View, Animated } from 'react-native';
import AppIcon from '../assets/icon/Appicon';
import { s, vs } from 'react-native-size-matters';

const Emptychat = () => {
  // Animated values for opacity, scale and vertical movement
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.8)).current;
  const translateYAnim = useRef(new Animated.Value(20)).current;

  useEffect(() => {
    // Create a looping sequence of animations
    const loopAnim = Animated.loop(
      Animated.sequence([
        // Animate fade-in, scale-up and slide-up at the same time
        Animated.parallel([
          Animated.timing(fadeAnim, {
            toValue: 1,
            duration: 800,
            useNativeDriver: true,
          }),
          Animated.spring(scaleAnim, {
            toValue: 1.1,
            friction: 3,
            useNativeDriver: true,
          }),
          Animated.timing(translateYAnim, {
            toValue: 0,
            duration: 800,
            useNativeDriver: true,
          }),
        ]),
        // Pause for 1 second before reversing
        Animated.delay(1000),
        // Animate fade-out, scale-down and slide-down at the same time
        Animated.parallel([
          Animated.timing(fadeAnim, {
            toValue: 0,
            duration: 800,
            useNativeDriver: true,
          }),
          Animated.spring(scaleAnim, {
            toValue: 0.8,
            friction: 3,
            useNativeDriver: true,
          }),
          Animated.timing(translateYAnim, {
            toValue: 20,
            duration: 800,
            useNativeDriver: true,
          }),
        ]),
        // Pause another 1 second before looping again
        Animated.delay(1000),
      ])
    );

    // Start the infinite loop animation
    loopAnim.start();

    // Cleanup function stops animation when component unmounts
    return () => loopAnim.stop();
  }, [fadeAnim, scaleAnim, translateYAnim]);

  return (
    <View style={styles.container}>
      {/* Animated icon with opacity and scale */}
      <Animated.View style={{ opacity: fadeAnim, transform: [{ scale: scaleAnim }] }}>
        <AppIcon height={vs(120)} width={s(120)} />
      </Animated.View>

      {/* Animated title text with fade and vertical slide */}
      <Animated.Text
        style={[
          styles.title,
          {
            opacity: fadeAnim,
            transform: [{ translateY: translateYAnim }],
          },
        ]}
      >
        Hello
      </Animated.Text>

      {/* Animated subtitle text moving in sync with title */}
      <Animated.Text
        style={[
          styles.subtitle,
          {
            opacity: fadeAnim,
            transform: [{ translateY: translateYAnim }],
          },
        ]}
      >
        What I can help with?
      </Animated.Text>
    </View>
  );
};

export default Emptychat;

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    flex: 1,
    paddingTop: '60%',
  },
  title: {
    fontSize: s(28),
    fontWeight: 'bold',
    marginBottom: 10,
    marginTop: 12,
    color: '#444',
  },
  subtitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#666',
  },
});
