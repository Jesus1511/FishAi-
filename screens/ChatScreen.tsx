import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { Audio } from 'expo-av';
import React, { useEffect, useRef, useState } from 'react';
import { ActivityIndicator, Alert, Dimensions, FlatList, KeyboardAvoidingView, Platform, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { supabase } from '../Supabase/Supabase';
import useColors from '../Utils/Colors';

const { height } = Dimensions.get('window');

type ColorsType = ReturnType<typeof useColors>;

export default function ChatScreen() {
  const Colors = useColors();
  const styles = DynamicStyles(Colors);
  const [messages, setMessages] = useState([
    { id: '1', text: 'Hi! How can I help you today?', sender: 'bot' },
  ]);
  const [input, setInput] = useState('');
  const flatListRef = useRef(null);
  const STORAGE_KEY = 'chat_messages';
  const [loading, setLoading] = useState(false);

  // Load stored messages on start
  useEffect(() => {
    (async () => {
      const stored = await AsyncStorage.getItem(STORAGE_KEY);
      if (stored) {
        setMessages(JSON.parse(stored));
      }
    })();
  }, []);

  // Save messages every time they change
  useEffect(() => {
    AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(messages));
  }, [messages]);

  // Function to reset the chat
  const resetChat = async () => {
    Alert.alert(
      "Are you sure?",
      "You will lose your current chat.",
      [
        {
          text: "Cancel",
          style: "cancel"
        },
        {
          text: "Reset",
          style: "destructive",
          onPress: async () => {
            const initial = [{ id: Date.now().toString(), text: 'Hi! How can I help you today?', sender: 'bot' }];
            setMessages(initial);
            await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(initial));
          }
        }
      ]
    );
  };

  // Function to play a sound
  const playSound = async (soundFile: any) => {
    try {
      const { sound } = await Audio.Sound.createAsync(soundFile);
      // Si es el sonido de enviar mensaje, adelanta medio segundo
      if (soundFile === require('../assets/audio/message-send copy.mp3')) {
        await sound.setPositionAsync(700); // 500 ms
      }
      await sound.playAsync();
      // Unload the sound after playing
      sound.setOnPlaybackStatusUpdate((status) => {
        if (!status.isLoaded || status.didJustFinish) {
          sound.unloadAsync();
        }
      });
    } catch (error) {
      console.warn('Error playing sound:', error);
    }
  };

  const sendToGemini = async (userMessage: string, history: { id: string, text: string, sender: string }[]) => {
    try {
      // Get the token of the authenticated user
      const {
        data: { session },
        error,
      } = await supabase.auth.getSession();

      if (error || !session) {
        console.error('Could not get session:', error);
        return 'You must be logged in to use the chat.';
      }

      const token = session.access_token;

      // Construir el historial en el formato esperado
      const formattedHistory = history.map(msg => ({
        role: msg.sender === 'user' ? 'user' : 'model',
        content: msg.text,
      }));

      const response = await axios.post(
        'https://xszjtninjtzirxxbjape.supabase.co/functions/v1/chat-gemini',
        {
          prompt: userMessage,
          history: formattedHistory,
        },
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        }
      );

      return response.data.reply || 'No response received from the bot.';
    } catch (error: any) {
      console.error('Error communicating with Gemini:', error);
      return 'An error occurred while getting the bot response.';
    }
  };

  const sendMessage = async () => {
    if (!input.trim() || loading) return;
    const currentInput = input;
    setInput('');
    setTimeout(() => {
      setLoading(true);
      const userMessage = { id: Date.now().toString(), text: currentInput, sender: 'user' };
      const history = [...messages, userMessage];
      setMessages(prev => [...prev, userMessage]);
      // Play send sound
      playSound(require('../assets/audio/message-send copy.mp3'));
      sendToGemini(currentInput, history).then(botText => {
        const botMessage = { id: Date.now().toString(), text: botText, sender: 'bot' };
        setMessages(prev => [...prev, botMessage]);
        playSound(require('../assets/audio/new-message copy.mp3'));
        setLoading(false);
      });
    }, 0);
  };

  const renderItem = ({ item }: { item: { id: string; text: string; sender: string } }) => (
    <View style={[
      styles.messageContainer,
      item.sender === 'user' ? styles.user : styles.bot
    ]}>
      <Text style={styles.messageText}>{item.text}</Text>
    </View>
  );

  return (
    <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      {/* Header with bot name and reset button */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>FishAI</Text>
        <TouchableOpacity style={styles.resetButton} onPress={resetChat}>
          <Text style={styles.resetButtonText}>Reset</Text>
        </TouchableOpacity>
      </View>
      <FlatList
        ref={flatListRef} 
        data={messages}
        renderItem={renderItem}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.list}
        onContentSizeChange={() => {
          if (flatListRef.current && 'scrollToOffset' in flatListRef.current) {
            // @ts-ignore
            flatListRef.current.scrollToOffset({ offset: Number.MAX_SAFE_INTEGER, animated: true });
          }
        }}
      />
      {/* Animación de carga mientras se espera la respuesta de Gemini */}
      {loading && (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={Colors.sendButton} />
          <Text style={styles.loadingText}>El bot está escribiendo...</Text>
        </View>
      )}
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          value={input}
          onChangeText={(text) => {
            setInput(text);
            
          }}
          placeholder="Type a message..."
          placeholderTextColor={Colors.placeholder}
          editable={!loading}
        />
        <TouchableOpacity
          style={[styles.sendButton, loading && styles.sendButtonDisabled]}
          onPress={sendMessage}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator size="small" color={Colors.sendButtonText} />
          ) : (
            <Text style={styles.sendButtonText}>Send</Text>
          )}
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const DynamicStyles = (Colors: ColorsType) => StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  list: { padding: 10 },
  messageContainer: {
    marginVertical: 4,
    maxWidth: '75%',
    padding: 10,
    borderRadius: 12,
  },
  user: {
    backgroundColor: Colors.userMessage,
    alignSelf: 'flex-end',
    borderTopRightRadius: 0,
    borderTopLeftRadius: 12,
  },
  bot: {
    backgroundColor: Colors.botMessage,
    alignSelf: 'flex-start',
    borderTopLeftRadius: 0,
    borderTopRightRadius: 12,
  },
  messageText: { fontSize: 16, color: Colors.text },
  inputContainer: {
    flexDirection: 'row',
    padding: 8,
    borderTopWidth: 1,
    borderColor: Colors.inputBorder,
    backgroundColor: Colors.ligthBackground,
    marginBottom: height * 0.1,
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: Colors.inputBorder,
    borderRadius: 20,
    paddingHorizontal: 12,
    fontSize: 16,
    backgroundColor: Colors.input,
    color: Colors.text,
  },
  sendButton: {
    marginLeft: 8,
    backgroundColor: Colors.sendButton,
    borderRadius: 20,
    paddingVertical: 10,
    paddingHorizontal: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sendButtonText: {
    color: Colors.sendButtonText,
    fontWeight: 'bold',
    fontSize: 16,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 24,
    paddingBottom: 12,
    backgroundColor: Colors.background,
    borderBottomWidth: 1,
    borderColor: Colors.inputBorder,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: Colors.text,
  },
  resetButton: {
    backgroundColor: Colors.sendButton,
    paddingVertical: 6,
    paddingHorizontal: 14,
    borderRadius: 16,
  },
  resetButtonText: {
    color: Colors.sendButtonText,
    fontWeight: 'bold',
    fontSize: 14,
  },
  sendButtonDisabled: {
    backgroundColor: Colors.inputBorder,
  },
  loadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
  },
  loadingText: {
    marginLeft: 10,
    color: Colors.text,
    fontSize: 16,
    fontStyle: 'italic',
  },
}); 