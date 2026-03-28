// import React, { useState, useRef, useEffect } from 'react';
// import { 
//   View, 
//   Text, 
//   StyleSheet, 
//   ScrollView, 
//   TouchableOpacity, 
//   Image, 
//   TextInput, 
//   KeyboardAvoidingView, 
//   Platform,
//   Dimensions,
//   StatusBar
// } from 'react-native';
// import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
// import { 
//   ArrowLeft, 
//   Paperclip, 
//   Mic, 
//   CheckCheck, 
//   Send,
//   MoreVertical,
//   Camera,
//   Smile,
//   Zap
// } from 'lucide-react-native';
// import { useNavigation } from '@react-navigation/native';

// const { width } = Dimensions.get('window');

// const BOT_IMG = 'https://img.freepik.com/premium-photo/cute-robot-mascot-isolated-white-background_1034303-316.jpg';

// const INITIAL_MESSAGES = [
//   { id: '1', sender: 'ai', text: 'Hello! I am your Zenith AI Health Assistant. 🦾\n\nHow can I help you today?', time: '10:00 AM', status: 'read' },
//   { id: '2', sender: 'user', text: 'I want to ask about my recent blood test results.', time: '10:01 AM', status: 'read' },
//   { id: '3', sender: 'ai', text: 'Of course! I can help you analyze those. Please upload your report or tell me specific values you are concerned about.', time: '10:01 AM', status: 'read' },
// ];

// export const ChatScreen: React.FC = () => {
//   const navigation = useNavigation();
//   const insets = useSafeAreaInsets();
//   const [inputText, setInputText] = useState('');
//   const [messages, setMessages] = useState(INITIAL_MESSAGES);
//   const scrollRef = useRef<ScrollView>(null);

//   const handleSend = () => {
//     if (inputText.trim()) {
//       const newMessage = {
//         id: Date.now().toString(),
//         sender: 'user',
//         text: inputText,
//         time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
//         status: 'sent'
//       };
//       setMessages([...messages, newMessage]);
//       setInputText('');
      
//       setTimeout(() => {
//         const botResponse = {
//           id: (Date.now() + 1).toString(),
//           sender: 'ai',
//           text: "I'm analyzing your request against your medical history. One moment please...",
//           time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
//           status: 'read'
//         };
//         setMessages(prev => [...prev, botResponse]);
//       }, 1500);
//     }
//   };

//   useEffect(() => {
//     setTimeout(() => scrollRef.current?.scrollToEnd({ animated: true }), 100);
//   }, [messages]);

//   return (
//     <View style={styles.container}>
//       <StatusBar barStyle="light-content" backgroundColor="#306F6F" />
      
//       {/* Top Background - Teal */}
//       <View style={styles.topBg} />
      
//       <SafeAreaView style={styles.safeArea} edges={['top']}>
//         {/* Header */}
//         <View style={styles.header}>
//           <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
//             <ArrowLeft color="#FFFFFF" size={24} />
//           </TouchableOpacity>
//           <View style={styles.botInfo}>
//             <View style={styles.botImgWrapper}>
//               <Image source={{ uri: BOT_IMG }} style={styles.botImg} />
//               <View style={styles.statusDot} />
//             </View>
//             <View style={styles.botText}>
//               <Text style={styles.botName}>Zenith AI Assistant</Text>
//               <Text style={styles.statusText}>Always Online</Text>
//             </View>
//           </View>
//           <View style={{ flexDirection: 'row', alignItems: 'center' }}>
//             <TouchableOpacity style={styles.headerIconBtn}>
//               <Zap color="#FFFFFF" size={20} fill="#FFFFFF" />
//             </TouchableOpacity>
//             <TouchableOpacity style={styles.headerIconBtn}>
//               <MoreVertical color="#FFFFFF" size={24} />
//             </TouchableOpacity>
//           </View>
//         </View>

//         {/* Content Area */}
//         <KeyboardAvoidingView
//           behavior={Platform.OS === 'ios' ? 'padding' : undefined}
//           style={styles.keyboardContainer}
//           keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 0}
//         >
//           <View style={styles.chatBackground}>
//             <ScrollView 
//               ref={scrollRef}
//               showsVerticalScrollIndicator={false} 
//               contentContainerStyle={styles.chatScroll}
//               keyboardDismissMode="on-drag"
//               onContentSizeChange={() => scrollRef.current?.scrollToEnd({ animated: true })}
//             >
//               <View style={styles.dateBadge}>
//                 <Text style={styles.dateLabel}>TODAY</Text>
//               </View>

//               {messages.map((msg) => {
//                 const isAI = msg.sender === 'ai';
//                 return (
//                   <View key={msg.id} style={[styles.messageWrapper, isAI ? styles.botMsgWrapper : styles.userMsgWrapper]}>
//                     <View style={[styles.bubble, isAI ? styles.botBubble : styles.userBubble]}>
//                       <Text style={styles.bubbleText}>
//                         {msg.text}
//                       </Text>
//                       <View style={styles.timeWrapper}>
//                         <Text style={styles.timeText}>{msg.time}</Text>
//                         {!isAI && (
//                           <CheckCheck 
//                             color={msg.status === 'read' ? '#34B7F1' : '#717171'} 
//                             size={14} 
//                             style={{ marginLeft: 4 }} 
//                           />
//                         )}
//                       </View>
//                     </View>
//                   </View>
//                 );
//               })}
//             </ScrollView>

//             {/* Input Bar inside the same background container */}
//             <View style={[styles.footer, { paddingBottom: Platform.OS === 'ios' ? (insets.bottom || 10) : 15 }]}>
//               <View style={styles.inputContainer}>
//                 <TouchableOpacity style={styles.iconBtn}>
//                   <Smile color="#306F6F" size={24} />
//                 </TouchableOpacity>
//                 <TextInput
//                   style={styles.textInput}
//                   placeholder="Ask Zenith AI..."
//                   placeholderTextColor="#A0A0A0"
//                   value={inputText}
//                   onChangeText={setInputText}
//                   multiline
//                 />
//                 <TouchableOpacity style={styles.iconBtn}>
//                   <Paperclip color="#306F6F" size={22} style={{ transform: [{ rotate: '45deg' }] }} />
//                 </TouchableOpacity>
//                 {!inputText && (
//                   <TouchableOpacity style={styles.iconBtn}>
//                     <Camera color="#306F6F" size={22} />
//                   </TouchableOpacity>
//                 )}
//               </View>
              
//               <TouchableOpacity 
//                 style={styles.sendBtn} 
//                 onPress={inputText ? handleSend : undefined}
//                 activeOpacity={0.8}
//               >
//                 {inputText ? (
//                   <Send color="#FFFFFF" size={20} fill="#FFFFFF" />
//                 ) : (
//                   <Mic color="#FFFFFF" size={24} />
//                 )}
//               </TouchableOpacity>
//             </View>
//           </View>
//         </KeyboardAvoidingView>
//       </SafeAreaView>
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '#F7FEFE', // Changed to match chat bg
//   },
//   topBg: {
//     position: 'absolute',
//     top: 0,
//     left: 0,
//     right: 0,
//     height: 150, // Enough for header + safe area
//     backgroundColor: '#306F6F',
//   },
//   safeArea: {
//     flex: 1,
//   },
//   keyboardContainer: {
//     flex: 1,
//   },
//   header: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     paddingHorizontal: 12,
//     paddingVertical: 12,
//     backgroundColor: '#306F6F',
//   },
//   backBtn: {
//     padding: 5,
//   },
//   botInfo: {
//     flex: 1,
//     flexDirection: 'row',
//     alignItems: 'center',
//     marginLeft: 5,
//   },
//   botImgWrapper: {
//     position: 'relative',
//   },
//   botImg: {
//     width: 42,
//     height: 42,
//     borderRadius: 21,
//     backgroundColor: '#FFFFFF',
//     borderWidth: 1,
//     borderColor: '#FFFFFF',
//   },
//   statusDot: {
//     width: 10,
//     height: 10,
//     borderRadius: 5,
//     backgroundColor: '#4ADE80',
//     position: 'absolute',
//     bottom: 2,
//     right: 0,
//     borderWidth: 2,
//     borderColor: '#306F6F',
//   },
//   botText: {
//     marginLeft: 10,
//   },
//   botName: {
//     fontSize: 18,
//     fontWeight: '700',
//     color: '#FFFFFF',
//   },
//   statusText: {
//     fontSize: 13,
//     color: '#E0E8E8',
//     opacity: 0.8,
//   },
//   headerIconBtn: {
//     marginLeft: 15,
//     padding: 5,
//   },
//   chatBackground: {
//     flex: 1,
//     backgroundColor: '#F7FEFE',
//   },
//   chatScroll: {
//     paddingHorizontal: 15,
//     paddingBottom: 20,
//     paddingTop: 10,
//   },
//   dateBadge: {
//     backgroundColor: '#E7F5F5',
//     paddingHorizontal: 16,
//     paddingVertical: 6,
//     borderRadius: 12,
//     alignSelf: 'center',
//     marginVertical: 15,
//   },
//   dateLabel: {
//     fontSize: 12,
//     fontWeight: '700',
//     color: '#306F6F',
//   },
//   messageWrapper: {
//     marginBottom: 12,
//     width: '100%',
//   },
//   botMsgWrapper: {
//     alignItems: 'flex-start',
//   },
//   userMsgWrapper: {
//     alignItems: 'flex-end',
//   },
//   bubble: {
//     paddingHorizontal: 14,
//     paddingVertical: 10,
//     borderRadius: 18,
//     maxWidth: '85%',
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 1 },
//     shadowOpacity: 0.05,
//     shadowRadius: 5,
//     elevation: 1,
//   },
//   botBubble: {
//     backgroundColor: '#FFFFFF',
//     borderTopLeftRadius: 4,
//   },
//   userBubble: {
//     backgroundColor: '#DCF8F8',
//     borderTopRightRadius: 4,
//   },
//   bubbleText: {
//     fontSize: 16,
//     color: '#333333',
//     lineHeight: 23,
//   },
//   timeWrapper: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     justifyContent: 'flex-end',
//     marginTop: 4,
//   },
//   timeText: {
//     fontSize: 11,
//     color: '#717171',
//   },
//   footer: {
//     flexDirection: 'row',
//     alignItems: 'flex-end',
//     paddingHorizontal: 12,
//     paddingVertical: 12,
//     backgroundColor: '#F7FEFE',
//   },
//   inputContainer: {
//     flex: 1,
//     flexDirection: 'row',
//     backgroundColor: '#FFFFFF',
//     borderRadius: 25,
//     minHeight: 52,
//     alignItems: 'center',
//     paddingHorizontal: 10,
//     marginRight: 10,
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.1,
//     shadowRadius: 10,
//     elevation: 3,
//   },
//   textInput: {
//     flex: 1,
//     fontSize: 17,
//     color: '#333333',
//     maxHeight: 120,
//     paddingHorizontal: 12,
//     paddingVertical: 10,
//   },
//   iconBtn: {
//     padding: 8,
//   },
//   sendBtn: {
//     width: 52,
//     height: 52,
//     borderRadius: 26,
//     backgroundColor: '#306F6F',
//     justifyContent: 'center',
//     alignItems: 'center',
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 4 },
//     shadowOpacity: 0.2,
//     shadowRadius: 10,
//     elevation: 5,
//   },
// });
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

const { width } = Dimensions.get('window');

const BOT_IMG =
  'https://img.freepik.com/premium-photo/cute-robot-mascot-isolated-white-background_1034303-316.jpg';

const INITIAL_MESSAGES = [
  { id: '1', sender: 'ai', text: 'Hello! I am your Zenith AI Health Assistant. 🦾\n\nHow can I help you today?', time: '10:00 AM', status: 'read' },
  { id: '2', sender: 'user', text: 'I want to ask about my recent blood test results.', time: '10:01 AM', status: 'read' },
  { id: '3', sender: 'ai', text: 'Of course! I can help you analyze those. Please upload your report or tell me specific values you are concerned about.', time: '10:01 AM', status: 'read' },
];

export const ChatScreen: React.FC = () => {
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();
  const [inputText, setInputText] = useState('');
  const [messages, setMessages] = useState(INITIAL_MESSAGES);
  const [keyboardHeight, setKeyboardHeight] = useState(0);
  const scrollRef = useRef<ScrollView>(null);

  // ✅ Keyboard listener — works on both iOS and Android reliably
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

  const handleSend = () => {
    if (!inputText.trim()) return;
    const newMessage = {
      id: Date.now().toString(),
      sender: 'user',
      text: inputText,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      status: 'sent',
    };
    setMessages(prev => [...prev, newMessage]);
    setInputText('');

    setTimeout(() => {
      const botResponse = {
        id: (Date.now() + 1).toString(),
        sender: 'ai',
        text: "I'm analyzing your request against your medical history. One moment please...",
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        status: 'read',
      };
      setMessages(prev => [...prev, botResponse]);
    }, 1500);
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
            <ArrowLeft color="#FFFFFF" size={24} />
          </TouchableOpacity>
          <View style={styles.botInfo}>
            <View style={styles.botImgWrapper}>
              <Image source={{ uri: BOT_IMG }} style={styles.botImg} />
              <View style={styles.statusDot} />
            </View>
            <View style={styles.botText}>
              <Text style={styles.botName}>Zenith AI Assistant</Text>
              <Text style={styles.statusText}>Always Online</Text>
            </View>
          </View>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <TouchableOpacity style={styles.headerIconBtn}>
              <Zap color="#FFFFFF" size={20} fill="#FFFFFF" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.headerIconBtn}>
              <MoreVertical color="#FFFFFF" size={24} />
            </TouchableOpacity>
          </View>
        </View>

        {/* ✅ Chat area + footer wrapped together, marginBottom = keyboardHeight */}
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
              return (
                <View
                  key={msg.id}
                  style={[
                    styles.messageWrapper,
                    isAI ? styles.botMsgWrapper : styles.userMsgWrapper,
                  ]}
                >
                  <View style={[styles.bubble, isAI ? styles.botBubble : styles.userBubble]}>
                    <Text style={styles.bubbleText}>{msg.text}</Text>
                    <View style={styles.timeWrapper}>
                      <Text style={styles.timeText}>{msg.time}</Text>
                      {!isAI && (
                        <CheckCheck
                          color={msg.status === 'read' ? '#34B7F1' : '#717171'}
                          size={14}
                          style={{ marginLeft: 4 }}
                        />
                      )}
                    </View>
                  </View>
                </View>
              );
            })}
          </ScrollView>

          {/* Input bar — always anchored to bottom, rises with keyboard */}
          <View
            style={[
              styles.footer,
              {
                paddingBottom:
                  keyboardHeight > 0
                    ? 12  // keyboard is up — no extra bottom padding needed
                    : Platform.OS === 'ios'
                    ? insets.bottom || 12
                    : 15,
              },
            ]}
          >
            <View style={styles.inputContainer}>
              <TouchableOpacity style={styles.iconBtn}>
                <Smile color="#306F6F" size={24} />
              </TouchableOpacity>
              <TextInput
                style={styles.textInput}
                placeholder="Ask Zenith AI..."
                placeholderTextColor="#A0A0A0"
                value={inputText}
                onChangeText={setInputText}
                multiline
              />
              <TouchableOpacity style={styles.iconBtn}>
                <Paperclip
                  color="#306F6F"
                  size={22}
                  style={{ transform: [{ rotate: '45deg' }] }}
                />
              </TouchableOpacity>
              {!inputText && (
                <TouchableOpacity style={styles.iconBtn}>
                  <Camera color="#306F6F" size={22} />
                </TouchableOpacity>
              )}
            </View>

            <TouchableOpacity
              style={styles.sendBtn}
              onPress={inputText ? handleSend : undefined}
              activeOpacity={0.8}
            >
              {inputText ? (
                <Send color="#FFFFFF" size={20} fill="#FFFFFF" />
              ) : (
                <Mic color="#FFFFFF" size={24} />
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

  // ✅ This whole block rises via marginBottom = keyboardHeight
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