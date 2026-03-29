import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  TextInput,
  Platform,
  Dimensions,
  StatusBar,
  Keyboard,
  KeyboardEvent,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  ArrowLeft,
  Paperclip,
  Mic,
  CheckCheck,
  Send,
  MoreVertical,
  Camera,
  Smile,
  Zap,
} from 'lucide-react-native';
import { useNavigation } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';
import { askChatbot } from '../../../shared/services/api';

const { width } = Dimensions.get('window');

const BOT_IMG =
  'https://img.freepik.com/premium-photo/cute-robot-mascot-isolated-white-background_1034303-316.jpg';

type Message = {
  id: string;
  sender: 'ai' | 'user';
  text: string;
  time: string;
  status: 'sent' | 'read' | 'typing';
};

export const ChatScreen: React.FC = () => {
  const { t } = useTranslation();
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();
  const [inputText, setInputText] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      sender: 'ai',
      text: 'Hello! I am your Zenith AI Health Assistant. 🦾\n\nI can help you with medical questions, understand your lab results, and provide health guidance.\n\nHow can I help you today?',
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      status: 'read',
    },
  ]);
  const [keyboardHeight, setKeyboardHeight] = useState(0);
  const scrollRef = useRef<ScrollView>(null);

  // Keyboard listener
  useEffect(() => {
    const showEvent = Platform.OS === 'ios' ? 'keyboardWillShow' : 'keyboardDidShow';
    const hideEvent = Platform.OS === 'ios' ? 'keyboardWillHide' : 'keyboardDidHide';

    const showSub = Keyboard.addListener(showEvent, (e: KeyboardEvent) => {
      setKeyboardHeight(e.endCoordinates.height);
      setTimeout(() => scrollRef.current?.scrollToEnd({ animated: true }), 100);
    });

    const hideSub = Keyboard.addListener(hideEvent, () => {
      setKeyboardHeight(0);
    });

    return () => {
      showSub.remove();
      hideSub.remove();
    };
  }, []);

  const getTimeString = () => {
    return new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const handleSend = async () => {
    if (!inputText.trim() || isSending) return;

    const userQuestion = inputText.trim();

    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      sender: 'user',
      text: userQuestion,
      time: getTimeString(),
      status: 'sent',
    };
    setMessages(prev => [...prev, userMessage]);
    setInputText('');
    setIsSending(true);

    // Add typing indicator
    const typingId = (Date.now() + 1).toString();
    const typingMessage: Message = {
      id: typingId,
      sender: 'ai',
      text: '●●●',
      time: '',
      status: 'typing',
    };
    setMessages(prev => [...prev, typingMessage]);

    try {
      // Call the real chatbot API
      const response = await askChatbot(userQuestion);

      // Remove typing indicator and add real response
      setMessages(prev => {
        const filtered = prev.filter(m => m.id !== typingId);
        const aiMessage: Message = {
          id: (Date.now() + 2).toString(),
          sender: 'ai',
          text: response.answer || 'I could not process that. Please try again.',
          time: getTimeString(),
          status: 'read',
        };
        // Mark user message as read since we got a response
        return [...filtered.map(m => m.id === userMessage.id ? { ...m, status: 'read' as const } : m), aiMessage];
      });

    } catch (error: any) {
      // Remove typing indicator and show error message
      setMessages(prev => {
        const filtered = prev.filter(m => m.id !== typingId);
        const errorMessage: Message = {
          id: (Date.now() + 2).toString(),
          sender: 'ai',
          text: `⚠️ ${error.message || 'Unable to connect to the server. Please check your connection and try again.'}`,
          time: getTimeString(),
          status: 'read',
        };
        return [...filtered, errorMessage];
      });
    } finally {
      setIsSending(false);
    }
  };

  useEffect(() => {
    setTimeout(() => scrollRef.current?.scrollToEnd({ animated: true }), 100);
  }, [messages]);

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#306F6F" />

      {/* Teal top background strip */}
      <View style={styles.topBg} />

      <SafeAreaView style={styles.safeArea} edges={['top']}>

        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
            <ArrowLeft stroke="#FFFFFF" size={24} />
          </TouchableOpacity>
          <View style={styles.botInfo}>
            <View style={styles.botImgWrapper}>
              <Image source={{ uri: BOT_IMG }} style={styles.botImg} />
              <View style={styles.statusDot} />
            </View>
            <View style={styles.botText}>
              <Text style={styles.botName}>Zenith AI</Text>
              <Text style={styles.statusText}>
                {isSending ? 'Typing...' : 'Always Online'}
              </Text>
            </View>
          </View>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <TouchableOpacity style={styles.headerIconBtn}>
              <Zap stroke="#FFFFFF" size={20} fill="#FFFFFF" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.headerIconBtn}>
              <MoreVertical stroke="#FFFFFF" size={24} />
            </TouchableOpacity>
          </View>
        </View>

        {/* Chat area */}
        <View style={[styles.chatBackground, { marginBottom: keyboardHeight }]}>
          <ScrollView
            ref={scrollRef}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.chatScroll}
            keyboardDismissMode="on-drag"
            onContentSizeChange={() => scrollRef.current?.scrollToEnd({ animated: true })}
          >
            <View style={styles.dateBadge}>
              <Text style={styles.dateLabel}>TODAY</Text>
            </View>

            {messages.map(msg => {
              const isAI = msg.sender === 'ai';
              const isTyping = msg.status === 'typing';
              return (
                <View
                  key={msg.id}
                  style={[
                    styles.messageWrapper,
                    isAI ? styles.botMsgWrapper : styles.userMsgWrapper,
                  ]}
                >
                  <View style={[styles.bubble, isAI ? styles.botBubble : styles.userBubble]}>
                    {isTyping ? (
                      <View style={styles.typingContainer}>
                        <View style={[styles.typingDot, styles.typingDot1]} />
                        <View style={[styles.typingDot, styles.typingDot2]} />
                        <View style={[styles.typingDot, styles.typingDot3]} />
                      </View>
                    ) : (
                      <>
                        <Text style={styles.bubbleText}>{msg.text}</Text>
                        <View style={styles.timeWrapper}>
                          <Text style={styles.timeText}>{msg.time}</Text>
                          {!isAI && (
                            <View style={{ marginLeft: 4 }}>
                              <CheckCheck
                                stroke={msg.status === 'read' ? '#34B7F1' : '#717171'}
                                size={14}
                              />
                            </View>
                          )}
                        </View>
                      </>
                    )}
                  </View>
                </View>
              );
            })}
          </ScrollView>

          {/* Footer input bar */}
          <View
            style={[
              styles.footer,
              {
                paddingBottom:
                  keyboardHeight > 0
                    ? 12
                    : Platform.OS === 'ios'
                    ? insets.bottom || 12
                    : 15,
              },
            ]}
          >
            <View style={styles.inputContainer}>
              <TouchableOpacity style={styles.iconBtn}>
                <Smile stroke="#306F6F" size={24} />
              </TouchableOpacity>
              <TextInput
                style={styles.textInput}
                placeholder="Ask about your health..."
                placeholderTextColor="#A0A0A0"
                value={inputText}
                onChangeText={setInputText}
                multiline
                editable={!isSending}
              />
              <TouchableOpacity style={styles.iconBtn}>
                <View style={{ transform: [{ rotate: '45deg' }] }}>
                  <Paperclip stroke="#306F6F" size={22} />
                </View>
              </TouchableOpacity>
              {!inputText && (
                <TouchableOpacity style={styles.iconBtn}>
                  <Camera stroke="#306F6F" size={22} />
                </TouchableOpacity>
              )}
            </View>

            <TouchableOpacity
              style={[styles.sendBtn, isSending && { opacity: 0.5 }]}
              onPress={inputText ? handleSend : undefined}
              activeOpacity={0.8}
              disabled={isSending}
            >
              {inputText ? (
                isSending ? (
                  <ActivityIndicator size="small" color="#FFFFFF" />
                ) : (
                  <Send stroke="#FFFFFF" size={20} fill="#FFFFFF" />
                )
              ) : (
                <Mic stroke="#FFFFFF" size={24} />
              )}
            </TouchableOpacity>
          </View>
        </View>

      </SafeAreaView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F7FEFE',
  },
  topBg: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 150,
    backgroundColor: '#306F6F',
  },
  safeArea: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 12,
    backgroundColor: '#306F6F',
  },
  backBtn: { padding: 5 },
  botInfo: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 5,
  },
  botImgWrapper: { position: 'relative' },
  botImg: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#FFFFFF',
  },
  statusDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#4ADE80',
    position: 'absolute',
    bottom: 2,
    right: 0,
    borderWidth: 2,
    borderColor: '#306F6F',
  },
  botText: { marginLeft: 10 },
  botName: { fontSize: 18, fontWeight: '700', color: '#FFFFFF' },
  statusText: { fontSize: 13, color: '#E0E8E8', opacity: 0.8 },
  headerIconBtn: { marginLeft: 15, padding: 5 },
  chatBackground: {
    flex: 1,
    backgroundColor: '#F7FEFE',
  },
  chatScroll: {
    paddingHorizontal: 15,
    paddingBottom: 20,
    paddingTop: 10,
  },
  dateBadge: {
    backgroundColor: '#E7F5F5',
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 12,
    alignSelf: 'center',
    marginVertical: 15,
  },
  dateLabel: { fontSize: 12, fontWeight: '700', color: '#306F6F' },
  messageWrapper: { marginBottom: 12, width: '100%' },
  botMsgWrapper: { alignItems: 'flex-start' },
  userMsgWrapper: { alignItems: 'flex-end' },
  bubble: {
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 18,
    maxWidth: '85%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 1,
  },
  botBubble: { backgroundColor: '#FFFFFF', borderTopLeftRadius: 4 },
  userBubble: { backgroundColor: '#DCF8F8', borderTopRightRadius: 4 },
  bubbleText: { fontSize: 16, color: '#333333', lineHeight: 23 },
  timeWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    marginTop: 4,
  },
  timeText: { fontSize: 11, color: '#717171' },
  // Typing indicator dots
  typingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 4,
  },
  typingDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#306F6F',
    marginHorizontal: 3,
    opacity: 0.4,
  },
  typingDot1: { opacity: 0.3 },
  typingDot2: { opacity: 0.6 },
  typingDot3: { opacity: 0.9 },
  footer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    paddingHorizontal: 12,
    paddingTop: 12,
    backgroundColor: '#F7FEFE',
  },
  inputContainer: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderRadius: 25,
    minHeight: 52,
    alignItems: 'center',
    paddingHorizontal: 10,
    marginRight: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 3,
  },
  textInput: {
    flex: 1,
    fontSize: 17,
    color: '#333333',
    maxHeight: 120,
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  iconBtn: { padding: 8 },
  sendBtn: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: '#306F6F',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 10,
    elevation: 5,
  },
});