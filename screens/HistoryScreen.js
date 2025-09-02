import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  Alert,
  UIManager,
  LayoutAnimation,
  Platform,
} from 'react-native';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import Feather from '@expo/vector-icons/Feather';
import { s } from 'react-native-size-matters';
import { auth, db } from '../config/firebase';
import {
  collection,
  deleteDoc,
  doc,
  onSnapshot,
  orderBy,
  query,
  getDocs,
} from 'firebase/firestore';

// ✅ Enable LayoutAnimation on Android
if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

const HistoryScreen = () => {
  const [history, setHistory] = useState([]);
  const user = auth.currentUser;
  const chatId = 'botChat';

  useEffect(() => {
    if (!user) return;

    const q = query(
      collection(db, 'users', user.uid, 'chats', chatId, 'messages'),
      orderBy('timestamp', 'asc')
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const msgs = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));

      // 👇 Smooth transition whenever messages update
      LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
      setHistory(msgs);
    });

    return () => unsubscribe();
  }, [user]);

  // ✅ Clear history from Firestore with animation
  const clearHistory = async () => {
    try {
      if (!user) return;

      const q = query(collection(db, 'users', user.uid, 'chats', chatId, 'messages'));
      const snap = await getDocs(q);

      // Firestore batch delete
      const deletions = snap.docs.map((d) =>
        deleteDoc(doc(db, 'users', user.uid, 'chats', chatId, 'messages', d.id))
      );
      await Promise.all(deletions);

      LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
      setHistory([]); // 👈 clear instantly with animation

      Alert.alert('Success', 'Chat history cleared!');
    } catch (e) {
      Alert.alert('Error', e.message);
    }
  };

  const renderItem = ({ item }) => (
    <View style={styles.card}>
      <Text style={styles.userLabel}>{item.type === 'sent' ? 'You' : 'ConvoBot'}</Text>
      <Text style={styles.messageText}>{item.message}</Text>
      <TouchableOpacity style={styles.copyBtn}>
        <Feather name="copy" size={12} color="#4B5563" />
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={history}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        ListEmptyComponent={
          <Text style={styles.emptyText}>No chat history found.</Text>
        }
      />
      <TouchableOpacity style={styles.fab} onPress={clearHistory}>
        <MaterialIcons name="delete-sweep" size={28} color="#fff" />
      </TouchableOpacity>
    </View>
  );
};

export default HistoryScreen;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F3F4F6', paddingHorizontal: s(10) },
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 12,
    marginVertical: 6,
    elevation: 2,
  },
  userLabel: { fontWeight: 'bold', color: '#2563EB', marginBottom: 4 },
  messageText: { fontSize: 15, color: '#374151' },
  copyBtn: {
    position: 'absolute',
    right: 12,
    bottom: 12,
    backgroundColor: '#E0E7FF',
    padding: 6,
    borderRadius: 20,
  },
  fab: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    backgroundColor: '#2563EB',
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: { marginTop: 50, textAlign: 'center', color: '#9CA3AF' },
});
