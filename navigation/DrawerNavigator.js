import React from 'react';
import { Alert } from 'react-native';
import { createDrawerNavigator, DrawerContentScrollView, DrawerItem } from '@react-navigation/drawer';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { s } from 'react-native-size-matters';

import Chatscreen from '../screens/Chatscreen';
import HistoryScreen from '../screens/HistoryScreen';
import { auth } from '../config/firebase';

const Drawer = createDrawerNavigator();

function CustomDrawerContent(props) {
  const { navigation } = props;

  // Handle sign-out and show any error if sign-out fails
  const handleLogout = async () => {
    try {
      await auth.signOut(); // Firebase sign out
      // Optionally navigate to Auth screen here if needed
      // navigation.reset({ index: 0, routes: [{ name: 'Login' }] });
    } catch (error) {
      Alert.alert('Logout Error', error.message); // Show error to the user
    }
  };

  return (
    // Scrollable drawer UI container that passes navigation props to children
    <DrawerContentScrollView {...props}>
      {/* Navigate to Chat screen (ConvoBot) */}
      <DrawerItem
        label="Chat"
        labelStyle={{
          fontSize: s(15),
          fontWeight: 'bold',
          borderBottomWidth: s(2),
        }}
        onPress={() => navigation.navigate('ConvoBot')} // go to chat screen
        icon={() => <FontAwesome name="wechat" size={25} />}
      />

      {/* Navigate to History screen */}
      <DrawerItem
        label="History"
        labelStyle={{
          fontSize: s(15),
          fontWeight: 'bold',
          borderBottomWidth: s(2),
        }}
        onPress={() => navigation.navigate('History')} // go to history screen
        icon={() => <FontAwesome name="history" size={25} />}
      />

      {/* Trigger logout flow */}
      <DrawerItem
        label="Logout"
        labelStyle={{
          fontSize: s(15),
          fontWeight: 'bold',
          borderBottomWidth: s(2),
        }}
        onPress={handleLogout} // sign out user
        icon={() => <MaterialCommunityIcons name="logout" size={25} />}
      />
    </DrawerContentScrollView>
  );
}

export default function ChatDrawerNavigator() {
  return (
    // Drawer navigator with visual options and custom drawer content
    <Drawer.Navigator
      drawerContent={(props) => <CustomDrawerContent {...props} />} // inject custom drawer
    >
      {/* Register routes available in the drawer */}
      <Drawer.Screen name="ConvoBot" component={Chatscreen} />
      <Drawer.Screen name="History" component={HistoryScreen} />
    </Drawer.Navigator>
  );
}
