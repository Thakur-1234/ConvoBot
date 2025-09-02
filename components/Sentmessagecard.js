import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { s, vs } from 'react-native-size-matters';
import { LinearGradient } from 'expo-linear-gradient';

const Sentmessagecard = ({ message }) => {
  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#5ef796ff', '#00ff44ff','#71b9bbff']}  // Light gray gradient
        start={[0, 0]}
        end={[1, 1]}
        style={styles.messagecontainer}
      >
        <Text style={styles.textmessage}>{message}</Text>
      </LinearGradient>
    </View>
  );
};

export default Sentmessagecard;

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginVertical: vs(4),
  },
  messagecontainer: {
    borderRadius: s(20),
    maxWidth: '80%',
    padding: s(12),
    // Optional shadow for slight elevation
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  textmessage: {
    fontSize: s(16),
    color: '#fff',
  },
});
