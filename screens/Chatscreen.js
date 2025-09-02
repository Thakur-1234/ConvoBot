import React, { useEffect, useRef, useState, useLayoutEffect } from 'react';
import {
  FlatList,
  KeyboardAvoidingView,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Alert,
} from 'react-native';
import Sentmessagecard from '../components/Sentmessagecard';
import Responsemessagecard from '../components/Responsemessagecard';
import { s, vs } from 'react-native-size-matters';
import { is_ios, RECEIVED, SENT } from '../constants/allconstants';
import Chatinput from '../components/chatinput';
import { SafeAreaView } from 'react-native-safe-area-context';
import Emptychat from '../components/Emptychat';
import { useKeyboardState } from '../hooks/useKeyboardState';
import { getAIResponse } from '../api/http_req';
import { v4 as uuidv4 } from 'uuid';
import 'react-native-get-random-values';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { LinearGradient } from 'expo-linear-gradient';
import TypingBubble from '../components/typingbubble';

// Firebase imports
import { auth, db } from "../config/firebase";
import { addDoc, collection, onSnapshot, orderBy, query, serverTimestamp } from 'firebase/firestore';

const Chatscreen = ({ navigation }) => {
  const [messagesdata, setmessagesdata] = useState([]);
  const [isloading, setisloading] = useState(false);
  const [msginput, setmsginput] = useState('');
  const { isKeyboardVisible } = useKeyboardState();
  const flatlistref = useRef(null);

  const user = auth.currentUser;
  const chatId = "botChat"; // ek hi bot session ke liye

  // Firebase messages listener
  useEffect(() => {
    if (!user) return;

    let firstLoad = true; // flag for first snapshot

    const q = query(
      collection(db, "users", user.uid, "chats", chatId, "messages"),
      orderBy("timestamp", "asc")
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      if (firstLoad) {
        firstLoad = false; // pehle snapshot ko ignore
        return;
      }

      const msgs = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setmessagesdata(msgs);
    });

    return () => unsubscribe();
  }, [user]);

  useLayoutEffect(() => {
    navigation.setOptions({ headerShown: false });
  }, [navigation]);

  //  Send message
  const onmessagesent = async (sentmsg) => {
    const text = String(sentmsg ?? '').trim();
    if (!text || !user) return;

    const newMessage = {
      id: uuidv4(),
      message: text,
      type: SENT,
      timestamp: serverTimestamp(),
    };

    try {
      await addDoc(
        collection(db, "users", user.uid, "chats", chatId, "messages"),
        newMessage
      );

      // Fetch AI response
      setisloading(true);
      const gen_text = await getAIResponse(text);
      const safeText = typeof gen_text === 'string' ? gen_text : JSON.stringify(gen_text);

      const newResponse = {
        id: uuidv4(),
        message: safeText,
        type: RECEIVED,
        timestamp: serverTimestamp(),
      };

      await addDoc(
        collection(db, "users", user.uid, "chats", chatId, "messages"),
        newResponse
      );
    } catch (err) {
      Alert.alert("Error", err.message);
    } finally {
      setisloading(false);
    }
  };

  const scrolltobottom = () => {
    if (flatlistref.current && messagesdata.length > 0) {
      flatlistref.current.scrollToEnd({ animated: true });
    }
  };

  useEffect(() => {
    const timeout = setTimeout(() => scrolltobottom(), 200);
    return () => clearTimeout(timeout);
  }, [messagesdata, isKeyboardVisible]);

  const onNewChat = () => {
    setmessagesdata([]); // FlatList turant empty ho jayegi
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <LinearGradient
        colors={['#96a1c6ff', '#98a4caff', '#c4cad0ff']}
        start={[0, 0]}
        end={[1, 1]}
        style={StyleSheet.absoluteFill}
      />

      <View style={styles.container}>
        {/* Header */}
        <View style={styles.customHeader}>
          <TouchableOpacity
            onPress={() => navigation.toggleDrawer()}
            style={styles.menuBtn}
          >
            <FontAwesome name="bars" size={26} color="black" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>ConvoBot</Text>
        </View>

        {/* Chat Section */}
        <KeyboardAvoidingView
          style={{ flex: 1 }}
          behavior={is_ios ? 'padding' : 'height'}
          keyboardVerticalOffset={is_ios ? 100 : 0}
        >
          <FlatList
            data={messagesdata}
            ref={flatlistref}
            onLayout={scrolltobottom}
            onContentSizeChange={scrolltobottom}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) =>
              item.type === SENT ? (
                <Sentmessagecard message={item.message} />
              ) : (
                <Responsemessagecard message={item.message} />
              )
            }
            contentContainerStyle={{
              paddingHorizontal: s(10),
              paddingBottom: 30,
              flexGrow: 1,
            }}
            ListEmptyComponent={<Emptychat />}
          />

          <TypingBubble isloading={isloading} />

          <Chatinput
            messagevalue={msginput}
            setmessagevalue={setmsginput}
            onmessagesent={onmessagesent}
            onNewChat={onNewChat}
          />
        </KeyboardAvoidingView>
      </View>
    </SafeAreaView>
  );
};

export default Chatscreen;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: 'transparent' },
  profileBtn: { marginLeft: "auto", padding: 5 },
  customHeader: {
    height: vs(50),
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: s(10),
  },
  menuBtn: { padding: 5 },
  headerTitle: {
    fontSize: s(18),
    fontWeight: 'bold',
    marginLeft: 15,
    color: 'black',
  },
});
